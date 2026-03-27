"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ 
          duration: 0.4, 
          ease: [0.25, 0.1, 0.25, 1] // Custom cubic-bezier for premium feel
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export function FadeIn({ 
  children, 
  delay = 0,
  duration = 0.5 
}: { 
  children: ReactNode; 
  delay?: number;
  duration?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration, 
        delay,
        ease: [0.25, 0.1, 0.25, 1]
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({ 
  children, 
  staggerDelay = 0.1 
}: { 
  children: ReactNode; 
  staggerDelay?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: {
            duration: 0.5,
            ease: [0.25, 0.1, 0.25, 1]
          }
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function HoverScale({ 
  children, 
  scale = 1.02 
}: { 
  children: ReactNode; 
  scale?: number;
}) {
  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export function MagneticButton({ 
  children, 
  className = "" 
}: { 
  children: ReactNode; 
  className?: string;
}) {
  return (
    <motion.button
      className={className}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.button>
  );
}

export function SlideIn({ 
  children, 
  direction = "left",
  delay = 0 
}: { 
  children: ReactNode; 
  direction?: "left" | "right" | "up" | "down";
  delay?: number;
}) {
  const directions = {
    left: { x: -30, y: 0 },
    right: { x: 30, y: 0 },
    up: { x: 0, y: -30 },
    down: { x: 0, y: 30 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay,
        ease: [0.25, 0.1, 0.25, 1]
      }}
    >
      {children}
    </motion.div>
  );
}

export function PulseGlow({ children }: { children: ReactNode }) {
  return (
    <motion.div
      animate={{
        boxShadow: [
          "0 0 0 0 rgba(79, 70, 229, 0)",
          "0 0 20px 2px rgba(79, 70, 229, 0.15)",
          "0 0 0 0 rgba(79, 70, 229, 0)",
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}

export function CountUp({ 
  end, 
  duration = 2,
  suffix = "" 
}: { 
  end: number; 
  duration?: number;
  suffix?: string;
}) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {end}{suffix}
      </motion.span>
    </motion.span>
  );
}

export function TextReveal({ 
  text, 
  className = "" 
}: { 
  text: string; 
  className?: string;
}) {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {text}
    </motion.span>
  );
}

export function GradientText({ 
  children, 
  className = "" 
}: { 
  children: ReactNode; 
  className?: string;
}) {
  return (
    <span 
      className={`bg-gradient-to-r from-[#4f46e5] via-[#7c3aed] to-[#0d9488] bg-clip-text text-transparent ${className}`}
    >
      {children}
    </span>
  );
}

export function GlassCard({ 
  children, 
  className = "" 
}: { 
  children: ReactNode; 
  className?: string;
}) {
  return (
    <motion.div
      className={`backdrop-blur-xl bg-white/70 border border-white/20 shadow-2xl ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ 
        y: -4,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)"
      }}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedNumber({ 
  value, 
  prefix = "",
  suffix = "" 
}: { 
  value: number; 
  prefix?: string;
  suffix?: string;
}) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="inline-block"
    >
      {prefix}{value.toLocaleString()}{suffix}
    </motion.span>
  );
}

export function FloatingElement({ 
  children, 
  delay = 0,
  duration = 3 
}: { 
  children: ReactNode; 
  delay?: number;
  duration?: number;
}) {
  return (
    <motion.div
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}

export function SpotlightCard({ 
  children, 
  className = "" 
}: { 
  children: ReactNode; 
  className?: string;
}) {
  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      whileHover="hover"
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
        initial={{ x: "-100%" }}
        variants={{
          hover: { x: "100%" }
        }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
      {children}
    </motion.div>
  );
}

export function ParallaxSection({ 
  children, 
  offset = 50 
}: { 
  children: ReactNode; 
  offset?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  );
}

export function MorphingBlob({ 
  className = "" 
}: { 
  className?: string;
}) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl opacity-30 ${className}`}
      animate={{
        scale: [1, 1.2, 1],
        rotate: [0, 90, 0],
        borderRadius: ["60% 40% 30% 70% / 60% 30% 70% 40%", "30% 60% 70% 40% / 50% 60% 30% 60%", "60% 40% 30% 70% / 60% 30% 70% 40%"],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

export function ScrollProgress() {
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4f46e5] to-[#0d9488] origin-left z-50"
      style={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.3 }}
    />
  );
}
