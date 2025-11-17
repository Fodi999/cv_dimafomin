"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { UserProfileModal } from "@/components/admin/UserProfileModal";
import { Users, Search, Filter, Download, Plus, Eye, Edit2, Trash2, ShieldCheck, ChevronDown } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  role: "admin" | "premium" | "user";
  status: "active" | "inactive" | "banned";
  joinDate: Date;
  orders: number;
  totalSpent: number;
  lastLogin?: Date;
  verificationStatus: "verified" | "pending" | "unverified";
}

// DetailSection компонент для компактного отображения
interface DetailSectionProps {
  label: string;
  value?: string;
  customContent?: React.ReactNode;
  isInactive?: boolean;
  isHighlight?: boolean;
}

const DetailSection: React.FC<DetailSectionProps> = ({ 
  label, 
  value, 
  customContent, 
  isInactive = false,
  isHighlight = false 
}) => (
  <div className="flex flex-col py-2 px-2 rounded hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1">{label}</p>
    <div>
      {customContent ? (
        customContent
      ) : (
        <p className={`text-sm font-medium ${
          isInactive 
            ? "text-amber-600 dark:text-amber-400" 
            : isHighlight
            ? "text-green-600 dark:text-green-400"
            : "text-slate-900 dark:text-white"
        }`}>
          {value}
        </p>
      )}
    </div>
  </div>
);

const mockUsers: User[] = [
  {
    id: "1",
    name: "Іван Петров",
    email: "ivan@example.com",
    phone: "+380 95 123 4567",
    location: "Київ, Україна",
    role: "user",
    status: "active",
    joinDate: new Date(2024, 0, 15),
    orders: 5,
    totalSpent: 245.50,
    lastLogin: new Date(Date.now() - 2 * 3600000),
    verificationStatus: "verified",
  },
  {
    id: "2",
    name: "Марія Сидорова",
    email: "maria@example.com",
    phone: "+380 96 234 5678",
    location: "Львів, Україна",
    role: "premium",
    status: "active",
    joinDate: new Date(2023, 11, 20),
    orders: 12,
    totalSpent: 1250.75,
    lastLogin: new Date(Date.now() - 6 * 3600000),
    verificationStatus: "verified",
  },
  {
    id: "3",
    name: "Алексей Иванов",
    email: "alexey@example.com",
    phone: "+380 97 345 6789",
    location: "Одеса, Україна",
    role: "user",
    status: "active",
    joinDate: new Date(2024, 1, 5),
    orders: 3,
    totalSpent: 125.25,
    lastLogin: new Date(Date.now() - 24 * 3600000),
    verificationStatus: "pending",
  },
  {
    id: "4",
    name: "Анна Коваль",
    email: "anna@example.com",
    phone: "+380 98 456 7890",
    location: "Харків, Україна",
    role: "premium",
    status: "active",
    joinDate: new Date(2023, 10, 10),
    orders: 18,
    totalSpent: 1850.00,
    lastLogin: new Date(Date.now() - 1 * 3600000),
    verificationStatus: "verified",
  },
  {
    id: "5",
    name: "Петро Бондар",
    email: "petro@example.com",
    phone: "+380 99 567 8901",
    location: "Вінниця, Україна",
    role: "user",
    status: "inactive",
    joinDate: new Date(2024, 2, 1),
    orders: 1,
    totalSpent: 45.99,
    lastLogin: undefined,
    verificationStatus: "unverified",
  },
];

