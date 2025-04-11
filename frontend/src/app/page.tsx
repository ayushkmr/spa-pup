"use client";

import { useEffect, useState } from "react";
import { waitingListApi, puppyApi } from "@/lib/api";
import { WaitingList, WaitingListEntry } from "@/types";
import PuppyGallery from "@/components/PuppyGallery";
import AddToQueueForm from "@/components/AddToQueueForm";
import TabbedWaitingList from "@/components/TabbedWaitingList";

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

    // Set up a timer to refresh the list every minute to check for appointments
    // that should move from future to waiting
    const timer = setInterval(() => {
      fetchTodayList();
    }, 60000); // Refresh every minute

    return () => clearInterval(timer);
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
    <div className="space-y-8">
      {/* Today's Queue Section */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Today's Puppy Queue</h2>
          <p className="text-sm sm:text-base text-gray-500">
            {waitingList ? formatDate(waitingList.date) : 'No date available'}
          </p>
        </div>

        {/* Tabbed Waiting/Serviced List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          {waitingList ? (
            <TabbedWaitingList
              entries={waitingList.entries}
              onReorder={handleReorderEntries}
              onMarkServiced={handleMarkServiced}
              reordering={reordering}
              formatTime={formatTime}
            />
          ) : (
            <div className="text-center py-8 sm:py-12">
              <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">🐶</div>
              <h3 className="text-base sm:text-lg leading-6 font-medium text-gray-900 mb-2">No puppies in the queue yet</h3>
              <p className="text-xs sm:text-sm text-gray-500">Add a puppy using the form below</p>
            </div>
          )}
        </div>

        {/* Add to Queue Form */}
        <AddToQueueForm onSuccess={fetchTodayList} />
      </div>

      {/* Puppy Gallery Section - Moved to bottom */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-3 sm:p-4">
        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2 text-center sm:text-left">Our Pampered Pups</h3>
        <PuppyGallery className="mt-2" />
      </div>

      {/* Quote Section */}
      <div className="text-center py-4 sm:py-6">
        <p className="text-xs sm:text-sm text-gray-600 italic px-4 sm:px-0">"A dog will teach you unconditional love. If you can have that in your life, things won't be too bad." 🐾</p>
      </div>
    </div>
  );
}
