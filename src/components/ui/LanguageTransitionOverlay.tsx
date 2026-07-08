import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useTransform, animate as animateValue } from 'framer-motion'
import { Plane } from 'lucide-react'
import { useLang } from '../../hooks/useLang'
import { EASE, CURTAIN_COVER_DURATION_MS } from '../../lib/motion'

const CURTAIN_DURATION_S = CURTAIN_COVER_DURATION_MS / 1000
const MAP_DURATION_S     = 0.35
const TAKEOFF_DELAY_S    = 0.15
const FLIGHT_DURATION_S  = 1.3
const FLIGHT_EASE        = 'easeInOut'

const MAP_WIDTH  = 500
const MAP_HEIGHT = 500
const PLANE_SIZE = 32
const PLANE_NATIVE_HEADING_DEG = -45
const RAD_TO_DEG = 180 / Math.PI

const LYON_POINT  = { x: 362, y: 370 }
const UK_POINT    = { x: 159, y: 181 }
const ARC_CONTROL = { x: 284, y: 240 }

const UK_LAYOUT_TRANSFORM     = 'translate(21.3, 21.3) scale(0.429)'
const FRANCE_LAYOUT_TRANSFORM = 'translate(191.2, 224.7) scale(0.553)'

const UK_OUTLINE_D =
  'M 200 8 L 218 11 L 248 8 L 253 25 L 224 47 L 226 49 L 219 66 L 242 59 L 263 63 L 275 61 ' +
  'L 285 65 L 288 74 L 282 83 L 278 102 L 265 120 L 247 130 L 252 130 L 264 139 L 244 147 ' +
  'L 237 149 L 248 155 L 258 148 L 279 155 L 293 172 L 296 198 L 305 222 L 320 229 L 339 250 ' +
  'L 347 277 L 340 274 L 353 287 L 355 304 L 347 318 L 360 321 L 365 315 L 391 316 L 406 328 ' +
  'L 400 345 L 400 360 L 393 363 L 392 372 L 381 379 L 380 391 L 363 392 L 397 401 L 395 410 ' +
  'L 360 436 L 341 431 L 325 435 L 304 435 L 294 437 L 282 437 L 282 443 L 267 443 L 251 439 ' +
  'L 227 447 L 227 463 L 209 457 L 193 457 L 170 474 L 161 470 L 153 469 L 165 460 L 175 446 ' +
  'L 192 432 L 194 421 L 206 423 L 205 416 L 222 407 L 242 413 L 253 399 L 258 388 L 247 390 ' +
  'L 240 400 L 229 398 L 218 386 L 207 394 L 203 391 L 206 385 L 191 383 L 174 383 L 176 376 ' +
  'L 169 371 L 188 360 L 211 347 L 212 318 L 198 324 L 189 323 L 204 310 L 196 294 L 202 292 ' +
  'L 215 301 L 234 295 L 244 301 L 243 281 L 260 250 L 242 254 L 230 232 L 242 207 L 235 207 ' +
  'L 232 212 L 222 216 L 207 210 L 208 222 L 195 208 L 192 208 L 192 220 L 178 207 L 190 196 ' +
  'L 200 184 L 192 171 L 192 155 L 187 160 L 182 156 L 169 181 L 169 148 L 161 155 L 160 162 ' +
  'L 152 169 L 139 164 L 145 156 L 184 117 L 182 115 L 175 118 L 167 130 L 154 132 L 158 103 ' +
  'L 168 104 L 166 89 L 143 69 L 159 58 L 168 78 L 164 64 L 176 48 L 189 49 L 186 33 L 182 25 L 188 27 Z'

const FRANCE_OUTLINE_D =
  'M 223 37 L 248 32 L 253 52 L 265 46 L 266 57 L 279 59 L 279 69 L 289 68 L 288 82 L 312 89 ' +
  'L 328 107 L 360 111 L 370 125 L 411 139 L 392 202 L 376 206 L 374 215 L 360 222 L 351 236 ' +
  'L 341 262 L 358 256 L 370 274 L 365 282 L 378 304 L 360 309 L 360 316 L 368 325 L 364 351 ' +
  'L 393 353 L 387 368 L 350 406 L 301 390 L 270 378 L 238 395 L 235 429 L 192 430 L 191 414 ' +
  'L 147 401 L 147 407 L 84 381 L 74 366 L 95 318 L 103 310 L 103 306 L 95 309 L 110 278 ' +
  'L 120 306 L 127 295 L 102 255 L 114 261 L 115 235 L 97 224 L 86 194 L 87 185 L 105 196 ' +
  'L 89 180 L 79 181 L 16 136 L 32 138 L 21 127 L 36 127 L 28 120 L 20 122 L 20 118 L 37 110 ' +
  'L 71 110 L 74 123 L 91 121 L 119 127 L 121 105 L 114 83 L 126 77 L 127 91 L 156 103 ' +
  'L 189 99 L 170 90 L 186 83 L 223 68 Z'

