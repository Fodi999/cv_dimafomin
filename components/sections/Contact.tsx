"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Instagram,
  Linkedin,
  Mail,
  Phone,
  Send,
} from "lucide-react";

export default function Contact() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
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
      setFormData({ name: "", email: "", phone: "", message: "" });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitStatus("idle"), 5000);
    }, 1500);
  };

  const socialLinks = [
    {
      icon: Instagram,
      label: "Instagram",
      href: "https://instagram.com/fodifood",
      username: "@fodifood",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: "https://linkedin.com/in/dmytrofomin",
      username: "Dmytro Fomin",
    },
    {
      icon: Mail,
      label: "Email",
      href: "mailto:fodi85999@gmail.com",
      username: "fodi85999@gmail.com",
    },
    {
      icon: Phone,
      label: "WhatsApp / Telefon",
      href: "https://wa.me/48576212418",
      username: "+48 576 212 418",
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
              Kontakt
            </h2>
            <div className="w-20 h-1 bg-[#3BC864] mx-auto rounded-full mb-6" />
            <p className="text-lg text-[#FEF9F5]/90 max-w-2xl mx-auto">
              Szukasz doświadczonego kucharza? Skontaktuj się ze mną już
              dziś!
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
                  Wyślij wiadomość
                </h3>

                {submitStatus === "success" && (
                  <div className="mb-6 p-4 bg-[#3BC864]/10 border border-[#3BC864] rounded-lg">
                    <p className="text-[#1E1A41] text-sm">
                      ✓ Dziękuję za wiadomość! Skontaktuję się z Tobą wkrótce.
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="text-[#1E1A41] mb-2 block">
                      Twoje imię i nazwisko *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="np. Anna Nowak"
                      required
                      className="w-full bg-white border-[#2B6A79]/20 focus:border-[#3BC864]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-[#1E1A41] mb-2 block">
                      Twój email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="twoj.email@restauracja.pl"
                      required
                      className="w-full bg-white border-[#2B6A79]/20 focus:border-[#3BC864]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-[#1E1A41] mb-2 block">
                      Numer telefonu (opcjonalnie)
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="+48 500 000 000"
                      className="w-full bg-white border-[#2B6A79]/20 focus:border-[#3BC864]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-[#1E1A41] mb-2 block">
                      Twoja wiadomość *
                    </Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="Cześć Dmytro! Szukamy doświadczonego sushi chefa do naszej restauracji w..."
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
                      "Wysyłanie..."
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Wyślij wiadomość
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
                  Połącz się ze mną
                </h3>
                <p className="text-[#FEF9F5]/90 mb-8">
                  Jestem otwarty na nowe możliwości współpracy w Polsce.
                  Skontaktuj się ze mną przez preferowany kanał komunikacji.
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
                      whileHover={{ scale: 1.02 }}
                      className="block"
                    >
                      <Card className="p-4 hover:shadow-lg transition-shadow duration-300 bg-[#FEF9F5] border-none">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-[#3BC864]/10 rounded-lg">
                            <Icon className="w-6 h-6 text-[#3BC864]" />
                          </div>
                          <div>
                            <p className="font-semibold text-[#1E1A41]">
                              {link.label}
                            </p>
                            <p className="text-sm text-[#1E1A41]/70">
                              {link.username}
                            </p>
                          </div>
                        </div>
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
