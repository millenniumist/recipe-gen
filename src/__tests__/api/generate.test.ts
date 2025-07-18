import { POST } from '@/app/api/generate/route'
import { generateRecipe } from '@/lib/gemini/client'
import { NextRequest } from 'next/server'

jest.mock('@/lib/gemini/client')

describe('/api/generate', () => {
  const mockGenerateRecipe = generateRecipe as jest.MockedFunction<typeof generateRecipe>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('generates recipe with valid ingredients', async () => {
    const mockRecipe = {
      title: 'Test Recipe',
      description: 'A test recipe',
      ingredients: ['chicken', 'rice'],
      instructions: ['step 1', 'step 2'],
      cookingTime: '30 minutes',
      servings: 2,
      tips: 'Test tips'
    }

    mockGenerateRecipe.mockResolvedValue(mockRecipe)

    const request = new NextRequest('http://localhost:3000/api/generate', {
      method: 'POST',
      body: JSON.stringify({
        ingredients: ['chicken', 'rice'],
        dietaryPreferences: 'low-carb',
        servings: 2
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.recipe).toEqual(mockRecipe)
    expect(mockGenerateRecipe).toHaveBeenCalledWith(
      ['chicken', 'rice'],
      'low-carb',
      2
    )
  })

  test('returns error for empty ingredients', async () => {
    const request = new NextRequest('http://localhost:3000/api/generate', {
      method: 'POST',
      body: JSON.stringify({
        ingredients: [],
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Please provide at least one ingredient')
  })

  test('returns error for missing ingredients', async () => {
    const request = new NextRequest('http://localhost:3000/api/generate', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Please provide at least one ingredient')
  })

  test('handles generation errors', async () => {
    mockGenerateRecipe.mockRejectedValue(new Error('Generation failed'))

    const request = new NextRequest('http://localhost:3000/api/generate', {
      method: 'POST',
      body: JSON.stringify({
        ingredients: ['chicken', 'rice'],
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Failed to generate recipe. Please try again.')
  })

  test('generates recipe with only ingredients', async () => {
    const mockRecipe = {
      title: 'Simple Recipe',
      description: 'A simple recipe',
      ingredients: ['pasta'],
      instructions: ['cook pasta'],
      cookingTime: '15 minutes',
      servings: 1,
    }

    mockGenerateRecipe.mockResolvedValue(mockRecipe)

    const request = new NextRequest('http://localhost:3000/api/generate', {
      method: 'POST',
      body: JSON.stringify({
        ingredients: ['pasta'],
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(mockGenerateRecipe).toHaveBeenCalledWith(
      ['pasta'],
      undefined,
      undefined
    )
  })
})
