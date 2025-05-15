// app/pricing/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import { CheckIcon } from 'lucide-react';

const FREE_FEATURES = [
    '1ウォレット接続',
    '基本的な取引履歴',
    '月100件の取引まで',
    '基本的な税金計算',
    'コミュニティサポート'
];

const PRO_FEATURES = [
    '無制限のウォレット接続',
    '無制限の取引数',
    '詳細な税金最適化レポート',
    '優先サポート',
    '高度な取引分類',
    'カスタムレポート生成',
    'APIアクセス',
    '早期アクセス to 新機能'
];

export default function PricingPage() {
    const router = useRouter();
    const { user } = useAuth();

    const handleSelectPlan = (plan: 'free' | 'pro') => {
        if (!user) {
            toast('ログインしてください');
            router.push('/login');
            return;
        }

        if (plan === 'free') {
            router.push('/dashboard');
        } else {
            // TODO: Implement PayPal subscription flow
            toast.success('Pro プランへのアップグレードは準備中です');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                        最適なプランを選択
                    </h2>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                        あなたのニーズに合わせた料金プランをご用意しています
                    </p>
                </div>

                <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto">
                    {/* Free Plan */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm divide-y divide-gray-200 dark:divide-gray-700">
                        <div className="p-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                                フリープラン
                            </h3>
                            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                                個人投資家向けの基本機能
                            </p>
                            <p className="mt-8">
                                <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                                    ¥0
                                </span>
                                <span className="text-base font-medium text-gray-500 dark:text-gray-400">
                                    /月
                                </span>
                            </p>
                            <button
                                onClick={() => handleSelectPlan('free')}
                                className="mt-8 block w-full bg-gray-800 dark:bg-gray-600 text-white py-2 px-4 border border-gray-800 dark:border-gray-600 rounded-md text-sm font-medium hover:bg-gray-700 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            >
                                フリープランで始める
                            </button>
                        </div>
                        <div className="pt-6 pb-8 px-6">
                            <h4 className="text-xs font-medium text-gray-900 dark:text-white tracking-wide uppercase">
                                含まれる機能
                            </h4>
                            <ul className="mt-6 space-y-4">
                                {FREE_FEATURES.map((feature) => (
                                    <li key={feature} className="flex space-x-3">
                                        <CheckIcon className="flex-shrink-0 h-5 w-5 text-green-500" />
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Pro Plan */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm divide-y divide-gray-200 dark:divide-gray-700">
                        <div className="p-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                                プロプラン
                            </h3>
                            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                                本格的な投資家向けの高度な機能
                            </p>
                            <p className="mt-8">
                                <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                                    ¥4,980
                                </span>
                                <span className="text-base font-medium text-gray-500 dark:text-gray-400">
                                    /月
                                </span>
                            </p>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                年払い ¥54,780（10%割引）
                            </p>
                            <button
                                onClick={() => handleSelectPlan('pro')}
                                className="mt-8 block w-full bg-indigo-600 text-white py-2 px-4 border border-indigo-600 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                プロプランにアップグレード
                            </button>
                        </div>
                        <div className="pt-6 pb-8 px-6">
                            <h4 className="text-xs font-medium text-gray-900 dark:text-white tracking-wide uppercase">
                                含まれる機能
                            </h4>
                            <ul className="mt-6 space-y-4">
                                {PRO_FEATURES.map((feature) => (
                                    <li key={feature} className="flex space-x-3">
                                        <CheckIcon className="flex-shrink-0 h-5 w-5 text-green-500" />
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}