import React from "react";

const GrammarTypeTable = ({ grammar, index }) => {
    if (!Array.isArray(grammar.structures)) {
        return <p className="text-danger">⚠️ Dữ liệu không hợp lệ: thiếu structure</p>;
    }

    return (
        <div className="grammar-box">
            <h3 className="grammar-title">{index + 1}. {grammar.title}</h3>

            {grammar.structure !== null && (
                <div className="formula">
                    <h5 className="mb-2">📌 Công thức</h5>
                    {grammar.structure?.map((line, idx) => (
                        <div key={idx} dangerouslySetInnerHTML={{ __html: line }} />
                    ))}
                </div>
            )}
            {Array.isArray(grammar.usage) && grammar.usage.length > 0 && (
                <div className="usage">
                    <h5 className="mb-2">📖 Cách dùng</h5>
                    <ul className="mb-0">
                        {grammar.usage.map((point, i) => (
                            <li key={i}>{point}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="example">
                <h5 className="mb-2">Cách Chia</h5>
                <table className="w-full table-fixed border-collapse">
                    <thead>
                        <tr className="bg-cyan-100 text-gray-800">
                            <th className="table-header">Nhóm</th>
                            <th className="table-header">Cách chia</th>
                            <th className="table-header">Ví dụ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {grammar.structures.map((group, groupIdx) => {
                            // Tính tổng số dòng trong nhóm để tính rowspan
                            const totalRowSpan = group.rules.reduce((sum, rule) => {
                                if (rule.ruleType === 1 || !Array.isArray(rule.examples)) return sum + 1;
                                return sum + rule.examples.length;
                            }, 0);

                            return group.rules.map((rule, ruleIdx) => {
                                const isFirstRule = ruleIdx === 0;

                                // Nếu ruleType = 1 → chỉ render 1 dòng với colspan
                                if (rule.ruleType === 1) {
                                    return (
                                        <tr key={`${groupIdx}-${ruleIdx}`} className="border-t border-cyan-300 align-top">
                                            {isFirstRule && (
                                                <td rowSpan={totalRowSpan} className="table-cell font-medium bg-cyan-50">
                                                    {group.group}
                                                </td>
                                            )}
                                            <td colSpan={2} className="table-cell" dangerouslySetInnerHTML={{ __html: rule.rule }}></td>
                                        </tr>
                                    );
                                }

                                // Nếu có examples → render từng dòng
                                return rule.examples.map((ex, exIdx) => (
                                    <tr key={`${groupIdx}-${ruleIdx}-${exIdx}`} className="border-t border-cyan-300 align-top">
                                        {isFirstRule && exIdx === 0 && (
                                            <td rowSpan={totalRowSpan} className="table-cell font-medium bg-cyan-50">
                                                {group.group}
                                            </td>
                                        )}
                                        {exIdx === 0 && (

                                            <td rowSpan={rule.examples.length} className="table-cell" dangerouslySetInnerHTML={{ __html: rule.rule }}></td>
                                        )}
                                        <td className="table-cell">
                                            <div className="flex gap-2">
                                                <span dangerouslySetInnerHTML={{ __html: ex.from }}></span>
                                                <span className="text-red-500 font-bold text-xl">→</span>
                                                <span dangerouslySetInnerHTML={{ __html: ex.to }}></span>
                                            </div>
                                        </td>
                                    </tr>
                                ));
                            });
                        })}
                    </tbody>

                </table>
            </div>

            {Array.isArray(grammar.examples) && grammar.examples.length > 0 && (
                <div className="example">
                    <h5 className="mb-2">📘 Ví dụ</h5>
                    {grammar.examples.map((example, i) => (
                        <div key={i} className="mb-3">
                            {example.jp && (
                                <div
                                    className="japanese-text"
                                    dangerouslySetInnerHTML={{
                                        __html: `<span class="circle-number">${i + 1}</span> ${example.jp}`,
                                    }}
                                />
                            )}
                            {example.vn && <div className="translation">{example.vn}</div>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default GrammarTypeTable;
