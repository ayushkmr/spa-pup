import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TabbedWaitingList from '@/components/TabbedWaitingList';
import { WaitingListEntry } from '@/types';

// Mock the react-beautiful-dnd library
jest.mock('react-beautiful-dnd', () => ({
  DragDropContext: ({ children }: { children: React.ReactNode }) => children,
  Droppable: ({ children }: { children: Function }) => children({
    draggableProps: {
      style: {},
    },
    innerRef: jest.fn(),
  }, {}),
  Draggable: ({ children }: { children: Function }) => children({
    draggableProps: {
      style: {},
    },
    innerRef: jest.fn(),
    dragHandleProps: {},
  }, {}),
}));

describe('TabbedWaitingList', () => {
  const mockFormatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString();
  };

  const mockEntries: WaitingListEntry[] = [
    {
      id: 1,
      position: 1,
      puppy: { id: 1, name: 'Max', ownerName: 'John Doe' },
      serviceRequired: 'Bath & Dry',
      arrivalTime: '2025-04-09T10:00:00Z',
      serviced: false,
    },
    {
      id: 2,
      position: 2,
      puppy: { id: 2, name: 'Bella', ownerName: 'Jane Smith' },
      serviceRequired: 'Full Grooming',
      notes: 'Sensitive skin',
      arrivalTime: '2025-04-09T10:30:00Z',
      serviced: false,
    },
    {
      id: 3,
      position: 3,
      puppy: { id: 3, name: 'Charlie', ownerName: 'Bob Johnson' },
      serviceRequired: 'Nail Trimming',
      notes: 'Be gentle with back paws',
      arrivalTime: '2025-04-09T09:30:00Z',
      serviced: true,
    },
  ];

  const mockOnReorder = jest.fn();
  const mockOnMarkServiced = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the waiting tab by default', () => {
    render(
      <TabbedWaitingList
        entries={mockEntries}
        onReorder={mockOnReorder}
        onMarkServiced={mockOnMarkServiced}
        reordering={false}
        formatTime={mockFormatTime}
      />
    );

    // Check if the tabs are rendered
    const waitingTab = screen.getAllByRole('button').find(button => button.textContent?.includes('Waiting'));
    const servicedTab = screen.getAllByRole('button').find(button => button.textContent?.includes('Serviced'));
    expect(waitingTab).toBeInTheDocument();
    expect(servicedTab).toBeInTheDocument();

    // Check if the waiting entries are rendered
    expect(screen.getAllByText('Max')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Bella')[0]).toBeInTheDocument();
    expect(screen.getAllByText('John Doe')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Jane Smith')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Bath & Dry')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Full Grooming')[0]).toBeInTheDocument();

    // Check if the serviced entry is not rendered in the waiting tab
    expect(screen.queryAllByText('Charlie').length).toBe(0);
    expect(screen.queryAllByText('Bob Johnson').length).toBe(0);
    expect(screen.queryAllByText('Nail Trimming').length).toBe(0);
  });

  it('switches to the serviced tab when clicked', () => {
    render(
      <TabbedWaitingList
        entries={mockEntries}
        onReorder={mockOnReorder}
        onMarkServiced={mockOnMarkServiced}
        reordering={false}
        formatTime={mockFormatTime}
      />
    );

    // Click on the serviced tab
    const servicedTab = screen.getAllByRole('button').find(button => button.textContent?.includes('Serviced'));
    fireEvent.click(servicedTab);

    // Check if the serviced entry is rendered
    expect(screen.getAllByText('Charlie')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Bob Johnson')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Nail Trimming')[0]).toBeInTheDocument();

    // Check if the waiting entries are not rendered in the serviced tab
    expect(screen.queryAllByText('Max').length).toBe(0);
    expect(screen.queryAllByText('Bella').length).toBe(0);
  });

  it('calls onMarkServiced when the "Mark Serviced" button is clicked', () => {
    render(
      <TabbedWaitingList
        entries={mockEntries}
        onReorder={mockOnReorder}
        onMarkServiced={mockOnMarkServiced}
        reordering={false}
        formatTime={mockFormatTime}
      />
    );

    // Click on the "Mark Serviced" button for the first entry
    fireEvent.click(screen.getAllByText('Mark Serviced')[0]);

    // Check if onMarkServiced was called with the correct entry ID
    expect(mockOnMarkServiced).toHaveBeenCalledWith(1);
  });

  it('displays a message when there are no waiting entries', () => {
    render(
      <TabbedWaitingList
        entries={mockEntries.filter(entry => entry.serviced)}
        onReorder={mockOnReorder}
        onMarkServiced={mockOnMarkServiced}
        reordering={false}
        formatTime={mockFormatTime}
      />
    );

    // Check if the "No puppies in the queue yet" message is displayed
    expect(screen.getByText('No puppies in the queue yet')).toBeInTheDocument();
  });

  it('displays a message when there are no serviced entries', () => {
    render(
      <TabbedWaitingList
        entries={mockEntries.filter(entry => !entry.serviced)}
        onReorder={mockOnReorder}
        onMarkServiced={mockOnMarkServiced}
        reordering={false}
        formatTime={mockFormatTime}
      />
    );

    // Click on the serviced tab
    const servicedTab = screen.getAllByRole('button').find(button => button.textContent?.includes('Serviced'));
    fireEvent.click(servicedTab);

    // Check if the "No serviced puppies yet" message is displayed
    expect(screen.getByText('No serviced puppies yet')).toBeInTheDocument();
  });

  it('displays notes for entries that have them', () => {
    render(
      <TabbedWaitingList
        entries={mockEntries}
        onReorder={mockOnReorder}
        onMarkServiced={mockOnMarkServiced}
        reordering={false}
        formatTime={mockFormatTime}
      />
    );

    // Check if notes for waiting entries are displayed
    expect(screen.getAllByText('Sensitive skin')[0]).toBeInTheDocument();

    // Click on the serviced tab to check notes for serviced entries
    const servicedTab = screen.getAllByRole('button').find(button => button.textContent?.includes('Serviced'));
    fireEvent.click(servicedTab);

    // Check if notes for serviced entries are displayed
    expect(screen.getAllByText('Be gentle with back paws')[0]).toBeInTheDocument();
  });
});
