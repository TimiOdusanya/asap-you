"use client";

import * as React from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--surface-neutral-normal)",
          "--normal-text": "var(--content-neutral-primary)",
          "--normal-border": "var(--border-divider-normal)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
