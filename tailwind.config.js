/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        heading: ['Anta', 'system-ui', 'sans-serif'],
        body: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          light: '#006d6d',
          DEFAULT: '#005555',
          dark: '#004444',
        },
        secondary: {
          light: '#4B5563',
          DEFAULT: '#374151',
          dark: '#1F2937',
        },
        accent: {
          light: '#ff8f85',
          DEFAULT: '#ff6f61',
          dark: '#ff4f3d',
        },
        success: {
          light: '#86EFAC',
          DEFAULT: '#22C55E',
          dark: '#16A34A',
        },
        warning: {
          light: '#FDE68A',
          DEFAULT: '#F59E0B',
          dark: '#D97706',
        },
        error: {
          light: '#FCA5A5',
          DEFAULT: '#EF4444',
          dark: '#DC2626',
        },
      },
      backgroundImage: {
        'hero-pattern': "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)), url('https://images.pexels.com/photos/1526/dark-blur-blurred-gradient.jpg?auto=compress&cs=tinysrgb&w=1920')",
        'diagonal-lines': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};