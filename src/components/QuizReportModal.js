// components/QuizReportModal.js
import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const QuizReportModal = ({
  show,
  onHide,
  courseId,
  lessonId,
  categoryId,
  currentQuestion,
  feedback,
  onFeedbackChange,
  onSubmitReport,
}) => {
  const getCourseName = (courseId) => {
    return Number(courseId) === 1 ? "N5" : Number(courseId) === 2 ? "N4" : Number(courseId) === 3 ? "N3" : "";
  };

  const getCategoryName = (categoryId) => {
    return Number(categoryId) === 2
      ? "động từ"
      : Number(categoryId) === 1
      ? "Theo bài"
      : Number(categoryId) === 3
      ? "tính từ"
      : Number(categoryId) === 4
      ? "kanji"
      : "";
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Báo cáo lỗi câu hỏi</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formCourseId">
            <Form.Label>Course</Form.Label>
            <Form.Control type="text" value={getCourseName(courseId)} disabled />
          </Form.Group>
          <Form.Group controlId="formCategoryId" className="mt-2">
            <Form.Label>Category</Form.Label>
            <Form.Control type="text" value={getCategoryName(categoryId)} disabled />
          </Form.Group>
          <Form.Group controlId="formLessonId" className="mt-2">
            <Form.Label>Bài số</Form.Label>
            <Form.Control type="text" value={lessonId} disabled />
          </Form.Group>
          <Form.Group controlId="formQuestion" className="mt-2">
            <Form.Label>Question</Form.Label>
            <Form.Control type="text" value={currentQuestion.question_text} disabled />
          </Form.Group>
          <Form.Group controlId="formFeedback" className="mt-2">
            <Form.Label>Feedback</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Nhập nội dung báo cáo lỗi..."
              value={feedback}
              onChange={(e) => onFeedbackChange(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Hủy
        </Button>
        <Button variant="primary" onClick={onSubmitReport}>
          Gửi báo cáo
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default QuizReportModal;
