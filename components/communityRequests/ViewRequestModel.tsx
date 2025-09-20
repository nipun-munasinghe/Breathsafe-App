import {CommunityRequest} from "@/types/request";
import {
    CheckCircle,
    Clock,
    Edit3,
    ExternalLink, Info,
    MapIcon,
    MapPin,
    MessageCircle,
    MessageSquare,
    Radar, User, X
} from "lucide-react";
import {StatusBadge} from "@/components/communityRequests/StatusBadge";
import React from "react";

export const ViewRequestModal: React.FC<{
    request: CommunityRequest | null;
    isOpen: boolean;
    onClose: () => void;
    onEdit: (request: CommunityRequest) => void;
}> = ({ request, isOpen, onClose, onEdit }) => {
    if (!isOpen || !request) return null;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short'
        });
    };

    const openInMaps = () => {
        const url = `https://www.google.com/maps?q=${request.latitude},${request.longitude}`;
        window.open(url, '_blank');
    };

    const canEdit = request.status === 'PENDING';

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-20050">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-lime-600 to-emerald-600 p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center text-white">
                            <MapPin className="w-6 h-6 mr-3" />
                            <div>
                                <h2 className="text-2xl font-bold">{request.requestedLocation}</h2>
                                <p className="text-lime-100 text-sm">Request ID: #{request.id}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:text-lime-200 p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                        <StatusBadge status={request.status} />
                        {canEdit && (
                            <button
                                onClick={() => {
                                    onEdit(request);
                                    onClose();
                                }}
                                className="bg-white text-lime-700 px-4 py-2 rounded-lg font-medium hover:bg-lime-50 transition-colors flex items-center"
                            >
                                <Edit3 className="w-4 h-4 mr-2" />
                                Edit Request
                            </button>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">

                    {/* Location Details */}
                    <div className="bg-slate-50 rounded-xl p-4">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                            <MapIcon className="w-5 h-5 mr-2 text-lime-600" />
                            Location Details
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Requested Location</label>
                                <p className="text-slate-900 font-medium">{request.requestedLocation}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Coordinates</label>
                                <div className="flex items-center justify-between">
                                    <p className="text-slate-900 font-mono text-sm">
                                        {request.latitude.toFixed(6)}, {request.longitude.toFixed(6)}
                                    </p>
                                    <button
                                        onClick={openInMaps}
                                        className="text-lime-600 hover:text-lime-700 p-1 hover:bg-lime-50 rounded transition-colors"
                                        title="Open in Google Maps"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Mini Map Placeholder */}
                        <div className="mt-4 bg-gradient-to-br from-green-100 to-orange-100 rounded-lg h-48 flex items-center justify-center border-2 border-dashed border-gray-300">
                            <div className="text-center">
                                <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-500 font-medium">Map Preview</p>
                                <p className="text-gray-400 text-sm">Click coordinates to view in maps</p>
                            </div>
                        </div>
                    </div>

                    {/* Justification */}
                    <div className="bg-blue-50 rounded-xl p-4">
                        <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                            <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
                            Justification
                        </h3>
                        <p className="text-gray-700 leading-relaxed">{request.justification}</p>
                        <div className="mt-2 text-sm text-gray-500">
                            Length: {request.justification.length} characters
                        </div>
                    </div>

                    {/* Request Timeline */}
                    <div className="bg-gray-50 rounded-xl p-4">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                            <Clock className="w-5 h-5 mr-2 text-gray-600" />
                            Request Timeline
                        </h3>

                        <div className="space-y-3">
                            <div className="flex items-start">
                                <div className="bg-blue-500 w-3 h-3 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                <div>
                                    <p className="font-medium text-slate-900">Request Created</p>
                                    <p className="text-sm text-gray-600">{formatDate(request.createdAt)}</p>
                                    <p className="text-sm text-gray-500">By {request.requesterName}</p>
                                </div>
                            </div>

                            {request.updatedAt !== request.createdAt && (
                                <div className="flex items-start">
                                    <div className="bg-yellow-500 w-3 h-3 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                    <div>
                                        <p className="font-medium text-slate-900">Request Updated</p>
                                        <p className="text-sm text-gray-600">{formatDate(request.updatedAt)}</p>
                                    </div>
                                </div>
                            )}

                            {request.status === 'APPROVED' && request.approvedAt && (
                                <div className="flex items-start">
                                    <div className="bg-green-500 w-3 h-3 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                    <div>
                                        <p className="font-medium text-slate-900">Request Approved</p>
                                        <p className="text-sm text-gray-600">{formatDate(request.approvedAt)}</p>
                                        {request.approvedByName && (
                                            <p className="text-sm text-gray-500">By {request.approvedByName}</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {request.status === 'REJECTED' && request.rejectedAt && (
                                <div className="flex items-start">
                                    <div className="bg-red-500 w-3 h-3 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                    <div>
                                        <p className="font-medium text-slate-900">Request Rejected</p>
                                        <p className="text-sm text-gray-600">{formatDate(request.rejectedAt)}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Status-specific sections */}
                    {request.status === 'APPROVED' && request.sensorName && (
                        <div className="bg-lime-50 rounded-xl p-4 border border-lime-200">
                            <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                                <Radar className="w-5 h-5 mr-2 text-lime-600" />
                                Sensor Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Sensor Name</label>
                                    <p className="text-slate-900 font-medium">{request.sensorName}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Sensor ID</label>
                                    <p className="text-slate-900 font-mono">#{request.sensorId}</p>
                                </div>
                            </div>
                            <div className="mt-4 p-3 bg-white rounded-lg border border-lime-300">
                                <div className="flex items-center text-lime-800">
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    <span className="text-sm font-medium">Sensor is now actively monitoring air quality at this location</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {request.status === 'REJECTED' && request.adminComments && (
                        <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                            <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                                <MessageCircle className="w-5 h-5 mr-2 text-red-600" />
                                Admin Feedback
                            </h3>
                            <div className="bg-white p-4 rounded-lg border border-red-300">
                                <p className="text-red-800">{request.adminComments}</p>
                            </div>
                            <div className="mt-3 text-sm text-red-600">
                                <Info className="w-4 h-4 inline mr-1" />
                                You can submit a new request with the suggested improvements
                            </div>
                        </div>
                    )}

                    {request.status === 'PENDING' && (
                        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                            <h3 className="text-lg font-semibold text-slate-900 mb-2 flex items-center">
                                <Clock className="w-5 h-5 mr-2 text-yellow-600" />
                                Review Status
                            </h3>
                            <p className="text-yellow-800 mb-3">Your request is currently under review by our team.</p>
                            <div className="bg-white p-3 rounded-lg border border-yellow-300">
                                <p className="text-sm text-yellow-700">
                                    <strong>Expected Timeline:</strong> 5-7 business days
                                    <br />
                                    <strong>Priority Factors:</strong> Population density, environmental impact, community benefit
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 rounded-b-2xl border-t border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                            <User className="w-4 h-4 inline mr-1" />
                            Requested by {request.requesterName}
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                Close
                            </button>
                            {canEdit && (
                                <button
                                    onClick={() => {
                                        onEdit(request);
                                        onClose();
                                    }}
                                    className="px-4 py-2 bg-lime-600 text-white hover:bg-emerald-950 rounded-lg transition-colors flex items-center"
                                >
                                    <Edit3 className="w-4 h-4 mr-1" />
                                    Edit Request
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};