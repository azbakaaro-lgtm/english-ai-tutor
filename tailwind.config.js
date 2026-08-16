/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#F4F6FB',
          100: '#E7EBF6',
          200: '#C9D2E8',
          300: '#9AA9CC',
          400: '#5C6C99',
          500: '#33406B',
          600: '#232C50',
          700: '#181F3D',
          800: '#12172E',
          900: '#0B0E20',
          950: '#070914',
        },
        azure: {
          50: '#EBF3FF',
          100: '#D2E5FF',
          200: '#A6CBFF',
          300: '#72ACFF',
          400: '#3F87F5',
          500: '#2568D6',
          600: '#1B51B0',
          700: '#173F86',
          800: '#152F60',
          900: '#11213F',
        },
        gold: {
          50: '#FDF6E7',
          100: '#FAEAC0',
          200: '#F3D686',
          300: '#EAC05A',
          400: '#E0A93D',
          500: '#C98F28',
          600: '#A5711E',
          700: '#7C5518',
        },
        teal: {
          50: '#E7FBF5',
          100: '#C3F3E3',
          300: '#5FD9B6',
          400: '#2CC69C',
          500: '#1BA983',
          600: '#148468',
        },
        coral: {
          50: '#FFEEEB',
          100: '#FFD5CD',
          300: '#F7947C',
          400: '#EF6A4C',
          500: '#DA4B31',
          600: '#B23825',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(11,14,32,0.06), 0 8px 24px -8px rgba(17,33,63,0.18)',
        cardDark: '0 1px 2px rgba(0,0,0,0.3), 0 8px 28px -6px rgba(0,0,0,0.55)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      backgroundImage: {
        'star-field': "radial-gradient(circle at 20% 20%, rgba(224,169,61,0.12), transparent 40%), radial-gradient(circle at 80% 0%, rgba(63,135,245,0.16), transparent 45%)",
      },
      keyframes: {
        starPop: {
          '0%': { transform: 'scale(0.6)', opacity: '0' },
          '60%': { transform: 'scale(1.15)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        flicker: {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)' },
          '50%': { transform: 'scale(1.08) rotate(-3deg)' },
        },
      },
      animation: {
        starPop: 'starPop 0.5s ease-out',
        flicker: 'flicker 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
