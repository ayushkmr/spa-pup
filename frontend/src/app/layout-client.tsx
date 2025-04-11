"use client";

import { Nunito } from "next/font/google";
import Link from "next/link";
import { useState } from "react";
import BackgroundImage from "@/components/BackgroundImage";
import MobileNav from "@/components/MobileNav";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunito",
  weight: ["300", "400", "500", "600", "700"],
});

function Navigation() {
  const { isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="flex items-center">
                  <span className="text-3xl font-bold text-purple-600 mr-2">🐶</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Puppy Spa</span>
                </Link>
              </div>
              <nav className="hidden md:ml-6 md:flex md:space-x-6">
                <Link
                  href="/"
                  className="inline-flex items-center px-3 py-2 border-b-2 border-transparent text-base font-medium text-gray-500 hover:text-purple-600 hover:border-purple-300 transition-colors"
                >
                  Today's Queue
                </Link>

                {isAuthenticated && (
                  <>
                    <Link
                      href="/add-puppy"
                      className="inline-flex items-center px-3 py-2 border-b-2 border-transparent text-base font-medium text-gray-500 hover:text-purple-600 hover:border-purple-300 transition-colors"
                    >
                      Add Puppy
                    </Link>
                    <Link
                      href="/add-entry"
                      className="inline-flex items-center px-3 py-2 border-b-2 border-transparent text-base font-medium text-gray-500 hover:text-purple-600 hover:border-purple-300 transition-colors"
                    >
                      Add to Queue
                    </Link>
                    <Link
                      href="/appointments"
                      className="inline-flex items-center px-3 py-2 border-b-2 border-transparent text-base font-medium text-gray-500 hover:text-purple-600 hover:border-purple-300 transition-colors"
                    >
                      Appointments
                    </Link>
                    <Link
                      href="/history"
                      className="inline-flex items-center px-3 py-2 border-b-2 border-transparent text-base font-medium text-gray-500 hover:text-purple-600 hover:border-purple-300 transition-colors"
                    >
                      History
                    </Link>
                    <Link
                      href="/search"
                      className="inline-flex items-center px-3 py-2 border-b-2 border-transparent text-base font-medium text-gray-500 hover:text-purple-600 hover:border-purple-300 transition-colors"
                    >
                      Search
                    </Link>
                    <Link
                      href="/statistics"
                      className="inline-flex items-center px-3 py-2 border-b-2 border-transparent text-base font-medium text-gray-500 hover:text-purple-600 hover:border-purple-300 transition-colors"
                    >
                      Statistics
                    </Link>
                  </>
                )}
              </nav>
            </div>
            <div className="flex items-center">
              {isAuthenticated ? (
                <button
                  onClick={logout}
                  className="hidden md:inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Logout
                </button>
              ) : (
                <Link
                  href="/login"
                  className="hidden md:inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Login
                </Link>
              )}
              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="text-gray-500 hover:text-purple-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 p-2 rounded-md"
                  aria-expanded="false"
                >
                  <span className="sr-only">Open main menu</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <MobileNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} isAuthenticated={isAuthenticated} logout={logout} />
    </>
  );
}

export default function RootLayoutClient({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐶</text></svg>" />
      </head>
      <body
        className={`${nunito.variable} antialiased bg-gray-50 min-h-screen`}
      >
        <BackgroundImage />
        <AuthProvider>
          <Navigation />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <footer className="bg-white border-t mt-12 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-base text-gray-500 italic">
              "Dogs leave paw prints on our hearts." 🐾
            </p>
          </div>
        </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
