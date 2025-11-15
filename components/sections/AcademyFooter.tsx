"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";

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
    { label: "Политика приватности", href: "#privacy" },
    { label: "Условия использования", href: "#terms" },
  ];

  return (
    <footer className="bg-gradient-to-b from-[#1E1A41] to-[#0f0d25] text-white relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-400 rounded-full mix-blend-multiply filter blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main footer content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="py-24 grid md:grid-cols-4 gap-12"
        >
          {/* Brand section */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-cyan-300">
                  Modern Food Academy
                </span>
              </h2>
              <p className="text-gray-400 text-sm">by Dima Fomin</p>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Твой AI-наставник по современной кухне и Food Pairing. Учись у шефа, развивай вкус, открывай рецепты.
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
                    className="text-gray-400 hover:text-sky-400 transition-colors"
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
                    className="text-gray-400 hover:text-sky-400 transition-colors"
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
                href="mailto:fodi85999@gmail.com"
                className="flex items-center gap-3 text-gray-400 hover:text-sky-400 transition-colors"
              >
                <Mail className="w-6 h-6" />
                <span className="text-sm">fodi85999@gmail.com</span>
              </a>
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin className="w-6 h-6" />
                <span className="text-sm">Gdańsk, Polska</span>
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
          className="h-px bg-gradient-to-r from-transparent via-sky-400/30 to-transparent"
        />

        {/* Bottom section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="py-8 flex flex-col md:flex-row items-center justify-between gap-8 border-t border-gray-700/50"
        >
          {/* Copyright */}
          <motion.p variants={itemVariants} className="text-gray-400 text-sm text-center md:text-left">
            © 2025 Modern Food Academy. Все права защищены. | by Dima Fomin
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
                className="w-12 h-12 rounded-full bg-sky-400/10 hover:bg-sky-400 text-sky-400 hover:text-white transition-all flex items-center justify-center"
              >
                <Icon className="w-6 h-6" />
              </a>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}
