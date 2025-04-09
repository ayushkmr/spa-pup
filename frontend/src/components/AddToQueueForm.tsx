"use client";

import { useState, useEffect, useRef } from "react";
import { puppyApi, waitingListApi } from "@/lib/api";
import { Puppy } from "@/types";

interface AddToQueueFormProps {
  onSuccess: () => void;
}

export default function AddToQueueForm({ onSuccess }: AddToQueueFormProps) {
  // Form state
  const [ownerName, setOwnerName] = useState("");
  const [puppyName, setPuppyName] = useState("");
  const [serviceRequired, setServiceRequired] = useState("");
  const [notes, setNotes] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Puppy data state
  const [puppies, setPuppies] = useState<Puppy[]>([]);
  const [filteredPuppies, setFilteredPuppies] = useState<Puppy[]>([]);
  const [showPuppyDropdown, setShowPuppyDropdown] = useState(false);
  const [showOwnerDropdown, setShowOwnerDropdown] = useState(false);
  const [selectedPuppy, setSelectedPuppy] = useState<Puppy | null>(null);
  const [isCreatingNewPuppy, setIsCreatingNewPuppy] = useState(false);

  // Refs for click outside handling
  const puppyDropdownRef = useRef<HTMLDivElement>(null);
  const ownerDropdownRef = useRef<HTMLDivElement>(null);

  // Fetch all puppies on component mount
  useEffect(() => {
    const fetchPuppies = async () => {
      try {
        const response = await puppyApi.getAll();
        setPuppies(response.data);
      } catch (err) {
        console.error("Failed to fetch puppies:", err);
        setError("Failed to load puppies. Please try again.");
      }
    };

    fetchPuppies();
  }, []);

  // Filter puppies based on input
  useEffect(() => {
    if (puppyName.trim() === "") {
      setFilteredPuppies([]);
      setShowPuppyDropdown(false);
      return;
    }

    const filtered = puppies.filter(puppy =>
      puppy.name.toLowerCase().includes(puppyName.toLowerCase())
    );

    setFilteredPuppies(filtered);
    setShowPuppyDropdown(true);

    // If exact match is found, auto-select the puppy
    const exactMatch = filtered.find(p => p.name.toLowerCase() === puppyName.toLowerCase());
    if (exactMatch) {
      setSelectedPuppy(exactMatch);
      setOwnerName(exactMatch.ownerName);
      setIsCreatingNewPuppy(false);
    } else {
      setIsCreatingNewPuppy(true);
    }
  }, [puppyName, puppies]);

  // Filter owners based on input and update filtered puppies when owner changes
  useEffect(() => {
    if (ownerName.trim() === "") {
      setShowOwnerDropdown(false);
      return;
    }

    // Get unique owner names
    const uniqueOwners = Array.from(new Set(puppies.map(p => p.ownerName)));
    const filtered = uniqueOwners.filter(name =>
      name.toLowerCase().includes(ownerName.toLowerCase())
    );

    if (filtered.length > 0) {
      setShowOwnerDropdown(true);
    } else {
      setShowOwnerDropdown(false);
    }

    // Check if there's an exact match for the owner name
    const exactOwnerMatch = uniqueOwners.find(name =>
      name.toLowerCase() === ownerName.toLowerCase()
    );

    // If we have an exact match and the puppy name field is empty,
    // filter puppies to show only those belonging to this owner
    if (exactOwnerMatch && puppyName.trim() === "") {
      const ownerPuppies = puppies.filter(p =>
        p.ownerName.toLowerCase() === exactOwnerMatch.toLowerCase()
      );

      if (ownerPuppies.length > 0) {
        setFilteredPuppies(ownerPuppies);
        setShowPuppyDropdown(true);
      }
    }
  }, [ownerName, puppies, puppyName]);

  // Handle click outside dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (puppyDropdownRef.current && !puppyDropdownRef.current.contains(event.target as Node)) {
        setShowPuppyDropdown(false);
      }
      if (ownerDropdownRef.current && !ownerDropdownRef.current.contains(event.target as Node)) {
        setShowOwnerDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle puppy selection
  const handleSelectPuppy = (puppy: Puppy) => {
    setPuppyName(puppy.name);
    setOwnerName(puppy.ownerName);
    setSelectedPuppy(puppy);
    setIsCreatingNewPuppy(false);
    setShowPuppyDropdown(false);
  };

  // Handle owner selection
  const handleSelectOwner = (ownerName: string) => {
    setOwnerName(ownerName);
    setShowOwnerDropdown(false);

    // Find puppies belonging to this owner
    const ownerPuppies = puppies.filter(p =>
      p.ownerName.toLowerCase() === ownerName.toLowerCase()
    );

    if (ownerPuppies.length > 0) {
      setFilteredPuppies(ownerPuppies);
      setShowPuppyDropdown(true);

      // If there's only one puppy for this owner, auto-select it
      if (ownerPuppies.length === 1) {
        setPuppyName(ownerPuppies[0].name);
        setSelectedPuppy(ownerPuppies[0]);
        setIsCreatingNewPuppy(false);
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!serviceRequired) {
      setError("Please select a service");
      return;
    }

    if (!puppyName.trim()) {
      setError("Please enter a puppy name");
      return;
    }

    if (!ownerName.trim()) {
      setError("Please enter an owner name");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let puppyId: number;

      // If creating a new puppy
      if (isCreatingNewPuppy || !selectedPuppy) {
        // Create new puppy
        const createResponse = await puppyApi.create({
          name: puppyName.trim(),
          ownerName: ownerName.trim()
        });

        puppyId = createResponse.data.id;

        // Update puppies list
        const updatedPuppies = await puppyApi.getAll();
        setPuppies(updatedPuppies.data);
      } else {
        // Use existing puppy
        puppyId = selectedPuppy.id;
      }

      // Ensure today's list exists
      try {
        await waitingListApi.createToday();
      } catch (err) {
        // Ignore error if list already exists
      }

      // Add entry to the list
      await waitingListApi.addEntry({
        puppyId,
        serviceRequired
      });

      // Reset form
      setSuccess(true);
      setPuppyName("");
      setOwnerName("");
      setServiceRequired("");
      setNotes("");
      setSelectedPuppy(null);
      setIsCreatingNewPuppy(false);

      // Call the onSuccess callback to refresh the list
      onSuccess();

      // Reset success message after a delay
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError("Failed to add entry to waiting list");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const serviceOptions = [
    "Bath & Dry",
    "Full Grooming",
    "Nail Trimming",
    "Teeth Brushing",
    "Flea Treatment"
  ];

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Add Puppy to Queue</h3>
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
              <p className="text-sm text-green-700">Puppy added to queue successfully!</p>
            </div>
          </div>
        </div>
      )}

      <div className="border-t border-gray-200">
        <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700">
                Owner Name
              </label>
              <div className="mt-1 relative" ref={ownerDropdownRef}>
                <input
                  type="text"
                  id="ownerName"
                  name="ownerName"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="Enter owner's name"
                  className="focus:ring-purple-500 focus:border-purple-500 block w-full rounded-md sm:text-sm border-gray-300"
                />
                {showOwnerDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto max-h-60">
                    {Array.from(new Set(puppies.map(p => p.ownerName)))
                      .filter(name => name.toLowerCase().includes(ownerName.toLowerCase()))
                      .map((name, index) => (
                        <div
                          key={index}
                          onClick={() => handleSelectOwner(name)}
                          className="cursor-pointer hover:bg-purple-50 py-2 px-3"
                        >
                          {name}
                        </div>
                      ))
                    }
                  </div>
                )}
              </div>
              {ownerName.trim() !== "" && (
                <p className="mt-1 text-sm font-medium" style={{ color: Array.from(new Set(puppies.map(p => p.ownerName))).some(name => name.toLowerCase() === ownerName.toLowerCase()) ? '#16a34a' : '#9333ea' }}>
                  {Array.from(new Set(puppies.map(p => p.ownerName))).some(name => name.toLowerCase() === ownerName.toLowerCase()) ? "Existing owner" : "New owner will be created"}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="puppyName" className="block text-sm font-medium text-gray-700">
                Puppy Name
              </label>
              <div className="mt-1 relative" ref={puppyDropdownRef}>
                <input
                  type="text"
                  id="puppyName"
                  name="puppyName"
                  value={puppyName}
                  onChange={(e) => setPuppyName(e.target.value)}
                  placeholder="Enter puppy's name"
                  className="focus:ring-purple-500 focus:border-purple-500 block w-full rounded-md sm:text-sm border-gray-300"
                  onClick={() => {
                    // Show owner's puppies when clicking on the input if owner is selected
                    if (ownerName.trim() !== "" && !showPuppyDropdown) {
                      const exactOwnerMatch = Array.from(new Set(puppies.map(p => p.ownerName)))
                        .find(name => name.toLowerCase() === ownerName.toLowerCase());

                      if (exactOwnerMatch) {
                        const ownerPuppies = puppies.filter(p =>
                          p.ownerName.toLowerCase() === exactOwnerMatch.toLowerCase()
                        );

                        if (ownerPuppies.length > 0) {
                          setFilteredPuppies(ownerPuppies);
                          setShowPuppyDropdown(true);
                        }
                      }
                    }
                  }}
                />
                {showPuppyDropdown && filteredPuppies.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto max-h-60">
                    {ownerName.trim() !== "" && filteredPuppies.every(p => p.ownerName.toLowerCase() === ownerName.toLowerCase()) && (
                      <div className="px-3 py-1 text-xs text-purple-600 font-medium border-b border-gray-100">
                        Puppies for {ownerName}
                      </div>
                    )}
                    {filteredPuppies.map((puppy) => (
                      <div
                        key={puppy.id}
                        onClick={() => handleSelectPuppy(puppy)}
                        className="cursor-pointer hover:bg-purple-50 py-2 px-3"
                      >
                        <div className="font-medium">{puppy.name}</div>
                        <div className="text-sm text-gray-500">{puppy.ownerName}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {puppyName.trim() !== "" && (
                <p className="mt-1 text-sm font-medium" style={{ color: isCreatingNewPuppy ? '#9333ea' : '#16a34a' }}>
                  {isCreatingNewPuppy ? "New puppy will be created" : "Using existing puppy"}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="serviceRequired" className="block text-sm font-medium text-gray-700">
                Service Required
              </label>
              <div className="mt-1">
                <select
                  id="serviceRequired"
                  name="serviceRequired"
                  value={serviceRequired}
                  onChange={(e) => setServiceRequired(e.target.value)}
                  className="focus:ring-purple-500 focus:border-purple-500 block w-full rounded-md sm:text-sm border-gray-300"
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

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Notes (Optional)
              </label>
              <div className="mt-1">
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special requirements or notes"
                  className="focus:ring-purple-500 focus:border-purple-500 block w-full rounded-md sm:text-sm border-gray-300"
                />
              </div>
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={loading || !puppyName.trim() || !ownerName.trim() || !serviceRequired}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-purple-300"
              >
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                {loading ? "Adding..." : "Add to Queue"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
