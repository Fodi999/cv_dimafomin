"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Activity, Filter, Download, Clock, User, FileText, Trash2, Edit3, Plus, Eye } from "lucide-react";

interface ActivityEvent {
  id: string;
  type: "create" | "update" | "delete" | "login" | "logout" | "export" | "import" | "payment";
  title: string;
  description: string;
  user: string;
  timestamp: Date;
  details?: string;
  ipAddress?: string;
}

const mockEvents: ActivityEvent[] = [
  {
    id: "1",
    type: "payment",
    title: "Платіж отримано",
    description: "Замовлення #ORD-2451 оплачено через Stripe",
    user: "Система",
    timestamp: new Date(Date.now() - 5 * 60000),
    details: "Amount: $45.99",
    ipAddress: "192.168.1.1",
  },
  {
    id: "2",
    type: "create",
    title: "Створено замовлення",
    description: "Новий користувач Іван Петров створив замовлення",
    user: "Іван Петров",
    timestamp: new Date(Date.now() - 15 * 60000),
    details: "Order: #ORD-2450",
    ipAddress: "203.0.113.42",
  },
  {
    id: "3",
    type: "login",
    title: "Вхід адміністратора",
    description: "System Administrator увійшов в систему",
    user: "System Administrator",
    timestamp: new Date(Date.now() - 30 * 60000),
    details: "2FA verified",
    ipAddress: "198.51.100.5",
  },
  {
    id: "4",
    type: "update",
    title: "Оновлено замовлення",
    description: "Статус замовлення змінено на 'В обробці'",
    user: "Марія Сидорова",
    timestamp: new Date(Date.now() - 60 * 60000),
    details: "Order #ORD-2449",
    ipAddress: "192.0.2.10",
  },
  {
    id: "5",
    type: "export",
    title: "Експорт даних",
    description: "Експортовано 100 замовлень в CSV",
    user: "System Administrator",
    timestamp: new Date(Date.now() - 2 * 3600000),
    details: "Format: CSV",
    ipAddress: "198.51.100.5",
  },
  {
    id: "6",
    type: "delete",
    title: "Видалено замовлення",
    description: "Замовлення #ORD-2447 видалено з системи",
    user: "Алексей Иванов",
    timestamp: new Date(Date.now() - 3 * 3600000),
    details: "Reason: Duplicate",
    ipAddress: "192.168.2.50",
  },
];

const typeConfig = {
  create: { icon: Plus, color: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400", label: "Створено" },
  update: { icon: Edit3, color: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400", label: "Оновлено" },
  delete: { icon: Trash2, color: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400", label: "Видалено" },
  login: { icon: User, color: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400", label: "Вхід" },
  logout: { icon: User, color: "bg-slate-100 dark:bg-slate-900/30 text-slate-700 dark:text-slate-400", label: "Вихід" },
  export: { icon: Download, color: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400", label: "Експорт" },
  import: { icon: FileText, color: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400", label: "Імпорт" },
  payment: { icon: Activity, color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400", label: "Платіж" },
};

export default function ActivityLogPage() {
  const [events, setEvents] = useState(mockEvents);
  const [filteredEvents, setFilteredEvents] = useState(mockEvents);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleFilter = (type: string | null) => {
    setSelectedType(type);
    filterEvents(type, searchQuery);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterEvents(selectedType, query);
  };

  const filterEvents = (type: string | null, query: string) => {
    let filtered = events;

    if (type) {
      filtered = filtered.filter((event) => event.type === type);
    }

    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(lowerQuery) ||
          event.description.toLowerCase().includes(lowerQuery) ||
          event.user.toLowerCase().includes(lowerQuery)
      );
    }

    setFilteredEvents(filtered);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffMin < 1) return "щойно";
    if (diffMin < 60) return `${diffMin}м тому`;
    if (diffHour < 24) return `${diffHour}г тому`;
    if (diffDay < 7) return `${diffDay}д тому`;
    return date.toLocaleDateString("uk-UA");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <Activity size={32} className="text-purple-600" />
          Журнал активності
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Переглядайте всі дії, виконані в системі
        </p>
      </div>

      {/* Filters */}
      <Card className="p-4 space-y-4">
        <div className="flex gap-4 items-center">
          <Input
            placeholder="Пошук по назві, користувачу, описі..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="flex-1"
          />
          <Button variant="outline" className="flex items-center gap-2">
            <Download size={18} />
            Експорт
          </Button>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={() => handleFilter(null)}
            variant={selectedType === null ? "default" : "outline"}
            className="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600"
          >
            Всі подій ({events.length})
          </Button>
          {Object.entries(typeConfig).map(([key, config]) => (
            <Button
              key={key}
              onClick={() => handleFilter(key)}
              variant={selectedType === key ? "default" : "outline"}
              className={selectedType === key ? config.color : ""}
            >
              {config.label} ({events.filter((e) => e.type === key).length})
            </Button>
          ))}
        </div>
      </Card>

      {/* Events Timeline */}
      <div className="space-y-4">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event, index) => {
            const config = typeConfig[event.type as keyof typeof typeConfig];
            const IconComponent = config.icon;

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex gap-4">
                    {/* Icon */}
                    <div className={`${config.color} p-3 rounded-lg h-fit`}>
                      <IconComponent size={20} />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white">
                            {event.title}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {event.description}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-500 dark:text-slate-500 flex items-center gap-1 justify-end">
                            <Clock size={14} />
                            {formatTime(event.timestamp)}
                          </p>
                        </div>
                      </div>

                      {/* Meta Information */}
                      <div className="flex gap-4 mt-3 flex-wrap">
                        <div className="text-sm">
                          <span className="text-slate-600 dark:text-slate-400">Користувач: </span>
                          <span className="font-medium text-slate-900 dark:text-white">
                            {event.user}
                          </span>
                        </div>
                        {event.ipAddress && (
                          <div className="text-sm">
                            <span className="text-slate-600 dark:text-slate-400">IP: </span>
                            <code className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-900 dark:text-white font-mono text-xs">
                              {event.ipAddress}
                            </code>
                          </div>
                        )}
                        {event.details && (
                          <Badge variant="outline" className="text-slate-700 dark:text-slate-300">
                            {event.details}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button variant="ghost" size="sm" className="self-start">
                      <Eye size={16} />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
          >
            <Activity size={48} className="text-slate-400 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Подій не знайдено
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-center">
              Спробуйте змінити фільтри або параметри пошуку
            </p>
          </motion.div>
        )}
      </div>

      {/* Pagination */}
      {filteredEvents.length > 0 && (
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Показано {filteredEvents.length} з {events.length} подій
          </p>
          <div className="flex gap-2">
            <Button variant="outline" disabled>
              ← Попередня
            </Button>
            <Button variant="outline" disabled>
              Наступна →
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
