// Flashcard.js
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Flashcard.css";

const Flashcard = ({ word, kanji, meaning }) => {
  return (
    <div className="flashcard no-flip">
      <div className="flashcard-inner">
        <div className="flashcard-front">
          <h2 className="flashcard-word">{word}</h2>
          {kanji && <p className="flashcard-kanji">{kanji}</p>}
          <p className="flashcard-meaning">{meaning}</p>
        </div>

        {/* Tạm thời ẩn mặt sau */}
        {/* <div className="flashcard-back">
          <img src={`/images/${image}`} alt={word} />
        </div> */}
      </div>
    </div>
  );
};

export default Flashcard;
