import { generateRecipe } from '@/lib/gemini/client'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { ingredients, dietaryPreferences, servings } = await request.json()

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return NextResponse.json(
        { error: 'Please provide at least one ingredient' },
        { status: 400 }
      )
    }

    const recipe = await generateRecipe(ingredients, dietaryPreferences, servings)
    
    return NextResponse.json({ recipe })
  } catch (error) {
    console.error('Error generating recipe:', error)
    return NextResponse.json(
      { error: 'Failed to generate recipe. Please try again.' },
      { status: 500 }
    )
  }
}
