import { motion } from 'framer-motion'
import type { Flavor } from '../lib/products'

interface ProductVisualProps {
  flavor: Flavor
  /** 'tin' = sealed canister, 'cup' = steaming pour */
  view: 'tin' | 'cup'
}

/**
 * Fully self-contained CSS product art — no image assets.
 * A gold-foil canister cross-fades into a steaming cup on hover.
 */
export default function ProductVisual({ flavor, view }: ProductVisualProps) {
  return (
    <div className="relative h-full w-full">
      {/* TIN */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ opacity: view === 'tin' ? 1 : 0, scale: view === 'tin' ? 1 : 0.94 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <Tin flavor={flavor} />
      </motion.div>

      {/* CUP */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ opacity: view === 'cup' ? 1 : 0, scale: view === 'cup' ? 1 : 0.94 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <Cup flavor={flavor} steam={view === 'cup'} />
      </motion.div>
    </div>
  )
}

function Tin({ flavor }: { flavor: Flavor }) {
  return (
    <div className="relative h-48 w-36 perspective">
      {/* shadow */}
      <div className="absolute -bottom-2 left-1/2 h-5 w-28 -translate-x-1/2 rounded-full bg-black/50 blur-xl" />
      {/* lid */}
      <div
        className="absolute left-1/2 top-2 h-6 w-32 -translate-x-1/2 rounded-t-2xl"
        style={{
          background: `linear-gradient(180deg, ${flavor.accent2}, ${flavor.accent})`,
          boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.35), inset 0 -4px 8px rgba(0,0,0,0.4)',
        }}
      />
      <div className="absolute left-1/2 top-4 h-1.5 w-36 -translate-x-1/2 rounded-full bg-black/30" />
      {/* body */}
      <div
        className="absolute left-1/2 top-7 h-44 w-32 -translate-x-1/2 overflow-hidden rounded-b-3xl rounded-t-md"
        style={{
          background: `linear-gradient(150deg, ${flavor.accent} 0%, #1a1310 60%, #0b090a 100%)`,
          boxShadow: 'inset 0 0 30px rgba(0,0,0,0.6), inset 8px 0 16px rgba(0,0,0,0.5)',
        }}
      >
        {/* foil label */}
        <div className="absolute inset-x-3 top-10 bottom-10 rounded-md border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent px-3 py-4">
          <div
            className="mx-auto mb-2 h-px w-10"
            style={{ background: flavor.accent2 }}
          />
          <div
            className="text-center font-display text-[13px] leading-tight text-cream"
            style={{ textShadow: '0 1px 6px rgba(0,0,0,0.8)' }}
          >
            {flavor.name}
          </div>
          <div className="mt-2 text-center text-[8px] uppercase tracking-[0.25em] text-cream/50">
            {flavor.collection}
          </div>
          <div
            className="mx-auto mt-3 h-6 w-6 rounded-full border"
            style={{ borderColor: flavor.accent2, background: `${flavor.accent2}22` }}
          />
        </div>
        {/* highlight */}
        <div className="absolute left-0 top-0 h-full w-1/4 bg-gradient-to-r from-white/10 to-transparent" />
      </div>
    </div>
  )
}

function Cup({ flavor, steam }: { flavor: Flavor; steam: boolean }) {
  return (
    <div className="relative h-48 w-44">
      {/* steam */}
      {steam && (
        <div className="absolute left-1/2 top-2 flex -translate-x-1/2 gap-2">
          {[0, 0.5, 1].map((d) => (
            <span
              key={d}
              className="block h-16 w-1 rounded-full bg-white/30 blur-[3px] animate-steam"
              style={{ animationDelay: `${d}s` }}
            />
          ))}
        </div>
      )}
      {/* shadow */}
      <div className="absolute -bottom-1 left-1/2 h-4 w-32 -translate-x-1/2 rounded-full bg-black/50 blur-xl" />
      {/* saucer */}
      <div className="absolute bottom-0 left-1/2 h-4 w-40 -translate-x-1/2 rounded-full bg-gradient-to-b from-white/10 to-white/0" />
      {/* cup body */}
      <div className="absolute bottom-2 left-1/2 h-24 w-28 -translate-x-1/2 rounded-b-[2.5rem] rounded-t-2xl bg-gradient-to-b from-cream/90 to-cream/70 shadow-[inset_0_-8px_16px_rgba(0,0,0,0.15),0_10px_30px_rgba(0,0,0,0.5)]" />
      {/* liquid */}
      <div
        className="absolute left-1/2 top-8 h-7 w-24 -translate-x-1/2 overflow-hidden rounded-full"
        style={{
          background: `radial-gradient(circle at 40% 20%, ${flavor.accent2}aa, ${flavor.accent} 70%, #1a1310 100%)`,
        }}
      >
        <div className="absolute inset-0 opacity-60 mix-blend-screen bg-[radial-gradient(circle_at_60%_30%,rgba(255,255,255,0.4),transparent_50%)]" />
      </div>
      {/* handle */}
      <div className="absolute bottom-9 right-2 h-12 w-8 rounded-full border-4 border-cream/80" />
      {/* rim */}
      <div className="absolute left-1/2 top-7 h-2 w-24 -translate-x-1/2 rounded-full bg-cream shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]" />
    </div>
  )
}
