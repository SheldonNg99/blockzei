'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useAuth(redirectTo?: string) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (redirectTo && status === 'unauthenticated') {
            router.push(redirectTo);
        }
    }, [status, redirectTo, router]);

    return {
        user: session?.user,
        isAuthenticated: status === 'authenticated',
        isLoading: status === 'loading',
    };
}

export function useRequireAuth(redirectTo: string = '/login') {
    const { user, isLoading } = useAuth(redirectTo);
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push(redirectTo);
        }
    }, [user, isLoading, redirectTo, router]);

    return { user, isLoading };
}