import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

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

  // State lưu danh sách khóa học lấy từ JSON
  const [courses, setCourses] = useState([]);

  // Fetch dữ liệu từ /public/data/courses.json khi component mount
  useEffect(() => {
    const fileName = '/data/courses.json';
    console.log('fileName', fileName);

    fetch(`${fileName}`)
      .then((res) => {
        console.log('res', res);
        if (!res.ok) {
          throw new Error("Không thể tải dữ liệu từ /data/courses.json");
        }
        return res.json();
      })
      .then((data) => {
        console.log('data', data);
        // Giả sử file JSON có cấu trúc { "courses": [...] }
        setCourses(data.courses);
      })
      .catch((err) => console.error("Lỗi fetch:", err));
  }, []);

  console.log('courses', courses);

  const course = courses.find(course => course.title === id);
  
  return (
    <div className="container my-5">
      <h2 className="text-secondary fw-bold text-center">Khóa học {id}</h2>
      <div className="row justify-content-center">
        {course?.categorys.map((category, catIndex) => (
          <div key={catIndex} className="col-md-3 mb-4">
            <div 
              className="card text-center shadow-lg rounded-4 border-0 p-4 category-card cursor-pointer"
              onClick={() => navigate(`/courses/${id}/${category.id}/lessons`)}
            >
              <div className="card-body">
                <div className="mb-3">{icons[category.title] || <FaBookOpen size={30} className="text-secondary" />}</div>
                <h5 className="text-primary fw-bold">{category.title}</h5>
                <p dangerouslySetInnerHTML={{ __html: category.description }} className="text-muted"></p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    
  );
};

export default CourseDetail;