const ARC_PATH_D =
  `M ${LYON_POINT.x} ${LYON_POINT.y} Q ${ARC_CONTROL.x} ${ARC_CONTROL.y} ${UK_POINT.x} ${UK_POINT.y}`

function quadPoint(p0: number, p1: number, p2: number, t: number): number {
  return (1 - t) ** 2 * p0 + 2 * (1 - t) * t * p1 + t ** 2 * p2
}

function quadDerivative(p0: number, p1: number, p2: number, t: number): number {
  return 2 * (1 - t) * (p1 - p0) + 2 * t * (p2 - p1)
}

/**
 * Fullscreen overlay played while `LanguageContext` is mid-transition between FR and EN.
 *
 * Unlike the curtain it renders, this component itself is mounted permanently (see
 * `src/App.tsx`) - only the inner `motion.div` tree mounts/unmounts per transition via
 * `AnimatePresence`. That matters for its two pieces of local state/motion value, neither
 * of which can rely on a fresh mount to reset between transitions:
 * - `curtainSettled` is explicitly reset to `false` at the start of every transition
 *   (effect 1 below), otherwise it would stay `true` forever after the first transition
 *   and every subsequent one would skip the "wait for the curtain" gate.
 * - `progress` (a `MotionValue`) is explicitly `.set()` to the correct start point for the
 *   current direction at the same time, otherwise it would keep whatever value the
 *   previous transition left it at, which can equal the new target and produce a
 *   zero-distance, invisible "animation".
 *
 * Animation lifecycle (orchestration):
 * 1. When `isTransitioning` flips `true`, an effect resets `curtainSettled` to `false` and
 *    snaps `progress` to `0` (`toEn`) or `1` (`toFr`) - the correct start of the arc for
 *    this transition's direction.
 * 2. The curtain (`bg-background` panel) slides down from `y: -100%` to `y: 0%` over
 *    `CURTAIN_DURATION_S` (derived from `CURTAIN_COVER_DURATION_MS`, `src/lib/motion.ts`).
 *    Its `onAnimationComplete` flips `curtainSettled` to `true`. `LanguageContext`
 *    (`src/context/LanguageContext.tsx`) imports that same constant to withhold its own
 *    locale mutation until the curtain has visually finished covering the viewport - the
 *    two components stay in sync purely by sharing one duration constant, with no direct
 *    reference between them.
 * 3. The map (landmasses + dotted arc + plane) fades/scales in independently once mounted
 *    (`MAP_DURATION_S`), since it is only visible once the curtain already covers the
 *    viewport. It carries no border, background, or shadow of its own - the curtain is
 *    the only surface, so the map reads as painted directly onto it.
 * 4. The plane's flight is gated entirely on `curtainSettled`: a separate effect watching
 *    that flag starts the imperative `animateValue` call driving `progress` from its reset
 *    start to `1` (`toEn`) or `0` (`toFr`) after a short `TAKEOFF_DELAY_S`. Until
 *    `curtainSettled` flips, `progress` never animates, which is what stops the plane from
 *    moving while the curtain is still dropping.
 * 5. Cleanup: the flight effect's cleanup calls `.stop()` on the returned animation
 *    controls whenever `curtainSettled`/direction change or the component unmounts, so no
 *    orphaned animation keeps writing to `progress` after its transition has ended.
 *
 * Geographic paths, layout transforms and color tokens: `FRANCE_OUTLINE_D` and
 * `UK_OUTLINE_D` are full-detail traced silhouettes, each authored independently in its own
 * source coordinate space - both happen to span nearly the entire 500 x 500 `MAP_WIDTH` x
 * `MAP_HEIGHT` viewBox on their own, so placed as-is they fully overlap. Rather than hand
 * rewriting every point of either path, each `<path>` carries its own SVG `transform`
 * (`UK_LAYOUT_TRANSFORM` / `FRANCE_LAYOUT_TRANSFORM`, a `translate(...) scale(...)` pair)
 * that repositions and shrinks it into a non-overlapping quadrant of the shared canvas -
 * UK upper-left, France lower-right - while leaving `UK_OUTLINE_D`/`FRANCE_OUTLINE_D`
 * themselves untouched as the single source of truth for each silhouette's shape. Both
 * render with `fill="currentColor"` and `text-foreground/20` - a faint body-text tint
 * rather than the accent token, so the landmasses stay a quiet background and the accent
 * color reads exclusively as the flight itself (the dotted arc's `stroke-accent` and the
 * plane's `text-accent`). `LYON_POINT`/`UK_POINT`/`ARC_CONTROL` are specified directly in
 * final (post-transform) canvas space - chosen to land inside each shape's transformed
 * silhouette - and the `<svg>` itself is rendered at `MAP_WIDTH` x `MAP_HEIGHT` natively (no
 * separate CSS scale) so the plane's pixel-based `x`/`y` transform can never drift out of
 * alignment with the arc it's drawn against.
 *
 * Vector transformation mathematics (tangential flight rotation): `LYON_POINT`, `UK_POINT`
 * and `ARC_CONTROL` define a single quadratic bezier. `quadPoint` samples position (drives
 * `planeX`/`planeY`, and independently renders the dotted `<path>`, so the plane can never
 * visually drift off the drawn arc). `quadDerivative` samples the bezier's tangent vector
 * `(dx, dy)` at the same `t`; `Math.atan2(dy, dx)` converts that into `headingDeg`, the
 * compass heading of the arc itself at that point - naturally shallow near both endpoints
 * and steep mid-arc, which is what produces the climb/level/descend feel without any
 * separate keyframing. The plane glyph's native (untransformed) heading is
 * `PLANE_NATIVE_HEADING_DEG` (-45, empirically: it takes +45 of rotation to point due
 * east) - `planeTransform` composes `scaleX` (direction mirror) and `rotate` in a single
 * precomputed CSS string (rather than relying on framer-motion's own transform-prop
 * composition) because reversing direction isn't a plain 180 flip: mirroring an angle a
 * lands on `180 - a`, so making the mirrored glyph point exactly backward along the same
 * arc requires rotating by the *negated* heading, not the same heading plus 180 - the
 * algebra is `rotate(45 + heading)` outbound and `rotate(45 - heading)` + `scaleX(-1)`
 * inbound. `planeScale`/`planeOpacity` sample the same `progress` value at its extremes to
 * produce a brief takeoff lift and landing drop, symmetric regardless of travel direction.
 *
 * @returns The animated overlay when a transition is in flight, otherwise `null`.
 */
