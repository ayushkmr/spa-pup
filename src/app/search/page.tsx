"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import SearchView from "@/components/SearchView";

export default function SearchPage() {
  return (
    <ProtectedRoute>
      <div>
        <h1 className="text-2xl font-bold mb-6">Search Records</h1>
        <SearchView />
      </div>
    </ProtectedRoute>
  );
}
