// // src/Components/Common/Navbar.jsx
// import React, { useState } from "react";
// import { Home as HomeIcon } from "lucide-react";
// import { IoAddOutline } from "react-icons/io5";
// import { NavLink } from "react-router-dom";

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [activeDropdown, setActiveDropdown] = useState(null);

//   const navItems = [
//     { name: "", path: "/", icon: <HomeIcon className="w-5 h-5" /> },
//     {
//       name: "About Us",
//       submenu: [
//         { name: "Organogram", path: "/about/organogram" },
//         { name: "Who is Who", path: "/about/who-is-who" },
//       ],
//     },
//     {
//       name: "Act & Rules",
//       submenu: [
//         { name: "Act & Rules", path: "/act-rules" },
//         { name: "Programs", path: "/programs" },
//         { name: "Forms", path: "/forms" },
//         { name: "Schemes", path: "/schemes" },
//       ],
//     },
//     { name: "Citizen Corner", path: "/citizen-corner" },
   
//     { name: "RTI", path: "/rti" },
//     { name: "Health Institutions", path: "/health-institutions" },
//     {
//       name: "Gallery",
//       submenu: [
//         { name: "Photo Gallery", path: "/gallery/photos" },
//         { name: "Video Gallery", path: "/gallery/videos" },
//       ],
//     },
//     { name: "Contact Us", path: "/contact" },
//   ];

//   const activeClasses = "text-yellow-300";
//   const inactiveClasses = "text-gray-100 hover:text-white";
//   const dropdownBg = "bg-gradient-to-r from-[rgb(250,250,255)] via-[rgb(245,245,255)] to-[rgb(230,230,250)]";
//   const hoverBg = "hover:bg-gradient-to-r hover:from-[rgb(78,81,229)] hover:via-[rgb(140,140,240)] hover:to-[rgb(251,207,125,0.98)] hover:text-white";

//   const handleDropdownEnter = (itemName) => {
//     setActiveDropdown(itemName);
//   };

//   const handleDropdownLeave = () => {
//     setActiveDropdown(null);
//   };

//   return (
//     <header>
//       <nav className="bg-gradient-to-r from-[rgb(78,81,229)] via-[rgb(140,140,240)] to-[rgb(251,207,125,0.98)] text-white shadow-md">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-center items-center py-3 relative">
            
//             {/* Desktop Navigation */}
//             <ul className="hidden md:flex space-x-10">
//               {navItems.map((item) => (
//                 <li
//                   key={item.name}
//                   className="relative group"
//                   onMouseEnter={() => handleDropdownEnter(item.name)}
//                   onMouseLeave={handleDropdownLeave}
//                 >
//                   {!item.submenu ? (
//                     <NavLink
//                       to={item.path}
//                       className={({ isActive }) =>
//                         `flex items-center gap-2 text-base font-medium transition-colors duration-200 relative group outline-none ${
//                           isActive ? activeClasses : inactiveClasses
//                         }`
//                       }
//                     >
//                       {item.icon}
//                       {item.name}
//                       <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
//                     </NavLink>
//                   ) : (
//                     <>
//                       <button
//                         className={`flex items-center gap-2 text-base font-medium transition-colors duration-200 relative group outline-none ${inactiveClasses}`}
//                       >
//                         {item.icon}
//                         {item.name}
//                         <IoAddOutline className="w-3 h-3" />
//                         <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
//                       </button>

//                       {/* Dropdown - Fixed positioning and gap issue */}
//                       {activeDropdown === item.name && (
//                         <ul className={`absolute left-0 top-full py-2 w-56 rounded shadow-lg overflow-hidden z-50 ${dropdownBg}`}>
//                           {item.submenu.map((sub) => (
//                             <li key={sub.name}>
//                               <NavLink
//                                 to={sub.path}
//                                 className={({ isActive }) =>
//                                   `block px-4 py-3 text-sm font-medium transition-all duration-300 ${
//                                     isActive ? "bg-indigo-500 text-white" : `text-gray-700 ${hoverBg}`
//                                   }`
//                                 }
//                               >
//                                 {sub.name}
//                               </NavLink>
//                             </li>
//                           ))}
//                         </ul>
//                       )}
//                     </>
//                   )}
//                 </li>
//               ))}
//             </ul>

