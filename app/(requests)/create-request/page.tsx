'use client'

import React, {useState} from 'react';
import dynamic from 'next/dynamic';
import {useFormik} from 'formik';
import {AlertCircle, Building, Info, MapPin, MessageSquare, Send, TreePine, Users, Wind} from 'lucide-react';
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import {ProtectedRoute} from "@/components/common/protectedRoute";
import {CommunityRequestData, validationSchema} from "@/types/request";
import {createRequest} from "@/service/requestApi";
import ToastUtils from "@/utils/toastUtils";

const MapSelector = dynamic(() => import('@/components/communityRequests/MapSelector'), {
    ssr: false,
    loading: () => (
        <div
            className="w-full h-64 bg-gradient-to-br from-green-100 to-orange-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
            <div className="text-center">
                <div
                    className="animate-spin rounded-full h-8 w-8 border-2 border-lime-600 border-t-transparent mx-auto mb-2"></div>
                <p className="text-gray-600 font-medium">Loading map...</p>
            </div>
        </div>
    )
});

export default function CreateRequest() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const formik = useFormik<CommunityRequestData>({
        initialValues: {
            requestedLocation: '',
            latitude: 0,
            longitude: 0,
            justification: ''
        },
        validationSchema,
        onSubmit: async (values) => {
            setIsSubmitting(true);

            try {
                await createRequest(values);
                await new Promise(resolve => setTimeout(resolve, 500)); // Mock delay
                ToastUtils.success("request Submitted.");
            } catch (error) {
                ToastUtils.error("Submission failed. Try again!");
                console.log(error);
            } finally {
                setIsSubmitting(false);
            }
        }
    });

    const handleLocationSelect = (lat: number, lng: number, address: string) => {
        formik.setFieldValue('latitude', lat);
        formik.setFieldValue('longitude', lng);
        if (!formik.values.requestedLocation) {
            formik.setFieldValue('requestedLocation', address);
        }
    };

    const characterCount = formik.values.justification.length;
    const isCharacterCountWarning = characterCount > 120;
    const isCharacterCountError = characterCount > 150;

    return (
        <ProtectedRoute>
            <Header/>

            <main className="min-h-screen">
                <div className="container mx-auto px-4 py-8 max-w-7xl">

                    {/* Page Header */}
                    <div className="text-center mb-12 mt-15">
                        <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-lime-600">
                            <div className="flex flex-col lg:flex-row items-center justify-center mb-6">
                                <div
                                    className="bg-gradient-to-br from-lime-600 to-emerald-600 p-4 rounded-2xl mb-4 lg:mb-0 lg:mr-4 shadow-lg">
                                    <Users className="w-10 h-10 text-white"/>
                                </div>
                                <div className="text-center lg:text-left">
                                    <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-2">
                                        Community Request
                                    </h1>
                                    <div
                                        className="h-1 w-20 bg-gradient-to-r from-lime-600 to-emerald-600 rounded-full mx-auto lg:mx-0"></div>
                                </div>
                            </div>
                            <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed mb-6">
                                Help us expand air quality monitoring to your community. Request a new sensor
                                installation
                                in your area and contribute to cleaner, healthier environments for everyone.
                            </p>
                            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-lime-600 rounded-full mr-2"></div>
                                    Free Installation
                                </div>
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-emerald-600 rounded-full mr-2"></div>
                                    Community Driven
                                </div>
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-lime-500 rounded-full mr-2"></div>
                                    Real-time Data
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Information Panel */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 sticky top-8">
                                <div className="text-center mb-6">
                                    <div
                                        className="bg-gradient-to-br from-lime-100 to-emerald-100 p-4 rounded-2xl w-fit mx-auto mb-4">
                                        <Info className="w-8 h-8 text-lime-700"/>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">How it Works</h3>
                                    <p className="text-gray-500 text-sm mt-2">Simple steps to get started</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <div
                                            className="bg-gradient-to-br from-lime-500 to-lime-600 p-3 rounded-xl mr-3 mt-1 shadow-md flex-shrink-0">
                                            <MapPin className="w-4 h-4 text-white"/>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-slate-900 mb-1">Select Location</h4>
                                            <p className="text-sm text-gray-600 leading-relaxed">Choose the exact spot
                                                where you&apos;d like a sensor installed</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div
                                            className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-3 rounded-xl mr-3 mt-1 shadow-md flex-shrink-0">
                                            <MessageSquare className="w-4 h-4 text-white"/>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-slate-900 mb-1">Provide Justification</h4>
                                            <p className="text-sm text-gray-600 leading-relaxed">Explain why this
                                                location needs monitoring</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div
                                            className="bg-gradient-to-br from-lime-600 to-emerald-600 p-3 rounded-xl mr-3 mt-1 shadow-md flex-shrink-0">
                                            <Users className="w-4 h-4 text-white"/>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-slate-900 mb-1">Community Review</h4>
                                            <p className="text-sm text-gray-600 leading-relaxed">Our team evaluates and
                                                prioritizes requests</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 p-4 bg-gradient-to-br from-emerald-950 to-slate-900 rounded-2xl">
                                    <h4 className="font-semibold text-white mb-2 flex items-center">
                                        <Wind className="w-4 h-4 mr-2 text-lime-300"/>
                                        Why Air Quality Matters
                                    </h4>
                                    <p className="text-sm text-lime-100 leading-relaxed">
                                        Real-time air quality data empowers communities to make informed decisions about
                                        outdoor activities and health.
                                    </p>
                                </div>

                                <div className="mt-4 grid grid-cols-2 gap-4">
                                    <div className="bg-lime-50 p-3 rounded-xl text-center">
                                        <TreePine className="w-5 h-5 text-lime-600 mx-auto mb-1"/>
                                        <p className="text-xs font-medium text-slate-900">50+ Locations</p>
                                        <p className="text-xs text-gray-500">Monitored</p>
                                    </div>
                                    <div className="bg-emerald-50 p-3 rounded-xl text-center">
                                        <Building className="w-5 h-5 text-emerald-600 mx-auto mb-1"/>
                                        <p className="text-xs font-medium text-slate-900">24/7 Data</p>
                                        <p className="text-xs text-gray-500">Collection</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form Panel */}
                        <div className="lg:col-span-2">
                            <form onSubmit={formik.handleSubmit}
                                  className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">

                                <div className="mb-6">
                                    <div className="flex items-center mb-4">
                                        <div
                                            className="bg-gradient-to-br from-lime-600 to-emerald-600 p-2 rounded-lg mr-3 flex-shrink-0">
                                            <Send className="w-4 h-4 text-white"/>
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-slate-900">Request Details</h2>
                                            <p className="text-gray-500 text-sm">Fill out the form below to submit your
                                                request</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Location Input */}
                                <div className="mb-6">
                                    <label className="block text-slate-900 font-semibold mb-2">
                                        <Building className="w-4 h-4 inline mr-2 text-lime-600"/>
                                        Requested Location *
                                    </label>
                                    <input
                                        type="text"
                                        name="requestedLocation"
                                        value={formik.values.requestedLocation}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        placeholder="Enter city, town, or specific area name (e.g., Kegalle Town Center)"
                                        className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-lime-600 focus:border-lime-600 outline-none transition-all ${
                                            formik.touched.requestedLocation && formik.errors.requestedLocation
                                                ? 'border-orange-500 bg-orange-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    />
                                    {formik.touched.requestedLocation && formik.errors.requestedLocation && (
                                        <p className="text-orange-500 text-sm mt-2 flex items-center bg-orange-50 p-2 rounded-lg">
                                            <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0"/>
                                            {formik.errors.requestedLocation}
                                        </p>
                                    )}
                                </div>

                                {/* Map Selector */}
                                <div className="mb-6">
                                    <label className="block text-slate-900 font-semibold mb-2">
                                        <MapPin className="w-4 h-4 inline mr-2 text-lime-600"/>
                                        Select Exact Location *
                                    </label>
                                    <p className="text-gray-600 text-sm mb-3">Click on the map to pinpoint the exact
                                        location for the sensor</p>
                                    <div
                                        className="border-2 border-gray-200 rounded-lg overflow-hidden hover:border-lime-300 transition-colors">
                                        <MapSelector
                                            onLocationSelect={handleLocationSelect}
                                            selectedLat={formik.values.latitude || undefined}
                                            selectedLng={formik.values.longitude || undefined}
                                            className="w-full h-80"
                                        />
                                    </div>
                                    {((formik.touched.latitude && formik.errors.latitude) ||
                                        (formik.touched.longitude && formik.errors.longitude)) && (
                                        <p className="text-orange-500 text-sm mt-2 flex items-center bg-orange-50 p-2 rounded-lg">
                                            <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0"/>
                                            Please select a location on the map
                                        </p>
                                    )}
                                </div>

                                {/* Justification */}
                                <div className="mb-8">
                                    <label className="block text-slate-900 font-semibold mb-2">
                                        <MessageSquare className="w-4 h-4 inline mr-2 text-lime-600"/>
                                        Justification *
                                    </label>
                                    <p className="text-gray-600 text-sm mb-3">
                                        Explain why this location needs air quality monitoring. Be specific about local
                                        conditions. (30-150 characters)
                                    </p>
                                    <textarea
                                        name="justification"
                                        value={formik.values.justification}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        rows={4}
                                        placeholder="Example: High traffic area with 3 schools nearby, frequent smog during rush hours affects 500+ students daily."
                                        className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-lime-600 focus:border-lime-600 outline-none transition-all resize-none ${
                                            formik.touched.justification && formik.errors.justification
                                                ? 'border-orange-500 bg-orange-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    />

                                    <div className="flex justify-between items-center mt-3">
                                        <div className="flex-1">
                                            {formik.touched.justification && formik.errors.justification && (
                                                <p className="text-orange-500 text-sm flex items-center bg-orange-50 p-2 rounded-lg">
                                                    <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0"/>
                                                    {formik.errors.justification}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center space-x-2 ml-4">
                                            <div className={`w-20 bg-gray-200 rounded-full h-2 ${
                                                isCharacterCountError ? 'bg-orange-200' :
                                                    isCharacterCountWarning ? 'bg-yellow-200' : 'bg-lime-200'
                                            }`}>
                                                <div
                                                    className={`h-2 rounded-full transition-all ${
                                                        isCharacterCountError ? 'bg-orange-500' :
                                                            isCharacterCountWarning ? 'bg-yellow-500' : 'bg-lime-600'
                                                    }`}
                                                    style={{width: `${Math.min((characterCount / 150) * 100, 100)}%`}}
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

                                {/* Submit Button */}
                                <div className="border-t-2 border-gray-100 pt-6">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !formik.isValid}
                                        className={`w-full py-4 px-6 rounded-lg font-bold text-lg flex items-center justify-center transition-all ${
                                            isSubmitting || !formik.isValid
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-lime-600 to-emerald-600 text-white hover:from-lime-700 hover:to-emerald-700 shadow-lg hover:shadow-xl'
                                        }`}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div
                                                    className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                                                Submitting Request...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5 mr-3"/>
                                                Submit Community Request
                                            </>
                                        )}
                                    </button>

                                    <div className="text-center mt-4 space-y-1">
                                        <p className="text-gray-500 text-sm">
                                            🕒 Your request will be reviewed within <strong>5-7 business days</strong>
                                        </p>
                                        <p className="text-gray-400 text-xs">
                                            High-priority locations are processed first
                                        </p>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            <Footer/>
        </ProtectedRoute>
    );
}