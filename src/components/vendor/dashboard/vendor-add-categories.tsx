"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Sparkle, Tag, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  createVendorProductCategories,
  fetchVendorProductCategories,
  vendorProductCategoriesQueryKey,
} from "@/services/vendor/vendor-product-categories.api";
import {
  VENDOR_CATEGORY_ICON_OPTIONS,
  VendorCategoryIcon,
} from "@/lib/vendor-category-icons";
import { cn } from "@/lib/utils";

const inputCls =
  "h-11 rounded-xl border border-border-muted bg-surface-subtle text-sm px-4 shadow-sm transition-shadow focus-visible:ring-2 focus-visible:ring-primary/20";

interface CategoryDraft {
  key: string;
  name: string;
  icon: string;
}

function newDraft(): CategoryDraft {
  return { key: crypto.randomUUID(), name: "", icon: "basket" };
}

function CategoriesSkeleton() {
  return (
    <div className="space-y-4" role="status" aria-label="Loading categories">
      <Skeleton className="h-32 w-full rounded-2xl" />
      <Skeleton className="h-32 w-full rounded-2xl" />
    </div>
  );
}

export function VendorAddCategoriesPage() {
  const queryClient = useQueryClient();
  const [drafts, setDrafts] = useState<CategoryDraft[]>([newDraft()]);

  const { data, isPending } = useQuery({
    queryKey: vendorProductCategoriesQueryKey,
    queryFn: fetchVendorProductCategories,
  });

  const existing = data?.data ?? [];

  const createMutation = useMutation({
    mutationFn: () =>
      createVendorProductCategories({
        categories: drafts
          .map((d) => ({ name: d.name.trim(), icon: d.icon }))
          .filter((d) => d.name.length > 0),
      }),
    onSuccess: (res) => {
      toast.success(res.message ?? "Categories saved");
      setDrafts([newDraft()]);
      void queryClient.invalidateQueries({ queryKey: vendorProductCategoriesQueryKey });
    },
    onError: () => toast.error("Could not save categories"),
  });

  const updateDraft = (key: string, patch: Partial<CategoryDraft>) => {
    setDrafts((prev) => prev.map((d) => (d.key === key ? { ...d, ...patch } : d)));
  };

  const removeDraft = (key: string) => {
    setDrafts((prev) => (prev.length <= 1 ? prev : prev.filter((d) => d.key !== key)));
  };

  const addRow = () => setDrafts((prev) => [...prev, newDraft()]);

  const validDrafts = drafts.filter((d) => d.name.trim().length > 0);

  return (
    <div className="min-h-full bg-gradient-to-b from-surface-subtle via-surface-canvas to-surface-subtle/80">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-8 overflow-hidden rounded-3xl border border-primary/10 bg-gradient-to-br from-primary/10 via-surface-canvas to-surface-brand-soft/30 p-6 shadow-[0_8px_40px_rgba(0,0,0,0.06)] sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary shadow-inner">
              <Tag className="size-6" aria-hidden />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary/80">
                Your store menu
              </p>
              <h1 className="mt-1 font-[family-name:var(--font-manrope)] text-2xl font-bold tracking-tight text-content-neutral-primary sm:text-3xl">
                Add vendor categories
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-content-neutral-secondary sm:text-base">
                These tabs appear on your storefront so shoppers browse your menu the way you
                organize it — separate from ASAPU&apos;s platform categories.
              </p>
            </div>
          </div>
        </div>

        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-content-neutral-muted">
              Your categories
            </h2>
            <span className="rounded-full bg-surface-subtle px-3 py-1 text-xs font-medium text-content-neutral-secondary">
              {existing.length} live
            </span>
          </div>

          {isPending ? (
            <CategoriesSkeleton />
          ) : existing.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border-muted bg-white/60 px-6 py-10 text-center">
              <Sparkle className="mx-auto size-8 text-content-neutral-muted" aria-hidden />
              <p className="mt-3 text-sm font-medium text-content-neutral-primary">
                No categories yet
              </p>
              <p className="mt-1 text-sm text-content-neutral-secondary">
                Add your first menu tab below — e.g. &quot;Breakfast&quot;, &quot;Drinks&quot;, &quot;Combos&quot;.
              </p>
            </div>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2">
              {existing.map((cat) => (
                <li
                  key={cat.id}
                  className="flex items-center gap-3 rounded-2xl border border-border-muted bg-white p-4 shadow-sm"
                >
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <VendorCategoryIcon iconKey={cat.icon} className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-content-neutral-primary">{cat.name}</p>
                    <p className="text-xs text-content-neutral-muted">
                      {cat.productCount ?? 0} product{(cat.productCount ?? 0) === 1 ? "" : "s"}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-3xl border border-border-muted bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-content-neutral-primary">Add new</h2>
              <p className="mt-0.5 text-sm text-content-neutral-secondary">
                Add one or several at once — each needs a name and icon.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="shrink-0 rounded-full gap-1.5"
              onClick={addRow}
            >
              <Plus className="size-4" aria-hidden />
              Another
            </Button>
          </div>

          <div className="space-y-5">
            {drafts.map((draft, index) => (
              <article
                key={draft.key}
                className="rounded-2xl border border-border-muted/80 bg-surface-subtle/40 p-4 sm:p-5"
              >
                <div className="mb-4 flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-content-neutral-muted">
                    Category {index + 1}
                  </span>
                  {drafts.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => removeDraft(draft.key)}
                      className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium text-content-negative transition-colors hover:bg-red-50"
                    >
                      <Trash2 className="size-3.5" aria-hidden />
                      Remove
                    </button>
                  ) : null}
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor={`name-${draft.key}`}>Category name</Label>
                    <Input
                      id={`name-${draft.key}`}
                      placeholder="e.g. Fresh produce, Lunch specials"
                      className={inputCls}
                      value={draft.name}
                      onChange={(e) => updateDraft(draft.key, { name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <Label>Category icon</Label>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                        <VendorCategoryIcon iconKey={draft.icon} className="size-3.5" />
                        {VENDOR_CATEGORY_ICON_OPTIONS.find((o) => o.key === draft.icon)?.label ??
                          "Selected"}
                      </span>
                    </div>
                    <p className="text-xs text-content-neutral-muted">
                      Scroll the grid to browse all icons.
                    </p>
                    <div
                      className={cn(
                        "max-h-36 overflow-y-auto rounded-xl border border-border-muted bg-white p-2 sm:max-h-40",
                        "[scrollbar-width:thin] [scrollbar-color:var(--border-muted)_transparent]"
                      )}
                    >
                      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
                        {VENDOR_CATEGORY_ICON_OPTIONS.map(({ key, label, Icon }) => {
                          const selected = draft.icon === key;
                          return (
                            <button
                              key={key}
                              type="button"
                              title={label}
                              onClick={() => updateDraft(draft.key, { icon: key })}
                              className={cn(
                                "flex flex-col items-center gap-1 rounded-xl border p-2 transition-all cursor-pointer",
                                selected
                                  ? "border-primary bg-primary/10 text-primary shadow-sm ring-2 ring-primary/20"
                                  : "border-border-muted bg-surface-subtle/50 text-content-neutral-secondary hover:border-primary/30 hover:bg-primary/5"
                              )}
                            >
                              <Icon className="size-4 shrink-0 sm:size-5" aria-hidden />
                              {/* <span className="w-full truncate text-center text-[9px] font-medium sm:text-[10px]">
                                {label}
                              </span> */}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-border-muted pt-6">
            <Button
              type="button"
              className="rounded-full px-8 shadow-md"
              disabled={createMutation.isPending || validDrafts.length === 0}
              onClick={() => createMutation.mutate()}
            >
              {createMutation.isPending
                ? "Saving…"
                : `Save ${validDrafts.length} categor${validDrafts.length === 1 ? "y" : "ies"}`}
            </Button>
            <Button asChild variant="ghost" className="rounded-full text-content-neutral-muted">
              <Link href="/vendor/dashboard">Back to dashboard</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
