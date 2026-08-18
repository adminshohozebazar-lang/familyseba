"use client";

import { useState, FormEvent } from "react";
import { createProduct, updateProduct } from "@/app/admin/(dashboard)/products/actions";
import { productSchema } from "@/lib/validations/product";
import { slugify } from "@/lib/slugify";
import { DEFAULT_HERBAL_DISCLAIMER } from "@/config/legal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { ImageUploader } from "@/components/admin/ImageUploader";

interface CategoryOption {
  id: string;
  name: string;
}

interface InitialProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  stockQuantity: number;
  categoryId: string;
  imageUrls: string[];
  youtubeVideoUrl: string | null;
  dosageInstructions: string | null;
  disclaimerText: string | null;
}

interface ProductFormProps {
  categories: CategoryOption[];
  initialProduct?: InitialProduct;
}

// Shared by both /admin/products/new and /admin/products/[id]/edit — the
// only difference between create and edit is which server action gets
// called and whether fields start pre-filled.
export function ProductForm({ categories, initialProduct }: ProductFormProps) {
  const isEditing = Boolean(initialProduct);

  const [name, setName] = useState(initialProduct?.name ?? "");
  const [description, setDescription] = useState(initialProduct?.description ?? "");
  const [price, setPrice] = useState(initialProduct ? String(initialProduct.price) : "");
  const [compareAtPrice, setCompareAtPrice] = useState(
    initialProduct?.compareAtPrice != null ? String(initialProduct.compareAtPrice) : ""
  );
  const [stockQuantity, setStockQuantity] = useState(
    initialProduct ? String(initialProduct.stockQuantity) : ""
  );
  const [categoryId, setCategoryId] = useState(initialProduct?.categoryId ?? categories[0]?.id ?? "");
  const [imageUrls, setImageUrls] = useState<string[]>(initialProduct?.imageUrls ?? []);
  const [youtubeVideoUrl, setYoutubeVideoUrl] = useState(initialProduct?.youtubeVideoUrl ?? "");
  const [dosageInstructions, setDosageInstructions] = useState(initialProduct?.dosageInstructions ?? "");
  const [disclaimerText, setDisclaimerText] = useState(initialProduct?.disclaimerText ?? "");

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const candidate = {
      name,
      description,
      price,
      compareAtPrice,
      stockQuantity,
      categoryId,
      imageUrls,
      youtubeVideoUrl,
      dosageInstructions,
      disclaimerText,
    };

    const result = productSchema.safeParse(candidate);
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    setIsSubmitting(true);
    const actionResult = isEditing
      ? await updateProduct(initialProduct!.id, result.data)
      : await createProduct(result.data);
    setIsSubmitting(false);

    if (actionResult && !actionResult.success) {
      setError(actionResult.error);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6 rounded-lg border border-gray-200 bg-white p-6">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
        {name && <p className="mt-1 text-xs text-gray-400">Slug: {slugify(name) || "—"}</p>}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          rows={5}
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Price (BDT)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="stockQuantity">Stock Quantity</Label>
          <Input
            id="stockQuantity"
            type="number"
            step="1"
            min="0"
            required
            value={stockQuantity}
            onChange={(e) => setStockQuantity(e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="compareAtPrice">Original Price (optional)</Label>
        <Input
          id="compareAtPrice"
          type="number"
          step="0.01"
          min="0"
          value={compareAtPrice}
          onChange={(e) => setCompareAtPrice(e.target.value)}
        />
        <p className="mt-1 text-xs text-gray-400">
          Shown crossed out for discount display. Leave blank if not on sale.
        </p>
      </div>

      <div>
        <Label htmlFor="categoryId">Category</Label>
        <select
          id="categoryId"
          required
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
        >
          <option value="" disabled>
            Select a category
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label>Images</Label>
        <ImageUploader value={imageUrls} onChange={setImageUrls} />
      </div>

      <div>
        <Label htmlFor="youtubeVideoUrl">YouTube Video URL (optional)</Label>
        <Input
          id="youtubeVideoUrl"
          type="url"
          placeholder="https://www.youtube.com/watch?v=..."
          value={youtubeVideoUrl}
          onChange={(e) => setYoutubeVideoUrl(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="dosageInstructions">Dosage Instructions (optional)</Label>
        <Textarea
          id="dosageInstructions"
          rows={3}
          value={dosageInstructions}
          onChange={(e) => setDosageInstructions(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="disclaimerText">Custom Disclaimer (optional)</Label>
        <Textarea
          id="disclaimerText"
          rows={3}
          placeholder={DEFAULT_HERBAL_DISCLAIMER}
          value={disclaimerText}
          onChange={(e) => setDisclaimerText(e.target.value)}
        />
        <p className="mt-1 text-xs text-gray-400">
          Leave blank to use the default disclaimer shown above as placeholder text.
        </p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Create Product"}
      </Button>
    </form>
  );
}
