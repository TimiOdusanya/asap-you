export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="[&_[data-slot=button]]:!text-sm [&_[data-slot=button]]:!leading-snug">
      {children}
    </div>
  );
}

