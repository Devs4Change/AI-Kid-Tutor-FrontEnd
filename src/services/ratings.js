const API_BASE_URL = "http://localhost:5000/api";

export const submitCourseRating = async (courseId, rating, review = "") => {
  try {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      throw new Error("User not authenticated");
    }

    // Get completed lessons for this course
    const completedLessonsKey = `completedLessons_${courseId}_${userEmail}`;
    const completedLessons = JSON.parse(
      localStorage.getItem(completedLessonsKey) || "[]"
    );

    const response = await fetch(`${API_BASE_URL}/ratings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "user-email": userEmail,
      },
      body: JSON.stringify({
        courseId,
        rating,
        review,
        completedLessons,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to submit rating");
    }

    return await response.json();
  } catch (error) {
    console.error("Error submitting rating:", error);
    throw error;
  }
};

export const getCourseRatings = async (courseId) => {
  try {
    const userEmail = localStorage.getItem("userEmail");
    const url = userEmail
      ? `${API_BASE_URL}/ratings/course/${courseId}?userEmail=${userEmail}`
      : `${API_BASE_URL}/ratings/course/${courseId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(userEmail && { "user-email": userEmail }),
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch ratings");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching ratings:", error);
    throw error;
  }
};

export const getUserRatings = async () => {
  try {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      throw new Error("User not authenticated");
    }

    const response = await fetch(
      `${API_BASE_URL}/ratings/user?userEmail=${userEmail}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "user-email": userEmail,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user ratings");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user ratings:", error);
    throw error;
  }
};
