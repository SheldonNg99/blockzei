// app/dashboard/page.tsx
'use client';

import { useRequireAuth } from '@/hooks/useAuth';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';

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
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Navigation */}
            <nav className="bg-white dark:bg-gray-800 shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                                Blockzei
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                {user?.email}
                            </span>
                            <button
                                onClick={handleSignOut}
                                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                ログアウト
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Welcome Section */}
                <div className="px-4 py-6 sm:px-0">
                    <div className="border-4 border-dashed border-gray-200 dark:border-gray-700 rounded-lg h-96 p-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            ようこそ、{user?.name || user?.email}さん
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                            {/* Stats Cards */}
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                        総取引数
                                    </dt>
                                    <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                                        {stats.totalTransactions}
                                    </dd>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                        総利益
                                    </dt>
                                    <dd className="mt-1 text-3xl font-semibold text-green-600 dark:text-green-400">
                                        ¥{stats.totalGains.toLocaleString()}
                                    </dd>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                        総損失
                                    </dt>
                                    <dd className="mt-1 text-3xl font-semibold text-red-600 dark:text-red-400">
                                        ¥{stats.totalLosses.toLocaleString()}
                                    </dd>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                        推定税額
                                    </dt>
                                    <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                                        ¥{stats.taxOwed.toLocaleString()}
                                    </dd>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-8 flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => router.push('/wallets')}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                ウォレットを接続
                            </button>
                            <button
                                onClick={() => router.push('/transactions')}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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