"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Calendar, Battery, Clock, Save } from "lucide-react";
import dynamic from "next/dynamic";
import * as yup from "yup";

// Load MapSelector client-side to avoid SSR issues
const MapSelector = dynamic(() => import("@/components/requests/MapSelector"), {
  ssr: false,
});

type SensorStatus = "ONLINE" | "OFFLINE" | "MAINTENANCE" | "ERROR";

interface Sensor {
  id: number;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  status: SensorStatus;
  installationDate: string;
  lastMaintenance?: string;
  batteryLevel?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UpdateSensorModalProps {
  sensor: Sensor | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedSensor: Partial<Sensor>) => void;
}

const statusOptions: SensorStatus[] = [
  "ONLINE",
  "OFFLINE",
  "MAINTENANCE",
  "ERROR",
];

// Yup validation schema
const updateSensorValidationSchema = yup.object({
  name: yup
    .string()
    .required("Sensor name is required")
    .min(3, "Sensor name must be at least 3 characters")
    .max(100, "Sensor name must be less than 100 characters")
    .trim(),
  installationDate: yup
    .string()
    .required("Installation date is required")
    .test("valid-date", "Please enter a valid date", (value) => {
      if (!value) return false;
      const date = new Date(value);
      return date instanceof Date && !isNaN(date.getTime());
    })
    .test(
      "not-future",
      "Installation date cannot be in the future",
      (value) => {
        if (!value) return true;
        const date = new Date(value);
        return date <= new Date();
      }
    ),
  lastMaintenance: yup
    .string()
    .nullable()
    .optional()
    .test("valid-date", "Please enter a valid date", (value) => {
      if (!value) return true;
      const date = new Date(value);
      return date instanceof Date && !isNaN(date.getTime());
    })
    .test("not-future", "Maintenance date cannot be in the future", (value) => {
      if (!value) return true;
      const date = new Date(value);
      return date <= new Date();
    }),
  status: yup
    .string()
    .required("Status is required")
    .oneOf(statusOptions, "Please select a valid status"),
  batteryLevel: yup
    .number()
    .nullable()
    .optional()
    .min(0, "Battery level must be between 0 and 100")
    .max(100, "Battery level must be between 0 and 100")
    .integer("Battery level must be a whole number")
    .typeError("Battery level must be a valid number"),
  latitude: yup
    .number()
    .nullable()
    .required("Latitude is required")
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90")
    .typeError("Latitude must be a valid number"),
  longitude: yup
    .number()
    .nullable()
    .required("Longitude is required")
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180")
    .typeError("Longitude must be a valid number"),
  location: yup
    .string()
    .required("Location is required")
    .min(5, "Location must be at least 5 characters")
    .max(200, "Location must be less than 200 characters")
    .trim(),
  isActive: yup.boolean().required("Active status is required"),
});

