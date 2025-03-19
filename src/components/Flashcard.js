// Flashcard.jsx (hoặc đặt chung trong file)
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Flashcard.css";

const Flashcard = ({ word, kanji, meaning, example, image }) => {

    return (
        <div className="flashcard">
            <div className="flashcard-inner">
                {/* Mặt trước */}
                <div className="flashcard-front">
                    <h3>
                        {word} {kanji && `(${kanji})`}
                    </h3>
                    <p>
                        <strong>Ý nghĩa:</strong> <i>{meaning}</i>
                    </p>
                    <p className="example">
                        <strong>Ví dụ:</strong> <i dangerouslySetInnerHTML={{ __html: example }}></i>
                    </p>
                </div>
                {/* Mặt sau */}
                <div className="flashcard-back">
                    {/* Gọi ảnh từ /images/ + image */}
                    <img src={`/images/${image}`} alt={word} />
                </div>
            </div>
        </div>
    );
};

export default Flashcard;
