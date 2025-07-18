
'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChefHat, Utensils, Clock } from "lucide-react";
import Link from "next/link";
import { supabase } from '@/lib/supabase/client'
import { GeneratedRecipe } from '@/types'
import RecipeForm from '@/components/forms/recipe-form'
import RecipeDisplay from '@/components/recipe/recipe-display'

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [generatedRecipe, setGeneratedRecipe] = useState<GeneratedRecipe | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    getUser()
  }, [])

  const handleRecipeGenerated = (recipe: GeneratedRecipe) => {
    setGeneratedRecipe(recipe)
  }

  const handleSaveRecipe = async (recipe: GeneratedRecipe) => {
    try {
      // Get the session token
      const { data: { session } } = await supabase.auth.getSession()
      console.log('Current session for saving:', session)
      
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session ? { 'Authorization': `Bearer ${session.access_token}` } : {})
        },
        body: JSON.stringify({
          title: recipe.title,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions.join('\n'),
          cooking_time: parseInt(recipe.cookingTime.replace(/\D/g, '')),
          servings: recipe.servings,
          dietary_tags: []
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Save recipe error:', errorData)
        throw new Error(errorData.error || 'Failed to save recipe')
      }

      const result = await response.json()
      console.log('Recipe saved successfully:', result)
    } catch (error) {
      console.error('Error saving recipe:', error)
      throw error
    }
  }

  const handleNewRecipe = () => {
    setGeneratedRecipe(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <ChefHat className="h-16 w-16 text-orange-600 animate-pulse" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <ChefHat className="h-8 w-8 text-orange-600" />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Recipe Generator</h1>
            </Link>
            <nav className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto">
              {user ? (
                <>
                  <span className="text-sm text-gray-600 text-center sm:text-left truncate max-w-[200px]">
                    Welcome, {user.email}
                  </span>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Link href="/dashboard" className="w-full sm:w-auto">
                      <Button variant="outline" className="w-full sm:w-auto">My Recipes</Button>
                    </Link>
                    <Button variant="outline" onClick={() => supabase.auth.signOut()} className="w-full sm:w-auto">
                      Sign Out
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <Link href="/login" className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full sm:w-auto">Login</Button>
                  </Link>
                  <Link href="/register" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto">Sign Up</Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-8 sm:py-16">
        {!generatedRecipe ? (
          <>
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                AI-Powered Recipe Creation
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto px-4">
                Transform your ingredients into delicious recipes with the power of AI. 
                Just tell us what you have, and we'll create amazing recipes for you!
              </p>
            </div>
            
            <RecipeForm onRecipeGenerated={handleRecipeGenerated} />
          </>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            <div className="text-center">
              <Button onClick={handleNewRecipe} variant="outline" className="w-full sm:w-auto">
                Generate Another Recipe
              </Button>
            </div>
            
            <RecipeDisplay
              recipe={generatedRecipe}
              onSave={user ? handleSaveRecipe : undefined}
              isLoggedIn={!!user}
            />
          </div>
        )}
      </section>

      {/* Features Section */}
      {!generatedRecipe && (
        <section className="container mx-auto px-4 py-8 sm:py-16">
          <h3 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8 sm:mb-12">
            Why Choose Our Recipe Generator?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <ChefHat className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <h4 className="text-lg sm:text-xl font-semibold mb-2">AI-Powered</h4>
                <p className="text-gray-600 text-sm sm:text-base">
                  Advanced AI creates unique recipes tailored to your ingredients and preferences
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Clock className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <h4 className="text-lg sm:text-xl font-semibold mb-2">Quick & Easy</h4>
                <p className="text-gray-600 text-sm sm:text-base">
                  Get delicious recipes in seconds with clear instructions and cooking times
                </p>
              </CardContent>
            </Card>
            <Card className="text-center sm:col-span-2 lg:col-span-1">
              <CardContent className="pt-6">
                <Utensils className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <h4 className="text-lg sm:text-xl font-semibold mb-2">Save Favorites</h4>
                <p className="text-gray-600 text-sm sm:text-base">
                  Create an account to save your favorite recipes and access them anytime
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Recipe Generator. Made with ❤️ and AI.</p>
        </div>
      </footer>
    </main>
  );
}
