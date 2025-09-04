import React from "react";

const NoAccess = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center">
      <h1 className="text-3xl font-bold text-red-600 mb-4">🚫 No Access</h1>
      <p className="text-lg text-gray-700">
        You don’t have permission to view this page.
      </p>
    </div>
  );
};

export default NoAccess;
