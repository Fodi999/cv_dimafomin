/**
 * Activity Log Page - Журнал активності
 * Route: /admin/activity-log
 * Purpose: Аудит системы - юридически важная страница для финансов, доступов и безопасности
 * Features: История действий, фильтры, экспорт, детали событий (read-only)
 */

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Activity,
  Download,
  Clock,
  User,
  FileText,
  Trash2,
  Edit3,
  Plus,
  Eye,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock-модель согласно требованиям
type ActivityEventType = "payment" | "create" | "update" | "delete" | "login" | "logout" | "export" | "import";

interface ActivityEvent {
  id: string;
  type: ActivityEventType;
  title: string;
  description: string;
  user?: string;
  ip?: string;
  meta?: Record<string, any>;
  createdAt: string;
}

const mockEvents: ActivityEvent[] = [
  {
    id: "1",
    type: "payment",
    title: "Платіж отримано",
    description: "Замовлення #ORD-2451 оплачено через Stripe",
    user: "Система",
    ip: "192.168.1.1",
    meta: {
      orderId: "ORD-2451",
      amount: 45.99,
      currency: "PLN",
      paymentMethod: "stripe",
    },
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: "2",
    type: "create",
    title: "Створено замовлення",
    description: "Новий користувач Іван Петров створив замовлення",
    user: "Іван Петров",
    ip: "203.0.113.42",
    meta: {
      orderId: "ORD-2450",
      itemsCount: 3,
    },
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
  },
  {
    id: "3",
    type: "login",
    title: "Вхід адміністратора",
    description: "System Administrator увійшов в систему",
    user: "System Administrator",
    ip: "198.51.100.5",
    meta: {
      twoFactorVerified: true,
      userAgent: "Mozilla/5.0...",
    },
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
  },
  {
    id: "4",
    type: "update",
    title: "Оновлено замовлення",
    description: "Статус замовлення змінено на 'В обробці'",
    user: "Марія Сидорова",
    ip: "192.0.2.10",
    meta: {
      orderId: "ORD-2449",
      oldStatus: "pending",
      newStatus: "processing",
    },
    createdAt: new Date(Date.now() - 60 * 60000).toISOString(),
  },
  {
    id: "5",
    type: "export",
    title: "Експорт даних",
    description: "Експортовано 100 замовлень в CSV",
    user: "System Administrator",
    ip: "198.51.100.5",
    meta: {
      format: "CSV",
      recordsCount: 100,
      exportType: "orders",
    },
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: "6",
    type: "delete",
    title: "Видалено замовлення",
    description: "Замовлення #ORD-2447 видалено з системи",
    user: "Алексей Иванов",
    ip: "192.168.2.50",
    meta: {
      orderId: "ORD-2447",
      reason: "Duplicate",
    },
    createdAt: new Date(Date.now() - 3 * 3600000).toISOString(),
  },
];

// Цветовая логика согласно требованиям
const typeConfig: Record<
  ActivityEventType,
  { icon: React.ComponentType<{ size: number; className?: string }>; color: string; label: string }
> = {
  payment: {
    icon: Activity,
    color: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
    label: "Платіж",
  },
  create: {
    icon: Plus,
    color: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
    label: "Створено",
  },
  update: {
    icon: Edit3,
    color: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
    label: "Оновлено",
  },
  delete: {
    icon: Trash2,
    color: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
    label: "Видалено",
  },
  login: {
    icon: User,
    color: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
    label: "Вхід",
  },
  logout: {
    icon: User,
    color: "bg-slate-100 dark:bg-slate-900/30 text-slate-700 dark:text-slate-400",
    label: "Вихід",
  },
  export: {
    icon: Download,
    color: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
    label: "Експорт",
  },
  import: {
    icon: FileText,
    color: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400",
    label: "Імпорт",
  },
};

