"use client";

import React, { useState } from 'react';
import { WaitingListEntry } from '@/types';

interface DraggableWaitingListProps {
  entries: WaitingListEntry[];
  onReorder: (entries: WaitingListEntry[]) => void;
  onMarkServiced: (entryId: number) => void;
  reordering: boolean;
  formatTime: (dateString: string) => string;
}

export default function DraggableWaitingList({
  entries,
  onReorder,
  onMarkServiced,
  reordering,
  formatTime
}: DraggableWaitingListProps) {
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [dragOverItemIndex, setDragOverItemIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    if (entries[index].serviced || reordering) return;
    setDraggedItemIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (entries[index].serviced || reordering) return;
    setDragOverItemIndex(index);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    if (draggedItemIndex === null || dragOverItemIndex === null) return;
    if (draggedItemIndex === dragOverItemIndex) return;
    
    // Create a copy of the entries array
    const newEntries = [...entries];
    
    // Remove the dragged item
    const draggedItem = newEntries[draggedItemIndex];
    
    // Remove the item from its original position
    newEntries.splice(draggedItemIndex, 1);
    
    // Insert the item at the new position
    newEntries.splice(dragOverItemIndex, 0, draggedItem);
    
    // Update the positions
    const updatedEntries = newEntries.map((entry, index) => ({
      ...entry,
      position: index + 1
    }));
    
    // Call the reorder function
    onReorder(updatedEntries);
    
    // Reset the drag state
    setDraggedItemIndex(null);
    setDragOverItemIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedItemIndex(null);
    setDragOverItemIndex(null);
  };

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Position
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Puppy
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Owner
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Service
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Arrival Time
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Status
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {entries.map((entry, index) => (
          <tr
            key={entry.id}
            draggable={!entry.serviced && !reordering}
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
            className={`
              ${entry.serviced ? 'bg-gray-50' : ''}
              ${draggedItemIndex === index ? 'opacity-50' : ''}
              ${dragOverItemIndex === index ? 'border-t-2 border-indigo-500' : ''}
              ${!entry.serviced && !reordering ? 'cursor-grab' : ''}
            `}
          >
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <div className="flex items-center">
                <span className="mr-2">{entry.position}</span>
                {!entry.serviced && !reordering && (
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                  </svg>
                )}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm font-medium text-gray-900">{entry.puppy.name}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">{entry.puppy.ownerName}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">{entry.serviceRequired}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {formatTime(entry.arrivalTime)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {entry.serviced ? (
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Serviced
                </span>
              ) : (
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                  Waiting
                </span>
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div className="flex space-x-2">
                {!entry.serviced && (
                  <button
                    onClick={() => onMarkServiced(entry.id)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Mark Serviced
                  </button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
