'use client';

import { useRequireAuth } from '@/hooks/useAuth';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function DashboardPage() {
    const { user, isLoading } = useRequireAuth();
    const router = useRouter();
    const [stats, setStats] = useState({
        totalTransactions: 0,
        totalGains: 0,
        totalLosses: 0,
        taxOwed: 0
    });

    useEffect(() => {
        // Placeholder for fetching user stats
        // In a real app, this would fetch from your API
        setStats({
            totalTransactions: 0,
            totalGains: 0,
            totalLosses: 0,
            taxOwed: 0
        });
    }, [user]);

    const handleSignOut = async () => {
        try {
            await signOut({ redirect: false });
            toast.success('ログアウトしました');
            router.push('/');
        } catch {
            toast.error('ログアウトに失敗しました');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-surface">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface">
            {/* Navigation */}
            <nav className="bg-surface-secondary shadow-sm border-b border-default">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-primary">
                                Blockzei
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-text-secondary">
                                {user?.email}
                            </span>
                            <button
                                onClick={handleSignOut}
                                className="text-sm text-text-secondary hover:text-text-primary"
                            >
                                ログアウト
                            </button>
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Welcome Section */}
                <div className="px-4 py-6 sm:px-0">
                    <div className="border-2 border-dashed border-primary/20 rounded-lg p-8 bg-surface-secondary">
                        <h2 className="text-2xl font-bold text-text-primary mb-4">
                            ようこそ、{user?.name || user?.email}さん
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                            {/* Stats Cards */}
                            <div className="bg-surface overflow-hidden shadow rounded-lg border border-default">
                                <div className="px-4 py-5 sm:p-6">
                                    <dt className="text-sm font-medium text-text-secondary truncate">
                                        総取引数
                                    </dt>
                                    <dd className="mt-1 text-3xl font-semibold text-text-primary">
                                        {stats.totalTransactions}
                                    </dd>
                                </div>
                            </div>

                            <div className="bg-surface overflow-hidden shadow rounded-lg border border-default">
                                <div className="px-4 py-5 sm:p-6">
                                    <dt className="text-sm font-medium text-text-secondary truncate">
                                        総利益
                                    </dt>
                                    <dd className="mt-1 text-3xl font-semibold text-success">
                                        ¥{stats.totalGains.toLocaleString()}
                                    </dd>
                                </div>
                            </div>

                            <div className="bg-surface overflow-hidden shadow rounded-lg border border-default">
                                <div className="px-4 py-5 sm:p-6">
                                    <dt className="text-sm font-medium text-text-secondary truncate">
                                        総損失
                                    </dt>
                                    <dd className="mt-1 text-3xl font-semibold text-error">
                                        ¥{stats.totalLosses.toLocaleString()}
                                    </dd>
                                </div>
                            </div>

                            <div className="bg-surface overflow-hidden shadow rounded-lg border border-default">
                                <div className="px-4 py-5 sm:p-6">
                                    <dt className="text-sm font-medium text-text-secondary truncate">
                                        推定税額
                                    </dt>
                                    <dd className="mt-1 text-3xl font-semibold text-text-primary">
                                        ¥{stats.taxOwed.toLocaleString()}
                                    </dd>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-8 flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => router.push('/wallets')}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            >
                                ウォレットを接続
                            </button>
                            <button
                                onClick={() => router.push('/transactions')}
                                className="inline-flex items-center px-4 py-2 border border-default text-sm font-medium rounded-md text-text-primary bg-surface hover:bg-surface-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            >
                                取引履歴を確認
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}