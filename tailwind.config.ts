import type { Config } from "tailwindcss"
import twAnimateCss from "tw-animate-css"

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Gray scale (from lightest to darkest)
        'gray': {
          neutral: '#8E8C8C',
          50: '#F0F0F0',   // light-gray
          100: '#B1B1B1',  // medium-gray
          200: '#D2D4C7',  // sage
          300: '#3C3C3C',  // brand-gray
          400: '#212121',  // brand-dark
          500: '#2C2C2C',  // charcoal
          600: '#555555',
          700: '#F5F2F2',
          800: '#1C1C1C',
        },
        
        // Green scale (from lightest to darkest)
        'green': {
          50: '#F9FED9',   // pale-lime
          100: '#FAFFD8',  // cream
          200: '#D7FED8',  // mint
          300: '#4CAF50',  // brand-green/emerald
          400: '#4CAF50',
          500: '#88CA8A',
          600: '#193A1B',  // dark-green
          700: '#0F2310',
        },
        
        // Coral/Orange scale
        'coral': {
          50: '#E2725B',
        },
        
        // Extended color palette
        'orange': {
          50: '#FFEFEB',
          100: '#FFE0D3',
        },
        'purple': {
          50: '#F0E9FF',
        },
        'yellow': {
          50: '#FFE6B8',
          400: '#EBBC08',
        },
        'cyan': {
          50: '#E2FFFD',
        },
        'blue': {
          50: '#EEEEFF',
        },
        'pink': {
          50: '#FCEDF9',
        },
        'white': {
          50: 'F2F2F2',
          100: '#DBDBDB',
        },
        'red': {
          300: '#FA7155',
          500: '#DE2222'
        },

        
        // Legacy brand colors (for backward compatibility)
        'brand': {
          'dark': '#212121',
          'green': '#4CAF50',
          'gray': '#3C3C3C',
        },
      },
    },
  },
  plugins: [twAnimateCss],
}

export default config
