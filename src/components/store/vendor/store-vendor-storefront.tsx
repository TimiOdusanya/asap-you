"use client";

import * as React from "react";
import Link from "next/link";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { StoreVendorPageSkeleton } from "@/components/store/skeletons/store-vendor-page-skeleton";
import { StoreVendorProductRow } from "@/components/store/vendor/store-vendor-product-row";
import { StoreVendorStoreHeader } from "@/components/store/vendor/store-vendor-store-header";
import { useAuthHydrated } from "@/hooks/use-auth-hydrated";
import { useAuthStore } from "@/stores/auth-store";
import { useCustomerAuthUiStore } from "@/stores/customer-auth-ui-store";
import {
  storefrontProductToProductDto,
  vendorStorefrontVendorToListItem,
} from "@/lib/vendor-storefront-mappers";
import { EMPTY_STATE_ILLUSTRATION } from "@/lib/empty-state-illustrations";
import {
  CART_QUERY_KEY,
  addToCart,
  fetchCart,
  removeCartItem,
  updateCartItem,
} from "@/services/store/cart.api";
import {
  fetchVendorStorefront,
  vendorStorefrontInfiniteQueryKey,
} from "@/services/store/vendor-storefront.api";
import type { CartGetResponse, CartItemDto, ProductDto } from "@/types/store-api";
import { getMaxPurchasableQuantity } from "@/lib/product-availability";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { VendorCategoryIcon } from "@/lib/vendor-category-icons";
import { cn } from "@/lib/utils";

const STOREFRONT_PAGE_LIMIT = 20;

