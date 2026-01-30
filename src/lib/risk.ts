export type RiskCategory = 'security' | 'health' | 'political'

export const RISK_CATEGORIES: Array<{ key: RiskCategory; label: string }> = [
  { key: 'security', label: 'Security' },
  { key: 'health', label: 'Health' },
  { key: 'political', label: 'Political stability' },
]

export type RiskLevel = 'green' | 'yellow' | 'orange' | 'red'

export type RiskLevelMeta = {
  key: RiskLevel
  label: string
  policyLabel: string
  colorHex: string
  bgClass: string
  textClass: string
  ringClass: string
}

export const RISK_LEVELS: Record<RiskLevel, RiskLevelMeta> = {
  green: {
    key: 'green',
    label: 'Normal precautions',
    policyLabel: 'Standard travel',
    colorHex: '#10b981',
    bgClass: 'bg-emerald-500',
    textClass: 'text-emerald-700',
    ringClass: 'ring-emerald-200',
  },
  yellow: {
    key: 'yellow',
    label: 'Exercise increased caution',
    policyLabel: 'Manager approval recommended',
    colorHex: '#fbbf24',
    bgClass: 'bg-amber-400',
    textClass: 'text-amber-800',
    ringClass: 'ring-amber-200',
  },
  orange: {
    key: 'orange',
    label: 'Reconsider travel',
    policyLabel: 'Security review required',
    colorHex: '#f97316',
    bgClass: 'bg-orange-500',
    textClass: 'text-orange-800',
    ringClass: 'ring-orange-200',
  },
  red: {
    key: 'red',
    label: 'Do not travel',
    policyLabel: 'Travel prohibited',
    colorHex: '#ef4444',
    bgClass: 'bg-red-500',
    textClass: 'text-red-800',
    ringClass: 'ring-red-200',
  },
}

const SEVERITY: Record<RiskLevel, number> = {
  green: 0,
  yellow: 1,
  orange: 2,
  red: 3,
}

export function worstRisk(levels: RiskLevel[]): RiskLevel {
  return levels.reduce((worst, next) => (SEVERITY[next] > SEVERITY[worst] ? next : worst), 'green')
}

export function formatRiskLabel(level: RiskLevel): string {
  return RISK_LEVELS[level].label
}

export function formatPolicyLabel(level: RiskLevel): string {
  return RISK_LEVELS[level].policyLabel
}

