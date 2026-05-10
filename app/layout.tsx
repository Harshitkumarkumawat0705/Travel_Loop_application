import type {Metadata} from 'next';
import './globals.css';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { AuthButtons } from "@/components/auth-buttons";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: 'Traveloop - Plan your next adventure',
  description: 'Create multi-city itineraries, manage budgets, and organize travel plans.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="antialiased min-h-screen flex flex-col pt-16 relative" suppressHydrationWarning>
        <header className="fixed top-0 w-full h-16 border-b border-border/40 bg-background/60 backdrop-blur-md z-50 flex items-center px-6">
          <a href="/" className="flex items-center gap-2 text-primary font-bold text-xl">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6l-2 2 .5.5 3.5 3.5-2 2-2-2-.5-.5-2 2c-.4.2-.7.6-.6 1.1L8 21c.1-.5.2-.9.6-1.1l2-2-3.5-3.5-.5-.5 2-2 .5.5 3.5 3.5 2-2-.6-1.1c.2-.4.6-.7 1.1-.6l5.2 2Z"/></svg>
             Traveloop
          </a>
          <div className="ml-auto flex gap-4">
             <AuthButtons />
          </div>
        </header>
        <main className="flex-1 w-full p-4 sm:p-6 lg:p-8">
           {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
