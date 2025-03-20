import React, { useEffect, useState } from "react";

const Grammars = () => {
    const [grammarList, setGrammarList] = useState([]);

    useEffect(() => {
        fetch("/data/grammars.json")
            .then((response) => response.json())
            .then((data) => setGrammarList(data))
            .catch((error) => console.error("Lỗi khi tải dữ liệu:", error));
    }, []);

    return (
        <div className="content-card shadow rounded-4 p-4 bg-white">
            <h2 className="text-secondary fw-bold">Ngữ pháp</h2>
            {grammarList.length > 0 ? (
                grammarList.map((grammar, index) => (
                    <div key={index} className="grammar-section p-3 mb-4 border rounded">
                        <h4 className="text-primary">{index + 1}. {grammar.title}</h4>
                        <div className="formula bg-light p-3 rounded">
                            <h5>📌 Công thức</h5>
                            <p className="fw-bold">{grammar.formula}</p>
                        </div>
                        <div className="usage bg-light p-3 mt-3 rounded">
                            <h5>📖 Cách dùng</h5>
                            <ul>
                                {grammar.usage.map((point, i) => <li key={i}>{point}</li>)}
                            </ul>
                        </div>
                        <div className="example bg-light p-3 mt-3 rounded">
                            <h5>📝 Ví dụ</h5>
                            {grammar.examples.map((example, i) => (
                                <div key={i}>
                                    {example.question && <p><strong>Q: </strong>{example.question}</p>}
                                    {example.answer && <p><strong>A: </strong>{example.answer}</p>}
                                    {example.translation && <p className="text-muted"><i>{example.translation}</i></p>}
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <p className="lead text-muted">Chưa có dữ liệu ngữ pháp.</p>
            )}
        </div>
    );
};

export default Grammars;
