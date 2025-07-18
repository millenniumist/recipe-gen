import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import RecipeDisplay from '@/components/recipe/recipe-display'
import { GeneratedRecipe } from '@/types'

describe('RecipeDisplay', () => {
  const mockRecipe: GeneratedRecipe = {
    title: 'Test Recipe',
    description: 'A delicious test recipe',
    ingredients: ['2 cups rice', '1 lb chicken', '1 cup vegetables'],
    instructions: ['Cook rice', 'Grill chicken', 'Steam vegetables', 'Combine all'],
    cookingTime: '45 minutes',
    servings: 4,
    tips: 'Season to taste'
  }

  test('renders recipe information correctly', () => {
    render(<RecipeDisplay recipe={mockRecipe} />)

    expect(screen.getByText('Test Recipe')).toBeInTheDocument()
    expect(screen.getByText('A delicious test recipe')).toBeInTheDocument()
    expect(screen.getByText('45 minutes')).toBeInTheDocument()
    expect(screen.getByText('4 servings')).toBeInTheDocument()
    expect(screen.getByText('Season to taste')).toBeInTheDocument()
  })

  test('renders ingredients list', () => {
    render(<RecipeDisplay recipe={mockRecipe} />)

    expect(screen.getByText('2 cups rice')).toBeInTheDocument()
    expect(screen.getByText('1 lb chicken')).toBeInTheDocument()
    expect(screen.getByText('1 cup vegetables')).toBeInTheDocument()
  })

  test('renders instructions with numbered steps', () => {
    render(<RecipeDisplay recipe={mockRecipe} />)

    expect(screen.getByText('Cook rice')).toBeInTheDocument()
    expect(screen.getByText('Grill chicken')).toBeInTheDocument()
    expect(screen.getByText('Steam vegetables')).toBeInTheDocument()
    expect(screen.getByText('Combine all')).toBeInTheDocument()
  })

  test('shows save button when user is logged in', () => {
    const mockOnSave = jest.fn()
    render(<RecipeDisplay recipe={mockRecipe} onSave={mockOnSave} isLoggedIn={true} />)

    expect(screen.getByText(/save recipe/i)).toBeInTheDocument()
  })

  test('shows create account message when user is not logged in', () => {
    render(<RecipeDisplay recipe={mockRecipe} isLoggedIn={false} />)

    expect(screen.getByText(/create an account/i)).toBeInTheDocument()
  })

  test('handles save recipe action', async () => {
    const mockOnSave = jest.fn().mockResolvedValue(undefined)
    render(<RecipeDisplay recipe={mockRecipe} onSave={mockOnSave} isLoggedIn={true} />)

    const saveButton = screen.getByText(/save recipe/i)
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(mockRecipe)
    })

    await waitFor(() => {
      expect(screen.getByText(/saved!/i)).toBeInTheDocument()
    })
  })

  test('shows loading state during save', async () => {
    const mockOnSave = jest.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    render(<RecipeDisplay recipe={mockRecipe} onSave={mockOnSave} isLoggedIn={true} />)

    const saveButton = screen.getByText(/save recipe/i)
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(screen.getByText(/saving/i)).toBeInTheDocument()
    })
  })

  test('handles save error gracefully', async () => {
    const mockOnSave = jest.fn().mockRejectedValue(new Error('Save failed'))
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    render(<RecipeDisplay recipe={mockRecipe} onSave={mockOnSave} isLoggedIn={true} />)

    const saveButton = screen.getByText(/save recipe/i)
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error saving recipe:', expect.any(Error))
    })

    consoleSpy.mockRestore()
  })
})
