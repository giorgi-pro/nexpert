import type { Config } from "tailwindcss"
import daisyui from "daisyui"

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
  ],
  theme: {
    extend: {
      borderWidth: {
        1: "1px",
      },
      borderColor: {
        primary: "#dadfd0",
        DEFAULT: "#ccc",
      },
      backgroundColor: {},
      extend: {
        fontSize: {
          xs: "0.7rem",
        },
        colors: {
          bright: "#dadfd0",
        },
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#588100",
          secondary: "#FF8D58",
          accent: "#a21caf",
          neutral: "#191D24",
          "base-100": "#2A303C",
          info: "#2563eb",
          success: "#6a9c00",
          warning: "#eab308",
          error: "#dc2626",
        },
        screens: {
          tablet: "640px",
          laptop: "1024px",
          desktop: "1280px",
        },
      },
    ],
  },
}
export default config
