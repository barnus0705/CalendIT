/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
    },
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui:{
    themes:[
      {
        light: {
          "primary": "#0085ff",

          "secondary": "#008e1e",

          "accent": "#00d6ff",

          "neutral": "#362321",

          "base-100": "#e4ffff",

          "info": "#00c8ff",

          "success": "#00dbab",

          "warning": "#be8100",

          "error": "#ff636b",
        },
        dark: {
          "primary": "#00cfe8",

          "secondary": "#008d69",

          "accent": "#cd4000",

          "neutral": "#190403",

          "base-100": "#292929",

          "info": "#39c1ff",

          "success": "#008959",

          "warning": "#bf7600",

          "error": "#ff4963",
        },
      },
    ],
  }
}

