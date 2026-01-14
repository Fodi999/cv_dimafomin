"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Eye, Edit, Trash2, Archive, CheckCircle2, Clock, FileText, BookOpen, Trophy, Globe, Tag } from "lucide-react";
import Link from "next/link";
import { Challenge } from "@/lib/challenges/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "draft" | "published" | "archived">("all");

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    setLoading(true); // 🔹 Улучшение: loading при каждом fetch, не только первом
    try {
      const res = await fetch("/api/admin/challenges");
      if (!res.ok) {
        // If API returns error, just set empty array
        console.warn("Failed to fetch challenges:", res.status, res.statusText);
        setChallenges([]);
        return;
      }
      const data = await res.json();
      setChallenges(data.data || []);
    } catch (error) {
      console.error("Fetch error:", error);
      // On network error, set empty array so UI still renders
      setChallenges([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Видалити цей челендж?")) return;

    try {
      const res = await fetch(`/api/admin/challenges/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setChallenges((prev) => prev.filter((c) => c.id !== id));
      alert("Челендж видалено");
    } catch (error) {
      console.error("Delete error:", error);
      alert("Помилка видалення");
    }
  };

  const filteredChallenges =
    filter === "all"
      ? challenges
      : challenges.filter((c) => c.status === filter);

  const stats = {
    total: challenges.length,
    draft: challenges.filter((c) => c.status === "draft").length,
    published: challenges.filter((c) => c.status === "published").length,
    archived: challenges.filter((c) => c.status === "archived").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <div className="max-w-7xl mx-auto px-4 w-full flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between py-1 mb-1">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Челенджі</h1>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Керування челенджами та завданнями
            </p>
          </div>
          <Link href="/admin/challenges/create">
            <Button className="gap-2 h-8 text-sm bg-orange-500 hover:bg-orange-600">
              <Plus className="w-4 h-4" />
              Створити челендж
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
          <StatCard
            label="Всього"
            value={stats.total}
            icon={FileText}
            active={filter === "all"}
            onClick={() => setFilter("all")}
          />
          <StatCard
            label="Чернетки"
            value={stats.draft}
            icon={Clock}
            active={filter === "draft"}
            onClick={() => setFilter("draft")}
          />
          <StatCard
            label="Опубліковано"
            value={stats.published}
            icon={CheckCircle2}
            active={filter === "published"}
            onClick={() => setFilter("published")}
          />
          <StatCard
            label="Архів"
            value={stats.archived}
            icon={Archive}
            active={filter === "archived"}
            onClick={() => setFilter("archived")}
          />
        </div>

        {/* Challenges List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChallenges.length === 0 ? (
            <Card className="p-8">
              <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Челенджів не знайдено</p>
                <Link href="/admin/challenges/create">
                  <Button className="h-8 text-sm bg-orange-500 hover:bg-orange-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Створити перший челендж
                  </Button>
                </Link>
              </div>
            </Card>
          ) : (
            <div className="grid gap-3 pb-3">
              {filteredChallenges.map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({
  label,
  value,
  icon: Icon,
  active,
  onClick,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Card
      onClick={onClick}
      className={`cursor-pointer transition-all hover:shadow-md ${
        active
          ? "border-orange-500 bg-orange-50 dark:bg-orange-950/20"
          : "hover:border-orange-300"
      }`}
    >
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="text-left">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">{label}</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
          </div>
          <Icon className="w-6 h-6 text-orange-500" />
        </div>
      </CardContent>
    </Card>
  );
}

// Challenge Card Component
function ChallengeCard({
  challenge,
  onDelete,
}: {
  challenge: Challenge;
  onDelete: (id: string) => void;
}) {
  const statusConfig = {
    draft: { label: "Чернетка", variant: "secondary" as const, icon: Clock },
    published: { label: "Опубліковано", variant: "default" as const, icon: CheckCircle2 },
    archived: { label: "Архів", variant: "outline" as const, icon: Archive },
  };

  const status = statusConfig[challenge.status];
  const StatusIcon = status.icon;

  return (
    <Card className="hover:shadow-md transition-all">
      <CardContent className="p-3">
        <div className="flex items-start justify-between">
          {/* Left: Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{challenge.title}</h3>
              <Badge variant={status.variant} className="gap-1 h-5 text-xs">
                <StatusIcon className="w-3 h-3" />
                {status.label}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{challenge.description}</p>

            {/* Stats */}
            <div className="flex flex-wrap gap-3 text-xs text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                <strong>{challenge.totalQuestions}</strong> питань
              </div>
              <div className="flex items-center gap-1">
                <Trophy className="w-4 h-4" />
                <strong>{challenge.levels.join(", ")}</strong>
              </div>
              <div className="flex items-center gap-1">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <strong>
                  {Object.values(challenge.rewardsPerLevel).reduce((a, b) => a + b, 0)}
                </strong>{" "}
                токенів
              </div>
              <div className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                <strong>{challenge.language.toUpperCase()}</strong>
              </div>
              <div className="flex items-center gap-1">
                <Tag className="w-4 h-4" />
                <strong>{challenge.category}</strong>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex gap-1 ml-3">
            <Link href={`/challenges/${challenge.id}`} target="_blank">
              <Button variant="ghost" size="icon" className="h-8 w-8" title="Переглянути як гість">
                <Eye className="w-4 h-4" />
              </Button>
            </Link>
            <Link href={`/admin/challenges/${challenge.id}/edit`}>
              <Button variant="ghost" size="icon" className="h-8 w-8" title="Редагувати">
                <Edit className="w-4 h-4" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onDelete(challenge.id)}
              title="Видалити"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
