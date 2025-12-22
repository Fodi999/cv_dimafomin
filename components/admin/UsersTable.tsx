"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Shield, Crown, GraduationCap, User as UserIcon, Users } from "lucide-react";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "instructor" | "student";
  level: number;
  createdAt: string;
}

interface UsersTableProps {
  users: AdminUser[];
  onUpdateRole?: (userId: string, newRole: string) => void;
  onDeleteUser?: (userId: string) => void;
}

export function UsersTable({
  users,
  onUpdateRole,
  onDeleteUser,
}: UsersTableProps) {
  const roleConfig: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string; icon: any }> = {
    admin: { variant: "destructive", label: "Админ", icon: Crown },
    instructor: { variant: "default", label: "Инструктор", icon: GraduationCap },
    student: { variant: "secondary", label: "Студент", icon: UserIcon },
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          <CardTitle>Пользователи</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Имя</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Роль</TableHead>
                <TableHead>Уровень</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const config = roleConfig[user.role] || roleConfig.student;

                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-white text-sm font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
                        <config.icon className="w-3 h-3" />
                        {config.label}
                      </Badge>
                    </TableCell>
                    <TableCell>Уровень {user.level}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onUpdateRole?.(user.id, user.role)}
                          title="Изменить роль"
                        >
                          <Shield className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onDeleteUser?.(user.id)}
                          title="Удалить пользователя"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        
        {/* Empty State */}
        {users.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Пользователи не найдены</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
