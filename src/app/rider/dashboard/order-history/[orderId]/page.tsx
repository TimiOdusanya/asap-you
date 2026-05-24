import { RiderOrderDetail } from "@/components/rider/dashboard/rider-order-detail";

interface PageProps {
  params: Promise<{ orderId: string }>;
}

export default async function RiderOrderDetailPage({ params }: PageProps) {
  const { orderId } = await params;

  return (
    <div className="p-4 sm:p-6">
      <RiderOrderDetail orderId={orderId} />
    </div>
  );
}
