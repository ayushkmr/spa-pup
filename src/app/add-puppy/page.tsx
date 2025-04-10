"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import AddPuppyForm from "@/components/AddPuppyForm";

export default function AddPuppyPage() {
  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Add New Puppy</h1>
        <div className="bg-white shadow-md rounded-lg p-6">
          <AddPuppyForm />
        </div>
      </div>
    </ProtectedRoute>
  );
}
