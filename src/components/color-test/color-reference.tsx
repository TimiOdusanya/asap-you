"use client";

import { LegacyScales } from "@/components/color-test/legacy-scales";
import { PatternDemo } from "@/components/color-test/pattern-demo";
import { SectionTitle } from "@/components/color-test/section-title";
import {
  SEMANTIC_BORDERS,
  SEMANTIC_CONTENT,
  SEMANTIC_SURFACE,
  SHADCN_UI,
  USAGE_PATTERNS,
} from "@/components/color-test/tokens";

export function ColorReference() {
  return (
    <div className="min-h-screen bg-surface-canvas text-content-neutral-primary">
      <div className="mx-auto max-w-5xl px-6 py-10 pb-20">
        <header className="border-b border-border-muted pb-8">
          <p className="text-xs font-medium uppercase tracking-wider text-content-neutral-muted">
            Design system
          </p>
          <h1 className="mt-2 text-3xl font-bold text-content-neutral-primary">
            ASAP You — colors & patterns
          </h1>
          <p className="mt-3 max-w-2xl text-base text-content-neutral-secondary">
            Single source of truth:{" "}
            <code className="rounded bg-surface-muted px-1.5 py-0.5 font-mono text-sm text-content-neutral-primary">
              src/app/globals.css
            </code>{" "}
            (<span className="font-mono text-sm">:root</span> and{" "}
            <span className="font-mono text-sm">@theme inline</span>). Prefer{" "}
            <strong className="font-semibold text-content-neutral-primary">
              semantic
            </strong>{" "}
            utilities for new UI; legacy <span className="font-mono text-sm">gray-*</span> /{" "}
            <span className="font-mono text-sm">green-*</span> remain for older screens.
          </p>
          <nav
            className="mt-6 flex flex-wrap gap-2 text-sm"
            aria-label="On this page"
          >
            <a
              href="#semantic-content"
              className="rounded-full bg-surface-subtle px-3 py-1 text-content-link hover:bg-surface-muted"
            >
              Content
            </a>
            <a
              href="#semantic-surface"
              className="rounded-full bg-surface-subtle px-3 py-1 text-content-link hover:bg-surface-muted"
            >
              Surfaces
            </a>
            <a
              href="#borders"
              className="rounded-full bg-surface-subtle px-3 py-1 text-content-link hover:bg-surface-muted"
            >
              Borders
            </a>
            <a
              href="#shadcn"
              className="rounded-full bg-surface-subtle px-3 py-1 text-content-link hover:bg-surface-muted"
            >
              Shadcn
            </a>
            <a
              href="#patterns"
              className="rounded-full bg-surface-subtle px-3 py-1 text-content-link hover:bg-surface-muted"
            >
              Patterns
            </a>
            <a
              href="#typography"
              className="rounded-full bg-surface-subtle px-3 py-1 text-content-link hover:bg-surface-muted"
            >
              Typography
            </a>
            <a
              href="#legacy"
              className="rounded-full bg-surface-subtle px-3 py-1 text-content-link hover:bg-surface-muted"
            >
              Legacy scales
            </a>
            <a
              href="#dark-preview"
              className="rounded-full bg-surface-subtle px-3 py-1 text-content-link hover:bg-surface-muted"
            >
              Dark preview
            </a>
          </nav>
        </header>

        <section className="mt-12 space-y-4" aria-labelledby="semantic-content">
          <SectionTitle
            id="semantic-content"
            title="Semantic — content"
            description="Text and icons on default surfaces. Utilities: text-{token}, and bg-{token} only where the token is used as a fill (e.g. chips)."
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {SEMANTIC_CONTENT.map((row) => (
              <div
                key={row.token}
                className={`rounded-xl p-4 ${row.swatchClass}`}
              >
                <div className="font-mono text-sm font-semibold">{row.token}</div>
                <div className="mt-1 font-mono text-xs opacity-90">{row.usage}</div>
                {row.note ? (
                  <p className="mt-2 text-xs opacity-90">{row.note}</p>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 space-y-4" aria-labelledby="semantic-surface">
          <SectionTitle
            id="semantic-surface"
            title="Semantic — surfaces"
            description="Background layers from canvas through brand and forest ramps."
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {SEMANTIC_SURFACE.map((row) => (
              <div
                key={row.token}
                className={`rounded-xl p-4 ${row.swatchClass}`}
              >
                <div className="font-mono text-sm font-semibold">{row.token}</div>
                <div className="mt-1 font-mono text-xs opacity-90">{row.usage}</div>
                {row.note ? (
                  <p className="mt-2 text-xs opacity-90">{row.note}</p>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 space-y-4" aria-labelledby="borders">
          <SectionTitle
            id="borders"
            title="Semantic — borders"
            description="Use border-{token} with a width utility (e.g. border, border-2)."
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {SEMANTIC_BORDERS.map((row) => (
              <div
                key={row.token}
                className={`rounded-xl p-6 ${row.boxClass}`}
              >
                <div className="font-mono text-sm font-semibold text-content-neutral-primary">
                  {row.token}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 space-y-4" aria-labelledby="shadcn">
          <SectionTitle
            id="shadcn"
            title="Shadcn / Radix primitives"
            description="Components under src/components/ui map to these tokens (Button, Card, Dialog, etc.)."
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {SHADCN_UI.map((row) => (
              <div
                key={row.token}
                className={`rounded-xl p-4 ${row.boxClass} ${row.textClass}`}
              >
                <div className="font-mono text-sm font-semibold">{row.token}</div>
                <div className="mt-1 font-mono text-xs opacity-90">
                  {row.boxClass.split(" ").filter((c) => c.startsWith("bg-")).join(" ")}{" "}
                  + {row.textClass}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 space-y-4" aria-labelledby="patterns">
          <SectionTitle
            id="patterns"
            title="Common UI patterns"
            description="Concrete examples aligned with current store and auth screens."
          />
          <div className="grid gap-6 md:grid-cols-2">
            {USAGE_PATTERNS.map((pattern) => (
              <div
                key={pattern.title}
                className="rounded-xl border border-border-muted bg-surface-subtle p-5"
              >
                <h3 className="font-semibold text-content-neutral-primary">
                  {pattern.title}
                </h3>
                <p className="mt-1 text-sm text-content-neutral-secondary">
                  {pattern.description}
                </p>
                <code className="mt-3 block rounded-lg bg-surface-muted px-3 py-2 font-mono text-xs text-content-neutral-primary">
                  {pattern.exampleClass}
                </code>
                <div className="mt-4 rounded-lg border border-dashed border-border-subtle bg-surface-canvas p-4">
                  <PatternDemo pattern={pattern} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 space-y-4" aria-labelledby="typography">
          <SectionTitle
            id="typography"
            title="Typography"
            description="Body UI uses the theme sans stack (Sora). Headings (h1–h6) use Manrope via global CSS in globals.css."
          />
          <div className="rounded-xl border border-border-muted bg-surface-subtle p-6">
            <p className="font-sans text-base text-content-neutral-primary">
              Body — font-sans (Sora): The quick brown fox jumps over the lazy dog.
            </p>
            <h2 className="mt-4 text-2xl font-semibold text-content-neutral-primary">
              Heading — Manrope via element styles
            </h2>
            <p className="mt-2 text-sm text-content-neutral-muted">
              Radius tokens: rounded-sm/md/lg/xl map to --radius in @theme inline.
            </p>
          </div>
        </section>

        <section className="mt-14 space-y-4" aria-labelledby="legacy">
          <SectionTitle
            id="legacy"
            title="Legacy numeric scales"
            description="These class names are not standard Tailwind gray numbering. Prefer semantic tokens for new work. Safe to reference when touching older components."
          />
          <LegacyScales />
        </section>

        <section className="mt-14 space-y-4" aria-labelledby="dark-preview">
          <SectionTitle
            id="dark-preview"
            title="Dark theme (preview)"
            description="A subtree with class dark uses variables from .dark in globals.css. Semantic content/surface tokens adapt; check contrast when adding new screens."
          />
          <div className="dark rounded-xl border border-border bg-background p-6 text-foreground">
            <p className="text-content-neutral-primary">
              Dark: content-neutral-primary on background
            </p>
            <p className="mt-2 text-content-neutral-secondary">
              Secondary line
            </p>
            <div className="mt-4 rounded-lg bg-primary px-3 py-2 text-primary-foreground">
              primary / primary-foreground
            </div>
            <div className="mt-2 rounded-lg bg-surface-subtle p-3 text-content-neutral-primary">
              surface-subtle in dark context
            </div>
          </div>
        </section>

        <footer className="mt-16 border-t border-border-muted pt-8 text-sm text-content-neutral-muted">
          <p>
            Sonner toasts reference{" "}
            <code className="rounded bg-surface-muted px-1 font-mono text-xs">
              var(--surface-neutral-normal)
            </code>{" "}
            and{" "}
            <code className="rounded bg-surface-muted px-1 font-mono text-xs">
              var(--border-divider-normal)
            </code>{" "}
            (see{" "}
            <code className="font-mono text-xs">src/components/ui/sonner.tsx</code>
            ).
          </p>
        </footer>
      </div>
    </div>
  );
}
