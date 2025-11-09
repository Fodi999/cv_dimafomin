// TabsNavigation.tsx — навігація по вкладках (створене, збережене, курси)

import type { TabType } from "@/lib/profile-types";

interface TabsNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  translations: Record<string, string>;
}

export function TabsNavigation({ activeTab, onTabChange, translations }: TabsNavigationProps) {
  const tabs: { id: TabType; label: string }[] = [
    { id: 'posts', label: translations.created },
    { id: 'saved', label: translations.saved },
    { id: 'courses', label: translations.courses },
  ];

  return (
    <div className="border-b border-gray-200 bg-white rounded-t-3xl">
      <div className="flex justify-center gap-8 px-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`py-4 px-2 font-semibold transition-all duration-300 relative ${
              activeTab === tab.id ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
