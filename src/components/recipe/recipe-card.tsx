import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Recipe } from '@/types'
import { Clock, Users, Trash2 } from 'lucide-react'

interface RecipeCardProps {
  recipe: Recipe
  onDelete?: (id: string) => void
}

export default function RecipeCard({ recipe, onDelete }: RecipeCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{recipe.title}</CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Created on {formatDate(recipe.created_at)}
            </CardDescription>
          </div>
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(recipe.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          {recipe.cooking_time && (
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{recipe.cooking_time} min</span>
            </div>
          )}
          {recipe.servings && (
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{recipe.servings} servings</span>
            </div>
          )}
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Ingredients:</h4>
          <div className="flex flex-wrap gap-1">
            {recipe.ingredients.slice(0, 5).map((ingredient, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {ingredient}
              </Badge>
            ))}
            {recipe.ingredients.length > 5 && (
              <Badge variant="outline" className="text-xs">
                +{recipe.ingredients.length - 5} more
              </Badge>
            )}
          </div>
        </div>

        {recipe.dietary_tags && recipe.dietary_tags.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Dietary Tags:</h4>
            <div className="flex flex-wrap gap-1">
              {recipe.dietary_tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        <div>
          <h4 className="font-medium mb-2">Instructions:</h4>
          <p className="text-sm text-gray-700 line-clamp-3">{recipe.instructions}</p>
        </div>
      </CardContent>
    </Card>
  )
}
