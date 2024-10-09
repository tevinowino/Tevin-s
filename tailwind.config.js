/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './views/**/*.pug',   
    './public/**/*.html'
  ],
  theme: {
    extend: {
      fontFamily: {
          "dancingscript": ["Dancing Script", "cursive"]
      }
  }
},
  plugins: [],
}

