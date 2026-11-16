import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const STEPS = [
  {
    n: '01',
    title: 'Comfort',
    body: 'A moment to slow down. The first warm sip, the weight of the mug in your hands, the day softening at the edges.',
    accent: '#B2674A',
  },
  {
    n: '02',
    title: 'Curiosity',
    body: 'Something new to discover. Familiar chocolate, unexpected pairings — a flavour you hadn\u2019t imagined, until now.',
    accent: '#E8C766',
  },
  {
    n: '03',
    title: 'Connection',
    body: 'A reason to gather and share. Two cups, one conversation, the kind of pause that turns into a memory.',
    accent: '#C59B27',
  },
  {
    n: '04',
    title: 'Belonging',
    body: 'A ritual to make your own. The flavour you return to, the cup that marks your morning, your monsoon, your moment.',
    accent: '#8C4A32',
  },
]

export default function SensoryScroll() {
  const root = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const scenes = useRef<(HTMLDivElement | null)[]>([])
  const [activeStep, setActiveStep] = useState(0)

  const [reduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    if (reduced || !stage.current) return
    const ctx = gsap.context(() => {
      const s = scenes.current.filter(Boolean) as HTMLDivElement[]
      const stepSpan = 2.25
      const firstFadeOut = 0.75
      const fadeOutDuration = 0.58
      const fadeInOffset = 0.76
      const fadeInDuration = 0.72
      const backgroundColors = ['#211713', '#241d13', '#1d1814', '#211511']

      gsap.set(stage.current, { backgroundColor: backgroundColors[0] })
      gsap.set(s[0], { autoAlpha: 1, y: 0 })
      s.slice(1).forEach((el) => gsap.set(el, { autoAlpha: 0, y: 22 }))

      const tl = gsap.timeline({
        defaults: { ease: 'power1.inOut' },
        scrollTrigger: {
          trigger: stage.current,
          start: 'top top',
          end: () => '+=' + window.innerHeight * 8.2,
          scrub: true,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      STEPS.slice(0, -1).forEach((_, index) => {
        const transitionStart = firstFadeOut + index * stepSpan
        const nextStepStart = transitionStart + fadeInOffset

        tl.to(
          s[index],
          {
            autoAlpha: 0,
            y: -16,
            duration: fadeOutDuration,
            ease: 'power2.in',
          },
          transitionStart,
        )
          .to(
            stage.current,
            {
              backgroundColor: backgroundColors[index + 1],
              duration: fadeInDuration,
              ease: 'none',
            },
            nextStepStart,
          )
          .to(
            s[index + 1],
            {
              autoAlpha: 1,
              y: 0,
              duration: fadeInDuration,
              ease: 'power2.out',
            },
            nextStepStart,
          )
      })

      tl.to({}, { duration: 1.47 })

      let lastActiveStep = -1
      tl.eventCallback('onUpdate', () => {
        const time = tl.time()
        const nextIndex = Math.min(
          STEPS.length - 1,
          Math.max(0, Math.floor((time - (firstFadeOut + fadeOutDuration + 0.18)) / stepSpan) + 1),
        )
        if (nextIndex !== lastActiveStep) {
          lastActiveStep = nextIndex
          setActiveStep(nextIndex)
        }
      })
    }, root)

    return () => ctx.revert()
  }, [reduced])

  // Reduced-motion fallback: four territories as a normal stacked column (no pin, no scrub).
  if (reduced) {
    return (
      <section id="moods" ref={root} className="relative scroll-mt-24 py-24">
        {STEPS.map((step, i) => (
          <div key={step.n} className="mx-auto max-w-7xl px-6 py-16">
            <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
              <div className="order-2 md:order-1">
                <span
                  className="font-display text-7xl font-medium leading-none opacity-30"
                  style={{ color: step.accent }}
                >
                  {step.n}
                </span>
                <h3 className="mt-2 font-display text-5xl tracking-tightest text-cream sm:text-6xl">
                  {step.title}
                </h3>
                <p className="mt-5 max-w-md text-lg leading-relaxed text-cream/75">{step.body}</p>
                <div className="mt-6 h-px w-24" style={{ background: step.accent }} />
              </div>
              <div className="order-1 md:order-2">
                <SceneArt index={i} accent={step.accent} />
              </div>
            </div>
          </div>
        ))}
      </section>
    )
  }

  return (
    <section id="moods" ref={root} className="relative scroll-mt-24">
      {/* pinned stage */}
      <div ref={stage} className="relative h-screen w-full overflow-hidden">
        {/* vignette for legibility across all hues */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.55))]" />

        {STEPS.map((step, i) => (
          <div
            key={step.n}
            ref={(el) => {
              scenes.current[i] = el
            }}
            aria-hidden={activeStep !== i}
            className="absolute inset-0 flex items-center"
          >
            <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-6 md:grid-cols-2">
              {/* text */}
              <div className="order-2 md:order-1">
                <span
                  className="font-display text-7xl font-medium leading-none opacity-30"
                  style={{ color: step.accent }}
                >
                  {step.n}
                </span>
                <h3 className="mt-2 font-display text-5xl tracking-tightest text-cream sm:text-7xl">
                  {step.title}
                </h3>
                <p className="mt-5 max-w-md text-lg leading-relaxed text-cream/75">{step.body}</p>
                <div className="mt-6 h-px w-24" style={{ background: step.accent }} />
              </div>

              {/* scene art */}
              <div className="order-1 md:order-2">
                <SceneArt index={i} accent={step.accent} />
              </div>
            </div>
          </div>
        ))}

        <div className="absolute inset-x-6 bottom-7 z-20 flex items-center justify-between gap-5 md:bottom-9 md:left-auto md:right-10 md:w-72">
          <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.2em] text-cream/65">
            {STEPS[activeStep].n}
            <span className="px-1 text-cream/35">/</span>
            {STEPS.length.toString().padStart(2, '0')}
          </span>
          <div
            className="flex flex-1 items-center gap-2"
            role="progressbar"
            aria-label="Story chapters"
            aria-valuemin={1}
            aria-valuemax={STEPS.length}
            aria-valuenow={activeStep + 1}
          >
            {STEPS.map((step, index) => (
              <span
                key={step.n}
                className="h-1 flex-1 overflow-hidden rounded-full bg-cream/20"
              >
                <span
                  className="block h-full rounded-full transition-[width,background-color] duration-300"
                  style={{
                    width: index <= activeStep ? '100%' : '0%',
                    backgroundColor: index <= activeStep ? step.accent : 'transparent',
                  }}
                />
              </span>
            ))}
          </div>
          <span className="hidden min-w-20 text-right text-[10px] uppercase tracking-[0.16em] text-cream/45 sm:block">
            {STEPS[activeStep].title}
          </span>
        </div>
      </div>
    </section>
  )
}

