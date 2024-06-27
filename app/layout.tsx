import { Metadata } from "next";
import { AI } from "./action";
import "./globals.css";
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: "Generative UI Minimal Demo",
  description: "A simplified demonstration of AI RSC capabilities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-black dark">
       <Toaster />
        <main className="p-4 max-w-2xl">
          <AI>{children}</AI>
        </main>
      </body>
    </html>
  );
}
