"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthHydrated } from "@/hooks/use-auth-hydrated";
import { useAuthStore } from "@/stores/auth-store";
import { useCustomerAuthUiStore } from "@/stores/customer-auth-ui-store";
import {
  CART_QUERY_KEY,
  addToCart,
  fetchCart,
  removeCartItem,
  updateCartItem,
} from "@/services/store/cart.api";
import {
  WISHLIST_QUERY_KEY_ROOT,
  addWishlistItem,
  fetchWishlistPage,
  removeWishlistItem,
  wishlistContainsQueryKey,
} from "@/services/store/wishlist.api";
import { cn } from "@/lib/utils";

const WISHLIST_PEEK_LIMIT = 100;

function useWishlistContains(productId: string, enabled: boolean) {
  return useQuery({
    queryKey: wishlistContainsQueryKey(productId),
    queryFn: async () => {
      const res = await fetchWishlistPage(1, WISHLIST_PEEK_LIMIT);
      if (!res.success || !res.data) return false;
      return res.data.some((e) => e.product._id === productId);
    },
    enabled,
    staleTime: 60_000,
  });
}

interface StoreProductDetailCommerceProps {
  productId: string;
  vendorId?: string;
  quantity: number;
  maxQty: number;
  outOfStock?: boolean;
  onQuantityDelta: (delta: number) => void;
}

export function StoreProductDetailCommerce({
  productId,
  vendorId,
  quantity,
  maxQty,
  outOfStock = false,
  onQuantityDelta,
}: StoreProductDetailCommerceProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const hydrated = useAuthHydrated();
  const token = useAuthStore((s) => s.token);
  const openSignIn = useCustomerAuthUiStore((s) => s.openSignIn);
  const authed = Boolean(hydrated && token);

  const { data: cartItems = [] } = useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: fetchCart,
    select: (r) => (r.success && r.data ? r.data.items : []),
    enabled: authed,
  });

  const cartLine = cartItems.find((i) => i.productId === productId);
  const inCart = Boolean(cartLine);

  const { data: inWishlist } = useWishlistContains(
    productId,
    authed && Boolean(productId)
  );

  const invalidateCart = () =>
    void queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });

  const invalidateWishlist = () =>
    void queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY_ROOT });

  const addCartMut = useMutation({
    mutationFn: () => addToCart({ productId, quantity, variantId: null }),
    onSuccess: (res) => {
      invalidateCart();
      toast.success(res.message ?? "Added to cart");
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message ?? "Could not add to cart");
    },
  });

  const removeCartMut = useMutation({
    mutationFn: () => removeCartItem(productId),
    onSuccess: (res) => {
      invalidateCart();
      toast.success(res.message ?? "Removed from cart");
    },
    onError: () => toast.error("Could not remove from cart"),
  });

  const addWishMut = useMutation({
    mutationFn: () => addWishlistItem({ productId }),
    onSuccess: (res) => {
      invalidateWishlist();
      toast.success(res.message ?? "Saved to wishlist");
    },
    onError: () => toast.error("Could not update wishlist"),
  });

  const removeWishMut = useMutation({
    mutationFn: () => removeWishlistItem(productId),
    onSuccess: (res) => {
      invalidateWishlist();
      toast.success(res.message ?? "Removed from wishlist");
    },
    onError: () => toast.error("Could not update wishlist"),
  });

  const requireAuth = () => {
    toast.message("Sign in to continue");
    openSignIn();
    return false;
  };

  const handleAddOrRemoveCart = () => {
    if (outOfStock) return;
    if (!authed) return requireAuth();
    if (inCart) {
      removeCartMut.mutate();
    } else {
      addCartMut.mutate();
    }
  };

  const handleBuyNow = async () => {
    if (outOfStock) return;
    if (!authed) return requireAuth();
    try {
      const cart = await fetchCart();
      const existing = cart.data?.items.find((i) => i.productId === productId);
      if (existing) {
        await updateCartItem(productId, { quantity });
      } else {
        await addToCart({ productId, quantity, variantId: null });
      }
      invalidateCart();
      toast.success("Continue to checkout");
      const checkoutVendorId = vendorId?.trim();
      router.push(
        checkoutVendorId
          ? `/store/checkout?vendorId=${encodeURIComponent(checkoutVendorId)}`
          : "/store/checkout"
      );
    } catch {
      toast.error("Could not start checkout");
    }
  };

  const handleWishlistToggle = () => {
    if (!authed) return requireAuth();
    if (inWishlist) {
      removeWishMut.mutate();
    } else {
      addWishMut.mutate();
    }
  };

  const cartBusy = addCartMut.isPending || removeCartMut.isPending;
  const wishBusy = addWishMut.isPending || removeWishMut.isPending;

  const wishlistButton = (
    <div className="pt-3">
      <button
        type="button"
        disabled={wishBusy}
        onClick={handleWishlistToggle}
        className="text-sm font-medium text-content-link underline decoration-content-link/40 underline-offset-4 hover:decoration-content-link disabled:opacity-50"
      >
        {inWishlist ? "Remove from wishlist" : "Add to wishlist"}
      </button>
    </div>
  );

  if (outOfStock) {
    return (
      <>
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm font-semibold text-content-negative">Out of stock</p>
          <p className="mt-1 text-sm text-content-neutral-secondary">
            This item is currently unavailable. You cannot add it to your cart or place an order
            right now.
          </p>
        </div>
        {wishlistButton}
      </>
    );
  }

  return (
    <>
      <div className="flex items-center space-x-4">
        <div className="flex items-center rounded-full border border-content-neutral-tertiary">
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => onQuantityDelta(-1)}
            disabled={quantity <= 1}
            className="rounded-r-none"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="min-w-[40px] px-4 py-2 text-center text-content-neutral-primary">
            {quantity}
          </span>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => onQuantityDelta(1)}
            disabled={quantity >= maxQty || maxQty <= 0}
            className="rounded-l-none"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="border-b border-border-subtle pb-4 text-sm text-content-neutral-tertiary" />

      <div className="flex flex-wrap gap-4 pt-4">
        <Button
          type="button"
          className="w-full min-w-[160px] max-w-[188px] sm:w-[188px]"
          disabled={maxQty <= 0}
          onClick={() => void handleBuyNow()}
        >
          Buy now
        </Button>
        <Button
          type="button"
          variant={inCart ? "destructive" : "outline"}
          className={cn(
            "w-full min-w-[160px] max-w-[188px] border sm:w-[188px]",
            !inCart && "border-content-neutral-primary"
          )}
          disabled={cartBusy || maxQty <= 0}
          onClick={handleAddOrRemoveCart}
        >
          {inCart ? "Remove from cart" : "Add to cart"}
        </Button>
      </div>

      {wishlistButton}
    </>
  );
}
