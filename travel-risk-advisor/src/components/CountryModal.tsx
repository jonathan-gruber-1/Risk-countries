import { Dialog, Transition } from '@headlessui/react'
import clsx from 'clsx'
import { Fragment, useMemo } from 'react'
import type { CountryRisk } from '../data/riskGenerator'
import { RISK_CATEGORIES, RISK_LEVELS, formatPolicyLabel } from '../lib/risk'

function checklistFor(overall: keyof typeof RISK_LEVELS): string[] {
  if (overall === 'green') {
    return [
      'Confirm entry/visa requirements and local work authorization.',
      'Share itinerary and emergency contacts with your travel program.',
      'Carry standard travel insurance and keep receipts for claims.',
    ]
  }
  if (overall === 'yellow') {
    return [
      'Avoid predictable routines; confirm safe transport from airport/hotel.',
      'Review medical coverage and locate a reputable clinic near work sites.',
      'Confirm escalation contacts and check-in cadence with your team.',
    ]
  }
  if (overall === 'orange') {
    return [
      'Request a security review and documented mitigation plan before booking.',
      'Restrict movement to essential locations; avoid night travel.',
      'Carry redundant communications and verify evacuation options.',
    ]
  }
  return [
    'Do not travel. Seek alternatives (remote meetings, third-party support).',
    'If already in-country, follow corporate security guidance immediately.',
    'Maintain a low profile and prepare contingency plans.',
  ]
}

export function CountryModal(props: {
  open: boolean
  onClose: () => void
  risk: CountryRisk | null
}) {
  const meta = props.risk ? RISK_LEVELS[props.risk.overall] : null
  const checklist = useMemo(() => (props.risk ? checklistFor(props.risk.overall) : []), [props.risk])

  return (
    <Transition show={props.open} as={Fragment}>
      <Dialog onClose={props.onClose} className="relative z-40">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-950/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 sm:items-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-200 sm:max-h-[85vh] sm:rounded-2xl">
                <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
                  <div className="min-w-0">
                    <Dialog.Title className="flex items-center gap-2 text-base font-semibold text-slate-900 sm:text-lg">
                      <span className="text-xl" aria-hidden>
                        {props.risk?.flagEmoji ?? '🌍'}
                      </span>
                      <span className="truncate">{props.risk?.name ?? 'Country'}</span>
                    </Dialog.Title>
                    {meta && (
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <span
                          className={clsx(
                            'inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium ring-1',
                            meta.ringClass,
                          )}
                        >
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: meta.colorHex }}
                            aria-hidden
                          />
                          <span className="text-slate-700">{formatPolicyLabel(meta.key)}</span>
                        </span>
                        <span className="text-xs text-slate-500">
                          Last updated: {props.risk?.lastUpdatedISO}
                        </span>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={props.onClose}
                    className="rounded-lg px-2 py-1 text-sm text-slate-500 hover:bg-slate-100"
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid flex-1 gap-6 overflow-y-auto px-5 py-5 sm:grid-cols-2">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">Summary</div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{props.risk?.advisory}</p>

                    <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="text-sm font-semibold text-slate-900">Action checklist</div>
                      <ul className="mt-3 space-y-2 text-sm text-slate-700">
                        {checklist.map((item) => (
                          <li key={item} className="flex gap-2">
                            <span className="mt-0.5 text-slate-400" aria-hidden>
                              ✓
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-slate-900">Category breakdown</div>
                    <div className="mt-3 space-y-3">
                      {props.risk &&
                        RISK_CATEGORIES.map(({ key, label }) => {
                          const c = props.risk!.categories[key]
                          const m = RISK_LEVELS[c.level]
                          return (
                            <div key={key} className="rounded-xl border border-slate-200 p-4">
                              <div className="flex items-center justify-between gap-3">
                                <div className="text-sm font-medium text-slate-900">{label}</div>
                                <div className="flex items-center gap-2">
                                  <span
                                    className="h-2.5 w-2.5 rounded-full"
                                    style={{ backgroundColor: m.colorHex }}
                                    aria-hidden
                                  />
                                  <span className="text-xs text-slate-600">{m.label}</span>
                                </div>
                              </div>
                              <p className="mt-2 text-sm leading-6 text-slate-600">{c.description}</p>
                            </div>
                          )
                        })}
                    </div>

                    <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
                      <div className="text-sm font-semibold text-slate-900">Sources</div>
                      <ul className="mt-2 space-y-1 text-sm text-slate-600">
                        {props.risk?.sources.map((s) => (
                          <li key={s.label}>
                            <a className="hover:underline" href={s.href}>
                              {s.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-3 text-xs text-slate-500">
                        Demo site uses dummy data for MVP.
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

