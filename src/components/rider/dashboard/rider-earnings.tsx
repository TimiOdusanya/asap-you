"use client";

import React, { useMemo, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import RiderStatCard from "./rider-stat-card";
import RiderPagination from "./rider-pagination";
import {
  fetchRiderDeliveries,
  fetchRiderProfile,
  riderDeliveriesQueryKey,
  riderProfileQueryKey,
} from "@/services/rider/rider-deliveries.api";
import {
  formatRiderMoney,
  riderEarningFromOrder,
  startOfDay,
  startOfWeek,
  sumDeliveredEarnings,
  weeklyEarningsChartData,
} from "@/lib/rider-order-utils";

const PAGE_SIZE = 10;

const RiderEarnings = () => {
  const [page, setPage] = useState(1);

  const { data: profileRes, isPending: profileLoading } = useQuery({
    queryKey: riderProfileQueryKey,
    queryFn: fetchRiderProfile,
  });

  const { data: deliveredRes, isPending: listLoading } = useQuery({
    queryKey: riderDeliveriesQueryKey(page, PAGE_SIZE, "delivered"),
    queryFn: () => fetchRiderDeliveries(page, PAGE_SIZE, "delivered"),
  });

  const { data: chartRes } = useQuery({
    queryKey: riderDeliveriesQueryKey(1, 100, "delivered"),
    queryFn: () => fetchRiderDeliveries(1, 100, "delivered"),
  });

  const stats = profileRes?.data?.stats;
  const deliveredOrders = chartRes?.data ?? [];
  const transactions = deliveredRes?.data ?? [];
  const totalPages = deliveredRes?.pagination?.totalPages ?? 1;

  const todayEarnings = sumDeliveredEarnings(deliveredOrders, startOfDay(new Date()));
  const weekEarnings = sumDeliveredEarnings(deliveredOrders, startOfWeek(new Date()));
  const barData = useMemo(() => weeklyEarningsChartData(deliveredOrders), [deliveredOrders]);

  const pieData = useMemo(() => {
    const deliveryFees = deliveredOrders.reduce((s, o) => s + riderEarningFromOrder(o), 0);
    return [{ name: "Delivery fees", value: deliveryFees || 1 }];
  }, [deliveredOrders]);

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-6">
      <h1 className="text-xl sm:text-2xl font-semibold text-content-neutral-primary">Earnings</h1>

      <div className="bg-white rounded-xl border border-border-muted p-4 sm:p-5">
        <h2 className="text-base font-semibold text-content-neutral-primary mb-4">Earning overview</h2>
        {profileLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="size-6 animate-spin text-surface-brand" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <RiderStatCard
              label="Today's Earnings"
              value={formatRiderMoney(todayEarnings)}
              iconBg="bg-blue-50"
              valueColor="text-content-neutral-primary"
              menuIcon
              icon={<span className="text-xs font-bold text-blue-500">N</span>}
            />
            <RiderStatCard
              label="Weekly Earnings"
              value={formatRiderMoney(weekEarnings)}
              iconBg="bg-yellow-50"
              valueColor="text-yellow-500"
              menuIcon
              icon={<span className="text-xs font-bold text-yellow-500">N</span>}
            />
            <RiderStatCard
              label="Total Earnings"
              value={formatRiderMoney(stats?.totalEarnings ?? 0)}
              iconBg="bg-green-50"
              valueColor="text-surface-brand"
              menuIcon
              icon={<span className="text-xs font-bold text-surface-brand">N</span>}
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl border border-border-muted p-4 sm:p-5">
          <h2 className="text-base font-semibold text-content-neutral-primary mb-4">This week</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#8e8c8c" }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 10, fill: "#8e8c8c" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `₦${(Number(v) / 1000).toFixed(0)}K`}
              />
              <Tooltip formatter={(v) => [`₦${Number(v).toLocaleString("en-NG")}`, "Amount"]} />
              <Bar dataKey="amount" fill="#4caf50" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-border-muted p-4 sm:p-5">
          <h2 className="text-base font-semibold text-content-neutral-primary mb-4">Breakdown</h2>
          <ul className="space-y-3">
            {pieData.map((item) => (
              <li key={item.name} className="flex items-center justify-between text-sm">
                <span className="text-content-neutral-secondary">{item.name}</span>
                <span className="font-semibold text-content-neutral-primary">
                  {formatRiderMoney(item.value)}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-content-neutral-muted">
            Earnings are based on delivery fees from completed orders.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border-muted overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-border-muted">
          <h2 className="text-base font-semibold text-content-neutral-primary">Recent transactions</h2>
        </div>
        {listLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="size-6 animate-spin text-surface-brand" />
          </div>
        ) : transactions.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-content-neutral-muted">No completed deliveries yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[480px]">
              <thead>
                <tr className="border-b border-border-muted">
                  {["Order Id", "Date", "Amount", "Status"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-medium text-content-neutral-muted">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transactions.map((order) => (
                  <tr key={order._id} className="border-b border-border-muted/50 hover:bg-surface-subtle">
                    <td className="px-4 py-3 text-content-neutral-primary">{order.orderId}</td>
                    <td className="px-4 py-3 text-content-neutral-secondary">
                      {new Date(order.updatedAt).toLocaleDateString("en-NG")}
                    </td>
                    <td className="px-4 py-3 text-content-neutral-primary">
                      {formatRiderMoney(riderEarningFromOrder(order))}
                    </td>
                    <td className="px-4 py-3 font-medium text-surface-brand capitalize">
                      {order.status.replace(/_/g, " ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <RiderPagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
};

export default RiderEarnings;
