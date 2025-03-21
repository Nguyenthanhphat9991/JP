import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaBookOpen, FaPenNib, FaLanguage, FaMapMarkedAlt } from "react-icons/fa";

const icons = {
  "Học Theo Bài": <FaBookOpen size={30} className="text-primary" />,
  "Học Động Từ": <FaPenNib size={30} className="text-success" />,
  "Học Tính Từ": <FaLanguage size={30} className="text-warning" />,
  "Học Vị Trí": <FaMapMarkedAlt size={30} className="text-danger" />
};

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fileName = '/data/courses.json';
    fetch(fileName)
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

  const course = courses.find(course => course.id === id);

  return (
    <div className="container my-5">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb bg-transparent px-0">
          <li className="breadcrumb-item">
            <Link to="/">Trang Chủ</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Khóa học {Number(id) === 1 ? 'N5' : Number(id) === 2 ? 'N4' : Number(id) === 3 ? 'N3' : id}
          </li>
        </ol>
      </nav>

      <h2 className="text-secondary fw-bold text-center">
        Khóa học {Number(id) === 1 ? 'N5' : Number(id) === 2 ? 'N4' : Number(id) === 3 ? 'N3' : ''}
      </h2>

      <div className="row justify-content-center">
        {course?.categorys.map((category, catIndex) => (
          <div key={catIndex} className="col-md-3 mb-4">
            <div
              className="card text-center shadow-lg rounded-4 border-0 p-4 category-card cursor-pointer"
              onClick={() => {
                if (category.id !== 1) {
                  navigate(`/courses/${id}/categories/${category.id}/quiz`);
                } else {
                  navigate(`/courses/${id}/${category.id}/lessons`);
                }
              }}
            >
              <div className="card-body">
                <div className="mb-3">
                  {icons[category.title] || <FaBookOpen size={30} className="text-secondary" />}
                </div>
                <h5 className="text-primary fw-bold">{category.title}</h5>
                <p
                  dangerouslySetInnerHTML={{ __html: category.description }}
                  className="text-muted"
                ></p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseDetail;
