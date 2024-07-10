export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { AI } from "./action";
import "./globals.css";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
	title: "Genson",
	description: "A collection of experiments with generative UI.",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className="dark">
				<Toaster />
				<SessionProvider>
					<main className="p-4 h-screen">
						<AI>{children}</AI>
					</main>
				</SessionProvider>
			</body>
		</html>
	);
}
