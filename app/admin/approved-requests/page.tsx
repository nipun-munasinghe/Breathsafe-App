"use client";

import React, {useRef} from "react";
import {CardPendingRequestsRef} from "@/types/request";
import {CardPendingRequests} from "@/components/admin/requests/CardPendingRequests";
const AdminRequests: React.FC = () => {

    const cardRef = useRef<CardPendingRequestsRef>(null);


    return (
        <>
            <div className="w-full mb-12 xl:mb-0 px-4">
                <CardPendingRequests
                    ref={cardRef}
                    onApprove={()=>{}}
                    onReject={()=>{}}
                    isPending={false}
                />
            </div>
        </>
    );
};

export default AdminRequests;