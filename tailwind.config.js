/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#F97316',
          hover: '#EA580C',
          light: '#FFF7ED',
          ring: '#FDBA74'
        },
        success: {
          DEFAULT: '#F97316',
          light: '#FFF7ED'
        },
        bankBg: '#F6F7FB',
        bankCard: '#FFFFFF',
        textPrimary: '#1F2937',
        textSecondary: '#6B7280',
        bankBorder: '#E5E7EB'
      },
      fontFamily: {
        sans: ['Mulish', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 8px 30px -4px rgba(0, 0, 0, 0.08)',
        'floating': '0 -4px 25px rgba(0, 0, 0, 0.08)',
        'brand': '0 4px 14px 0 rgba(249, 115, 22, 0.35)',
      }
    },
  },
  plugins: [],
}
