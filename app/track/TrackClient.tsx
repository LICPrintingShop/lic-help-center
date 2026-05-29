"use client";

import { useEffect, useState } from "react";
import { ORDER_STAGES } from "@/lib/stages";
import type { OrderStage } from "@/lib/stages";

type OrderResult = {
  orderId: string;
  tin: string;
  taxType: string;
  entityType: string;
  tradeName: string;
  address: string;
  phone: string;
  email: string;
  printingOption: string;
  status: string;
  stage: OrderStage;
  proofFileName: string;
  createdAt: string;
  updatedAt: string;
};

const STAGES = ORDER_STAGES;

export default function TrackClient({
  initialOrderId,
}: {
  initialOrderId?: string;
}) {
  const [trackingId, setTrackingId] = useState(initialOrderId || "");
  const [order, setOrder] = useState<OrderResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialOrderId) {
      fetchOrder(initialOrderId);
    }
  }, [initialOrderId]);

  async function fetchOrder(orderId: string) {
    if (!orderId.trim()) {
      setError("Please enter your order number to continue.");
      return;
    }

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const res = await fetch(
        `/api/orders?orderId=${encodeURIComponent(orderId)}`
      );

      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        throw new Error(payload?.error || "Order not found.");
      }

      const payload: OrderResult = await res.json();
      setOrder(payload);
    } catch (err: any) {
      setError(err?.message || "Unable to find order.");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    fetchOrder(trackingId);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 px-4 py-10">
      <div className="mx-auto max-w-3xl rounded-[28px] border border-slate-800 bg-slate-950/95 p-8 shadow-[0_28px_70px_rgba(0,0,0,0.4)]">
        <div className="mb-8 flex items-center gap-3">
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-800"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-base">
              🏠
            </span>
            LIC PRINT SHOP
          </a>
        </div>

        <div className="mb-8 space-y-4">
          <div className="inline-flex rounded-full bg-indigo-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300">
            LIC PRINT SHOP
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
              Track your order
            </h1>
            <p className="mt-3 max-w-2xl text-slate-300">
              Enter your order number and view the current stage from Trello.
            </p>
          </div>
        </div>

        {order ? (
          <div className="space-y-8">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
                    Order ID
                  </p>
                  <p className="text-lg font-semibold text-white">
                    {order.orderId}
                  </p>
                </div>
                <span className="rounded-full bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-200">
                  {order.status.toUpperCase()}
                </span>
              </div>

              <div className="mt-6 rounded-3xl bg-slate-950/70 p-5 shadow-inner shadow-slate-950/20">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
                      Current stage
                    </p>
                    <p className="text-2xl font-bold text-white">
                      {order.stage}
                    </p>
                  </div>
                  {order.stage === STAGES[STAGES.length - 1] ? (
                    <div className="rounded-2xl bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-300">
                      Order Completed
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
              <div className="grid gap-5">
                {STAGES.map((stage, index) => {
                  const orderIndex = STAGES.indexOf(order.stage);
                  const completed = index < orderIndex;
                  const active = index === orderIndex;
                  const inactive = index > orderIndex;
                  return (
                    <div key={stage} className="flex items-start gap-4">
                      <div className="relative flex h-10 w-10 flex-none items-center justify-center rounded-full border text-sm font-semibold">
                        {completed ? (
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-slate-950">
                            ✓
                          </span>
                        ) : active ? (
                          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-400 bg-amber-400/10 text-amber-300">
                            ●
                          </span>
                        ) : (
                          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-950 text-slate-500">
                            ○
                          </span>
                        )}
                        {index < STAGES.length - 1 ? (
                          <span
                            className={`absolute left-1/2 top-full h-8 w-px -translate-x-1/2 bg-slate-700 ${inactive ? "opacity-40" : "opacity-100"}`}
                          />
                        ) : null}
                      </div>
                      <div>
                        <p className={`text-base font-semibold ${active ? "text-white" : completed ? "text-slate-300" : "text-slate-500"}`}>
                          {stage}
                        </p>
                        {active ? (
                          <p className="mt-1 text-sm text-amber-300">Current stage</p>
                        ) : completed ? (
                          <p className="mt-1 text-sm text-slate-400">Completed</p>
                        ) : (
                          <p className="mt-1 text-sm text-slate-500">Upcoming</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Trade name</p>
                  <p className="text-sm text-slate-100">{order.tradeName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Entity type</p>
                  <p className="text-sm text-slate-100">{order.entityType}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Payment status</p>
                  <p className="text-sm text-slate-100">{order.status}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Proof file</p>
                  <p className="text-sm text-slate-100">{order.proofFileName}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm leading-6 text-slate-400">
                Your order is stored in the built-in database. Use the same tracking number anytime.
              </p>
              <a
                href="/order"
                className="inline-flex items-center justify-center rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-indigo-400"
              >
                Submit another order
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <label htmlFor="trackingId" className="block text-sm font-semibold text-slate-200">
                Order number
              </label>
              <input
                id="trackingId"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="e.g. LIC-1234-456"
                className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
              />
              {error ? <p className="text-sm text-rose-400">{error}</p> : null}
            </div>

            <button
              type="submit"
              className="w-full rounded-3xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Searching..." : "Track order"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
