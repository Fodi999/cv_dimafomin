"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, MapPin, Instagram } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AcademyFooter() {
  const { t } = useLanguage();
  
  const socialLinks = [
    { icon: Instagram, href: "https://instagram.com/fodifood", label: "Instagram" },
  ];

  const footerLinks = [
    { label: t.academy.footer.contact.title, href: "#contact" },
    { label: t.academy.footer.privacy, href: "#privacy" },
    { label: t.academy.footer.terms, href: "#terms" },
  ];

  return (
    <footer className="bg-gray-950 text-white py-12 px-4 border-t border-sky-500">
      <div className="max-w-6xl mx-auto">
        {/* Main Grid */}
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-4 gap-8 mb-12"
        >
          {/* Brand */}
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="space-y-2">
            <h3 className="text-lg font-bold text-sky-400">
              {t.academy.footer.title}
            </h3>
            <p className="text-sm text-sky-300/80">
              {t.academy.footer.byAuthor}
            </p>
            <p className="text-sm text-neutral-400 leading-relaxed">
              {t.academy.footer.description}
            </p>
          </motion.div>

          {/* Navigation */}
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="space-y-3">
            <h4 className="font-semibold text-sky-400 text-sm uppercase tracking-wide">
              {t.academy.footer.navigation.title}
            </h4>
            <ul className="space-y-2">
              {[
                { label: t.academy.footer.navigation.home, href: "/" },
                { label: t.academy.footer.navigation.academy, href: "/academy" },
                { label: t.academy.footer.navigation.chat, href: "/assistant" },
                { label: t.academy.footer.navigation.profile, href: "/profile" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-neutral-400 hover:text-cyan-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="space-y-3">
            <h4 className="font-semibold text-sky-400 text-sm uppercase tracking-wide">
              {t.academy.footer.resources.title}
            </h4>
            <ul className="space-y-2">
              {[
                { label: t.academy.footer.resources.documentation, href: "#docs" },
                { label: t.academy.footer.resources.guides, href: "#guides" },
                { label: t.academy.footer.resources.faq, href: "#faq" },
                { label: t.academy.footer.resources.support, href: "#support" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-neutral-400 hover:text-cyan-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="space-y-3">
            <h4 className="font-semibold text-sky-400 text-sm uppercase tracking-wide">
              {t.academy.footer.contact.title}
            </h4>
            <div className="space-y-2">
              <a
                href="mailto:fodi85999@gmail.com"
                className="flex items-center gap-2 text-sm text-neutral-400 hover:text-cyan-400 transition-colors"
              >
                <Mail className="w-4 h-4" />
                fodi85999@gmail.com
              </a>
              <div className="flex items-center gap-2 text-sm text-neutral-400">
                <MapPin className="w-4 h-4" />
                {t.academy.footer.contact.location}
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
          className="h-px bg-sky-500/40 mb-8"
        />

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p className="text-sm text-neutral-500 text-center md:text-left">
            {t.academy.footer.copyright}
          </p>
          <div className="flex gap-4">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="p-2 text-sky-400 hover:text-cyan-300 hover:bg-sky-400/10 rounded-lg transition-all"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
