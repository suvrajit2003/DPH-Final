
import React from "react";

const SkeletonRow = ({ columns }) => {
  return (
    <tr className="animate-pulse border-b">
      {columns.map((_, index) => (
        <td key={index} className="p-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </td>
      ))}
    </tr>
  );
};

export default SkeletonRow;
