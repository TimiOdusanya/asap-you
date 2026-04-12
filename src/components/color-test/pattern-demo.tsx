import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { UsagePattern } from "@/components/color-test/tokens";

export function PatternDemo({ pattern }: { pattern: UsagePattern }) {
  switch (pattern.children) {
    case "button-primary":
      return (
        <Button type="button" className="rounded-full">
          Continue
        </Button>
      );
    case "button-outline":
      return (
        <Button
          type="button"
          variant="outline"
          className="h-12 rounded-full border-[#4CAF50] text-[#4CAF50] hover:bg-[#4CAF50]/10"
          style={{ color: "#4CAF50", borderColor: "#4CAF50" }}
        >
          Use current location
        </Button>
      );
    case "link":
      return (
        <Link
          href="#semantic-content"
          className="text-content-link underline-offset-4 hover:underline"
        >
          Example link
        </Link>
      );
    case "input-search":
      return (
        <Input
          type="text"
          placeholder="Search Asap you"
          readOnly
          className="w-full max-w-sm rounded-sm border-none bg-surface-input-dim py-6 text-base text-content-on-brand placeholder:text-white/75"
        />
      );
    case "card":
      return (
        <div className="rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm">
          <p className="font-medium">Card title</p>
          <p className="mt-1 text-sm text-muted-foreground">Supporting text uses muted.</p>
        </div>
      );
    case "forest-banner":
      return (
        <div className="rounded-lg bg-surface-forest px-4 py-3 text-sm text-content-on-dark-section">
          Dark green band with on-dark-section text.
        </div>
      );
    default:
      return null;
  }
}
