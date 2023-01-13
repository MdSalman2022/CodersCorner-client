/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  daisyui: {
    themes: [
      {
        mytheme: {

          "gray": "#1D2939",

          "primary": "#7F56D9",

          "secondary": "#F9F5FF",

          "accent": "#F9FAFB",

          "neutral": "#475467",

          "base-100": "#FFFFFF",

          "info": "#026AA2",

          "success": "#027A48",

          "warning": "#F4D125",

          "error": "#EF2540",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
}