const UpdateSensorModal: React.FC<UpdateSensorModalProps> = ({
  sensor,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<Sensor>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    if (sensor) {
      setFormData({
        ...sensor,
        installationDate: sensor.installationDate
          ? new Date(sensor.installationDate).toISOString().slice(0, 16)
          : "",
        lastMaintenance: sensor.lastMaintenance
          ? new Date(sensor.lastMaintenance).toISOString().slice(0, 16)
          : "",
      });
      setValidationErrors({});
      setSubmitError(null);
    }
  }, [sensor]);

  // Validate single field
  const validateField = async (fieldName: keyof Sensor, value: any) => {
    try {
      const fieldSchema = yup.reach(
        updateSensorValidationSchema,
        fieldName
      ) as yup.Schema<any>;
      await fieldSchema.validate(value);
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        setValidationErrors((prev) => ({
          ...prev,
          [fieldName]: error.message,
        }));
      }
    }
  };

  // Validate entire form
  const validateForm = async (): Promise<boolean> => {
    try {
      await updateSensorValidationSchema.validate(formData, {
        abortEarly: false,
      });
      setValidationErrors({});
      return true;
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const errors: Record<string, string> = {};
        error.inner.forEach((err) => {
          if (err.path) {
            errors[err.path] = err.message;
          }
        });
        setValidationErrors(errors);
      }
      return false;
    }
  };

  const handleInputChange = (field: keyof Sensor, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      location: address,
    }));
    // Validate the updated fields
    validateField("latitude", lat);
    validateField("longitude", lng);
    validateField("location", address);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const isValid = await validateForm();
    if (!isValid) {
      setSubmitError("Please fix the validation errors before submitting.");
      return;
    }

    setSubmitting(true);

    try {
      const updatedSensor = {
        ...formData,
        name: formData.name?.trim(),
        location: formData.location?.trim(),
        installationDate: formData.installationDate
          ? new Date(formData.installationDate).toISOString()
          : sensor?.installationDate,
        lastMaintenance: formData.lastMaintenance
          ? new Date(formData.lastMaintenance).toISOString()
          : sensor?.lastMaintenance,
      };

      onSave(updatedSensor);
      onClose();
    } catch (err: any) {
      setSubmitError(err?.message || "Failed to update sensor");
    } finally {
      setSubmitting(false);
    }
  };

  const isFormValid =
    Object.keys(validationErrors).length === 0 &&
    formData.name &&
    formData.installationDate &&
    formData.status &&
    formData.latitude !== undefined &&
    formData.longitude !== undefined &&
    formData.location;

  if (!isOpen || !sensor) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-green-600 to-emerald-800 p-6 rounded-t-2xl">
          <h3 className="text-xl font-bold text-white flex items-center">
            <MapPin className="w-6 h-6 mr-2" />
            Edit Sensor
          </h3>
          <p className="text-green-100 text-sm mt-1">
            Update sensor details and location
          </p>
        </div>

        {submitError && (
          <div className="p-4 mx-4 mt-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <span className="text-red-800 text-sm font-medium">
                {submitError}
              </span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sensor Name *
              </label>
              <input
                type="text"
                value={formData.name || ""}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="e.g., Colombo Central CO₂ Sensor"
                className={`w-full px-3 py-3 text-sm border rounded-lg outline-none font-semibold transition-colors ${
                  validationErrors.name
                    ? "border-red-300 focus:ring-2 focus:ring-red-600 focus:border-red-600"
                    : "border-gray-300 focus:ring-2 focus:ring-lime-600 focus:border-lime-600"
                }`}
                required
              />
              {validationErrors.name && (
                <p className="text-red-600 text-xs mt-1">
                  {validationErrors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-lime-600" />
                Installation Date & Time *
              </label>
              <input
                type="datetime-local"
                value={formData.installationDate || ""}
                onChange={(e) =>
                  handleInputChange("installationDate", e.target.value)
                }
                className={`w-full px-3 py-3 text-sm border rounded-lg outline-none font-semibold transition-colors ${
                  validationErrors.installationDate
                    ? "border-red-300 focus:ring-2 focus:ring-red-600 focus:border-red-600"
                    : "border-gray-300 focus:ring-2 focus:ring-lime-600 focus:border-lime-600"
                }`}
                required
              />
              {validationErrors.installationDate && (
                <p className="text-red-600 text-xs mt-1">
                  {validationErrors.installationDate}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                value={formData.status || ""}
                onChange={(e) =>
                  handleInputChange("status", e.target.value as SensorStatus)
                }
                className={`w-full px-3 py-3 text-sm border rounded-lg outline-none font-semibold transition-colors ${
                  validationErrors.status
                    ? "border-red-300 focus:ring-2 focus:ring-red-600 focus:border-red-600"
                    : "border-gray-300 focus:ring-2 focus:ring-lime-600 focus:border-lime-600"
                }`}
                required
              >
                <option value="" disabled>
                  Select status
                </option>
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {validationErrors.status && (
                <p className="text-red-600 text-xs mt-1">
                  {validationErrors.status}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Clock className="w-4 h-4 mr-2 text-lime-600" />
                Last Maintenance
              </label>
              <input
                type="datetime-local"
                value={formData.lastMaintenance || ""}
                onChange={(e) =>
                  handleInputChange("lastMaintenance", e.target.value)
                }
                className={`w-full px-3 py-3 text-sm border rounded-lg outline-none font-semibold transition-colors ${
                  validationErrors.lastMaintenance
                    ? "border-red-300 focus:ring-2 focus:ring-red-600 focus:border-red-600"
                    : "border-gray-300 focus:ring-2 focus:ring-lime-600 focus:border-lime-600"
                }`}
              />
              {validationErrors.lastMaintenance && (
                <p className="text-red-600 text-xs mt-1">
                  {validationErrors.lastMaintenance}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Battery className="w-4 h-4 mr-2 text-lime-600" />
                Battery Level (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.batteryLevel || ""}
                onChange={(e) =>
                  handleInputChange(
                    "batteryLevel",
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
                placeholder="0-100"
                className={`w-full px-3 py-3 text-sm border rounded-lg outline-none font-semibold transition-colors ${
                  validationErrors.batteryLevel
                    ? "border-red-300 focus:ring-2 focus:ring-red-600 focus:border-red-600"
                    : "border-gray-300 focus:ring-2 focus:ring-lime-600 focus:border-lime-600"
                }`}
              />
              {validationErrors.batteryLevel && (
                <p className="text-red-600 text-xs mt-1">
                  {validationErrors.batteryLevel}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Active Status
              </label>
              <button
                type="button"
                onClick={() =>
                  handleInputChange("isActive", !formData.isActive)
                }
                className={`w-full px-3 py-3 text-sm border rounded-lg outline-none font-semibold flex items-center justify-between transition-colors ${
                  formData.isActive
                    ? "border-lime-600 bg-lime-50"
                    : "border-gray-300 bg-white"
                }`}
              >
                <span className="text-gray-700">
                  {formData.isActive ? "Active" : "Inactive"}
                </span>
                <span
                  className={`w-3 h-3 rounded-full ${
                    formData.isActive ? "bg-green-500" : "bg-gray-400"
                  }`}
                ></span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Select Location on Map *
              </label>
              <MapSelector
                onLocationSelect={handleLocationSelect}
                selectedLat={formData.latitude}
                selectedLng={formData.longitude}
                className="w-full h-72"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Latitude *
                </label>
                <input
                  type="number"
                  value={formData.latitude || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "latitude",
                      e.target.value === "" ? null : parseFloat(e.target.value)
                    )
                  }
                  placeholder="6.9271"
                  className={`w-full px-3 py-3 text-sm border rounded-lg outline-none font-semibold transition-colors ${
                    validationErrors.latitude
                      ? "border-red-300 focus:ring-2 focus:ring-red-600 focus:border-red-600"
                      : "border-gray-300 focus:ring-2 focus:ring-lime-600 focus:border-lime-600"
                  }`}
                  required
                  step="any"
                />
                {validationErrors.latitude && (
                  <p className="text-red-600 text-xs mt-1">
                    {validationErrors.latitude}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Longitude *
                </label>
                <input
                  type="number"
                  value={formData.longitude || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "longitude",
                      e.target.value === "" ? null : parseFloat(e.target.value)
                    )
                  }
                  placeholder="79.8612"
                  className={`w-full px-3 py-3 text-sm border rounded-lg outline-none font-semibold transition-colors ${
                    validationErrors.longitude
                      ? "border-red-300 focus:ring-2 focus:ring-red-600 focus:border-red-600"
                      : "border-gray-300 focus:ring-2 focus:ring-lime-600 focus:border-lime-600"
                  }`}
                  required
                  step="any"
                />
                {validationErrors.longitude && (
                  <p className="text-red-600 text-xs mt-1">
                    {validationErrors.longitude}
                  </p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  value={formData.location || ""}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  placeholder="Auto-filled from map selection"
                  className={`w-full px-3 py-3 text-sm border rounded-lg outline-none font-semibold transition-colors ${
                    validationErrors.location
                      ? "border-red-300 focus:ring-2 focus:ring-red-600 focus:border-red-600"
                      : "border-gray-300 focus:ring-2 focus:ring-lime-600 focus:border-lime-600"
                  }`}
                  required
                />
                {validationErrors.location && (
                  <p className="text-red-600 text-xs mt-1">
                    {validationErrors.location}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Click on the map to autofill this field.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid || submitting}
              className="px-5 py-2 rounded-lg text-white font-semibold flex items-center gap-2 bg-lime-600 hover:bg-emerald-950 disabled:bg-lime-300 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Update Sensor
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateSensorModal;
