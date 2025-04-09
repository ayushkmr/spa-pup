"use client";

import { useEffect, useState } from "react";
import { waitingListApi, puppyApi } from "@/lib/api";
import { WaitingList, WaitingListEntry } from "@/types";
import DraggableWaitingList from "@/components/DraggableWaitingList";

// Expose API for debugging
if (typeof window !== 'undefined') {
  (window as any).waitingListApi = waitingListApi;
  (window as any).puppyApi = puppyApi;
  console.log('API client exposed for debugging');
}

export default function Home() {
  const [waitingList, setWaitingList] = useState<WaitingList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reordering, setReordering] = useState(false);

  const fetchTodayList = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to get today's list
      const response = await waitingListApi.getToday();
      setWaitingList(response.data);
    } catch (err) {
      // If there's no list for today, create one
      try {
        await waitingListApi.createToday();
        const response = await waitingListApi.getToday();
        setWaitingList(response.data);
      } catch (createErr) {
        setError("Failed to create or fetch today's waiting list");
        console.error(createErr);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayList();
  }, []);

  const handleMarkServiced = async (entryId: number) => {
    try {
      await waitingListApi.markServiced(entryId);
      fetchTodayList();
    } catch (err) {
      setError("Failed to mark entry as serviced");
      console.error(err);
    }
  };

  const handleReorderEntries = async (entries: WaitingListEntry[]) => {
    try {
      setReordering(true);
      const entryOrder = entries.map(entry => entry.id);
      console.log('Reordering entries with IDs:', entryOrder);
      await waitingListApi.reorder(entryOrder);
      fetchTodayList();
    } catch (err) {
      setError("Failed to reorder entries");
      console.error(err);
    } finally {
      setReordering(false);
    }
  };



  const moveEntryUp = (index: number) => {
    if (index <= 0 || !waitingList?.entries) return;

    const newEntries = [...waitingList.entries];
    [newEntries[index], newEntries[index - 1]] = [newEntries[index - 1], newEntries[index]];

    handleReorderEntries(newEntries);
  };

  const moveEntryDown = (index: number) => {
    if (!waitingList?.entries || index >= waitingList.entries.length - 1) return;

    const newEntries = [...waitingList.entries];
    [newEntries[index], newEntries[index + 1]] = [newEntries[index + 1], newEntries[index]];

    handleReorderEntries(newEntries);
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

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">Today's Waiting List</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {waitingList ? formatDate(waitingList.date) : 'No date available'}
          </p>
        </div>
        <button
          onClick={fetchTodayList}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Refresh
        </button>
      </div>

      {waitingList && waitingList.entries.length > 0 ? (
        <div className="border-t border-gray-200">
          <DraggableWaitingList
            entries={waitingList.entries}
            onReorder={handleReorderEntries}
            onMarkServiced={handleMarkServiced}
            reordering={reordering}
            formatTime={formatTime}
          />
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🐶</div>
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">No puppies on the waiting list yet</h3>
          <p className="text-sm text-gray-500 mb-6">Add a puppy to get started</p>
          <a
            href="/add-entry"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add to Waiting List
          </a>
        </div>
      )}
    </div>
  );
}
