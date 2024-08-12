import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        "custom": "rgba(92,132,180,0.4) 0px 0px 0px 2px, rgba(92,132,180,0.65) 0px 4px 6px -1px, rgba(255,255,255,0.08) 0px 1px 0px inset",
        "custom-form": "rgba(0,0,0,0.4) 0px 0px 0px 2px, rgba(0,0,0,0.65) 0px 4px 6px -1px, rgba(255,255,255,0.08) 0px 1px 0px inset"
      },
      colors: {
        'blue': '#60afff',
        'darker-blue': '#5c84b4',
        'white': '#fcfafa',
        'gray': '#424b54'
      },
    }
  },
  plugins: [],
};
export default config;
