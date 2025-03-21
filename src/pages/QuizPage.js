// components/QuizPage.js
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProgressBar, Button } from "react-bootstrap";
import { FaFlag } from "react-icons/fa";
import QuizCard from "../components/QuizCard";
import QuizReportModal from "../components/QuizReportModal";
import ResultReportModal from "../components/ResultReportModal";
import useQuiz from "../hooks/useQuiz";
import "./QuizPage.css";

function QuizPage() {
  const { courseId, lessonId, categoryId } = useParams();
  const navigate = useNavigate();

  const {
    userAnswers,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    showResult,
    score,
    incorrectQuestions,
    handleChoiceChange,
    handleFillInChange,
    handleNextQuestion,
    handleBackQuestion,
    handleResetQuiz,
  } = useQuiz({ courseId, lessonId, categoryId, maxQuestions: 3 });

  // State cho báo cáo lỗi khi đang làm quiz (chỉ cho câu hiện tại)
  const [showQuizReportModal, setShowQuizReportModal] = useState(false);
  const [quizReportFeedback, setQuizReportFeedback] = useState("");

  // State cho báo cáo lỗi ở màn hình kết quả (cho nhiều cặp)
  const [showResultReportModal, setShowResultReportModal] = useState(false);
  const [resultReportItems, setResultReportItems] = useState([{ selectedQuestionIndex: 0, feedback: "" }]);

  // --- Handlers cho báo cáo lỗi trong lúc làm quiz ---
  const handleReport = () => {
    setShowQuizReportModal(true);
  };

  const handleSubmitQuizReport = () => {
    if (!quizReportFeedback.trim()) {
      alert("Vui lòng nhập nội dung báo cáo.");
      return;
    }
    const now = new Date();
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const yyyy = now.getFullYear();
    const hh = String(now.getHours()).padStart(2, "0");
    const mn = String(now.getMinutes()).padStart(2, "0");
    const filename = `${yyyy}${mm}${dd}-${hh}${mn}${seconds}-${courseId}-${lessonId}-${categoryId}.txt`;

    const payload = {
      filename,
      content: `Câu: ${currentQuestion.question_text}\nNội dung: ${quizReportFeedback}`,
      question_title: currentQuestion.question_text,
    };

    fetch("http://localhost:3001/api/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) {
          alert("Báo cáo thất bại. Vui lòng thử lại sau.");
        } else {
          alert("Báo cáo đã được gửi thành công.");
          setShowQuizReportModal(false);
          setQuizReportFeedback("");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Có lỗi xảy ra khi gửi báo cáo.");
      });
  };

  // --- Handlers cho báo cáo lỗi ở màn hình kết quả ---
  const handleResultReportItemChange = (index, field, value) => {
    const updated = [...resultReportItems];
    updated[index][field] = value;
    setResultReportItems(updated);
  };

  const addResultReportItem = () => {
    setResultReportItems([...resultReportItems, { selectedQuestionIndex: 0, feedback: "" }]);
  };

  const removeResultReportItem = (index) => {
    if (resultReportItems.length === 1) return;
    const newItems = [...resultReportItems];
    newItems.splice(index, 1);
    setResultReportItems(newItems);
  };

  const handleResultReportSubmit = () => {
    const mergedFeedback = resultReportItems
      .map((item) => {
        const selectedIdx = item.selectedQuestionIndex;
        const questionObj = incorrectQuestions[selectedIdx];
        const fb = item.feedback.trim();
        if (!fb || !questionObj) return null;
        return `Câu ${questionObj.questionIndex}: ${questionObj.question}\nNội dung: ${fb}`;
      })
      .filter(Boolean)
      .join("\n\n");

    if (!mergedFeedback) {
      alert("Vui lòng nhập ít nhất một feedback.");
      return;
    }

    const now = new Date();
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const yyyy = now.getFullYear();
    const hh = String(now.getHours()).padStart(2, "0");
    const mn = String(now.getMinutes()).padStart(2, "0");
    const filename = `${yyyy}${mm}${dd}-${hh}${mn}${seconds}-${courseId}-${lessonId}-${categoryId}.txt`;

    const payload = {
      filename,
      content: mergedFeedback,
      question_title: "Nhiều câu",
    };

    fetch("http://localhost:3001/api/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) {
          alert("Báo cáo thất bại. Vui lòng thử lại sau.");
        } else {
          alert("Báo cáo đã được gửi thành công.");
          setShowResultReportModal(false);
          setResultReportItems([{ selectedQuestionIndex: 0, feedback: "" }]);
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Có lỗi xảy ra khi gửi báo cáo.");
      });
  };

  return (
    <div className="quiz-container">
      <div className="quiz-inner">
        <h2 className="mb-4 text-center quiz-title">
          {Number(categoryId) !== 1
            ? `Ôn tập - Khóa ${
                Number(courseId) === 1
                  ? "N5"
                  : Number(courseId) === 2
                  ? "N4"
                  : Number(courseId) === 3
                  ? "N3"
                  : ""
              } - Luyện tập ${
                Number(categoryId) === 2
                  ? "động từ"
                  : Number(categoryId) === 3
                  ? "tính từ"
                  : Number(categoryId) === 4
                  ? "kanji"
                  : ""
              }`
            : `Ôn tập - Khóa ${courseId} - Bài ${lessonId}`}
        </h2>
        {!showResult ? (
          <>
            <ProgressBar
              now={((currentQuestionIndex + 1) / totalQuestions) * 100}
              label={`${currentQuestionIndex + 1}/${totalQuestions}`}
              className="mb-4"
            />
            <QuizCard
              currentQuestion={currentQuestion}
              currentQuestionIndex={currentQuestionIndex}
              totalQuestions={totalQuestions}
              // Sử dụng giá trị từ userAnswers để truyền cho QuizCard; nếu là fill_in, đảm bảo không null
              userAnswer={userAnswers[currentQuestionIndex] || ""}
              handleChoiceChange={handleChoiceChange}
              handleFillInChange={handleFillInChange}
              handleNextQuestion={handleNextQuestion}
              handleBackQuestion={handleBackQuestion}
              handleReport={handleReport}
            />
          </>
        ) : (
          <div className="quiz-result shadow p-4">
            <h3 className="result-title text-center mb-3">
              <span className="result-icon">🎉</span> Kết quả
            </h3>
            <p className="text-center fs-5">
              Bạn đã trả lời đúng <strong>{score}</strong> / {totalQuestions} câu.
            </p>
            <div className="text-center mt-3">
              <Button variant="warning" onClick={() => setShowResultReportModal(true)}>
                Báo cáo lỗi kết quả <FaFlag style={{ marginLeft: "5px" }} />
              </Button>
            </div>
            <ResultReportModal
              show={showResultReportModal}
              onHide={() => setShowResultReportModal(false)}
              courseId={courseId}
              lessonId={lessonId}
              categoryId={categoryId}
              incorrectQuestions={incorrectQuestions}
              reportItems={resultReportItems}
              handleReportItemChange={handleResultReportItemChange}
              addReportItem={addResultReportItem}
              removeReportItem={removeResultReportItem}
              handleResultReportSubmit={handleResultReportSubmit}
            />
            {incorrectQuestions.length > 0 && (
              <div className="incorrect-answers mt-4">
                <h5 className="mb-3">
                  <span className="text-danger">Oops!</span> Các câu bạn trả lời sai:
                </h5>
                <div className="incorrect-list">
                  {incorrectQuestions.map((item, idx) => (
                    <div className="incorrect-item" key={idx}>
                      <div className="mb-2">
                        <strong className="question-label">Câu {item.questionIndex}:</strong>{" "}
                        <span className="question-text" dangerouslySetInnerHTML={{ __html: item.question }} />
                      </div>
                      <div className="mb-2">
                        <strong className="answer-label text-warning">
                          {item.type === "choice" ? "Đáp án bạn chọn:" : "Đáp án bạn nhập:"}
                        </strong>{" "}
                        <span className="badge bg-warning text-dark">{item.selected}</span>
                      </div>
                      <div>
                        <strong className="answer-label text-success">Đáp án đúng:</strong>{" "}
                        <span className="badge bg-success">{item.correct}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="quiz-result-buttons mt-4">
              <button className="btn btn-success" onClick={handleResetQuiz}>
                Làm lại bài test
              </button>
              <button className="btn btn-info" onClick={() => navigate(`/courses/${courseId}/1/lessons`)}>
                Chọn bài học khác
              </button>
            </div>
          </div>
        )}
        <QuizReportModal
          show={showQuizReportModal}
          onHide={() => setShowQuizReportModal(false)}
          courseId={courseId}
          lessonId={lessonId}
          categoryId={categoryId}
          currentQuestion={currentQuestion}
          feedback={quizReportFeedback}
          onFeedbackChange={(val) => setQuizReportFeedback(val)}
          onSubmitReport={handleSubmitQuizReport}
        />
      </div>
    </div>
  );
}

export default QuizPage;