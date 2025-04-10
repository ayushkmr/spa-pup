"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import AddToQueueForm from "@/components/AddToQueueForm";

export default function AddEntryPage() {
  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Add Puppy to Queue</h1>
        <div className="bg-white shadow-md rounded-lg p-6">
          <AddToQueueForm />
        </div>
      </div>
    </ProtectedRoute>
  );
}
