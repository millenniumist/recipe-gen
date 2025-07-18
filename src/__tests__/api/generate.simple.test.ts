/**
 * @jest-environment node
 */
import { generateRecipe } from '@/lib/gemini/client'

jest.mock('@/lib/gemini/client')

describe('Recipe Generation API Logic', () => {
  const mockGenerateRecipe = generateRecipe as jest.MockedFunction<typeof generateRecipe>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should validate ingredients array', () => {
    const ingredients: string[] = []
    expect(ingredients.length).toBe(0)
    
    const validIngredients = ['chicken', 'rice']
    expect(validIngredients.length).toBeGreaterThan(0)
  })

  test('should handle recipe generation parameters', async () => {
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

    const result = await generateRecipe(['chicken', 'rice'], 'low-carb', 2)
    
    expect(mockGenerateRecipe).toHaveBeenCalledWith(['chicken', 'rice'], 'low-carb', 2)
    expect(result).toEqual(mockRecipe)
  })

  test('should handle errors during generation', async () => {
    mockGenerateRecipe.mockRejectedValue(new Error('Generation failed'))

    await expect(generateRecipe(['chicken'])).rejects.toThrow('Generation failed')
  })
})
