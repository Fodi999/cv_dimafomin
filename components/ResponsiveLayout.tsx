"use client";

import { useState, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResponsiveLayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
  footer: ReactNode;
  sidebarWidth?: number; // in pixels, default 240
  className?: string;
}

export function ResponsiveLayout({ 
  sidebar, 
  children, 
  footer,
  sidebarWidth = 240,
  className 
}: ResponsiveLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className={cn("flex min-h-screen bg-[#FFF8F0]", className)}>
      {/* Sidebar */}
      <aside
        style={{
          width: isSidebarOpen ? `${sidebarWidth}px` : "0px",
        }}
        className="bg-white border-r border-orange-100 transition-all duration-300 ease-in-out overflow-hidden"
      >
        <div style={{ width: `${sidebarWidth}px` }} className="h-full flex flex-col">
          {/* Toggle Button */}
          <div className="p-2 border-b border-orange-100 flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              title={isSidebarOpen ? "Згорнути" : "Розгорнути"}
            >
              {isSidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-2">
            {sidebar}
          </div>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Toggle Button (when sidebar closed) */}
        {!isSidebarOpen && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsSidebarOpen(true)}
            className="fixed top-4 left-4 z-50 shadow-lg"
          >
            <Menu className="w-5 h-5" />
          </Button>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

        {/* Footer - adapts width automatically */}
        <footer className="border-t border-orange-100 bg-white shadow-lg transition-all duration-300 ease-in-out">
          {footer}
        </footer>
      </div>
    </div>
  );
}

// Sidebar Item Component for convenience
interface SidebarItemProps {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
}

export function SidebarItem({ icon, label, onClick, disabled, active }: SidebarItemProps) {
  return (
    <Button
      variant={active ? "secondary" : "ghost"}
      className={cn(
        "w-full justify-start gap-3 text-left",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="shrink-0">{icon}</span>
      <span className="truncate">{label}</span>
    </Button>
  );
}
