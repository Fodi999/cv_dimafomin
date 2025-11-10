"use client";

import { Heart, Instagram, Mail, Phone, BrainCircuit, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-neutral-900 via-neutral-950 to-black text-white py-16 px-4 relative overflow-hidden">
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.3) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Left: Branding */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center md:text-left"
          >
            <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <BrainCircuit className="w-7 h-7 text-sky-400" />
              </motion.div>
              <h3 className="text-2xl font-bold">{t.footer.title}</h3>
            </div>
            <p className="text-neutral-400 text-sm">
              {t.footer.subtitle}
            </p>
          </motion.div>

          {/* Center: Copyright & Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center gap-4"
          >
            <div className="text-center">
              <p className="text-sm text-neutral-400 mb-1">
                © {currentYear} {t.footer.title}
              </p>
              <motion.p
                className="text-xs text-neutral-500 flex items-center justify-center gap-1.5"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Built with{" "}
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Heart className="w-3 h-3 fill-red-500 text-red-500" />
                </motion.span>
                {" "}by Dima Fomin & AI
              </motion.p>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              <motion.a
                whileHover={{ scale: 1.15, y: -4 }}
                whileTap={{ scale: 0.95 }}
                href="https://instagram.com/fodifood"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full hover:shadow-lg hover:shadow-pink-500/50 transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 text-white" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.15, y: -4 }}
                whileTap={{ scale: 0.95 }}
                href="mailto:fodi85999@gmail.com"
                className="p-2 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full hover:shadow-lg hover:shadow-sky-500/50 transition-all"
                aria-label="Email"
              >
                <Mail className="w-5 h-5 text-white" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.15, y: -4 }}
                whileTap={{ scale: 0.95 }}
                href="https://wa.me/48576212418"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full hover:shadow-lg hover:shadow-green-500/50 transition-all"
                aria-label="WhatsApp"
              >
                <Phone className="w-5 h-5 text-white" />
              </motion.a>
            </div>
          </motion.div>

          {/* Right: AI Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center md:text-right"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-sky-500/20 to-cyan-500/20 border border-sky-500/50 backdrop-blur-sm"
            >
              <div className="flex items-center gap-2">
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-4 h-4 text-sky-400" />
                </motion.span>
                <span className="text-sm font-semibold text-sky-400">Powered by AI</span>
              </div>
            </motion.div>
            <p className="text-xs text-neutral-500 mt-3">
              NextJS 16 • React 19 • Framer Motion
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent mb-8"
        />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-xs text-neutral-600">
            {t.footer.keywords}
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
