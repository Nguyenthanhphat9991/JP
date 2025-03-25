// components/ResultReportModal.js
import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FaPlus, FaMinus } from 'react-icons/fa';

const ResultReportModal = ({
  show,
  onHide,
  courseId,
  lessonId,
  categoryId,
  incorrectQuestions,
  reportItems,
  handleReportItemChange,
  addReportItem,
  removeReportItem,
  handleResultReportSubmit
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
        <Modal.Title>Báo cáo lỗi kết quả</Modal.Title>
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
          {reportItems.map((item, idx) => (
            <div key={idx} style={{ border: "1px dashed #ccc", padding: "10px", marginTop: "10px" }}>
              <Form.Group controlId={`formQuestion-${idx}`}>
                <Form.Label>Question</Form.Label>
                <Form.Control
                  as="select"
                  value={item.selectedQuestionIndex}
                  onChange={(e) =>
                    handleReportItemChange(idx, "selectedQuestionIndex", Number(e.target.value))
                  }
                >
                  {(incorrectQuestions || []).map((q, i) => (
                    <option key={i} value={i}>
                      {`Câu ${q.questionIndex}: ${q.question?.slice(0, 50)}...`}
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
              {reportItems.length > 1 && (
                <Button variant="outline-danger" className="mt-2" onClick={() => removeReportItem(idx)}>
                  <FaMinus style={{ marginRight: "5px" }} />
                  Xóa cặp này
                </Button>
              )}
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
        <Button variant="secondary" onClick={onHide}>
          Hủy
        </Button>
        <Button variant="primary" onClick={handleResultReportSubmit}>
          Gửi báo cáo
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ResultReportModal;
