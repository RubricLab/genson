export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { AI } from "./action";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
	title: "Generative UI Experiments",
	description: "A collection of experiments with generative UI.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className="dark">
				<Toaster />
				<main className="p-4 h-screen">
					<AI>{children}</AI>
				</main>
			</body>
		</html>
	);
}
