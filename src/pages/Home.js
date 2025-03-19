import { useEffect , React}   from "react";
import { Link, useLocation } from "react-router-dom";
import banner from "../assets/images/banner.jpg";
import course_n3 from "../assets/images/course_n3.jpg";
import course_n4 from "../assets/images/course_n4.jpg";
import course_n5 from "../assets/images/course_n5.jpg";

const Home = () => {

  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return (
    <div className="container my-5">
      <section className="text-center mb-4">
        <img src={banner} alt="Banner" className="img-fluid rounded-4 shadow-sm" />
      </section>
      <section className="text-center">
        <h2 className="text-secondary fw-bold">Đơn Vị JPG</h2>
        <p className="lead text-muted">
        Mỗi bước tiến của học viên đều có dấu ấn nhiệt huyết của SenSei, tạo nên một hành trình học tập đầy ý nghĩa.
        </p>
        <button className="btn btn-primary rounded-pill px-4 py-2 shadow-sm transition">
          Tìm hiểu ngay
        </button>
      </section>
      <section id="danh-sach-khoa-hoc" className="mt-5">
        <h3 className="text-center text-secondary fw-bold">Danh sách khóa học</h3>
        <div className="row mt-3">
          {[
            { img: course_n5, level: "N5", desc: "Học tiếng Nhật từ cơ bản.", link: "/courses/N5" },
            { img: course_n4, level: "N4", desc: "Nâng cao trình độ giao tiếp.", link: "/courses/N4" },
            { img: course_n3, level: "N3", desc: "Thành thạo kỹ năng đọc hiểu.", link: "/courses/N3" },
          ].map((course, index) => (
            <div className="col-md-4" key={index}>
              <div className="card shadow-sm rounded-4 border-0 transition">
                <img src={course.img} className="card-img-top rounded-top-4" alt={`Khóa học ${course.level}`} />
                <div className="card-body">
                  <h5 className="card-title fw-bold">Khóa học {course.level}</h5>
                  <p className="card-text">{course.desc}</p>
                  <Link to={course.link} className="btn btn-outline-primary rounded-pill transition">Tham gia</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;