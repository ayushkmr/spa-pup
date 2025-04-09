"use client";

import { useEffect, useState } from "react";
// Using fetch instead of axios

export default function TestPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("http://localhost:3005/puppy/all");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
        console.log("API Response:", result);
      } catch (err) {
        console.error("API Error:", err);
        setError("Failed to fetch data from the API");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTestReorder = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get today's waiting list
      const listResponse = await fetch("http://localhost:3005/waiting-list/today");
      if (!listResponse.ok) {
        throw new Error(`HTTP error! status: ${listResponse.status}`);
      }
      const listData = await listResponse.json();
      console.log("Today's List:", listData);

      if (listData && listData.entries && listData.entries.length >= 2) {
        // Get the entry IDs
        const entryIds = listData.entries.map((entry: any) => entry.id);

        // Swap the last two entries
        const lastIndex = entryIds.length - 1;
        [entryIds[lastIndex], entryIds[lastIndex - 1]] = [entryIds[lastIndex - 1], entryIds[lastIndex]];

        // Reorder the entries
        const reorderResponse = await fetch("http://localhost:3005/waiting-list/reorder", {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            entryOrder: entryIds
          })
        });

        if (!reorderResponse.ok) {
          throw new Error(`HTTP error! status: ${reorderResponse.status}`);
        }
        const reorderData = await reorderResponse.json();
        console.log("Reorder Response:", reorderData);

        // Get the updated waiting list
        const updatedListResponse = await fetch("http://localhost:3005/waiting-list/today");
        if (!updatedListResponse.ok) {
          throw new Error(`HTTP error! status: ${updatedListResponse.status}`);
        }
        const updatedListData = await updatedListResponse.json();
        console.log("Updated List:", updatedListData);

        setData({
          original: listData,
          reordered: reorderData,
          updated: updatedListData
        });
      } else {
        setError("Not enough entries to reorder");
      }
    } catch (err) {
      console.error("Reorder Error:", err);
      setError("Failed to reorder entries");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API Test Page</h1>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <button
              onClick={handleTestReorder}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Test Reordering
            </button>
          </div>

          <div className="bg-gray-100 p-4 rounded">
            <h2 className="text-lg font-semibold mb-2">API Response:</h2>
            <pre className="whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
