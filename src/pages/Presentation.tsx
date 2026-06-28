import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import type { View } from '../types'
import SectionLabel from '../components/ui/SectionLabel'
import { useLang } from '../hooks/useLang'
import TechSkillsSection from './presentation/TechSkillsSection'
import SkillsSection from './presentation/SkillsSection'
import EducationSection from './presentation/EducationSection'
import RecommendationPanel from './presentation/RecommendationPanel'
import PassionPanel from './presentation/PassionPanel'
import TransitionSection from './presentation/TransitionSection'
import PresentationNav from './presentation/PresentationNav'
import { EASE } from '../lib/motion'

const SECTION_COUNT = 7

const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, y: dir > 0 ? 36 : -36 }),
  center: { opacity: 1, y: 0, transition: { duration: 0.30, ease: EASE } },
  exit:  (dir: number) => ({ opacity: 0, y: dir > 0 ? -36 : 36, transition: { duration: 0.20, ease: EASE } }),
}

interface Props {
  onNavigate: (view: View) => void
}

export default function Presentation({ onNavigate }: Props) {
  const { t } = useLang()
  const i = t.presentation.intro

  const [activeIdx,      setActiveIdx]      = useState(0)
  const [dir,            setDir]            = useState(1)
  const [showHint,       setShowHint]       = useState(false)
  const [hintDir,        setHintDir]        = useState<'up' | 'down'>('down')
  const [indicatorReady, setIndicatorReady] = useState(false)

  // Refs so event handlers never go stale
  const activeIdxRef  = useRef(0)
  const cooldownRef   = useRef(false)
  const edgeHitRef    = useRef(0)   // timestamp when bottom edge was first hit (0 = not at edge)
  const sectionRef    = useRef<HTMLDivElement>(null)
  const touchStartRef = useRef(0)

  const EDGE_HOLD_MS = 400

  const navigate = useCallback((idx: number) => {
    const next = Math.max(0, Math.min(SECTION_COUNT - 1, idx))
    if (next === activeIdxRef.current) return
    setDir(next > activeIdxRef.current ? 1 : -1)
    activeIdxRef.current = next
    edgeHitRef.current = 0
    setShowHint(false)
    setActiveIdx(next)
    requestAnimationFrame(() => { if (sectionRef.current) sectionRef.current.scrollTop = 0 })
  }, [])

  useEffect(() => {
    function tryStep(delta: number) {
      if (cooldownRef.current) return
      cooldownRef.current = true
      setTimeout(() => { cooldownRef.current = false }, 520)
      navigate(activeIdxRef.current + delta)
    }

    function onWheel(e: WheelEvent) {
      const el = sectionRef.current
      const down = e.deltaY > 0
      const scrollable = !!el && el.scrollHeight > el.clientHeight + 4

      if (el) {
        const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 2
        const atTop    = el.scrollTop <= 0

        // Not at edge - let the section scroll normally and reset edge timer
        if (down  && scrollable && !atBottom) { edgeHitRef.current = 0; setShowHint(false); return }
        if (!down && scrollable && !atTop)    { edgeHitRef.current = 0; setShowHint(false); return }

        // At an edge: time-gate the section change (same logic for both directions)
        if (scrollable) {
          const now = Date.now()
          if (edgeHitRef.current === 0) {
            edgeHitRef.current = now
            setHintDir(down ? 'down' : 'up')
            setShowHint(true)
          }
          e.preventDefault()
          if (now - edgeHitRef.current < EDGE_HOLD_MS) return
        }
      }

      // Filter inertia tail events (trackpad deceleration after cooldown lifts)
      if (Math.abs(e.deltaY) < 4) { e.preventDefault(); return }
      setShowHint(false)
      e.preventDefault()
      tryStep(down ? 1 : -1)
    }

    function onKey(e: KeyboardEvent) {
      const el = sectionRef.current
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        if (el && el.scrollTop + el.clientHeight < el.scrollHeight - 2) return
        e.preventDefault(); tryStep(1)
      }
      if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        if (el && el.scrollTop > 0) return
        e.preventDefault(); tryStep(-1)
      }
    }

    function onTouchStart(e: TouchEvent) {
      touchStartRef.current = e.touches[0].clientY
    }
    function onTouchEnd(e: TouchEvent) {
      const delta = touchStartRef.current - e.changedTouches[0].clientY
      if (Math.abs(delta) < 30) return
      const el = sectionRef.current
      if (delta > 0) {
        if (el && el.scrollTop + el.clientHeight < el.scrollHeight - 2) return
        tryStep(1)
      } else {
        if (el && el.scrollTop > 0) return
        tryStep(-1)
      }
    }

    window.addEventListener('wheel',      onWheel,      { passive: false })
    window.addEventListener('keydown',    onKey)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend',   onTouchEnd,   { passive: true })
    return () => {
      window.removeEventListener('wheel',      onWheel)
      window.removeEventListener('keydown',    onKey)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend',   onTouchEnd)
    }
  }, [navigate])

  useEffect(() => {
    const t = setTimeout(() => setIndicatorReady(true), 600)
    return () => clearTimeout(t)
  }, [])

  const slides = [
    <div key="intro">
      <SectionLabel as="p">{i.label}</SectionLabel>
      <h1 className="mb-6 font-black leading-tight text-foreground text-3xl sm:text-4xl md:text-5xl">
        {i.title}<br />
        <span className="text-accent">{i.titleAccent}</span>
      </h1>
      <p className="max-w-lg text-sm leading-relaxed text-foreground/60 md:text-base">
        {i.bio1}{' '}
        <span className="font-medium text-accent">{i.bioAccent}</span>{' '}
        {i.bio2}
      </p>
    </div>,
    <TechSkillsSection    key="tech" />,
    <SkillsSection        key="skills" />,
    <EducationSection     key="education" />,
    <RecommendationPanel  key="recommendations" />,
    <PassionPanel         key="passions" />,
    <TransitionSection    key="transition" onNavigate={onNavigate} />,
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="relative h-[calc(100dvh-10rem)] overflow-hidden"
    >
      <PresentationNav activeIdx={activeIdx} onChange={navigate} />

      {/* Scroll cue - mobile only, hidden once user reaches last section */}
      <AnimatePresence>
        {indicatorReady && activeIdx < SECTION_COUNT - 1 && !showHint && (
          <motion.div
            key="scroll-cue"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 xl:hidden"
            aria-hidden="true"
          >
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ChevronDown size={18} className="text-foreground/30" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showHint && (
          <motion.p
            key="hint"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2
                       text-[10px] uppercase tracking-widest text-foreground/30"
          >
            {hintDir === 'down' ? '↓' : '↑'} scroll
          </motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait" custom={dir}>
        <motion.div
          key={activeIdx}
          ref={sectionRef}
          custom={dir}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="h-full overflow-y-auto px-4 py-12 sm:px-6 md:py-16 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="mx-auto max-w-5xl">
            {slides[activeIdx]}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
