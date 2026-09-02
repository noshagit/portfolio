import { useEffect, useState } from 'react'

const ONE_DAY_MS = 24 * 60 * 60 * 1000

/** @internal Milliseconds from now until the next local 00:01. */
function msUntilNextRefresh(): number {
  const next = new Date()
  next.setHours(0, 1, 0, 0)
  if (next.getTime() <= Date.now()) next.setDate(next.getDate() + 1)
  return next.getTime() - Date.now()
}

/**
 * Returns the current Date, refreshed automatically at 00:01 local time every day so
 * anything computed against "today" (e.g. a live experience duration) advances on its
 * own for a tab left open overnight, without needing a page reload.
 */
export function useToday(): Date {
  const [today, setToday] = useState(() => new Date())

  useEffect(() => {
    let dayTimer: ReturnType<typeof setInterval> | undefined

    const firstTimer = setTimeout(() => {
      setToday(new Date())
      dayTimer = setInterval(() => setToday(new Date()), ONE_DAY_MS)
    }, msUntilNextRefresh())

    return () => {
      clearTimeout(firstTimer)
      if (dayTimer) clearInterval(dayTimer)
    }
  }, [])

  return today
}
