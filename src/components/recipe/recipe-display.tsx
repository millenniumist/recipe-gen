'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { GeneratedRecipe } from '@/types'
import { Clock, Users, Heart, Loader2, CheckCircle } from 'lucide-react'

interface RecipeDisplayProps {
  recipe: GeneratedRecipe
  onSave?: (recipe: GeneratedRecipe) => void
  isLoggedIn?: boolean
}

export default function RecipeDisplay({ recipe, onSave, isLoggedIn }: RecipeDisplayProps) {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    if (!onSave) return
    
    setSaving(true)
    try {
      await onSave(recipe)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Error saving recipe:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-3xl">{recipe.title}</CardTitle>
            <CardDescription className="text-lg mt-2">
              {recipe.description}
            </CardDescription>
          </div>
          {isLoggedIn && onSave && (
            <Button
              onClick={handleSave}
              disabled={saving || saved}
              variant={saved ? "default" : "outline"}
              className={saved ? "bg-green-600 hover:bg-green-700" : ""}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : saved ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Saved!
                </>
              ) : (
                <>
                  <Heart className="mr-2 h-4 w-4" />
                  Save Recipe
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-6 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>{recipe.cookingTime}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>{recipe.servings} servings</span>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Ingredients</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {recipe.ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                <span>{ingredient}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Instructions</h3>
          <ol className="space-y-3">
            {recipe.instructions.map((instruction, index) => (
              <li key={index} className="flex space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </span>
                <span className="pt-0.5">{instruction}</span>
              </li>
            ))}
          </ol>
        </div>

        {recipe.tips && (
          <div>
            <h3 className="text-xl font-semibold mb-3">Tips</h3>
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-gray-700">{recipe.tips}</p>
            </div>
          </div>
        )}

        {!isLoggedIn && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-blue-800">
              <strong>Create an account</strong> to save your favorite recipes and access them anytime!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
