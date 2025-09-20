import React from "react";
import {Filter, RefreshCw} from "lucide-react";

export const FilterBar: React.FC<{
    statusFilter: string;
    onStatusFilterChange: (status: string) => void;
    onRefresh: () => void;
    isLoading: boolean;
}> = ({statusFilter, onStatusFilterChange, onRefresh, isLoading}) => {
    return (
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6 border border-gray-100">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                    <Filter className="w-5 h-5 text-gray-600"/>
                    <select
                        value={statusFilter}
                        onChange={(e) => onStatusFilterChange(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-600 focus:border-lime-600 outline-none"
                    >
                        <option value="ALL">All Requests</option>
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                    </select>
                </div>

                <button
                    onClick={onRefresh}
                    disabled={isLoading}
                    className="flex items-center px-4 py-2 bg-lime-600 text-white rounded-lg hover:bg-emerald-950 transition-colors disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}/>
                    Refresh
                </button>
            </div>
        </div>
    );
};