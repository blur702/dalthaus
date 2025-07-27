import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import LoginPage from './LoginPage'
import { AuthContext } from '../contexts/AuthContext'

// Mock the AuthContext
const mockLogin = vi.fn()
const mockAuthContext = {
  user: null,
  login: mockLogin,
  logout: vi.fn()
}

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      <AuthContext.Provider value={mockAuthContext}>
        {component}
      </AuthContext.Provider>
    </BrowserRouter>
  )
}

describe('LoginPage Component', () => {
  beforeEach(() => {
    mockLogin.mockClear()
  })

  it('renders login form with Material UI components', () => {
    renderWithRouter(<LoginPage />)
    
    // Check for Material UI TextField components
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    
    // Check for Material UI Button
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    expect(submitButton).toBeInTheDocument()
    expect(submitButton).toHaveClass('MuiButton-root')
  })

  it('uses Material UI Paper component for the form container', () => {
    renderWithRouter(<LoginPage />)
    
    // Check for Paper component
    const paper = screen.getByRole('form').closest('.MuiPaper-root')
    expect(paper).toBeInTheDocument()
    expect(paper).toHaveClass('MuiPaper-elevation1')
  })

  it('displays validation errors using Material UI Alert', async () => {
    renderWithRouter(<LoginPage />)
    
    // Submit empty form
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    fireEvent.click(submitButton)
    
    // Check for error messages
    await waitFor(() => {
      const alerts = screen.getAllByRole('alert')
      expect(alerts.length).toBeGreaterThan(0)
      expect(alerts[0]).toHaveClass('MuiAlert-root')
    })
  })

  it('handles form submission with valid data', async () => {
    const user = userEvent.setup()
    renderWithRouter(<LoginPage />)
    
    // Fill in the form
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    await user.click(submitButton)
    
    // Check if login was called with correct data
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123')
    })
  })

  it('shows loading state on submit button', async () => {
    const user = userEvent.setup()
    mockLogin.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    
    renderWithRouter(<LoginPage />)
    
    // Fill and submit form
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    await user.click(submitButton)
    
    // Check for loading indicator
    expect(submitButton).toBeDisabled()
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('applies Material UI theme styling', () => {
    renderWithRouter(<LoginPage />)
    
    // Check theme application
    const container = screen.getByRole('form').parentElement
    expect(container).toHaveStyle({ display: 'flex' })
    
    // Check responsive design
    const paper = screen.getByRole('form').closest('.MuiPaper-root')
    expect(paper).toHaveStyle({ padding: expect.stringContaining('px') })
  })
})