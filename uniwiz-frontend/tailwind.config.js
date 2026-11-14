/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      colors: {
        // --- SUPERB MODERN COLOR PALETTE (EXISTING) ---
        'primary-dark': '#0F172A',
        'primary-main': '#4F46E5',
        'primary-light': '#818CF8',
        'primary-lighter': '#E0E7FF',
        
        // --- EXTENDED MODERN PALETTES ---
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
          950: '#1E1B4B',
        },
        brand: {
          50: '#FAF5FF',
          100: '#F3E8FF',
          500: '#A855F7',
          600: '#9333EA',
          700: '#7E22CE',
        },
        
        // --- UPDATED & ENHANCED ACCENT COLORS ---
        'accent-green': '#10B981',
        'accent-red': '#EF4444',
        'accent-yellow': '#F59E0B',
        
        // --- LIGHT & VIBRANT ACCENT COLORS FOR CATEGORIES/ICONS ---
        'accent-blue': {
          light: '#EFF6FF',
          dark: '#2563EB'
        },
        'accent-pink': {
          light: '#FDF2F8',
          dark: '#DB2777'
        },
        'accent-teal': {
          light: '#F0FDFA',
          dark: '#0D9488'
        },
        'accent-purple': {
          light: '#FAF5FF',
          dark: '#7C3AED'
        },

        'neutral-dark': '#1E293B',
        'neutral-medium': '#64748B',
        'neutral-light': '#F8FAFC',
        
        'bg-student-dashboard': '#F8FAFC',
        'bg-publisher-dashboard': '#F8FAFC',
      },
      boxShadow: {
        'glow-primary': '0 0 25px -5px rgba(99, 102, 241, 0.35)',
        'glow-accent': '0 0 25px -5px rgba(16, 185, 129, 0.35)',
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 12px 30px -4px rgba(0, 0, 0, 0.09)',
      },
    },
  },
  plugins: [],
}