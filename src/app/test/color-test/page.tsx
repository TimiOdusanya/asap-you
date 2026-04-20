import type { Metadata } from "next";
import ColorTest from "@/components/color-test";

export const metadata: Metadata = {
  title: "Color reference | ASAP You",
  description:
    "Semantic tokens, legacy scales, and common UI patterns for the ASAP You design system.",
};

export default function ColorTestPage() {
  return <ColorTest />;
}
