import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: ['class', '[data-theme="dark"]'],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: 'var(--color-primary)',
                    hover: 'var(--color-button-hover)',
                    50: '#F3F1FF',
                    100: '#E8E5FF',
                    200: '#D4CCFF',
                    300: '#B7A6FF',
                    400: '#9577FF',
                    500: '#5741D9',
                    600: '#4630B8',
                    700: '#3A2899',
                    800: '#2F207A',
                    900: '#251964',
                },
                surface: {
                    DEFAULT: 'var(--color-surface)',
                    secondary: 'var(--color-surface-secondary)',
                },
                text: {
                    primary: 'var(--color-text-primary)',
                    secondary: 'var(--color-text-secondary)',
                },
                border: {
                    DEFAULT: 'var(--color-border)',
                },
                accent: {
                    DEFAULT: 'var(--color-accent)',
                },
                success: {
                    DEFAULT: 'var(--color-success)',
                },
                error: {
                    DEFAULT: 'var(--color-error)',
                },
                warning: {
                    DEFAULT: 'var(--color-warning)',
                },
            },
            backgroundColor: {
                'surface': 'var(--color-surface)',
                'surface-secondary': 'var(--color-surface-secondary)',
            },
        },
    },
    plugins: [],
};

export default config;