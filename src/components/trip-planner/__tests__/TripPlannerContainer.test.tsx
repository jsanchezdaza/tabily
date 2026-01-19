import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import TripPlannerContainer from '../TripPlannerContainer'

const mockNextStep = vi.fn()
const mockPreviousStep = vi.fn()
const mockUpdateFormData = vi.fn()
const mockCreateTrip = vi.fn()
const mockGenerate = vi.fn()

let mockCurrentStep = 1
let mockFormData = {
  destination: '',
  start_date: '',
  end_date: '',
  budget_preference: '',
}
let mockIsLoading = false
let mockError: string | null = null
let mockPlan: string | null = null

vi.mock('../../../hooks/useTripPlannerState', () => ({
  useTripPlannerState: () => ({
    currentStep: mockCurrentStep,
    formData: mockFormData,
    nextStep: mockNextStep,
    previousStep: mockPreviousStep,
    updateFormData: mockUpdateFormData,
  }),
}))

vi.mock('../../../hooks/useCreateTrip', () => ({
  useCreateTrip: () => ({
    loading: false,
    createTrip: mockCreateTrip,
  }),
}))

vi.mock('../../../hooks/useGeneratePlan', () => ({
  useGeneratePlan: () => ({
    isLoading: mockIsLoading,
    error: mockError,
    plan: mockPlan,
    generate: mockGenerate,
  }),
}))

function renderContainer() {
  return render(
    <BrowserRouter>
      <TripPlannerContainer />
    </BrowserRouter>
  )
}

describe('TripPlannerContainer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockCurrentStep = 1
    mockFormData = {
      destination: '',
      start_date: '',
      end_date: '',
      budget_preference: '',
    }
    mockIsLoading = false
    mockError = null
    mockPlan = null
  })

  it('uses responsive padding on the card', () => {
    renderContainer()

    const card = screen.getByTestId('trip-planner-card')
    expect(card).toHaveClass('p-6', 'sm:p-8')
  })
})

describe('TripPlannerContainer plan generation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockCurrentStep = 3
    mockFormData = {
      destination: 'Paris',
      start_date: '2024-06-01',
      end_date: '2024-06-07',
      budget_preference: 'moderate',
    }
    mockIsLoading = false
    mockError = null
    mockPlan = null
    mockCreateTrip.mockResolvedValue('trip-123')
  })

  it('shows generating message after form submission', async () => {
    mockGenerate.mockImplementation(() => new Promise(() => {})) // Never resolves to keep loading

    renderContainer()

    const submitButton = screen.getByRole('button', { name: /plan my trip/i })
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/creating your personalized travel plan/i)).toBeInTheDocument()
    })
  })

  it('shows TripPlanResult when plan is ready', async () => {
    mockGenerate.mockResolvedValue(undefined)
    mockPlan = 'Your trip to Paris...'

    renderContainer()

    const submitButton = screen.getByRole('button', { name: /plan my trip/i })
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/your trip to paris/i)).toBeInTheDocument()
    })
  })

  it('shows error message when generation fails', async () => {
    mockGenerate.mockResolvedValue(undefined)
    mockError = 'Failed to generate plan'

    renderContainer()

    const submitButton = screen.getByRole('button', { name: /plan my trip/i })
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/failed to generate plan/i)).toBeInTheDocument()
    })
  })

  it('resets to form when clicking plan another trip', async () => {
    mockGenerate.mockResolvedValue(undefined)
    mockPlan = 'Your trip to Paris...'

    renderContainer()

    const submitButton = screen.getByRole('button', { name: /plan my trip/i })
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/your trip to paris/i)).toBeInTheDocument()
    })

    const planAnotherButton = screen.getByRole('button', { name: /plan another trip/i })
    await userEvent.click(planAnotherButton)

    await waitFor(() => {
      expect(screen.queryByText(/your trip to paris/i)).not.toBeInTheDocument()
    })
  })

  it('calls generate with correctly mapped form data', async () => {
    mockGenerate.mockResolvedValue(undefined)

    renderContainer()

    const submitButton = screen.getByRole('button', { name: /plan my trip/i })
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(mockGenerate).toHaveBeenCalledWith({
        destination: 'Paris',
        startDate: '2024-06-01',
        endDate: '2024-06-07',
        budget: 'moderate',
      })
    })
  })
})
