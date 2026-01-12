import { Metadata } from "next";
import { ProductsTab } from "@/components/admin/catalog/ProductsTab";

export const metadata: Metadata = {
  title: "Products Catalog | Admin",
  description: "Manage ingredients catalog",
};

export default function ProductsCatalogPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Products Catalog</h1>
        <p className="text-muted-foreground mt-2">
          Manage ingredients and their translations
        </p>
      </div>
      
      <ProductsTab />
    </div>
  );
}
