"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  MessageSquare,
  ThumbsUp,
  User,
  CheckCircle2,
  X,
  Send,
  BarChart3,
} from "lucide-react";
import type { HardwareComponent, UserReview } from "@/lib/constants";
import StarRating from "./StarRating";
import { Button } from "@/components/ui/button";

interface ProductReviewsProps {
  component: HardwareComponent;
}

// Calculate rating distribution
function calculateRatingDistribution(reviews: UserReview[]) {
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((review) => {
    const rating = Math.floor(review.rating) as keyof typeof distribution;
    if (distribution[rating] !== undefined) {
      distribution[rating]++;
    }
  });
  return distribution;
}

export default function ProductReviews({ component }: ProductReviewsProps) {
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [localReviews, setLocalReviews] = useState<UserReview[]>(
    component.userReviews || []
  );
  const [newReview, setNewReview] = useState({
    rating: 5,
    text: "",
    username: "",
  });
  const [hoveredStar, setHoveredStar] = useState(0);

  const rating = component.rating || 0;
  const reviewCount = component.reviewCount || localReviews.length;
  const distribution = calculateRatingDistribution(localReviews);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.text.trim() || !newReview.username.trim()) return;

    const review: UserReview = {
      id: `user-review-${Date.now()}`,
      username: newReview.username,
      date: new Date().toISOString().split("T")[0],
      rating: newReview.rating,
      text: newReview.text,
      verified: false,
    };

    setLocalReviews([review, ...localReviews]);
    setNewReview({ rating: 5, text: "", username: "" });
    setIsWriteModalOpen(false);
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl border border-slate-800 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <MessageSquare className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Customer Reviews</h2>
              <p className="text-slate-400 text-sm">
                {reviewCount} verified reviews
              </p>
            </div>
          </div>
          <Button
            onClick={() => setIsWriteModalOpen(true)}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold"
          >
            <Send className="w-4 h-4 mr-2" />
            Write a Review
          </Button>
        </div>
      </div>

      {/* Rating Summary */}
      <div className="p-6 border-b border-slate-800">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left - Average Rating */}
          <div className="flex items-center gap-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="text-5xl font-bold text-amber-400">
                {rating.toFixed(1)}
              </div>
              <div className="flex justify-center mt-2">
                <StarRating rating={rating} size="md" animated />
              </div>
              <p className="text-slate-400 text-sm mt-2">
                out of 5 stars
              </p>
            </motion.div>
            <div className="hidden md:block w-px h-20 bg-slate-700" />
          </div>

          {/* Right - Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = distribution[star as keyof typeof distribution];
              const percentage =
                reviewCount > 0 ? (count / reviewCount) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-sm text-slate-400 w-8">{star}★</span>
                  <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, delay: star * 0.1 }}
                      className="h-full bg-amber-400 rounded-full"
                    />
                  </div>
                  <span className="text-sm text-slate-500 w-12 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="p-6">
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {localReviews.slice(0, 10).map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 bg-slate-950/50 rounded-xl border border-slate-800/50 backdrop-blur-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                      <User className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">
                          {review.username}
                        </span>
                        {review.verified && (
                          <span className="flex items-center gap-1 text-xs text-emerald-400">
                            <CheckCircle2 className="w-3 h-3" />
                            Verified
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <StarRating rating={review.rating} size="sm" />
                        <span className="text-xs text-slate-500">
                          {review.date}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-slate-300 text-sm leading-relaxed">
                  {review.text}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>

          {localReviews.length === 0 && (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No reviews yet. Be the first!</p>
            </div>
          )}

          {localReviews.length > 10 && (
            <div className="text-center pt-4">
              <Button
                variant="outline"
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                View All {localReviews.length} Reviews
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Write Review Modal */}
      <AnimatePresence>
        {isWriteModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setIsWriteModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Write a Review</h3>
                <button
                  onClick={() => setIsWriteModalOpen(false)}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleSubmitReview} className="p-6 space-y-6">
                {/* Star Rating Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Your Rating
                  </label>
                  <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setNewReview({ ...newReview, rating: star })
                      }
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        size={32}
                        className={`${
                          star <= (hoveredStar || newReview.rating)
                            ? "fill-amber-400 text-amber-400"
                            : "fill-transparent text-slate-600"
                        } transition-colors`}
                        strokeWidth={1.5}
                      />
                    </button>
                  ))}
                </div>
                </div>

                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newReview.username}
                    onChange={(e) =>
                      setNewReview({ ...newReview, username: e.target.value })
                    }
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                  />
                </div>

                {/* Review Text */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Your Review
                  </label>
                  <textarea
                    required
                    value={newReview.text}
                    onChange={(e) =>
                      setNewReview({ ...newReview, text: e.target.value })
                    }
                    placeholder="Share your experience with this product..."
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors resize-none"
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsWriteModalOpen(false)}
                    className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Submit Review
                  </Button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
