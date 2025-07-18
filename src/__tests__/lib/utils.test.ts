import { cn } from '@/lib/utils'

describe('Utils', () => {
  test('cn function should merge classnames correctly', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2')
    expect(cn('class1', undefined, 'class2')).toBe('class1 class2')
    expect(cn('class1', false && 'class2', 'class3')).toBe('class1 class3')
  })

  test('cn function should handle conditional classes', () => {
    const isActive = true
    const result = cn('base-class', {
      'active-class': isActive,
      'inactive-class': !isActive
    })
    expect(result).toContain('base-class')
    expect(result).toContain('active-class')
    expect(result).not.toContain('inactive-class')
  })

  test('cn function should handle tailwind merge', () => {
    const result = cn('px-2 py-1', 'px-4')
    expect(result).toBe('py-1 px-4')
  })
})
