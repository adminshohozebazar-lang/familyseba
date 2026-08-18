"use client";

import { useState, FormEvent } from "react";
import { createCategory } from "../actions";
import { categorySchema } from "@/lib/validations/category";
import { slugify } from "@/lib/slugify";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { ImageUploader } from "@/components/admin/ImageUploader";

// Only a create form exists for categories right now (no edit/delete yet —
// see Step 3 scope), so this stays a standalone page rather than a shared
// <CategoryForm> component like products has.
export default function NewCategoryPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [iconUrl, setIconUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const result = categorySchema.safeParse({ name, description, iconUrl });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    setIsSubmitting(true);
    const actionResult = await createCategory(result.data);
    setIsSubmitting(false);

    if (actionResult && !actionResult.success) {
      setError(actionResult.error);
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="mb-6 text-2xl font-bold text-brand-neutral-dark">New Category</h1>

      <form onSubmit={handleSubmit} noValidate className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
          {name && <p className="mt-1 text-xs text-gray-400">Slug: {slugify(name) || "—"}</p>}
        </div>

        <div>
          <Label htmlFor="description">Description (optional)</Label>
          <Textarea
            id="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <Label>Icon (optional)</Label>
          {/* ImageUploader is built for multi-image products; reused here in
              single-image mode by always collapsing to just the most recent
              URL. Falls back to a letter avatar on the storefront if unset. */}
          <ImageUploader
            value={iconUrl ? [iconUrl] : []}
            onChange={(urls) => setIconUrl(urls[urls.length - 1] ?? "")}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Category"}
        </Button>
      </form>
    </div>
  );
}
