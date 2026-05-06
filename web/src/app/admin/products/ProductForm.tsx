"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Button,
  ErrorBanner,
  Field,
  LinkButton,
  Panel,
  Select,
  TextArea,
  TextInput,
} from "../_components/AdminUI";
import {
  createProduct,
  fetchCollections,
  updateProduct,
  type ProductUpdatePayload,
  type ProductWritePayload,
} from "@/lib/admin-api";
import type { Collection, Product } from "@/data/store";

interface ProductFormProps {
  mode: "create" | "edit";
  initial?: Product;
}

interface FormState {
  id: string;
  name: string;
  price: string;
  category: string;
  tagline: string;
  replacementLikelihood: string;
  image: string;
  collection: string;
}

const EMPTY: FormState = {
  id: "",
  name: "",
  price: "",
  category: "",
  tagline: "",
  replacementLikelihood: "0",
  image: "",
  collection: "",
};

function fromProduct(p: Product): FormState {
  return {
    id: p.id,
    name: p.name,
    price: String(p.price),
    category: p.category,
    tagline: p.tagline,
    replacementLikelihood: String(p.replacementLikelihood),
    image: p.image,
    collection: p.collection,
  };
}

export default function ProductForm({ mode, initial }: ProductFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() =>
    initial ? fromProduct(initial) : EMPTY,
  );
  const [collections, setCollections] = useState<Collection[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [collectionsLoading, setCollectionsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchCollections()
      .then((cs) => {
        if (cancelled) return;
        setCollections(cs);
        if (mode === "create" && cs.length > 0 && !form.collection) {
          setForm((f) => ({ ...f, collection: cs[0]!.id }));
        }
      })
      .catch((err) => {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Failed to load collections");
      })
      .finally(() => {
        if (!cancelled) setCollectionsLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const slugInvalid = useMemo(() => {
    if (mode === "edit") return false;
    if (!form.id) return true;
    return !/^[a-z0-9][a-z0-9-]*$/.test(form.id);
  }, [form.id, mode]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const price = parseFloat(form.price);
    const likelihood = parseInt(form.replacementLikelihood || "0", 10);
    if (Number.isNaN(price) || price < 0) {
      setError("Price must be a non-negative number");
      return;
    }
    if (Number.isNaN(likelihood) || likelihood < 0 || likelihood > 100) {
      setError("Replacement likelihood must be between 0 and 100");
      return;
    }
    if (!form.name.trim()) return setError("Name is required");
    if (!form.category.trim()) return setError("Category is required");
    if (!form.collection) return setError("Pick a collection");
    if (mode === "create" && slugInvalid)
      return setError("Slug must be lowercase letters, numbers, and dashes");

    setSubmitting(true);
    try {
      if (mode === "create") {
        const payload: ProductWritePayload = {
          id: form.id.trim(),
          name: form.name.trim(),
          price,
          category: form.category.trim(),
          tagline: form.tagline,
          replacementLikelihood: likelihood,
          image: form.image,
          collection: form.collection,
        };
        await createProduct(payload);
      } else if (initial) {
        const payload: ProductUpdatePayload = {
          name: form.name.trim(),
          price,
          category: form.category.trim(),
          tagline: form.tagline,
          replacementLikelihood: likelihood,
          image: form.image,
          collection: form.collection,
        };
        await updateProduct(initial.id, payload);
      }
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {error && <ErrorBanner message={error} />}

      <Panel className="p-6 md:p-8">
        <div className="grid md:grid-cols-2 gap-6">
          <Field
            label="slug"
            required
            hint="url id; e.g. automated-mug"
            error={slugInvalid && form.id ? "lowercase + dashes only" : undefined}
          >
            <TextInput
              value={form.id}
              onChange={(e) => update("id", e.target.value)}
              placeholder="automated-mug"
              disabled={mode === "edit"}
              required
            />
          </Field>

          <Field label="name" required>
            <TextInput
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="This Could've Been Automated Mug"
              required
            />
          </Field>

          <Field label="price" required hint="usd, 2 decimals">
            <TextInput
              type="number"
              value={form.price}
              onChange={(e) => update("price", e.target.value)}
              placeholder="28.00"
              step="0.01"
              min="0"
              required
            />
          </Field>

          <Field label="category" required>
            <TextInput
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
              placeholder="Mugs"
              required
            />
          </Field>

          <Field
            label="replacement_likelihood"
            hint="0 to 100"
          >
            <TextInput
              type="number"
              value={form.replacementLikelihood}
              onChange={(e) => update("replacementLikelihood", e.target.value)}
              min="0"
              max="100"
              step="1"
            />
          </Field>

          <Field label="collection" required>
            <Select
              value={form.collection}
              onChange={(e) => update("collection", e.target.value)}
              disabled={collectionsLoading}
              required
            >
              {collectionsLoading && <option value="">loading…</option>}
              {!collectionsLoading && collections.length === 0 && (
                <option value="">no collections — create one first</option>
              )}
              {collections.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#0a0a0a]">
                  {c.name}  ({c.id})
                </option>
              ))}
            </Select>
          </Field>

          <div className="md:col-span-2">
            <Field label="image_url" hint="path under web/public, e.g. /product-mug.png">
              <TextInput
                value={form.image}
                onChange={(e) => update("image", e.target.value)}
                placeholder="/product-mug.png"
              />
            </Field>
          </div>

          <div className="md:col-span-2">
            <Field label="tagline" hint="short marketing line">
              <TextArea
                value={form.tagline}
                onChange={(e) => update("tagline", e.target.value)}
                placeholder="Your morning ritual, soon to be optimized."
              />
            </Field>
          </div>
        </div>
      </Panel>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting
            ? "transmitting…"
            : mode === "create"
              ? "create_product"
              : "save_changes"}
        </Button>
        <LinkButton href="/admin/products" variant="secondary">
          cancel
        </LinkButton>
      </div>
    </form>
  );
}
