"use client";

import React, {useMemo, useState} from "react";
import {Check, Clock, MapPin, ToggleLeft, ToggleRight} from "lucide-react";
import dynamic from "next/dynamic";
import * as yup from "yup";
import ToastUtils from "@/utils/toastUtils";
import {CreateSensorFormData, SensorStatus, sensorValidationSchema, statusOptions} from "@/types/sensors/admin";
import {createSensor} from "@/service/sensorApi";

const MapSelector = dynamic(() => import("@/components/requests/MapSelector"), {
  ssr: false,
});

const initialFormData: CreateSensorFormData = {
  name: "",
  installationDate: "",
  isActive: true,
  status: "",
  latitude: null,
  longitude: null,
  location: "",
};

const CreateSensor: React.FC = () => {
  const [formData, setFormData] =
    useState<CreateSensorFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const isFormValid = useMemo(
    () =>
      !!formData.name &&
      !!formData.installationDate &&
      formData.status !== "" &&
      formData.latitude !== null &&
      formData.longitude !== null &&
      !!formData.location &&
      Object.keys(validationErrors).length === 0,
    [formData, validationErrors]
  );

  // Validate single field
  const validateField = async (
    fieldName: keyof CreateSensorFormData,
    value: any
  ) => {
    try {
      await (
        yup.reach(sensorValidationSchema, fieldName) as yup.Schema<any>
      ).validate(value);
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

  const validateForm = async (): Promise<boolean> => {
    try {
      await sensorValidationSchema.validate(formData, { abortEarly: false });
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

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      location: address,
    }));

    validateField("latitude", lat);
    validateField("longitude", lng);
    validateField("location", address);
  };

  const handleInputChange = (field: keyof CreateSensorFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    const isValid = await validateForm();
    if (!isValid) {
      setSubmitError("Please fix the validation errors before submitting.");
      return;
    }

    setSubmitting(true);

    try {
      const payload : CreateSensorFormData = {
        name: formData.name.trim(),
        installationDate: new Date(formData.installationDate).toISOString(),
        isActive: formData.isActive,
        status: formData.status,
        latitude: formData.latitude,
        longitude: formData.longitude,
        location: formData.location.trim(),
      };

      const response = await createSensor(payload);
      if (response?.success) {
          ToastUtils.success("Sensor created successfully!");
          setFormData(initialFormData);
      }
    } catch (err: any) {
      setSubmitError(err?.message || "Failed to submit form!");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setValidationErrors({});
    setSubmitError(null);
    setSubmitSuccess(null);
  };

  return (
    <div className="relative flex flex-col break-words bg-white w-full mb-10 shadow-lg rounded-2xl border border-gray-100">
      {/* Header */}
      <div className="rounded-t-2xl mb-10 px-4 sm:px-6 py-4 sm:py-6 border-0 bg-gradient-to-r from-lime-600 to-emerald-800">
        <h2 className="text-xl font-bold text-white flex items-center">
          <MapPin className="w-6 h-6 mr-2" />
          Create Sensor
        </h2>
        <p className="text-lime-100 text-sm mt-1">
          Enter sensor details and select a location on the map.
        </p>
      </div>

      {/* Form Content */}
      <div className="px-4 sm:px-6 pb-6">
        {submitError && (
          <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-lg">
            <span className="text-red-800 text-sm font-medium">
              {submitError}
            </span>
          </div>
        )}
        {submitSuccess && (
          <div className="p-4 mb-8 bg-green-50 border border-green-200 rounded-lg flex items-center">
            <Check className="w-5 h-5 text-lime-600 mr-2" />
            <span className="text-emerald-900 text-sm font-medium">
              {submitSuccess}
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sensor Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sensor Name *
              </label>
              <input
                type="text"
                value={formData.name}
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

            {/* Installation Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Clock className="w-4 h-4 mr-2 text-lime-600" />
                Installation Date & Time *
              </label>
              <input
                type="datetime-local"
                value={formData.installationDate}
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

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                value={formData.status}
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

            {/* Active Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Active
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
                {formData.isActive ? (
                  <ToggleRight className="w-5 h-5 text-lime-600" />
                ) : (
                  <ToggleLeft className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Map + Coordinates */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Select Location on Map *
              </label>
              <MapSelector
                onLocationSelect={handleLocationSelect}
                selectedLat={formData.latitude ?? undefined}
                selectedLng={formData.longitude ?? undefined}
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
                  value={formData.latitude ?? ""}
                  onChange={(e) =>
                    handleInputChange(
                      "latitude",
                      e.target.value === "" ? null : Number(e.target.value)
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
                  value={formData.longitude ?? ""}
                  onChange={(e) =>
                    handleInputChange(
                      "longitude",
                      e.target.value === "" ? null : Number(e.target.value)
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
                  value={formData.location}
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

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              disabled={submitting}
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={!isFormValid || submitting}
              className={`px-5 py-2 rounded-lg text-white font-semibold flex items-center gap-2 ${
                !isFormValid || submitting
                  ? "bg-lime-300 cursor-not-allowed"
                  : "bg-lime-600 hover:bg-emerald-950"
              }`}
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
                  <MapPin className="w-4 h-4" />
                  Create Sensor
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSensor;
