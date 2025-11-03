"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { getPersonSchema, getBreadcrumbSchema } from "@/lib/seo";
import { useEffect, useState } from "react";

export default function StructuredData() {
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const personSchema = getPersonSchema(language);
  const breadcrumbSchema = getBreadcrumbSchema(language);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
