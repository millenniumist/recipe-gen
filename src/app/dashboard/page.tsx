'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { supabase } from '@/lib/supabase/client'
import { Recipe } from '@/types'
import RecipeCard from '@/components/recipe/recipe-card'
import { ChefHat, Plus, LogOut, X, Clock, Users } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function DashboardPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
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
      // Get the session token
      const { data: { session } } = await supabase.auth.getSession()
      console.log('Current session:', session)
      
      const response = await fetch('/api/recipes', {
        headers: session ? {
          'Authorization': `Bearer ${session.access_token}`
        } : {}
      })
      const data = await response.json()
      
      if (response.ok) {
        setRecipes(data.recipes)
      } else {
        console.error('API error:', data)
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
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <ChefHat className="h-8 w-8 text-orange-600" />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Recipe Generator</h1>
            </Link>
            <nav className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <span className="text-sm text-gray-600 text-center sm:text-left truncate max-w-[200px]">
                Welcome, {user?.email}
              </span>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Link href="/" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full sm:w-auto">Generate New Recipe</Button>
                </Link>
                <Button variant="outline" onClick={handleSignOut} className="w-full sm:w-auto">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </nav>
          </div>
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
                onClick={(recipe) => setSelectedRecipe(recipe)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <Dialog open={!!selectedRecipe} onOpenChange={() => setSelectedRecipe(null)}>
          <DialogContent className="max-w-[95vw] sm:max-w-[90vw] md:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-2xl pr-8">{selectedRecipe.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 pt-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-600">
                {selectedRecipe.cooking_time && (
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{selectedRecipe.cooking_time} minutes</span>
                  </div>
                )}
                {selectedRecipe.servings && (
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>{selectedRecipe.servings} servings</span>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Ingredients</h3>
                <ul className="space-y-2">
                  {selectedRecipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                      <span>{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Instructions</h3>
                <div className="prose max-w-none">
                  <div className="whitespace-pre-line text-gray-700">
                    {selectedRecipe.instructions}
                  </div>
                </div>
              </div>

              {selectedRecipe.dietary_tags && selectedRecipe.dietary_tags.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Dietary Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedRecipe.dietary_tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
