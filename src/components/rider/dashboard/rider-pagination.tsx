"use client";

import React from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const RiderPagination = ({ currentPage, totalPages, onPageChange }: Props) => {
  const pages = [1, 2, 3, null, 10, 11, 12].filter((p) =>
    p === null || (p as number) <= totalPages
  );

  return (
    <div className="flex items-center justify-between px-3 py-3 border-t border-border-muted">
      <span className="text-sm text-content-neutral-muted">Page {currentPage} of {totalPages}</span>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3 py-1.5 rounded border border-border-muted text-sm text-content-neutral-secondary hover:bg-surface-muted disabled:opacity-40 cursor-pointer disabled:cursor-default"
        >
          <ArrowLeftIcon className="size-3.5" /> Previous
        </button>
        {pages.map((p, i) =>
          p === null ? (
            <span key={`ellipsis-${i}`} className="px-1 text-content-neutral-muted">…</span>
          ) : (
            <button key={p} onClick={() => onPageChange(p as number)}
              className={cn("w-7 h-7 rounded text-xs font-medium transition-colors cursor-pointer",
                currentPage === p ? "bg-surface-brand text-white" : "border border-border-muted text-content-neutral-secondary hover:bg-surface-muted"
              )}>
              {p}
            </button>
          )
        )}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-3 py-1.5 rounded border border-border-muted text-sm text-content-neutral-secondary hover:bg-surface-muted disabled:opacity-40 cursor-pointer disabled:cursor-default"
        >
          Next <ArrowRightIcon className="size-3.5" />
        </button>
      </div>
    </div>
  );
};

export default RiderPagination;
