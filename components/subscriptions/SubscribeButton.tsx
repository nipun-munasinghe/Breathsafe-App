"use client";

import React from "react";
import Link from "next/link";
import { BellRing, CheckCircle2 } from "lucide-react";
import { createSubscription, isSubscribedToSensor } from "@/service/subscriptionApi";

type Props = {
  sensorId: number | string;
  className?: string;
};

export default function SubscribeButton({ sensorId, className }: Props) {
  const idNum = React.useMemo(() => Number(sensorId), [sensorId]);
  const [loading, setLoading] = React.useState(true);
  const [subscribed, setSubscribed] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        if (!idNum || Number.isNaN(idNum)) return;
        const res = await isSubscribedToSensor(idNum);
        if (mounted) setSubscribed(res);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, [idNum]);

  const onSubscribe = async () => {
    setSaving(true);
    try {
      await createSubscription({ sensorId: idNum });
      setSubscribed(true);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <button
        type="button"
        disabled
        className={`px-4 py-2 rounded-lg text-sm bg-gray-200 text-gray-600 cursor-not-allowed ${className ?? ""}`}
      >
        Checking…
      </button>
    );
  }

  if (subscribed) {
    return (
      <Link
        href="/subscriptions"
        className={`inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm text-emerald-800 hover:bg-emerald-100 transition ${className ?? ""}`}
        title="Manage subscription"
      >
        <CheckCircle2 className="h-4 w-4" />
        Subscribed
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onSubscribe}
      disabled={saving}
      className={`inline-flex items-center gap-2 bg-lime-600 text-white px-4 py-2 rounded-lg hover:bg-lime-700 transition-colors text-sm ${className ?? ""}`}
      title="Subscribe to this sensor"
    >
      <BellRing className="h-4 w-4" />
      {saving ? "Subscribing…" : "Subscribe"}
    </button>
  );
}
