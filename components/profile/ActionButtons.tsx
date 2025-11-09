// ActionButtons.tsx — кнопки дій (редагувати, до чату, на головну, вийти)

import { Edit2, MessageCircle, ChefHat, LogOut, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  translations: Record<string, string>;
  onEditProfile: () => void;
  onToChat: () => void;
  onToHome: () => void;
  onLogout: () => void;
}

export function ActionButtons({
  translations,
  onEditProfile,
  onToChat,
  onToHome,
  onLogout,
}: ActionButtonsProps) {
  return (
    <div className="flex gap-3 flex-wrap justify-center">
      <Button 
        onClick={onEditProfile}
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
      >
        <Edit2 className="w-4 h-4 mr-2" />
        {translations.editProfile}
      </Button>
      
      <Button 
        onClick={onToChat}
        variant="outline"
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        {translations.toChat}
      </Button>
      
      <Button 
        onClick={onToHome}
        variant="outline"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        {translations.toHome}
      </Button>
      
      <Button 
        onClick={onLogout}
        variant="outline"
        className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
      >
        <LogOut className="w-4 h-4 mr-2" />
        {translations.logout}
      </Button>
    </div>
  );
}
