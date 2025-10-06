import {AlertTriangle, CheckCircle, XCircle} from "lucide-react";

export interface SensorData {
    sensorId: number;
    name: string;
    location: string;
    latitude: number;
    longitude: number;
    status: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE';
    isActive: boolean;
    temperature: number;
    humidity: number;
    co2Level: number;
    aqiValue: number;
    aqiCategory: 'GOOD' | 'MODERATE' | 'UNHEALTHY_FOR_SENSITIVE' | 'UNHEALTHY' | 'VERY_UNHEALTHY' | 'HAZARDOUS';
    dataTimestamp: string;
}

export const statusConfig = {
    ONLINE: {
        color: '#65A30D',
        icon: CheckCircle,
        label: 'Online'
    },
    OFFLINE: {
        color: '#DC2626',
        icon: XCircle,
        label: 'Offline'
    },
    MAINTENANCE: {
        color: '#F59E0B',
        icon: AlertTriangle,
        label: 'Maintenance'
    }
};

export const aqiConfig = {
    GOOD: {
        color: '#65A30D',
        bgColor: '#D9F99D',
        textColor: '#064E3B',
        label: 'Good',
        range: '0-50'
    },
    MODERATE: {
        color: '#F59E0B',
        bgColor: '#FEF3C7',
        textColor: '#92400E',
        label: 'Moderate',
        range: '51-100'
    },
    UNHEALTHY_FOR_SENSITIVE: {
        color: '#F97316',
        bgColor: '#FFEDD5',
        textColor: '#9A3412',
        label: 'Unhealthy for Sensitive Groups',
        range: '101-150'
    },
    UNHEALTHY: {
        color: '#DC2626',
        bgColor: '#FEE2E2',
        textColor: '#991B1B',
        label: 'Unhealthy',
        range: '151-200'
    },
    VERY_UNHEALTHY: {
        color: '#7C2D12',
        bgColor: '#FED7D7',
        textColor: '#7C2D12',
        label: 'Very Unhealthy',
        range: '201-300'
    },
    HAZARDOUS: {
        color: '#4C1D95',
        bgColor: '#EDE9FE',
        textColor: '#4C1D95',
        label: 'Hazardous',
        range: '301+'
    }
};