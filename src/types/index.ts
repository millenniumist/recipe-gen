export interface Recipe {
  id: string
  user_id: string
  title: string
  ingredients: string[]
  instructions: string
  cooking_time?: number
  servings?: number
  dietary_tags?: string[]
  created_at: string
  updated_at: string
}

export interface RecipeFormData {
  ingredients: string
  dietaryPreferences?: string
  servings?: number
}

export interface GeneratedRecipe {
  title: string
  description: string
  ingredients: string[]
  instructions: string[]
  cookingTime: string
  servings: number
  tips?: string
}
