"use client";

import { Trophy } from "lucide-react";
import LeaderboardTable from "@/components/academy/LeaderboardTable";

const mockData = [
  { rank: 1, name: "Dima Fomin", points: 2450, avatar: "DF", badges: 12 },
  { rank: 2, name: "Anna Kowalska", points: 2380, avatar: "AK", badges: 10 },
  { rank: 3, name: "Jan Nowak", points: 2250, avatar: "JN", badges: 9 },
  { rank: 4, name: "Maria Wiśniewska", points: 2100, avatar: "MW", badges: 8 },
  { rank: 5, name: "Piotr Zieliński", points: 1950, avatar: "PZ", badges: 7 },
  { rank: 6, name: "Katarzyna Lewandowska", points: 1850, avatar: "KL", badges: 6 },
  { rank: 7, name: "Tomasz Kamiński", points: 1750, avatar: "TK", badges: 5 },
  { rank: 8, name: "Magdalena Piotrowska", points: 1650, avatar: "MP", badges: 5 },
];

export default function LeaderboardPage() {
  return (
    <div className="max-w-4xl mx-auto relative">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-[#1E1A41] mb-4 flex items-center justify-center gap-3">
          <Trophy className="w-12 h-12 text-amber-500" />
          Рейтинг шефів
        </h1>
        <p className="text-lg text-[#1E1A41]/70">
          Топ професіоналів Академії суші
        </p>
      </div>

      {/* Leaderboard */}
      <LeaderboardTable entries={mockData} />

      {/* Info */}
      <div className="mt-8 p-6 bg-white rounded-xl shadow-md">
        <h3 className="font-semibold text-[#1E1A41] mb-2 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          Як формується рейтинг?
        </h3>
        <ul className="space-y-2 text-sm text-[#1E1A41]/70">
          <li>✅ Завершення курсів та модулів</li>
          <li>🎯 Оцінки за практичні завдання</li>
          <li>🏅 Отримані значки та сертифікати</li>
          <li>💬 Відгуки від інструкторів</li>
        </ul>
      </div>
    </div>
  );
}
