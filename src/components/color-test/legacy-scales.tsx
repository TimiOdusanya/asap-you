import {
  LEGACY_BRAND_MISC,
  LEGACY_GRAY,
  LEGACY_GREEN,
} from "@/components/color-test/tokens";

export function LegacyScales() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-2 text-sm font-medium text-content-neutral-secondary">
          gray-*
        </h3>
        <div className="flex flex-wrap gap-2">
          {LEGACY_GRAY.map((row) => (
            <div
              key={row.token}
              className={`flex h-14 min-w-[4.5rem] flex-col items-center justify-center rounded-lg px-2 ${row.bgClass} ${row.labelClass}`}
            >
              <span className="font-mono text-[10px] font-semibold leading-tight">
                {row.token.replace("gray-", "")}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-2 font-mono text-xs text-content-neutral-muted">
          {LEGACY_GRAY.map((r) => r.token).join(" · ")}
        </p>
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium text-content-neutral-secondary">
          green-*
        </h3>
        <div className="flex flex-wrap gap-2">
          {LEGACY_GREEN.map((row) => (
            <div
              key={row.token}
              className={`flex h-14 min-w-[4.5rem] flex-col items-center justify-center rounded-lg px-2 ${row.bgClass} ${row.labelClass}`}
            >
              <span className="font-mono text-[10px] font-semibold leading-tight">
                {row.token.replace("green-", "")}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium text-content-neutral-secondary">
          Brand & accents
        </h3>
        <div className="flex flex-wrap gap-2">
          {LEGACY_BRAND_MISC.map((row) => (
            <div
              key={row.token}
              className={`flex h-14 min-w-[5rem] flex-col items-center justify-center rounded-lg px-2 ${row.bgClass} ${row.labelClass}`}
            >
              <span className="font-mono text-[10px] font-semibold leading-tight">
                {row.token}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
