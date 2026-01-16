import { Metadata } from "next";
import { ProductsTab } from "@/components/admin/catalog/ProductsTab";

export const metadata: Metadata = {
  title: "Products Catalog | Admin",
  description: "Manage ingredients catalog",
};

export default function ProductsCatalogPage() {
  return (
    <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 pb-safe">
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">Products Catalog</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
          Manage ingredients and their translations
        </p>
      </div>
      
      <ProductsTab />
    </div>
  );
}
