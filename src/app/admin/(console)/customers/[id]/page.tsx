import AdminCustomerDetailPage from "@/components/admin/pages/admin-customer-detail";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AdminCustomerDetailPage id={id} />;
}

