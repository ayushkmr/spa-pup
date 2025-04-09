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
      arrivalTime: '2025-04-09T10:30:00Z',
      serviced: false,
    },
    {
      id: 3,
      position: 3,
      puppy: { id: 3, name: 'Charlie', ownerName: 'Bob Johnson' },
      serviceRequired: 'Nail Trimming',
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
    expect(screen.getByRole('button', { name: 'Waiting' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Serviced' })).toBeInTheDocument();

    // Check if the waiting entries are rendered
    expect(screen.getByText('Max')).toBeInTheDocument();
    expect(screen.getByText('Bella')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Bath & Dry')).toBeInTheDocument();
    expect(screen.getByText('Full Grooming')).toBeInTheDocument();

    // Check if the serviced entry is not rendered in the waiting tab
    expect(screen.queryByText('Charlie')).not.toBeInTheDocument();
    expect(screen.queryByText('Bob Johnson')).not.toBeInTheDocument();
    expect(screen.queryByText('Nail Trimming')).not.toBeInTheDocument();
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
    fireEvent.click(screen.getByText('Serviced'));

    // Check if the serviced entry is rendered
    expect(screen.getByText('Charlie')).toBeInTheDocument();
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    expect(screen.getByText('Nail Trimming')).toBeInTheDocument();

    // Check if the waiting entries are not rendered in the serviced tab
    expect(screen.queryByText('Max')).not.toBeInTheDocument();
    expect(screen.queryByText('Bella')).not.toBeInTheDocument();
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
    fireEvent.click(screen.getByText('Serviced'));

    // Check if the "No serviced puppies yet" message is displayed
    expect(screen.getByText('No serviced puppies yet')).toBeInTheDocument();
  });
});
