"use client";

import { motion } from "framer-motion";

interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  avatar: string;
  badges: number;
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
}

export default function LeaderboardTable({ entries }: LeaderboardTableProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-[#1E1A41] to-[#2B6A79]">
            <tr>
              <th className="px-6 py-4 text-left text-white font-semibold">Місце</th>
              <th className="px-6 py-4 text-left text-white font-semibold">Шеф</th>
              <th className="px-6 py-4 text-right text-white font-semibold">Бали</th>
              <th className="px-6 py-4 text-right text-white font-semibold">Значки</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-b border-gray-100 hover:bg-[#FEF9F5] transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {entry.rank <= 3 && (
                      <span className="text-2xl">
                        {entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : "🥉"}
                      </span>
                    )}
                    <span className="font-bold text-[#1E1A41]">#{entry.rank}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3BC864] to-[#C5E98A] flex items-center justify-center text-white font-bold">
                      {entry.avatar}
                    </div>
                    <span className="font-semibold text-[#1E1A41]">{entry.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="font-bold text-[#3BC864]">{entry.points}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-[#1E1A41]/70">{entry.badges} 🏅</span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
