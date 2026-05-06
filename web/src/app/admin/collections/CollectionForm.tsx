"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Button,
  ErrorBanner,
  Field,
  LinkButton,
  Panel,
  TextArea,
  TextInput,
} from "../_components/AdminUI";
import {
  createCollection,
  updateCollection,
  type CollectionUpdatePayload,
  type CollectionWritePayload,
} from "@/lib/admin-api";
import type { Collection } from "@/data/store";

interface CollectionFormProps {
  mode: "create" | "edit";
  initial?: Collection;
}

interface FormState {
  id: string;
  name: string;
  description: string;
  image: string;
}

const EMPTY: FormState = { id: "", name: "", description: "", image: "" };

export default function CollectionForm({ mode, initial }: CollectionFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() =>
    initial
      ? {
          id: initial.id,
          name: initial.name,
          description: initial.description,
          image: initial.image,
        }
      : EMPTY,
  );
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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

    if (!form.name.trim()) return setError("Name is required");
    if (mode === "create" && slugInvalid)
      return setError("Slug must be lowercase letters, numbers, and dashes");

    setSubmitting(true);
    try {
      if (mode === "create") {
        const payload: CollectionWritePayload = {
          id: form.id.trim(),
          name: form.name.trim(),
          description: form.description,
          image: form.image,
        };
        await createCollection(payload);
      } else if (initial) {
        const payload: CollectionUpdatePayload = {
          name: form.name.trim(),
          description: form.description,
          image: form.image,
        };
        await updateCollection(initial.id, payload);
      }
      router.push("/admin/collections");
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
            hint="url id; e.g. ai-does-it-better"
            error={slugInvalid && form.id ? "lowercase + dashes only" : undefined}
          >
            <TextInput
              value={form.id}
              onChange={(e) => update("id", e.target.value)}
              placeholder="ai-does-it-better"
              disabled={mode === "edit"}
              required
            />
          </Field>

          <Field label="name" required>
            <TextInput
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="For When AI Does It Better"
              required
            />
          </Field>

          <div className="md:col-span-2">
            <Field label="image_url" hint="path under web/public, e.g. /product-mug.png">
              <TextInput
                value={form.image}
                onChange={(e) => update("image", e.target.value)}
                placeholder="/product-pixels-hoodie.png"
              />
            </Field>
          </div>

          <div className="md:col-span-2">
            <Field label="description" hint="short editorial line">
              <TextArea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Tools for accepting the inevitable."
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
              ? "create_collection"
              : "save_changes"}
        </Button>
        <LinkButton href="/admin/collections" variant="secondary">
          cancel
        </LinkButton>
      </div>
    </form>
  );
}
