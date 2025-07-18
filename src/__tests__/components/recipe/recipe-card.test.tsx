import { render, screen, fireEvent } from '@testing-library/react'
import RecipeCard from '@/components/recipe/recipe-card'
import { Recipe } from '@/types'

describe('RecipeCard', () => {
  const mockRecipe: Recipe = {
    id: '1',
    user_id: 'user1',
    title: 'Test Recipe',
    ingredients: ['chicken', 'rice', 'vegetables'],
    instructions: 'Cook everything together',
    cooking_time: 30,
    servings: 4,
    dietary_tags: ['healthy', 'gluten-free'],
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-01-01T10:00:00Z'
  }

  test('renders recipe card with all information', () => {
    render(<RecipeCard recipe={mockRecipe} />)

    expect(screen.getByText('Test Recipe')).toBeInTheDocument()
    expect(screen.getByText('30 min')).toBeInTheDocument()
    expect(screen.getByText('4 servings')).toBeInTheDocument()
    expect(screen.getByText('chicken')).toBeInTheDocument()
    expect(screen.getByText('rice')).toBeInTheDocument()
    expect(screen.getByText('vegetables')).toBeInTheDocument()
    expect(screen.getByText('healthy')).toBeInTheDocument()
    expect(screen.getByText('gluten-free')).toBeInTheDocument()
  })

  test('formats creation date correctly', () => {
    render(<RecipeCard recipe={mockRecipe} />)

    expect(screen.getByText(/created on/i)).toBeInTheDocument()
    expect(screen.getByText(/1\/1\/2024/)).toBeInTheDocument()
  })

  test('shows limited ingredients with more indicator', () => {
    const recipeWithManyIngredients = {
      ...mockRecipe,
      ingredients: ['ing1', 'ing2', 'ing3', 'ing4', 'ing5', 'ing6', 'ing7']
    }

    render(<RecipeCard recipe={recipeWithManyIngredients} />)

    expect(screen.getByText('ing1')).toBeInTheDocument()
    expect(screen.getByText('ing5')).toBeInTheDocument()
    expect(screen.getByText('+2 more')).toBeInTheDocument()
  })

  test('shows delete button when onDelete is provided', () => {
    const mockOnDelete = jest.fn()
    render(<RecipeCard recipe={mockRecipe} onDelete={mockOnDelete} />)

    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  test('calls onDelete when delete button is clicked', () => {
    const mockOnDelete = jest.fn()
    render(<RecipeCard recipe={mockRecipe} onDelete={mockOnDelete} />)

    const deleteButton = screen.getByRole('button')
    fireEvent.click(deleteButton)

    expect(mockOnDelete).toHaveBeenCalledWith('1')
  })

  test('does not show delete button when onDelete is not provided', () => {
    render(<RecipeCard recipe={mockRecipe} />)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  test('truncates long instructions', () => {
    const recipeWithLongInstructions = {
      ...mockRecipe,
      instructions: 'This is a very long instruction that should be truncated because it exceeds the maximum length that should be displayed in the card component.'
    }

    render(<RecipeCard recipe={recipeWithLongInstructions} />)

    const instructionsElement = screen.getByText(/this is a very long instruction/i)
    expect(instructionsElement).toHaveClass('line-clamp-3')
  })
})
