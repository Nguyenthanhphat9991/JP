import React, { useEffect, useState } from "react";
import "./grammar.css";
import { useParams } from "react-router-dom";
import GrammarTypeSequentially from "./GrammarTypeSequentially";
import GrammarTypeTable from "./GrammarTypeTable";

const Grammars = () => {
    const [grammarList, setGrammarList] = useState([]);
    const { courseId, lessonId } = useParams();
    console.log('courseId', courseId);
    console.log('lessonId', lessonId);



    useEffect(() => {
        const fileName = `/data/grammars/bai${lessonId}-${courseId}.json`;

        fetch(`${fileName}`)
            .then((response) => response.json())
            .then((data) => setGrammarList(data))
            .catch((error) => console.error("Lỗi khi tải dữ liệu:", error));
    }, []);

    return (
        <div className="grammar-card">
            <h2 className="section-title">Ngữ pháp</h2>
            {grammarList.length > 0 ? (
                
                    grammarList.map((grammar, index) => (
                      <div key={index} className="mb-5">
                        {grammar.typeFormat === 2 ? (
                          <GrammarTypeTable grammar={grammar} index={index} />
                        ) : (
                          <GrammarTypeSequentially grammar={grammar} index={index} />
                        )}
                      </div>
                    ))
                  
            ) : (
                <p className="lead text-muted">Chưa có dữ liệu ngữ pháp.</p>
            )}
        </div>
    );
};

export default Grammars;
