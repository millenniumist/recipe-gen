import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = process.env.GEMINI_API_KEY || 'placeholder-key'
const genAI = new GoogleGenerativeAI(apiKey)

export const geminiModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

export async function generateRecipe(ingredients: string[], dietaryPreferences?: string, servings?: number) {
  const prompt = `
    Create a delicious recipe using the following ingredients: ${ingredients.join(', ')}.
    ${dietaryPreferences ? `Dietary preferences: ${dietaryPreferences}` : ''}
    ${servings ? `Number of servings: ${servings}` : ''}
    
    Please provide a structured recipe with:
    1. A catchy recipe title
    2. A brief description
    3. List of ingredients with measurements
    4. Step-by-step cooking instructions
    5. Estimated cooking time
    6. Any helpful tips or variations
    
    Format the response as a JSON object with the following structure:
    {
      "title": "Recipe Title",
      "description": "Brief description",
      "ingredients": ["ingredient 1", "ingredient 2", ...],
      "instructions": ["step 1", "step 2", ...],
      "cookingTime": "XX minutes",
      "servings": X,
      "tips": "Optional tips"
    }
  `
  
  try {
    const result = await geminiModel.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    // Try to parse JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    
    // Fallback if JSON parsing fails
    return {
      title: 'Generated Recipe',
      description: 'A delicious recipe created with your ingredients',
      ingredients: ingredients,
      instructions: [text],
      cookingTime: '30 minutes',
      servings: servings || 2,
      tips: 'Enjoy your meal!'
    }
  } catch (error) {
    console.error('Error generating recipe:', error)
    throw new Error('Failed to generate recipe')
  }
}
