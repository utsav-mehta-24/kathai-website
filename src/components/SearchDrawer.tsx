import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Search, X } from 'lucide-react'
import { FLAVORS, type Flavor } from '../lib/products'

export default function SearchDrawer({
  open,
  onClose,
  onSelectFlavor,
}: {
  open: boolean
  onClose: () => void
  onSelectFlavor: (flavor: Flavor) => void
}) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const normalizedQuery = query.trim().toLowerCase()
  const results = FLAVORS.filter((flavor) => {
    const searchable = [
      flavor.name,
      flavor.collection,
      ...flavor.composition,
      ...flavor.notes,
      ...flavor.tags,
      flavor.vibe,
      flavor.keyword,
    ]
      .join(' ')
      .toLowerCase()
    return searchable.includes(normalizedQuery)
  })

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close flavour search"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[70] cursor-default bg-obsidian/75 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: '-3rem', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-2rem', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 240, damping: 28 }}
            className="fixed inset-x-0 top-0 z-[80] mx-auto max-w-3xl px-4 pt-4"
            role="dialog"
            aria-modal="true"
            aria-label="Search flavours"
          >
            <div className="glass-strong overflow-hidden rounded-3xl shadow-2xl">
              <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
                <Search className="h-5 w-5 shrink-0 text-gold" />
                <input
                  autoFocus
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search flavours, ingredients or moods"
                  className="min-w-0 flex-1 bg-transparent text-base text-cream placeholder:text-cream/45 focus:outline-none sm:text-lg"
                  aria-label="Search flavours, ingredients or moods"
                />
                <button
                  type="button"
                  onClick={onClose}
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-cream/65 transition-colors hover:bg-white/10 hover:text-cream"
                  aria-label="Close search"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="max-h-[65vh] overflow-y-auto p-3">
                <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-cream/40">
                  {normalizedQuery ? `${results.length} matching flavours` : 'Explore the collection'}
                </p>
                {results.length === 0 ? (
                  <p className="px-3 py-10 text-center text-sm text-cream/60">
                    No flavours match “{query}”. Try an ingredient or a mood.
                  </p>
                ) : (
                  <ul className="space-y-1">
                    {results.map((flavor) => (
                      <li key={flavor.id}>
                        <button
                          type="button"
                          onClick={() => onSelectFlavor(flavor)}
                          className="group flex w-full items-center gap-4 rounded-2xl border border-transparent p-3 text-left transition-all hover:border-gold/20 hover:bg-gold/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-light"
                        >
                          <span
                            aria-hidden="true"
                            className="grid h-12 w-12 shrink-0 place-items-center rounded-xl font-display text-lg text-cream shadow-inner"
                            style={{
                              background: `linear-gradient(135deg, ${flavor.accent2}, ${flavor.accent})`,
                            }}
                          >
                            K
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block font-display text-base text-cream group-hover:text-gold-light">
                              {flavor.name}
                            </span>
                            <span className="mt-0.5 block truncate text-xs text-cream/55">
                              {flavor.collection} · {flavor.composition.join(' · ')}
                            </span>
                          </span>
                          <ArrowRight className="h-4 w-4 shrink-0 text-cream/35 transition-transform group-hover:translate-x-1 group-hover:text-gold-light" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
