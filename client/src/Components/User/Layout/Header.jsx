// import React from "react";
// import { motion } from "framer-motion";

// export default function Header() {
//   return (
//     <header
//       role="banner"
//       className="w-full h-[100px] bg-white shadow-sm border-b border-gray-200 relative z-50 flex items-center"
//     >
//       {/* Container */}
//       <div className="max-w-[1598px] mx-auto w-full flex justify-between items-center  h-full">
        
//         {/* Left Side: Govt Logo + Name */}
//         <motion.div
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.5 }}
//           className="flex items-center gap-4 h-full"
//         >
//           <img
//             src="https://mtpl.work/dph/storage/homesettings/1754057142_odisha_logo.webp"
//             alt="Government of Odisha Logo"
//             className="h-full w-auto max-h-[80px] object-contain"
//             loading="lazy"
//           />
//           <div className="flex flex-col justify-center leading-tight">
//             <span className="text-lg lg:text-2xl font-extrabold text-gray-900">
//               Directorate of Public Health
//             </span>
//             <span className="text-sm lg:text-lg text-gray-700">
//               Bhubaneswar, Odisha
//             </span>
//           </div>
//         </motion.div>

//         {/* Right Side: Name + Logo + CM Image */}
//         <motion.div
//           initial={{ opacity: 0, x: 20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.5, delay: 0.1 }}
//           className="flex items-center gap-4 h-full"
//         >
//           <div className="flex flex-col justify-center text-right">
//             <span className="text-lg lg:text-2xl font-extrabold text-gray-900">
//               Shri Mohan Charan Majhi
//             </span>
//             <span className="text-sm lg:text-lg text-gray-700">
//               Hon'ble Chief Minister
//             </span>
//           </div>
//           <img
//             src="https://mtpl.work/dph/storage/homesettings/1752215187_cm_logo.webp"
//             alt="Hon'ble Chief Minister"
//             className="h-full max-h-[90px] w-auto object-contain"
//             loading="lazy"
//           />
//         </motion.div>
//       </div>

//       {/* Accessibility: hidden skip link */}
//       {/* <a
//         href="#main-content"
//         className="sr-only focus:not-sr-only absolute top-2 left-2 bg-blue-600 text-white px-3 py-1 rounded-md shadow-md"
//       >
//         Skip to main content
//       </a> */}
//     </header>
//   );
// }


import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/user-home-settings`;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Header() {
  const [headerData, setHeaderData] = useState({
    organizationName: "",
    personName: "",
    personDesignation: "",
    odishaLogoUrl: "",
    cmPhotoUrl: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHeaderData = async () => {
      try {
        const response = await axios.get(API_URL);
        const settings = response.data;
        
        setHeaderData({
          organizationName: settings.organizationName || "Directorate of Public Health",
          personName: settings.personName || "Shri Mohan Charan Majhi",
          personDesignation: settings.personDesignation || "Hon'ble Chief Minister",
          odishaLogoUrl: settings.odishaLogoUrl || "",
          cmPhotoUrl: settings.cmPhotoUrl || ""
        });
      } catch (error) {
        console.error("Error fetching header data:", error);
        setError("Failed to load header data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchHeaderData();
  }, []);

  if (isLoading) {
    return (
      <header
        role="banner"
        className="w-full h-[100px] bg-white shadow-sm border-b border-gray-200 relative z-50 flex items-center"
      >
        <div className="max-w-[1598px] mx-auto w-full flex justify-between items-center h-full px-4">
          {/* Left Side Skeleton */}
          <div className="flex items-center gap-4 h-full">
            <div className="h-16 w-16 bg-gray-200 animate-pulse rounded"></div>
            <div className="flex flex-col justify-center gap-2">
              <div className="h-6 w-48 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
          
          {/* Right Side Skeleton */}
          <div className="flex items-center gap-4 h-full">
            <div className="flex flex-col justify-center gap-2 text-right">
              <div className="h-6 w-48 bg-gray-200 animate-pulse rounded ml-auto"></div>
              <div className="h-4 w-32 bg-gray-200 animate-pulse rounded ml-auto"></div>
            </div>
            <div className="h-16 w-16 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
      </header>
    );
  }

  if (error) {
    return (
      <header
        role="banner"
        className="w-full h-[100px] bg-white shadow-sm border-b border-gray-200 relative z-50 flex items-center"
      >
        <div className="max-w-[1598px] mx-auto w-full text-center text-red-500">
          Error: {error}
        </div>
      </header>
    );
  }

  return (
    <header
      role="banner"
      className="w-full h-[100px] bg-white shadow-sm border-b border-gray-200 relative z-50 flex items-center"
    >
      {/* Container */}
      <div className="max-w-[1598px] mx-auto w-full flex justify-between items-center h-full px-4">
        
        {/* Left Side: Govt Logo + Name */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 h-full"
        >
          {headerData.odishaLogoUrl && (
            <img
              src={headerData.odishaLogoUrl}
              alt="Government of Odisha Logo"
              className="h-full w-auto max-h-[80px] object-contain"
              loading="lazy"
            />
          )}
          <div className="flex flex-col justify-center leading-tight">
            <span className="text-lg lg:text-2xl font-extrabold text-gray-900">
              {headerData.organizationName}
            </span>
            <span className="text-sm lg:text-lg text-gray-700">
              Bhubaneswar, Odisha
            </span>
          </div>
        </motion.div>

        {/* Right Side: Name + Logo + CM Image */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-4 h-full"
        >
          <div className="flex flex-col justify-center text-right">
            <span className="text-lg lg:text-2xl font-extrabold text-gray-900">
              {headerData.personName}
            </span>
            <span className="text-sm lg:text-lg text-gray-700">
              {headerData.personDesignation}
            </span>
          </div>
          {headerData.cmPhotoUrl && (
            <img
              src={headerData.cmPhotoUrl}
              alt="Hon'ble Chief Minister"
              className="h-full max-h-[90px] w-auto object-contain"
              loading="lazy"
            />
          )}
        </motion.div>
      </div>
    </header>
  );
}