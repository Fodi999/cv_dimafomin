"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Instagram,
  Mail,
  MessageCircle,
  Send,
} from "lucide-react";

export default function Contact() {
  const { t } = useLanguage();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    requestType: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setFormData({ name: "", email: "", requestType: "", message: "" });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitStatus("idle"), 5000);
    }, 1500);
  };

  const socialLinks = [
    {
      icon: Instagram,
      label: t.contact.instagram,
      href: "https://instagram.com/fodifood",
      username: "@fodifood",
      color: "from-purple-600 to-pink-600",
    },
    {
      icon: Mail,
      label: t.contact.email,
      href: "mailto:fodi85999@gmail.com",
      username: "fodi85999@gmail.com",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: MessageCircle,
      label: t.contact.whatsapp,
      href: "https://wa.me/48576212418",
      username: t.contact.whatsappAction,
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Send,
      label: t.contact.telegram,
      href: "https://t.me/fodi999",
      username: t.contact.telegramAction,
      color: "from-blue-400 to-sky-500",
    },
  ];

  return (
    <section id="contact" className="py-24 px-4 bg-[#2B6A79]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#FEF9F5] mb-4">
              {t.contact.title}
            </h2>
            <div className="w-20 h-1 bg-[#3BC864] mx-auto rounded-full mb-6" />
            <p className="text-lg text-[#FEF9F5]/90 max-w-2xl mx-auto">
              {t.contact.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="p-8 shadow-xl bg-[#FEF9F5] border-none">
                <h3 className="text-2xl font-bold text-[#1E1A41] mb-6">
                  {t.contact.formTitle}
                </h3>

                <p className="text-sm text-[#3BC864] font-medium mb-6 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {t.contact.responseTime}
                </p>

                {submitStatus === "success" && (
                  <div className="mb-6 p-4 bg-[#3BC864]/10 border border-[#3BC864] rounded-lg">
                    <p className="text-[#1E1A41] text-sm">
                      {t.contact.successMessage}
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="text-[#1E1A41] mb-2 block">
                      {t.contact.nameLabel}
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder={t.contact.namePlaceholder}
                      required
                      className="w-full bg-white border-[#2B6A79]/20 focus:border-[#3BC864]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-[#1E1A41] mb-2 block">
                      {t.contact.emailLabel}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder={t.contact.emailPlaceholder}
                      required
                      className="w-full bg-white border-[#2B6A79]/20 focus:border-[#3BC864]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="requestType" className="text-[#1E1A41] mb-2 block">
                      {t.contact.requestTypeLabel}
                    </Label>
                    <select
                      id="requestType"
                      value={formData.requestType}
                      onChange={(e) =>
                        setFormData({ ...formData, requestType: e.target.value })
                      }
                      required
                      className="w-full px-3 py-2 bg-white border border-[#2B6A79]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3BC864] focus:border-[#3BC864] transition-colors"
                    >
                      <option value="" disabled>
                        {t.contact.requestTypePlaceholder}
                      </option>
                      <option value="learning">{t.contact.requestTypes.learning}</option>
                      <option value="partnership">{t.contact.requestTypes.partnership}</option>
                      <option value="other">{t.contact.requestTypes.other}</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-[#1E1A41] mb-2 block">
                      {t.contact.messageLabel}
                    </Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder={t.contact.messagePlaceholder}
                      required
                      rows={5}
                      className="w-full bg-white border-[#2B6A79]/20 focus:border-[#3BC864]"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-[#3BC864] hover:bg-[#C5E98A] text-[#1E1A41] font-semibold transition-colors"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      t.contact.sending
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        {t.contact.sendButton}
                      </>
                    )}
                  </Button>
                </form>
              </Card>
            </motion.div>

            {/* Contact Info & Social */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-2xl font-bold text-[#FEF9F5] mb-6">
                  {t.contact.connectTitle}
                </h3>
                <p className="text-[#FEF9F5]/90 mb-8">
                  {t.contact.connectSubtitle}
                </p>
              </div>

              <div className="space-y-4">
                {socialLinks.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <motion.a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, x: 20 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="block"
                    >
                      <Card className={`p-5 hover:shadow-2xl transition-all duration-300 bg-gradient-to-r ${link.color} border-none overflow-hidden relative group`}>
                        <div className="flex items-center gap-4 relative z-10">
                          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl group-hover:bg-white/30 transition-colors">
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-white text-lg">
                              {link.label}
                            </p>
                            <p className="text-sm text-white/90 font-medium">
                              {link.username}
                            </p>
                          </div>
                          <div className="text-white/70 group-hover:text-white transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Card>
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
