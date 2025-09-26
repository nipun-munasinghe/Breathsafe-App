'use client'

import React, {useEffect, useState} from 'react';
import {useRouter} from "next/navigation";
import {CheckCircle, Clock, Plus, Users, XCircle} from 'lucide-react';
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import {ProtectedRoute} from "@/components/common/protectedRoute";
import {CommunityRequest} from "@/types/request";
import {RequestCard} from "@/components/requests/RequestCard";
import {FilterBar} from "@/components/requests/FilterBar";
import {getMyRequests} from "@/service/requestApi";
import {ViewRequestModal} from "@/components/requests/ViewRequestModel";
import {EditRequestModal} from "@/components/requests/EditRequestModel";

export default function MyRequests() {
    const router = useRouter();
    const [requests, setRequests] = useState<CommunityRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [selectedRequest, setSelectedRequest] = useState<CommunityRequest | null>(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);


    const fetchRequests = async () => {
        setIsLoading(true);
        try {
            const response = await getMyRequests();
            await new Promise(resolve => setTimeout(resolve, 500));
            setRequests(response?.data);
        } catch (error) {
            console.error('Failed to fetch requests:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const filteredRequests = requests.filter(request => {
        if (statusFilter === 'ALL') return true;
        return request.status === statusFilter;
    });

    const handleDelete = (id: number) => {
        setRequests(requests.filter(request => request.id !== id));
    };

    const handleView = (request: CommunityRequest) => {
        setSelectedRequest(request);
        setShowViewModal(true);
    };

    const handleCreateNew = () => {
        router.push('/create-request');
    };

    const handleEdit = (request: CommunityRequest) => {
        setSelectedRequest(request);
        setShowEditModal(true);
    };

    const handleSaveEdit = (updatedData: Partial<CommunityRequest>) => {
        if (selectedRequest) {
            setRequests(requests.map(req =>
                req.id === selectedRequest.id
                    ? { ...req, ...updatedData }
                    : req
            ));
            setShowEditModal(false);
            setSelectedRequest(null);
        }
    };

    return (
        <ProtectedRoute>
            <Header/>

            <main className="min-h-screen">
                <div className="container mx-auto px-4 py-8 max-w-7xl">

                    {/* Page Header */}
                    <div className="text-center mb-8 mt-20">
                        <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-lime-600">
                            <div className="flex flex-col lg:flex-row items-center justify-between">
                                <div className="flex items-center mb-4 lg:mb-0">
                                    <div
                                        className="bg-gradient-to-br from-lime-600 to-emerald-600 p-4 rounded-2xl mr-4 shadow-lg">
                                        <Users className="w-8 h-8 text-white"/>
                                    </div>
                                    <div className="text-left">
                                        <h1 className="text-4xl font-bold text-slate-900 mb-2">My Requests</h1>
                                        <p className="text-gray-600">Manage your community sensor requests</p>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCreateNew}
                                    className="bg-gradient-to-r from-lime-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center hover:from-lime-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
                                >
                                    <Plus className="w-5 h-5 mr-2"/>
                                    New Request
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <FilterBar
                        statusFilter={statusFilter}
                        onStatusFilterChange={setStatusFilter}
                        onRefresh={fetchRequests}
                        isLoading={isLoading}
                    />

                    {/* Content */}
                    {isLoading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="text-center">
                                <div
                                    className="animate-spin rounded-full h-12 w-12 border-2 border-lime-600 border-t-transparent mx-auto mb-4"></div>
                                <p className="text-gray-600">Loading your requests...</p>
                            </div>
                        </div>
                    ) : filteredRequests.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
                            <div
                                className="bg-gradient-to-br from-lime-100 to-emerald-100 p-6 rounded-2xl w-fit mx-auto mb-6">
                                <Users className="w-12 h-12 text-lime-700"/>
                            </div>
                            <h3 className="text-2xl font-semibold text-slate-900 mb-4">
                                {statusFilter === 'ALL' ? 'No requests yet' : `No ${statusFilter.toLowerCase()} requests`}
                            </h3>
                            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                {statusFilter === 'ALL'
                                    ? "You haven't submitted any community requests yet. Start by requesting a sensor for your area!"
                                    : `You don't have any ${statusFilter.toLowerCase()} requests at the moment.`
                                }
                            </p>
                            {statusFilter === 'ALL' && (
                                <button
                                    onClick={handleCreateNew}
                                    className="bg-gradient-to-r from-lime-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center mx-auto hover:from-lime-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
                                >
                                    <Plus className="w-5 h-5 mr-2"/>
                                    Create Your First Request
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {filteredRequests.map(request => (
                                <RequestCard
                                    key={request.id}
                                    request={request}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    onView={handleView}
                                />
                            ))}
                        </div>
                    )}

                    {/* Summary Stats */}
                    {requests.length > 0 && (
                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center">
                                <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2"/>
                                <p className="text-2xl font-bold text-slate-900">{requests.filter(r => r.status === 'PENDING').length}</p>
                                <p className="text-gray-600 text-sm">Pending Review</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center">
                                <CheckCircle className="w-8 h-8 text-lime-600 mx-auto mb-2"/>
                                <p className="text-2xl font-bold text-slate-900">{requests.filter(r => r.status === 'APPROVED').length}</p>
                                <p className="text-gray-600 text-sm">Approved</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center">
                                <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2"/>
                                <p className="text-2xl font-bold text-slate-900">{requests.filter(r => r.status === 'REJECTED').length}</p>
                                <p className="text-gray-600 text-sm">Rejected</p>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <ViewRequestModal
                request={selectedRequest}
                isOpen={showViewModal}
                onClose={() => {
                    setShowViewModal(false);
                    setSelectedRequest(null);
                }}
                onEdit={handleEdit}
            />

            <EditRequestModal
                request={selectedRequest}
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setSelectedRequest(null);
                }}
                onSave={handleSaveEdit}
            />

            <Footer/>
        </ProtectedRoute>
    );
}