"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Mail, ArrowRight, Check, Sparkles, Zap, Cpu } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Email validation regex
  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate email
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      // Mock API call - replace with real service when ready
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Success state
      setIsSuccess(true);

      // Confetti animation
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ["#10b981", "#3b82f6", "#ffffff"],
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ["#10b981", "#3b82f6", "#ffffff"],
        });
      }, 250);

      // Store in localStorage that user subscribed
      localStorage.setItem("newsletter_subscribed", "true");
      localStorage.setItem("newsletter_email", email);
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative overflow-hidden border-t border-white/[0.06]">
      {/* Subtle ambient effect - restrained */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#10b981]/5 rounded-full blur-[100px] opacity-20" />

      <div className="relative max-w-[1800px] mx-auto px-6 sm:px-8 lg:px-12 py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="relative"
              >
                {/* Glassmorphism Card */}
                <div className="relative bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-8 md:p-12">
                  <div className="relative">
                    {/* Icon */}
                    <div className="w-16 h-16 rounded-2xl bg-[#10b981]/10 border border-[#10b981]/20 flex items-center justify-center mx-auto mb-6">
                      <Sparkles className="w-8 h-8 text-[#10b981]" strokeWidth={1.5} />
                    </div>

                    {/* Heading */}
                    <h2 className="text-2xl md:text-3xl font-medium text-white text-center mb-4">
                      Get the AI Hardware Roadmap
                    </h2>

                    {/* Sub-heading */}
                    <p className="text-zinc-500 text-center mb-8 max-w-lg mx-auto">
                      Join 5,000+ developers getting weekly insights on GPU benchmarks and local
                      LLM optimization.
                    </p>

                    {/* Features */}
                    <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mb-8">
                      <div className="flex items-center gap-2 text-sm text-zinc-500">
                        <Zap className="w-4 h-4 text-[#10b981]" strokeWidth={1.5} />
                        <span>Weekly GPU Deals</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-zinc-500">
                        <Cpu className="w-4 h-4 text-[#10b981]" strokeWidth={1.5} />
                        <span>Benchmark Reports</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-zinc-500">
                        <Mail className="w-4 h-4 text-[#10b981]" strokeWidth={1.5} />
                        <span>No Spam, Ever</span>
                      </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                      <div className="relative">
                        {/* Email Input - Clean glassmorphism */}
                        <div className="relative flex items-center bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden focus-within:border-[#10b981]/30 transition-colors">
                          <div className="pl-4">
                            <Mail className="w-5 h-5 text-zinc-600" strokeWidth={1.5} />
                          </div>
                          <input
                            ref={inputRef}
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email..."
                            className="w-full px-4 py-4 bg-transparent text-zinc-200 placeholder-zinc-600 focus:outline-none"
                            style={{ fontSize: "16px" }}
                            disabled={isSubmitting}
                          />
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="m-1 px-6 py-3 bg-[#10b981] hover:bg-[#059669] disabled:bg-zinc-800 text-[#050505] font-medium rounded-lg transition-colors flex items-center gap-2"
                          >
                            {isSubmitting ? (
                              <>
                                <div className="w-4 h-4 border-2 border-[#050505]/30 border-t-[#050505] rounded-full animate-spin" />
                                <span className="hidden sm:inline">Joining...</span>
                              </>
                            ) : (
                              <>
                                <span className="hidden sm:inline">Subscribe</span>
                                <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                              </>
                            )}
                          </button>
                        </div>

                        {/* Error Message */}
                        <AnimatePresence>
                          {error && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute -bottom-8 left-0 text-sm text-red-400"
                            >
                              {error}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Privacy Note */}
                      <p className="text-xs text-zinc-700 text-center mt-6">
                        We respect your privacy. Unsubscribe at any time.
                      </p>
                    </form>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, type: "spring", damping: 20 }}
                className="relative"
              >
                <div className="relative bg-white/[0.02] backdrop-blur-xl border border-[#10b981]/20 rounded-2xl p-12 text-center">
                  {/* Success Icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", damping: 15 }}
                    className="w-20 h-20 rounded-full bg-[#10b981]/10 border border-[#10b981]/20 flex items-center justify-center mx-auto mb-6"
                  >
                    <Check className="w-10 h-10 text-[#10b981]" strokeWidth={1.5} />
                  </motion.div>

                  <h3 className="text-2xl font-medium text-white mb-3">
                    You&apos;re In!
                  </h3>
                  <p className="text-zinc-400 mb-2">
                    Check your inbox for the Roadmap!
                  </p>
                  <p className="text-sm text-[#10b981]">
                    Welcome to the AI Forge community
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
