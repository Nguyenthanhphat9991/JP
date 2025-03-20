// Flashcard.js
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Flashcard.css";

const Flashcard = ({ word, kanji, meaning, image }) => {
  return (
    <div className="flashcard minimal">
      <div className="flashcard-inner">
        {/* Mặt trước */}
        <div className="flashcard-front">
          {/* Từ vựng */}
          <h2 className="flashcard-word">{word}</h2>

          {/* Kanji (nếu có) */}
          {kanji && <p className="flashcard-kanji">{kanji}</p>}

          {/* Nghĩa, nhưng KHÔNG có chữ “Ý nghĩa:” */}
          <p className="flashcard-meaning">{meaning}</p>
        </div>

        {/* Mặt sau (ảnh minh hoạ) */}
        <div className="flashcard-back">
          {/* Gọi ảnh từ thư mục /public/images/ */}
          <img src={`/images/${image}`} alt={word} />
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
