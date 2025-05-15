// app/pricing/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import { CheckIcon } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import Link from 'next/link';

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
        <div className="min-h-screen bg-surface">
            {/* Navigation */}
            <nav className="bg-surface-secondary shadow-sm border-b border-default">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center">
                            <Link href="/" className="text-xl font-bold text-primary">
                                Blockzei
                            </Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            {user ? (
                                <Link
                                    href="/dashboard"
                                    className="text-sm font-medium text-text-secondary hover:text-primary transition-colors"
                                >
                                    ダッシュボード
                                </Link>
                            ) : (
                                <Link
                                    href="/login"
                                    className="text-sm font-medium text-text-secondary hover:text-primary transition-colors"
                                >
                                    ログイン
                                </Link>
                            )}
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            </nav>

            {/* Pricing Content */}
            <div className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-text-primary sm:text-4xl">
                            最適なプランを選択
                        </h2>
                        <p className="mt-4 text-lg text-text-secondary">
                            あなたのニーズに合わせた料金プランをご用意しています
                        </p>
                    </div>

                    <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto">
                        {/* Free Plan */}
                        <div className="border border-default rounded-lg shadow-sm bg-surface-secondary">
                            <div className="p-6">
                                <h3 className="text-lg leading-6 font-medium text-text-primary">
                                    フリープラン
                                </h3>
                                <p className="mt-4 text-sm text-text-secondary">
                                    個人投資家向けの基本機能
                                </p>
                                <p className="mt-8">
                                    <span className="text-4xl font-extrabold text-text-primary">
                                        ¥0
                                    </span>
                                    <span className="text-base font-medium text-text-secondary">
                                        /月
                                    </span>
                                </p>
                                <button
                                    onClick={() => handleSelectPlan('free')}
                                    className="mt-8 block w-full bg-surface text-text-primary py-2 px-4 border border-default rounded-md text-sm font-medium hover:bg-surface hover:border-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                                >
                                    フリープランで始める
                                </button>
                            </div>
                            <div className="pt-6 pb-8 px-6">
                                <h4 className="text-xs font-medium text-text-primary">
                                    含まれる機能
                                </h4>
                                <ul className="mt-6 space-y-4">
                                    {FREE_FEATURES.map((feature) => (
                                        <li key={feature} className="flex space-x-3">
                                            <CheckIcon className="flex-shrink-0 h-5 w-5 text-success" />
                                            <span className="text-sm text-text-secondary">
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Pro Plan */}
                        <div className="border-2 border-primary rounded-lg shadow-lg bg-surface-secondary relative">
                            <div className="absolute bg-surface -top-3 left-1/2 transform -translate-x-1/2 z-10">
                                <span className="border-2 bg-primary text-text-primary px-4 py-1 text-sm font-semibold rounded-full shadow-sm">
                                    おすすめ
                                </span>
                            </div>
                            <div className="p-6 pt-8">
                                <h3 className="text-lg leading-6 font-medium text-text-primary">
                                    プロプラン
                                </h3>
                                <p className="mt-4 text-sm text-text-secondary">
                                    本格的な投資家向けの高度な機能
                                </p>
                                <p className="mt-8">
                                    <span className="text-4xl font-extrabold text-text-primary">
                                        ¥4,980
                                    </span>
                                    <span className="text-base font-medium text-text-secondary">
                                        /月
                                    </span>
                                </p>
                                <p className="mt-1 text-sm text-text-secondary">
                                    年払い ¥54,780（10%割引）
                                </p>
                                <button
                                    onClick={() => handleSelectPlan('pro')}
                                    className="mt-8 block w-full bg-primary text-text-primary py-3 px-4 border border-transparent rounded-md text-sm font-medium hover:bg-primary/90 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all transform hover:scale-105"
                                >
                                    プロプランにアップグレード
                                </button>
                            </div>
                            <div className="pt-6 pb-8 px-6">
                                <h4 className="text-xs font-medium text-text-primary tracking-wide uppercase">
                                    含まれる機能
                                </h4>
                                <ul className="mt-6 space-y-4">
                                    {PRO_FEATURES.map((feature) => (
                                        <li key={feature} className="flex space-x-3">
                                            <CheckIcon className="flex-shrink-0 h-5 w-5 text-success" />
                                            <span className="text-sm text-text-secondary">
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
        </div>
    );
}