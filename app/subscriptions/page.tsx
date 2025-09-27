"use client";

import React from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { getMySubscriptions, updateSubscription, unsubscribe } from "@/service/subscriptionApi";
import { SubscriptionItem } from "@/types/subscription";
import SubscriptionCard from "@/components/subscriptions/SubscriptionCard";
import { Shield, BellRing } from "lucide-react";

export default function SubscriptionsPage() {
  const [items, setItems] = React.useState<SubscriptionItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMySubscriptions();
      setItems(data);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const activeCount = React.useMemo(() => items.filter((i) => i.isActive).length, [items]);

  const handleUpdate = async (id: number, updates: Partial<SubscriptionItem>) => {
    const updated = await updateSubscription(id, {
      alertThreshold: updates.alertThreshold,
      emailNotifications: updates.emailNotifications,
      isActive: updates.isActive,
    });
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...updated } : i)));
  };

  const handleUnsubscribe = async (id: number) => {
    await unsubscribe(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <>
      <Header />
      <main className="min-h-[60vh] pt-20">
        <div className="mx-auto w-full max-w-7xl px-4 py-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">My Subscriptions</h1>
              <p className="mt-1 text-sm text-slate-600">
                Manage the sensors you’re subscribed to: notifications, thresholds, and more.
              </p>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-800">
              <div className="flex items-center gap-2">
                <BellRing className="h-4 w-4" />
                Active subscriptions: <span className="font-semibold">{activeCount}</span>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24 text-slate-500">Loading subscriptions…</div>
          ) : items.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <Shield className="mx-auto mb-3 h-8 w-8 text-lime-600" />
              <h3 className="text-lg font-semibold text-slate-900">No subscriptions yet</h3>
              <p className="mx-auto mt-1 max-w-md text-sm text-slate-600">
                Subscribe to a sensor from the Sensors page to receive notifications and manage thresholds here.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {items.map((item) => (
                <SubscriptionCard
                  key={item.id}
                  item={item}
                  onUpdate={handleUpdate}
                  onUnsubscribe={handleUnsubscribe}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer showNewsletter={false} />
    </>
  );
}
