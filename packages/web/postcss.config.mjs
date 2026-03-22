/**
 * PostCSS configuration for the web playground.
 *
 * Uses the `@tailwindcss/postcss` plugin (Tailwind CSS v4) which
 * handles both utility generation and CSS processing in a single pass.
 */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
