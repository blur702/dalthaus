import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import UserList from './UserList'
import axios from 'axios'

// Mock axios
vi.mock('axios')

const mockUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-01'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'editor',
    status: 'active',
    createdAt: '2024-01-02'
  }
]

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('UserList Component', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockUsers })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders Material UI DataGrid component', async () => {
    renderWithRouter(<UserList />)
    
    // Wait for data to load
    const dataGrid = await screen.findByRole('grid')
    expect(dataGrid).toBeInTheDocument()
    expect(dataGrid).toHaveClass('MuiDataGrid-root')
  })

  it('displays user data in Material UI table format', async () => {
    renderWithRouter(<UserList />)
    
    // Wait for data to load
    await screen.findByRole('grid')
    
    // Check if user data is displayed
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('jane@example.com')).toBeInTheDocument()
  })

  it('shows loading state with Material UI CircularProgress', () => {
    axios.get.mockImplementation(() => new Promise(() => {})) // Never resolves
    
    renderWithRouter(<UserList />)
    
    // Check for loading indicator
    const progress = screen.getByRole('progressbar')
    expect(progress).toBeInTheDocument()
    expect(progress).toHaveClass('MuiCircularProgress-root')
  })

  it('displays action buttons using Material UI IconButton', async () => {
    renderWithRouter(<UserList />)
    
    // Wait for data to load
    await screen.findByRole('grid')
    
    // Check for action buttons
    const editButtons = screen.getAllByRole('button', { name: /edit/i })
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
    
    expect(editButtons.length).toBe(2)
    expect(deleteButtons.length).toBe(2)
    
    // Check if they are Material UI IconButtons
    expect(editButtons[0]).toHaveClass('MuiIconButton-root')
  })

  it('handles pagination with Material UI DataGrid', async () => {
    // Mock more users for pagination
    const manyUsers = Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      role: 'user',
      status: 'active',
      createdAt: '2024-01-01'
    }))
    
    axios.get.mockResolvedValue({ data: manyUsers })
    
    renderWithRouter(<UserList />)
    
    // Wait for data to load
    await screen.findByRole('grid')
    
    // Check for pagination controls
    const pagination = screen.getByRole('navigation', { name: /pagination/i })
    expect(pagination).toBeInTheDocument()
    expect(pagination).toHaveClass('MuiTablePagination-root')
  })

  it('shows error state using Material UI Alert', async () => {
    axios.get.mockRejectedValue(new Error('Failed to fetch users'))
    
    renderWithRouter(<UserList />)
    
    // Wait for error to be displayed
    const alert = await screen.findByRole('alert')
    expect(alert).toBeInTheDocument()
    expect(alert).toHaveClass('MuiAlert-root')
    expect(alert).toHaveClass('MuiAlert-colorError')
    expect(screen.getByText(/failed to fetch users/i)).toBeInTheDocument()
  })

  it('applies filters using Material UI TextField', async () => {
    renderWithRouter(<UserList />)
    
    // Wait for data to load
    await screen.findByRole('grid')
    
    // Check for filter input
    const filterInput = screen.getByLabelText(/search users/i)
    expect(filterInput).toBeInTheDocument()
    expect(filterInput.parentElement).toHaveClass('MuiTextField-root')
    
    // Type in filter
    fireEvent.change(filterInput, { target: { value: 'John' } })
    
    // Check if filtering works
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument()
  })

  it('uses Material UI theme for consistent styling', async () => {
    renderWithRouter(<UserList />)
    
    // Wait for data to load
    await screen.findByRole('grid')
    
    // Check theme application
    const container = screen.getByRole('grid').parentElement
    expect(container).toHaveClass('MuiBox-root')
    
    // Check for Material UI styled components
    const paper = container.closest('.MuiPaper-root')
    expect(paper).toBeInTheDocument()
  })
})