import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Tab, Tabs } from "react-bootstrap";
import VocabularyFlashcards from "../components/VocabularyFlashcards";
import './style.css';

const LessonContent = () => {
    const { courseId, lessonId } = useParams();
    const [activeTab, setActiveTab] = useState("vocabulary");

    return (
        <div className="container-fluid d-flex" style={{ minHeight: "100vh", backgroundColor: "#FDF6EC" }}>
            {/* Content Area */}
            <div className="flex-grow-1 p-4">
                {/* Breadcrumb */}
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb bg-transparent">
                        <li className="breadcrumb-item"><Link to="/courses">Khóa học</Link></li>
                        <li className="breadcrumb-item"><Link to={`/courses/${courseId}`}>Khóa học {courseId}</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">Bài {lessonId}</li>
                    </ol>
                </nav>

                {/* Tab Navigation */}
                <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4">
                    <Tab eventKey="vocabulary" title="Từ vựng">
                        <div className="d-flex justify-content-end mb-3">
                            <Link
                                to={`/courses/${courseId}/categories/1/lessons/${lessonId}/quiz`}
                                className="btn btn-success"
                            >
                                Ôn tập từ vựng
                            </Link>
                        </div>
                        <VocabularyFlashcards />
                    </Tab>
                    <Tab eventKey="kanji" title="Kanji">
                        <div className="content-card shadow rounded-4 p-4 bg-white text-center">
                            <h2 className="text-secondary fw-bold">Kanji</h2>
                            <p className="lead text-muted">Danh sách chữ Hán sẽ hiển thị tại đây.</p>
                        </div>
                    </Tab>
                    <Tab eventKey="grammar" title="Ngữ pháp">
                        <div className="content-card shadow rounded-4 p-4 bg-white text-center">
                            <h2 className="text-secondary fw-bold">Ngữ pháp</h2>
                            <p className="lead text-muted">Các cấu trúc ngữ pháp sẽ hiển thị tại đây.</p>
                        </div>
                    </Tab>
                    <Tab eventKey="listening" title="Nghe hiểu">
                        <div className="content-card shadow rounded-4 p-4 bg-white text-center">
                            <h2 className="text-secondary fw-bold">Nghe hiểu</h2>
                            <p className="lead text-muted">Bài luyện nghe sẽ hiển thị tại đây.</p>
                        </div>
                    </Tab>
                    <Tab eventKey="reading" title="Đọc hiểu">
                        <div className="content-card shadow rounded-4 p-4 bg-white text-center">
                            <h2 className="text-secondary fw-bold">Đọc hiểu</h2>
                            <p className="lead text-muted">Bài đọc hiểu sẽ hiển thị tại đây.</p>
                        </div>
                    </Tab>
                    <Tab eventKey="kaiwa" title="Kaiwa">
                        <div className="content-card shadow rounded-4 p-4 bg-white text-center">
                            <h2 className="text-secondary fw-bold">Kaiwa</h2>
                            <p className="lead text-muted">Bài hội thoại sẽ hiển thị tại đây.</p>
                        </div>
                    </Tab>
                    <Tab eventKey="Test" title="Test">
                        <div className="content-card shadow rounded-4 p-4 bg-white text-center">
                            <h2 className="text-secondary fw-bold">Test</h2>
                            <p className="lead text-muted">Test kiến thức tổng hợp bài {lessonId}.</p>
                        </div>
                    </Tab>
                </Tabs>
            </div>
        </div>
    );
};

export default LessonContent;
