"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";

export default function AcademyFooter() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ];

  const footerLinks = [
    { label: "Контакты", href: "#contact" },
    { label: "О проекте", href: "/academy" },
    { label: "Политика приватности", href: "#privacy" },
    { label: "Условия использования", href: "#terms" },
  ];

  return (
    <footer className="bg-gradient-to-b from-[#1E1A41] to-[#0f0d25] text-white relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#3BC864] rounded-full mix-blend-multiply filter blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00D9FF] rounded-full mix-blend-multiply filter blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main footer content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="py-20 grid md:grid-cols-4 gap-12"
        >
          {/* Brand section */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3BC864] to-[#00D9FF]">
                  Seafood Academy
                </span>
              </h2>
              <p className="text-gray-400 text-sm">by Dima Fomin</p>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Твой AI-наставник по морепродуктам и кулинарии. Учись от шефа, расти вместе с сообществом.
            </p>
          </motion.div>

          {/* Quick links */}
          <motion.div variants={itemVariants}>
            <h3 className="font-bold text-lg mb-6 text-white">Навигация</h3>
            <ul className="space-y-3">
              {[
                { label: "Главная", href: "/" },
                { label: "Академия", href: "/academy" },
                { label: "AI-наставник", href: "/create-chat" },
                { label: "Профиль", href: "/profile" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-[#3BC864] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div variants={itemVariants}>
            <h3 className="font-bold text-lg mb-6 text-white">Ресурсы</h3>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-[#3BC864] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact info */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="font-bold text-lg mb-6 text-white">Контакты</h3>
            <div className="space-y-3">
              <a
                href="mailto:contact@seafoodacademy.com"
                className="flex items-center gap-3 text-gray-400 hover:text-[#3BC864] transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span className="text-sm">contact@academy.com</span>
              </a>
              <a
                href="tel:+380123456789"
                className="flex items-center gap-3 text-gray-400 hover:text-[#3BC864] transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span className="text-sm">+380 12 345 67 89</span>
              </a>
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin className="w-5 h-5" />
                <span className="text-sm">Київ, Україна</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="h-px bg-gradient-to-r from-transparent via-[#3BC864]/30 to-transparent"
        />

        {/* Bottom section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="py-12 flex flex-col md:flex-row items-center justify-between gap-8"
        >
          {/* Copyright */}
          <motion.p variants={itemVariants} className="text-gray-400 text-sm text-center md:text-left">
            © 2025 Dima Fomin. Все права защищены. | Powered by Dima Fomin AI — цифровой наставник по морепродуктам.
          </motion.p>

          {/* Social links */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-6"
          >
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-10 h-10 rounded-full bg-[#3BC864]/10 hover:bg-[#3BC864] text-[#3BC864] hover:text-white transition-all flex items-center justify-center"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}
