"use client";

import { useState, useEffect } from "react";
import { User as UserType } from "./UsersTable";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UserEditModalProps {
  user: UserType | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (userId: string, updates: Partial<UserType>) => void;
}

export function UserEditModal({
  user,
  isOpen,
  onClose,
  onSave,
}: UserEditModalProps) {
  const [formData, setFormData] = useState({
    role: user?.role || "user",
    status: user?.status || "active",
    phone: user?.phone || "",
  });

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        role: user.role,
        status: user.status,
        phone: user.phone || "",
      });
      setHasChanges(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const changed =
      formData.role !== user.role ||
      formData.status !== user.status ||
      formData.phone !== (user.phone || "");
    setHasChanges(changed);
  }, [formData, user]);

  if (!user) return null;

  const handleSave = () => {
    const updates: Partial<UserType> = {};
    if (formData.role !== user.role)
      updates.role = formData.role as UserType["role"];
    if (formData.status !== user.status)
      updates.status = formData.status as UserType["status"];
    if (formData.phone !== (user.phone || ""))
      updates.phone = formData.phone || undefined;

    onSave(user.id, updates);
    onClose();
  };

  const handleCancel = () => {
    setFormData({
      role: user.role,
      status: user.status,
      phone: user.phone || "",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Редагувати користувача</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* User Info (Read-only) */}
          <div className="p-4 rounded-lg bg-muted/50 space-y-2">
            <div>
              <p className="text-xs text-muted-foreground">Ім'я</p>
              <p className="text-sm font-medium">{user.name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">ID</p>
              <p className="text-sm font-mono">{user.id}</p>
            </div>
          </div>

          {/* Role Select */}
          <div className="space-y-2">
            <Label htmlFor="role">Роль</Label>
            <Select
              value={formData.role}
              onValueChange={(value) =>
                setFormData({ ...formData, role: value as UserType["role"] })
              }
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Оберіть роль" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">👤 Користувач</SelectItem>
                <SelectItem value="premium">✨ Преміум</SelectItem>
                <SelectItem value="admin">🛡️ Адміністратор</SelectItem>
              </SelectContent>
            </Select>
            {formData.role === "admin" && formData.role !== user.role && (
              <p className="text-xs text-orange-600 dark:text-orange-400">
                ⚠️ Увага: Ви надаєте права адміністратора
              </p>
            )}
          </div>

          {/* Status Select */}
          <div className="space-y-2">
            <Label htmlFor="status">Статус</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  status: value as UserType["status"],
                })
              }
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Оберіть статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">✅ Активний</SelectItem>
                <SelectItem value="inactive">⏸️ Неактивний</SelectItem>
                <SelectItem value="blocked">🚫 Заблокований</SelectItem>
              </SelectContent>
            </Select>
            {formData.status === "blocked" &&
              formData.status !== user.status && (
                <p className="text-xs text-red-600 dark:text-red-400">
                  ⚠️ Увага: Користувач не зможе увійти в систему
                </p>
              )}
          </div>

          {/* Phone Input */}
          <div className="space-y-2">
            <Label htmlFor="phone">Телефон (необов'язково)</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="+380..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Скасувати
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges}>
            Зберегти зміни
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
