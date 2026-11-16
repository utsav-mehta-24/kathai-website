import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { FLAVORS, type Collection, type Flavor } from '../lib/products'
import ProductVisual from './ProductVisual'
import TiltCard from './TiltCard'

const COLLECTIONS: { id: Collection | 'ALL'; label: string; note: string }[] = [
  { id: 'ALL', label: 'All flavours', note: 'The full collection' },
  { id: 'KLASSICS', label: 'KLASSICS', note: 'Familiar comfort' },
  { id: 'MOOD MELT', label: 'MOOD MELT', note: 'Unexpected pairings' },
  { id: 'MACROMELT', label: 'MACROMELT', note: 'A new kind of ritual' },
]

const DESCRIPTORS: Record<Collection, string> = {
  KLASSICS: 'Familiar favourites, made for the moments that call for comfort.',
  'MOOD MELT': 'Unexpected pairings for curious palates and changing moods.',
  MACROMELT: 'A chocolate-led concept in development. Formulation details are still being confirmed.',
}

export default function FlavorMatrix({
  activeCollection,
  onCollectionChange,
}: {
  activeCollection: Collection | 'ALL'
  onCollectionChange: (collection: Collection | 'ALL') => void
}) {
  const [expandedFlavor, setExpandedFlavor] = useState<string | null>(null)

  const visibleCollections = COLLECTIONS.filter(
    ({ id }) => id !== 'ALL' && (activeCollection === 'ALL' || activeCollection === id),
  ).map(({ id }) => id as Collection)

  return (
    <section id="shop" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 max-w-3xl">
          <span className="eyebrow mb-4">
            <span className="h-px w-8 bg-gold/60" /> Explore the collection
          </span>
          <h2 className="font-display text-4xl leading-tight tracking-tightest text-cream sm:text-6xl">
            A flavour for <span className="text-gold-gradient italic">every mood.</span>
          </h2>
          <p className="mt-5 max-w-2xl leading-relaxed text-cream/65">
            Three collections, thirteen flavour concepts. Start with a familiar
            favourite or follow your curiosity. Product visuals are illustrative;
            final recipes and availability are still in development.
          </p>
        </div>

        <div
          className="mb-12 grid grid-cols-2 gap-2 rounded-3xl border border-white/10 bg-white/[0.025] p-2 sm:grid-cols-4"
          role="group"
          aria-label="Filter flavours by collection"
        >
          {COLLECTIONS.map((collection) => {
            const selected = activeCollection === collection.id
            const count =
              collection.id === 'ALL'
                ? FLAVORS.length
                : FLAVORS.filter((flavor) => flavor.collection === collection.id).length

            return (
              <button
                key={collection.id}
                type="button"
                aria-pressed={selected}
                onClick={() => {
                  setExpandedFlavor(null)
                  onCollectionChange(collection.id)
                }}
                className={`group relative min-h-20 rounded-2xl border px-4 py-3 text-left transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-light ${
                  selected
                    ? 'border-gold/70 bg-gradient-to-br from-gold/20 to-gold/[0.06] shadow-[0_8px_28px_-18px_rgba(232,199,102,0.8)]'
                    : 'border-transparent bg-transparent hover:border-white/15 hover:bg-white/[0.04]'
                }`}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className={`font-semibold ${selected ? 'text-gold-light' : 'text-cream'}`}>
                    {collection.label}
                  </span>
                  <span
                    className={`grid h-6 min-w-6 place-items-center rounded-full px-1.5 text-xs ${
                      selected
                        ? 'bg-gold text-obsidian'
                        : 'bg-white/[0.07] text-cream/55'
                    }`}
                  >
                    {count}
                  </span>
                </span>
                <span className="mt-1 block text-xs text-cream/55">{collection.note}</span>
              </button>
            )
          })}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeCollection}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {visibleCollections.map((collection, groupIndex) => {
              const flavors = FLAVORS.filter((flavor) => flavor.collection === collection)

              return (
                <section key={collection} className="mb-14 last:mb-0">
                  <div className="mb-6 flex flex-col gap-2 border-b border-white/10 pb-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="eyebrow">{collection}</p>
                      <p className="mt-2 text-sm text-cream/60">{DESCRIPTORS[collection]}</p>
                    </div>
                    <span className="text-xs uppercase tracking-[0.18em] text-cream/40">
                      {flavors.length} flavour{flavors.length === 1 ? '' : 's'}
                    </span>
                  </div>

                  <div className="grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {flavors.map((flavor, index) => (
                      <FlavorCard
                        key={flavor.id}
                        flavor={flavor}
                        index={groupIndex * 5 + index}
                        expanded={expandedFlavor === flavor.id}
                        onOpen={() => setExpandedFlavor(flavor.id)}
                        onClose={() =>
                          setExpandedFlavor((current) =>
                            current === flavor.id ? null : current,
                          )
                        }
                        onToggle={() =>
                          setExpandedFlavor((current) =>
                            current === flavor.id ? null : flavor.id,
                          )
                        }
                      />
                    ))}
                  </div>
                </section>
              )
            })}
          </motion.div>
        </AnimatePresence>

        <p className="mt-10 text-center text-xs leading-relaxed text-cream/40">
          Flavour notes describe the intended experience; final ingredients, allergens,
          serving guidance and launch details will be confirmed before release.
        </p>
      </div>
    </section>
  )
}

