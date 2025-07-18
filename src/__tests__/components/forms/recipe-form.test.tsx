import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import RecipeForm from '@/components/forms/recipe-form'
import { GeneratedRecipe } from '@/types'

// Mock fetch
global.fetch = jest.fn()

describe('RecipeForm', () => {
  const mockOnRecipeGenerated = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(fetch as jest.Mock).mockClear()
  })

  test('renders form elements correctly', () => {
    render(<RecipeForm onRecipeGenerated={mockOnRecipeGenerated} />)

    expect(screen.getByLabelText(/ingredients/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/dietary preferences/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/servings/i)).toBeInTheDocument()
    expect(screen.getByText(/generate recipe/i)).toBeInTheDocument()
  })

  test('shows error when no ingredients are entered', async () => {
    render(<RecipeForm onRecipeGenerated={mockOnRecipeGenerated} />)

    const submitButton = screen.getByText(/generate recipe/i)
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent(
        /please enter at least one ingredient/i
      )
    })
  })

  test('submits form with correct data', async () => {
    const mockRecipe: GeneratedRecipe = {
      title: 'Test Recipe',
      description: 'A test recipe',
      ingredients: ['chicken', 'rice'],
      instructions: ['step 1', 'step 2'],
      cookingTime: '30 minutes',
      servings: 2,
      tips: 'Test tips'
    }

    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ recipe: mockRecipe })
    })

    render(<RecipeForm onRecipeGenerated={mockOnRecipeGenerated} />)

    const ingredientsInput = screen.getByLabelText(/ingredients/i)
    const dietaryInput = screen.getByLabelText(/dietary preferences/i)
    const servingsInput = screen.getByLabelText(/servings/i)
    const submitButton = screen.getByText(/generate recipe/i)

    fireEvent.change(ingredientsInput, { target: { value: 'chicken, rice, vegetables' } })
    fireEvent.change(dietaryInput, { target: { value: 'low-carb' } })
    fireEvent.change(servingsInput, { target: { value: '4' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredients: ['chicken', 'rice', 'vegetables'],
          dietaryPreferences: 'low-carb',
          servings: 4,
        }),
      })
    })

    await waitFor(() => {
      expect(mockOnRecipeGenerated).toHaveBeenCalledWith(mockRecipe)
    })
  })

  test('shows loading state during submission', async () => {
    ;(fetch as jest.Mock).mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

    render(<RecipeForm onRecipeGenerated={mockOnRecipeGenerated} />)

    const ingredientsInput = screen.getByLabelText(/ingredients/i)
    const submitButton = screen.getByText(/generate recipe/i)

    fireEvent.change(ingredientsInput, { target: { value: 'chicken, rice' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/generating recipe/i)).toBeInTheDocument()
    })
  })

  test('handles API errors gracefully', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'API Error' })
    })

    render(<RecipeForm onRecipeGenerated={mockOnRecipeGenerated} />)

    const ingredientsInput = screen.getByLabelText(/ingredients/i)
    const submitButton = screen.getByText(/generate recipe/i)

    fireEvent.change(ingredientsInput, { target: { value: 'chicken, rice' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/api error/i)).toBeInTheDocument()
    })
  })
})
