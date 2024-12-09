/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors'

module.exports = {
  darkMode: 'selector',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: colors.white,
        foreground: colors.sky[50],
        primary: colors.cyan[100],
        secondary: colors.blue[300],
        ternary: colors.purple[200],
        text_clr: colors.black,
        text_clr2: colors.slate[600],

        d_background: colors.black,
        d_foreground: colors.slate[950],
        d_primary: colors.slate[900],
        d_secondary: colors.slate[800],
        d_ternary: colors.blue[950],
        d_text_clr: colors.white,
        d_text_clr2: colors.slate[500],
      },
      screens: {
        'xs': '200px', // Custom screen size
        'xs1': '300px', // Custom screen size
        'xs2': '340px', // Custom screen size
        'xs3': '380px', // Custom screen size
        'xs4': '427px', // Custom screen size
        'xs5': '500px', // Custom screen size
        'xs6': '600px', // Custom screen size
        'xl1': '1310px', // Custom screen size
        'xl2': '1350px', // Custom screen size
        'xl3': '1390px', // Custom screen size
      },
      animation: {
        ripple: 'ripple 2s infinite ease-in-out',
        lodingDot1: 'loadingDot 1.5s infinite ease-in-out',
        lodingDot2: 'loadingDot 1.5s infinite ease-in-out 0.2s',
        lodingDot3: 'loadingDot 1.5s infinite ease-in-out 0.4s',
      },
      keyframes: {
        ripple: {
          '0%': { transform: 'scale(0.5)', opacity: '0.5' },
          '50%': { transform: 'scale(1)', opacity: '0.3' },
          '100%': { transform: 'scale(1.5)', opacity: '0' },
        },
        loadingDot: {
          '0%, 20%': { opacity: '1' }, // Dot is visible
          '80%, 100%': { opacity: '0' }, // Dot fades out
        },
      }
    },
  },
  plugins: [],
};
