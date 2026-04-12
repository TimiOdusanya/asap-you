export type ContentToken = {
  token: string;
  swatchClass: string;
  usage: string;
  note?: string;
};

export type SurfaceToken = {
  token: string;
  swatchClass: string;
  usage: string;
  note?: string;
};

export type BorderToken = {
  token: string;
  boxClass: string;
};

export type ShadcnToken = {
  token: string;
  boxClass: string;
  textClass: string;
};

export type LegacySwatch = {
  token: string;
  bgClass: string;
  labelClass: string;
};

export type UsagePattern = {
  title: string;
  description: string;
  exampleClass: string;
  children?: "button-primary" | "button-outline" | "link" | "input-search" | "card" | "forest-banner";
};

export const SEMANTIC_CONTENT: ContentToken[] = [
  {
    token: "content-neutral-primary",
    swatchClass: "bg-content-neutral-primary text-content-on-brand",
    usage: "text-content-neutral-primary",
    note: "Primary body text, headings on light surfaces",
  },
  {
    token: "content-neutral-secondary",
    swatchClass: "bg-content-neutral-secondary text-content-on-brand",
    usage: "text-content-neutral-secondary",
    note: "Secondary text",
  },
  {
    token: "content-neutral-tertiary",
    swatchClass: "bg-content-neutral-tertiary text-content-on-brand",
    usage: "text-content-neutral-tertiary",
  },
  {
    token: "content-neutral-muted",
    swatchClass: "bg-content-neutral-muted text-content-on-brand",
    usage: "text-content-neutral-muted",
    note: "Hints, captions",
  },
  {
    token: "content-neutral-soft",
    swatchClass: "bg-content-neutral-soft text-content-neutral-primary",
    usage: "text-content-neutral-soft",
  },
  {
    token: "content-on-brand",
    swatchClass: "bg-surface-forest text-content-on-brand",
    usage: "text-content-on-brand",
    note: "Text on brand green or primary buttons",
  },
  {
    token: "content-on-dark-section",
    swatchClass: "bg-surface-forest-deep text-content-on-dark-section",
    usage: "text-content-on-dark-section",
    note: "Light text on forest / hero bands",
  },
  {
    token: "content-link",
    swatchClass: "bg-surface-muted text-content-link",
    usage: "text-content-link",
    note: "Links, map pin accents",
  },
  {
    token: "content-positive",
    swatchClass: "bg-surface-muted text-content-positive",
    usage: "text-content-positive",
  },
  {
    token: "content-accent-coral",
    swatchClass: "bg-surface-muted text-content-accent-coral",
    usage: "text-content-accent-coral",
  },
  {
    token: "content-warning",
    swatchClass: "bg-surface-muted text-content-warning",
    usage: "text-content-warning",
  },
  {
    token: "content-negative",
    swatchClass: "bg-surface-muted text-content-negative",
    usage: "text-content-negative",
  },
  {
    token: "content-negative-strong",
    swatchClass: "bg-surface-muted text-content-negative-strong",
    usage: "text-content-negative-strong",
  },
];

export const SEMANTIC_SURFACE: SurfaceToken[] = [
  {
    token: "surface-canvas",
    swatchClass: "bg-surface-canvas border border-border-subtle text-content-neutral-primary",
    usage: "bg-surface-canvas",
    note: "Default page background",
  },
  {
    token: "surface-subtle",
    swatchClass: "bg-surface-subtle text-content-neutral-primary",
    usage: "bg-surface-subtle",
  },
  {
    token: "surface-muted",
    swatchClass: "bg-surface-muted text-content-neutral-primary",
    usage: "bg-surface-muted",
  },
  {
    token: "surface-elevated",
    swatchClass: "bg-surface-elevated text-content-neutral-primary",
    usage: "bg-surface-elevated",
  },
  {
    token: "surface-input-dim",
    swatchClass: "bg-surface-input-dim text-content-on-brand",
    usage: "bg-surface-input-dim",
    note: "Search bars, inputs on tinted strips",
  },
  {
    token: "surface-brand",
    swatchClass: "bg-surface-brand text-primary-foreground",
    usage: "bg-surface-brand",
    note: "Same hue as primary; solid brand fills",
  },
  {
    token: "surface-brand-muted",
    swatchClass: "bg-surface-brand-muted text-content-neutral-primary",
    usage: "bg-surface-brand-muted",
  },
  {
    token: "surface-brand-soft",
    swatchClass: "bg-surface-brand-soft text-content-neutral-primary",
    usage: "bg-surface-brand-soft",
  },
  {
    token: "surface-brand-tint",
    swatchClass: "bg-surface-brand-tint text-content-neutral-primary",
    usage: "bg-surface-brand-tint",
  },
  {
    token: "surface-forest",
    swatchClass: "bg-surface-forest text-content-on-brand",
    usage: "bg-surface-forest",
  },
  {
    token: "surface-forest-deep",
    swatchClass: "bg-surface-forest-deep text-content-on-brand",
    usage: "bg-surface-forest-deep",
  },
];

export const SEMANTIC_BORDERS: BorderToken[] = [
  { token: "border-subtle", boxClass: "border-4 border-border-subtle bg-surface-canvas" },
  { token: "border-muted", boxClass: "border-4 border-border-muted bg-surface-canvas" },
  { token: "border-icon", boxClass: "border-4 border-border-icon bg-surface-canvas" },
  { token: "border-strong", boxClass: "border-4 border-border-strong bg-surface-canvas" },
];

