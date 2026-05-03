import AdminRiderDetailPage from "@/components/admin/pages/admin-rider-detail";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AdminRiderDetailPage id={id} />;
}

