import React, {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import {CardPendingRequestsRef, CommunityRequest} from "@/types/request";
import {Calendar, CheckCircle, Clock, ExternalLink, MapPin, RefreshCw, Search, XCircle} from "lucide-react";
import {getAllRequests} from "@/service/requestApi";
import {apiResponse} from "@/types/common";

export const CardPendingRequests = forwardRef<CardPendingRequestsRef, {
    onApprove: (request: CommunityRequest) => void;
    onReject: (request: CommunityRequest) => void;
}>(({ onApprove, onReject }, ref) => {
    const [requests, setRequests] = useState<CommunityRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = async () => {
        try {
            const response: apiResponse<CommunityRequest[]> | null = await getAllRequests();
            setTimeout(() => {
                const data = response?.data ?? [];
                setRequests(
                    data.filter((req: CommunityRequest) => req.status === "PENDING") || []
                );
                setIsLoading(false);
            }, 1000);
        } catch (error) {
            console.error("Failed to fetch requests", error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useImperativeHandle(ref, () => ({
        refetch: fetchData
    }));

    const filteredRequests = requests.filter(request =>
        request.requestedLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.requesterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.justification.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const openInMaps = (lat: number, lng: number) => {
        window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
    };

    const handleApprove = (request: CommunityRequest) => {
        onApprove(request);
    };

    const handleReject = (request: CommunityRequest) => {
        onReject(request);
    };

    return (
        <div
            className="relative flex flex-col break-words bg-white w-full mb-6 shadow-lg rounded-2xl border border-gray-100">
            <div className="rounded-t-2xl mb-0 px-6 py-6 border-0">
                <div className="flex flex-wrap items-center">
                    <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-3 rounded-xl mr-4">
                                    <Clock className="w-6 h-6 text-white"/>
                                </div>
                                <div>
                                    <h3 className="font-bold text-2xl text-slate-900">Pending Requests</h3>
                                    <p className="text-gray-600">Review and manage community sensor requests</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <Search
                                        className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"/>
                                    <input
                                        type="text"
                                        placeholder="Search requests..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-600 focus:border-lime-600 outline-none w-64"
                                    />
                                </div>

                                <button
                                    onClick={() => fetchData()}
                                    className="bg-lime-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-950 transition-colors flex items-center"
                                >
                                    <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}/>
                                    Refresh
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="block w-full overflow-x-auto">
                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="text-center">
                            <div
                                className="animate-spin rounded-full h-12 w-12 border-2 border-lime-600 border-t-transparent mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading requests...</p>
                        </div>
                    </div>
                ) : filteredRequests.length === 0 ? (
                    <div className="text-center py-12">
                        <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4"/>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Pending Requests</h3>
                        <p className="text-gray-500">All requests have been reviewed</p>
                    </div>
                ) : (
                    <table className="items-center bg-transparent w-full border-collapse">
                        <thead>
                        <tr>
                            <th className="px-6 bg-slate-50 text-slate-500 align-middle border border-solid border-slate-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                Request Details
                            </th>
                            <th className="px-6 bg-slate-50 text-slate-500 align-middle border border-solid border-slate-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                Location
                            </th>
                            <th className="px-6 bg-slate-50 text-slate-500 align-middle border border-solid border-slate-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                Justification
                            </th>
                            <th className="px-6 bg-slate-50 text-slate-500 align-middle border border-solid border-slate-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                Actions
                            </th>
                        </tr>
                        </thead>

                        <tbody>
                        {filteredRequests.map((request) => (
                            <tr key={request.id} className="hover:bg-slate-50 transition-colors">
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                    <div className="flex items-center">
                                        <div
                                            className="bg-gradient-to-br from-blue-500 to-blue-600 w-10 h-10 rounded-full flex items-center justify-center mr-4">
                                            <span className="text-white font-bold text-sm">#{request.id}</span>
                                        </div>
                                        <div>
                        <span className="font-bold text-slate-600">
                          {request.requesterName}
                        </span>
                                            <div className="text-xs text-gray-500 flex items-center mt-1">
                                                <Calendar className="w-3 h-3 mr-1"/>
                                                {formatDate(request.createdAt)}
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                    <div>
                                        <div className="flex items-center mb-1">
                                            <MapPin className="w-4 h-4 text-lime-600 mr-1"/>
                                            <span
                                                className="font-semibold text-slate-700">{request.requestedLocation}</span>
                                        </div>
                                        <div className="flex items-center text-gray-500">
                        <span className="font-mono text-xs">
                          {request.latitude.toFixed(4)}, {request.longitude.toFixed(4)}
                        </span>
                                            <button
                                                onClick={() => openInMaps(request.latitude, request.longitude)}
                                                className="ml-2 text-lime-600 hover:text-lime-700 p-1 hover:bg-lime-50 rounded"
                                            >
                                                <ExternalLink className="w-3 h-3"/>
                                            </button>
                                        </div>
                                    </div>
                                </td>

                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 max-w-xs">
                                    <div className="text-gray-700">
                                        <p className="line-clamp-2">{request.justification}</p>
                                        <span className="text-gray-400 mt-1">
                        {request.justification.length} chars
                      </span>
                                    </div>
                                </td>

                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleApprove(request)}
                                            className="bg-lime-600 text-white px-4 py-2 rounded-lg hover:bg-lime-700 transition-colors flex items-center text-xs font-medium"
                                        >
                                            <CheckCircle className="w-3 h-3 mr-1"/>
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleReject(request)}
                                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center text-xs font-medium"
                                        >
                                            <XCircle className="w-3 h-3 mr-1"/>
                                            Reject
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
});

CardPendingRequests.displayName = "CardPendingRequests";