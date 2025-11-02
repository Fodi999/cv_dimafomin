"use client";

import { Heart, Instagram, Mail, Phone } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#240F24] text-[#FEF9F5] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold mb-2 text-[#FEF9F5]">Dmytro Fomin</h3>
            <p className="text-[#FEF9F5]/80">
              Professional Chef 🇵🇱
            </p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-[#FEF9F5]/70">
              © {currentYear} Dmytro Fomin. Wszelkie prawa zastrzeżone.
            </p>
            <p className="text-xs text-[#FEF9F5]/60 flex items-center gap-1">
              Stworzone z <Heart className="w-3 h-3 fill-current text-[#3BC864]" /> dla pasji kulinarnej
            </p>
          </div>

          <div className="flex gap-4">
            <a
              href="https://instagram.com/fodifood"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-[#FEF9F5]/10 hover:bg-[#3BC864] rounded-full transition-colors duration-300"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="mailto:fodi85999@gmail.com"
              className="p-2 bg-[#FEF9F5]/10 hover:bg-[#3BC864] rounded-full transition-colors duration-300"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
            <a
              href="https://wa.me/48576212418"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-[#FEF9F5]/10 hover:bg-[#3BC864] rounded-full transition-colors duration-300"
              aria-label="WhatsApp"
            >
              <Phone className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[#FEF9F5]/20 text-center">
          <p className="text-xs text-[#FEF9F5]/60">
            Sushi Chef Polska | Sushi Master Warszawa | Praca Sushi Chef |
            Professional Japanese Chef Poland
          </p>
        </div>
      </div>
    </footer>
  );
}
