import { useRef, type ReactNode, type MouseEvent } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { cn } from '../lib/utils'

interface MagneticButtonProps {
  children: ReactNode
  variant?: 'primary' | 'ghost'
  strength?: number
  className?: string
  href?: string
  onClick?: () => void
  type?: 'button' | 'submit'
  ariaLabel?: string
}

/**
 * Magnetic CTA — drifts toward the cursor on hover with a soft spring,
 * and a gold sheen sweeps across the surface. Renders an <a> when `href`
 * is provided, otherwise a <button>.
 */
export default function MagneticButton({
  children,
  variant = 'primary',
  strength = 0.35,
  className,
  href,
  onClick,
  type = 'button',
  ariaLabel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 15, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 200, damping: 15, mass: 0.4 })

  const handleMove = (e: MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const relX = e.clientX - (rect.left + rect.width / 2)
    const relY = e.clientY - (rect.top + rect.height / 2)
    x.set(relX * strength)
    y.set(relY * strength)
  }

  const handleLeave = () => {
    x.set(0)
    y.set(0)
  }

  const base = variant === 'primary' ? 'btn-primary' : 'btn-ghost'
  const Comp: any = href ? motion.a : motion.button

  return (
    <Comp
      ref={ref}
      href={href}
      onClick={onClick}
      type={href ? undefined : type}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: sx, y: sy }}
      aria-label={ariaLabel}
      className={cn(base, 'group', className)}
    >
      {/* sheen */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
      />
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </Comp>
  )
}
