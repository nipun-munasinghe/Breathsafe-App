import {CommunityRequest, validationSchema} from "@/types/request";
import {useFormik} from "formik";
import React, {useState} from "react";
import {AlertCircle, Edit3, Info, MapIcon, MapPin, MessageSquare, Save, X} from "lucide-react";
import MapSelector from "@/components/requests/MapSelector";

export const EditRequestModal: React.FC<{
    request: CommunityRequest | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedRequest: Partial<CommunityRequest>) => void;
}> = ({ request, isOpen, onClose, onSave }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const formik = useFormik({
        initialValues: {
            requestedLocation: request?.requestedLocation || '',
            latitude: request?.latitude || 0,
            longitude: request?.longitude || 0,
            justification: request?.justification || ''
        },
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            setIsSubmitting(true);
            try {
                // Add your API call here
                console.log('Updating request:', request?.id, 'with values:', values);
                await new Promise(resolve => setTimeout(resolve, 1500));

                onSave({
                    ...values,
                    updatedAt: new Date().toISOString()
                });

                onClose();
            } catch (error) {
                console.error('Failed to update request:', error);
            } finally {
                setIsSubmitting(false);
            }
        }
    });

    const handleLocationSelect = (lat: number, lng: number, address: string) => {
        formik.setFieldValue('latitude', lat);
        formik.setFieldValue('longitude', lng);
        if (!formik.values.requestedLocation || formik.values.requestedLocation === request?.requestedLocation) {
            formik.setFieldValue('requestedLocation', address);
        }
    };

    const characterCount = formik.values.justification.length;
    const isCharacterCountWarning = characterCount > 120;
    const isCharacterCountError = characterCount > 150;

    const hasChanges = request && (
        formik.values.requestedLocation !== request.requestedLocation ||
        formik.values.latitude !== request.latitude ||
        formik.values.longitude !== request.longitude ||
        formik.values.justification !== request.justification
    );

    if (!isOpen || !request) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-5000">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[95vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center text-white">
                            <Edit3 className="w-6 h-6 mr-3" />
                            <div>
                                <h2 className="text-2xl font-bold">Edit Request</h2>
                                <p className="text-blue-100 text-sm">Request ID: #{request.id}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="text-white hover:text-blue-200 p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors disabled:opacity-50"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {hasChanges && (
                        <div className="mt-4 p-3 bg-yellow-100 bg-opacity-20 border border-yellow-300 border-opacity-30 rounded-lg">
                            <div className="flex items-center text-yellow-100 text-sm">
                                <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                                You have unsaved changes
                            </div>
                        </div>
                    )}
                </div>

                {/* Form Content */}
                <form onSubmit={formik.handleSubmit} className="p-6 space-y-6">

                    {/* Location Input */}
                    <div>
                        <label className="block text-slate-900 font-semibold mb-2">
                            <MapIcon className="w-4 h-4 inline mr-2 text-blue-600" />
                            Requested Location *
                        </label>
                        <input
                            type="text"
                            name="requestedLocation"
                            value={formik.values.requestedLocation}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Enter city, town, or specific area name"
                            className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all ${
                                formik.touched.requestedLocation && formik.errors.requestedLocation
                                    ? 'border-orange-500 bg-orange-50'
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                        />
                        {formik.touched.requestedLocation && formik.errors.requestedLocation && (
                            <p className="text-orange-500 text-sm mt-2 flex items-center bg-orange-50 p-2 rounded-lg">
                                <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                                {formik.errors.requestedLocation}
                            </p>
                        )}
                    </div>

                    {/* Map Selector */}
                    <div>
                        <label className="block text-slate-900 font-semibold mb-2">
                            <MapPin className="w-4 h-4 inline mr-2 text-blue-600" />
                            Select Exact Location *
                        </label>
                        <p className="text-gray-600 text-sm mb-3">Click on the map to update the location</p>
                        <div className="border-2 border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-colors">
                            <MapSelector
                                onLocationSelect={handleLocationSelect}
                                selectedLat={formik.values.latitude || undefined}
                                selectedLng={formik.values.longitude || undefined}
                                className="w-full h-64"
                            />
                        </div>
                        {((formik.touched.latitude && formik.errors.latitude) ||
                            (formik.touched.longitude && formik.errors.longitude)) && (
                            <p className="text-orange-500 text-sm mt-2 flex items-center bg-orange-50 p-2 rounded-lg">
                                <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                                Please select a location on the map
                            </p>
                        )}

                        {/* Show current coordinates */}
                        <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                <span>Current coordinates: </span>
                                <span className="font-mono ml-1">
                  {formik.values.latitude.toFixed(6)}, {formik.values.longitude.toFixed(6)}
                </span>
                            </div>
                        </div>
                    </div>

                    {/* Justification */}
                    <div>
                        <label className="block text-slate-900 font-semibold mb-2">
                            <MessageSquare className="w-4 h-4 inline mr-2 text-blue-600" />
                            Justification *
                        </label>
                        <p className="text-gray-600 text-sm mb-3">
                            Explain why this location needs air quality monitoring (30-150 characters)
                        </p>
                        <textarea
                            name="justification"
                            value={formik.values.justification}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            rows={4}
                            placeholder="Update your justification for why this location needs air quality monitoring..."
                            className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all resize-none ${
                                formik.touched.justification && formik.errors.justification
                                    ? 'border-orange-500 bg-orange-50'
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                        />

                        <div className="flex justify-between items-center mt-3">
                            <div className="flex-1">
                                {formik.touched.justification && formik.errors.justification && (
                                    <p className="text-orange-500 text-sm flex items-center bg-orange-50 p-2 rounded-lg">
                                        <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                                        {formik.errors.justification}
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                                <div className={`w-20 bg-gray-200 rounded-full h-2 ${
                                    isCharacterCountError ? 'bg-orange-200' :
                                        isCharacterCountWarning ? 'bg-yellow-200' : 'bg-blue-200'
                                }`}>
                                    <div
                                        className={`h-2 rounded-full transition-all ${
                                            isCharacterCountError ? 'bg-orange-500' :
                                                isCharacterCountWarning ? 'bg-yellow-500' : 'bg-blue-600'
                                        }`}
                                        style={{ width: `${Math.min((characterCount / 150) * 100, 100)}%` }}
                                    ></div>
                                </div>
                                <p className={`text-sm font-medium whitespace-nowrap ${
                                    isCharacterCountError ? 'text-orange-500' :
                                        isCharacterCountWarning ? 'text-yellow-600' : 'text-gray-600'
                                }`}>
                                    {characterCount}/150
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Changes Summary */}
                    {hasChanges && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <h4 className="font-semibold text-slate-900 mb-2 flex items-center">
                                <AlertCircle className="w-4 h-4 mr-2 text-yellow-600" />
                                Changes Summary
                            </h4>
                            <div className="space-y-1 text-sm">
                                {formik.values.requestedLocation !== request.requestedLocation && (
                                    <div className="flex items-start">
                                        <span className="text-gray-600 w-20 flex-shrink-0">Location:</span>
                                        <div>
                                            <span className="text-red-600 line-through">{request.requestedLocation}</span>
                                            <span className="text-green-600 ml-2">→ {formik.values.requestedLocation}</span>
                                        </div>
                                    </div>
                                )}
                                {(formik.values.latitude !== request.latitude || formik.values.longitude !== request.longitude) && (
                                    <div className="flex items-start">
                                        <span className="text-gray-600 w-20 flex-shrink-0">Coordinates:</span>
                                        <div className="font-mono text-xs">
                      <span className="text-red-600 line-through">
                        {request.latitude.toFixed(4)}, {request.longitude.toFixed(4)}
                      </span>
                                            <span className="text-green-600 ml-2">
                        → {formik.values.latitude.toFixed(4)}, {formik.values.longitude.toFixed(4)}
                      </span>
                                        </div>
                                    </div>
                                )}
                                {formik.values.justification !== request.justification && (
                                    <div className="flex items-start">
                                        <span className="text-gray-600 w-20 flex-shrink-0">Justification:</span>
                                        <span className="text-yellow-700">Updated</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </form>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 rounded-b-2xl border-t border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                            <Info className="w-4 h-4 inline mr-1" />
                            Only pending requests can be edited
                        </div>
                        <div className="flex space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    formik.handleSubmit();
                                }}
                                disabled={!hasChanges || !formik.isValid || isSubmitting}
                                className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                        Saving Changes...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};