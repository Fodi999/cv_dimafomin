"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useState, useEffect } from "react";
import { X, Heart, Share2, Bookmark } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";

const portfolioImages = [
  {
    id: 1,
    src: "https://i.postimg.cc/B63F53xY/DSCF4622.jpg",
    alt: "Signature Roll by Dima Fomin",
    title: "01. Signature Roll",
    height: "tall", // tall, medium, short
  },
  {
    id: 2,
    src: "https://i.postimg.cc/13DKhv5k/2020-08-31-10-30-38-203.jpg",
    alt: "Premium Selection by Dima Fomin",
    title: "02. Premium Selection",
    height: "medium",
  },
  {
    id: 3,
    src: "https://i.postimg.cc/ZKbct8yq/DSCF4592_Original.jpg",
    alt: "Fresh Nigiri by Dima Fomin",
    title: "03. Fresh Nigiri",
    height: "short",
  },
  {
    id: 4,
    src: "https://i.postimg.cc/bvJWyXDb/DSCF4649.jpg",
    alt: "Maki Selection by Dima Fomin",
    title: "04. Maki Selection",
    height: "tall",
  },
  {
    id: 5,
    src: "https://i.postimg.cc/50rx4NKK/IMG-2923.jpg",
    alt: "Artistic sushi by Dima Fomin",
    title: "05. Artistic Presentation",
    height: "medium",
  },
  {
    id: 6,
    src: "https://i.postimg.cc/fW695wWv/IMG-3193.jpg",
    alt: "Sushi set by Dima Fomin",
    title: "06. Chef's Special",
    height: "short",
  },
  {
    id: 7,
    src: "https://i.postimg.cc/pLB52zfr/IMG-3272.jpg",
    alt: "Gourmet sushi by Dima Fomin",
    title: "07. Gourmet Creation",
    height: "medium",
  },
  {
    id: 8,
    src: "https://i.postimg.cc/xdxkmQFz/IMG-3532.jpg",
    alt: "Sushi platter by Dima Fomin",
    title: "08. Deluxe Platter",
    height: "tall",
  },
  {
    id: 9,
    src: "https://i.postimg.cc/Gp2tdNhm/IMG-3877.jpg",
    alt: "Premium sushi by Dima Fomin",
    title: "09. Premium Set",
    height: "short",
  },
  {
    id: 10,
    src: "https://i.postimg.cc/nVQsX6KX/IMG-3814.jpg",
    alt: "Specialty rolls by Dima Fomin",
    title: "10. Specialty Rolls",
    height: "medium",
  },
  {
    id: 11,
    src: "https://i.postimg.cc/rs6wGwG0/IMG-4358.jpg",
    alt: "Sushi art by Dima Fomin",
    title: "11. Sushi Art",
    height: "tall",
  },
  {
    id: 12,
    src: "https://i.postimg.cc/dVWQHBRN/IMG-4718.jpg",
    alt: "Traditional sushi by Dima Fomin",
    title: "12. Traditional Style",
    height: "short",
  },
  {
    id: 13,
    src: "https://i.postimg.cc/K8QChcY9/DSCF4689.jpg",
    alt: "Modern sushi by Dima Fomin",
    title: "13. Modern Fusion",
    height: "medium",
  },
  {
    id: 14,
    src: "https://i.postimg.cc/PrsgmFc6/DSCF4695.jpg",
    alt: "Elegant sushi by Dima Fomin",
    title: "14. Elegant Presentation",
    height: "tall",
  },
  {
    id: 15,
    src: "https://i.postimg.cc/XqFtRwZJ/DSCF4697.jpg",
    alt: "Sushi masterpiece by Dima Fomin",
    title: "15. Masterpiece",
    height: "short",
  },
  {
    id: 16,
    src: "https://i.postimg.cc/Y0kwqGfR/IMG-5407.jpg",
    alt: "Creative sushi by Dima Fomin",
    title: "16. Creative Design",
    height: "medium",
  },
  {
    id: 17,
    src: "https://i.postimg.cc/JnVfPDFq/IMG-5504.jpg",
    alt: "Beautiful sushi by Dima Fomin",
    title: "17. Beautiful Plating",
    height: "tall",
  },
  {
    id: 18,
    src: "https://i.postimg.cc/rsqvL6Mn/IMG-5527.jpg",
    alt: "Exquisite sushi by Dima Fomin",
    title: "18. Exquisite Taste",
    height: "medium",
  },
];

const getHeightClass = (height: string) => {
  switch (height) {
    case "tall":
      return "row-span-2";
    case "short":
      return "row-span-1";
    default:
      return "row-span-1";
  }
};

export default function Portfolio() {
  const { t } = useLanguage();
  const { user } = useUser();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [selectedImage, setSelectedImage] = useState<typeof portfolioImages[0] | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  // Get profile URL - use /profile for all users
  const profileUrl = "/profile";

  return (
    <>
      <section id="portfolio" className="py-20 px-4 bg-white">
        <div className="max-w-[1640px] mx-auto">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            {/* Pinterest-style Masonry Grid */}
            <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
              {portfolioImages.map((image, index) => (
                <Link
                  key={image.id}
                  href={profileUrl}
                  className="block break-inside-avoid mb-4 group"
                  onMouseEnter={() => setHoveredId(image.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: index * 0.03 }}
                    className="cursor-pointer"
                  >
                    <div className="relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                      <img
                        src={image.src}
                        alt={image.alt}
                        loading="lazy"
                        className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      
                      {/* Pinterest Hover Overlay */}
                      <div 
                        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
                          hoveredId === image.id ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                        {/* Top Right Actions */}
                        <div className="absolute top-3 right-3 flex gap-2">
                          <button 
                            className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                          >
                            <Bookmark className="w-4 h-4 text-gray-800" />
                          </button>
                        </div>

                        {/* Bottom Info */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                          <h3 className="font-semibold text-sm mb-1">
                            {t.portfolio.items[index]}
                          </h3>
                          <p className="text-xs text-white/90 line-clamp-2">
                            {t.portfolio.descriptions[index]}
                          </p>
                          
                          {/* Bottom Actions */}
                          <div className="flex items-center gap-3 mt-3">
                            <button 
                              className="flex items-center gap-1 text-xs hover:scale-110 transition-transform"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                            >
                              <Heart className="w-4 h-4" />
                              <span>{((image.id * 7) % 40) + 10}</span>
                            </button>
                            <button 
                              className="flex items-center gap-1 text-xs hover:scale-110 transition-transform"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                            >
                              <Share2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-2"
            onClick={() => setSelectedImage(null)}
            aria-label={t.portfolio.closeButton}
          >
            <X className="w-8 h-8" />
          </button>
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
            />
            <div className="text-center mt-6 max-w-2xl">
              <p className="text-white text-xl font-semibold mb-2">
                {t.portfolio.items[selectedImage.id - 1]}
              </p>
              <p className="text-white/80 text-lg">
                {t.portfolio.descriptions[selectedImage.id - 1]}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
