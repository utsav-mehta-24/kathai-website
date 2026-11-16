import { mkdirSync } from 'node:fs'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { isIP } from 'node:net'
import { resolve } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'

const MAX_BODY_BYTES = 8192
const ATTRIBUTION_FIELDS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
] as const

function jsonResponse(response: ServerResponse, status: number, body: unknown) {
  response.statusCode = status
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.setHeader('Cache-Control', 'no-store')
  response.end(JSON.stringify(body))
}

function isLocalRequest(address: string | undefined) {
  if (!address) return false
  const ip = address.startsWith('::ffff:') ? address.slice(7) : address
  return isIP(ip) !== 0 && (ip === '127.0.0.1' || ip === '::1')
}

function safeReferrer(value: unknown) {
  if (typeof value !== 'string' || value.length > 2048) return null
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
      ? url.origin
      : null
  } catch {
    return null
  }
}

function safeLandingPage(value: unknown) {
  if (typeof value !== 'string' || value.length > 4096) return null
  try {
    const url = new URL(value, 'http://localhost')
    const attribution = new URLSearchParams()
    for (const field of ATTRIBUTION_FIELDS) {
      const entry = url.searchParams.get(field)
      if (entry) attribution.set(field, entry.slice(0, 200))
    }
    return `${url.pathname.slice(0, 1000)}${attribution.size ? `?${attribution}` : ''}`
  } catch {
    return null
  }
}

async function readJsonBody(request: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = []
  let size = 0

  for await (const chunk of request) {
    const buffer = Buffer.from(chunk)
    size += buffer.byteLength
    if (size > MAX_BODY_BYTES) throw new RangeError('Request body is too large.')
    chunks.push(buffer)
  }

  return JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function localInterestStore(): Plugin {
  return {
    name: 'kathai-local-interest-store',
    configureServer(server) {
      const dataDirectory = resolve(process.cwd(), 'data')
      mkdirSync(dataDirectory, { recursive: true })
      const database = new DatabaseSync(resolve(dataDirectory, 'kathai-interest.sqlite'))

      database.exec(`
        CREATE TABLE IF NOT EXISTS interest (
          id INTEGER PRIMARY KEY,
          email TEXT NOT NULL UNIQUE COLLATE NOCASE,
          created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
          referrer TEXT,
          landing_page TEXT,
          utm_source TEXT,
          utm_medium TEXT,
          utm_campaign TEXT,
          utm_content TEXT,
          utm_term TEXT
        )
      `)

      const addInterest = database.prepare(`
        INSERT OR IGNORE INTO interest (
          email, referrer, landing_page,
          utm_source, utm_medium, utm_campaign, utm_content, utm_term
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `)

      server.middlewares.use('/api/interest', (request, response, next) => {
        if (request.method === 'GET') {
          if (!isLocalRequest(request.socket.remoteAddress)) {
            jsonResponse(response, 403, { error: 'Local access only.' })
            return
          }

          const signups = database
            .prepare(
              `SELECT email, created_at, referrer, landing_page, utm_source,
                      utm_medium, utm_campaign, utm_content, utm_term
               FROM interest ORDER BY created_at DESC`,
            )
            .all()
          jsonResponse(response, 200, { count: signups.length, signups })
          return
        }

        if (request.method !== 'POST') {
          jsonResponse(response, 405, { error: 'Use GET or POST.' })
          return
        }

        if (!request.headers['content-type']?.includes('application/json')) {
          jsonResponse(response, 415, { error: 'Expected a JSON request.' })
          return
        }

        void readJsonBody(request)
          .then((body) => {
            if (!isRecord(body)) {
              jsonResponse(response, 400, { error: 'The request body must be a JSON object.' })
              return
            }

            const email = typeof body.email === 'string'
              ? body.email.trim().toLowerCase()
              : ''
            if (
              email.length > 254 ||
              !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
            ) {
              jsonResponse(response, 400, { error: 'Enter a valid email address.' })
              return
            }
            if (body.consent !== true) {
              jsonResponse(response, 400, { error: 'Email consent is required.' })
              return
            }

            const attribution = ATTRIBUTION_FIELDS.map((field) => {
              const value = body[field]
              return typeof value === 'string' ? value.trim().slice(0, 200) || null : null
            })
            const result = addInterest.run(
              email,
              safeReferrer(body.referrer),
              safeLandingPage(body.landingPage),
              ...attribution,
            )
            jsonResponse(response, 200, { added: result.changes > 0 })
          })
          .catch((error: unknown) => {
            if (error instanceof RangeError) {
              jsonResponse(response, 413, { error: 'The request is too large.' })
              return
            }
            if (error instanceof SyntaxError) {
              jsonResponse(response, 400, { error: 'The request body must be valid JSON.' })
              return
            }
            server.config.logger.error('Could not save local email interest.', {
              error,
            })
            jsonResponse(response, 500, {
              error: 'Your email could not be saved. Please try again.',
            })
          })
      })

      server.httpServer?.once('close', () => database.close())
    },
  }
}

export default defineConfig({
  plugins: [react(), localInterestStore()],
})