function SceneArt({ index, accent }: { index: number; accent: string }) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      <div
        className="absolute inset-0 rounded-full blur-3xl opacity-40"
        style={{ background: accent }}
      />
      {index === 0 && (
        // 01 Comfort — a softly glowing cup radiating concentric warm rings
        <svg viewBox="0 0 200 200" aria-hidden="true" className="relative h-full w-full">
          {[48, 70, 92].map((r, i) => (
            <circle key={r} cx="100" cy="100" r={r} fill="none" stroke={accent} strokeWidth="1.5" opacity={0.16 - i * 0.04} />
          ))}
          <path d="M68 100 Q68 150 100 150 Q132 150 132 100 Z" fill="#1a1310" opacity="0.9" />
          <ellipse cx="100" cy="100" rx="32" ry="9" fill={accent} opacity="0.9" />
          <path d="M90 74 Q94 88 88 98" stroke="#F5F3F0" strokeWidth="3" fill="none" opacity="0.5" strokeLinecap="round" />
          <path d="M106 74 Q110 88 116 98" stroke="#F5F3F0" strokeWidth="3" fill="none" opacity="0.5" strokeLinecap="round" />
          <path d="M132 112 Q152 116 138 138" stroke={accent} strokeWidth="4" fill="none" opacity="0.8" strokeLinecap="round" />
        </svg>
      )}
      {index === 1 && (
        // 02 Curiosity — layered, unfolding translucent arcs (something opening up)
        <svg viewBox="0 0 200 200" aria-hidden="true" className="relative h-full w-full">
          {[34, 50, 66, 82].map((r, i) => (
            <path
              key={r}
              d={`M${100 - r} 100 A ${r} ${r} 0 0 1 ${100 + r} 100`}
              fill="none"
              stroke={accent}
              strokeWidth="6"
              opacity={0.2 + i * 0.16}
              strokeLinecap="round"
            />
          ))}
        </svg>
      )}
      {index === 2 && (
        // 03 Connection — two overlapping warm circles (two cups, a shared pause)
        <svg viewBox="0 0 200 200" aria-hidden="true" className="relative h-full w-full">
          <circle cx="78" cy="100" r="46" fill={accent} opacity="0.32" />
          <circle cx="122" cy="100" r="46" fill={accent} opacity="0.32" />
          <circle cx="78" cy="100" r="46" fill="none" stroke={accent} strokeWidth="2.5" opacity="0.85" />
          <circle cx="122" cy="100" r="46" fill="none" stroke={accent} strokeWidth="2.5" opacity="0.85" />
        </svg>
      )}
      {index === 3 && (
        // 04 Belonging — a single cup with a recurring mark, repeated in a ring (ritual, return)
        <svg viewBox="0 0 200 200" aria-hidden="true" className="relative h-full w-full">
          {[...Array(8)].map((_, i) => {
            const a = (i / 8) * Math.PI * 2 - Math.PI / 2
            const x = 100 + Math.cos(a) * 68
            const y = 100 + Math.sin(a) * 68
            return <circle key={i} cx={x} cy={y} r="5" fill={accent} opacity="0.7" />
          })}
          <path d="M80 96 Q80 140 100 140 Q120 140 120 96 Z" fill="#1a1310" opacity="0.9" />
          <ellipse cx="100" cy="96" rx="20" ry="6" fill={accent} opacity="0.9" />
        </svg>
      )}
    </div>
  )
}
