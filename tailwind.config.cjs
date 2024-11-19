/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "transparent-white": "",
        "ocean-darkest": "rgb(1, 56, 72)",
        "ocean-dark": "rgb(0, 97, 122)",
        "ocean-light": "rgb(35, 142, 133)",
        "ocean-lightest": "rgb(61, 176, 158)",
        "blue-dark": "rgb(0, 69, 114)",
        "blue-medium": "rgb(0, 130, 172)",
        "blue-light": "rgb(59, 168, 212)",
        orange: "rgb(235, 117, 5)",
        crimson: "rgb(226, 30, 49)",
        primary: "rgb(0, 97, 122)",
        secondary: "rgb(35, 142, 133)",
        complementary: "rgb(35, 142, 133)",
        speaker1: "rgb(59, 168, 212)",
        speaker2: "rgb(167, 31, 96)",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