export default function UsersPage() {
  const [users, setUsers] = useState(mockUsers);
  const [filteredUsers, setFilteredUsers] = useState(mockUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterUsers(query, selectedRole, selectedStatus);
  };

  const handleRoleFilter = (role: string | null) => {
    setSelectedRole(role);
    filterUsers(searchQuery, role, selectedStatus);
  };

  const handleStatusFilter = (status: string | null) => {
    setSelectedStatus(status);
    filterUsers(searchQuery, selectedRole, status);
  };

  const filterUsers = (query: string, role: string | null, status: string | null) => {
    let filtered = users;

    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(lowerQuery) ||
          user.email.toLowerCase().includes(lowerQuery)
      );
    }

    if (role) {
      filtered = filtered.filter((user) => user.role === role);
    }

    if (status) {
      filtered = filtered.filter((user) => user.status === status);
    }

    setFilteredUsers(filtered);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400";
      case "premium":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
      default:
        return "bg-slate-100 dark:bg-slate-900/30 text-slate-700 dark:text-slate-400";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400";
      case "inactive":
        return "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400";
      case "banned":
        return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400";
      default:
        return "bg-slate-100 dark:bg-slate-900/30 text-slate-700 dark:text-slate-400";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "� Адміністратор";
      case "premium":
        return "✨ Преміум";
      default:
        return "👤 Користувач";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Активний";
      case "inactive":
        return "Неактивний";
      case "banned":
        return "Заблокований";
      default:
        return status;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <Users size={32} className="text-purple-600" />
            Користувачі
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Керуйте користувачами системи
          </p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2">
          <Plus size={18} />
          Новий користувач
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-gradient-to-r from-sky-50/50 to-cyan-50/50 dark:from-sky-950/30 dark:to-cyan-950/30 border border-sky-100 dark:border-sky-900/50 space-y-4">
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-slate-400 size-5" />
            <Input
              placeholder="Пошук по імені чи email..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Download size={18} />
            Експорт
          </Button>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={() => handleStatusFilter(null)}
            variant={selectedStatus === null ? "default" : "outline"}
            className={selectedStatus === null ? "bg-purple-600 hover:bg-purple-700 text-white" : ""}
          >
            Усі статуси ({users.length})
          </Button>
          {["active", "inactive", "banned"].map((status) => (
            <Button
              key={status}
              onClick={() => handleStatusFilter(status)}
              variant={selectedStatus === status ? "default" : "outline"}
              className={selectedStatus === status ? `${getStatusColor(status)}` : ""}
            >
              {getStatusLabel(status)} ({users.filter((u) => u.status === status).length})
            </Button>
          ))}
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={() => handleRoleFilter(null)}
            variant={selectedRole === null ? "default" : "outline"}
            className={selectedRole === null ? "bg-purple-600 hover:bg-purple-700 text-white" : ""}
          >
            Усі ролі ({users.length})
          </Button>
          {["user", "premium", "admin"].map((role) => (
            <Button
              key={role}
              onClick={() => handleRoleFilter(role)}
              variant={selectedRole === role ? "default" : "outline"}
              className={selectedRole === role ? `${getRoleColor(role)}` : ""}
            >
              {getRoleLabel(role)} ({users.filter((u) => u.role === role).length})
            </Button>
          ))}
        </div>
      </Card>

      {/* Users Accordion - All Versions */}
      <div className="space-y-3">
        {filteredUsers.map((user, idx) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className="overflow-hidden bg-gradient-to-r from-sky-50/50 to-cyan-50/50 dark:from-sky-950/30 dark:to-cyan-950/30 border border-sky-100 dark:border-sky-900/50">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value={user.id} className="border-0">
                  <AccordionTrigger className="px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <div className="flex items-center gap-3 text-left flex-1">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {user.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900 dark:text-white text-sm">{user.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">ID: {user.id}</p>
                      </div>
                      {/* Desktop: Show preview info */}
                      <div className="hidden sm:flex gap-4 ml-4 text-sm">
                        <span className="text-slate-600 dark:text-slate-400">{user.email}</span>
                        <Badge className={getRoleColor(user.role)} variant="secondary">
                          {getRoleLabel(user.role)}
                        </Badge>
                        <Badge className={getStatusColor(user.status)} variant="secondary">
                          {getStatusLabel(user.status)}
                        </Badge>
                        <span className="text-slate-600 dark:text-slate-400 whitespace-nowrap">{user.orders} замовлень</span>
                        <span className="text-green-600 dark:text-green-400 font-medium whitespace-nowrap">${user.totalSpent.toFixed(2)}</span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-4 space-y-2 border-t border-slate-200 dark:border-slate-700">
                    {/* Info Grid - 3 columns */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Role */}
                      <DetailSection 
                        label="Роль" 
                        customContent={
                          <Badge className={getRoleColor(user.role)}>
                            {getRoleLabel(user.role)}
                          </Badge>
                        }
                      />

                      {/* Status */}
                      <DetailSection 
                        label="Статус" 
                        customContent={
                          <Badge className={getStatusColor(user.status)}>
                            {getStatusLabel(user.status)}
                          </Badge>
                        }
                      />

                      {/* Join Date */}
                      <DetailSection 
                        label="Приєднався" 
                        value={user.joinDate.toLocaleDateString("uk-UA", { 
                          year: "numeric", 
                          month: "short", 
                          day: "numeric" 
                        })}
                      />

                      {/* Activity */}
                      <DetailSection 
                        label="Активність" 
                        value={
                          user.lastLogin ? (
                            (() => {
                              const now = new Date();
                              const diff = now.getTime() - user.lastLogin!.getTime();
                              const hours = Math.floor(diff / (1000 * 60 * 60));
                              const days = Math.floor(hours / 24);
                              
                              if (hours < 1) return "Щойно";
                              if (hours < 24) return `${hours}г тому`;
                              if (days === 1) return "Вчора";
                              if (days < 7) return `${days}д тому`;
                              
                              return user.lastLogin!.toLocaleDateString("uk-UA");
                            })()
                          ) : "Ніколи"
                        }
                        isInactive={!user.lastLogin}
                      />

                      {/* Phone */}
                      <DetailSection 
                        label="Телефон" 
                        value={user.phone}
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                      <Button
                        onClick={() => {
                          setSelectedUser(user);
                          setIsModalOpen(true);
                        }}
                        size="sm"
                        className="flex items-center justify-center gap-1"
                      >
                        <Eye size={16} />
                        Переглянути
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center justify-center gap-1"
                      >
                        <Edit2 size={16} />
                        Редагувати
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center gap-1"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
        >
          <Users size={48} className="text-slate-400 mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            Користувачів не знайдено
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-center">
            Спробуйте змінити фільтри або параметри пошуку
          </p>
        </motion.div>
      )}

      {/* User Profile Modal */}
      {selectedUser && (
        <UserProfileModal
          user={selectedUser}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedUser(null);
          }}
        />
      )}
    </motion.div>
  );
}
