'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase/client'
import { Recipe } from '@/types'
import RecipeCard from '@/components/recipe/recipe-card'
import { ChefHat, Plus, LogOut } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function DashboardPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)
      fetchRecipes()
    }

    getUser()
  }, [router])

  const fetchRecipes = async () => {
    try {
      const response = await fetch('/api/recipes')
      const data = await response.json()
      
      if (response.ok) {
        setRecipes(data.recipes)
      }
    } catch (error) {
      console.error('Error fetching recipes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteRecipe = async (id: string) => {
    try {
      const response = await fetch(`/api/recipes/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setRecipes(recipes.filter(recipe => recipe.id !== id))
      }
    } catch (error) {
      console.error('Error deleting recipe:', error)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <ChefHat className="h-16 w-16 text-orange-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading your recipes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <ChefHat className="h-8 w-8 text-orange-600" />
            <h1 className="text-2xl font-bold text-gray-900">Recipe Generator</h1>
          </div>
          <nav className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Welcome, {user?.email}</span>
            <Link href="/">
              <Button variant="outline">Generate New Recipe</Button>
            </Link>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Saved Recipes</h2>
          <p className="text-gray-600">Manage and view all your favorite recipes</p>
        </div>

        {recipes.length === 0 ? (
          <Card className="max-w-2xl mx-auto text-center">
            <CardHeader>
              <CardTitle className="text-2xl">No Recipes Yet</CardTitle>
              <CardDescription>
                Start by generating your first recipe!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/">
                <Button size="lg">
                  <Plus className="mr-2 h-4 w-4" />
                  Generate Your First Recipe
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onDelete={handleDeleteRecipe}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
