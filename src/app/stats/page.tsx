"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface Entry {
  _id: string;
  mood: number;
  note?: string;
  createdAt: string;
}

function getMoodEmoji(value: number) {
  if (value >= 8) return "😁";
  if (value >= 5) return "🙂";
  if (value >= 3) return "😐";
  return "😢";
}

export default function StatsPage() {
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    fetch("/api/entries")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setEntries(data.entries);
      });
  }, []);

  const chartData = [...entries]
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
    .map((entry) => ({
      date: new Date(entry.createdAt).toLocaleString("en-US", {
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      }),
      mood: entry.mood,
    }));

  return (
    <>
      {entries.length > 0 ? (
        <div className="mt-10 bg-white shadow-md rounded-lg p-6 w-full">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            📈 Mood Trend
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart 
            data={chartData}
            margin={{
              top: 40,
              right: 40,
              left: 40,
              bottom: 40,
            }}
            
            
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 10]} />
              <Tooltip
                content={({ payload, label }) => {
                  if (!payload || payload.length === 0) return null;
                  const moodValue = payload[0].payload.mood;
                  return (
                    <div className="bg-white shadow-md rounded p-2 text-sm">
                      <p className="font-semibold">{label}</p>
                      <p>
                        Mood: {moodValue} {getMoodEmoji(moodValue)}
                      </p>
                    </div>
                  )
                }}
              />
              <Line
                type="monotone"
                dataKey="mood"
                stroke="#6366f1"
                strokeWidth={3}
                dot={(props) => {
                  const { cx, cy, value, index } = props;
                  return (
                    <text
                      key={index}
                      x={cx}
                      y={cy}
                      dy={-10}
                      textAnchor="middle"
                      fontSize={20}
                    >
                      {getMoodEmoji(value as number)}
                    </text>
                  );
                }}
                isAnimationActive={false}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>

          <div>
          <Link
            href="/"
            className = "mt-6 block text-center text-sm text-gray-500 hover:text-gray-700"
            >
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Back to Home
            </button>

            </Link>
          </div>

          <div>
          <Link
            href="/history"
            className = "mt-6 block text-center text-sm text-gray-500 hover:text-gray-700"
            >
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            History
            </button>

            </Link>
          </div>
        </div>
        
      ) : (

        <div className="mt-10 bg-white shadow-md rounded-lg p-6 w-full text-center">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          📭 No mood data yet
        </h2>
        <p className="text-gray-500 mb-6">
          Start adding entries to see your mood trends over time.
        </p>
        <Link
          href="/"
          className="block text-center text-sm text-gray-500 hover:text-gray-700"
        >
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Go Back to Home
          </button>
        </Link>
      </div>

      )}
    </>
  );
}
