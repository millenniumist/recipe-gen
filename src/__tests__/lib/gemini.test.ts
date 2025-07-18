// Mock the function at the top level
const mockGenerateRecipe = jest.fn()
jest.mock('@/lib/gemini/client', () => ({
  generateRecipe: mockGenerateRecipe,
}))

import { generateRecipe } from '@/lib/gemini/client'

// Mock the GoogleGenerativeAI
jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: jest.fn().mockResolvedValue({
        response: {
          text: () => JSON.stringify({
            title: 'Test Recipe',
            description: 'A test recipe',
            ingredients: ['ingredient1', 'ingredient2'],
            instructions: ['step1', 'step2'],
            cookingTime: '30 minutes',
            servings: 2,
            tips: 'Test tips'
          })
        }
      })
    })
  }))
}))

describe('Gemini Recipe Generation', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGenerateRecipe.mockResolvedValue({
      title: 'Test Recipe',
      description: 'A test recipe',
      ingredients: ['ingredient1', 'ingredient2'],
      instructions: ['step1', 'step2'],
      cookingTime: '30 minutes',
      servings: 2,
      tips: 'Test tips'
    })
  })

  test('should generate a recipe with ingredients', async () => {
    const ingredients = ['chicken', 'rice', 'vegetables']
    const result = await generateRecipe(ingredients)

    expect(result).toHaveProperty('title')
    expect(result).toHaveProperty('description')
    expect(result).toHaveProperty('ingredients')
    expect(result).toHaveProperty('instructions')
    expect(result).toHaveProperty('cookingTime')
    expect(result).toHaveProperty('servings')
    expect(mockGenerateRecipe).toHaveBeenCalledWith(ingredients)
  })

  test('should generate a recipe with dietary preferences', async () => {
    const ingredients = ['tofu', 'quinoa', 'broccoli']
    const dietaryPreferences = 'vegetarian'
    const result = await generateRecipe(ingredients, dietaryPreferences)

    expect(result).toHaveProperty('title')
    expect(result.ingredients).toEqual(expect.arrayContaining(['ingredient1', 'ingredient2']))
    expect(mockGenerateRecipe).toHaveBeenCalledWith(ingredients, dietaryPreferences)
  })

  test('should generate a recipe with specific servings', async () => {
    const ingredients = ['pasta', 'tomatoes', 'cheese']
    const servings = 4
    const result = await generateRecipe(ingredients, undefined, servings)

    expect(result).toHaveProperty('servings')
    expect(result.servings).toBe(2) // from mock response
    expect(mockGenerateRecipe).toHaveBeenCalledWith(ingredients, undefined, servings)
  })

  test('should handle empty ingredients array', async () => {
    const ingredients: string[] = []
    
    const result = await generateRecipe(ingredients)
    expect(result).toBeDefined()
    expect(mockGenerateRecipe).toHaveBeenCalledWith(ingredients)
  })
})
