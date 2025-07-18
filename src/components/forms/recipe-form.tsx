'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Utensils, Loader2 } from 'lucide-react'
import { GeneratedRecipe } from '@/types'

interface RecipeFormProps {
  onRecipeGenerated: (recipe: GeneratedRecipe) => void
}

export default function RecipeForm({ onRecipeGenerated }: RecipeFormProps) {
  const [ingredients, setIngredients] = useState('')
  const [dietaryPreferences, setDietaryPreferences] = useState('')
  const [servings, setServings] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const ingredientsList = ingredients.split(',').map(i => i.trim()).filter(Boolean)
      
      if (ingredientsList.length === 0) {
        setError('Please enter at least one ingredient')
        return
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredients: ingredientsList,
          dietaryPreferences: dietaryPreferences || undefined,
          servings: servings ? parseInt(servings) : undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate recipe')
      }

      onRecipeGenerated(data.recipe)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate recipe')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-center space-x-2">
          <Utensils className="h-5 w-5" />
          <span>Generate Your Recipe</span>
        </CardTitle>
        <CardDescription>
          Enter your ingredients and dietary preferences to get started
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ingredients">Ingredients *</Label>
              <Textarea
                id="ingredients"
                placeholder="e.g., chicken breast, broccoli, rice, garlic..."
                className="resize-none"
                rows={3}
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dietary">Dietary Preferences</Label>
              <Input
                id="dietary"
                placeholder="e.g., vegetarian, gluten-free, keto..."
                value={dietaryPreferences}
                onChange={(e) => setDietaryPreferences(e.target.value)}
              />
              <div className="space-y-2">
                <Label htmlFor="servings">Servings</Label>
                <Input
                  id="servings"
                  type="number"
                  placeholder="2"
                  min="1"
                  max="12"
                  value={servings}
                  onChange={(e) => setServings(e.target.value)}
                />
              </div>
            </div>
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Recipe...
              </>
            ) : (
              'Generate Recipe'
            )}
          </Button>
        </CardContent>
      </form>
    </Card>
  )
}
