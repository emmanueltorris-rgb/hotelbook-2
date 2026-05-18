import { describe, it, expect } from 'vitest'
import { cn, formatPrice, formatDate } from '../lib/utils'

describe('Utils', () => {
  describe('cn', () => {
    it('should merge class names', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2')
    })

    it('should handle conditional classes', () => {
      expect(cn('base', true && 'active', false && 'inactive')).toBe('base active')
    })

    it('should merge tailwind classes', () => {
      expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
    })
  })

  describe('formatPrice', () => {
    it('should format price in KES', () => {
      expect(formatPrice(18500)).toContain('KES')
      expect(formatPrice(18500)).toContain('18,500')
    })

    it('should format price in USD', () => {
      expect(formatPrice(100, 'USD')).toContain('USD')
      expect(formatPrice(100, 'USD')).toContain('100')
    })
  })

  describe('formatDate', () => {
    it('should format date string', () => {
      const result = formatDate('2024-12-25')
      expect(result).toContain('December')
      expect(result).toContain('25')
      expect(result).toContain('2024')
    })

    it('should format Date object', () => {
      const date = new Date('2024-06-15')
      const result = formatDate(date)
      expect(result).toContain('June')
      expect(result).toContain('15')
    })
  })
})
