"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getSubscriptionCountsBySensor,
  getSubscriptionDailyTrend,
  getAdminSubscriptionSummary,
  downloadSubscriptionReport,
} from "@/service/admin/subscriptionApi";
import { AdminSubscriptionSummary, SensorSubscriptionCount, TimeSeriesPoint } from "@/types/admin/subscription";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from "chart.js";
import { Pie, Line } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

const todayIso = () => new Date().toISOString().slice(0, 10);
const thirtyDaysAgoIso = () => {
  const d = new Date();
  d.setDate(d.getDate() - 29);
  return d.toISOString().slice(0, 10);
};

export default function AdminSubscriptionsPage() {
  const [bySensor, setBySensor] = useState<SensorSubscriptionCount[]>([]);
  const [byDay, setByDay] = useState<TimeSeriesPoint[]>([]);
  const [summary, setSummary] = useState<AdminSubscriptionSummary | null>(null);
  const [from, setFrom] = useState(thirtyDaysAgoIso());
  const [to, setTo] = useState(todayIso());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    Promise.all([
      getSubscriptionCountsBySensor(),
      getSubscriptionDailyTrend({ from, to }),
      getAdminSubscriptionSummary(),
    ])
      .then(([sensorCounts, daily, sum]) => {
        if (!mounted) return;
        setBySensor(sensorCounts);
        setByDay(daily);
        setSummary(sum);
      })
      .catch((e) => {
        if (!mounted) return;
        setError(e?.message ?? "Failed to load admin analytics");
      })
      .finally(() => mounted && setLoading(false));

    return () => { mounted = false; };
  }, [from, to]);

  const pieData = useMemo(() => {
    const labels = bySensor.map(s => s.sensorName);
    const data = bySensor.map(s => s.subscriptionCount);
    return {
      labels,
      datasets: [{
        label: "Subscriptions",
        data,
        backgroundColor: [
          "#2563eb", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6",
          "#06b6d4", "#84cc16", "#f97316", "#14b8a6", "#e11d48"
        ],
      }]
    };
  }, [bySensor]);

  const lineData = useMemo(() => {
    const labels = byDay.map(p => p.date);
    const data = byDay.map(p => p.count);
    return {
      labels,
      datasets: [{
        label: "New Subscriptions",
        data,
        fill: false,
        borderColor: "#2563eb",
        tension: 0.2,
      }]
    };
  }, [byDay]);

  const onDownloadPdf = async () => {
    try {
      const blob = await downloadSubscriptionReport({ from, to });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `breathsafe_subscription_report_${from}_to_${to}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      // Error toast is shown in service
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Admin Analytics - Subscriptions</h1>

      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-sm text-gray-600">From</label>
          <input type="date" value={from} max={to} onChange={(e) => setFrom(e.target.value)} className="border rounded px-2 py-1" />
        </div>
        <div>
          <label className="block text-sm text-gray-600">To</label>
          <input type="date" value={to} min={from} max={todayIso()} onChange={(e) => setTo(e.target.value)} className="border rounded px-2 py-1" />
        </div>
        <button onClick={onDownloadPdf} className="bg-blue-600 text-white px-4 py-2 rounded">
          Download PDF Report
        </button>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}

      {!loading && !error && summary && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard label="Total Subscriptions" value={summary.totalSubscriptions} />
            <StatCard label="Total Sensors" value={summary.totalSensors} />
            <StatCard label="Sensors With Subscriptions" value={summary.sensorsWithSubscriptions} />
            <StatCard label="Sensors Without Subscriptions" value={summary.totalSensors - summary.sensorsWithSubscriptions} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="border rounded p-4">
              <h2 className="font-medium mb-2">Subscriptions by Sensor</h2>
              <Pie data={pieData} />
            </div>
            <div className="border rounded p-4">
              <h2 className="font-medium mb-2">Daily Subscriptions</h2>
              <Line data={lineData} />
            </div>
          </div>

          {summary.sensorsWithoutSubscriptions.length > 0 && (
            <div className="border rounded p-4">
              <h2 className="font-medium mb-2">Sensors Without Subscriptions</h2>
              <ul className="list-disc pl-6">
                {summary.sensorsWithoutSubscriptions.map((s) => <li key={s}>{s}</li>)}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="border rounded p-4">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}