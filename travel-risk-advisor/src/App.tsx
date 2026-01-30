import { useMemo, useState } from 'react'
import { CountryModal } from './components/CountryModal'
import type { HoverState } from './components/WorldMap'
import { WorldMap } from './components/WorldMap'
import { TopBar } from './components/TopBar'
import { generateCountryRisk } from './data/riskGenerator'
import { COUNTRIES } from './data/world'
import { RISK_LEVELS } from './lib/risk'

export default function App() {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [hover, setHover] = useState<HoverState>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const riskById = useMemo(() => {
    return new Map(
      COUNTRIES.map((c) => [
        c.id,
        generateCountryRisk({ id: c.id, name: c.name, flagEmoji: c.flagEmoji }),
      ]),
    )
  }, [])

  const options = useMemo(() => {
    return COUNTRIES.map((c) => {
      const r = riskById.get(c.id)!
      return { id: c.id, name: c.name, risk: r.overall }
    }).sort((a, b) => a.name.localeCompare(b.name))
  }, [riskById])

  const selectedRisk = selectedId ? (riskById.get(selectedId) ?? null) : null

  function selectCountry(id: number) {
    setSelectedId(id)
    setModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <TopBar options={options} selectedId={selectedId} onSelect={selectCountry} />

      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-10">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-900">
              Interactive risk map (demo)
            </div>
            <div className="mt-1 text-sm text-slate-600">
              Countries are colored by the <span className="font-medium">worst</span> category
              rating (Security, Health, Political).
            </div>
          </div>
          <div className="hidden rounded-full bg-white px-3 py-1 text-xs text-slate-500 ring-1 ring-slate-200 sm:block">
            Hosted-ready: static build for AWS Amplify
          </div>
        </div>

        <WorldMap
          countries={COUNTRIES}
          selectedId={selectedId}
          fillFor={(id) => {
            const r = riskById.get(id)
            return r ? RISK_LEVELS[r.overall].colorHex : '#e5e7eb'
          }}
          riskFor={(id) => riskById.get(id)!}
          hover={hover}
          setHover={setHover}
          onSelect={selectCountry}
        />

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
          <div className="font-semibold text-slate-900">MVP note</div>
          <p className="mt-1 leading-6">
            This prototype uses deterministic dummy data and placeholder sources. Next iterations
            can plug in real sources, saved trips, and policy configuration.
          </p>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5 text-xs text-slate-500">
          <div>© {new Date().getFullYear()} Travel Risk Advisor (MVP)</div>
          <div>Demo data • No warranties</div>
        </div>
      </footer>

      <CountryModal open={modalOpen} onClose={() => setModalOpen(false)} risk={selectedRisk} />
    </div>
  )
}
