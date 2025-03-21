// hooks/useQuiz.js
import { useState, useEffect } from "react";
import { shuffleArray } from "../utils/shuffleArray";

const useQuiz = ({ courseId, lessonId, categoryId, maxQuestions = 3 }) => {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

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
        const shuffled = shuffleArray(data);
        const limited = shuffled.slice(0, maxQuestions);
        limited.forEach((q) => {
          if (q.type === "choice" && q.answers) {
            q.answers = shuffleArray(q.answers);
          }
        });
        setQuestions(limited);
        const initialAnswers = limited.map((q) =>
          q.type === "choice" ? null : q.type === "fill_in" ? "" : null
        );
        setUserAnswers(initialAnswers);
      })
      .catch((err) => console.error("Lỗi fetch dữ liệu:", err));
  }, [courseId, lessonId, categoryId, maxQuestions]);

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentQuestionIndex] || {};

  const handleChoiceChange = (index) => {
    const updated = [...userAnswers];
    updated[currentQuestionIndex] = index;
    setUserAnswers(updated);
  };

  const handleFillInChange = (value) => {
    const updated = [...userAnswers];
    updated[currentQuestionIndex] = value;
    setUserAnswers(updated);
  };

  const handleNextQuestion = () => {
    let answerGiven = false;
    if (currentQuestion.type === "choice") {
      answerGiven = userAnswers[currentQuestionIndex] !== null;
    } else if (currentQuestion.type === "fill_in") {
      answerGiven = userAnswers[currentQuestionIndex].trim() !== "";
    }
    if (!answerGiven) return;

    if (currentQuestionIndex === totalQuestions - 1) {
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
    const reset = questions.map((q) =>
      q.type === "choice" ? null : q.type === "fill_in" ? "" : null
    );
    setUserAnswers(reset);
    setScore(0);
    setShowResult(false);
  };

  // Tính toán danh sách câu trả lời sai
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

  return {
    questions,
    userAnswers,
    currentQuestionIndex,
    currentQuestion,
    totalQuestions,
    showResult,
    score,
    incorrectQuestions,
    handleChoiceChange,
    handleFillInChange,
    handleNextQuestion,
    handleBackQuestion,
    handleResetQuiz,
  };
};

export default useQuiz;
