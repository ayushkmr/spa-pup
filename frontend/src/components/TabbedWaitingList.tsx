"use client";

import React, { useState, useEffect } from 'react';
import { WaitingListEntry } from '@/types';

interface TabbedWaitingListProps {
  entries: WaitingListEntry[];
  onReorder: (entries: WaitingListEntry[]) => void;
  onMarkServiced: (entryId: number) => void;
  reordering: boolean;
  formatTime: (dateString: string) => string;
}

export default function TabbedWaitingList({
  entries,
  onReorder,
  onMarkServiced,
  reordering,
  formatTime
}: TabbedWaitingListProps) {
  const [activeTab, setActiveTab] = useState<'waiting' | 'serviced' | 'future'>('waiting');
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [dragOverItemIndex, setDragOverItemIndex] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Function to determine if a future booking should now be in the waiting queue
  const shouldBeInWaiting = (entry: WaitingListEntry): boolean => {
    if (!entry.isFutureBooking || !entry.scheduledTime) return false;

    const scheduledTime = new Date(entry.scheduledTime);
    const fiveMinutesBeforeScheduled = new Date(scheduledTime.getTime() - 5 * 60000); // 5 minutes before

    // If current time is past the scheduled time or within 5 minutes before
    return currentTime >= fiveMinutesBeforeScheduled;
  };

  // Filter entries based on their status and time
  const waitingEntries = entries.filter(entry =>
    (!entry.serviced && !entry.isFutureBooking) || // Regular waiting entries
    (entry.isFutureBooking && shouldBeInWaiting(entry)) // Future entries that should now be in waiting
  );

  const servicedEntries = entries.filter(entry => entry.serviced);

  const futureEntries = entries.filter(entry =>
    entry.isFutureBooking && !shouldBeInWaiting(entry) // Only future entries that shouldn't be in waiting yet
  );

  const handleDragStart = (index: number) => {
    if (reordering) return;
    setDraggedItemIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (reordering) return;
    setDragOverItemIndex(index);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();

    if (draggedItemIndex === null || dragOverItemIndex === null) return;
    if (draggedItemIndex === dragOverItemIndex) return;

    try {
      // Get only the waiting entries
      const waitingEntriesOnly = entries.filter(entry => !entry.serviced);

      // Get the entries being dragged and dropped
      const draggedEntry = waitingEntriesOnly[draggedItemIndex];

      if (!draggedEntry) return;

      // Create a new array with all entries
      const newEntries = [...entries];

      // Find indices in the full array
      const fromIndex = newEntries.findIndex(e => e.id === draggedEntry.id);

      if (fromIndex === -1) return;

      // Remove the dragged entry
      const [removed] = newEntries.splice(fromIndex, 1);

      // Find the target entry and its index
      const targetEntry = waitingEntriesOnly[dragOverItemIndex];
      if (!targetEntry) return;

      const toIndex = newEntries.findIndex(e => e.id === targetEntry.id);
      if (toIndex === -1) return;

      // Insert at the new position
      newEntries.splice(toIndex, 0, removed);

      // Update positions
      const updatedEntries = newEntries.map((entry, index) => ({
        ...entry,
        position: index + 1
      }));

      // Call the reorder function
      onReorder(updatedEntries);
    } catch (error) {
      console.error('Error during drag and drop:', error);
    } finally {
      // Reset the drag state
      setDraggedItemIndex(null);
      setDragOverItemIndex(null);
    }
  };

  const handleDragEnd = () => {
    setDraggedItemIndex(null);
    setDragOverItemIndex(null);
  };

  return (
    <div>
      <div className="flex border-b">
        <button
          className={`flex-1 py-2 text-center font-medium ${
            activeTab === 'waiting'
              ? 'text-purple-600 border-b-2 border-purple-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('waiting')}
        >
          Waiting ({waitingEntries.length})
        </button>
        <button
          className={`flex-1 py-2 text-center font-medium ${
            activeTab === 'future'
              ? 'text-purple-600 border-b-2 border-purple-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('future')}
        >
          Future ({futureEntries.length})
        </button>
        <button
          className={`flex-1 py-2 text-center font-medium ${
            activeTab === 'serviced'
              ? 'text-purple-600 border-b-2 border-purple-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('serviced')}
        >
          Serviced ({servicedEntries.length})
        </button>
      </div>

      {/* Desktop view */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                #
              </th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status Puppy & Owner
              </th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service
              </th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {activeTab === 'future' ? 'Scheduled Date & Time' : 'Time'}
              </th>
              {activeTab === 'waiting' && (
                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {activeTab === 'waiting' ? (
              waitingEntries.length > 0 ? (
                waitingEntries.map((entry, index) => (
                  <tr
                    key={entry.id}
                    draggable={!reordering}
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={handleDrop}
                    onDragEnd={handleDragEnd}
                    className={`
                      ${draggedItemIndex === index ? 'opacity-50' : ''}
                      ${dragOverItemIndex === index ? 'border-t-2 border-purple-500' : ''}
                      ${!reordering ? 'cursor-grab' : ''}
                    `}
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <span className="mr-2">{entry.position}</span>
                        {!reordering && (
                          <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                          </svg>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full mr-2 ${entry.isFutureBooking && shouldBeInWaiting(entry) ? 'bg-orange-100 text-orange-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {entry.isFutureBooking && shouldBeInWaiting(entry) ? 'Scheduled' : 'Waiting'}
                        </span>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{entry.puppy.name}</div>
                          <div className="text-sm text-gray-500">{entry.puppy.ownerName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{entry.serviceRequired}</div>
                      {entry.notes && <div className="text-xs text-gray-500 mt-1 italic">{entry.notes}</div>}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {entry.isFutureBooking && shouldBeInWaiting(entry) && entry.scheduledTime ? (
                        <div>
                          <div className="font-medium text-orange-600">{formatTime(entry.scheduledTime)}</div>
                          <div className="text-xs text-gray-500">Scheduled time</div>
                        </div>
                      ) : (
                        formatTime(entry.arrivalTime)
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => onMarkServiced(entry.id)}
                        className="text-purple-600 hover:text-purple-900"
                      >
                        Mark Serviced
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center">
                    <div className="text-center">
                      <div className="text-4xl mb-3">🐶</div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">No puppies in the queue yet</h3>
                      <p className="text-sm text-gray-500">Add a puppy to get started</p>
                    </div>
                  </td>
                </tr>
              )
            ) : activeTab === 'future' ? (
              futureEntries.length > 0 ? (
                futureEntries.map((entry) => (
                  <tr key={entry.id} className="bg-blue-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {entry.position}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 mr-2">
                          Future
                        </span>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{entry.puppy.name}</div>
                          <div className="text-sm text-gray-500">{entry.puppy.ownerName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{entry.serviceRequired}</div>
                      {entry.notes && <div className="text-xs text-gray-500 mt-1 italic">{entry.notes}</div>}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {entry.scheduledTime ? (
                        <div>
                          <div className="font-medium">{new Date(entry.scheduledTime).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                          })}</div>
                          <div>{formatTime(entry.scheduledTime)}</div>
                        </div>
                      ) : 'Not scheduled'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center">
                    <div className="text-center">
                      <div className="text-4xl mb-3">📅</div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">No future bookings</h3>
                      <p className="text-sm text-gray-500">Future appointments will appear here</p>
                    </div>
                  </td>
                </tr>
              )
            ) : (
              servicedEntries.length > 0 ? (
                servicedEntries.map((entry) => (
                  <tr key={entry.id} className="bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {entry.position}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 mr-2">
                          Serviced
                        </span>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{entry.puppy.name}</div>
                          <div className="text-sm text-gray-500">{entry.puppy.ownerName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{entry.serviceRequired}</div>
                      {entry.notes && <div className="text-xs text-gray-500 mt-1 italic">{entry.notes}</div>}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {formatTime(entry.arrivalTime)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center">
                    <div className="text-center">
                      <div className="text-4xl mb-3">🐾</div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">No serviced puppies yet</h3>
                      <p className="text-sm text-gray-500">Puppies that have been serviced will appear here</p>
                    </div>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile view - Card layout */}
      <div className="md:hidden">
        {activeTab === 'waiting' ? (
          waitingEntries.length > 0 ? (
            <div className="space-y-3 mt-3">
              {waitingEntries.map((entry, index) => (
                <div
                  key={entry.id}
                  className={`bg-white rounded-lg shadow p-4 border-l-4 border-purple-500 ${!reordering ? 'active:scale-98 transition-transform' : ''}`}
                  draggable={!reordering}
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={handleDrop}
                  onDragEnd={handleDragEnd}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-purple-100 rounded-full">
                        <span className="text-lg">🐶</span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {entry.puppy.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {entry.puppy.ownerName}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-semibold bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                      #{entry.position}
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Service:</span>
                      <p className="font-medium text-gray-900">{entry.serviceRequired}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Arrival:</span>
                      <p className="font-medium text-gray-900">{formatTime(entry.arrivalTime)}</p>
                    </div>
                    {entry.notes && (
                      <div className="col-span-2 mt-1">
                        <span className="text-gray-500">Notes:</span>
                        <p className="font-medium text-gray-900 italic">{entry.notes}</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => onMarkServiced(entry.id)}
                      disabled={reordering}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                    >
                      Mark Serviced
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🐶</div>
              <p className="text-gray-500">No puppies waiting</p>
            </div>
          )
        ) : activeTab === 'future' ? (
          futureEntries.length > 0 ? (
            <div className="space-y-3 mt-3">
              {futureEntries.map((entry) => (
                <div key={entry.id} className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-blue-100 rounded-full">
                        <span className="text-lg">📅</span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {entry.puppy.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {entry.puppy.ownerName}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      #{entry.position}
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Service:</span>
                      <p className="font-medium text-gray-900">{entry.serviceRequired}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Scheduled:</span>
                      <p className="font-medium text-gray-900">{entry.scheduledTime ? formatTime(entry.scheduledTime) : 'Not set'}</p>
                    </div>
                    {entry.notes && (
                      <div className="col-span-2 mt-1">
                        <span className="text-gray-500">Notes:</span>
                        <p className="font-medium text-gray-900 italic">{entry.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">📅</div>
              <p className="text-gray-500">No future bookings</p>
            </div>
          )
        ) : (
          servicedEntries.length > 0 ? (
            <div className="space-y-3 mt-3">
              {servicedEntries.map((entry) => (
                <div key={entry.id} className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-green-100 rounded-full">
                        <span className="text-lg">✅</span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {entry.puppy.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {entry.puppy.ownerName}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-semibold bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      #{entry.position}
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Service:</span>
                      <p className="font-medium text-gray-900">{entry.serviceRequired}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Completed:</span>
                      <p className="font-medium text-gray-900">{formatTime(entry.serviceTime || entry.arrivalTime)}</p>
                    </div>
                    {entry.notes && (
                      <div className="col-span-2 mt-1">
                        <span className="text-gray-500">Notes:</span>
                        <p className="font-medium text-gray-900 italic">{entry.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🐶</div>
              <p className="text-gray-500">No puppies serviced today</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
