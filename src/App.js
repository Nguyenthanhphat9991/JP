import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import CourseDetail from "./pages/CourseDetail";
import LessonDetail from "./pages/LessonDetail";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LessonContent from "./pages/LessonContent";
import QuizPage from "./pages/QuizPage";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  return (
    <Router>
      {/* .app-container bọc trực tiếp Navbar, main-content, Footer */}
      <div className="app-container">
        <Navbar />
        
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route
              path="/courses/:courseId/:categoryId/lessons"
              element={<LessonDetail />}
            />
            <Route
              path="/courses/:courseId/categories/:categoryId/lessons/:lessonId/lesson-content"
              element={<LessonContent />}
            />
            <Route
              path="/courses/:courseId/categories/1/lessons/:lessonId/quiz"
              element={<QuizPage />}
            />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
};

export default App;
