import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Flashcard from "./Flashcard"; // Nếu component Flashcard được tách riêng

const VocabularyFlashcards = () => {
  // Lấy params từ URL
  const { courseId, lessonId } = useParams();
  
  // Dùng các params này để fetch file JSON
  const [vocabularyData, setVocabularyData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;


  useEffect(() => {
    const fileName = `/data/vocabulary/bai${lessonId}-${courseId}.json`;
  console.log('fileName:', fileName);

    fetch(`${fileName}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Không thể tải file: ${fileName}`);
        }
        return response.json();
      })
      .then(data => {
        setVocabularyData(data);
        setCurrentPage(1);
      })
      .catch(error => {
        console.error("Lỗi fetch dữ liệu:", error);
      });
  }, [courseId, lessonId]);

  const totalPages = Math.ceil(vocabularyData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = vocabularyData.slice(startIndex, startIndex + itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <div className="container mt-4">
      <div className="flashcard-grid">
        {currentItems.map((item, index) => (
          <Flashcard key={index} {...item} />
        ))}
      </div>
      <div className="flashcard-nav">
        <button
          className="btn btn-primary mx-2"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span>
            {currentPage} / {totalPages}
        </span>
        <button
          className="btn btn-primary mx-2"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default VocabularyFlashcards;
