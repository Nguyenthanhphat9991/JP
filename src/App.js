import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import CourseDetail from "./pages/CourseDetail";
import LessonDetail from "./pages/LessonDetail";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LessonContent from "./pages/LessonContent";
import 'bootstrap/dist/css/bootstrap.min.css';
import QuizPage from "./pages/QuizPage"; // Giả sử bạn có 1 trang QuizPage

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/courses/:courseId/:categoryId/lessons" element={<LessonDetail />} />
        <Route path="/courses/:courseId/categories/:categoryId/lessons/:lessonId/lesson-content" element={<LessonContent />} />
        <Route path="/courses/:courseId/categories/1/lessons/:lessonId/quiz" element={<QuizPage />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;