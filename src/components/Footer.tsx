import { ArrowRight } from 'lucide-react'
import InterestForm from './InterestForm'

const PROMISES = [
  {
    title: 'Craft over commodity',
    description:
      'A flavour-led point of view, thoughtful pairings and a little room for surprise.',
  },
  {
    title: 'Discovery, always',
    description:
      'Familiar favourites sit beside new combinations. There is no single way to Kathai.',
  },
  {
    title: 'Moments, not transactions',
    description:
      'A cup can be a pause, a ritual, a shared moment—or simply something delicious.',
  },
]

export default function Footer() {
  return (
    <>
      <section id="promise" className="relative scroll-mt-24 border-t border-white/10 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10">
            <span className="eyebrow">Our point of view</span>
          </div>
          <div className="grid gap-8 md:grid-cols-3 md:gap-10">
            {PROMISES.map((promise, index) => (
              <article
                key={promise.title}
                className="border-t border-gold/25 pt-5"
              >
                <span className="font-display text-sm text-gold-light/70">
                  0{index + 1}
                </span>
                <h3 className="mt-3 font-display text-xl text-cream">
                  {promise.title}
                </h3>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-cream/60">
                  {promise.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="relative overflow-hidden border-t border-white/10 bg-obsidian">
        <div className="pointer-events-none absolute -right-20 -top-32 h-96 w-96 rounded-full bg-gold/[0.06] blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 pb-8 pt-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.85fr]">
            <div className="max-w-2xl">
              <span className="eyebrow mb-4">The first story starts here</span>
              <h2 className="font-display text-4xl leading-tight tracking-tightest text-cream sm:text-5xl">
                Stay for <span className="text-gold-gradient italic">the story.</span>
              </h2>
              <p className="mt-4 max-w-xl leading-relaxed text-cream/60">
                Leave your email if you’d like Kathai to contact you with product
                and launch updates. No account, password or checkout—just an
                email address and your consent.
              </p>
            </div>
            <InterestForm compact />
          </div>

          <div className="mt-16 flex flex-col items-center justify-between gap-5 border-t border-white/10 pt-8 text-center sm:flex-row sm:text-left">
            <div>
              <p className="font-display text-xl text-cream">Kathai</p>
              <p className="mt-1 text-sm text-cream/45">
                © {new Date().getFullYear()} Kathai · Crafted for your moments.
              </p>
            </div>
            <a
              href="#top"
              className="inline-flex items-center gap-2 text-sm text-cream/55 transition-colors hover:text-gold-light"
            >
              Start the story again
              <ArrowRight className="-rotate-90 h-4 w-4" />
            </a>
          </div>
        </div>
      </footer>
    </>
  )
}
