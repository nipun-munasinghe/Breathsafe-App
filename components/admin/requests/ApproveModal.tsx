// Approve Modal Component
import React, {useState} from "react";
import {CommunityRequest} from "@/types/request";
import {CheckCircle} from "lucide-react";

interface Sensor {
    id: number;
    name: string;
    status: 'AVAILABLE' | 'INSTALLED' | 'MAINTENANCE';
    location?: string;
}

// Mock sensors data
const mockSensors: Sensor[] = [
    { id: 1, name: "AQM-2024-001", status: "AVAILABLE" },
    { id: 2, name: "AQM-2024-002", status: "AVAILABLE" },
    { id: 3, name: "AQM-2024-003", status: "INSTALLED", location: "Colombo Central" },
    { id: 4, name: "AQM-2024-004", status: "AVAILABLE" },
    { id: 5, name: "AQM-2024-005", status: "MAINTENANCE" },
];

export const ApproveModal: React.FC<{
    request: CommunityRequest | null;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (sensorId: number, comments: string) => void;
}> = ({request, isOpen, onClose, onConfirm}) => {
    const [selectedSensor, setSelectedSensor] = useState<number | null>(null);
    const [comments, setComments] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const availableSensors = mockSensors.filter(sensor => sensor.status === 'AVAILABLE');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSensor) return;

        setIsSubmitting(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay
            onConfirm(selectedSensor, comments);
            onClose();
            setSelectedSensor(null);
            setComments('');
        } catch (error) {
            console.error('Failed to approve request:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen || !request) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50000">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                <div className="bg-gradient-to-r from-lime-600 to-emerald-600 p-6 rounded-t-2xl">
                    <h2 className="text-xl font-bold text-white flex items-center">
                        <CheckCircle className="w-6 h-6 mr-2"/>
                        Approve Request
                    </h2>
                    <p className="text-lime-100 text-sm mt-1">{request.requestedLocation}</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Sensor *
                        </label>
                        <select
                            value={selectedSensor || ''}
                            onChange={(e) => setSelectedSensor(Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-600 focus:border-lime-600 outline-none"
                            required
                        >
                            <option value="">Choose available sensor...</option>
                            {availableSensors.map(sensor => (
                                <option key={sensor.id} value={sensor.id}>
                                    {sensor.name} - {sensor.status}
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                            {availableSensors.length} sensors available for installation
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Admin Comments (Optional)
                        </label>
                        <textarea
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            rows={3}
                            placeholder="Add any comments about the approval..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-600 focus:border-lime-600 outline-none resize-none"
                        />
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
                            disabled={!selectedSensor || isSubmitting}
                            className="flex-1 px-4 py-2 bg-lime-600 text-white hover:bg-lime-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isSubmitting ? (
                                <>
                                    <div
                                        className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                    Approving...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-4 h-4 mr-2"/>
                                    Approve Request
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};