import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "UPIShield — SIH26184 Cybercrime Intelligence & Cash-Out Prediction",
  description:
    "Proactive cybercrime intelligence framework analyzing financial transaction risks, predicting likely cash-withdrawal locations, and dispatching actionable alerts.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-slate-950 text-slate-100 antialiased selection:bg-emerald-500 selection:text-white">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="border-t border-slate-900 bg-slate-950/90 py-4 px-6 text-center text-xs text-slate-500 font-mono">
          UPIShield SIH26184 Intelligence Prototype | 100% Synthetic Data Simulation | Ministry of Home Affairs / I4C / LEA
        </footer>
      </body>
    </html>
  );
}
