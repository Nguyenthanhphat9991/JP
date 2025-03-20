import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProgressBar, Modal, Button, Form } from "react-bootstrap";
import { FaFlag, FaPlus, FaMinus } from "react-icons/fa";
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
  const { courseId, lessonId, categoryId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // Với "choice": lưu index đáp án, với "fill_in": lưu chuỗi nhập
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  // Modal báo cáo (màn hình quiz)
  const [showReportModal, setShowReportModal] = useState(false);
  // Mảng cặp { selectedQuestionIndex, feedback }
  // Mặc định có 1 cặp
  const [reportItems, setReportItems] = useState([
    { selectedQuestionIndex: 0, feedback: "" }
  ]);

  // Modal báo cáo (màn hình kết quả)
  const [showResultReportModal, setShowResultReportModal] = useState(false);
  const [selectedQuestionIndexForReport, setSelectedQuestionIndexForReport] = useState(0);
  const [resultFeedbacks, setResultFeedbacks] = useState([""]);

  const MaxQuestions = 3;

  // Fetch dữ liệu
  useEffect(() => {
    let filePath = "";
    if (Number(categoryId) !== 1) {
      if (Number(categoryId) === 2) {
        filePath = `/data/quiz/dong-tu.json`;
      } else if (Number(categoryId) === 3) {
        filePath = `/data/quiz/tinh-tu.json`;
      } else if (Number(categoryId) === 4) {
        filePath = `/data/quiz/kanji.json`;
      }
    } else {
      filePath = `/data/quiz/question-${courseId}-${lessonId}.json`;
    }

    fetch(filePath)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Không thể tải file ${filePath}`);
        }
        return res.json();
      })
      .then((data) => {
        const shuffledQuestions = shuffleArray(data);
        const limitedQuestions = shuffledQuestions.slice(0, MaxQuestions);
        limitedQuestions.forEach((q) => {
          if (q.type === "choice" && q.answers) {
            q.answers = shuffleArray(q.answers);
          }
        });
        setQuestions(limitedQuestions);

        const initialAnswers = limitedQuestions.map((q) =>
          q.type === "choice" ? null : q.type === "fill_in" ? "" : null
        );
        setUserAnswers(initialAnswers);
      })
      .catch((err) => console.error("Lỗi fetch dữ liệu:", err));
  }, [courseId, lessonId, categoryId]);

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentQuestionIndex] || {};

  // Xử lý chọn đáp án (multiple choice)
  const handleChoiceChange = (index) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQuestionIndex] = index;
    setUserAnswers(updatedAnswers);
  };

  // Xử lý nhập (fill_in)
  const handleFillInChange = (value) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQuestionIndex] = value;
    setUserAnswers(updatedAnswers);
  };

  // Next hoặc Xem kết quả
  const handleNextQuestion = () => {
    let answerGiven = false;
    if (currentQuestion.type === "choice") {
      answerGiven = userAnswers[currentQuestionIndex] !== null;
    } else if (currentQuestion.type === "fill_in") {
      answerGiven = userAnswers[currentQuestionIndex].trim() !== "";
    }
    if (!answerGiven) return;

    if (currentQuestionIndex === totalQuestions - 1) {
      // Tính điểm
      let computedScore = 0;
      questions.forEach((q, i) => {
        if (q.type === "choice") {
          const chosenIndex = userAnswers[i];
          if (
            chosenIndex !== null &&
            q.answers &&
            q.answers[chosenIndex] &&
            q.answers[chosenIndex].is_correct
          ) {
            computedScore++;
          }
        } else if (q.type === "fill_in") {
          const typedAnswer = userAnswers[i];
          const correctAnswers = (q.correct_answer || "")
            .split("/")
            .map((ans) => ans.trim().toLowerCase());
          if (correctAnswers.includes(typedAnswer.trim().toLowerCase())) {
            computedScore++;
          }
        }
      });
      setScore(computedScore);
      setShowResult(true);
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleBackQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuestionIndex(0);
    const resetAnswers = questions.map((q) =>
      q.type === "choice" ? null : q.type === "fill_in" ? "" : null
    );
    setUserAnswers(resetAnswers);
    setScore(0);
    setShowResult(false);
  };

  const handleChooseAnotherLesson = () => {
    navigate(`/courses/${courseId}/1/lessons`);
  };

  // *** Modal báo cáo (quiz screen) ***
  const handleReport = () => {
    setShowReportModal(true);
  };

  // Thêm 1 cặp Question + Feedback
  const addReportItem = () => {
    setReportItems([...reportItems, { selectedQuestionIndex: 0, feedback: "" }]);
  };

  // Xóa 1 cặp Question + Feedback
  // Luôn giữ lại ít nhất 1 item
  const removeReportItem = (index) => {
    if (reportItems.length === 1) {
      // Nếu chỉ có 1 item => không xóa hẳn, có thể reset
      const reset = [...reportItems];
      reset[0] = { selectedQuestionIndex: 0, feedback: "" };
      setReportItems(reset);
      return;
    }
    const newItems = [...reportItems];
    newItems.splice(index, 1);
    setReportItems(newItems);
  };

  // Cập nhật 1 item
  const handleReportItemChange = (index, field, value) => {
    const updated = [...reportItems];
    updated[index][field] = value;
    setReportItems(updated);
  };

  // Gửi báo cáo (quiz screen)
  const handleSubmitReport = () => {
    // Gom tất cả feedback
    const mergedFeedback = reportItems
      .map((item) => {
        const qIndex = item.selectedQuestionIndex;
        const questionText = questions[qIndex]?.question_text || "";
        const fb = item.feedback.trim();
        if (!fb) return null;
        return `Câu ${qIndex + 1}: ${questionText}\nNội dung: ${fb}`;
      })
      .filter(Boolean)
      .join("\n\n");

    if (!mergedFeedback) {
      alert("Vui lòng nhập ít nhất một feedback.");
      return;
    }

    const now = new Date();
    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const yyyy = now.getFullYear();
    const hh = String(now.getHours()).padStart(2, "0");
    const mn = String(now.getMinutes()).padStart(2, "0");
    const filename = `${yyyy}${mm}${dd}-${hh}${mn}-${courseId}-${lessonId}-${categoryId}.txt`;

    const payload = {
      filename,
      content: mergedFeedback,
      question_title: "Nhiều câu"
    };

    fetch("http://localhost:3001/api/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then((res) => {
        if (!res.ok) {
          alert("Báo cáo thất bại. Vui lòng thử lại sau.");
        } else {
          alert("Báo cáo đã được gửi thành công.");
          setShowReportModal(false);
          // Reset form
          setReportItems([{ selectedQuestionIndex: 0, feedback: "" }]);
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Có lỗi xảy ra khi gửi báo cáo.");
      });
  };

  // *** Modal báo cáo (result screen) ***
  const handleResultReportSubmit = () => {
    const allFeedback = resultFeedbacks
      .filter((fb) => fb.trim() !== "")
      .join("\n");
    if (!allFeedback) return;

    const selectedQuestion = questions[selectedQuestionIndexForReport];
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const yyyy = now.getFullYear();
    const hh = String(now.getHours()).padStart(2, "0");
    const mn = String(now.getMinutes()).padStart(2, "0");
    const filename = `${yyyy}${mm}${dd}-${hh}${mn}-${courseId}-${lessonId}-${categoryId}.txt`;

    const payload = {
      filename,
      content: allFeedback,
      question_title: selectedQuestion ? selectedQuestion.question_text : ""
    };

    fetch("http://localhost:3001/api/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then((res) => {
        if (!res.ok) {
          alert("Báo cáo thất bại. Vui lòng thử lại sau.");
        } else {
          alert("Báo cáo đã được gửi thành công.");
          setShowResultReportModal(false);
          setResultFeedbacks([""]);
          setSelectedQuestionIndexForReport(0);
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Có lỗi xảy ra khi gửi báo cáo.");
      });
  };

  const addResultFeedback = () => {
    setResultFeedbacks([...resultFeedbacks, ""]);
  };

  const handleResultFeedbackChange = (index, value) => {
    const updated = [...resultFeedbacks];
    updated[index] = value;
    setResultFeedbacks(updated);
  };

  // Danh sách câu trả lời sai
  const incorrectQuestions = questions
    .map((q, i) => {
      if (q.type === "choice") {
        const chosenIndex = userAnswers[i];
        if (
          chosenIndex === null ||
          (q.answers &&
            q.answers[chosenIndex] &&
            q.answers[chosenIndex].is_correct)
        ) {
          return null;
        }
        return {
          type: q.type,
          questionIndex: i + 1,
          question: q.question_text,
          selected: q.answers ? q.answers[chosenIndex].answer_text : "",
          correct: q.answers
            ? q.answers.find((ans) => ans.is_correct)?.answer_text || "Không rõ"
            : "Không rõ"
        };
      } else if (q.type === "fill_in") {
        const typedAnswer = userAnswers[i];
        const correctAnswers = (q.correct_answer || "")
          .split("/")
          .map((ans) => ans.trim().toLowerCase());
        if (correctAnswers.includes(typedAnswer.trim().toLowerCase())) {
          return null;
        }
        return {
          type: q.type,
          questionIndex: i + 1,
          question: q.question_text,
          selected: typedAnswer,
          correct: q.correct_answer
        };
      }
      return null;
    })
    .filter((item) => item !== null);

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

            <div className="text-center mt-3">
              <Button variant="warning" onClick={() => setShowResultReportModal(true)}>
                Báo cáo lỗi kết quả <FaFlag style={{ marginLeft: "5px" }} />
              </Button>
            </div>

            <Modal
              show={showResultReportModal}
              onHide={() => setShowResultReportModal(false)}
            >
              <Modal.Header closeButton>
                <Modal.Title>Báo cáo lỗi kết quả</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group controlId="formCourseId">
                    <Form.Label>Course</Form.Label>
                    <Form.Control
                      type="text"
                      value={
                        Number(courseId) === 1
                          ? "N5"
                          : Number(courseId) === 2
                            ? "N4"
                            : Number(courseId) === 3
                              ? "N3"
                              : ""
                      }
                      disabled
                    />
                  </Form.Group>
                  <Form.Group controlId="formCategoryId" className="mt-2">
                    <Form.Label>Category</Form.Label>
                    <Form.Control
                      type="text"
                      value={
                        Number(categoryId) === 2
                          ? "động từ"
                          : Number(categoryId) === 1
                            ? "Theo bài"
                            : Number(categoryId) === 3
                              ? "tính từ"
                              : Number(categoryId) === 4
                                ? "kanji"
                                : ""
                      }
                      disabled
                    />
                  </Form.Group>
                  <Form.Group controlId="formLessonId" className="mt-2">
                    <Form.Label>Bài số</Form.Label>
                    <Form.Control type="text" value={lessonId} disabled />
                  </Form.Group>
                  <Form.Group controlId="formQuestion" className="mt-2">
                    <Form.Label>Question</Form.Label>
                    <Form.Control
                      as="select"
                      value={selectedQuestionIndexForReport}
                      onChange={(e) =>
                        setSelectedQuestionIndexForReport(Number(e.target.value))
                      }
                    >
                      {questions.map((q, index) => (
                        <option key={index} value={index}>
                          {`Câu ${index + 1}: ${q.question_text.slice(0, 50)}...`}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="formFeedback" className="mt-2">
                    <Form.Label>Feedback</Form.Label>
                    {resultFeedbacks.map((feedback, index) => (
                      <div key={index} className="d-flex align-items-center mb-2">
                        <Form.Control
                          as="textarea"
                          rows={2}
                          placeholder="Nhập nội dung báo cáo lỗi..."
                          value={feedback}
                          onChange={(e) => handleResultFeedbackChange(index, e.target.value)}
                        />
                        {index === resultFeedbacks.length - 1 && (
                          <FaPlus
                            style={{
                              cursor: "pointer",
                              marginLeft: "5px",
                              fontSize: "1.2rem"
                            }}
                            title="Thêm feedback"
                            onClick={addResultFeedback}
                          />
                        )}
                      </div>
                    ))}
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => setShowResultReportModal(false)}
                >
                  Hủy
                </Button>
                <Button variant="primary" onClick={handleResultReportSubmit}>
                  Gửi báo cáo
                </Button>
              </Modal.Footer>
            </Modal>

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
                          {item.type === "choice"
                            ? "Đáp án bạn chọn:"
                            : "Đáp án bạn nhập:"}
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
              <button className="btn btn-info" onClick={handleChooseAnotherLesson}>
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

                <div className="quiz-card shadow p-4" style={{ position: "relative" }}>
                  {/* Icon báo cáo ở quiz screen */}
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
                    dangerouslySetInnerHTML={{
                      __html: currentQuestion.question_text
                    }}
                  />

                  {currentQuestion.type === "choice" &&
                    currentQuestion.answers &&
                    currentQuestion.answers.map((ans, idx) => (
                      <div className="form-check mb-2" key={ans.id}>
                        <input
                          type="radio"
                          className="form-check-input"
                          id={`answer-${ans.id}`}
                          name={`question-${currentQuestion.id}`}
                          checked={userAnswers[currentQuestionIndex] === idx}
                          onChange={() => handleChoiceChange(idx)}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`answer-${ans.id}`}
                        >
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
                        value={userAnswers[currentQuestionIndex]}
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
                      disabled={
                        (currentQuestion.type === "choice" &&
                          userAnswers[currentQuestionIndex] === null) ||
                        (currentQuestion.type === "fill_in" &&
                          userAnswers[currentQuestionIndex].trim() === "")
                      }
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

        {/* Modal báo cáo (quiz screen) */}
        <Modal show={showReportModal} onHide={() => setShowReportModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Báo cáo lỗi câu hỏi</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formCourseId">
                <Form.Label>Course</Form.Label>
                <Form.Control
                  type="text"
                  value={
                    Number(courseId) === 1
                      ? "N5"
                      : Number(courseId) === 2
                        ? "N4"
                        : Number(courseId) === 3
                          ? "N3"
                          : ""
                  }
                  disabled
                />
              </Form.Group>
              <Form.Group controlId="formCategoryId" className="mt-2">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type="text"
                  value={
                    Number(categoryId) === 2
                      ? "động từ"
                      : Number(categoryId) === 1
                        ? "Theo bài"
                        : Number(categoryId) === 3
                          ? "tính từ"
                          : Number(categoryId) === 4
                            ? "kanji"
                            : ""
                  }
                  disabled
                />
              </Form.Group>
              <Form.Group controlId="formLessonId" className="mt-2">
                <Form.Label>Bài số</Form.Label>
                <Form.Control type="text" value={lessonId} disabled />
              </Form.Group>

              {/* Lặp qua reportItems => hiển thị cặp Question + Feedback */}
              {reportItems.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    border: "1px dashed #ccc",
                    padding: "10px",
                    marginTop: "10px"
                  }}
                >
                  <Form.Group controlId={`formQuestion-${idx}`} className="mt-2">
                    <Form.Label>Question</Form.Label>
                    <Form.Control
                      as="select"
                      value={item.selectedQuestionIndex}
                      onChange={(e) =>
                        handleReportItemChange(idx, "selectedQuestionIndex", Number(e.target.value))
                      }
                    >
                      {questions.map((q, i) => (
                        <option key={i} value={i}>
                          {`Câu ${i + 1}: ${q.question_text.slice(0, 50)}...`}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId={`formFeedback-${idx}`} className="mt-2">
                    <Form.Label>Feedback</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      placeholder="Nhập nội dung báo cáo lỗi..."
                      value={item.feedback}
                      onChange={(e) =>
                        handleReportItemChange(idx, "feedback", e.target.value)
                      }
                    />
                  </Form.Group>

                  {/* Thêm nút - nếu reportItems.length > 1 */}
                  {reportItems.length > 1 && (
                    <Button
                      variant="outline-danger"
                      className="mt-2"
                      onClick={() => removeReportItem(idx)}
                    >
                      <FaMinus style={{ marginRight: "5px" }} />
                      Xóa cặp này
                    </Button>
                  )}

                  {/* Nếu là item cuối cùng => nút + để thêm */}
                  {idx === reportItems.length - 1 && (
                    <div className="text-end mt-2">
                      <Button variant="outline-primary" onClick={addReportItem}>
                        <FaPlus style={{ marginRight: "5px" }} />
                        Thêm cặp Question + Feedback
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowReportModal(false)}>
              Hủy
            </Button>
            <Button variant="primary" onClick={handleSubmitReport}>
              Gửi báo cáo
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default QuizPage;
