"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function Home() {
  const [mood, setMood] = useState<number | null>(null);
  const [note, setNote] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (mood == null) {
      toast.error("Please enter a valid mood number");
      return;
    }

    try {
      const res = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood, note }),
      });

      if (!res.ok) throw new Error("Failed to save entry");

      const data = await res.json();
      console.log("Saved entry:", data);

      toast.success("Entry saved successfully");
      // Reset after save
      setMood(null);
      setNote("");
    } catch (err) {
      toast.error("⚠️ Something went wrong. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 via-white to-pink-100 flex items-center justify-center">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-indigo-600">
          🌙 Mood Journal
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              How are you feeling today?
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={mood ?? 5}
              onChange={(e) => setMood(Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
            <p className="text-center mt-2 text-lg font-semibold">
              Mood:{" "}
              <span className="text-indigo-600">{mood ?? "?"}</span>/10
            </p>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Add a short note
            </label>
            <textarea
              placeholder="Write what's on your mind..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              rows={3}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-lg shadow-md transition-all"
          >
            Save Entry
          </button>
        </form>

        <Link href="/history" className="mt-4 block">
          <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-lg shadow-md transition-all">
            View Mood History
          </button>
        </Link>
      </div>
    </div>
  );
}
