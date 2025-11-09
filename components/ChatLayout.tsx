"use client";

import { useState, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface ChatLayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
  footer: ReactNode;
}

export function ChatLayout({ sidebar, children, footer }: ChatLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-[#FFF8F0]">
      {/* Sidebar */}
      <aside
        className={`
          bg-white border-r border-orange-100 
          transition-all duration-300 ease-in-out
          ${isSidebarOpen ? "w-64" : "w-0"}
          overflow-hidden
        `}
      >
        <div className="w-64 h-full flex flex-col">
          {/* Toggle Button inside Sidebar */}
          <div className="p-2 border-b border-orange-100">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="ml-auto"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto">
            {sidebar}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-orange-100 bg-white transition-all duration-300 ease-in-out">
          {footer}
        </footer>
      </div>

      {/* Mobile Toggle Button (visible when sidebar closed) */}
      {!isSidebarOpen && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-4 left-4 z-50 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </Button>
      )}
    </div>
  );
}
