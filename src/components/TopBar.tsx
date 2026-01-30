import type { RiskLevel } from '../lib/risk'
import { RISK_LEVELS } from '../lib/risk'
import type { SearchOption } from './SearchCombobox'
import { SearchCombobox } from './SearchCombobox'

function LegendChip(props: { level: RiskLevel }) {
  const meta = RISK_LEVELS[props.level]
  return (
    <div className="flex items-center gap-2 rounded-full bg-white/70 px-2.5 py-1 text-xs text-slate-700 ring-1 ring-slate-200">
      <span
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: meta.colorHex }}
        aria-hidden
      />
      <span className="hidden sm:inline">{meta.policyLabel}</span>
      <span className="sm:hidden">{meta.key.toUpperCase()}</span>
    </div>
  )
}

export function TopBar(props: {
  options: SearchOption[]
  selectedId: number | null
  onSelect: (id: number) => void
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-lg" aria-hidden>
              ✈︎
            </span>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-slate-900 sm:text-base">
                Travel Risk Advisor
              </div>
              <div className="hidden truncate text-xs text-slate-500 sm:block">
                Policy-aligned country briefs for business travel (demo data)
              </div>
            </div>
          </div>
        </div>

        <div className="w-full sm:w-[min(520px,55vw)]">
          <SearchCombobox
            options={props.options}
            selectedId={props.selectedId}
            onSelect={props.onSelect}
          />
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <LegendChip level="green" />
          <LegendChip level="yellow" />
          <LegendChip level="orange" />
          <LegendChip level="red" />
        </div>
      </div>
    </header>
  )
}

