"use server";

import { randomUUID } from "crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/slugify";
import { categorySchema, type CategoryInput } from "@/lib/validations/category";

type ActionResult = { success: false; error: string };

// Re-validates with the same zod schema the client already checked —
// the client check is only a UX shortcut, this is the real enforcement.
export async function createCategory(input: CategoryInput): Promise<ActionResult | void> {
  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  // slugify() keeps letters/numbers from any script, so this only ever
  // triggers for names with zero usable characters in any language (e.g.
  // emoji-only) — a short random slug beats failing validation outright.
  const slug = slugify(parsed.data.name) || `category-${randomUUID().slice(0, 8)}`;

  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) {
    return { success: false, error: "A category with this name (or a very similar one) already exists" };
  }

  await prisma.category.create({
    data: {
      name: parsed.data.name,
      slug,
      description: parsed.data.description || null,
    },
  });

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}
