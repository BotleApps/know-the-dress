/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#ffffff",
        ink: "#222222",
        body: "#3f3f3f",
        muted: "#6a6a6a",
        "muted-soft": "#929292",
        hairline: "#dddddd",
        "hairline-soft": "#ebebeb",
        "surface-soft": "#f7f7f7",
        "surface-strong": "#f2f2f2",
        // StyleSift accent — a softer plum-rose, distinct from Airbnb Rausch
        primary: "#b8336a",
        "primary-active": "#94285a",
        "primary-soft": "#fce7ef",
        "primary-tint": "#fff4f8",
        luxe: "#460479",
      },
      fontFamily: {
        sans: [
          "DM Sans",
          "-apple-system",
          "system-ui",
          "Roboto",
          "Helvetica Neue",
          "sans-serif",
        ],
        display: [
          "Playfair Display",
          "Georgia",
          "Times New Roman",
          "serif",
        ],
      },
      borderRadius: {
        sm: "8px",
        md: "14px",
        xl: "32px",
      },
      boxShadow: {
        float:
          "rgba(0,0,0,0.02) 0 0 0 1px, rgba(0,0,0,0.04) 0 2px 6px 0, rgba(0,0,0,0.1) 0 4px 8px 0",
        soft:
          "rgba(0,0,0,0.04) 0 1px 2px 0, rgba(0,0,0,0.06) 0 4px 16px -4px",
      },
      maxWidth: {
        app: "480px",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};
