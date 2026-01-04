"use client";

import { Award } from "lucide-react";
import CertificateCard from "@/components/academy/CertificateCard";

const mockCertificates = [
  {
    title: "Майстер суші та сашимі",
    date: "15.10.2024",
    instructor: "Dima Fomin",
    certificateId: "CERT-2024-001",
  },
  {
    title: "Професійна японська кухня",
    date: "20.09.2024",
    instructor: "Maria Tanaka",
    certificateId: "CERT-2024-002",
  },
  {
    title: "HACCP та безпека харчування",
    date: "05.08.2024",
    instructor: "Jan Kowalski",
    certificateId: "CERT-2024-003",
  },
];

export default function CertificatesPage() {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-[#1E1A41] mb-4 flex items-center gap-3">
          <Award className="w-12 h-12 text-amber-500" />
          Мої сертифікати
        </h1>
        <p className="text-lg text-[#1E1A41]/70">
          Підтвердження ваших досягнень
        </p>
      </div>

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCertificates.map((cert, index) => (
          <CertificateCard key={index} {...cert} />
        ))}
      </div>

      {/* Empty State (if no certificates) */}
      {mockCertificates.length === 0 && (
        <div className="text-center py-20">
          <Award className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-[#1E1A41] mb-2">
            Поки немає сертифікатів
          </h3>
          <p className="text-[#1E1A41]/60">
            Завершіть курс, щоб отримати свій перший сертифікат!
          </p>
        </div>
      )}
    </div>
  );
}
