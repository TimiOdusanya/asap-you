import { VendorOrders } from "@/components/vendor/dashboard/vendor-orders";

export default function VendorOrdersPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-xl font-semibold text-content-neutral-primary sm:text-2xl">Orders</h1>
      <p className="mt-1 text-sm text-content-neutral-secondary">
        Manage incoming orders and coordinate deliveries.
      </p>
      <div className="mt-6">
        <VendorOrders />
      </div>
    </div>
  );
}
