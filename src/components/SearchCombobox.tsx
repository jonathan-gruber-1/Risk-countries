import { Combobox } from '@headlessui/react'
import clsx from 'clsx'
import { useMemo, useState } from 'react'
import type { RiskLevel } from '../lib/risk'
import { RISK_LEVELS } from '../lib/risk'

export type SearchOption = {
  id: number
  name: string
  risk: RiskLevel
}

export function SearchCombobox(props: {
  options: SearchOption[]
  selectedId: number | null
  onSelect: (id: number) => void
}) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return props.options.slice(0, 15)
    return props.options
      .filter((o) => o.name.toLowerCase().includes(q))
      .slice(0, 15)
  }, [props.options, query])

  const selected = props.selectedId
    ? props.options.find((o) => o.id === props.selectedId) ?? null
    : null

  return (
    <Combobox
      value={selected}
      onChange={(opt: SearchOption | null) => {
        if (!opt) return
        props.onSelect(opt.id)
      }}
    >
      <div className="relative">
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm ring-1 ring-transparent focus-within:ring-slate-300">
          <span className="text-slate-400" aria-hidden>
            ⌕
          </span>
          <Combobox.Input
            className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            displayValue={(opt: SearchOption | null) => opt?.name ?? ''}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a country…"
            aria-label="Search for a country"
          />
          {query.length > 0 && (
            <button
              type="button"
              className="rounded-md px-2 py-1 text-xs text-slate-500 hover:bg-slate-100"
              onClick={() => setQuery('')}
            >
              Clear
            </button>
          )}
        </div>

        <Combobox.Options className="absolute z-20 mt-2 max-h-80 w-full overflow-auto rounded-xl border border-slate-200 bg-white p-1 shadow-lg focus:outline-none">
          {filtered.length === 0 ? (
            <div className="px-3 py-2 text-sm text-slate-500">No matches.</div>
          ) : (
            filtered.map((opt) => (
              <Combobox.Option
                key={opt.id}
                value={opt}
                className={({ active }) =>
                  clsx(
                    'flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm',
                    active ? 'bg-slate-100 text-slate-900' : 'text-slate-700',
                  )
                }
              >
                {({ selected: isSelected }) => (
                  <>
                    <div className="flex min-w-0 items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: RISK_LEVELS[opt.risk].colorHex }}
                        aria-hidden
                      />
                      <span className="truncate">{opt.name}</span>
                    </div>
                    {isSelected && <span className="text-slate-400">Selected</span>}
                  </>
                )}
              </Combobox.Option>
            ))
          )}
        </Combobox.Options>
      </div>
    </Combobox>
  )
}

