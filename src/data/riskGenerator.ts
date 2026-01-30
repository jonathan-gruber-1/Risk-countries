import type { RiskCategory, RiskLevel } from '../lib/risk'
import { worstRisk } from '../lib/risk'

export type CategoryRisk = {
  category: RiskCategory
  level: RiskLevel
  description: string
}

export type CountryRisk = {
  id: number
  name: string
  flagEmoji?: string
  overall: RiskLevel
  categories: Record<RiskCategory, CategoryRisk>
  sources: Array<{ label: string; href: string }>
  lastUpdatedISO: string
  advisory: string
}

function hashStringToUint32(input: string): number {
  // FNV-1a 32-bit
  let h = 0x811c9dc5
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

function mulberry32(seed: number): () => number {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pickLevel(r: number): RiskLevel {
  // Weighted to look realistic for a business-travel demo.
  if (r < 0.55) return 'green'
  if (r < 0.80) return 'yellow'
  if (r < 0.93) return 'orange'
  return 'red'
}

function categoryDescription(category: RiskCategory, level: RiskLevel): string {
  const base =
    category === 'security'
      ? 'Security conditions can vary by region, time, and local events.'
      : category === 'health'
        ? 'Health risks depend on seasonality, local capacity, and access to care.'
        : 'Political conditions may change quickly during elections, protests, or policy shifts.'

  const add =
    level === 'green'
      ? ' Routine precautions are generally sufficient for business travel.'
      : level === 'yellow'
        ? ' Maintain heightened situational awareness and confirm local guidance.'
        : level === 'orange'
          ? ' Plan mitigations in advance and consider restricting movement and night travel.'
          : ' Avoid non-essential travel; conditions may be volatile and hard to mitigate.'

  return base + add
}

function overallAdvisory(overall: RiskLevel): string {
  switch (overall) {
    case 'green':
      return 'Proceed with standard corporate travel practices. Confirm entry requirements and keep a basic communications plan.'
    case 'yellow':
      return 'Proceed with increased caution. Align itinerary with local guidance, avoid known hotspots, and confirm escalation contacts.'
    case 'orange':
      return 'Travel should be reconsidered unless essential. A security review and mitigation plan is recommended before booking.'
    case 'red':
      return 'Do not travel. Conditions are considered high-risk and difficult to mitigate reliably for routine business travel.'
  }
}

function recentDateISO(rand: () => number): string {
  const daysAgo = Math.floor(rand() * 30) // 0..29
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d.toISOString().slice(0, 10)
}

export function generateCountryRisk(input: {
  id: number
  name: string
  flagEmoji?: string
}): CountryRisk {
  const seed = hashStringToUint32(`${input.id}:${input.name}`)
  const rand = mulberry32(seed)

  const security = pickLevel(rand())
  const health = pickLevel(rand())
  const political = pickLevel(rand())

  const overall = worstRisk([security, health, political])

  const categories: Record<RiskCategory, CategoryRisk> = {
    security: {
      category: 'security',
      level: security,
      description: categoryDescription('security', security),
    },
    health: {
      category: 'health',
      level: health,
      description: categoryDescription('health', health),
    },
    political: {
      category: 'political',
      level: political,
      description: categoryDescription('political', political),
    },
  }

  return {
    id: input.id,
    name: input.name,
    flagEmoji: input.flagEmoji,
    overall,
    categories,
    sources: [
      { label: 'US State Department', href: '#' },
      { label: 'UK Foreign Office', href: '#' },
      { label: 'France Diplomatie', href: '#' },
    ],
    lastUpdatedISO: recentDateISO(rand),
    advisory: overallAdvisory(overall),
  }
}