export default function LanguageTransitionOverlay() {
  const { isTransitioning, transitionDirection } = useLang()
  const direction = transitionDirection ?? 'toEn'
  const isToEn    = direction === 'toEn'

  const [curtainSettled, setCurtainSettled] = useState(false)

  const progress = useMotionValue(0)

  const planeX = useTransform(progress, t => quadPoint(LYON_POINT.x, ARC_CONTROL.x, UK_POINT.x, t) - PLANE_SIZE / 2)
  const planeY = useTransform(progress, t => quadPoint(LYON_POINT.y, ARC_CONTROL.y, UK_POINT.y, t) - PLANE_SIZE / 2)

  const planeScale   = useTransform(progress, [0, 0.12, 0.88, 1], [0.6, 1, 1, 0.6])
  const planeOpacity = useTransform(progress, [0, 0.12, 0.88, 1], [0, 1, 1, 0])

  const planeTransform = useTransform(progress, t => {
    const dx = quadDerivative(LYON_POINT.x, ARC_CONTROL.x, UK_POINT.x, t)
    const dy = quadDerivative(LYON_POINT.y, ARC_CONTROL.y, UK_POINT.y, t)
    const headingDeg  = Math.atan2(dy, dx) * RAD_TO_DEG
    const rotationDeg = -PLANE_NATIVE_HEADING_DEG + (isToEn ? headingDeg : -headingDeg)
    return `scaleX(${isToEn ? 1 : -1}) rotate(${rotationDeg}deg)`
  })

  useEffect(() => {
    if (!isTransitioning) return
    setCurtainSettled(false)
    progress.set(isToEn ? 0 : 1)
  }, [isTransitioning, isToEn, progress])

  useEffect(() => {
    if (!curtainSettled) return
    const controls = animateValue(progress, isToEn ? 1 : 0, {
      duration: FLIGHT_DURATION_S,
      ease:     FLIGHT_EASE,
      delay:    TAKEOFF_DELAY_S,
    })
    return () => controls.stop()
  }, [curtainSettled, isToEn, progress])

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          key="lang-transition-curtain"
          initial={{ y: '-100%' }}
          animate={{ y: '0%' }}
          exit={{ y: '100%' }}
          transition={{ duration: CURTAIN_DURATION_S, ease: EASE }}
          onAnimationComplete={() => setCurtainSettled(true)}
          aria-hidden="true"
          className="pointer-events-auto fixed inset-0 z-[200] flex items-center justify-center bg-background"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: MAP_DURATION_S, ease: EASE }}
            className="relative"
            style={{ width: MAP_WIDTH, height: MAP_HEIGHT }}
          >
            <svg
              width={MAP_WIDTH}
              height={MAP_HEIGHT}
              viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
              className="block"
            >
              <path d={UK_OUTLINE_D} transform={UK_LAYOUT_TRANSFORM} fill="currentColor" className="text-foreground/20" />
              <path d={FRANCE_OUTLINE_D} transform={FRANCE_LAYOUT_TRANSFORM} fill="currentColor" className="text-foreground/20" />
              <path
                d={ARC_PATH_D}
                className="stroke-accent"
                strokeWidth={1.5}
                strokeDasharray="3 5"
                fill="none"
              />
            </svg>

            <motion.div
              className="absolute left-0 top-0"
              style={{ x: planeX, y: planeY, scale: planeScale, opacity: planeOpacity }}
            >
              <motion.span className="block" style={{ transform: planeTransform }}>
                <Plane size={PLANE_SIZE} className="text-accent" />
              </motion.span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
