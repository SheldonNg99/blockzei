// app/(landing)/layout.tsx
import Link from 'next/link';

export default function LandingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div>
            {children}
            <footer className="bg-gray-800 text-white mt-12">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-lg font-bold mb-4">Blockzei</h3>
                            <p className="text-gray-400">
                                日本の暗号資産投資家のための
                                最も信頼できる税金計算ツール
                            </p>
                        </div>
                        <div>
                            <h4 className="text-md font-semibold mb-4">リンク</h4>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="/pricing" className="text-gray-400 hover:text-white">
                                        料金プラン
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/terms" className="text-gray-400 hover:text-white">
                                        利用規約
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/privacy" className="text-gray-400 hover:text-white">
                                        プライバシーポリシー
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-md font-semibold mb-4">お問い合わせ</h4>
                            <p className="text-gray-400">
                                support@blockzei.com
                            </p>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
                        <p>&copy; 2024 Blockzei. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}