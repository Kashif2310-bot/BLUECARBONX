import { motion } from 'framer-motion'
import './GlassCard.css'

export default function GlassCard({
  children, className = '', variant = 'default', glow = false,
  hover = true, onClick, animate = true, delay = 0, ...props
}) {
  const classes = [
    'glass-card',
    `glass-card--${variant}`,
    glow && 'glass-card--glow',
    hover && 'glass-card--hover',
    className,
  ].filter(Boolean).join(' ')

  const Component = animate ? motion.div : 'div'
  const animProps = animate ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  } : {}

  return (
    <Component className={classes} onClick={onClick} {...animProps} {...props}>
      {variant !== 'default' && <div className="glass-card__accent" />}
      {children}
    </Component>
  )
}
