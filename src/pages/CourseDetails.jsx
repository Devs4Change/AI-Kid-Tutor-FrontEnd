import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  BookOpen,
  Play,
  CheckCircle,
  Lock,
  Star,
  Users,
  Clock,
  LayoutDashboard,
} from "lucide-react";
import { getCourses, getCourse } from "../services/courses";
import CourseRating from "../components/CourseRating";

const CourseDetailsPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const foundCourse = await getCourse(courseId, token);

        if (foundCourse) {
          let lessons = [];
          if (Array.isArray(foundCourse.lessons)) {
            const currentUserEmail =
              localStorage.getItem("userEmail") || "anonymous";
            const completedLessonsKey = `completedLessons_${
              foundCourse._id || foundCourse.id
            }_${currentUserEmail}`;
            const completedLessons = JSON.parse(
              localStorage.getItem(completedLessonsKey) || "[]"
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

          // Add frontend-specific fields
          const courseWithFrontendFields = {
            ...foundCourse,
            id: foundCourse._id || foundCourse.id,
            progress: Math.round(
              (lessons.filter((l) => l.completed).length / lessons.length) * 100
            ),
            completed:
              lessons.filter((l) => l.completed).length === lessons.length &&
              lessons.length > 0,
            unlocked: true,
            color: foundCourse.color || "from-blue-400 to-blue-600",
            thumbnail: foundCourse.thumbnail || "\ud83d\udcda",
            skills: foundCourse.skills || [
              "Problem Solving",
              "Critical Thinking",
            ],
            lessons,
          };

          setCourse(courseWithFrontendFields);
        } else {
          setError("Course not found");
        }
      } catch (err) {
        console.error("Error fetching course:", err);
        setError("Failed to load course");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleLessonClick = (lesson) => {
    if (lesson.locked) {
      alert("Complete the previous lesson first to unlock this one!");
      return;
    }
    navigate(`/course/${courseId}/lesson/${lesson.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course details...</p>
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
            onClick={() => navigate("/courses")}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Course not found</p>
          <button
            onClick={() => navigate("/courses")}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mt-4"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button and Dashboard Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6">
          <button
            onClick={() => navigate("/courses")}
            className="flex items-center gap-2 px-4 sm:px-6 py-2 bg-gradient-to-r from-blue-100 to-blue-300 text-blue-800 font-bold rounded-full shadow-md border border-blue-200 transition-all duration-300 hover:from-blue-200 hover:to-blue-400 hover:shadow-lg hover:text-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-200/50 text-sm sm:text-base"
          >
            <ChevronLeft size={18} className="sm:mr-1" />
            Back to Courses
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 px-4 sm:px-6 py-2 bg-gradient-to-r from-purple-100 to-purple-300 text-purple-800 font-bold rounded-full shadow-md border border-purple-200 transition-all duration-300 hover:from-purple-200 hover:to-purple-400 hover:shadow-lg hover:text-purple-900 focus:outline-none focus:ring-4 focus:ring-purple-200/50 text-sm sm:text-base"
          >
            <LayoutDashboard size={18} />
            View Dashboard
          </button>
        </div>

        {/* Course Header */}
        <div
          className={`bg-gradient-to-r ${course.color} p-4 sm:p-6 rounded-xl text-white mb-6`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                {course.title}
              </h1>
              <p className="text-white text-opacity-90 text-sm sm:text-base">
                {course.description}
              </p>
            </div>
            <div className="text-4xl sm:text-6xl">{course.thumbnail}</div>
          </div>
        </div>

        {/* Course Info */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <BookOpen
                size={16}
                className="sm:text-lg text-gray-500 flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-500">Category</p>
                <p className="font-medium text-sm sm:text-base truncate">
                  {course.category}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Star
                size={16}
                className="sm:text-lg text-yellow-400 fill-current flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-500">Rating</p>
                <p className="font-medium text-sm sm:text-base">
                  {course.rating}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Users
                size={16}
                className="sm:text-lg text-gray-500 flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-500">Students</p>
                <p className="font-medium text-sm sm:text-base">
                  {course.enrolled.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Clock
                size={16}
                className="sm:text-lg text-gray-500 flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-500">Duration</p>
                <p className="font-medium text-sm sm:text-base">
                  {course.duration}
                </p>
              </div>
            </div>
          </div>

          {/* Level Badge */}
          <div className="flex justify-between items-center">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                course.level === "Beginner"
                  ? "bg-green-100 text-green-800"
                  : course.level === "Intermediate"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {course.level} Level
            </span>
          </div>
        </div>

        {/* Course Progress */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Course Progress
            </h2>
            <span className="text-xs sm:text-sm font-medium text-gray-600">
              {course.lessons.filter((l) => l.completed).length} of{" "}
              {course.lessons.length} lessons completed
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 mb-4">
            <div
              className={`bg-gradient-to-r ${course.color} h-2 sm:h-3 rounded-full`}
              style={{
                width: `${
                  (course.lessons.filter((l) => l.completed).length /
                    course.lessons.length) *
                  100
                }%`,
              }}
            ></div>
          </div>
          <div className="flex justify-between text-xs sm:text-sm text-gray-600">
            <span>
              {Math.round(
                (course.lessons.filter((l) => l.completed).length /
                  course.lessons.length) *
                  100
              )}
              % Complete
            </span>
            <span>{course.duration} total</span>
          </div>
        </div>

        {/* Lessons List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Lessons
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {course.lessons.map((lesson, index) => (
              <div
                key={lesson.id}
                className={`p-4 sm:p-6 transition-colors ${
                  lesson.locked
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:bg-gray-50 cursor-pointer"
                }`}
                onClick={() => !lesson.locked && handleLessonClick(lesson)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center flex-1 min-w-0">
                    <div className="mr-3 sm:mr-4 text-gray-400 font-medium w-6 sm:w-8 text-center text-sm sm:text-base flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-gray-800 text-sm sm:text-base truncate">
                        {lesson.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {lesson.duration}
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-2">
                    {lesson.locked ? (
                      <Lock className="text-gray-400" size={18} />
                    ) : lesson.completed ? (
                      <CheckCircle className="text-green-500" size={18} />
                    ) : (
                      <button className="bg-blue-500 text-white p-1.5 sm:p-2 rounded-full hover:bg-blue-600 transition-colors">
                        <Play size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Section */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mt-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
            Skills You'll Learn
          </h2>
          <div className="flex flex-wrap gap-2">
            {course.skills.map((skill, index) => (
              <span
                key={index}
                className="px-2 sm:px-3 py-1 sm:py-2 bg-blue-100 text-blue-800 rounded-lg text-xs sm:text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Course Rating Section */}
        {course.lessons.every((l) => l.completed) && (
          <div className="mt-6">
            <CourseRating
              courseId={course._id || course.id}
              onRatingSubmitted={(ratingData) => {
                console.log("Rating submitted:", ratingData);
              }}
            />
          </div>
        )}

        {/* Start Course Button */}
        <div className="mt-6">
          {course.lessons.every((l) => l.completed) ? (
            // Course completed - show completion options
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6 text-center">
                <div className="text-4xl sm:text-6xl mb-4">🎉</div>
                <h3 className="text-lg sm:text-xl font-bold text-green-800 mb-2">
                  Course Completed!
                </h3>
                <p className="text-green-600 mb-4 text-sm sm:text-base">
                  Congratulations! You've successfully completed all lessons in
                  this course.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => navigate("/courses")}
                    className="bg-green-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:bg-green-600 transition-all text-sm sm:text-base"
                  >
                    Browse More Courses
                  </button>
                  <button
                    onClick={() => {
                      const role = localStorage.getItem("role");
                      if (role === "admin") {
                        navigate("/dashboard/admin");
                      } else {
                        navigate("/dashboard");
                      }
                    }}
                    className="bg-blue-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:bg-blue-600 transition-all text-sm sm:text-base"
                  >
                    Go to Dashboard
                  </button>
                  <button
                    onClick={() => navigate("/")}
                    className="bg-gray-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:bg-gray-600 transition-all text-sm sm:text-base"
                  >
                    Back to Home
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // Course in progress - show continue button
            <button
              className="w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 bg-blue-500 text-white hover:bg-blue-600 text-sm sm:text-base"
              onClick={() => {
                const nextAvailableLesson = course.lessons.find(
                  (l) => !l.completed && !l.locked
                );
                if (nextAvailableLesson) handleLessonClick(nextAvailableLesson);
              }}
            >
              <Play size={16} />
              <span>
                {(() => {
                  const nextLesson = course.lessons.find(
                    (l) => !l.completed && !l.locked
                  );
                  if (!nextLesson) {
                    return "Course Completed";
                  } else if (nextLesson.id === 1) {
                    return "Start First Lesson";
                  } else {
                    return `Continue to Lesson ${nextLesson.id}`;
                  }
                })()}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;
