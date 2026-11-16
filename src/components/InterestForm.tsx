import { useState, type FormEvent } from 'react'
import { ArrowRight, Check, LoaderCircle } from 'lucide-react'

type SubmissionStatus = 'idle' | 'saving' | 'saved' | 'exists' | 'error'

export default function InterestForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState('')
  const [consented, setConsented] = useState(false)
  const [status, setStatus] = useState<SubmissionStatus>('idle')
  const [message, setMessage] = useState('')

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === 'saving') return

    setStatus('saving')
    setMessage('')

    const query = new URLSearchParams(window.location.search)
    const response = await fetch('/api/interest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        consent: consented,
        referrer: document.referrer,
        landingPage: `${window.location.pathname}${window.location.search}`,
        utm_source: query.get('utm_source') ?? '',
        utm_medium: query.get('utm_medium') ?? '',
        utm_campaign: query.get('utm_campaign') ?? '',
        utm_content: query.get('utm_content') ?? '',
        utm_term: query.get('utm_term') ?? '',
      }),
    }).catch(() => null)

    if (!response) {
      setStatus('error')
      setMessage('Could not reach the local email database. Please try again.')
      return
    }

    const result = (await response.json().catch(() => null)) as
      | { added?: boolean; error?: string }
      | null

    if (!response.ok || !result) {
      setStatus('error')
      setMessage(result?.error ?? 'Your email could not be saved. Please try again.')
      return
    }

    setStatus(result.added ? 'saved' : 'exists')
    setEmail('')
    setMessage(
      result.added
        ? 'Your email is saved locally. Kathai can contact you with product and launch updates.'
        : 'That email is already saved locally.',
    )
  }

  const success = status === 'saved' || status === 'exists'

  return (
    <form onSubmit={submit} className={compact ? 'w-full' : 'w-full max-w-xl'}>
      <label htmlFor={`interest-email-${compact ? 'footer' : 'hero'}`} className="sr-only">
        Your email address
      </label>
      <div className="flex flex-col gap-2 rounded-2xl border border-white/15 bg-obsidian/80 p-2 shadow-[0_16px_50px_-24px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:flex-row sm:rounded-full">
        <input
          id={`interest-email-${compact ? 'footer' : 'hero'}`}
          type="email"
          name="email"
          autoComplete="email"
          required
          maxLength={254}
          value={email}
          onChange={(event) => {
            setEmail(event.target.value)
            if (status !== 'idle') {
              setStatus('idle')
              setMessage('')
            }
          }}
          placeholder="Your email address"
          className="min-w-0 flex-1 rounded-xl bg-transparent px-4 py-3 text-sm text-cream placeholder:text-cream/45 focus:outline-none sm:rounded-full sm:px-5"
        />
        <button
          type="submit"
          disabled={status === 'saving' || success}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-light via-gold to-gold-deep px-5 text-sm font-semibold text-obsidian shadow-[0_8px_24px_-14px_rgba(232,199,102,0.9)] transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70 sm:shrink-0 sm:rounded-full"
        >
          {status === 'saving' ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : success ? (
            <Check className="h-4 w-4" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
          {status === 'saving' ? 'Saving…' : success ? 'Saved' : 'Send me the first story'}
        </button>
      </div>

      <label className="mt-3 flex cursor-pointer items-start gap-2 px-1 text-left text-xs leading-relaxed text-cream/55">
        <input
          type="checkbox"
          required
          checked={consented}
          onChange={(event) => setConsented(event.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-[#c59b27]"
        />
        <span>
          I agree that Kathai may email me about its products and launch. This only
          saves my email and referral details—no account is created.
        </span>
      </label>

      <p
        role="status"
        aria-live="polite"
        className={`mt-2 min-h-5 px-1 text-xs ${
          status === 'error'
            ? 'text-rose-300'
            : success
              ? 'text-gold-light'
              : 'text-cream/40'
        }`}
      >
        {message ||
          'Email and campaign source are stored in the local website database.'}
      </p>
    </form>
  )
}
