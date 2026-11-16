import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Menu, X, Mail } from 'lucide-react'
import { cn } from '../lib/utils'

const LINKS = [
  { label: 'Flavours', href: '#shop' },
  { label: 'Moods', href: '#moods' },
  { label: 'Ritual', href: '#rituals' },
  { label: 'Promise', href: '#promise' },
]

export default function Navbar({ onSearch }: { onSearch: () => void }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500',
        scrolled ? 'py-2' : 'py-4',
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <nav
          className={cn(
            'flex items-center justify-between rounded-full px-4 py-2.5 transition-all duration-500',
            scrolled ? 'glass-strong shadow-[0_8px_40px_-12px_rgba(0,0,0,0.8)]' : 'border border-transparent',
          )}
        >
          {/* Brand */}
          <a href="#top" className="group relative flex items-center gap-2" aria-label="Kathai home">
            <span className="relative grid h-9 w-9 place-items-center">
              <span className="absolute inset-0 rounded-full bg-gold/30 blur-md transition-opacity duration-500 group-hover:bg-gold/60" />
              <span className="relative grid h-9 w-9 place-items-center rounded-full border border-gold/40 bg-obsidian/60 font-display text-lg text-gold-light">
                K
              </span>
            </span>
            <span className="brand-shimmer font-display text-xl tracking-tight">Kathai</span>
          </a>

          {/* Desktop links */}
          <ul className="hidden items-center gap-8 md:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="group relative text-sm font-medium text-cream/80 transition-colors hover:text-cream"
                >
                  {l.label}
                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full" />
                </a>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            <a
              href="#interest-signup"
              aria-label="Get the first story by email"
              className="inline-flex h-10 items-center gap-2 rounded-full border border-gold/45 bg-gold/10 px-3 text-xs font-semibold text-gold-light transition-all hover:border-gold hover:bg-gold/20 sm:px-4 sm:text-sm"
            >
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">Get the first story</span>
              <span className="sm:hidden">Email</span>
            </a>

            <button
              onClick={onSearch}
              className="grid h-10 w-10 place-items-center rounded-full text-cream/80 transition-colors hover:bg-white/10 hover:text-cream"
              aria-label="Search"
            >
              <Search className="h-[18px] w-[18px]" />
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-full text-cream/80 transition-colors hover:bg-white/10 md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile sheet */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-obsidian/80 backdrop-blur-xl md:hidden"
          >
            <div className="flex items-center justify-between px-6 py-5">
              <span className="brand-shimmer font-display text-2xl">Kathai</span>
              <button
                onClick={() => setMenuOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-cream"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <motion.ul
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
              }}
              className="mt-8 space-y-2 px-6"
            >
              {LINKS.map((l) => (
                <motion.li
                  key={l.href}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 },
                  }}
                >
                  <a
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    className="block border-b border-white/10 py-4 font-display text-3xl text-cream"
                  >
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
