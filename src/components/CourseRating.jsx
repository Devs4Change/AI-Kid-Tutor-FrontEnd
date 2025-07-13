import React, { useState, useEffect } from "react";
import { Star, MessageCircle, Send, CheckCircle } from "lucide-react";
import { submitCourseRating, getCourseRatings } from "../services/ratings";

const CourseRating = ({ courseId, onRatingSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReviewInput, setShowReviewInput] = useState(false);
  const [userRating, setUserRating] = useState(null);
  const [courseStats, setCourseStats] = useState({
    averageRating: 0,
    totalRatings: 0,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadCourseRatings();
  }, [courseId]);

  const loadCourseRatings = async () => {
    try {
      const data = await getCourseRatings(courseId);
      setCourseStats({
        averageRating: data.averageRating,
        totalRatings: data.totalRatings,
      });
      if (data.userRating) {
        setUserRating(data.userRating);
        setRating(data.userRating.rating);
        setReview(data.userRating.review || "");
      }
    } catch (error) {
      console.error("Error loading ratings:", error);
    }
  };

  const handleStarClick = (starValue) => {
    setRating(starValue);
    setShowReviewInput(true);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      await submitCourseRating(courseId, rating, review);
      setSuccess("Rating submitted successfully!");
      setUserRating({ rating, review });

      // Reload course ratings to update average
      await loadCourseRatings();

      // Call callback if provided
      if (onRatingSubmitted) {
        onRatingSubmitted({ rating, review });
      }

      // Hide review input after successful submission
      setTimeout(() => {
        setShowReviewInput(false);
      }, 2000);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (value, interactive = false) => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      const isFilled = starValue <= value;
      const isHovered = interactive && starValue <= hoveredRating;

      return (
        <button
          key={index}
          type={interactive ? "button" : "button"}
          disabled={!interactive || isSubmitting}
          onClick={interactive ? () => handleStarClick(starValue) : undefined}
          onMouseEnter={
            interactive ? () => setHoveredRating(starValue) : undefined
          }
          onMouseLeave={interactive ? () => setHoveredRating(0) : undefined}
          className={`transition-colors duration-200 ${
            interactive ? "cursor-pointer" : "cursor-default"
          } ${
            isFilled || isHovered
              ? "text-yellow-400 fill-current"
              : "text-gray-300"
          } ${interactive ? "hover:scale-110" : ""}`}
        >
          <Star size={20} />
        </button>
      );
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Rate this Course
        </h3>
        {courseStats.totalRatings > 0 && (
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {courseStats.averageRating.toFixed(1)} ★ ({courseStats.totalRatings}{" "}
            ratings)
          </div>
        )}
      </div>

      {/* Course Average Rating Display */}
      {courseStats.totalRatings > 0 && (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Course Rating:
            </span>
            <div className="flex items-center space-x-1">
              {renderStars(Math.round(courseStats.averageRating))}
            </div>
            <span className="text-sm font-medium text-gray-800 dark:text-white">
              {courseStats.averageRating.toFixed(1)}
            </span>
          </div>
        </div>
      )}

      {/* User Rating Section */}
      <div className="space-y-4">
        {userRating ? (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle size={16} className="text-green-500" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                You rated this course
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {renderStars(userRating.rating)}
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {userRating.rating}/5
              </span>
            </div>
            {userRating.review && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                "{userRating.review}"
              </p>
            )}
          </div>
        ) : (
          <>
            {/* Interactive Star Rating */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Your Rating:
              </span>
              <div className="flex items-center space-x-1">
                {renderStars(rating, true)}
              </div>
              {rating > 0 && (
                <span className="text-sm font-medium text-gray-800 dark:text-white">
                  {rating}/5
                </span>
              )}
            </div>

            {/* Review Input */}
            {showReviewInput && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <MessageCircle size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Add a review (optional)
                  </span>
                </div>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Share your thoughts about this course..."
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-white resize-none"
                  rows={3}
                  maxLength={500}
                />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {review.length}/500 characters
                  </span>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || rating === 0}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg transition-colors duration-200"
                  >
                    {isSubmitting ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Send size={16} />
                    )}
                    <span>
                      {isSubmitting ? "Submitting..." : "Submit Rating"}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Error and Success Messages */}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm text-green-600 dark:text-green-300">
              {success}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseRating;
