describe('Simple Tests', () => {
  test('basic math', () => {
    expect(2 + 2).toBe(4)
  })

  test('string concatenation', () => {
    expect('hello' + ' world').toBe('hello world')
  })

  test('array operations', () => {
    const arr = ['a', 'b', 'c']
    expect(arr.length).toBe(3)
    expect(arr).toContain('b')
  })

  test('object properties', () => {
    const obj = { name: 'test', value: 42 }
    expect(obj).toHaveProperty('name')
    expect(obj.value).toBe(42)
  })

  test('async operation', async () => {
    const promise = Promise.resolve('success')
    await expect(promise).resolves.toBe('success')
  })
})
