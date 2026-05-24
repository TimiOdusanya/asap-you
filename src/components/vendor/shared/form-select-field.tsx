"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const selectTriggerCls =
  "h-10 w-full rounded-lg border border-border-muted bg-surface-subtle text-sm shadow-sm focus:ring-2 focus:ring-primary/20";

export interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectFieldProps {
  id: string;
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  hint?: string;
  className?: string;
}

export function FormSelectField({
  id,
  label,
  value,
  onValueChange,
  options,
  placeholder = "Select…",
  disabled,
  hint,
  className,
}: FormSelectFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={id}>{label}</Label>
      <Select value={value || undefined} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger id={id} className={selectTriggerCls}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hint ? <p className="text-xs text-content-neutral-muted">{hint}</p> : null}
    </div>
  );
}
