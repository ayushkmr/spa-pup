"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { puppyApi, waitingListApi } from "@/lib/api";
import { Puppy } from "@/types";

export default function AddEntry() {
  const router = useRouter();
  const [puppies, setPuppies] = useState<Puppy[]>([]);
  const [selectedPuppyId, setSelectedPuppyId] = useState<number | "">("");
  const [serviceRequired, setServiceRequired] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingPuppies, setFetchingPuppies] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchPuppies = async () => {
      try {
        setFetchingPuppies(true);
        const response = await puppyApi.getAll();
        setPuppies(response.data);
      } catch (err) {
        console.error("Failed to fetch puppies:", err);
        setError("Failed to load puppies. Please try again.");
      } finally {
        setFetchingPuppies(false);
      }
    };

    fetchPuppies();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPuppyId || !serviceRequired) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Ensure today's list exists
      try {
        await waitingListApi.createToday();
      } catch (err) {
        // Ignore error if list already exists
      }
      
      // Add entry to the list
      await waitingListApi.addEntry({
        puppyId: Number(selectedPuppyId),
        serviceRequired,
      });
      
      setSuccess(true);
      setSelectedPuppyId("");
      setServiceRequired("");
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (err) {
      setError("Failed to add entry to waiting list");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const serviceOptions = [
    "Bath",
    "Haircut",
    "Bath and Haircut",
    "Nail Trimming",
    "Teeth Cleaning",
    "Flea Treatment",
    "Full Grooming"
  ];

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Add to Waiting List</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Add a puppy to today's waiting list
        </p>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mx-6 mb-4">
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
      )}
      
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mx-6 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">Entry added successfully! Redirecting...</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="border-t border-gray-200">
        <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="puppyId" className="block text-sm font-medium text-gray-700">
                Select Puppy
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <select
                  id="puppyId"
                  name="puppyId"
                  value={selectedPuppyId}
                  onChange={(e) => setSelectedPuppyId(e.target.value ? Number(e.target.value) : "")}
                  className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                  disabled={fetchingPuppies}
                >
                  <option value="">Select a puppy</option>
                  {puppies.map((puppy) => (
                    <option key={puppy.id} value={puppy.id}>
                      {puppy.name} ({puppy.ownerName})
                    </option>
                  ))}
                </select>
              </div>
              {fetchingPuppies && (
                <p className="mt-2 text-sm text-gray-500">Loading puppies...</p>
              )}
              {!fetchingPuppies && puppies.length === 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500">No puppies found. Please add a puppy first.</p>
                  <a
                    href="/add-puppy"
                    className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add Puppy
                  </a>
                </div>
              )}
            </div>
            
            <div>
              <label htmlFor="serviceRequired" className="block text-sm font-medium text-gray-700">
                Service Required
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <select
                  id="serviceRequired"
                  name="serviceRequired"
                  value={serviceRequired}
                  onChange={(e) => setServiceRequired(e.target.value)}
                  className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                >
                  <option value="">Select a service</option>
                  {serviceOptions.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="mr-3 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || fetchingPuppies || puppies.length === 0}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
              >
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                {loading ? "Adding..." : "Add to List"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
