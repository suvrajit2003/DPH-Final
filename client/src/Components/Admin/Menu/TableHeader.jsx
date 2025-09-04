// // components/MenuTable/TableHeader.jsx
// import React from "react";
// import { FaSort, FaPlus } from "react-icons/fa";

// const TableHeader = ({ Ltext, Rtext, onAdd, onOpenSort }) => (
//   <div className="flex items-center justify-between mb-4">
//     <h2 className="text-xl font-semibold">{Ltext}</h2>
//     <div className="flex space-x-2">
//       {Ltext === "Menu List" && (
//         <button
//           onClick={onOpenSort}
//           className="bg-gray-700 text-white px-3 py-2 rounded flex items-center gap-2 hover:bg-gray-800 transition"
//         >
//           <FaSort />
//           Sort Menu
//         </button>
//       )}
//       <button
//         onClick={onAdd}
//         className="bg-yellow-400 px-3 py-2 rounded flex items-center gap-2 hover:bg-yellow-500 transition"
//       >
//         <FaPlus />
//         {Rtext}
//       </button>
//     </div>
//   </div>
// );

// export default TableHeader;


import { FaSort, FaPlus } from "react-icons/fa";

const TableHeader = ({ Ltext, Rtext, onAdd, onOpenSort }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-xl font-semibold">{Ltext}</h2>
    <div className="flex space-x-2">
      {onOpenSort && (
        <button
          onClick={onOpenSort}
          className="bg-gray-700 text-white px-3 py-2 rounded flex items-center gap-2 hover:bg-gray-800 transition"
        >
          <FaSort />
          Sort order
        </button>
      )}
      {onAdd && Rtext && (
        <button
          onClick={onAdd}
          className="bg-yellow-400 px-3 py-2 rounded flex items-center gap-2 hover:bg-yellow-500 transition"
        >
          <FaPlus />
          {Rtext}
        </button>
      )}
    </div>
  </div>
);

export default TableHeader;