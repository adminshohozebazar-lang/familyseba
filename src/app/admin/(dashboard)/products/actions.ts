"use server";

import { randomUUID } from "crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/slugify";
import { productSchema, type ProductInput } from "@/lib/validations/product";

type ActionResult = { success: false; error: string };

function toProductData(parsed: ProductInput) {
  return {
    name: parsed.name,
    description: parsed.description,
    price: parsed.price,
    compareAtPrice: parsed.compareAtPrice || null,
    stockQuantity: parsed.stockQuantity,
    categoryId: parsed.categoryId,
    imageUrls: parsed.imageUrls,
    youtubeVideoUrl: parsed.youtubeVideoUrl || null,
    dosageInstructions: parsed.dosageInstructions || null,
    disclaimerText: parsed.disclaimerText || null,
  };
}

export async function createProduct(input: ProductInput): Promise<ActionResult | void> {
  const parsed = productSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  // slugify() keeps letters/numbers from any script, so this only ever
  // triggers for names with zero usable characters in any language (e.g.
  // emoji-only) — a short random slug beats failing validation outright.
  const slug = slugify(parsed.data.name) || `product-${randomUUID().slice(0, 8)}`;

  const [existingSlug, category] = await Promise.all([
    prisma.product.findUnique({ where: { slug } }),
    prisma.category.findUnique({ where: { id: parsed.data.categoryId } }),
  ]);

  if (existingSlug) {
    return { success: false, error: "A product with this name (or a very similar one) already exists" };
  }
  if (!category) {
    return { success: false, error: "Selected category does not exist" };
  }

  await prisma.product.create({
    data: { ...toProductData(parsed.data), slug },
  });

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProduct(id: string, input: ProductInput): Promise<ActionResult | void> {
  const parsed = productSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const slug = slugify(parsed.data.name) || `product-${randomUUID().slice(0, 8)}`;

  const [slugOwner, category] = await Promise.all([
    prisma.product.findUnique({ where: { slug } }),
    prisma.category.findUnique({ where: { id: parsed.data.categoryId } }),
  ]);

  if (slugOwner && slugOwner.id !== id) {
    return { success: false, error: "A product with this name (or a very similar one) already exists" };
  }
  if (!category) {
    return { success: false, error: "Selected category does not exist" };
  }

  await prisma.product.update({
    where: { id },
    data: { ...toProductData(parsed.data), slug },
  });

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

// Bound with the target id + next value and used directly as a <form action>
// from the (server-rendered) product list, so toggling doesn't need any
// client-side JS.
export async function toggleProductActive(id: string, nextIsActive: boolean) {
  await prisma.product.update({ where: { id }, data: { isActive: nextIsActive } });
  revalidatePath("/admin/products");
}
