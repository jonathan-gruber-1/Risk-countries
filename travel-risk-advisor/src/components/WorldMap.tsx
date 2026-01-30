import clsx from 'clsx'
import { geoNaturalEarth1, geoPath } from 'd3-geo'
import { useEffect, useMemo, useState } from 'react'
import type { CountryRisk } from '../data/riskGenerator'
import type { CountryFeature } from '../data/world'
import { RISK_CATEGORIES, RISK_LEVELS } from '../lib/risk'

type HoverState =
  | {
      country: CountryFeature
      clientX: number
      clientY: number
    }
  | null

const W = 1000
const H = 520

export function WorldMap(props: {
  countries: CountryFeature[]
  selectedId: number | null
  fillFor: (id: number) => string
  riskFor: (id: number) => CountryRisk
  onSelect: (id: number) => void
  hover: HoverState
  setHover: (h: HoverState) => void
}) {
  const projection = useMemo(() => geoNaturalEarth1().fitSize([W, H], { type: 'Sphere' }), [])
  const path = useMemo(() => geoPath(projection), [projection])

  const [zoom, setZoom] = useState(1)
  const [tx, setTx] = useState(0)
  const [ty, setTy] = useState(0)

  useEffect(() => {
    // Center on selection (simple centroid centering).
    if (!props.selectedId) return
    const selected = props.countries.find((c) => c.id === props.selectedId)
    if (!selected) return
    const [cx, cy] = path.centroid(selected.geo)
    const z = Math.max(1.4, zoom)
    setZoom(z)
    setTx(W / 2 - cx * z)
    setTy(H / 2 - cy * z)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.selectedId])

  function resetView() {
    setZoom(1)
    setTx(0)
    setTy(0)
  }

  function zoomBy(delta: number) {
    setZoom((z) => {
      const next = Math.max(1, Math.min(4, z + delta))
      // keep centered around map center when zooming without selection math
      setTx((t) => (t * next) / z)
      setTy((t) => (t * next) / z)
      return next
    })
  }

  const hoverRisk = props.hover ? props.riskFor(props.hover.country.id) : null
  const hoverMeta = hoverRisk ? RISK_LEVELS[hoverRisk.overall] : null

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-b from-sky-50 to-white" />

      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full"
          role="img"
          aria-label="Interactive world map"
          onMouseLeave={() => props.setHover(null)}
        >
          <rect x="0" y="0" width={W} height={H} fill="#dbeafe" opacity={0.55} />
          <g transform={`translate(${tx},${ty}) scale(${zoom})`}>
            {props.countries.map((c) => {
              const isSelected = props.selectedId === c.id
              const d = path(c.geo) || undefined
              const fill = props.fillFor(c.id)
              return (
                <path
                  key={c.id}
                  d={d}
                  fill={fill}
                  stroke={isSelected ? '#1d4ed8' : '#e5e7eb'}
                  strokeWidth={isSelected ? 1.5 / zoom : 0.8 / zoom}
                  className={clsx('cursor-pointer transition-colors duration-200')}
                  onMouseMove={(e) => {
                    props.setHover({ country: c, clientX: e.clientX, clientY: e.clientY })
                  }}
                  onClick={() => props.onSelect(c.id)}
                />
              )
            })}
          </g>
        </svg>

        <div className="absolute left-3 top-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => zoomBy(0.3)}
            className="rounded-lg border border-slate-200 bg-white/90 px-2 py-1 text-sm text-slate-700 shadow-sm hover:bg-white"
            aria-label="Zoom in"
          >
            +
          </button>
          <button
            type="button"
            onClick={() => zoomBy(-0.3)}
            className="rounded-lg border border-slate-200 bg-white/90 px-2 py-1 text-sm text-slate-700 shadow-sm hover:bg-white"
            aria-label="Zoom out"
          >
            −
          </button>
          <button
            type="button"
            onClick={resetView}
            className="rounded-lg border border-slate-200 bg-white/90 px-2 py-1 text-sm text-slate-700 shadow-sm hover:bg-white"
          >
            Reset
          </button>
        </div>
      </div>

      {props.hover && (
        <div
          className="pointer-events-none fixed z-50 w-64 -translate-y-2 rounded-xl border border-slate-200 bg-white p-3 shadow-lg"
          style={{
            left: Math.min(props.hover.clientX + 12, window.innerWidth - 280),
            top: Math.min(props.hover.clientY + 12, window.innerHeight - 180),
          }}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="truncate text-sm font-semibold text-slate-900">
              {props.hover.country.name}
            </div>
            <div className="text-lg" aria-hidden>
              {props.hover.country.flagEmoji ?? '🌍'}
            </div>
          </div>

          {hoverRisk && hoverMeta && (
            <>
              <div className="mt-1 flex items-center justify-between gap-2">
                <div className="text-xs text-slate-500">Overall</div>
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: hoverMeta.colorHex }}
                    aria-hidden
                  />
                  <div className="text-xs font-medium text-slate-700">{hoverMeta.label}</div>
                </div>
              </div>

              <div className="mt-2 space-y-1.5">
                {RISK_CATEGORIES.map(({ key, label }) => {
                  const c = hoverRisk.categories[key]
                  const m = RISK_LEVELS[c.level]
                  return (
                    <div key={key} className="grid grid-cols-[1fr_88px] items-center gap-2">
                      <div className="truncate text-xs text-slate-600">{label}</div>
                      <div className="h-2 w-full rounded-full bg-slate-100">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width:
                              c.level === 'green'
                                ? '30%'
                                : c.level === 'yellow'
                                  ? '55%'
                                  : c.level === 'orange'
                                    ? '78%'
                                    : '100%',
                            backgroundColor: m.colorHex,
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-2 text-xs text-slate-500">Click for full country brief</div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export type { HoverState }

