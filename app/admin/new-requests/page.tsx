"use client";

import React, {useState} from "react";
import {CommunityRequest} from "@/types/request";
import {CardPendingRequests} from "@/components/admin/requests/CardPendingRequests";
import {ApproveModal} from "@/components/admin/requests/ApproveModal";
import {RejectModal} from "@/components/admin/requests/RejectModal";

const AdminRequests: React.FC = () => {
    const [selectedRequest, setSelectedRequest] = useState<CommunityRequest | null>(null);
    const [showApproveModal, setShowApproveModal] = useState(true);
    const [showRejectModal, setShowRejectModal] = useState(false);

    const handleApprove = (request: CommunityRequest) => {
        console.log('Opening approve modal for request:', request.id);
        setSelectedRequest(request);
        setShowApproveModal(true);
    };

    const handleReject = (request: CommunityRequest) => {
        console.log('Opening reject modal for request:', request.id);
        setSelectedRequest(request);
        setShowRejectModal(true);
    };

    const handleApproveRequest = (sensorId: number, comments: string) => {
        console.log('Approving request:', selectedRequest?.id, 'with sensor:', sensorId, 'comments:', comments);
        // Add your API call here
    };

    const handleRejectRequest = (comments: string) => {
        console.log('Rejecting request:', selectedRequest?.id, 'with comments:', comments);
        // Add your API call here
    };

    return (
        <>
            <div className="w-full mb-12 xl:mb-0 px-4">
                <CardPendingRequests
                    onApprove={handleApprove}
                    onReject={handleReject}
                />
            </div>

            {/* Modals */}
            <ApproveModal
                request={selectedRequest}
                isOpen={showApproveModal}
                onClose={() => {
                    setShowApproveModal(false);
                    setSelectedRequest(null);
                }}
                onConfirm={handleApproveRequest}
            />

            <RejectModal
                request={selectedRequest}
                isOpen={showRejectModal}
                onClose={() => {
                    setShowRejectModal(false);
                    setSelectedRequest(null);
                }}
                onConfirm={handleRejectRequest}
            />
        </>
    );
};

export default AdminRequests;