import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProgressBar } from "react-bootstrap";
import "./QuizPage.css";

// Hàm random hóa mảng (Fisher-Yates)
const shuffleArray = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

function QuizPage() {
    const { courseId, lessonId } = useParams();
    const navigate = useNavigate();

    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);

    const MaxQuestions = 25;

    // Fetch dữ liệu từ file JSON, random hóa câu hỏi và đáp án, chỉ lấy 5 câu
    useEffect(() => {
        fetch(`/data/quiz/bai${lessonId}-${courseId}.json`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Không thể tải file bai1-N5.json");
                }
                return res.json();
            })
            .then((data) => {
                // Random hóa toàn bộ câu hỏi
                const shuffledQuestions = shuffleArray(data);
                // Chọn 5 câu ngẫu nhiên
                const limitedQuestions = shuffledQuestions.slice(0, MaxQuestions);
                // Random hóa thứ tự đáp án cho mỗi câu
                limitedQuestions.forEach((q) => {
                    q.answers = shuffleArray(q.answers);
                });
                setQuestions(limitedQuestions);
                // Mảng lưu đáp án người dùng
                setUserAnswers(Array(limitedQuestions.length).fill(null));
            })
            .catch((err) => console.error("Lỗi fetch dữ liệu:", err));
    }, [courseId, lessonId]);
    

    const totalQuestions = questions.length;
    const currentQuestion = questions[currentQuestionIndex] || {};

    // Khi chọn 1 đáp án (radio)
    const handleOptionChange = (answerIndex) => {
        const updatedAnswers = [...userAnswers];
        updatedAnswers[currentQuestionIndex] = answerIndex;
        setUserAnswers(updatedAnswers);
    };

    // Nút Next/Xem kết quả
    const handleNextQuestion = () => {
        if (userAnswers[currentQuestionIndex] !== null) {
            if (currentQuestionIndex === totalQuestions - 1) {
                // Tính điểm
                let computedScore = 0;
                questions.forEach((q, i) => {
                    if (
                        userAnswers[i] !== null &&
                        q.answers[userAnswers[i]].is_correct
                    ) {
                        computedScore += 1;
                    }
                });
                setScore(computedScore);
                setShowResult(true);
            } else {
                setCurrentQuestionIndex((prev) => prev + 1);
            }
        }
    };

    // Nút Back
    const handleBackQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prev) => prev - 1);
        }
    };

    // Nút "Làm lại"
    const handleResetQuiz = () => {
        setCurrentQuestionIndex(0);
        setUserAnswers(Array(totalQuestions).fill(null));
        setScore(0);
        setShowResult(false);
    };

    // Hàm để chuyển về trang chọn bài học khác
    const handleChooseAnotherLesson = () => {
        navigate(`/courses/${courseId}/1/lessons`);
    };

    // Mảng các câu sai (câu trả lời sai)
    const incorrectQuestions = questions
        .map((q, i) => {
            const chosenIndex = userAnswers[i];
            if (chosenIndex === null || q.answers[chosenIndex].is_correct) {
                return null; // Không sai
            }
            return {
                questionIndex: i + 1,
                question: q.question_text,
                selected: q.answers[chosenIndex].answer_text,
                correct:
                    q.answers.find((ans) => ans.is_correct)?.answer_text || "Không rõ",
            };
        })
        .filter((item) => item !== null);

    return (
        <div className="quiz-container">
            <div className="quiz-inner">
                <h2 className="mb-4 text-center quiz-title">
                    Ôn tập - Khóa {courseId} - Bài {lessonId}
                </h2>

                {questions.length === 0 && (
                    <p className="text-center">Đang tải dữ liệu...</p>
                )}

                {showResult && totalQuestions > 0 ? (
                    <div className="quiz-result shadow p-4">
                        <h3 className="result-title text-center mb-3">
                            <span className="result-icon">🎉</span> Kết quả
                        </h3>
                        <p className="text-center fs-5">
                            Bạn đã trả lời đúng <strong>{score}</strong> / {totalQuestions} câu.
                        </p>

                        {incorrectQuestions.length > 0 && (
                            <div className="incorrect-answers mt-4">
                                <h5 className="mb-3">
                                    <span className="text-danger">Oops!</span> Các câu bạn trả lời sai:
                                </h5>
                                <div className="incorrect-list">
                                    {incorrectQuestions.map((item, idx) => (
                                        <div className="incorrect-item" key={idx}>
                                            <div className="mb-2">
                                                <strong className="question-label">
                                                    Câu {item.questionIndex}:
                                                </strong>{" "}
                                                <span
                                                    className="question-text"
                                                    dangerouslySetInnerHTML={{ __html: item.question }}
                                                />
                                            </div>
                                            <div className="mb-2">
                                                <strong className="answer-label text-warning">
                                                    Đáp án bạn chọn:
                                                </strong>{" "}
                                                <span className="badge bg-warning text-dark">
                                                    {item.selected}
                                                </span>
                                            </div>
                                            <div>
                                                <strong className="answer-label text-success">
                                                    Đáp án đúng:
                                                </strong>{" "}
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
                            <button
                                className="btn btn-info"
                                onClick={handleChooseAnotherLesson}
                            >
                                Chọn bài học khác
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {totalQuestions > 0 && (
                            <>
                                <ProgressBar
                                    now={((currentQuestionIndex + 1) / totalQuestions) * 100}
                                    label={`${currentQuestionIndex + 1}/${totalQuestions}`}
                                    className="mb-4"
                                />

                                <div className="quiz-card shadow p-4">
                                    <h5
                                        className="mb-3"
                                        dangerouslySetInnerHTML={{ __html: currentQuestion.question_text }}
                                    />
                                    {currentQuestion.answers?.map((ans, idx) => (
                                        <div className="form-check mb-2" key={ans.id}>
                                            <input
                                                type="radio"
                                                className="form-check-input"
                                                id={`answer-${ans.id}`}
                                                name={`question-${currentQuestion.id}`}
                                                checked={userAnswers[currentQuestionIndex] === idx}
                                                onChange={() => handleOptionChange(idx)}
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor={`answer-${ans.id}`}
                                            >
                                                {ans.answer_text}
                                            </label>
                                        </div>
                                    ))}
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
                                            disabled={userAnswers[currentQuestionIndex] === null}
                                        >
                                            {currentQuestionIndex === totalQuestions - 1
                                                ? "Xem kết quả"
                                                : "Next"}
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default QuizPage;
