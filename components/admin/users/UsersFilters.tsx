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
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t } = useLanguage();
  
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
            placeholder={t.admin.users.search}
            className="pl-9"
          />
        </div>

        {/* Status Filter - только реальные статусы из БД */}
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full lg:w-[180px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder={t.admin.users.status.all} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.admin.users.status.all}</SelectItem>
            <SelectItem value="active">🟢 {t.admin.users.status.active}</SelectItem>
            <SelectItem value="blocked">🔴 {t.admin.users.status.blocked}</SelectItem>
            <SelectItem value="pending">🟡 {t.admin.users.status.pending}</SelectItem>
          </SelectContent>
        </Select>

        {/* Role Filter - реальные роли из БД */}
        <Select value={roleFilter} onValueChange={onRoleChange}>
          <SelectTrigger className="w-full lg:w-[200px]">
            <SelectValue placeholder={t.admin.users.status.all} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.admin.users.status.all}</SelectItem>
            <SelectItem value="user">{t.admin.users.roles.user}</SelectItem>
            <SelectItem value="admin">{t.admin.users.roles.admin}</SelectItem>
            <SelectItem value="superadmin">⭐ Superadmin</SelectItem>
          </SelectContent>
        </Select>

        {/* Export Button */}
        <Button onClick={onExport} variant="outline" className="lg:w-auto">
          <Download className="w-4 h-4 mr-2" />
          <span className="hidden lg:inline">{t.admin.users.filter}</span>
        </Button>
      </div>
    </div>
  );
}
