"use client";

import React, { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { FunnelIcon } from "@phosphor-icons/react";
import RiderStatCard from "./rider-stat-card";
import RiderPagination from "./rider-pagination";

const barData = [
  { day: "Mon", amount: 80000 }, { day: "Tue", amount: 95000 }, { day: "Wed", amount: 100000 },
  { day: "Thu", amount: 75000 }, { day: "Fri", amount: 40000 }, { day: "Sat", amount: 0 },
  { day: "Sun", amount: 60000 },
];

const pieData = [
  { name: "Base pay", value: 50 },
  { name: "Bonus", value: 25 },
  { name: "Tips", value: 25 },
];

const PIE_COLORS = ["#4caf50", "#e83a3a", "#e8a020"];

const transactions = Array.from({ length: 6 }, (_, i) => ({
  orderId: "DEL001",
  date: i % 2 === 0 ? "02/10/25" : "01/10/25",
  amount: i % 2 === 0 ? 2500 : 2000,
  status: i % 3 === 1 ? "Processing" : "Paid",
}));

const RiderEarnings = () => {
  const [page, setPage] = useState(1);
  const [metric, setMetric] = useState("Metric");
  const [period, setPeriod] = useState("Today");

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-6">
      <h1 className="text-xl sm:text-2xl font-semibold text-content-neutral-primary">Earnings</h1>

      <div className="bg-white rounded-xl border border-border-muted p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-content-neutral-primary">Earning Dashboard</h2>
          <button className="text-xs text-surface-brand hover:underline cursor-pointer">See all reports</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <RiderStatCard label="Today's Earnings" value="₦50,000" iconBg="bg-blue-50" valueColor="text-content-neutral-primary" menuIcon
            icon={<span className="text-xs font-bold text-blue-500">N</span>} />
          <RiderStatCard label="Weekly Earnings" value="₦250,000" iconBg="bg-yellow-50" valueColor="text-yellow-500" menuIcon
            icon={<span className="text-xs font-bold text-yellow-500">N</span>} />
          <RiderStatCard label="Total Earnings" value="₦1,000,000" iconBg="bg-green-50" valueColor="text-surface-brand" menuIcon
            icon={<span className="text-xs font-bold text-surface-brand">N</span>} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3">
          {[{ label: "Today's Earnings", value: "₦50,000", trend: "+12% From yesterday", iconBg: "bg-blue-50" },
            { label: "Weekly Earnings", value: "₦250,000", trend: "+8% From last week", iconBg: "bg-yellow-50" }].map(({ label, trend }) => (
            <div key={label} className="rounded-xl border border-border-muted p-3 flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-surface-brand bg-surface-brand-soft rounded-full px-1.5 py-0.5">+12%</span>
                <span className="text-xs text-content-neutral-muted">{trend.split(" ").slice(1).join(" ")}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl border border-border-muted p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-content-neutral-primary">Earning Trends</h2>
            <div className="flex items-center gap-2">
              <select value={metric} onChange={(e) => setMetric(e.target.value)}
                className="text-xs border border-border-muted rounded-lg px-2 py-1 bg-white outline-none cursor-pointer">
                <option>Metric</option><option>Amount</option>
              </select>
              <select value={period} onChange={(e) => setPeriod(e.target.value)}
                className="text-xs border border-border-muted rounded-lg px-2 py-1 bg-white outline-none cursor-pointer">
                <option>Today</option><option>This Week</option><option>This Month</option>
              </select>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#8e8c8c" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#8e8c8c" }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(v) => [`₦${Number(v).toLocaleString()}`, "Amount"]} />
              <Bar dataKey="amount" fill="#4caf50" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-border-muted p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-content-neutral-primary">Earning Trends</h2>
            <div className="flex items-center gap-2">
              <select className="text-xs border border-border-muted rounded-lg px-2 py-1 bg-white outline-none cursor-pointer">
                <option>Metric</option>
              </select>
              <select className="text-xs border border-border-muted rounded-lg px-2 py-1 bg-white outline-none cursor-pointer">
                <option>Today</option>
              </select>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={2} dataKey="value">
                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Legend iconType="circle" iconSize={8} formatter={(v, e) => (
                <span className="text-xs text-content-neutral-secondary">{v} <b>{(e.payload as { value: number }).value}%</b></span>
              )} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border-muted overflow-hidden">
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border-muted">
          <h2 className="text-base font-semibold text-content-neutral-primary">Recent Transactions</h2>
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border-muted rounded-lg text-sm text-content-neutral-secondary hover:bg-surface-muted cursor-pointer">
            <FunnelIcon className="size-4" /> Filter
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[480px]">
            <thead>
              <tr className="border-b border-border-muted">
                {["", "Order Id", "Date", "Amount", "Status"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-content-neutral-muted">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, i) => (
                <tr key={i} className="border-b border-border-muted/50 hover:bg-surface-subtle">
                  <td className="px-4 py-3"><input type="checkbox" className="rounded" /></td>
                  <td className="px-4 py-3 text-content-neutral-primary">{t.orderId}</td>
                  <td className="px-4 py-3 text-content-neutral-secondary">{t.date}</td>
                  <td className="px-4 py-3 text-content-neutral-primary">₦ {t.amount.toLocaleString()}</td>
                  <td className={`px-4 py-3 font-medium ${t.status === "Paid" ? "text-surface-brand" : "text-yellow-500"}`}>{t.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <RiderPagination currentPage={page} totalPages={30} onPageChange={setPage} />
      </div>
    </div>
  );
};

export default RiderEarnings;
