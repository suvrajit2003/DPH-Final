
// import React from "react";
// import SkeletonRow from "./SkeletonRow";
// import TableRow from "./TableRow";

// const MenuTableBody = ({
//   loading,
//   columns,
//   data,
//   entriesPerPage,
//   currentPage,
//   highlightMatch,
//   searchTerm,
// }) => {
//   return (
//     <table className="min-w-full border text-sm">
//       <thead>
//         <tr className="bg-gray-100 text-left">
//           {columns.map((column, index) => (
//             <th key={index} className="p-2">
//               {column.header}
//             </th>
//           ))}
//         </tr>
//       </thead>
//       <tbody>
//         {loading
//           ? Array.from({ length: entriesPerPage }).map((_, idx) => (
//               <SkeletonRow key={idx} columns={columns} />
//             ))
//           : data.map((item, idx) => (
//               <TableRow
//                 key={item.id}
//                 item={item}
//                 columns={columns}
//                 idx={idx}
//                 currentPage={currentPage}
//                 entriesPerPage={entriesPerPage}
//                 highlightMatch={highlightMatch}
//                 searchTerm={searchTerm}
//                  pageContext={{
//                     currentPage,
//                     entriesPerPage,
//                     index: idx,
//                 }}
//               />
//             ))}
//       </tbody>
//     </table>
//   );
// };

// export default MenuTableBody;


// Required version of MenuTableBody.js
import React from "react";
import SkeletonRow from "./SkeletonRow";
import TableRow from "./TableRow";

const MenuTableBody = ({
  loading,
  columns,
  data,
  entriesPerPage,
  currentPage,
  highlightMatch,
  searchTerm,
}) => {
  if (loading) {
    return (
      <tbody>
        {Array.from({ length: entriesPerPage }).map((_, idx) => (
          <SkeletonRow key={idx} columns={columns} />
        ))}
      </tbody>
    );
  }

  if (!data || data.length === 0) {
    return (
      <tbody>
        <tr>
          <td colSpan={columns.length} className="text-center p-4">
            No data available.
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody>
      {data.map((item, idx) => (
        <TableRow
          key={item.id || idx}
          item={item}
          columns={columns}
          idx={idx} // For framer-motion delay
          highlightMatch={highlightMatch}
          searchTerm={searchTerm}
          pageContext={{
              currentPage,
              entriesPerPage,
              index: idx,
          }}
        />
      ))}
    </tbody>
  );
};

export default MenuTableBody;