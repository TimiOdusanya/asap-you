"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const RiderSupport = () => {
  const [form, setForm] = useState({ orderId: "", issueType: "", description: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-6">
      <h1 className="text-xl sm:text-2xl font-semibold text-content-neutral-primary">Support Center</h1>

      <div className="bg-white rounded-xl border border-border-muted p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-content-neutral-primary">Quick Contact</h2>
          <button className="text-sm border border-border-muted rounded-lg px-3 py-1.5 text-content-neutral-secondary hover:bg-surface-muted cursor-pointer">
            See all reports
          </button>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button className="rounded-full bg-surface-brand hover:bg-surface-brand/90 px-6">Live Chat</Button>
          <Button variant="outline" className="rounded-full px-6 border-border-muted text-content-neutral-secondary">
            Email Support
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border-muted p-4 sm:p-6">
        <div className="text-center mb-6">
          <h2 className="text-lg font-semibold text-content-neutral-primary">Report an Issue</h2>
          <p className="text-sm text-content-neutral-muted mt-1">Something not right ?</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-xl mx-auto">
          <input
            placeholder="Order ID"
            value={form.orderId}
            onChange={(e) => setForm((p) => ({ ...p, orderId: e.target.value }))}
            className="w-full text-sm border border-border-muted rounded-lg px-4 py-3 outline-none focus:ring-1 focus:ring-surface-brand/30 bg-surface-subtle"
          />
          <input
            placeholder="Issue Type"
            value={form.issueType}
            onChange={(e) => setForm((p) => ({ ...p, issueType: e.target.value }))}
            className="w-full text-sm border border-border-muted rounded-lg px-4 py-3 outline-none focus:ring-1 focus:ring-surface-brand/30 bg-surface-subtle"
          />
          <textarea
            placeholder="Description"
            rows={5}
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            className="w-full text-sm border border-border-muted rounded-lg px-4 py-3 outline-none focus:ring-1 focus:ring-surface-brand/30 bg-surface-subtle resize-none"
          />
          <Button type="submit" className="rounded-full bg-surface-brand hover:bg-surface-brand/90 w-fit px-8">
            Submit Issue Report
          </Button>
        </form>
      </div>
    </div>
  );
};

export default RiderSupport;
