"use client";

import React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { AdminBadge } from "@/components/admin/admin-badge";
import { AdminActionPanel } from "@/components/admin/admin-action-panel";
import { AdminKvGrid } from "@/components/admin/admin-kv";
import { AdminSectionCard } from "@/components/admin/admin-section-card";
import { AdminTable, AdminTd, AdminTh } from "@/components/admin/admin-table";
import { mockVendors } from "@/components/admin/mock-admin-data";
import { GavelIcon } from "@phosphor-icons/react";

const mockVendorProducts = [
  { id: "p1", name: "Organic Bananas", status: "active", rating: 4.7, price: 5000 },
  { id: "p2", name: "Whole Wheat Bread", status: "active", rating: 4.3, price: 2500 },
  { id: "p3", name: "Fresh Milk 1L", status: "inactive", rating: 3.9, price: 1800 },
];

export default function AdminVendorDetailPage({ id }: { id: string }) {
  const vendor = mockVendors.find((v) => v.id === id) ?? null;

  if (!vendor) {
    return (
      <AdminPageShell title="Vendor" subtitle="Vendor not found.">
        <EmptyState
          title="Vendor not found"
          description="This vendor ID doesn’t exist in the current mock dataset. Once endpoints are connected, this will look up the real record."
          action={{ label: "Back to vendors", href: "/admin/vendors" }}
        />
      </AdminPageShell>
    );
  }

  return (
    <AdminPageShell
      title={vendor.businessName}
      subtitle="Full vendor profile, onboarding details, documents, and products."
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <AdminActionPanel
            backHref="/admin/vendors"
            status={vendor.status}
            verificationStatus={vendor.verificationStatus}
            actionsLabel="Vendor actions"
          />
        </div>

        <div className="flex flex-col gap-4 lg:col-span-8">
          <AdminSectionCard
            title="Profile"
            subtitle="Owner and vendor summary."
            right={<AdminBadge variant="neutral">{vendor.productsCount} products</AdminBadge>}
          >
            <AdminKvGrid
              columns={2}
              items={[
                { label: "Business name", value: vendor.businessName },
                { label: "Category", value: vendor.onboarding.business.category },
                { label: "Owner", value: vendor.ownerName },
                { label: "Owner email", value: vendor.onboarding.owner.email },
                { label: "Contact email", value: vendor.onboarding.business.contactEmail },
                { label: "Phone", value: vendor.onboarding.business.phone },
                { label: "Created", value: vendor.createdAt },
                { label: "Submitted", value: vendor.submittedAt ?? "—" },
              ]}
            />
          </AdminSectionCard>

          <AdminSectionCard title="Business address" subtitle="Captured during onboarding.">
            <AdminKvGrid
              columns={2}
              items={[
                { label: "Address", value: vendor.onboarding.business.address.addressLine1 },
                { label: "City", value: vendor.onboarding.business.address.city },
                { label: "State", value: vendor.onboarding.business.address.state },
                { label: "Country", value: vendor.onboarding.business.address.country },
                { label: "Postal code", value: vendor.onboarding.business.address.postalCode ?? "—" },
                {
                  label: "Registered business",
                  value: vendor.onboarding.business.isBusinessRegistered ? "Yes" : "No",
                },
              ]}
            />
          </AdminSectionCard>

          <AdminSectionCard
            title="Documents & payouts"
            subtitle="Verification files and bank payout details."
          >
            <AdminKvGrid
              columns={2}
              items={[
                { label: "Business size", value: vendor.onboarding.verification.businessSize },
                { label: "Bank name", value: vendor.onboarding.verification.bankAccount.bankName },
                { label: "Account number", value: vendor.onboarding.verification.bankAccount.accountNumber },
                { label: "Account holder", value: vendor.onboarding.verification.bankAccount.accountHolderName },
                {
                  label: "Logo",
                  value: vendor.onboarding.verification.logoUrl ? (
                    <a className="text-surface-brand hover:underline" href={vendor.onboarding.verification.logoUrl}>
                      View
                    </a>
                  ) : (
                    "—"
                  ),
                },
                {
                  label: "Registration certificate",
                  value: vendor.onboarding.verification.registrationCertificateUrl ? (
                    <a className="text-surface-brand hover:underline" href={vendor.onboarding.verification.registrationCertificateUrl}>
                      View
                    </a>
                  ) : (
                    "—"
                  ),
                },
              ]}
            />
          </AdminSectionCard>

          <AdminSectionCard title="Operating hours" subtitle="Weekly schedule from onboarding.">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {vendor.onboarding.operatingHours.map((h) => (
                <div key={h.day} className="rounded-xl border border-border-muted bg-surface-canvas px-4 py-3">
                  <p className="text-xs font-medium text-content-neutral-muted">Day {h.day}</p>
                  <p className="mt-1 text-sm text-content-neutral-primary">
                    {h.isClosed ? "Closed" : `${h.open} — ${h.close}`}
                  </p>
                </div>
              ))}
            </div>
          </AdminSectionCard>

          <AdminSectionCard
            title="Products"
            subtitle="Vendor products and ratings."
            right={<AdminBadge variant="neutral">{mockVendorProducts.length} items</AdminBadge>}
          >
            <AdminTable>
              <thead>
                <tr className="border-b border-border-muted">
                  <AdminTh>Product</AdminTh>
                  <AdminTh>Status</AdminTh>
                  <AdminTh>Rating</AdminTh>
                  <AdminTh>Price</AdminTh>
                  <AdminTh className="text-right">Actions</AdminTh>
                </tr>
              </thead>
              <tbody>
                {mockVendorProducts.map((p) => (
                  <tr key={p.id} className="border-b border-border-muted/50 hover:bg-surface-subtle">
                    <AdminTd className="text-content-neutral-primary">{p.name}</AdminTd>
                    <AdminTd>
                      <AdminBadge variant={p.status === "active" ? "success" : "neutral"}>
                        {p.status}
                      </AdminBadge>
                    </AdminTd>
                    <AdminTd className="text-content-neutral-primary">{p.rating.toFixed(1)}/5</AdminTd>
                    <AdminTd className="text-content-neutral-primary">₦{p.price.toLocaleString()}</AdminTd>
                    <AdminTd className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 rounded-full border-border-muted gap-1.5"
                        onClick={() => toast.info("Product moderation will be wired once endpoints are connected.")}
                      >
                        <GavelIcon className="size-4" aria-hidden />
                        Moderate
                      </Button>
                    </AdminTd>
                  </tr>
                ))}
              </tbody>
            </AdminTable>
          </AdminSectionCard>
        </div>
      </div>
    </AdminPageShell>
  );
}