function Meter({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-cream/60">{label}</span>
      <span className="flex items-center gap-1" aria-label={`${value} out of 5`}>
        {[1, 2, 3, 4, 5].map((number) => (
          <span
            key={number}
            aria-hidden="true"
            className="h-1.5 w-4 rounded-full"
            style={{
              backgroundColor:
                number <= value ? color : 'rgba(245, 243, 240, 0.16)',
            }}
          />
        ))}
      </span>
    </div>
  )
}

function FlavorCard({
  flavor,
  index,
  expanded,
  onOpen,
  onClose,
  onToggle,
}: {
  flavor: Flavor
  index: number
  expanded: boolean
  onOpen: () => void
  onClose: () => void
  onToggle: () => void
}) {
  const [hovering, setHovering] = useState(false)
  const openTimer = useRef<number | null>(null)
  const closeTimer = useRef<number | null>(null)
  const visualId = `flavor-details-${flavor.id}`

  const clearTimer = (timer: { current: number | null }) => {
    if (timer.current === null) return
    window.clearTimeout(timer.current)
    timer.current = null
  }

  const handleMouseEnter = () => {
    setHovering(true)
    clearTimer(closeTimer)
    if (expanded || openTimer.current !== null) return

    openTimer.current = window.setTimeout(() => {
      openTimer.current = null
      onOpen()
    }, 500)
  }

  const handleMouseLeave = () => {
    setHovering(false)
    clearTimer(openTimer)

    if (expanded && closeTimer.current === null) {
      closeTimer.current = window.setTimeout(() => {
        closeTimer.current = null
        onClose()
      }, 500)
    }
  }

  useEffect(
    () => () => {
      clearTimer(openTimer)
      clearTimer(closeTimer)
    },
    [],
  )

  return (
    <motion.div
      id={`flavor-${flavor.id}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.06 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="scroll-mt-28"
    >
      <TiltCard>
        <article
          className={`flex flex-col overflow-hidden rounded-3xl border bg-truffle/70 transition-colors duration-300 ${
            expanded ? 'border-gold/45' : 'border-white/10'
          }`}
        >
          <motion.div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 z-20 h-1 origin-left bg-gold-light shadow-[0_0_14px_rgba(232,199,102,0.8)]"
            initial={false}
            animate={{ scaleX: hovering ? 1 : 0 }}
            transition={{ duration: 0.5, ease: 'linear' }}
          />
          <div
            className="relative h-52 overflow-hidden"
            style={{
              background: `radial-gradient(120% 90% at 50% 0%, ${flavor.accent}55, transparent 75%)`,
            }}
          >
            <span className="absolute left-4 top-4 z-10 rounded-full border border-white/10 bg-obsidian/55 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-cream/60 backdrop-blur">
              Visual concept
            </span>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,#000,transparent_60%)] opacity-40" />
            <ProductVisual flavor={flavor} view={expanded ? 'cup' : 'tin'} />
          </div>

          <div className="flex flex-1 flex-col p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-gold-light/75">
                  {flavor.collection}
                </p>
                <h3 className="mt-1 font-display text-xl leading-tight text-cream">
                  {flavor.name}
                </h3>
              </div>
              {flavor.badge && (
                <span className="shrink-0 rounded-full border border-gold/25 bg-gold/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-gold-light">
                  {flavor.badge}
                </span>
              )}
            </div>

            <p className="mt-3 text-xs uppercase leading-relaxed tracking-wider text-cream/50">
              {flavor.composition.join(' · ')}
            </p>
            <p className="mt-3 font-display text-lg italic text-cream/80">{flavor.vibe}</p>

            <div className="mt-4">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-cream/45">
                Tasting notes
              </p>
              <div className="flex flex-wrap gap-1.5">
              {flavor.notes.map((note) => (
                <span
                  key={note}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-cream/65"
                >
                  {note}
                </span>
              ))}
              </div>
            </div>

            <motion.div
              id={visualId}
              initial={false}
              animate={{
                height: expanded ? 'auto' : 0,
                opacity: expanded ? 1 : 0,
                clipPath: expanded ? 'inset(0% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)',
                y: expanded ? 0 : -8,
              }}
              transition={{
                height: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
                opacity: { duration: 0.4, ease: 'easeOut' },
                clipPath: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
                y: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
              }}
              aria-hidden={!expanded}
              className="overflow-hidden"
            >
              <div className="mt-4 border-t border-white/10 pt-4">
                <p className="text-sm leading-relaxed text-cream/70">
                  {flavor.description}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-2">
                  <Meter label="Intensity" value={flavor.intensity} color={flavor.accent2} />
                  <Meter label="Sweetness" value={flavor.sweetness} color={flavor.accent2} />
                </div>
                <p className="mt-4 text-xs leading-relaxed text-cream/50">
                  <span className="text-cream/70">A moment for: </span>
                  {flavor.bestMoment}
                  <span aria-hidden="true"> · </span>
                  {flavor.serveIt}
                </p>
                {flavor.id === 'macro-melt' && (
                  <p className="mt-3 text-xs leading-relaxed text-gold-light/80">
                    Formulation and nutrition details are not final.
                  </p>
                )}
              </div>
            </motion.div>

            <button
              type="button"
              onClick={onToggle}
              aria-expanded={expanded}
              aria-controls={visualId}
              className={`mt-5 inline-flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-light ${
                expanded
                  ? 'border-gold/50 bg-gold/10 text-gold-light'
                  : 'border-white/10 bg-white/[0.025] text-cream/75 hover:border-gold/35 hover:bg-gold/[0.06] hover:text-gold-light'
              }`}
            >
              {expanded ? 'Close flavour profile' : 'View full flavour profile'}
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>
        </article>
      </TiltCard>
    </motion.div>
  )
}