export default function ActivityLogPage() {
  const [events] = useState(mockEvents);
  const [filteredEvents, setFilteredEvents] = useState(mockEvents);
  const [selectedType, setSelectedType] = useState<ActivityEventType | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<ActivityEvent | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isJsonExpanded, setIsJsonExpanded] = useState(false);

  const handleFilter = (type: ActivityEventType | null) => {
    setSelectedType(type);
    filterEvents(type, searchQuery);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterEvents(selectedType, query);
  };

  const filterEvents = (type: ActivityEventType | null, query: string) => {
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
          event.user?.toLowerCase().includes(lowerQuery)
      );
    }

    setFilteredEvents(filtered);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffMin < 1) return "щойно";
    if (diffMin < 60) return `${diffMin} хв тому`;
    if (diffHour < 24) return `${diffHour} год тому`;
    if (diffDay < 7) return `${diffDay} дн тому`;
    return date.toLocaleDateString("uk-UA");
  };

  const handleViewDetails = (event: ActivityEvent) => {
    setSelectedEvent(event);
    setIsDetailsOpen(true);
  };

  const handleExport = (format: "csv" | "json") => {
    // Mock экспорт
    const data = format === "csv" 
      ? filteredEvents.map(e => `${e.id},${e.type},${e.title},${e.user || ""},${e.createdAt}`).join("\n")
      : JSON.stringify(filteredEvents, null, 2);
    
    const blob = new Blob([data], { type: format === "csv" ? "text/csv" : "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `activity-log-${new Date().toISOString().split("T")[0]}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getEventCount = (type: ActivityEventType) => {
    return events.filter((e) => e.type === type).length;
  };

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col gap-4 overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <Activity className="h-7 w-7 text-purple-600 dark:text-purple-400" />
          Журнал активності
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Аудит системи — що, хто, коли, звідки. Юридично важлива сторінка для фінансів, доступів та безпеки.
        </p>
      </div>

      {/* Filters */}
      <Card className="flex-shrink-0">
        <CardContent className="p-4 space-y-4">
          <div className="flex gap-4 items-center">
            <Input
              placeholder="Пошук по назві, користувачу, описі..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="flex-1"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Експорт
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExport("csv")}>
                  Експорт CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("json")}>
                  Експорт JSON
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={() => handleFilter(null)}
              variant={selectedType === null ? "default" : "outline"}
              size="sm"
            >
              Всі події ({events.length})
            </Button>
            {Object.entries(typeConfig).map(([key, config]) => {
              const type = key as ActivityEventType;
              const count = getEventCount(type);
              return (
                <Button
                  key={key}
                  onClick={() => handleFilter(type)}
                  variant={selectedType === type ? "default" : "outline"}
                  size="sm"
                  className={selectedType === type ? config.color : ""}
                >
                  {config.label} ({count})
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Events Timeline */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event, index) => {
            const config = typeConfig[event.type];
            const IconComponent = config.icon;

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* Icon */}
                      <div className={`${config.color} p-3 rounded-lg h-fit`}>
                        <IconComponent size={20} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-slate-900 dark:text-white">
                              {event.title}
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {event.description}
                            </p>
                          </div>
                          <div className="text-right ml-4 flex-shrink-0">
                            <p className="text-xs text-slate-500 dark:text-slate-500 flex items-center gap-1 justify-end">
                              <Clock className="w-3 h-3" />
                              {formatTime(event.createdAt)}
                            </p>
                          </div>
                        </div>

                        {/* Meta Information */}
                        <div className="flex gap-4 mt-3 flex-wrap">
                          {event.user && (
                            <div className="text-sm">
                              <span className="text-slate-600 dark:text-slate-400">Користувач: </span>
                              <span className="font-medium text-slate-900 dark:text-white">
                                {event.user}
                              </span>
                            </div>
                          )}
                          {event.ip && (
                            <div className="text-sm">
                              <span className="text-slate-600 dark:text-slate-400">IP: </span>
                              <code className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-900 dark:text-white font-mono text-xs">
                                {event.ip}
                              </code>
                            </div>
                          )}
                          {event.meta?.orderId && (
                            <Badge variant="outline" className="text-slate-700 dark:text-slate-300">
                              Order: {event.meta.orderId}
                            </Badge>
                          )}
                          {event.meta?.amount && (
                            <Badge variant="outline" className="text-green-700 dark:text-green-400">
                              Amount: {event.meta.amount} {event.meta.currency || "PLN"}
                            </Badge>
                          )}
                          {event.meta?.format && (
                            <Badge variant="outline" className="text-slate-700 dark:text-slate-300">
                              Format: {event.meta.format}
                            </Badge>
                          )}
                          {event.meta?.twoFactorVerified && (
                            <Badge className="bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400">
                              2FA verified
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Action Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="self-start flex-shrink-0"
                        onClick={() => handleViewDetails(event)}
                        title="Переглянути деталі"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Activity className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Активність ще не зафіксована</h3>
              <p className="text-muted-foreground">
                Тут будуть відображатися всі дії користувачів і системи
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Info Block - Связь с другими модулями */}
      <Card className="flex-shrink-0 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-purple-900 dark:text-purple-100 mb-1">
                Связь с другими модулями
              </p>
              <p className="text-xs text-purple-800 dark:text-purple-200">
                <strong>Auth</strong> (login/logout), <strong>Orders</strong> (create/update/cancel), 
                <strong> Payments</strong> (success/failed), <strong>Inventory</strong> (expired/write-off), 
                <strong> Admin</strong> (role change), <strong>Integrations</strong> (connected/failed). 
                Frontend не знает, кто пишет — он только отображает.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details Sheet (Read-only) */}
      <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selectedEvent && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedEvent.title}</SheetTitle>
                <SheetDescription>{selectedEvent.description}</SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-4">
                {/* Event ID */}
                <div>
                  <Label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                    Event ID
                  </Label>
                  <p className="text-sm font-mono text-slate-900 dark:text-white mt-1">
                    {selectedEvent.id}
                  </p>
                </div>

                {/* Timestamp */}
                <div>
                  <Label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                    Точний timestamp
                  </Label>
                  <p className="text-sm text-slate-900 dark:text-white mt-1">
                    {new Date(selectedEvent.createdAt).toLocaleString("uk-UA", {
                      dateStyle: "full",
                      timeStyle: "long",
                    })}
                  </p>
                </div>

                {/* User */}
                {selectedEvent.user && (
                  <div>
                    <Label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                      Користувач
                    </Label>
                    <p className="text-sm text-slate-900 dark:text-white mt-1">{selectedEvent.user}</p>
                  </div>
                )}

                {/* IP */}
                {selectedEvent.ip && (
                  <div>
                    <Label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                      IP Address
                    </Label>
                    <p className="text-sm font-mono text-slate-900 dark:text-white mt-1">
                      {selectedEvent.ip}
                    </p>
                  </div>
                )}

                {/* User Agent (позже) */}
                {selectedEvent.meta?.userAgent && (
                  <div>
                    <Label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                      User Agent
                    </Label>
                    <p className="text-sm text-slate-900 dark:text-white mt-1 break-all">
                      {selectedEvent.meta.userAgent}
                    </p>
                  </div>
                )}

                {/* Related Entities */}
                {(selectedEvent.meta?.orderId ||
                  selectedEvent.meta?.productId ||
                  selectedEvent.meta?.userId) && (
                  <div>
                    <Label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                      Пов'язані сутності
                    </Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedEvent.meta.orderId && (
                        <Badge variant="outline">Order: {selectedEvent.meta.orderId}</Badge>
                      )}
                      {selectedEvent.meta.productId && (
                        <Badge variant="outline">Product: {selectedEvent.meta.productId}</Badge>
                      )}
                      {selectedEvent.meta.userId && (
                        <Badge variant="outline">User: {selectedEvent.meta.userId}</Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Raw Payload (JSON, collapsed) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                      Raw Payload (JSON)
                    </Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsJsonExpanded(!isJsonExpanded)}
                    >
                      {isJsonExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  {isJsonExpanded && (
                    <pre className="bg-slate-100 dark:bg-slate-800 p-3 rounded text-xs font-mono overflow-x-auto">
                      {JSON.stringify(selectedEvent, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
