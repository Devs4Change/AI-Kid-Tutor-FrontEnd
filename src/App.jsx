import React from "react";
import "./App.css";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";
import LoginForm from "./pages/LoginForm";
import RegisterForm from "./pages/RegisterForm";
import AboutPage from "./pages/AboutPage";
import HomePage from "./pages/HomePage";
import Features from "./pages/Features";
import HeroSection from "./pages/HeroSection";
import Pricing from "./pages/Pricing";
import ContactForm from "./pages/ContactForm";
import DashboardLayout from "./layouts/DashboardLayout";
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailsPage from "./pages/CourseDetails";
import LessonPage from "./pages/LessonPage";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import LessonsPage from "./pages/LessonsPage";
import PracticePage from "./pages/PracticePage";
import PracticeQuizzesPage from "./pages/PracticeQuizzesPage";
import PracticeCodingPage from "./pages/PracticeCodingPage";
import PracticeProjectsPage from "./pages/PracticeProjectsPage";
import GamesPage from "./pages/GamesPage";
import AIPuzzleGame from "./pages/AIPuzzleGame";
import RobotBuilderGame from "./pages/RobotBuilderGame";
import AIAdventureGame from "./pages/AIAdventureGame";
import ChatPage from "./pages/ChatPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import AppWrapper from "./components/AppWrapper";
import { ThemeProvider } from "./contexts/ThemeContext";

function RequireAdmin() {
  const isAdmin =
    typeof window !== "undefined" && localStorage.getItem("role") === "admin";
  return isAdmin ? <Outlet /> : <Navigate to="/dashboard" replace />;
}

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppWrapper />,
      children: [
        { index: true, element: <HomePage /> },
        { path: "login", element: <LoginForm /> },
        { path: "register", element: <RegisterForm /> },
        { path: "about", element: <AboutPage /> },
        { path: "features", element: <Features /> },
        { path: "hero", element: <HeroSection /> },
        { path: "price", element: <Pricing /> },
        { path: "contact", element: <ContactForm /> },
        { path: "courses", element: <CoursesPage /> },
        { path: "/course/:courseId", element: <CourseDetailsPage /> },
        { path: "/course/:courseId/lesson/:lessonId", element: <LessonPage /> },
        { path: "lessons", element: <LessonsPage /> },
        { path: "practice", element: <PracticePage /> },
        { path: "games", element: <GamesPage /> },
        { path: "games/puzzle", element: <AIPuzzleGame /> },
        { path: "games/robot-builder", element: <RobotBuilderGame /> },
        { path: "games/adventure", element: <AIAdventureGame /> },
        {
          path: "achievements",
          element: (
            <div className="p-8 text-center">
              <h1 className="text-2xl font-bold mb-4">Achievements</h1>
              <p>Coming soon!</p>
            </div>
          ),
        },
        { path: "chat", element: <ChatPage /> },
        { path: "profile", element: <ProfilePage /> },
        { path: "settings", element: <SettingsPage /> },
        {
          path: "help",
          element: (
            <div className="p-8 text-center">
              <h1 className="text-2xl font-bold mb-4">Help & Support</h1>
              <p>Coming soon!</p>
            </div>
          ),
        },
        {
          path: "lessons/basics",
          element: (
            <div className="p-8 text-center">
              <h1 className="text-2xl font-bold mb-4">AI Basics</h1>
              <p>Coming soon!</p>
            </div>
          ),
        },
        {
          path: "lessons/robots",
          element: (
            <div className="p-8 text-center">
              <h1 className="text-2xl font-bold mb-4">Robots & AI</h1>
              <p>Coming soon!</p>
            </div>
          ),
        },
        {
          path: "lessons/games",
          element: (
            <div className="p-8 text-center">
              <h1 className="text-2xl font-bold mb-4">AI Games</h1>
              <p>Coming soon!</p>
            </div>
          ),
        },
        {
          path: "practice/quizzes",
          element: <PracticeQuizzesPage />,
        },
        {
          path: "practice/coding",
          element: <PracticeCodingPage />,
        },
        {
          path: "practice/projects",
          element: <PracticeProjectsPage />,
        },
        {
          path: "/dashboard",
          element: <DashboardLayout />,
          children: [
            {
              index: true,
              element: <StudentDashboard />,
            },
            // Protect admin route
            {
              element: <RequireAdmin />, // Only admins can access children
              children: [
                {
                  path: "admin",
                  element: <AdminDashboard />,
                },
              ],
            },
          ],
        },
      ],
    },
  ]);

  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
