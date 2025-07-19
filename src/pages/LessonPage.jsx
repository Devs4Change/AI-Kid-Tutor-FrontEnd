import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Play,
  CheckCircle,
  Lock,
  BookOpen,
  Clock,
  Star,
} from "lucide-react";
import { getCourses } from "../services/courses";

const LessonPage = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setLoading(true);
        const courses = await getCourses();

        // Find the course by ID (string comparison)
        const foundCourse = courses.find(
          (c) =>
            String(c._id) === String(courseId) ||
            String(c.id) === String(courseId)
        );

        if (foundCourse) {
          // Only show lessons if the course object has a lessons array
          let lessons = [];
          if (Array.isArray(foundCourse.lessons)) {
            const completedLessons = JSON.parse(
              localStorage.getItem(
                `completedLessons_${courseId}_${
                  localStorage.getItem("userEmail") || "anonymous"
                }`
              ) || "[]"
            );
            lessons = foundCourse.lessons.map((lesson, i) => ({
              ...lesson,
              id: i + 1,
              completed: completedLessons.includes(i + 1),
              locked: i > 0 && !completedLessons.includes(i),
            }));
          }
          // If lessons is not an array, do not generate placeholder lessons
          if (!lessons.length) {
            setError("No lesson content is available for this course.");
            setLoading(false);
            return;
          }

          const courseWithLessons = {
            ...foundCourse,
            id: foundCourse._id || foundCourse.id,
            color: foundCourse.color || "from-blue-400 to-blue-600",
            thumbnail: foundCourse.thumbnail || "📚",
            lessons,
          };

          setCourse(courseWithLessons);

          // Find the specific lesson
          const foundLesson = lessons.find((l) => l.id === parseInt(lessonId));
          if (foundLesson) {
            // Debug logging to see lesson content structure
            console.log("=== LESSON CONTENT DEBUG ===");
            console.log("Lesson:", foundLesson);
            console.log("Lesson content:", foundLesson.content);
            console.log("Content length:", foundLesson.content?.length);
            console.log(
              "Is this the last lesson?",
              parseInt(lessonId) === lessons.length
            );
            console.log("Total lessons in course:", lessons.length);
            console.log("=== END DEBUG ===");

            setLesson(foundLesson);
          } else {
            setError("Lesson not found");
          }
        } else {
          setError("Course not found");
        }
      } catch (err) {
        console.error("Error fetching lesson:", err);
        setError("Failed to load lesson");
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [courseId, lessonId]);

  const handleNextStep = () => {
    // Since lesson.content is an object, not an array, we always complete the lesson
    // Lesson completed - save to localStorage with user ID
    const currentUserEmail = localStorage.getItem("userEmail") || "anonymous";
    const completedLessonsKey = `completedLessons_${courseId}_${currentUserEmail}`;
    const completedLessons = JSON.parse(
      localStorage.getItem(completedLessonsKey) || "[]"
    );

    // Debug logging
    console.log("=== LESSON COMPLETION DEBUG ===");
    console.log(`Course ID: ${courseId}`);
    console.log(`Lesson ID: ${lessonId}`);
    console.log(`User Email: ${currentUserEmail}`);
    console.log(`Storage Key: ${completedLessonsKey}`);
    console.log(`Before - Completed Lessons:`, completedLessons);

    if (!completedLessons.includes(parseInt(lessonId))) {
      completedLessons.push(parseInt(lessonId));
      localStorage.setItem(
        completedLessonsKey,
        JSON.stringify(completedLessons)
      );

      console.log(`After - Completed Lessons:`, completedLessons);
      console.log(
        `Saved to localStorage:`,
        localStorage.getItem(completedLessonsKey)
      );
      console.log("=== END DEBUG ===");

      // Track lesson completion activity for admin dashboard
      const lessonActivity = {
        userEmail: currentUserEmail,
        userName: currentUserEmail.split("@")[0], // Use email prefix as name
        role: localStorage.getItem("role") || "student",
        timestamp: new Date().toISOString(),
        action: "lesson_completed",
        courseId: courseId,
        lessonId: lessonId,
        lessonTitle: lesson.title,
      };

      const existingActivity = JSON.parse(
        localStorage.getItem("userActivity") || "[]"
      );
      existingActivity.unshift(lessonActivity);

      // Keep only last 50 activities
      if (existingActivity.length > 50) {
        existingActivity.splice(50);
      }

      localStorage.setItem("userActivity", JSON.stringify(existingActivity));
    }

    // Go to next lesson if it exists, else go to course overview
    const nextLessonId = parseInt(lessonId) + 1;
    if (course && nextLessonId <= course.lessons.length) {
      navigate(`/course/${courseId}/lesson/${nextLessonId}`);
    } else {
      alert("Congratulations! You have completed all lessons in this course.");
      navigate(`/course/${courseId}`);
    }
  };

  const renderContent = (content) => {
    return (
      <div className="space-y-6">
        {/* Explanation Section */}
        {content.explanation && (
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-xl font-bold mb-4 text-blue-800">
              Explanation
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {content.explanation}
            </p>
          </div>
        )}

        {/* Examples Section */}
        {content.examples && content.examples.length > 0 && (
          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <h3 className="text-xl font-bold mb-4 text-green-800">Examples</h3>
            <div className="space-y-3">
              {content.examples.map((example, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border">
                  <p className="text-gray-700">{example}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Concepts Section */}
        {content.key_concepts && content.key_concepts.length > 0 && (
          <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
            <h3 className="text-xl font-bold mb-4 text-purple-800">
              Key Concepts
            </h3>
            <ul className="space-y-2">
              {content.key_concepts.map((concept, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span className="text-gray-700">{concept}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Activity Section */}
        {content.activity && (
          <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
            <h3 className="text-xl font-bold mb-4 text-orange-800">Activity</h3>
            <p className="text-gray-700">{content.activity}</p>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate(`/course/${courseId}`)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Back to Course
          </button>
        </div>
      </div>
    );
  }

  if (!lesson || !lesson.content) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Lesson not found or missing content.</p>
          <button
            onClick={() => navigate(`/course/${courseId}`)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mt-4"
          >
            Back to Course
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-4xl w-full">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate(`/course/${courseId}`)}
            className="text-gray-600 hover:text-gray-800"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="text-3xl font-bold text-center flex-1">
            {lesson.title || "Untitled Lesson"}
          </h1>
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-gray-500 mr-2" />
            <span>{lesson.duration || ""}</span>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Lock className="h-5 w-5 text-gray-500 mr-2" />
            <span>Lesson {lesson.id}</span>
          </div>
          <div className="flex items-center">
            <Star className="h-5 w-5 text-yellow-500 mr-2" />
            <span>{lesson.completed ? "Completed" : "In Progress"}</span>
          </div>
        </div>

        <div className="mb-8">
          {lesson.content ? renderContent(lesson.content) : null}
        </div>

        <div className="flex justify-center items-center pt-6 border-t border-gray-200">
          <button
            onClick={handleNextStep}
            className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 font-medium text-lg"
          >
            {(() => {
              // Only show "Complete Lesson" if this is the last lesson in the course
              const isLastLesson = parseInt(lessonId) === course.lessons.length;
              return isLastLesson ? "Complete Lesson" : "Next";
            })()}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonPage;
