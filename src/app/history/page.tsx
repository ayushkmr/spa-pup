"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import HistoryView from "@/components/HistoryView";

export default function HistoryPage() {
  return (
    <ProtectedRoute>
      <div>
        <h1 className="text-2xl font-bold mb-6">Waiting List History</h1>
        <HistoryView />
      </div>
    </ProtectedRoute>
  );
}
