"use client";

import { useState, useEffect } from "react";
import Link from "next/link";


interface Entry {
  _id: string;
  mood: number;
  note?: string;
  createdAt: string;
}




export default function HistoryPage() {
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    fetch("/api/entries")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setEntries(data.entries);
      });
  }, []);



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
            className = "mt-6 block text-center text-sm text-gray-500 hover:text-gray-700"
            
            
            >
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Mood Stats
            </button>

            </Link>
        </div>

    
    
      </div>
    </div>
  );
}
