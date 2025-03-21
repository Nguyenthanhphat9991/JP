import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import LessonStatus from "./LessonStatus";

const users = [
    {
        "user_id": 1,
        "course_id": "N5",
        "lesson_id": 1,
        "is_completed": true,
        "score": 80,
        "completed_at": "2023-10-27 10:00:00"
    },
    {
        "user_id": 1,
        "course_id": "N5",
        "lesson_id": 2,
        "is_completed": true,
        "score": 80,
        "completed_at": "2023-10-27 10:00:00"
    }
];

const LessonDetail = () => {
    const { courseId, categoryId } = useParams();
    const [lessonStatus, setLessonStatus] = useState({});
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        fetch("/data/courses.json")
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Không thể tải dữ liệu từ /data/courses.json");
                }
                return res.json();
            })
            .then((data) => {
                setCourses(data.courses);
            })
            .catch((err) => console.error("Lỗi fetch:", err));
    }, []);

    const course = courses.find(course => course.id === courseId);
    const category = course?.categorys.find(cat => cat.id === Number(categoryId));

    useEffect(() => {
        const fetchLessonStatus = async () => {
            try {
                const data = users;
                const statusMap = {};
                data.forEach(item => {
                    statusMap[item.lesson_id] = item.is_completed ? 'finish' : 'open';
                });
                setLessonStatus(statusMap);
            } catch (error) {
                console.error("Error fetching lesson status:", error);
            }
        };

        fetchLessonStatus();
    }, [courseId]);

    return (
        <div className="container my-5">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb bg-transparent px-0">
                    <li className="breadcrumb-item">
                        <Link to="/">Trang Chủ</Link>
                    </li>
                    <li className="breadcrumb-item">
                        <Link to={`/courses/${courseId}`}>Khóa học {Number(courseId) === 1 ? "N5" : Number(courseId) === 2 ? "N4" : Number(courseId) === 3 ? "N3" : courseId}</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                        Danh sách bài học
                    </li>
                </ol>
            </nav>

            <h2 className="text-secondary fw-bold text-center">
                Danh Sách Bài Học: {Number(courseId) === 1 ? "N5" : Number(courseId) === 2 ? "N4" : Number(courseId) === 3 ? "N3" : courseId}
            </h2>

            <div className="row justify-content-center">
                {category?.lessons.map((lesson) => (
                    <div key={lesson.id} className="col-md-2 mb-4">
                        <div className="card text-center shadow-sm border-0 rounded-3 p-3">
                            <div className="card-body">
                                <LessonStatus status={lessonStatus[lesson.id] || 'open'} />
                                <h6 className="fw-bold text-secondary mt-2">{lesson.title}</h6>
                                <Link
                                    to={`/courses/${courseId}/categories/${categoryId}/lessons/${lesson.id}/lesson-content`}
                                    className="btn btn-primary rounded-pill px-4 py-2 shadow-sm transition"
                                >
                                    Xem Bài
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LessonDetail;
