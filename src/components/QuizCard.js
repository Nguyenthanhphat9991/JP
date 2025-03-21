// components/QuizCard.js
import React from 'react';
import { FaFlag } from 'react-icons/fa';

const QuizCard = ({
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  userAnswer,
  handleChoiceChange,
  handleFillInChange,
  handleNextQuestion,
  handleBackQuestion,
  handleReport,
}) => {
  const answerGiven = currentQuestion.type === "choice" 
    ? userAnswer !== null 
    : currentQuestion.type === "fill_in" 
      ? userAnswer.trim() !== "" 
      : false;

  return (
    <div className="quiz-card shadow p-4" style={{ position: "relative" }}>
      {/* Icon báo cáo cho quiz – báo cáo lỗi cho chính câu hỏi hiện tại */}
      <FaFlag
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          cursor: "pointer",
          color: "red",
          fontSize: "1.2rem"
        }}
        title="Báo cáo câu hỏi này"
        onClick={handleReport}
      />
      <h5
        className="mb-3"
        dangerouslySetInnerHTML={{ __html: currentQuestion.question_text }}
      />
      {currentQuestion.type === "choice" && currentQuestion.answers && currentQuestion.answers.map((ans, idx) => (
        <div className="form-check mb-2" key={ans.id}>
          <input
            type="radio"
            className="form-check-input"
            id={`answer-${ans.id}`}
            name={`question-${currentQuestion.id}`}
            checked={userAnswer === idx}
            onChange={() => handleChoiceChange(idx)}
          />
          <label className="form-check-label" htmlFor={`answer-${ans.id}`}>
            {ans.answer_text}
          </label>
        </div>
      ))}
      {currentQuestion.type === "fill_in" && (
        <div>
          <input
            type="text"
            className="form-control"
            placeholder="Nhập câu trả lời..."
            value={userAnswer}
            onChange={(e) => handleFillInChange(e.target.value)}
          />
        </div>
      )}
      <div className="d-flex justify-content-between mt-4">
        <button
          className="btn btn-secondary"
          onClick={handleBackQuestion}
          disabled={currentQuestionIndex === 0}
        >
          Back
        </button>
        <button
          className="btn btn-primary"
          onClick={handleNextQuestion}
          disabled={!answerGiven}
        >
          {currentQuestionIndex === totalQuestions - 1 ? "Xem kết quả" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default QuizCard;
