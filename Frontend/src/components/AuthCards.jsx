import React from "react";

const AuthCard = ({ title, children, gradientFrom, gradientTo, linkText, linkHref }) => {
  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-r ${gradientFrom} ${gradientTo} p-4`}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-10 relative overflow-hidden animate-fadeIn">
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-opacity-30 rounded-full mix-blend-multiply filter blur-xl animate-pulse" />

        <h1 className="text-4xl font-extrabold text-gray-800 mb-10 text-center">{title}</h1>

        {children}

        {linkText && linkHref && (
          <p className="text-center text-gray-500 mt-6">
            <a href={linkHref} className={`font-bold hover:underline ${gradientTo.split(' ')[1]}`}>
              {linkText}
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthCard;
