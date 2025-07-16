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
        const token = localStorage.getItem("token");
        const courses = await getCourses(token);

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

      // Go to next lesson if it exists, else go to course overview
      const nextLessonId = parseInt(lessonId) + 1;
      if (course && nextLessonId <= course.lessons.length) {
        navigate(`/course/${courseId}/lesson/${nextLessonId}`);
      } else {
        alert(
          "Congratulations! You have completed all lessons in this course."
        );
        navigate(`/course/${courseId}`);
      }
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
            {lesson.title}
          </h1>
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-gray-500 mr-2" />
            <span>{lesson.duration}</span>
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

        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handlePreviousStep}
            disabled={currentStep === 0}
            className="text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={handleNextStep}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            {currentStep < lesson.content.length - 1
              ? "Next"
              : "Complete Lesson"}
          </button>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">
            {lesson.content[currentStep].title}
          </h2>
          <p className="text-gray-600 mb-4">
            {lesson.content[currentStep].description}
          </p>
          {renderContent(lesson.content[currentStep])}
        </div>
      </div>
    </div>
  );
};

export default LessonPage;
