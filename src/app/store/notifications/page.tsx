import Link from "next/link";
import { ChevronLeft, Bell } from "lucide-react";
import { StoreNotifications } from "@/components/store/notifications/store-notifications";

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-surface-subtle pb-16 pt-6 sm:pt-10">
      <div className="mx-auto max-w-[95%] md:max-w-2xl">
        <Link
          href="/store"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-content-neutral-secondary hover:text-content-neutral-primary"
        >
          <ChevronLeft className="size-4" /> Back to store
        </Link>

        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Bell className="size-6" aria-hidden />
          </div>
          <div>
            <h1 className="font-[family-name:var(--font-manrope)] text-2xl font-bold tracking-tight text-content-neutral-primary sm:text-3xl">
              Notifications
            </h1>
            <p className="mt-1 text-sm text-content-neutral-secondary">
              Order updates, delivery alerts, and account activity.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <StoreNotifications />
        </div>
      </div>
    </div>
  );
}
