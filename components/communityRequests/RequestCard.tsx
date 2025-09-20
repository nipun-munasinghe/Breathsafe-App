import React, {useState} from "react";
import {CommunityRequest} from "@/types/request";
import {Calendar, Edit3, Eye, MapPin, MessageCircle, MessageSquare, Radar, Trash2} from "lucide-react";
import {StatusBadge} from "@/components/communityRequests/StatusBadge"
import {deleteRequest} from "@/service/requestApi";
import ToastUtils from "@/utils/toastUtils";

export const RequestCard: React.FC<{
    request: CommunityRequest;
    onEdit: (request: CommunityRequest) => void;
    onDelete: (id: number) => void;
    onView: (request: CommunityRequest) => void;
}> = ({request, onEdit, onDelete, onView}) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this request? This action cannot be undone.')) {
            return;
        }

        setIsDeleting(true);
        try {
            await deleteRequest(request.id);
            await new Promise(resolve => setTimeout(resolve, 500));
            ToastUtils.success("Request deleted successfully.");
            onDelete(request.id);
        } catch (error) {
            console.error('Failed to delete request:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const canEdit = request.status === 'PENDING';
    const canDelete = request.status === 'PENDING';

    return (
        <div
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
            <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <div className="flex items-center mb-2">
                            <MapPin className="w-5 h-5 text-lime-600 mr-2"/>
                            <h3 className="text-xl font-semibold text-slate-900">{request.requestedLocation}</h3>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                            <Calendar className="w-4 h-4 mr-1"/>
                            Created: {formatDate(request.createdAt)}
                        </div>
                        <StatusBadge status={request.status}/>
                    </div>

                    <div className="flex space-x-2 ml-4">
                        <button
                            onClick={() => onView(request)}
                            className="p-2 text-gray-600 hover:text-lime-600 hover:bg-lime-50 rounded-lg transition-colors"
                            title="View Details"
                        >
                            <Eye className="w-4 h-4"/>
                        </button>
                        {canEdit && (
                            <button
                                onClick={() => onEdit(request)}
                                className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit Request"
                            >
                                <Edit3 className="w-4 h-4"/>
                            </button>
                        )}
                        {canDelete && (
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                title="Delete Request"
                            >
                                {isDeleting ? (
                                    <div
                                        className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent"/>
                                ) : (
                                    <Trash2 className="w-4 h-4"/>
                                )}
                            </button>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                    <div className="flex items-start">
                        <MessageSquare className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0"/>
                        <p className="text-gray-700 text-sm leading-relaxed">{request.justification}</p>
                    </div>

                    <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mr-1"/>
                        <span>Coordinates: {request.latitude.toFixed(4)}, {request.longitude.toFixed(4)}</span>
                    </div>
                </div>

                {/* Status-specific content */}
                {request.status === 'APPROVED' && request.sensorName && (
                    <div className="mt-4 p-3 bg-lime-50 rounded-lg border border-lime-200">
                        <div className="flex items-center text-sm text-lime-800">
                            <Radar className="w-4 h-4 mr-2"/>
                            <span className="font-medium">Sensor Installed: {request.sensorName}</span>
                        </div>
                        <p className="text-xs text-lime-600 mt-1">
                            Approved on {request.approvedAt && formatDate(request.approvedAt)}
                            {request.approvedByName && ` by ${request.approvedByName}`}
                        </p>
                    </div>
                )}

                {request.status === 'REJECTED' && request.adminComments && (
                    <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
                        <div className="flex items-start">
                            <MessageCircle className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0"/>
                            <div>
                                <p className="text-sm font-medium text-red-800 mb-1">Admin Comments:</p>
                                <p className="text-sm text-red-700">{request.adminComments}</p>
                                <p className="text-xs text-red-600 mt-1">
                                    Rejected on {request.rejectedAt && formatDate(request.rejectedAt)}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};