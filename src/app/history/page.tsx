"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

interface Entry {
  _id: string;
  mood: number;
  note?: string;
  aiReflection?: string;
  createdAt: string;
}

export default function HistoryPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null); 

  useEffect(() => {
    fetch("/api/entries")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setEntries(data.entries);
      });
  }, []);

  async function confirmDelete(id: string) {
    const res = await fetch(`/api/entries/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      toast.success("Entry deleted successfully");
      setEntries(entries.filter((e) => e._id !== id));
    } else {
      toast.error("Failed to delete entry");
    }
    setDeleteId(null); // close modal
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-white to-orange-50 flex flex-col items-center p-6">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center text-orange-600 mb-8">
          📜 Mood History
        </h1>

        {entries.length === 0 ? (
          <p className="text-gray-500 text-center">No entries yet.</p>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div
                key={entry._id}
                className="bg-white shadow-md rounded-lg p-4 border-l-4"
                style={{
                  borderColor:
                    entry.mood >= 7
                      ? "#22c55e"
                      : entry.mood >= 4
                      ? "#facc15"
                      : "#ef4444",
                }}
              >
                <p className="text-sm text-gray-500">
                  {new Date(entry.createdAt).toLocaleString()}
                </p>
                <p className="text-lg font-semibold">Mood: {entry.mood}/10</p>
                {entry.note && (
                  <p className="text-gray-700 mt-2 italic">“{entry.note}”</p>
                )}
                {entry.aiReflection && (
                  <p className="text-gray-700 mt-2">
                    Feedback: {entry.aiReflection}
                  </p>
                )}
                <button
                  onClick={() => setDeleteId(entry._id)} 
                  className="mt-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

        <div>
          <Link
            href="/"
            className="mt-6 block text-center text-sm text-gray-500 hover:text-gray-700"
          >
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Back to Home
            </button>
          </Link>
        </div>

        <div>
          <Link
            href="/stats"
            className="mt-6 block text-center text-sm text-gray-500 hover:text-gray-700"
          >
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Mood Stats
            </button>
          </Link>
        </div>
      </div>

   
      {deleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Confirm Deletion
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this entry? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteId(null)} 
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete(deleteId)} // confirm delete
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
