import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(request)
    
    // Check for Authorization header
    const authHeader = request.headers.get('authorization')
    console.log('Authorization header:', authHeader)
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    console.log('Auth user:', user)
    console.log('Auth error:', authError)
    console.log('All cookies:', request.headers.get('cookie'))
    
    // Log all cookies that start with 'sb-'
    const cookieHeader = request.headers.get('cookie')
    if (cookieHeader) {
      const cookies = cookieHeader.split(';').filter(c => c.trim().startsWith('sb-'))
      console.log('Supabase cookies:', cookies)
    }
    
    if (!user) {
      console.error('No authenticated user found in GET /api/recipes')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: recipes, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ recipes })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch recipes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(request)
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      console.error('No authenticated user found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, ingredients, instructions, cooking_time, servings, dietary_tags } = await request.json()

    console.log('Saving recipe for user:', user.id)
    console.log('Recipe data:', { title, ingredients, instructions, cooking_time, servings, dietary_tags })

    const { data: recipe, error } = await supabase
      .from('recipes')
      .insert([
        {
          user_id: user.id,
          title,
          ingredients,
          instructions,
          cooking_time,
          servings,
          dietary_tags
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('Recipe saved successfully:', recipe)
    return NextResponse.json({ recipe })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Failed to save recipe' },
      { status: 500 }
    )
  }
}
