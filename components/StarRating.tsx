"use client";

import { Star } from "lucide-react";
import { motion } from "framer-motion";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  animated?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { star: 12, text: "text-xs" },
  md: { star: 16, text: "text-sm" },
  lg: { star: 24, text: "text-lg" },
};

export default function StarRating({
  rating,
  maxRating = 5,
  size = "sm",
  showValue = false,
  animated = false,
  className = "",
}: StarRatingProps) {
  const { star: starSize, text: textSize } = sizeMap[size];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

  const StarIcon = ({ filled, half }: { filled: boolean; half?: boolean }) => (
    <div className="relative">
      <Star
        size={starSize}
        className={`${
          filled
            ? "fill-amber-400 text-amber-400"
            : "fill-transparent text-slate-600"
        } ${half ? "opacity-30" : ""}`}
        strokeWidth={1.5}
      />
      {half && (
        <div className="absolute inset-0 overflow-hidden w-1/2">
          <Star
            size={starSize}
            className="fill-amber-400 text-amber-400"
            strokeWidth={1.5}
          />
        </div>
      )}
    </div>
  );

  const stars = [];

  // Full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <motion.div
        key={`full-${i}`}
        initial={animated ? { scale: 0, opacity: 0 } : false}
        animate={animated ? { scale: 1, opacity: 1 } : false}
        transition={{ delay: i * 0.05, duration: 0.2 }}
      >
        <StarIcon filled />
      </motion.div>
    );
  }

  // Half star
  if (hasHalfStar) {
    stars.push(
      <motion.div
        key="half"
        initial={animated ? { scale: 0, opacity: 0 } : false}
        animate={animated ? { scale: 1, opacity: 1 } : false}
        transition={{ delay: fullStars * 0.05, duration: 0.2 }}
      >
        <StarIcon filled={false} half />
      </motion.div>
    );
  }

  // Empty stars
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <motion.div
        key={`empty-${i}`}
        initial={animated ? { scale: 0, opacity: 0 } : false}
        animate={animated ? { scale: 1, opacity: 1 } : false}
        transition={{ delay: (fullStars + (hasHalfStar ? 1 : 0) + i) * 0.05, duration: 0.2 }}
      >
        <StarIcon filled={false} />
      </motion.div>
    );
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex items-center gap-0.5">{stars}</div>
      {showValue && (
        <span className={`${textSize} text-slate-400 ml-1`}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
