import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddToQueueForm from '@/components/AddToQueueForm';
import { puppyApi, waitingListApi } from '@/lib/api';

// Mock the API calls
jest.mock('@/lib/api', () => ({
  puppyApi: {
    getAll: jest.fn(),
    create: jest.fn(),
  },
  waitingListApi: {
    createToday: jest.fn(),
    addEntry: jest.fn(),
  },
}));

describe('AddToQueueForm', () => {
  const mockOnSuccess = jest.fn();
  const mockPuppies = [
    { id: 1, name: 'Max', ownerName: 'John Doe' },
    { id: 2, name: 'Bella', ownerName: 'Jane Smith' },
    { id: 3, name: 'Charlie', ownerName: 'John Doe' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (puppyApi.getAll as jest.Mock).mockResolvedValue({ data: mockPuppies });
    (puppyApi.create as jest.Mock).mockResolvedValue({ data: { id: 4, name: 'New Puppy', ownerName: 'New Owner' } });
    (waitingListApi.createToday as jest.Mock).mockResolvedValue({});
    (waitingListApi.addEntry as jest.Mock).mockResolvedValue({});
  });

  it('renders the form correctly', async () => {
    render(<AddToQueueForm onSuccess={mockOnSuccess} />);
    
    // Check if the form title is rendered
    expect(screen.getByText('Add Puppy to Queue')).toBeInTheDocument();
    
    // Check if the form fields are rendered
    expect(screen.getByLabelText(/Owner Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Puppy Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Service Required/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Notes/i)).toBeInTheDocument();
    
    // Check if the submit button is rendered and disabled initially
    const submitButton = screen.getByRole('button', { name: /Add to Queue/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
    
    // Verify API was called to fetch puppies
    await waitFor(() => {
      expect(puppyApi.getAll).toHaveBeenCalled();
    });
  });

  it('shows validation messages when fields are filled', async () => {
    render(<AddToQueueForm onSuccess={mockOnSuccess} />);
    
    // Wait for puppies to load
    await waitFor(() => {
      expect(puppyApi.getAll).toHaveBeenCalled();
    });
    
    // Fill in the owner name field
    const ownerNameInput = screen.getByLabelText(/Owner Name/i);
    await userEvent.type(ownerNameInput, 'New Owner');
    
    // Check if the "New owner will be created" message is shown
    await waitFor(() => {
      expect(screen.getByText(/New owner will be created/i)).toBeInTheDocument();
    });
    
    // Fill in the puppy name field
    const puppyNameInput = screen.getByLabelText(/Puppy Name/i);
    await userEvent.type(puppyNameInput, 'New Puppy');
    
    // Check if the "New puppy will be created" message is shown
    await waitFor(() => {
      expect(screen.getByText(/New puppy will be created/i)).toBeInTheDocument();
    });
  });

  it('submits the form with new puppy data', async () => {
    render(<AddToQueueForm onSuccess={mockOnSuccess} />);
    
    // Wait for puppies to load
    await waitFor(() => {
      expect(puppyApi.getAll).toHaveBeenCalled();
    });
    
    // Fill in the form fields
    const ownerNameInput = screen.getByLabelText(/Owner Name/i);
    const puppyNameInput = screen.getByLabelText(/Puppy Name/i);
    const serviceSelect = screen.getByLabelText(/Service Required/i);
    
    await userEvent.type(ownerNameInput, 'New Owner');
    await userEvent.type(puppyNameInput, 'New Puppy');
    await userEvent.selectOptions(serviceSelect, 'Bath & Dry');
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /Add to Queue/i });
    expect(submitButton).not.toBeDisabled();
    await userEvent.click(submitButton);
    
    // Verify API calls
    await waitFor(() => {
      expect(puppyApi.create).toHaveBeenCalledWith({
        name: 'New Puppy',
        ownerName: 'New Owner',
      });
      expect(waitingListApi.createToday).toHaveBeenCalled();
      expect(waitingListApi.addEntry).toHaveBeenCalledWith({
        puppyId: 4,
        serviceRequired: 'Bath & Dry',
      });
      expect(mockOnSuccess).toHaveBeenCalled();
    });
    
    // Check if success message is shown
    await waitFor(() => {
      expect(screen.getByText(/Puppy added to queue successfully/i)).toBeInTheDocument();
    });
  });

  it('selects an existing puppy from the dropdown', async () => {
    render(<AddToQueueForm onSuccess={mockOnSuccess} />);
    
    // Wait for puppies to load
    await waitFor(() => {
      expect(puppyApi.getAll).toHaveBeenCalled();
    });
    
    // Type part of an existing puppy name to trigger the dropdown
    const puppyNameInput = screen.getByLabelText(/Puppy Name/i);
    await userEvent.type(puppyNameInput, 'Max');
    
    // Wait for the dropdown to appear and click on the puppy
    await waitFor(() => {
      const puppyOption = screen.getByText('Max');
      fireEvent.click(puppyOption);
    });
    
    // Check if the owner name is auto-filled
    const ownerNameInput = screen.getByLabelText(/Owner Name/i) as HTMLInputElement;
    expect(ownerNameInput.value).toBe('John Doe');
    
    // Check if the "Using existing puppy" message is shown
    await waitFor(() => {
      expect(screen.getByText(/Using existing puppy/i)).toBeInTheDocument();
    });
    
    // Fill in the service field
    const serviceSelect = screen.getByLabelText(/Service Required/i);
    await userEvent.selectOptions(serviceSelect, 'Bath & Dry');
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /Add to Queue/i });
    await userEvent.click(submitButton);
    
    // Verify API calls
    await waitFor(() => {
      expect(puppyApi.create).not.toHaveBeenCalled(); // Should not create a new puppy
      expect(waitingListApi.createToday).toHaveBeenCalled();
      expect(waitingListApi.addEntry).toHaveBeenCalledWith({
        puppyId: 1, // ID of the existing puppy
        serviceRequired: 'Bath & Dry',
      });
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });
});
