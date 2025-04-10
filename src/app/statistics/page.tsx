"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import StatisticsView from "@/components/StatisticsView";

export default function StatisticsPage() {
  return (
    <ProtectedRoute>
      <div>
        <h1 className="text-2xl font-bold mb-6">Spa Statistics</h1>
        <StatisticsView />
      </div>
    </ProtectedRoute>
  );
}
