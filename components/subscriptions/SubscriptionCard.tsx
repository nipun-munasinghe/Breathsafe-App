"use client";

import React, { useState } from "react";
import { Bell, MapPin, Settings2, Trash2, Power } from "lucide-react";
import { SubscriptionResponse } from "@/types/subscription";
import {
  updateAlertThreshold,
  updateEmailNotifications,
  toggleSubscriptionStatus,
} from "@/service/subscriptionApi";
import { useDebouncedCallback } from "use-debounce";

// A reusable toggle switch component for a cleaner UI
const ToggleSwitch = ({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) => (
  <label className="relative inline-flex cursor-pointer items-center">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="peer sr-only"
      disabled={disabled}
    />
    <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-emerald-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rtl:peer-checked:after:-translate-x-full"></div>
  </label>
);

type Props = {
  item: SubscriptionResponse;
  onStateChange: (updatedItem: SubscriptionResponse) => void;
  onUnsubscribe: (id: number) => Promise<void>;
};

export default function SubscriptionCard({
  item,
  onStateChange,
  onUnsubscribe,
}: Props) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  // Unsubscribe handler
  const handleUnsub = async () => {
    if (!confirm(`Unsubscribe from ${item.sensorName}?`)) return;
    setIsRemoving(true);
    await onUnsubscribe(item.subscriptionId);
    // No need to set isRemoving to false, as the component will unmount.
  };

  // Handler for email notification toggle
  const handleEmailChange = async (enabled: boolean) => {
    setIsUpdating(true);
    const response = await updateEmailNotifications(item.subscriptionId, {
      enable: enabled,
    });
    if (response.success && response.data) {
      onStateChange(response.data);
    }
    setIsUpdating(false);
  };

  // Debounced handler for alert threshold to avoid too many API calls while sliding
  const debouncedThresholdUpdate = useDebouncedCallback(
    async (newThreshold: number) => {
      setIsUpdating(true);
      const response = await updateAlertThreshold(item.subscriptionId, {
        alertThreshold: newThreshold,
      });
      if (response.success && response.data) {
        onStateChange(response.data);
      }
      setIsUpdating(false);
    },
    500 // 500ms debounce delay
  );

  // Handler for active status toggle
  const handleStatusChange = async (isActive: boolean) => {
    setIsUpdating(true);
    const response = await toggleSubscriptionStatus(item.subscriptionId, {
      isActive,
    });
    if (response.success && response.data) {
      onStateChange(response.data);
    }
    setIsUpdating(false);
  };

  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-opacity ${
        !item.isActive ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            {item.sensorName}
          </h3>
          <div className="mt-1 flex items-center text-sm text-slate-600">
            <MapPin className="mr-1 h-4 w-4 text-lime-600" />
            <span>{item.sensorLocation}</span>
          </div>
        </div>
        <button
          className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={handleUnsub}
          disabled={isUpdating || isRemoving}
          title="Unsubscribe"
        >
          <div className="flex items-center gap-1">
            <Trash2 className="h-4 w-4" />
            {isRemoving ? "Removing..." : "Unsubscribe"}
          </div>
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Active Status Control */}
        <div className="rounded-lg border border-slate-200 p-3">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-800">
            <Power
              className={`h-4 w-4 ${
                item.isActive ? "text-emerald-600" : "text-slate-400"
              }`}
            />
            Subscription Status
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-700">
              {item.isActive ? "Active" : "Inactive"}
            </span>
            <ToggleSwitch
              checked={item.isActive}
              onChange={handleStatusChange}
              disabled={isUpdating || isRemoving}
            />
          </div>
        </div>

        {/* Email Notifications Control */}
        <div className="rounded-lg border border-slate-200 p-3">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-800">
            <Bell className="h-4 w-4 text-amber-600" />
            Email notifications
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-700">
              {item.emailNotifications ? "Enabled" : "Disabled"}
            </span>
            <ToggleSwitch
              checked={item.emailNotifications}
              onChange={handleEmailChange}
              disabled={isUpdating || isRemoving}
            />
          </div>
        </div>

        {/* Alert Threshold Control */}
        <div className="rounded-lg border border-slate-200 p-3">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-800">
            <Settings2 className="h-4 w-4 text-blue-600" />
            Alert threshold (AQI)
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={500}
              step={5}
              defaultValue={item.alertThreshold}
              onChange={(e) => debouncedThresholdUpdate(Number(e.target.value))}
              className="w-full accent-lime-600"
              disabled={isUpdating || isRemoving}
            />
            <span className="w-12 text-right text-sm font-medium text-slate-800">
              {item.alertThreshold}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}