//             {/* Mobile Menu Button */}
//             <button
//               onClick={() => setIsOpen(!isOpen)}
//               className="md:hidden absolute right-4 text-white text-2xl outline-none"
//               aria-expanded={isOpen}
//               aria-label="Toggle menu"
//             >
//               {isOpen ? "✕" : "☰"}
//             </button>
//           </div>

//           {/* Mobile Menu */}
//           {isOpen && (
//             <ul className="md:hidden flex flex-col items-center space-y-2 pb-4">
//               {navItems.map((item) => (
//                 <li key={item.name} className="w-full text-center">
//                   {item.submenu ? (
//                     <details className="w-full">
//                       <summary className="flex items-center justify-center gap-2 cursor-pointer text-lg font-medium text-gray-100 hover:text-white outline-none">
//                         {item.icon}
//                         {item.name}
//                         <IoAddOutline className="w-4 h-4" />
//                       </summary>
//                       <ul className="mt-2 space-y-1">
//                         {item.submenu.map((sub) => (
//                           <li key={sub.name}>
//                             <NavLink
//                               to={sub.path}
//                               className={({ isActive }) =>
//                                 `block px-4 py-2 text-sm rounded-md transition-all duration-300 ${
//                                   isActive ? "bg-indigo-500 text-white" : `text-gray-100 ${hoverBg}`
//                                 }`
//                               }
//                             >
//                               {sub.name}
//                             </NavLink>
//                           </li>
//                         ))}
//                       </ul>
//                     </details>
//                   ) : (
//                     <NavLink
//                       to={item.path}
//                       className={({ isActive }) =>
//                         `block py-2 text-lg font-medium transition-colors duration-200 ${
//                           isActive ? activeClasses : inactiveClasses
//                         }`
//                       }
//                     >
//                       {item.icon}
//                       {item.name}
//                     </NavLink>
//                   )}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       </nav>
//     </header>
//   );
// };

// export default Navbar;




import React, { useState } from 'react';
import { navItems } from './nav-config';

const MenuItem = ({ item, level = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Determine the correct key for children based on the level
  const childrenKey = level === 0 ? 'submenu' : 'subsubmenu';
  const children = item[childrenKey];
  const hasChildren = children && children.length > 0;

  const handleMouseEnter = () => setIsOpen(true);
  const handleMouseLeave = () => setIsOpen(false);

  const isTopLevel = level === 0;
  const submenuPosition = isTopLevel ? 'left-0 top-full' : 'left-full -top-1';

  return (
    <li
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {hasChildren ? (
        <button
          className={`w-full flex items-center justify-between text-left transition-colors duration-200 ${
            isTopLevel
              ? 'px-4 py-3 text-sm font-medium text-gray-700 hover:text-blue-600'
              : 'px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
          }`}
        >
          <span>{item.label}</span>
          <svg
            className={`w-2.5 h-2.5 ms-2 shrink-0 ${isTopLevel ? '' : '-rotate-90'}`}
            aria-hidden="true"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
          </svg>
        </button>
      ) : (
        <a
          href={item.href}
          aria-current={item.isCurrent ? 'page' : undefined}
          className={`block whitespace-nowrap transition-colors duration-200 ${
            isTopLevel
              ? `px-4 py-3 text-sm font-medium ${item.isCurrent ? 'text-blue-600' : 'text-gray-700'} hover:text-blue-600`
              : 'px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
          }`}
        >
          {item.label}
        </a>
      )}

      {hasChildren && (
        <div
          className={`absolute ${submenuPosition} z-20 ${isOpen ? 'block' : 'hidden'} bg-white shadow-lg rounded-md border border-gray-200`}
        >
          <ul className="py-1 w-44">
            {children.map((child, index) => (
              <MenuItem key={index} item={child} level={level + 1} />
            ))}
          </ul>
        </div>
      )}
    </li>
  );
};

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex justify-center">
          <ul className="flex flex-row">
            {navItems.menu.map((item, index) => (
              <MenuItem key={index} item={item} />
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;