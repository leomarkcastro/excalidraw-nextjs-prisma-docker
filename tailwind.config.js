/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        AlegreyaSansSC: ['Alegreya Sans SC', 'sans-serif'],
        AlegreyaSans: ['Alegreya Sans', 'sans-serif'],
      },
    },
  },
  plugins: [require('daisyui')],

  // daisyUI config (optional)
  daisyui: {
    styled: true,
    themes: [
      {
        darktheme: {
          primary: '#661AE6',
          secondary: '#D926AA',
          accent: '#1FB2A5',
          neutral: '#fff',
          'base-100': '#121212',
          'base-300': '#262627',
          info: '#3ABFF8',
          success: '#36D399',
          warning: '#FBBD23',
          error: '#F87272',
        },
      },
    ],
    base: true,
    utils: true,
    logs: false,
    rtl: false,
    prefix: 'd-',
    darkTheme: 'darktheme',
  },
};
