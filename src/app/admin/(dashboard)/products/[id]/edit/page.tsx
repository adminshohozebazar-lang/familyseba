import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id: params.id } }),
    prisma.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-brand-neutral-dark">Edit Product</h1>
      <ProductForm
        categories={categories}
        initialProduct={{
          id: product.id,
          name: product.name,
          description: product.description,
          price: Number(product.price),
          compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
          stockQuantity: product.stockQuantity,
          categoryId: product.categoryId,
          imageUrls: product.imageUrls,
          youtubeVideoUrl: product.youtubeVideoUrl,
          dosageInstructions: product.dosageInstructions,
          disclaimerText: product.disclaimerText,
        }}
      />
    </div>
  );
}
