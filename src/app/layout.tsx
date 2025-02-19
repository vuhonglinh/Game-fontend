import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Toaster } from "@/components/ui/toaster";
import AppProvider from "@/ContextProvider";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AppProvider>
        <TooltipProvider>
          <body className={inter.className}>
            <Toaster />
            {children}
          </body>
        </TooltipProvider>
      </AppProvider>
    </html>

  );
}
