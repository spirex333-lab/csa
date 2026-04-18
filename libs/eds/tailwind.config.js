/** @type {import('tailwindcss').Config} */
const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

module.exports = {
  darkMode: ['class'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Lexend', 'sans-serif'],
      },
    },
  },
  content: [
    join(__dirname, '{src,.storybook}/**/*.{ts,tsx,js,jsx,html,mdx}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
};
