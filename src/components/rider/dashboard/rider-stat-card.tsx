import React from "react";
import { cn } from "@/lib/utils";

interface RiderStatCardProps {
  label: string;
  value: string | number;
  iconBg?: string;
  valueColor?: string;
  icon?: React.ReactNode;
  menuIcon?: boolean;
}

const RiderStatCard = ({ label, value, iconBg = "bg-blue-50", valueColor = "text-surface-brand", icon, menuIcon = true }: RiderStatCardProps) => {
  return (
    <div className="bg-white rounded-xl border border-border-muted p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", iconBg)}>
          {icon}
        </div>
        {menuIcon && (
          <button className="text-content-neutral-muted hover:text-content-neutral-secondary cursor-pointer" aria-label="More options">
            <span className="text-lg leading-none">⋯</span>
          </button>
        )}
      </div>
      <div>
        <p className={cn("text-xl sm:text-2xl font-semibold", valueColor)}>{value}</p>
        <p className="text-xs sm:text-sm text-content-neutral-muted mt-0.5">{label}</p>
      </div>
    </div>
  );
};

export default RiderStatCard;
