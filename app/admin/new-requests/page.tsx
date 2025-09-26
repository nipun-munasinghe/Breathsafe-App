"use client";

import React, {useRef, useState} from "react";
import {CardPendingRequestsRef, CommunityRequest} from "@/types/request";
import {CardPendingRequests} from "@/components/admin/requests/CardPendingRequests";
import {ApproveModal} from "@/components/admin/requests/ApproveModal";
import {RejectModal} from "@/components/admin/requests/RejectModal";
import {approveRequest, rejectRequest} from "@/service/requestApi";
import ToastUtils from "@/utils/toastUtils";

const AdminRequests: React.FC = () => {
    const [selectedRequest, setSelectedRequest] = useState<CommunityRequest | null>(null);
    const [showApproveModal, setShowApproveModal] = useState(true);
    const [showRejectModal, setShowRejectModal] = useState(false);

    const cardRef = useRef<CardPendingRequestsRef>(null);

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

    const handleApproveRequest = async (sensorId: number, comments: string) => {
        const response = await approveRequest({sensorId, adminComments: comments}, selectedRequest!.id)
        if (response?.success) {
            ToastUtils.success("Request approved successfully");
            cardRef.current?.refetch();
        }
    };

    const handleRejectRequest = async (comments: string) => {
        const response = await rejectRequest({sensorId: 0, adminComments: comments}, selectedRequest!.id)
        if (response?.success) {
            ToastUtils.success("Request rejected successfully");
            cardRef.current?.refetch();
        }
    };

    return (
        <>
            <div className="w-full mb-12 xl:mb-0 px-4">
                <CardPendingRequests
                    ref={cardRef}
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