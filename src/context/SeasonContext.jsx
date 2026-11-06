import { createContext, useCallback, useContext, useEffect, useMemo } from 'react'
import { useData } from './DataContext'
import { useLocalStorage } from '../lib/hooks'
import { monthNames, seasonForMonth } from '../lib/utils'

const SeasonContext = createContext(null)

export function SeasonProvider({ children }) {
  const { settings, updateSettings } = useData()
  const [override, setOverride] = useLocalStorage('ghsnb_season_override', '')
  const month = new Date().getMonth() + 1

  const winterStart = Number(settings?.winterStartMonth) || 11
  const winterEnd = Number(settings?.winterEndMonth) || 2
  const autoSeason = seasonForMonth(month, winterStart, winterEnd)
  const season = override === 'winter' || override === 'summer' ? override : autoSeason

  useEffect(() => {
    document.documentElement.dataset.season = season
    document.documentElement.classList.toggle('is-winter', season === 'winter')
    document.documentElement.classList.toggle('is-summer', season === 'summer')
  }, [season])

  const setSeason = useCallback(
    (next) => {
      setOverride(next === 'winter' || next === 'summer' ? next : '')
    },
    [setOverride],
  )

  const clearOverride = useCallback(() => setOverride(''), [setOverride])

  const updateSeasonConfig = useCallback(
    (start, end) => {
      updateSettings({ winterStartMonth: Number(start), winterEndMonth: Number(end) })
    },
    [updateSettings],
  )

  const value = useMemo(
    () => ({
      season,
      autoSeason,
      override,
      isWinter: season === 'winter',
      setSeason,
      clearOverride,
      updateSeasonConfig,
      winterStart,
      winterEnd,
      winterMonthsLabel: `${monthNames[winterStart - 1]} – ${monthNames[winterEnd - 1]}`,
      summerMonthsLabel: `${monthNames[(winterEnd % 12)]} – ${monthNames[(winterStart - 2 + 12) % 12]}`,
      currentMonth: monthNames[month - 1],
    }),
    [season, autoSeason, override, setSeason, clearOverride, updateSeasonConfig, winterStart, winterEnd, month],
  )

  return <SeasonContext.Provider value={value}>{children}</SeasonContext.Provider>
}

export const useSeason = () => {
  const ctx = useContext(SeasonContext)
  if (!ctx) throw new Error('useSeason must be used inside SeasonProvider')
  return ctx
}
