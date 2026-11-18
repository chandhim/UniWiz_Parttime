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
        // --- BESPOKE UNIWIZ "EMERALD VANGUARD & WARM AMBER" PALETTE ---
        // Distinctive academic & growth colors replacing generic Antigravity indigo/purple
        'primary-dark': '#062C24',
        'primary-main': '#059669',     // Core Emerald
        'primary-light': '#34D399',    // Vibrant Mint
        'primary-lighter': '#D1FAE5',  // Soft Emerald Frost
        
        // --- PRIMARY: DEEP ALPINE EMERALD (Growth, Academic Prestige, High-Trust) ---
        primary: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
          950: '#022C22',
        },

        // --- BRAND: WARM SOLAR OCHRE / AMBER GOLD (Collegiate Warmth, Badges, Wages) ---
        brand: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },

        // --- SECONDARY TEAL ACCENTS ---
        teal: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          900: '#134E4A',
        },
        
        // --- SYSTEM ACCENTS ---
        'accent-green': '#10B981',
        'accent-red': '#EF4444',
        'accent-yellow': '#F59E0B',
        
        // --- FACULTY & CATEGORY HARMONIES ---
        'accent-blue': {
          light: '#F0F9FF',
          dark: '#0284C7'
        },
        'accent-pink': {
          light: '#FFF1F2',
          dark: '#E11D48'
        },
        'accent-teal': {
          light: '#F0FDFA',
          dark: '#0D9488'
        },
        'accent-purple': {
          light: '#F5F3FF',
          dark: '#7C3AED'
        },
        'accent-amber': {
          light: '#FFFBEB',
          dark: '#D97706'
        },

        // --- REFINED SLATE & PORCELAIN SURFACES ---
        'neutral-dark': '#0F172A',
        'neutral-medium': '#64748B',
        'neutral-light': '#F8FAFC',
        
        'bg-student-dashboard': '#F8FAFC',
        'bg-publisher-dashboard': '#F8FAFC',
      },
      boxShadow: {
        'glow-primary': '0 0 25px -4px rgba(16, 185, 129, 0.35)',
        'glow-brand': '0 0 25px -4px rgba(245, 158, 11, 0.35)',
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.03)',
        'card': '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
        'card-hover': '0 12px 32px -4px rgba(15, 23, 42, 0.08), 0 4px 12px -2px rgba(5, 150, 105, 0.06)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
