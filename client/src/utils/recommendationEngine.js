import { motorcycles } from '../data/motorcycles.js'

const ranges = {
  'lt75': [0, 75],
  '75-100': [75, 100],
  '100-150': [100, 150],
  '150plus': [150, 999],
}

const downPayments = { zero: 0, '0-100': 100, '100-300': 300, '300plus': 9999 }

export function recommendMotorcycles(answers) {
  const [minM, maxM] = ranges[answers.monthly] || [0, 999]
  const down = downPayments[answers.down] ?? 0

  return motorcycles
    .map((moto) => {
      let score = 0
      if (moto.uses.includes(answers.use)) score += 4
      if (answers.style === 'no-se' || moto.styles.includes(answers.style)) score += 3
      if (moto.minMonthly <= maxM && moto.maxMonthly >= minM) score += 3
      if (moto.minDown <= down || answers.down === 'zero') score += 2
      return { ...moto, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
}
