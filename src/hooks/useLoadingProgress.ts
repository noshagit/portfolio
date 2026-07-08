import { useEffect, useState } from 'react'

const PROGRESS_TICK_MS = 100

/**
 * Drives an artificial minimal loading sequence keyed on `resetKey`.
 *
 * Restarts every time `resetKey` changes, ramping `progress` from 0 to 100
 * over `durationMs` and flipping `isLoading` off once that duration elapses.
 *
 * @param resetKey   - Value that restarts the sequence whenever it changes.
 * @param durationMs - Total artificial loading duration in milliseconds.
 * @returns `{ isLoading, progress }` where `progress` is a 0-100 percentage.
 * @throws Never; both internal timers are cleared on cleanup so a `resetKey`
 * change or an unmount before completion cannot leave a stale timer running.
 */
export function useLoadingProgress(resetKey: unknown, durationMs: number) {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    setIsLoading(true)
    setProgress(0)

    const start = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - start
      setProgress(Math.min(100, (elapsed / durationMs) * 100))
    }, PROGRESS_TICK_MS)

    const timeout = setTimeout(() => {
      setProgress(100)
      setIsLoading(false)
    }, durationMs)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [resetKey, durationMs])

  return { isLoading, progress }
}
