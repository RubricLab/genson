import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
	content: [
		"./ai_user_components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx}",
		"./ai_hooks/**/*.{js,ts,jsx,tsx}",
		"./node_modules/rubricui/dist/**/*.{js,jsx,ts,tsx}",
	],
	theme: {
		extend: {
			colors: {
				green: {
					"50": "#f0fdf6",
					"100": "#dbfdec",
					"200": "#baf8d9",
					"300": "#68eeac",
					"400": "#47e195",
					"500": "#1fc876",
					"600": "#13a65e",
					"700": "#13824c",
					"800": "#146740",
					"900": "#135436",
					"950": "#042f1c",
				},
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
			},
		},
	},
	presets: [require("./rubric.preset.ts")],
	plugins: [],
};
export default config;
