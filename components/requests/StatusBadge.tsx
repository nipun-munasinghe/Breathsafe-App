import React from "react";
import {CommunityRequest} from "@/types/request";
import {CheckCircle, Clock, XCircle} from "lucide-react";

export const StatusBadge: React.FC<{ status: CommunityRequest['status'] }> = ({status}) => {
    const configs = {
        PENDING: {
            bg: 'bg-yellow-100',
            text: 'text-yellow-800',
            border: 'border-yellow-200',
            icon: Clock,
            label: 'Pending Review'
        },
        APPROVED: {
            bg: 'bg-lime-100',
            text: 'text-lime-800',
            border: 'border-lime-200',
            icon: CheckCircle,
            label: 'Approved'
        },
        REJECTED: {
            bg: 'bg-red-100',
            text: 'text-red-800',
            border: 'border-red-200',
            icon: XCircle,
            label: 'Rejected'
        }
    };

    const config = configs[status];
    const Icon = config.icon;

    return (
        <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.bg} ${config.text} ${config.border}`}>
      <Icon className="w-4 h-4 mr-1"/>
            {config.label}
    </span>
    );
};