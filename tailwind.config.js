/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      backgroundImage:{
        'main_bg':"url('./src/assets/main_bg.jpg')",
      },
    },
  },
  plugins: [
    require('flowbite/plugin')
]
}

