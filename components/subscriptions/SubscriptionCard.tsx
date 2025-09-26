"use client";

import React, { useState } from "react";
import { Bell, MapPin, Settings2, Trash2 } from "lucide-react";
import { SubscriptionItem } from "@/types/subscription";

type Props = {
  item: SubscriptionItem;
  onUpdate: (id: number, updates: Partial<SubscriptionItem>) => Promise<void>;
  onUnsubscribe: (id: number) => Promise<void>;
};

export default function SubscriptionCard({ item, onUpdate, onUnsubscribe }: Props) {
  const [threshold, setThreshold] = useState<number>(item.alertThreshold ?? 100);
  const [email, setEmail] = useState<boolean>(!!item.emailNotifications);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await onUpdate(item.id, { alertThreshold: threshold, emailNotifications: email });
    } finally {
      setSaving(false);
    }
  };

  const handleUnsub = async () => {
    if (!confirm(`Unsubscribe from ${item.sensorName}?`)) return;
    setRemoving(true);
    try {
      await onUnsubscribe(item.id);
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{item.sensorName}</h3>
          <div className="mt-1 flex items-center text-sm text-slate-600">
            <MapPin className="mr-1 h-4 w-4 text-lime-600" />
            <span>{item.sensorLocation}</span>
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Status: <span className="font-medium">{item.sensorStatus ?? "UNKNOWN"}</span>
          </div>
        </div>
        <button
          className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
          onClick={handleUnsub}
          disabled={removing}
          title="Unsubscribe"
        >
          <div className="flex items-center gap-1">
            <Trash2 className="h-4 w-4" />
            {removing ? "Removing..." : "Unsubscribe"}
          </div>
        </button>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 p-3">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-800">
            <Bell className="h-4 w-4 text-amber-600" />
            Email notifications
          </div>
          <div className="flex items-center gap-3">
            <label className="inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                className="h-4 w-4 accent-lime-600"
                checked={email}
                onChange={(e) => setEmail(e.target.checked)}
              />
              <span className="ml-2 text-sm text-slate-700">Enable</span>
            </label>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 p-3">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-800">
            <Settings2 className="h-4 w-4 text-emerald-600" />
            Alert threshold (AQI)
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={300}
              step={5}
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-full accent-lime-600"
            />
            <span className="w-12 text-right text-sm font-medium text-slate-800">{threshold}</span>
          </div>
          <div className="mt-1 text-xs text-slate-500">Get alerts when AQI reaches or exceeds this value.</div>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          className="rounded-lg bg-gradient-to-br from-emerald-600 to-lime-600 px-4 py-2 text-sm font-medium text-white hover:from-emerald-500 hover:to-lime-500 disabled:opacity-60"
          onClick={save}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </div>
  );
}