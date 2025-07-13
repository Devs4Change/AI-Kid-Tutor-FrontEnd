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
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setLoading(true);
        const courses = await getCourses();

        // Find the course by ID
        const foundCourse = courses.find(
          (c) =>
            c._id === courseId ||
            c.id === courseId ||
            c._id === parseInt(courseId) ||
            c.id === parseInt(courseId)
        );

        if (foundCourse) {
          // Generate lessons for the found course
          const lessons = Array.from(
            { length: foundCourse.lessons || 5 },
            (_, i) => ({
              id: i + 1,
              title: `${foundCourse.title} - Lesson ${i + 1}`,
              duration: `${Math.floor(Math.random() * 10) + 15} min`,
              completed: i < parseInt(lessonId) - 1,
              locked: i > parseInt(lessonId),
              content: [
                {
                  type: "video",
                  title: "Introduction",
                  duration: "5 min",
                  description: "Learn the basics of this topic",
                },
                {
                  type: "reading",
                  title: "Key Concepts",
                  duration: "10 min",
                  description: "Read about important concepts",
                },
                {
                  type: "quiz",
                  title: "Practice Quiz",
                  duration: "5 min",
                  description: "Test your understanding",
                },
              ],
            })
          );

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
    if (currentStep < lesson.content.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
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
        const currentUserEmail =
          localStorage.getItem("userEmail") || "anonymous";
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

      alert("Congratulations! You have completed this lesson.");
      navigate(`/course/${courseId}`);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderContent = (content) => {
    switch (content.type) {
      case "video":
        return (
          <div className="bg-gray-100 rounded-lg p-8 text-center">
            <div className="text-6xl mb-4">🎥</div>
            <h3 className="text-xl font-bold mb-2">{content.title}</h3>
            <p className="text-gray-600 mb-4">{content.description}</p>
            <div className="bg-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-500">
                Video content would be embedded here
              </p>
            </div>
          </div>
        );
      case "reading":
        return (
          <div className="bg-white rounded-lg p-6 border">
            <h3 className="text-xl font-bold mb-4">{content.title}</h3>
            <p className="text-gray-600 mb-4">{content.description}</p>
            <div className="prose max-w-none">
              <p>
                This is where the lesson content would be displayed. It could
                include:
              </p>
              <ul>
                <li>Text explanations</li>
                <li>Images and diagrams</li>
                <li>Interactive elements</li>
                <li>Examples and exercises</li>
              </ul>
              <p>
                For now, this is placeholder content to demonstrate the lesson
                structure.
              </p>
            </div>
          </div>
        );
      case "quiz":
        return (
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-xl font-bold mb-4">{content.title}</h3>
            <p className="text-gray-600 mb-4">{content.description}</p>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border">
                <p className="font-medium mb-2">Sample Question:</p>
                <p className="mb-3">What is the main topic of this lesson?</p>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="radio" name="quiz" className="mr-2" />
                    Option A
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="quiz" className="mr-2" />
                    Option B
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="quiz" className="mr-2" />
                    Option C
                  </label>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <div>Content type not supported</div>;
    }
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

  if (!course || !lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Lesson not found</p>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(`/course/${courseId}`)}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ChevronLeft size={20} className="mr-1" />
            Back to Course
          </button>
          <div className="text-sm text-gray-600">
            Step {currentStep + 1} of {lesson.content.length}
          </div>
        </div>

        {/* Course Info */}
        <div
          className={`bg-gradient-to-r ${course.color} p-4 rounded-xl text-white mb-6`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{lesson.title}</h1>
              <p className="text-white text-opacity-90">{course.title}</p>
            </div>
            <div className="text-4xl">{course.thumbnail}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Lesson Progress
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(((currentStep + 1) / lesson.content.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`bg-gradient-to-r ${course.color} h-2 rounded-full transition-all duration-300`}
              style={{
                width: `${((currentStep + 1) / lesson.content.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Lesson Content */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          {renderContent(lesson.content[currentStep])}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePreviousStep}
            disabled={currentStep === 0}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              currentStep === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-500 text-white hover:bg-gray-600"
            }`}
          >
            Previous
          </button>

          <button
            onClick={handleNextStep}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-all"
          >
            {currentStep === lesson.content.length - 1
              ? "Complete Lesson"
              : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonPage;
