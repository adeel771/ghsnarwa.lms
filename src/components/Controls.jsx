import { Snowflake, Sun, Languages, Check } from 'lucide-react'
import { useSeason } from '../context/SeasonContext'
import { useLanguage } from '../context/LanguageContext'
import { cn } from '../lib/utils'

export function SeasonSwitcher({ theme = 'light', compact = false, className }) {
  const { season, setSeason, autoSeason, override } = useSeason()
  const isDark = theme === 'dark'
  return (
    <div className={cn('flex items-center gap-1 rounded-full p-1', isDark ? 'bg-white/10 ring-1 ring-white/15' : 'bg-slate-100 ring-1 ring-slate-200/70', className)}>
      <button
        type="button"
        onClick={() => setSeason('winter')}
        aria-pressed={season === 'winter'}
        title="Winter theme (November – February)"
        className={cn(
          'flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-bold transition',
          season === 'winter'
            ? 'bg-white text-sky-700 shadow-sm'
            : isDark ? 'text-white/70 hover:text-white' : 'text-slate-500 hover:text-slate-800',
        )}
      >
        <Snowflake size={13} />
        {compact ? null : 'Winter'}
      </button>
      <button
        type="button"
        onClick={() => setSeason('summer')}
        aria-pressed={season === 'summer'}
        title="Summer theme (March – October)"
        className={cn(
          'flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-bold transition',
          season === 'summer'
            ? 'bg-white text-gov-700 shadow-sm'
            : isDark ? 'text-white/70 hover:text-white' : 'text-slate-500 hover:text-slate-800',
        )}
      >
        <Sun size={13} />
        {compact ? null : 'Summer'}
      </button>
      {!compact ? (
        <button
          type="button"
          onClick={() => setSeason('')}
          title={`Automatic (currently ${autoSeason})`}
          className={cn('ml-0.5 flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold transition',
            isDark ? 'text-white/50 hover:text-white' : 'text-slate-400 hover:text-slate-700')}
        >
          {override ? 'Auto' : <><Check size={11} /> Auto</>}
        </button>
      ) : null}
    </div>
  )
}

export function LanguageSwitcher({ theme = 'light', className }) {
  const { lang, setLang } = useLanguage()
  const isDark = theme === 'dark'
  return (
    <div className={cn('flex items-center gap-1 rounded-full p-1', isDark ? 'bg-white/10 ring-1 ring-white/15' : 'bg-slate-100 ring-1 ring-slate-200/70', className)}>
      <Languages size={13} className={cn('ml-1.5', isDark ? 'text-white/60' : 'text-slate-400')} />
      <button
        type="button"
        onClick={() => setLang('en')}
        className={cn('rounded-full px-2 py-1 text-[11px] font-bold transition', lang === 'en' ? 'bg-white text-navy-900 shadow-sm' : isDark ? 'text-white/70' : 'text-slate-500')}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang('ur')}
        className={cn('rounded-full px-2 py-1 text-[11px] font-bold transition', lang === 'ur' ? 'bg-white text-navy-900 shadow-sm' : isDark ? 'text-white/70' : 'text-slate-500')}
      >
        اردو
      </button>
    </div>
  )
}

export function SeasonPill({ className }) {
  const { season } = useSeason()
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider',
      season === 'winter' ? 'bg-sky-50 text-sky-700 ring-1 ring-sky-200' : 'bg-gov-50 text-gov-700 ring-1 ring-gov-200', className)}>
      {season === 'winter' ? <Snowflake size={11} /> : <Sun size={11} />}
      {season} theme
    </span>
  )
}
