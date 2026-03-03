/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-dark': '#1a0b2e',      /* Deepest Purple/Black */
        'brand-purple': '#4c1d95',    /* Rich Purple */
        'brand-purple-light': '#8b5cf6', /* Light Accent Purple */
        'brand-orange': '#ff6b00',    /* Vibrant Orange */
        'brand-orange-hover': '#e65100',
        'brand-gray': '#f3f4f6',      /* Light Gray BG */
        'text-main': '#1f2937',       /* Dark Gray Text */
        'text-light': '#6b7280',      /* Light Gray Text */
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
        heading: ['Oswald', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'marquee': 'marquee 25s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}
