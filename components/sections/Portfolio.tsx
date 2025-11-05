"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const portfolioImages = [
  {
    id: 1,
    src: "https://i.postimg.cc/B63F53xY/DSCF4622.jpg",
    alt: "Signature Roll by Dima Fomin",
    title: "01. Signature Roll",
  },
  {
    id: 2,
    src: "https://i.postimg.cc/13DKhv5k/2020-08-31-10-30-38-203.jpg",
    alt: "Premium Selection by Dima Fomin",
    title: "02. Premium Selection",
  },
  {
    id: 3,
    src: "https://i.postimg.cc/ZKbct8yq/DSCF4592_Original.jpg",
    alt: "Fresh Nigiri by Dima Fomin",
    title: "03. Fresh Nigiri",
  },
  {
    id: 4,
    src: "https://i.postimg.cc/bvJWyXDb/DSCF4649.jpg",
    alt: "Maki Selection by Dima Fomin",
    title: "04. Maki Selection",
  },
  {
    id: 5,
    src: "https://i.postimg.cc/50rx4NKK/IMG-2923.jpg",
    alt: "Artistic sushi by Dima Fomin",
    title: "05. Artistic Presentation",
  },
  {
    id: 6,
    src: "https://i.postimg.cc/fW695wWv/IMG-3193.jpg",
    alt: "Sushi set by Dima Fomin",
    title: "06. Chef's Special",
  },
  {
    id: 7,
    src: "https://i.postimg.cc/pLB52zfr/IMG-3272.jpg",
    alt: "Gourmet sushi by Dima Fomin",
    title: "07. Gourmet Creation",
  },
  {
    id: 8,
    src: "https://i.postimg.cc/xdxkmQFz/IMG-3532.jpg",
    alt: "Sushi platter by Dima Fomin",
    title: "08. Deluxe Platter",
  },
  {
    id: 9,
    src: "https://i.postimg.cc/Gp2tdNhm/IMG-3877.jpg",
    alt: "Premium sushi by Dima Fomin",
    title: "09. Premium Set",
  },
  {
    id: 10,
    src: "https://i.postimg.cc/nVQsX6KX/IMG-3814.jpg",
    alt: "Specialty rolls by Dima Fomin",
    title: "10. Specialty Rolls",
  },
  {
    id: 11,
    src: "https://i.postimg.cc/rs6wGwG0/IMG-4358.jpg",
    alt: "Sushi art by Dima Fomin",
    title: "11. Sushi Art",
  },
  {
    id: 12,
    src: "https://i.postimg.cc/dVWQHBRN/IMG-4718.jpg",
    alt: "Traditional sushi by Dima Fomin",
    title: "12. Traditional Style",
  },
  {
    id: 13,
    src: "https://i.postimg.cc/K8QChcY9/DSCF4689.jpg",
    alt: "Modern sushi by Dima Fomin",
    title: "13. Modern Fusion",
  },
  {
    id: 14,
    src: "https://i.postimg.cc/PrsgmFc6/DSCF4695.jpg",
    alt: "Elegant sushi by Dima Fomin",
    title: "14. Elegant Presentation",
  },
  {
    id: 15,
    src: "https://i.postimg.cc/XqFtRwZJ/DSCF4697.jpg",
    alt: "Sushi masterpiece by Dima Fomin",
    title: "15. Masterpiece",
  },
  {
    id: 16,
    src: "https://i.postimg.cc/Y0kwqGfR/IMG-5407.jpg",
    alt: "Creative sushi by Dima Fomin",
    title: "16. Creative Design",
  },
  {
    id: 17,
    src: "https://i.postimg.cc/JnVfPDFq/IMG-5504.jpg",
    alt: "Beautiful sushi by Dima Fomin",
    title: "17. Beautiful Plating",
  },
  {
    id: 18,
    src: "https://i.postimg.cc/rsqvL6Mn/IMG-5527.jpg",
    alt: "Exquisite sushi by Dima Fomin",
    title: "18. Exquisite Taste",
  },
];

export default function Portfolio() {
  const { t } = useLanguage();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [selectedImage, setSelectedImage] = useState<typeof portfolioImages[0] | null>(null);

  return (
    <>
      <section id="portfolio" className="py-24 px-4 bg-[#1E1A41]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-[#FEF9F5] mb-4">
                {t.portfolio.title}
              </h2>
              <div className="w-20 h-1 bg-[#3BC864] mx-auto rounded-full mb-6" />
              <p className="text-lg text-[#FEF9F5]/80 max-w-2xl mx-auto">
                {t.portfolio.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
              {portfolioImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="cursor-pointer h-full"
                  onClick={() => setSelectedImage(image)}
                >
                  <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-[#FEF9F5] border-[#240F24]/10 h-full flex flex-col">
                    <div className="relative aspect-square overflow-hidden group">
                      <img
                        src={image.src}
                        alt={image.alt}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-3 md:p-4 flex-1 flex flex-col">
                      <h4 className="text-[#1E1A41] font-semibold text-xs md:text-sm mb-1">
                        {t.portfolio.items[index]}
                      </h4>
                      <p className="text-[#1E1A41]/70 text-xs md:text-sm leading-relaxed">
                        {t.portfolio.descriptions[index]}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-2 md:p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-2 right-2 md:top-4 md:right-4 text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-2"
            onClick={() => setSelectedImage(null)}
            aria-label={t.portfolio.closeButton}
          >
            <X className="w-6 h-6 md:w-8 md:h-8" />
          </button>
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
            />
            <div className="text-center mt-4 md:mt-6 max-w-2xl px-4">
              <p className="text-white text-base md:text-xl font-semibold mb-2">
                {t.portfolio.items[selectedImage.id - 1]}
              </p>
              <p className="text-white/80 text-sm md:text-lg">
                {t.portfolio.descriptions[selectedImage.id - 1]}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
