import type { Config } from "tailwindcss";
import * as colors from "tailwindcss/colors";

export const softBrownSemitransparent = "#C1A88980";
export const softBrown = "#C1A889";
export const darkGray = "#717171";
export const brownGray = "#543F3F";
export const brownGraySemitransparent = "#543F3F80";
export const whiteSemitransparent = "#ffffff80";
export const beige = "#F3E4D1";
export const lighterGray = "#616161";
export const lightererGray = "#454545";
export const lightGray = "#bcbcbc";
export const lightBlack = "#393939";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    colors: {
      ...colors,
      "black-semitransparent": "#00000080",
      "soft-brown": softBrown,
      "soft-brown-semitransparent": softBrownSemitransparent,
      "dark-gray": darkGray,
      "brown-gray": brownGray,
      "brown-gray-semitransparent": brownGraySemitransparent,
      "white-semitransparent": whiteSemitransparent,
      beige,
      "lighter-gray": lighterGray,
      "lighterer-gray": lightererGray,
      "light-gray": lightGray,
      "light-black": lightBlack
    },
    container: {
      center: true
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))"
      }
    }
  },
  plugins: []
};
export default config;
