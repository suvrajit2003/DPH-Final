
import React, { useEffect, useState } from "react";

const TableRow = ({
  item,
  columns,
  idx,
  pageContext,
  highlightMatch,
  searchTerm,
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), idx * 50); // stagger like before
    return () => clearTimeout(timer);
  }, [idx]);

  return (
    <tr
      className={`border-b border-gray-300 hover:bg-gray-50 transition-all duration-200 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
      }`}
    >
      {columns.map((column, colIndex) => (
        <td key={colIndex} className="p-2">
          {column.cell
            ? column.cell({
                row: { original: item },
                ...pageContext, // <-- still applied here
              })
            : highlightMatch(item[column.accessor], searchTerm)}
        </td>
      ))}
    </tr>
  );
};

export default TableRow;
