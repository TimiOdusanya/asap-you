"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { EmptyState } from "@/components/ui/empty-state";
import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { AdminBadge } from "@/components/admin/admin-badge";
import { AdminActionPanel } from "@/components/admin/admin-action-panel";
import { AdminKvGrid } from "@/components/admin/admin-kv";
import { AdminSectionCard } from "@/components/admin/admin-section-card";
import { AdminTable, AdminTd, AdminTh } from "@/components/admin/admin-table";
import { AdminDetailSkeleton } from "@/components/admin/admin-page-skeletons";
import { adminVendorQueryKey, fetchAdminVendor } from "@/services/admin/admin.api";
import {
  displayName,
  entityIdString,
  formatAdminDate,
  userStatus,
  vendorVerificationStatus,
} from "@/lib/admin-mappers";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function AdminVendorDetailPage({ id }: { id: string }) {
  const { data, isPending, isError } = useQuery({
    queryKey: adminVendorQueryKey(id),
    queryFn: () => fetchAdminVendor(id),
  });

  if (isPending) {
    return (
      <AdminPageShell title="Vendor" subtitle="Loading vendor profile…">
        <AdminDetailSkeleton />
      </AdminPageShell>
    );
  }

  const vendor = data?.data.vendor;
  if (isError || !vendor) {
    return (
      <AdminPageShell title="Vendor" subtitle="Vendor not found.">
        <EmptyState
          title="Vendor not found"
          description="This vendor ID does not exist or could not be loaded."
          action={{ label: "Back to vendors", href: "/admin/vendors" }}
        />
      </AdminPageShell>
    );
  }

  const user = data.data.user;
  const products = data.data.products ?? [];
  const vendorId = entityIdString(vendor);
  const verification = vendorVerificationStatus(vendor);
  const status = userStatus(vendor.isActive);
  const userId = String(vendor.userId);
  const operatingHours = vendor.settings?.operatingHours ?? [];
  const documents = vendor.verification?.documents ?? [];
  const logoDoc = documents.find((d) => d.type === "business_registration") ?? documents[0];

  return (
    <AdminPageShell
      title={vendor.businessName}
      subtitle="Full vendor profile, onboarding details, documents, and products."
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <AdminActionPanel
            backHref="/admin/vendors"
            status={status}
            verificationStatus={verification}
            actionsLabel="Vendor actions"
            userId={userId}
            vendorId={vendorId}
          />
        </div>

        <div className="flex flex-col gap-4 lg:col-span-8">
          <AdminSectionCard
            title="Profile"
            subtitle="Owner and vendor summary."
            right={<AdminBadge variant="neutral">{data.data.productCount} products</AdminBadge>}
          >
            <AdminKvGrid
              columns={2}
              items={[
                { label: "Business name", value: vendor.businessName },
                { label: "Category", value: vendor.category },
                { label: "Owner", value: displayName({ profile: user?.profile }) },
                { label: "Owner email", value: user?.email ?? "—" },
                { label: "Contact email", value: vendor.businessInfo?.contactEmail ?? "—" },
                { label: "Phone", value: vendor.businessInfo?.contactPhone ?? user?.phone ?? "—" },
                { label: "Created", value: formatAdminDate(vendor.createdAt) },
                {
                  label: "Verified",
                  value: vendor.verification?.isVerified ? "Yes" : "No",
                },
              ]}
            />
          </AdminSectionCard>

          <AdminSectionCard title="Business address" subtitle="Captured during onboarding.">
            <AdminKvGrid
              columns={2}
              items={[
                { label: "Address", value: vendor.address?.addressLine1 ?? "—" },
                { label: "City", value: vendor.address?.city ?? "—" },
                { label: "State", value: vendor.address?.state ?? "—" },
                { label: "Country", value: vendor.address?.country ?? "—" },
                { label: "Postal code", value: vendor.address?.postalCode ?? "—" },
                {
                  label: "Registered business",
                  value: vendor.isBusinessRegistered ? "Yes" : "No",
                },
              ]}
            />
          </AdminSectionCard>

          <AdminSectionCard title="Documents & payouts" subtitle="Verification files and bank payout details.">
            <AdminKvGrid
              columns={2}
              items={[
                { label: "Business size", value: vendor.businessSize ?? "—" },
                { label: "Bank name", value: vendor.bankAccount?.bankName ?? "—" },
                { label: "Account number", value: vendor.bankAccount?.accountNumber ?? "—" },
                { label: "Account holder", value: vendor.bankAccount?.accountHolderName ?? "—" },
                {
                  label: "Logo",
                  value: vendor.logo ? (
                    <a className="text-surface-brand hover:underline" href={vendor.logo} target="_blank" rel="noreferrer">
                      View
                    </a>
                  ) : (
                    "—"
                  ),
                },
                {
                  label: "Registration document",
                  value: logoDoc?.url ? (
                    <a className="text-surface-brand hover:underline" href={logoDoc.url} target="_blank" rel="noreferrer">
                      View ({logoDoc.status})
                    </a>
                  ) : (
                    "—"
                  ),
                },
              ]}
            />
          </AdminSectionCard>

          {operatingHours.length > 0 ? (
            <AdminSectionCard title="Operating hours" subtitle="Weekly schedule from onboarding.">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {operatingHours.map((h) => (
                  <div key={h.day} className="rounded-xl border border-border-muted bg-surface-canvas px-4 py-3">
                    <p className="text-xs font-medium text-content-neutral-muted">
                      {DAY_NAMES[h.day] ?? `Day ${h.day}`}
                    </p>
                    <p className="mt-1 text-sm text-content-neutral-primary">
                      {h.isClosed ? "Closed" : `${h.open} — ${h.close}`}
                    </p>
                  </div>
                ))}
              </div>
            </AdminSectionCard>
          ) : null}

          <AdminSectionCard
            title="Products"
            subtitle="Vendor products and ratings."
            right={<AdminBadge variant="neutral">{products.length} items</AdminBadge>}
          >
            {products.length === 0 ? (
              <EmptyState size="sm" title="No products" description="This vendor has not added products yet." />
            ) : (
              <AdminTable>
                <thead>
                  <tr className="border-b border-border-muted">
                    <AdminTh>Product</AdminTh>
                    <AdminTh>Status</AdminTh>
                    <AdminTh>Rating</AdminTh>
                    <AdminTh>Price</AdminTh>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={String(p._id)} className="border-b border-border-muted/50 hover:bg-surface-subtle">
                      <AdminTd className="text-content-neutral-primary">{p.name}</AdminTd>
                      <AdminTd>
                        <AdminBadge variant={p.isActive ? "success" : "neutral"}>
                          {p.isActive ? "active" : "inactive"}
                        </AdminBadge>
                      </AdminTd>
                      <AdminTd className="text-content-neutral-primary">
                        {p.stats?.averageRating ? `${p.stats.averageRating.toFixed(1)}/5` : "—"}
                      </AdminTd>
                      <AdminTd className="text-content-neutral-primary">₦{p.price.toLocaleString()}</AdminTd>
                    </tr>
                  ))}
                </tbody>
              </AdminTable>
            )}
          </AdminSectionCard>
        </div>
      </div>
    </AdminPageShell>
  );
}
