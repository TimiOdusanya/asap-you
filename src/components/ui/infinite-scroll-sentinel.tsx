"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InfiniteScrollSentinelProps {
  hasMore: boolean;
  isBusy: boolean;
  onLoadMore: () => void;
  className?: string;
  rootMargin?: string;
  threshold?: number;
  /** Shown while fetching the next page */
  showSpinner?: boolean;
}

export function InfiniteScrollSentinel({
  hasMore,
  isBusy,
  onLoadMore,
  className,
  rootMargin = "240px 0px",
  threshold = 0,
  showSpinner = true,
}: InfiniteScrollSentinelProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const onLoadMoreRef = React.useRef(onLoadMore);
  onLoadMoreRef.current = onLoadMore;

  React.useEffect(() => {
    const el = ref.current;
    if (!el || !hasMore || isBusy) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) onLoadMoreRef.current();
      },
      { root: null, rootMargin, threshold }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMore, isBusy, rootMargin, threshold]);

  if (!hasMore) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex min-h-12 w-full flex-col items-center justify-center gap-2 py-6",
        className
      )}
    >
      {isBusy && showSpinner ? (
        <Loader2
          className="size-8 animate-spin text-primary"
          aria-hidden
        />
      ) : null}
      <div ref={ref} className="h-1 w-full max-w-md" aria-hidden />
    </div>
  );
}
