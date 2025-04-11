"use client";

import { useState, useEffect } from "react";
import { waitingListApi } from "@/lib/api";
import { WaitingList, WaitingListEntry } from "@/types";
import Link from "next/link";

export default function Appointments() {
  const [waitingLists, setWaitingLists] = useState<WaitingList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedList, setSelectedList] = useState<WaitingList | null>(null);
  const [viewMode, setViewMode] = useState<'all' | 'unserviced' | 'future' | 'cancelled'>('all');

  useEffect(() => {
    const fetchWaitingLists = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await waitingListApi.getAll();

        // Sort lists by date (newest first)
        const sortedLists = response.data.sort((a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setWaitingLists(sortedLists);

        // Select the most recent list by default
        if (sortedLists.length > 0) {
          setSelectedDate(sortedLists[0].date);
          setSelectedList(sortedLists[0]);
        }
      } catch (err) {
        setError("Failed to fetch waiting lists");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWaitingLists();
  }, []);

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    const list = waitingLists.find(list => list.date === date) || null;
    setSelectedList(list);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCancelEntry = async (entryId: number) => {
    try {
      await waitingListApi.cancelEntry(entryId);

      // Refresh the data
      const response = await waitingListApi.getAll();
      const sortedLists = response.data.sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setWaitingLists(sortedLists);

      // Update the selected list
      if (selectedDate) {
        const updatedList = sortedLists.find(list => list.date === selectedDate) || null;
        setSelectedList(updatedList);
      }
    } catch (err) {
      setError("Failed to cancel entry");
      console.error(err);
    }
  };

  // Filter entries based on view mode
  const getFilteredEntries = (entries: WaitingListEntry[]) => {
    if (viewMode === 'unserviced') {
      return entries.filter(entry => entry.status === 'waiting');
    } else if (viewMode === 'future') {
      return entries.filter(entry => entry.isFutureBooking && entry.status === 'waiting');
    } else if (viewMode === 'cancelled') {
      return entries.filter(entry => entry.status === 'cancelled');
    }
    return entries;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Appointment Queue</h1>
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          Back to Today's Queue
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Select Date</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Choose a date to view appointments</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as 'all' | 'unserviced' | 'future' | 'cancelled')}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
            >
              <option value="all">All Appointments</option>
              <option value="unserviced">Waiting Only</option>
              <option value="future">Future Bookings Only</option>
              <option value="cancelled">Cancelled Only</option>
            </select>
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <div className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <div className="text-sm font-medium text-gray-500">Date</div>
              <div className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {loading ? (
                    <div className="col-span-full flex justify-center py-4">
                      <svg className="animate-spin h-5 w-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  ) : waitingLists.length > 0 ? (
                    waitingLists.map((list) => (
                      <button
                        key={list.id}
                        onClick={() => handleDateChange(list.date)}
                        className={`px-3 py-2 text-sm rounded-md ${
                          selectedDate === list.date
                            ? 'bg-purple-100 text-purple-700 font-medium'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {formatDate(list.date)}
                      </button>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-4 text-gray-500">
                      No waiting lists found
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedList && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Appointments for {formatDate(selectedList.date)}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {getFilteredEntries(selectedList.entries).length} {viewMode === 'all' ? 'total' : viewMode === 'unserviced' ? 'unserviced' : 'future'} appointments
            </p>
          </div>
          <div className="border-t border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Position
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Puppy & Owner
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getFilteredEntries(selectedList.entries).length > 0 ? (
                    getFilteredEntries(selectedList.entries).map((entry) => (
                      <tr key={entry.id} className={
                        entry.status === 'cancelled' ? 'bg-red-50' :
                        entry.isFutureBooking ? 'bg-blue-50' :
                        entry.status === 'completed' ? 'bg-green-50' :
                        'bg-white'
                      }>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {entry.position}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {entry.status === 'cancelled' ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              Cancelled
                            </span>
                          ) : entry.isFutureBooking && entry.status === 'waiting' ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              Future
                            </span>
                          ) : entry.status === 'completed' ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Completed
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Waiting
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{entry.puppy.name}</div>
                          <div className="text-sm text-gray-500">{entry.puppy.ownerName}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{entry.serviceRequired}</div>
                          {entry.notes && <div className="text-xs text-gray-500 mt-1 italic">{entry.notes}</div>}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {entry.isFutureBooking && entry.scheduledTime ? (
                            <div>
                              <div className="font-medium">{new Date(entry.scheduledTime).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric'
                              })}</div>
                              <div>{formatTime(entry.scheduledTime)}</div>
                            </div>
                          ) : entry.serviced && entry.serviceTime ? (
                            <div>
                              <div>Arrived: {formatTime(entry.arrivalTime)}</div>
                              <div>Serviced: {formatTime(entry.serviceTime)}</div>
                            </div>
                          ) : (
                            formatTime(entry.arrivalTime)
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                          {(entry.status === 'waiting' || (entry.isFutureBooking && entry.status !== 'cancelled')) && (
                            <button
                              onClick={() => handleCancelEntry(entry.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center">
                        <div className="text-center">
                          <div className="text-4xl mb-3">📅</div>
                          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">No appointments found</h3>
                          <p className="text-sm text-gray-500">Try changing the filter or selecting a different date</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
