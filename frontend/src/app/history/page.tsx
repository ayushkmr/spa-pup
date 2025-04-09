"use client";

import { useState, useEffect } from "react";
import { waitingListApi } from "@/lib/api";
import { WaitingList } from "@/types";
import Link from "next/link";

export default function History() {
  const [waitingLists, setWaitingLists] = useState<WaitingList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedList, setSelectedList] = useState<WaitingList | null>(null);

  useEffect(() => {
    const fetchWaitingLists = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await waitingListApi.getAll();
        setWaitingLists(response.data);
        
        // Select the most recent list by default
        if (response.data.length > 0) {
          setSelectedDate(response.data[0].date);
          setSelectedList(response.data[0]);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (waitingLists.length === 0) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Waiting List History</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            View past waiting lists
          </p>
        </div>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🐶</div>
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">No waiting lists found</h3>
          <p className="text-sm text-gray-500 mb-6">Create a waiting list to get started</p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Go to Today's List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Waiting List History</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          View past waiting lists
        </p>
      </div>
      
      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
        <div className="mb-6">
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
            Select Date
          </label>
          <select
            id="date"
            name="date"
            value={selectedDate || ""}
            onChange={(e) => handleDateChange(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            {waitingLists.map((list) => (
              <option key={list.id} value={list.date}>
                {formatDate(list.date)} ({list.entries.length} entries)
              </option>
            ))}
          </select>
        </div>
        
        {selectedList && (
          <div className="mt-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">
              {formatDate(selectedList.date)}
            </h4>
            
            {selectedList.entries.length > 0 ? (
              <div className="overflow-x-auto">
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
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedList.entries.map((entry) => (
                      <tr key={entry.id} className={entry.serviced ? 'bg-gray-50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {entry.position}
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500">No entries for this date</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
