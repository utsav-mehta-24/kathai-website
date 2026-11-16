import { Suspense, lazy } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, ChevronDown } from 'lucide-react'
import MagneticButton from './MagneticButton'
import InterestForm from './InterestForm'

const HeroCanvas = lazy(() => import('./HeroCanvas'))

const ease = [0.22, 1, 0.36, 1] as const

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
}
const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } },
}

export default function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] w-full overflow-hidden bg-obsidian">
      <div
        className="pointer-events-auto absolute -right-[12%] top-[-10%] h-[52%] w-[82%] opacity-60 sm:-right-[18%] sm:top-[-10%] sm:h-[82%] sm:w-[82%] sm:opacity-100 lg:right-[-5%] lg:top-0 lg:h-full lg:w-[67%]"
        aria-hidden="true"
      >
        <Suspense
          fallback={
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_55%_45%,rgba(232,199,102,0.26),transparent_22%),radial-gradient(circle_at_55%_50%,rgba(140,74,50,0.42),transparent_57%)]" />
          }
        >
          <HeroCanvas />
        </Suspense>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_68%_45%,transparent_5%,rgba(11,9,10,0.14)_38%,#0b090a_78%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-obsidian/25" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl items-end px-6 pb-16 pt-[27svh] sm:pt-[32svh] lg:items-center lg:pb-24 lg:pt-28">
        <motion.div variants={container} initial="hidden" animate="show" className="w-full max-w-xl">
          <motion.div variants={item} className="eyebrow mb-6">
            <Sparkles className="h-4 w-4 text-gold" />
            A new story is steeping
          </motion.div>

          <motion.h1
            variants={item}
            className="font-display text-[clamp(2.8rem,8vw,6.5rem)] font-medium leading-[0.95] tracking-tightest text-cream"
          >
            A story,
            <br />
            <span className="text-gold-gradient italic">in a cup.</span>
          </motion.h1>

          <motion.p variants={item} className="mt-6 max-w-lg text-base leading-relaxed text-cream/70 sm:text-lg">
            More than a drink. A pause, a ritual, a moment made yours. Discover
            hot chocolate imagined for comfort, curiosity and the joy of slowing down.
          </motion.p>

          <motion.div variants={item} id="interest-signup" className="mt-7 max-w-lg scroll-mt-24">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold-light">
              Get the first story
            </p>
            <InterestForm />
          </motion.div>

          <motion.div variants={item} className="mt-5 flex flex-wrap items-center gap-3">
            <MagneticButton href="#shop" variant="ghost">
              Discover the flavours <ArrowRight className="h-4 w-4" />
            </MagneticButton>
          </motion.div>
        </motion.div>

        <motion.a
          href="#shop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="absolute bottom-5 left-1/2 -translate-x-1/2 text-cream/55 transition-colors hover:text-gold-light lg:left-auto lg:right-10 lg:translate-x-0"
          aria-label="Scroll to explore"
        >
          <span className="flex flex-col items-center gap-2 text-[9px] uppercase tracking-[0.2em]">
            Scroll to explore
            <ChevronDown className="h-5 w-5 animate-bounce" />
          </span>
        </motion.a>
      </div>

    </section>
  )
}