export const SHADCN_UI: ShadcnToken[] = [
  {
    token: "background",
    boxClass: "bg-background",
    textClass: "text-foreground",
  },
  {
    token: "primary",
    boxClass: "bg-primary",
    textClass: "text-primary-foreground",
  },
  {
    token: "muted",
    boxClass: "bg-muted",
    textClass: "text-muted-foreground",
  },
  {
    token: "destructive",
    boxClass: "bg-destructive",
    textClass: "text-white",
  },
  {
    token: "card",
    boxClass: "bg-card border border-border",
    textClass: "text-card-foreground",
  },
];

export const LEGACY_GRAY: LegacySwatch[] = [
  { token: "gray-neutral", bgClass: "bg-gray-neutral", labelClass: "text-white" },
  { token: "gray-50", bgClass: "bg-gray-50", labelClass: "text-content-neutral-primary" },
  { token: "gray-100", bgClass: "bg-gray-100", labelClass: "text-content-neutral-primary" },
  { token: "gray-150", bgClass: "bg-gray-150", labelClass: "text-white" },
  { token: "gray-200", bgClass: "bg-gray-200", labelClass: "text-content-neutral-primary" },
  { token: "gray-300", bgClass: "bg-gray-300", labelClass: "text-white" },
  { token: "gray-400", bgClass: "bg-gray-400", labelClass: "text-white" },
  { token: "gray-500", bgClass: "bg-gray-500", labelClass: "text-white" },
  { token: "gray-600", bgClass: "bg-gray-600", labelClass: "text-white" },
  { token: "gray-700", bgClass: "bg-gray-700", labelClass: "text-content-neutral-primary" },
  { token: "gray-800", bgClass: "bg-gray-800", labelClass: "text-white" },
  { token: "gray-900", bgClass: "bg-gray-900", labelClass: "text-white" },
];

export const LEGACY_GREEN: LegacySwatch[] = [
  { token: "green-50", bgClass: "bg-green-50", labelClass: "text-content-neutral-primary" },
  { token: "green-100", bgClass: "bg-green-100", labelClass: "text-content-neutral-primary" },
  { token: "green-200", bgClass: "bg-green-200", labelClass: "text-content-neutral-primary" },
  { token: "green-300", bgClass: "bg-green-300", labelClass: "text-content-neutral-primary" },
  { token: "green-400", bgClass: "bg-green-400", labelClass: "text-content-neutral-primary" },
  { token: "green-500", bgClass: "bg-green-500", labelClass: "text-content-neutral-primary" },
  { token: "green-600", bgClass: "bg-green-600", labelClass: "text-content-on-brand" },
  { token: "green-700", bgClass: "bg-green-700", labelClass: "text-content-on-brand" },
  { token: "green-800", bgClass: "bg-green-800", labelClass: "text-content-on-brand" },
  { token: "green-900", bgClass: "bg-green-900", labelClass: "text-content-on-brand" },
];

export const LEGACY_BRAND_MISC: LegacySwatch[] = [
  { token: "brand-dark", bgClass: "bg-brand-dark", labelClass: "text-white" },
  { token: "brand-green", bgClass: "bg-brand-green", labelClass: "text-content-neutral-primary" },
  { token: "brand-gray", bgClass: "bg-brand-gray", labelClass: "text-white" },
  { token: "coral-50", bgClass: "bg-coral-50", labelClass: "text-white" },
  { token: "red-300", bgClass: "bg-red-300", labelClass: "text-content-neutral-primary" },
  { token: "red-400", bgClass: "bg-red-400", labelClass: "text-content-neutral-primary" },
  { token: "red-500", bgClass: "bg-red-500", labelClass: "text-white" },
  { token: "yellow-400", bgClass: "bg-yellow-400", labelClass: "text-content-neutral-primary" },
];

export const USAGE_PATTERNS: UsagePattern[] = [
  {
    title: "Primary action",
    description: "Prefer shadcn Button default variant or primary + primary-foreground.",
    exampleClass: "bg-primary text-primary-foreground",
    children: "button-primary",
  },
  {
    title: "Outline / secondary",
    description: "Green outline for location-style actions (see auth flows).",
    exampleClass: "border-[#4CAF50] text-[#4CAF50]",
    children: "button-outline",
  },
  {
    title: "Inline link",
    description: "Navigation and text links on light backgrounds.",
    exampleClass: "text-content-link underline-offset-4 hover:underline",
    children: "link",
  },
  {
    title: "Search / dim input strip",
    description: "Store navbar search pattern: dim surface, on-brand placeholder.",
    exampleClass: "bg-surface-input-dim text-content-on-brand placeholder:text-white/75",
    children: "input-search",
  },
  {
    title: "Elevated card",
    description: "Cards use shadcn card tokens or surface-canvas + border.",
    exampleClass: "bg-card text-card-foreground border border-border rounded-lg",
    children: "card",
  },
  {
    title: "Forest band",
    description: "Dark green strip with light content (footer-style sections).",
    exampleClass: "bg-surface-forest text-content-on-dark-section",
    children: "forest-banner",
  },
];
