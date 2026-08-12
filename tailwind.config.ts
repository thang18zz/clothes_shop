import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#e4d0cb',
          300: '#d0b0a7',
          400: '#b8897c',
          500: '#a36b5d',
          600: '#8e5447',
          700: '#754338',
          800: '#623830',
          900: '#52312b',
          950: '#2c1815',
        },
        slate: {
          850: '#1e293b',
          950: '#0f172a',
        }
      },
    },
  },
  plugins: [],
};
export default config;
