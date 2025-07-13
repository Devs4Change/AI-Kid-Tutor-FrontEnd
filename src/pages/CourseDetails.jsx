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
} from "lucide-react";
import { getCourses } from "../services/courses";
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
        const courses = await getCourses();

        // Find the course by ID (handle both string and number IDs)
        const foundCourse = courses.find(
          (c) =>
            c._id === courseId ||
            c.id === courseId ||
            c._id === parseInt(courseId) ||
            c.id === parseInt(courseId)
        );

        if (foundCourse) {
          // Generate lessons for the found course
          const currentUserEmail =
            localStorage.getItem("userEmail") || "anonymous";
          const completedLessonsKey = `completedLessons_${
            foundCourse._id || foundCourse.id
          }_${currentUserEmail}`;
          const completedLessons = JSON.parse(
            localStorage.getItem(completedLessonsKey) || "[]"
          );

          const lessons = Array.from(
            { length: foundCourse.lessons || 5 },
            (_, i) => ({
              id: i + 1,
              title: `${foundCourse.title} - Lesson ${i + 1}`,
              duration: `${Math.floor(Math.random() * 10) + 15} min`,
              completed: completedLessons.includes(i + 1), // Check if lesson is in completed list
              locked: i > completedLessons.length, // Lock lessons beyond the completed ones
            })
          );

          // Add frontend-specific fields
          const courseWithFrontendFields = {
            ...foundCourse,
            id: foundCourse._id || foundCourse.id,
            progress: Math.round(
              (completedLessons.length / (foundCourse.lessons || 5)) * 100
            ),
            completed:
              completedLessons.length === (foundCourse.lessons || 5) &&
              (foundCourse.lessons || 5) > 0,
            unlocked: true,
            color: foundCourse.color || "from-blue-400 to-blue-600",
            thumbnail: foundCourse.thumbnail || "📚",
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/courses")}
          className="flex items-center text-blue-600 mb-6 hover:text-blue-800 transition-colors"
        >
          <ChevronLeft size={20} className="mr-1" />
          Back to Courses
        </button>

        {/* Course Header */}
        <div
          className={`bg-gradient-to-r ${course.color} p-6 rounded-xl text-white mb-6`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
              <p className="text-white text-opacity-90">{course.description}</p>
            </div>
            <div className="text-6xl">{course.thumbnail}</div>
          </div>
        </div>

        {/* Course Info */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <BookOpen size={18} className="text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-medium">{course.category}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Star size={18} className="text-yellow-400 fill-current" />
              <div>
                <p className="text-sm text-gray-500">Rating</p>
                <p className="font-medium">{course.rating}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Users size={18} className="text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Students</p>
                <p className="font-medium">
                  {course.enrolled.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Clock size={18} className="text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-medium">{course.duration}</p>
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
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Course Progress</h2>
            <span className="text-sm font-medium text-gray-600">
              {course.lessons.filter((l) => l.completed).length} of{" "}
              {course.lessons.length} lessons completed
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div
              className={`bg-gradient-to-r ${course.color} h-3 rounded-full`}
              style={{
                width: `${
                  (course.lessons.filter((l) => l.completed).length /
                    course.lessons.length) *
                  100
                }%`,
              }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
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
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Lessons</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {course.lessons.map((lesson, index) => (
              <div
                key={lesson.id}
                className={`p-6 transition-colors ${
                  lesson.locked
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:bg-gray-50 cursor-pointer"
                }`}
                onClick={() => !lesson.locked && handleLessonClick(lesson)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-4 text-gray-400 font-medium w-8 text-center">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">
                        {lesson.title}
                      </h3>
                      <p className="text-sm text-gray-500">{lesson.duration}</p>
                    </div>
                  </div>
                  <div>
                    {lesson.locked ? (
                      <Lock className="text-gray-400" size={20} />
                    ) : lesson.completed ? (
                      <CheckCircle className="text-green-500" size={20} />
                    ) : (
                      <button className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors">
                        <Play size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Skills You'll Learn
          </h2>
          <div className="flex flex-wrap gap-2">
            {course.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium"
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
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-xl font-bold text-green-800 mb-2">
                  Course Completed!
                </h3>
                <p className="text-green-600 mb-4">
                  Congratulations! You've successfully completed all lessons in
                  this course.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => navigate("/courses")}
                    className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-all"
                  >
                    Browse More Courses
                  </button>
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-all"
                  >
                    Go to Dashboard
                  </button>
                  <button
                    onClick={() => navigate("/")}
                    className="bg-gray-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-600 transition-all"
                  >
                    Back to Home
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // Course in progress - show continue button
            <button
              className="w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 bg-blue-500 text-white hover:bg-blue-600"
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
