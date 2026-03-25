import Link from "next/link";
import { Cpu, Home, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--background)] transition-colors duration-500">
      <Navbar />
      
      <main className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="flex flex-col items-center justify-center text-center">
          {/* 404 Icon */}
          <div className="w-24 h-24 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-8">
            <Cpu className="w-12 h-12 text-emerald-500" />
          </div>

          {/* 404 Code */}
          <h1 className="text-7xl sm:text-8xl font-bold text-[var(--text-primary)] mb-4 tracking-tight">
            404
          </h1>

          {/* Message */}
          <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--text-primary)] mb-4">
            Page Not Found
          </h2>
          <p className="text-[var(--text-secondary)] max-w-md mb-8 text-lg">
            The hardware component you&apos;re looking for seems to be missing from our database.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-colors"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </Link>
            <Link
              href="/components"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--card-bg)] hover:bg-[var(--card-bg-hover)] text-[var(--text-primary)] font-semibold rounded-lg border border-[var(--card-border)] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Browse Hardware
            </Link>
          </div>

          {/* Suggestion */}
          <div className="mt-12 p-6 glass-card max-w-lg">
            <p className="text-sm text-[var(--text-secondary)]">
              Looking for something specific? Try searching in our{" "}
              <Link href="/components" className="text-emerald-500 hover:underline">
                hardware database
              </Link>{" "}
              or check out our{" "}
              <Link href="/builder" className="text-emerald-500 hover:underline">
                build configurator
              </Link>
              .
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
