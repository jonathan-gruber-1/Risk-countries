import world from 'world-atlas/countries-110m.json'
import { feature } from 'topojson-client'
import isoCountries from 'i18n-iso-countries'
import en from 'i18n-iso-countries/langs/en.json'
import type { Feature, FeatureCollection, Geometry } from 'geojson'
import type { GeometryCollection, Topology } from 'topojson-specification'

isoCountries.registerLocale(en)

type CountryProps = { name?: string }
type CountryGeo = Feature<Geometry, CountryProps>

export type CountryFeature = {
  id: number
  name: string
  alpha2?: string
  flagEmoji?: string
  geo: CountryGeo
}

function alpha2ToFlagEmoji(alpha2: string): string | undefined {
  const code = alpha2.toUpperCase()
  if (!/^[A-Z]{2}$/.test(code)) return undefined
  const A = 65
  const base = 0x1f1e6
  const first = base + (code.charCodeAt(0) - A)
  const second = base + (code.charCodeAt(1) - A)
  return String.fromCodePoint(first, second)
}

const worldTopo = world as unknown as Topology<{ countries: GeometryCollection }>
const countriesFc = feature(
  worldTopo,
  worldTopo.objects.countries,
) as FeatureCollection<Geometry, CountryProps>

export const COUNTRIES: CountryFeature[] = (countriesFc.features ?? [])
  .map((geo) => {
    const idRaw = geo.id
    const idCandidate =
      typeof idRaw === 'string'
        ? Number.parseInt(idRaw, 10)
        : typeof idRaw === 'number'
          ? idRaw
          : Number.NaN
    const name = geo.properties?.name
    if (!Number.isFinite(idCandidate) || !name) return null
    const id = idCandidate

    const alpha2 = isoCountries.numericToAlpha2(String(id)) || undefined
    const flagEmoji = alpha2 ? alpha2ToFlagEmoji(alpha2) : undefined

    return { id, name, alpha2, flagEmoji, geo } satisfies CountryFeature
  })
  .filter(Boolean) as CountryFeature[]

export const COUNTRIES_BY_ID = new Map<number, CountryFeature>(COUNTRIES.map((c) => [c.id, c]))

