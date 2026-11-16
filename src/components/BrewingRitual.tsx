import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ArrowRight } from 'lucide-react'

const BASES = [
  { id: 'oat', label: 'Oat Milk', color: '#C9A77A', note: 'Silky · nutty' },
  { id: 'whole', label: 'Whole Milk', color: '#D9B98C', note: 'Creamy · classic' },
  { id: 'water', label: 'Water', color: '#2E211D', note: 'Pure · intense' },
] as const

const TOPPINGS = [
  { id: 'marshmallow', label: 'Toasted Marshmallow' },
  { id: 'salt', label: 'Sea Salt Flakes' },
  { id: 'cinnamon', label: 'Cinnamon Dust' },
] as const

type BaseId = (typeof BASES)[number]['id']

export default function BrewingRitual() {
  const [base, setBase] = useState<BaseId>('oat')
  const [toppings, setToppings] = useState<Set<string>>(new Set(['marshmallow']))

  const toggle = (id: string) =>
    setToppings((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const activeBase = BASES.find((b) => b.id === base)!

  return (
    <section id="rituals" className="relative scroll-mt-24 py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 max-w-2xl">
          <span className="eyebrow mb-4">
            <span className="h-px w-8 bg-gold/60" /> The Ritual
          </span>
          <h2 className="font-display text-4xl leading-tight tracking-tightest text-cream sm:text-6xl">
            Make the moment <span className="text-gold-gradient italic">your own.</span>
          </h2>
          <p className="mt-5 text-cream/60">
            Play with a few serving ideas and watch the cup change with you.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          {/* live cup */}
          <div className="relative order-2 lg:order-1">
            <div className="relative mx-auto aspect-square w-full max-w-md">
              <div
                className="absolute inset-0 rounded-full opacity-25 blur-3xl transition-colors duration-700"
                style={{ background: activeBase.color }}
              />
              <RitualCup base={activeBase.color} toppings={toppings} />
            </div>
            <p aria-live="polite" className="mt-6 text-center font-display text-xl italic text-cream/80">
              <AnimatePresence mode="wait">
                <motion.span
                  key={base}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeBase.label}
                </motion.span>
              </AnimatePresence>
              {toppings.size > 0 && (
                <span className="text-cream/60">
                  {' '}
                  · {Array.from(toppings)
                    .map((t) => TOPPINGS.find((x) => x.id === t)?.label)
                    .join(', ')}
                </span>
              )}
            </p>
            <p className="mx-auto mt-3 max-w-sm text-center text-xs leading-relaxed text-cream/40">
              Serving inspiration only. Final ingredients and preparation guidance
              will be confirmed before launch.
            </p>
          </div>

          {/* controls */}
          <div className="order-1 space-y-8 lg:order-2">
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-cream/60">
                01 · Your base
              </h3>
              <div
                className="grid grid-cols-1 gap-3 sm:grid-cols-3"
                role="group"
                aria-label="Choose a cup base"
              >
                {BASES.map((b) => {
                  const active = base === b.id
                  return (
                    <button
                      key={b.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setBase(b.id)}
                      className={`relative overflow-hidden rounded-2xl border p-4 text-left transition-all ${
                        active
                          ? 'border-gold/80 bg-gradient-to-br from-gold/20 to-gold/[0.05] shadow-[0_12px_30px_-20px_rgba(232,199,102,0.8)]'
                          : 'border-white/10 bg-white/[0.025] hover:border-white/25 hover:bg-white/[0.05]'
                      }`}
                    >
                      <span
                        className="mb-3 block h-10 w-10 rounded-full"
                        style={{
                          background: `radial-gradient(circle at 35% 30%, #fff6, ${b.color})`,
                          boxShadow: 'inset 0 -4px 8px rgba(0,0,0,0.3)',
                        }}
                      />
                      <span className={`block font-display text-lg ${active ? 'text-gold-light' : 'text-cream'}`}>
                        {b.label}
                      </span>
                      <span className="text-xs text-cream/60">{b.note}</span>
                      <span className={`mt-4 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] ${active ? 'text-gold-light' : 'text-cream/35'}`}>
                        <span className={`grid h-4 w-4 place-items-center rounded-full border ${active ? 'border-gold bg-gold text-obsidian' : 'border-white/25'}`}>
                          {active && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
                        </span>
                        {active ? 'Selected' : 'Choose'}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-cream/60">
                02 · A finishing touch
              </h3>
              <div
                className="flex flex-wrap gap-2.5"
                role="group"
                aria-label="Choose finishing touches"
              >
                {TOPPINGS.map((t) => {
                  const active = toppings.has(t.id)
                  return (
                    <button
                      key={t.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => toggle(t.id)}
                      className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm transition-all ${
                        active
                          ? 'border-gold/75 bg-gradient-to-r from-gold/20 to-gold/[0.07] text-gold-light shadow-[0_8px_24px_-18px_rgba(232,199,102,0.9)]'
                          : 'border-white/10 bg-white/[0.02] text-cream/70 hover:border-white/25 hover:bg-white/[0.05]'
                      }`}
                    >
                      <span
                        className={`grid h-4 w-4 place-items-center rounded-full border ${
                          active ? 'border-gold bg-gold text-obsidian' : 'border-white/30'
                        }`}
                      >
                        {active && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
                      </span>
                      {t.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <a href="#shop" className="btn-primary group">
              Find your flavours
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function RitualCup({ base, toppings }: { base: string; toppings: Set<string> }) {
  return (
    <div className="relative h-full w-full">
      {/* steam */}
      <div className="absolute left-1/2 top-6 flex -translate-x-1/2 gap-3">
        {[0, 0.6, 1.2].map((d) => (
          <span
            key={d}
            className="block h-20 w-1.5 rounded-full bg-white/25 blur-[3px] animate-steam"
            style={{ animationDelay: `${d}s` }}
          />
        ))}
      </div>
      {/* saucer shadow */}
      <div className="absolute bottom-6 left-1/2 h-5 w-56 -translate-x-1/2 rounded-full bg-black/50 blur-xl" />
      {/* saucer */}
      <div className="absolute bottom-4 left-1/2 h-6 w-60 -translate-x-1/2 rounded-full bg-gradient-to-b from-cream/20 to-transparent" />
      {/* cup body */}
      <div className="absolute bottom-10 left-1/2 h-44 w-48 -translate-x-1/2 rounded-b-[4rem] rounded-t-2xl bg-gradient-to-b from-cream/90 to-cream/70 shadow-[inset_0_-12px_24px_rgba(0,0,0,0.18),0_16px_40px_rgba(0,0,0,0.5)]" />
      {/* rim */}
      <div className="absolute left-1/2 top-[7.5rem] h-3 w-48 -translate-x-1/2 rounded-full bg-cream shadow-[inset_0_2px_6px_rgba(0,0,0,0.2)]" />
      {/* liquid */}
      <motion.div
        className="absolute left-1/2 top-[8rem] h-10 w-40 -translate-x-1/2 overflow-hidden rounded-full"
        animate={{ backgroundColor: base }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_20%,rgba(255,255,255,0.35),transparent_55%)]" />
      </motion.div>

      {/* toppings */}
      <AnimatePresence>
        {toppings.has('marshmallow') && (
          <motion.div
            key="marshmallow"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-1/2 top-[8rem] flex -translate-x-1/2 gap-2"
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="block h-4 w-5 rounded-full bg-gradient-to-b from-cream to-cream/70 shadow-sm"
                style={{ marginTop: i % 2 ? 4 : 0 }}
              />
            ))}
          </motion.div>
        )}
        {toppings.has('salt') && (
          <motion.div
            key="salt"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute left-1/2 top-[8.2rem] h-2 w-40 -translate-x-1/2"
          >
            {[...Array(14)].map((_, i) => (
              <span
                key={i}
                className="absolute h-0.5 w-0.5 rounded-full bg-white"
                style={{ left: `${(i * 7) % 100}%`, top: `${(i * 13) % 4}px` }}
              />
            ))}
          </motion.div>
        )}
        {toppings.has('cinnamon') && (
          <motion.div
            key="cinnamon"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute left-1/2 top-[8.1rem] h-3 w-44 -translate-x-1/2"
          >
            {[...Array(18)].map((_, i) => (
              <span
                key={i}
                className="absolute h-1 w-1 rotate-45 rounded-[1px] bg-[#7A4A2A]"
                style={{ left: `${(i * 11) % 100}%`, top: `${(i * 7) % 6}px`, opacity: 0.7 }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* handle */}
      <div className="absolute bottom-16 right-6 h-16 w-12 rounded-full border-[5px] border-cream/80" />
    </div>
  )
}
