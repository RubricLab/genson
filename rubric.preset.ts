import type { Config } from "tailwindcss";

const rubricConfig = {
	content: ["./node_modules/rubricui/dist/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			colors: {
				"rubricui-primary": "rgb(var(--rubricui-primary) / <alpha-value>)",
				"rubricui-contrast": "rgb(var(--rubricui-contrast) / <alpha-value>)",
			},
			transitionDuration: {
				"rubricui-duration": "300ms",
			},
			keyframes: {
				"rubricui-loading-rotate": {
					"0%": { transform: "rotate(0deg)" },
					"25%": { transform: "rotate(90deg)" },
					"50%": { transform: "rotate(180deg)" },
					"75%": { transform: "rotate(270deg)" },
					"100%": { transform: "rotate(360deg)" },
				},
			},
			animation: {
				"rubricui-loading-rotate":
					"rubricui-loading-rotate 1s steps(1) infinite",
			},
		},
	},
	plugins: [],
} satisfies Config;

export default rubricConfig;
