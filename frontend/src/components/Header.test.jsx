import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Header from './Header'
import { AuthContext } from '../contexts/AuthContext'

// Mock the AuthContext
const mockAuthContext = {
  user: {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    role: 'admin'
  },
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

describe('Header Component', () => {
  it('renders the header with Material UI AppBar', () => {
    renderWithRouter(<Header />)
    
    // Check if the AppBar is rendered
    const appBar = screen.getByRole('banner')
    expect(appBar).toBeInTheDocument()
  })

  it('displays the logo/title', () => {
    renderWithRouter(<Header />)
    
    // Check if the title is displayed
    const title = screen.getByText(/Admin Dashboard/i)
    expect(title).toBeInTheDocument()
  })

  it('shows user menu when avatar is clicked', async () => {
    renderWithRouter(<Header />)
    
    // Find and click the user avatar
    const avatar = screen.getByRole('button', { name: /account of current user/i })
    fireEvent.click(avatar)
    
    // Check if menu items are displayed
    expect(await screen.findByText(/Profile/i)).toBeInTheDocument()
    expect(await screen.findByText(/Logout/i)).toBeInTheDocument()
  })

  it('calls logout function when logout is clicked', async () => {
    renderWithRouter(<Header />)
    
    // Open user menu
    const avatar = screen.getByRole('button', { name: /account of current user/i })
    fireEvent.click(avatar)
    
    // Click logout
    const logoutButton = await screen.findByText(/Logout/i)
    fireEvent.click(logoutButton)
    
    // Check if logout was called
    expect(mockAuthContext.logout).toHaveBeenCalled()
  })

  it('shows navigation links for admin users', () => {
    renderWithRouter(<Header />)
    
    // Check for navigation links
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument()
    expect(screen.getByText(/Users/i)).toBeInTheDocument()
    expect(screen.getByText(/Articles/i)).toBeInTheDocument()
  })

  it('applies Material UI theme correctly', () => {
    renderWithRouter(<Header />)
    
    // Check if the AppBar has the correct color
    const appBar = screen.getByRole('banner')
    expect(appBar).toHaveClass('MuiAppBar-root')
    expect(appBar).toHaveClass('MuiAppBar-colorPrimary')
  })
})