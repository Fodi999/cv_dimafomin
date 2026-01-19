import { Metadata } from "next";
import { ProductsTab } from "@/components/admin/catalog/ProductsTab";

export const metadata: Metadata = {
  title: "Products Catalog | Admin",
  description: "Manage ingredients catalog",
};

export default function ProductsCatalogPage() {
  return (
    <div className="w-full">
      <ProductsTab />
    </div>
  );
}
