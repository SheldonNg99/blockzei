'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('from') || '/dashboard';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleCredentialsLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success('ログインしました');
                router.push(callbackUrl);
            }
        } catch {
            toast.error('ログインに失敗しました');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        setIsLoading(true);
        signIn('google', { callbackUrl });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-surface px-4 sm:px-6 lg:px-8">
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>
            <div className="max-w-md w-full space-y-8">
                {/* Logo and Title */}
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-primary mb-2">
                        Blockzei
                    </h1>
                    <p className="mt-2 text-sm text-text-secondary">
                        アカウントにログインして暗号資産の税金計算を始めましょう
                    </p>
                </div>

                {/* Login Form */}
                <div className="bg-surface-secondary py-8 px-4 shadow-lg rounded-lg sm:px-10 border border-default">
                    <form className="space-y-6" onSubmit={handleCredentialsLogin}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-text-primary">
                                メールアドレス
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-default rounded-md shadow-sm placeholder-text-secondary focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-surface text-text-primary"
                                    placeholder="email@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-text-primary">
                                パスワード
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-default rounded-md shadow-sm placeholder-text-secondary focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-surface text-text-primary"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-primary focus:ring-primary border-default rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-text-primary">
                                    ログイン状態を保持
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-primary hover:text-primary/80">
                                    パスワードを忘れた方
                                </a>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'ログイン中...' : 'ログイン'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-default"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-surface-secondary text-text-secondary">または</span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 gap-3">
                            <button
                                onClick={handleGoogleLogin}
                                disabled={isLoading}
                                className="w-full inline-flex justify-center items-center py-2 px-4 border border-default rounded-md shadow-sm bg-surface text-sm font-medium text-text-primary hover:bg-surface-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Googleでログイン
                            </button>

                            <button
                                disabled={isLoading}
                                className="w-full inline-flex justify-center items-center py-2 px-4 border border-default rounded-md shadow-sm bg-surface text-sm font-medium text-text-primary hover:bg-surface-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19.28 3.43L12 9.36L4.72 3.43L12 2L19.28 3.43Z" fill="#627EEA" />
                                    <path d="M12 9.36L4.72 3.43L12 17.65V9.36Z" fill="#627EEA99" />
                                    <path d="M12 9.36L19.28 3.43L12 17.65V9.36Z" fill="#627EEACC" />
                                    <path d="M12 17.65L4.72 12.65L12 22L19.28 12.65L12 17.65Z" fill="#F5841F" />
                                </svg>
                                MetaMaskでログイン
                            </button>
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-text-secondary">
                            アカウントをお持ちでない方は{' '}
                            <Link href="/register" className="font-medium text-primary hover:text-primary/80">
                                新規登録
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}