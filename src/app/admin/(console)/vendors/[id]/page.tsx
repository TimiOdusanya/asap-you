import AdminVendorDetailPage from "@/components/admin/pages/admin-vendor-detail";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AdminVendorDetailPage id={id} />;
}

