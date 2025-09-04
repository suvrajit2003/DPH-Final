import React from "react";

const PageNotFound = () => {
  return (
    <div className="flex justify-center items-center min-h-screen"  >
<div className="text-center"  >
        <h1>404 Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <a href="/" className="bg-blue-400 px-4 py-2 text-white rounded" >Return home</a>
</div>
    </div>
  );
};

export default PageNotFound;