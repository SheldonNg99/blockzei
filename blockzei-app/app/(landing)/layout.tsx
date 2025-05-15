// app/(landing)/layout.tsx
import Link from 'next/link';

export default function LandingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-surface flex flex-col">
            {/* Navigation */}
            <nav className="bg-surface-secondary shadow-sm border-b border-default sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">B</span>
                            </div>
                            <span className="text-xl font-bold text-text-primary">Blockzei</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            <Link href="/#features" className="text-text-secondary hover:text-primary transition-colors">
                                機能
                            </Link>
                            <Link href="/pricing" className="text-text-secondary hover:text-primary transition-colors">
                                料金
                            </Link>
                            <Link href="/#about" className="text-text-secondary hover:text-primary transition-colors">
                                会社概要
                            </Link>
                            <Link href="/blog" className="text-text-secondary hover:text-primary transition-colors">
                                ブログ
                            </Link>
                        </div>

                        {/* Right side buttons */}
                        <div className="flex items-center space-x-4">
                            <Link href="/login" className="text-text-secondary hover:text-primary transition-colors hidden sm:inline-block">
                                ログイン
                            </Link>
                            <Link
                                href="/register"
                                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                無料で始める
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main content */}
            <main className="flex-1">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-surface-secondary border-t border-default">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Company info */}
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">B</span>
                                </div>
                                <span className="text-xl font-bold text-text-primary">Blockzei</span>
                            </div>
                            <p className="text-text-secondary mb-4 max-w-md">
                                日本の暗号資産投資家のための最も信頼できる税金計算ツール。
                                取引を自動追跡し、正確な税務レポートを生成します。
                            </p>
                            <div className="flex space-x-4">
                                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                                    className="text-text-secondary hover:text-primary transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                                    </svg>
                                </a>
                                <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                                    className="text-text-secondary hover:text-primary transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                                    </svg>
                                </a>
                                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                                    className="text-text-secondary hover:text-primary transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Quick links */}
                        <div>
                            <h4 className="text-text-primary font-semibold mb-4">クイックリンク</h4>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="/#features" className="text-text-secondary hover:text-primary transition-colors">
                                        機能
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/pricing" className="text-text-secondary hover:text-primary transition-colors">
                                        料金プラン
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/blog" className="text-text-secondary hover:text-primary transition-colors">
                                        ブログ
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/docs" className="text-text-secondary hover:text-primary transition-colors">
                                        ドキュメント
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Legal */}
                        <div>
                            <h4 className="text-text-primary font-semibold mb-4">法的情報</h4>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="/terms" className="text-text-secondary hover:text-primary transition-colors">
                                        利用規約
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/privacy" className="text-text-secondary hover:text-primary transition-colors">
                                        プライバシーポリシー
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/security" className="text-text-secondary hover:text-primary transition-colors">
                                        セキュリティ
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/support" className="text-text-secondary hover:text-primary transition-colors">
                                        お問い合わせ
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom section */}
                    <div className="mt-12 pt-8 border-t border-default">
                        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                            <p className="text-text-secondary text-sm">
                                © 2024 Blockzei. All rights reserved.
                            </p>
                            <div className="flex items-center space-x-4">
                                <span className="text-text-secondary text-sm">
                                    🇯🇵 日本の投資家のために構築
                                </span>
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-success rounded-full"></div>
                                    <span className="text-text-secondary text-sm">
                                        システム正常
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}