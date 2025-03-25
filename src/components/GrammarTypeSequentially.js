import React from "react";

const GrammarTypeSequentially = ({ grammar, index }) => (
  <div className="grammar-box">
    <h3 className="grammar-title">{index + 1}. {grammar.title}</h3>

    <div className="formula">
      <h5 className="mb-2">📌 Công thức</h5>
      {grammar.structure?.map((line, idx) => (
        <div key={idx} dangerouslySetInnerHTML={{ __html: line }} />
      ))}
    </div>

    <div className="usage">
      <h5 className="mb-2">📖 Cách dùng</h5>
      <ul className="mb-0">
        {grammar.usage?.map((point, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: point }}></li>
        ))}
      </ul>
    </div>

    {/* 📌 Giao diện Ghi chú nếu có */}
    {Array.isArray(grammar.notes) && grammar.notes.length > 0 && (
      <div className="notes mt-4 p-3 border-l-4 border-yellow-400 bg-yellow-50 rounded">
        <h5 className="mb-2">📝 Ghi chú</h5>
        <ul className="mb-0">
          {grammar.notes.map((note, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: note }}></li>
          ))}
        </ul>
      </div>
    )}

    <div className="example">
      <h5 className="mb-2">📘 Ví dụ</h5>
      {grammar.examples.map((example, i) => (
        <div key={i} className="mb-3">
          {example.jp && <div className="japanese-text" dangerouslySetInnerHTML={{ __html: `<span class="circle-number">${i + 1}</span> ${example.jp}` }} />}
          {example.vn && <div className="translation">{example.vn}</div>}
        </div>
      ))}
    </div>
  </div>
);

export default GrammarTypeSequentially;
