import React from "react";
import Image from "next/image";

interface VendorStatCardProps {
  label: string;
  value: string | number;
  icon: string;
  iconBg?: string;
  valueColor?: string;
}

const VendorStatCard = ({ label, value, icon, iconBg = "bg-surface-subtle", valueColor = "text-surface-brand" }: VendorStatCardProps) => {
  return (
    <div className="flex flex-col gap-3 bg-white rounded-xl p-4 sm:p-5 border border-border-muted">
      <div className="flex items-center justify-between">
        <div className={`w-8 h-8 ${iconBg} rounded-lg flex items-center justify-center`}>
          <Image src={icon} alt={label} width={16} height={16} className="w-4 h-4" />
        </div>
        <button className="text-content-neutral-muted hover:text-content-neutral-secondary cursor-pointer">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <circle cx="4" cy="10" r="1.5" />
            <circle cx="10" cy="10" r="1.5" />
            <circle cx="16" cy="10" r="1.5" />
          </svg>
        </button>
      </div>
      <span className={`text-2xl sm:text-3xl font-semibold ${valueColor}`}>{value}</span>
      <span className="text-xs sm:text-sm text-content-neutral-muted font-medium">{label}</span>
    </div>
  );
};

export default VendorStatCard;
