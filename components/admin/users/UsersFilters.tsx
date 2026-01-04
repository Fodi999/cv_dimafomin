"use client";

import { Search, Filter, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UsersFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  roleFilter: string;
  onRoleChange: (role: string) => void;
  onExport: () => void;
}

export function UsersFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  roleFilter,
  onRoleChange,
  onExport,
}: UsersFiltersProps) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Пошук по імені чи email..."
            className="pl-9"
          />
        </div>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full lg:w-[180px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Усі статуси" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Усі статуси</SelectItem>
            <SelectItem value="active">Активний</SelectItem>
            <SelectItem value="inactive">Неактивний</SelectItem>
            <SelectItem value="blocked">Заблокований</SelectItem>
          </SelectContent>
        </Select>

        {/* Role Filter */}
        <Select value={roleFilter} onValueChange={onRoleChange}>
          <SelectTrigger className="w-full lg:w-[200px]">
            <SelectValue placeholder="Усі ролі" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Усі ролі</SelectItem>
            <SelectItem value="user">👤 Користувач</SelectItem>
            <SelectItem value="premium">✨ Преміум</SelectItem>
            <SelectItem value="admin">🛡️ Адміністратор</SelectItem>
          </SelectContent>
        </Select>

        {/* Export Button */}
        <Button onClick={onExport} variant="outline" className="lg:w-auto">
          <Download className="w-4 h-4 mr-2" />
          <span className="hidden lg:inline">Експорт</span>
        </Button>
      </div>
    </div>
  );
}
