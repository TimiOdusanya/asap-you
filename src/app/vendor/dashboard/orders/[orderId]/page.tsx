import { VendorOrderDetail } from "@/components/vendor/dashboard/vendor-order-detail";

export default async function VendorOrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <VendorOrderDetail orderId={orderId} />
    </div>
  );
}
