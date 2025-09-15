'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

type ProtectedRouteProps = {
    children: ReactNode;
    requiredRole?: string;
};

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
    const router = useRouter();
    const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
    const isInitialized = useAuthStore((s) => s.isInitialized);
    const user = useAuthStore((s) => s.user);
    const [isAllowed, setIsAllowed] = useState(false);

    useEffect(() => {
        if (!isInitialized) return;

        if (!isLoggedIn) {
            console.log('not logged in');
            router.replace('/login');
            return;
        }

        const userRole = user?.role;
        const isAdmin = userRole === 'ADMIN';

        if (
            requiredRole &&
            !isAdmin && // Admin can access anything
            userRole !== requiredRole // role mismatch
        ) {
            router.replace('/unauthorized');
        } else {
            setIsAllowed(true);
        }
    }, [isLoggedIn, user, requiredRole, router, isInitialized]);

    if (!isInitialized) return null; // or a spinner
    if (!isAllowed) return null; // loading fallback or spinner

    return <>{children}</>;
}
