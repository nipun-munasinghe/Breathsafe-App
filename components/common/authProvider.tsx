'use client';

import { ReactNode, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

interface AuthProviderProps {
    children: ReactNode;
}

// Initialize auth data when page reloads
export default function AuthProvider({ children }: AuthProviderProps) {
    const initialize = useAuthStore((state) => state.initialize);

    useEffect(() => {
        initialize();
    }, [initialize]);

    return <>{children}</>;
}
