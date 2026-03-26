"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, TrendingDown, Mail, ArrowRight, Check, AlertCircle } from "lucide-react";

// Storage keys
const EXIT_POPUP_SHOWN_KEY = "exit_popup_shown";
const EXIT_POPUP_CLOSED_KEY = "exit_popup_closed_at";
const NEWSLETTER_SUBSCRIBED_KEY = "newsletter_subscribed";

// Time before showing popup again (7 days)
const POPUP_COOLDOWN_DAYS = 7;

interface ExitPopupProps {
  // Optional: Custom headline and description
  headline?: string;
  description?: string;
}

export default function ExitPopup({
  headline = "Wait! Don't miss our GPU Price Tracker",
  description = "Get instant alerts when prices drop on RTX 4090, 4080, and other AI GPUs. Join 5,000+ smart buyers.",
}: ExitPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isAlreadySubscribed, setIsAlreadySubscribed] = useState(false);

  // Check if user has already subscribed or seen popup
  useEffect(() => {
    // Check if already subscribed
    const hasSubscribed = localStorage.getItem(NEWSLETTER_SUBSCRIBED_KEY) === "true";
    if (hasSubscribed) {
      setIsAlreadySubscribed(true);
      return;
    }

    // Check if popup was shown recently
    const popupShown = localStorage.getItem(EXIT_POPUP_SHOWN_KEY);
    const popupClosedAt = localStorage.getItem(EXIT_POPUP_CLOSED_KEY);

    if (popupShown && popupClosedAt) {
      const closedDate = new Date(parseInt(popupClosedAt));
      const now = new Date();
      const daysSinceClosed = (now.getTime() - closedDate.getTime()) / (1000 * 60 * 60 * 24);

      // If less than cooldown days, don't show again
      if (daysSinceClosed < POPUP_COOLDOWN_DAYS) {
        return;
      }
    }

    // Exit intent detection
    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger when mouse moves to the top of the page (address bar area)
      if (e.clientY <= 0 && !isVisible) {
        // Check again before showing (race condition prevention)
        const hasSubscribedNow = localStorage.getItem(NEWSLETTER_SUBSCRIBED_KEY) === "true";
        const popupShownNow = localStorage.getItem(EXIT_POPUP_SHOWN_KEY);
        
        if (!hasSubscribedNow && !popupShownNow) {
          setIsVisible(true);
          // Mark as shown
          localStorage.setItem(EXIT_POPUP_SHOWN_KEY, "true");
          localStorage.setItem(EXIT_POPUP_CLOSED_KEY, Date.now().toString());
        }
      }
    };

    // Add event listener
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isVisible]);

  // Email validation
  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email");
      return;
    }

    setIsSubmitting(true);

    try {
      // Mock API call - replace with real service when ready
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      setIsSuccess(true);
      localStorage.setItem(NEWSLETTER_SUBSCRIBED_KEY, "true");
      
      // Auto-close after 3 seconds
      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem(EXIT_POPUP_CLOSED_KEY, Date.now().toString());
  };

  // Don't render if already subscribed
  if (isAlreadySubscribed) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200]"
            onClick={handleClose}
          />

          {/* Popup Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 100 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              transition: {
                type: "spring",
                damping: 20,
                stiffness: 300,
              }
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.8, 
              y: 50,
              transition: { duration: 0.2 }
            }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg z-[201]"
          >
            <div className="relative h-full md:h-auto bg-[#050505]/95 backdrop-blur-2xl border border-[#10b981]/20 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
              {/* Subtle glow - restrained */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#10b981]/10 via-transparent to-[#10b981]/10 rounded-2xl blur-xl opacity-30" />

              <div className="relative h-full md:h-auto flex flex-col">
                {/* Close button */}
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 z-10 p-2 text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.05] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" strokeWidth={1.5} />
                </button>

                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                  {!isSuccess ? (
                    <div className="text-center">
                      {/* Price Drop Icon */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", damping: 15 }}
                        className="w-16 h-16 rounded-2xl bg-[#10b981]/10 border border-[#10b981]/20 flex items-center justify-center mx-auto mb-6"
                      >
                        <TrendingDown className="w-8 h-8 text-[#10b981]" strokeWidth={1.5} />
                      </motion.div>

                      {/* Headline */}
                      <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-2xl font-medium text-white mb-3"
                      >
                        {headline}
                      </motion.h2>

                      {/* Description */}
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-zinc-400 mb-6"
                      >
                        {description}
                      </motion.p>

                      {/* Form */}
                      <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        onSubmit={handleSubmit}
                        className="space-y-4"
                      >
                        <div className="relative">
                          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Mail className="w-5 h-5 text-zinc-600" strokeWidth={1.5} />
                          </div>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email..."
                            className="w-full pl-12 pr-4 py-4 bg-white/[0.02] border border-white/[0.08] rounded-xl text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-[#10b981]/30 focus:ring-2 focus:ring-[#10b981]/10 transition-all"
                            style={{ fontSize: "16px" }}
                            autoFocus
                          />
                        </div>

                        {error && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 text-sm text-red-400"
                          >
                            <AlertCircle className="w-4 h-4" strokeWidth={1.5} />
                            {error}
                          </motion.div>
                        )}

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-4 bg-[#10b981] hover:bg-[#059669] disabled:bg-zinc-800 text-[#050505] font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-5 h-5 border-2 border-[#050505]/30 border-t-[#050505] rounded-full animate-spin" />
                              Subscribing...
                            </>
                          ) : (
                            <>
                              Get Price Alerts
                              <ArrowRight className="w-5 h-5" strokeWidth={1.5} />
                            </>
                          )}
                        </button>
                      </motion.form>

                      {/* Trust indicators */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="mt-6 flex items-center justify-center gap-4 text-xs text-zinc-600"
                      >
                        <span>No spam</span>
                        <span className="w-1 h-1 bg-zinc-700 rounded-full" />
                        <span>Unsubscribe anytime</span>
                        <span className="w-1 h-1 bg-zinc-700 rounded-full" />
                        <span>5,000+ subscribers</span>
                      </motion.div>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", damping: 15 }}
                        className="w-20 h-20 rounded-full bg-[#10b981]/10 border border-[#10b981]/20 flex items-center justify-center mx-auto mb-6"
                      >
                        <Check className="w-10 h-10 text-[#10b981]" strokeWidth={1.5} />
                      </motion.div>
                      <h3 className="text-2xl font-medium text-white mb-2">
                        You&apos;re In!
                      </h3>
                      <p className="text-zinc-400 mb-2">
                        Watch your inbox for GPU deals!
                      </p>
                      <p className="text-sm text-[#10b981]">
                        Closing automatically...
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