export function StoreVendorStorefront({ vendorId }: { vendorId: string }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const hydrated = useAuthHydrated();
  const token = useAuthStore((s) => s.token);
  const authed = Boolean(hydrated && token);
  const openSignIn = useCustomerAuthUiStore((s) => s.openSignIn);
  const categoryFromUrl = searchParams.get("categoryId")?.trim() || null;
  const searchFromUrl = searchParams.get("search")?.trim() || "";
  const [pickedCategoryId, setPickedCategoryId] = React.useState<string | null>(null);
  const [searchInput, setSearchInput] = React.useState(searchFromUrl);
  const [debouncedSearch, setDebouncedSearch] = React.useState(searchFromUrl);

  React.useEffect(() => {
    if (categoryFromUrl) setPickedCategoryId(null);
  }, [categoryFromUrl]);

  React.useEffect(() => {
    const t = window.setTimeout(() => setDebouncedSearch(searchInput.trim()), 300);
    return () => window.clearTimeout(t);
  }, [searchInput]);

  React.useEffect(() => {
    const p = new URLSearchParams(searchParams.toString());
    if (debouncedSearch) p.set("search", debouncedSearch);
    else p.delete("search");
    const next = p.toString();
    const current = searchParams.toString();
    if (next !== current) {
      router.replace(`/store/vendor/${vendorId}${next ? `?${next}` : ""}`, { scroll: false });
    }
  }, [debouncedSearch, vendorId, router, searchParams]);

  const categoryForQuery = debouncedSearch ? undefined : (categoryFromUrl ?? pickedCategoryId ?? undefined);
  const searchForQuery = debouncedSearch || undefined;

  const {
    data: storefrontPages,
    isPending: storefrontPending,
    isError: storefrontError,
    refetch: refetchStorefront,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: vendorStorefrontInfiniteQueryKey(vendorId, categoryForQuery, searchForQuery),
    queryFn: async ({ pageParam }) => {
      const res = await fetchVendorStorefront({
        vendorId,
        categoryId: categoryForQuery,
        search: searchForQuery,
        page: pageParam as number,
        limit: STOREFRONT_PAGE_LIMIT,
      });
      if (!res.success || !res.data) throw new Error("Storefront request failed");
      return res;
    },
    initialPageParam: 1,
    getNextPageParam: (last) => {
      const p = last.data.pagination;
      if (!p || p.page >= p.totalPages) return undefined;
      return p.page + 1;
    },
    enabled: Boolean(vendorId),
  });

  const firstPage = storefrontPages?.pages[0];
  const storefrontData = firstPage?.data;
  const vendorDto = storefrontData?.vendor;
  const menuCategories = storefrontData?.menuCategories ?? [];
  const selectedCategoryId = storefrontData?.selectedCategoryId ?? "";
  const vendorListItem = vendorDto
    ? vendorStorefrontVendorToListItem(vendorDto)
    : null;
  const todayHoursLabel = vendorDto?.todayHours?.label;

  const productsFlat = React.useMemo(() => {
    if (!storefrontPages?.pages.length || !vendorDto) return [] as ProductDto[];
    return storefrontPages.pages.flatMap((page) =>
      page.data.products.map((p) => storefrontProductToProductDto(vendorDto.id, p))
    );
  }, [storefrontPages, vendorDto]);

  const { data: cartLines = [] } = useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: fetchCart,
    select: (r) => (r.success && r.data ? r.data.items : []),
    enabled: authed,
  });

  const addMut = useMutation({
    mutationFn: (productId: string) =>
      addToCart({ productId, quantity: 1, variantId: null }),

    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEY });
      const previous = queryClient.getQueryData<CartGetResponse>(CART_QUERY_KEY);
      const product = productsFlat.find((p) => p._id === productId);
      if (!product) return { previous };

      queryClient.setQueryData<CartGetResponse>(CART_QUERY_KEY, (old) => {
        if (!old?.success || !old.data) return old;
        const existing = old.data.items.find((i) => i.productId === productId);
        let newItems: CartItemDto[];
        if (existing) {
          newItems = old.data.items.map((i) =>
            i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i
          );
        } else {
          const newLine: CartItemDto = {
            productId,
            vendorId: product.vendorId,
            name: product.name,
            image: product.images[0]?.trim() ?? "",
            price: product.price,
            quantity: 1,
            variantId: null,
          };
          newItems = [...old.data.items, newLine];
        }
        const itemCount = newItems.reduce((n, i) => n + i.quantity, 0);
        const subtotal = newItems.reduce((s, i) => s + i.price * i.quantity, 0);
        return {
          ...old,
          data: { ...old.data, items: newItems, itemCount, subtotal },
        };
      });
      return { previous };
    },

    onError: (_err, _productId, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(CART_QUERY_KEY, context.previous);
      }
      toast.error("Could not add to cart");
    },

    onSuccess: (res, _productId, context) => {
      if (res.success && res.data?.items) {
        queryClient.setQueryData<CartGetResponse>(CART_QUERY_KEY, (old) => {
          if (!old?.success || !old.data) return old;
          const items = res.data.items;
          const itemCount =
            res.data.itemCount ?? items.reduce((n, i) => n + i.quantity, 0);
          const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
          return {
            ...old,
            data: { ...old.data, items, itemCount, subtotal },
          };
        });
        toast.success(res.message ?? "Added to cart");
      } else if (context?.previous !== undefined) {
        queryClient.setQueryData(CART_QUERY_KEY, context.previous);
        toast.error(res.message ?? "Could not add to cart");
      }
    },
  });

  const updateMut = useMutation({
    mutationFn: (args: { productId: string; quantity: number }) =>
      updateCartItem(args.productId, { quantity: args.quantity }),

    onMutate: async ({ productId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEY });
      const previous = queryClient.getQueryData<CartGetResponse>(CART_QUERY_KEY);
      queryClient.setQueryData<CartGetResponse>(CART_QUERY_KEY, (old) => {
        if (!old?.success || !old.data) return old;
        const newItems = old.data.items.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        );
        const itemCount = newItems.reduce((n, i) => n + i.quantity, 0);
        const subtotal = newItems.reduce((s, i) => s + i.price * i.quantity, 0);
        return {
          ...old,
          data: { ...old.data, items: newItems, itemCount, subtotal },
        };
      });
      return { previous };
    },

    onError: (_err, _variables, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(CART_QUERY_KEY, context.previous);
      }
      toast.error("Could not update quantity");
    },

    onSuccess: (res, _variables, context) => {
      if (res.success && res.data?.items) {
        queryClient.setQueryData<CartGetResponse>(CART_QUERY_KEY, (old) => {
          if (!old?.success || !old.data) return old;
          const items = res.data.items;
          const itemCount = items.reduce((n, i) => n + i.quantity, 0);
          const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
          return {
            ...old,
            data: { ...old.data, items, itemCount, subtotal },
          };
        });
      } else if (context?.previous !== undefined) {
        queryClient.setQueryData(CART_QUERY_KEY, context.previous);
        toast.error(res.message ?? "Could not update quantity");
      }
    },
  });

  const removeMut = useMutation({
    mutationFn: (productId: string) => removeCartItem(productId),

    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEY });
      const previous = queryClient.getQueryData<CartGetResponse>(CART_QUERY_KEY);
      queryClient.setQueryData<CartGetResponse>(CART_QUERY_KEY, (old) => {
        if (!old?.success || !old.data) return old;
        const newItems = old.data.items.filter((i) => i.productId !== productId);
        const itemCount = newItems.reduce((n, i) => n + i.quantity, 0);
        const subtotal = newItems.reduce((s, i) => s + i.price * i.quantity, 0);
        return {
          ...old,
          data: { ...old.data, items: newItems, itemCount, subtotal },
        };
      });
      return { previous };
    },

    onError: (_err, _productId, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(CART_QUERY_KEY, context.previous);
      }
      toast.error("Could not remove item");
    },

    onSuccess: (res, _productId, context) => {
      if (res.success && res.data?.items) {
        queryClient.setQueryData<CartGetResponse>(CART_QUERY_KEY, (old) => {
          if (!old?.success || !old.data) return old;
          const items = res.data.items;
          const itemCount = items.reduce((n, i) => n + i.quantity, 0);
          const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
          return {
            ...old,
            data: { ...old.data, items, itemCount, subtotal },
          };
        });
        toast.success(res.message ?? "Removed from cart");
      } else if (context?.previous !== undefined) {
        queryClient.setQueryData(CART_QUERY_KEY, context.previous);
        toast.error(res.message ?? "Could not remove item");
      }
    },
  });

  const cartByProduct = React.useMemo(() => {
    const m = new Map<string, (typeof cartLines)[0]>();
    for (const line of cartLines) {
      m.set(line.productId, line);
    }
    return m;
  }, [cartLines]);

  const cartItemCount = React.useMemo(
    () => cartLines.reduce((n, l) => n + l.quantity, 0),
    [cartLines]
  );

  const requireAuth = () => {
    toast.message("Sign in to add items");
    openSignIn();
  };

  const activeCategoryTabId =
    categoryForQuery ?? selectedCategoryId ?? menuCategories[0]?.id ?? "";

  const onSelectCategory = (id: string) => {
    if (id === activeCategoryTabId && categoryForQuery === id) return;
    setPickedCategoryId(id);
    const p = new URLSearchParams(searchParams.toString());
    p.set("categoryId", id);
    router.replace(`/store/vendor/${vendorId}?${p.toString()}`, { scroll: false });
  };

  if (!hydrated || storefrontPending) {
    return <StoreVendorPageSkeleton />;
  }

  if (storefrontError || !vendorListItem || !vendorDto) {
    return (
      <div className="min-h-[50vh] bg-surface-subtle px-4 py-16">
        <EmptyState
          className="mx-auto max-w-lg"
          illustrationSrc={EMPTY_STATE_ILLUSTRATION.store}
          illustrationAlt=""
          title="Store not found"
          description="This store may not be available. Try another store from the list."
          action={{ label: "Back to stores", href: "/store" }}
        />
        <div className="mx-auto mt-6 max-w-lg text-center">
          <Button
            type="button"
            variant="outline"
            className="rounded-full"
            onClick={() => void refetchStorefront()}
          >
            Try again
          </Button>
        </div>
      </div>
    );
  }

  const handleDecrement = (productId: string) => {
    const line = cartByProduct.get(productId);
    if (!line) return;
    if (line.quantity <= 1) {
      removeMut.mutate(productId);
    } else {
      updateMut.mutate({ productId, quantity: line.quantity - 1 });
    }
  };

  const handleIncrement = (productId: string) => {
    const line = cartByProduct.get(productId);
    const product = productsFlat.find((p) => p._id === productId);
    if (!line || !product) return;
    const max = getMaxPurchasableQuantity(product);
    if (line.quantity >= max) return;
    updateMut.mutate({ productId, quantity: line.quantity + 1 });
  };

  return (
    <div
      className={cn(
        "min-h-screen bg-gradient-to-b from-surface-subtle to-surface-muted/40 pb-10 pt-5 sm:pb-14 sm:pt-7",
        authed && cartItemCount > 0 && "pb-28 sm:pb-14"
      )}
    >
      <div className="mx-auto max-w-[95%] md:max-w-[92%] lg:max-w-6xl">
        <nav className="mb-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium uppercase tracking-wider text-content-neutral-muted sm:text-sm">
          <Link href="/store" className="text-content-link transition-colors hover:text-primary">
            Store
          </Link>
          <span className="text-border-strong" aria-hidden>
            /
          </span>
          <span className="max-w-[min(100%,280px)] truncate text-content-neutral-primary normal-case tracking-normal">
            {vendorListItem.businessName}
          </span>
        </nav>

        <StoreVendorStoreHeader
          vendor={vendorListItem}
          todayHoursLabel={todayHoursLabel}
        />

        <section className="mt-10 sm:mt-12" aria-labelledby="vendor-menu-heading">
          <div className="mb-5 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2
                id="vendor-menu-heading"
                className="font-[family-name:var(--font-manrope)] text-2xl font-bold tracking-tight text-content-neutral-primary sm:text-3xl"
              >
                Menu
              </h2>
              <p className="mt-1 max-w-xl text-sm text-content-neutral-secondary sm:text-base">
                {debouncedSearch
                  ? `Showing results for “${debouncedSearch}” across this store.`
                  : "Choose a category, then add items to your cart. Prices are before fees at checkout."}
              </p>
            </div>
            <div className="relative w-full sm:max-w-xs">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-content-neutral-muted"
                aria-hidden
              />
              <Input
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search all products…"
                className="h-11 rounded-full border-border-muted bg-surface-canvas pl-10 pr-10 shadow-sm"
              />
              {searchInput ? (
                <button
                  type="button"
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-content-neutral-muted hover:bg-surface-muted"
                  onClick={() => setSearchInput("")}
                >
                  <X className="size-4" />
                </button>
              ) : null}
            </div>
          </div>

          {!debouncedSearch ? (
          <div
            role="tablist"
            aria-label="Menu categories"
            className={cn(
              "mb-6 flex gap-1 overflow-x-auto pb-1",
              "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            )}
          >
            {menuCategories.length === 0 ? (
              <p className="text-sm text-content-neutral-secondary">No menu categories yet.</p>
            ) : (
              menuCategories.map((cat) => {
                const selected = activeCategoryTabId === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => onSelectCategory(cat.id)}
                    className={cn(
                      "shrink-0 cursor-pointer rounded-xl px-3 py-2 text-xs font-normal transition-colors sm:px-4 sm:py-2.5 sm:text-sm",
                      selected
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-content-neutral-secondary hover:bg-surface-muted/50 hover:text-content-neutral-primary"
                    )}
                  >
                    <span className="mr-1.5 inline-flex align-middle">
                      <VendorCategoryIcon iconKey={cat.iconUrl} className="size-4" />
                    </span>
                    <span>{cat.name}</span>
                    <span
                      className={cn(
                        "ml-1.5 tabular-nums text-[11px] font-normal opacity-90 sm:ml-2 sm:text-xs",
                        selected ? "text-primary-foreground/90" : "text-content-neutral-muted"
                      )}
                      aria-label={`${cat.productCount} items`}
                    >
                      {cat.productCount}
                    </span>
                  </button>
                );
              })
            )}
          </div>
          ) : null}

          <div role="tabpanel">
            {productsFlat.length === 0 ? (
              <EmptyState
                className="mx-auto w-full max-w-md bg-transparent sm:max-w-lg"
                illustrationSrc={EMPTY_STATE_ILLUSTRATION.platform}
                illustrationAlt=""
                title={debouncedSearch ? "No matching products" : "Nothing in this category yet"}
                description={
                  debouncedSearch
                    ? "Try a different search term or browse categories."
                    : "Try another category above or check back later."
                }
              />
            ) : (
              <>
                <div className="mx-auto max-w-3xl space-y-4 divide-y divide-border-muted lg:max-w-5xl">
                  {productsFlat.map((product) => {
                    const lineBusy =
                      (updateMut.isPending && updateMut.variables?.productId === product._id) ||
                      (removeMut.isPending && removeMut.variables === product._id);
                    return (
                      <StoreVendorProductRow
                        key={product._id}
                        product={product}
                        line={cartByProduct.get(product._id)}
                        addBusy={addMut.isPending && addMut.variables === product._id}
                        updateBusy={lineBusy}
                        authed={authed}
                        onRequireAuth={requireAuth}
                        onAdd={() => addMut.mutate(product._id)}
                        onIncrement={() => handleIncrement(product._id)}
                        onDecrement={() => handleDecrement(product._id)}
                      />
                    );
                  })}
                </div>
                {hasNextPage ? (
                  <div className="mt-8 flex justify-center">
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-full"
                      disabled={isFetchingNextPage}
                      onClick={() => void fetchNextPage()}
                    >
                      {isFetchingNextPage ? "Loading…" : "Load more"}
                    </Button>
                  </div>
                ) : null}
              </>
            )}
          </div>
        </section>

        {authed && cartItemCount > 0 ? (
          <div className="mt-12 hidden flex-wrap justify-end gap-3 sm:flex">
            <Button asChild variant="outline" className="rounded-full border-border-muted px-6">
              <Link href="/store/cart">View cart · {cartItemCount}</Link>
            </Button>
            <Button asChild className="rounded-full px-8 shadow-md">
              <Link href={`/store/checkout?vendorId=${encodeURIComponent(vendorId)}`}>Proceed to checkout</Link>
            </Button>
          </div>
        ) : null}
      </div>

      {authed && cartItemCount > 0 ? (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border-muted bg-surface-canvas/95 px-4 py-4 shadow-[0_-12px_40px_rgba(0,0,0,0.12)] backdrop-blur-md sm:hidden">
          <div className="mx-auto flex max-w-lg items-center gap-3">
            <div className="min-w-0 flex-1 rounded-2xl bg-surface-subtle/90 px-3 py-2 ring-1 ring-border-muted/60">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-content-neutral-muted">
                Your cart
              </p>
              <p className="truncate text-sm font-bold text-content-neutral-primary">
                {cartItemCount} item{cartItemCount === 1 ? "" : "s"}
              </p>
            </div>
            <Button asChild variant="outline" size="sm" className="shrink-0 rounded-full border-border-muted">
              <Link href="/store/cart">Cart</Link>
            </Button>
            <Button asChild size="sm" className="shrink-0 rounded-full shadow-sm">
              <Link href={`/store/checkout?vendorId=${encodeURIComponent(vendorId)}`}>Checkout</Link>
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
