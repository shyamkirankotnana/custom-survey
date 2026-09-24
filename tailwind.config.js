/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#059669',
          hover: '#047857',
          light: '#ECFDF5',
          ring: '#6EE7B7'
        },
        success: {
          DEFAULT: '#10B981',
          light: '#F0FDF4'
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
        'brand': '0 4px 14px 0 rgba(5, 150, 105, 0.35)',
      }
    },
  },
  plugins: [],
}
