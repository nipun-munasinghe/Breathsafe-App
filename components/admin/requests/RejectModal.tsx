import React, {useState} from "react";
import {CommunityRequest} from "@/types/request";
import {XCircle} from "lucide-react";

export const RejectModal: React.FC<{
    request: CommunityRequest | null;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (comments: string) => void;
}> = ({request, isOpen, onClose, onConfirm}) => {
    const [comments, setComments] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!comments.trim()) return;

        setIsSubmitting(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay
            onConfirm(comments);
            onClose();
            setComments('');
        } catch (error) {
            console.error('Failed to reject request:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen || !request) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-t-2xl">
                    <h2 className="text-xl font-bold text-white flex items-center">
                        <XCircle className="w-6 h-6 mr-2"/>
                        Reject Request
                    </h2>
                    <p className="text-red-100 text-sm mt-1">{request.requestedLocation}</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Reason for Rejection *
                        </label>
                        <textarea
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            rows={4}
                            placeholder="Please provide a clear explanation for rejecting this request..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            This will be shown to the requester
                        </p>
                    </div>

                    <div className="flex space-x-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!comments.trim() || isSubmitting}
                            className="flex-1 px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isSubmitting ? (
                                <>
                                    <div
                                        className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                    Rejecting...
                                </>
                            ) : (
                                <>
                                    <XCircle className="w-4 h-4 mr-2"/>
                                    Reject Request
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};