/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#005c55',
        'primary-container': '#0f766e',
        'on-primary': '#ffffff',
        'on-primary-container': '#a3faef',
        'inverse-primary': '#80d5cb',
        'primary-fixed': '#9cf2e8',
        'primary-fixed-dim': '#80d5cb',
        'on-primary-fixed': '#00201d',
        
        'secondary': '#006c49',
        'secondary-container': '#6cf8bb',
        'on-secondary': '#ffffff',
        'on-secondary-container': '#00714d',
        'secondary-fixed': '#6ffbbe',
        'secondary-fixed-dim': '#4edea3',
        'emerald-accent': '#10b981',
        
        'tertiary': '#734700',
        'tertiary-container': '#945d00',
        'on-tertiary': '#ffffff',
        'on-tertiary-container': '#ffe6cc',
        'tertiary-fixed': '#ffddb8',
        'tertiary-fixed-dim': '#ffb95f',
        'on-tertiary-fixed': '#2a1700',
        'amber-urgency': '#f59e0b',
        
        'surface': '#fcf9f8',
        'surface-dim': '#dcd9d9',
        'surface-bright': '#fcf9f8',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f6f3f2',
        'surface-container': '#f0eded',
        'surface-container-high': '#eae7e7',
        'surface-container-highest': '#e5e2e1',
        'surface-variant': '#e5e2e1',
        'surface-tint': '#006a63',
        
        'on-surface': '#1b1b1b',
        'on-surface-variant': '#3e4947',
        'inverse-surface': '#313030',
        'inverse-on-surface': '#f3f0ef',
        
        'outline': '#6e7977',
        'outline-variant': '#bdc9c6',
        
        'error': '#ba1a1a',
        'on-error': '#ffffff',
        'error-container': '#ffdad6',
        'on-error-container': '#93000a',
        
        'background': '#fcf9f8',
        'on-background': '#1b1b1b',
      },
      borderRadius: {
        'sm': '0.25rem',
        'DEFAULT': '0.5rem',
        'md': '0.75rem',
        'lg': '1rem',
        'xl': '1.5rem',
        'full': '9999px',
      },
      spacing: {
        'gutter': '1.5rem',
        'gutter-mobile': '1rem',
        'margin': '3rem',
        'margin-mobile': '1.25rem',
        'space-xs': '0.25rem',
        'space-sm': '0.5rem',
        'space-md': '1rem',
        'space-lg': '1.5rem',
        'space-xl': '2.5rem',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
