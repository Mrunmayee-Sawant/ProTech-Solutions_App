import React, { useEffect } from "react";

export default function App() {
  useEffect(() => {
    // In React SPA preview mode, immediately navigate to the Login page
    // conforming strictly to Registration -> Login -> Dashboard authentication flow
    if (window.location.pathname === "/" || window.location.pathname === "/index.html") {
      window.location.replace("/Login.html");
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F6] p-6 text-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 max-w-md w-full">
        <img
          src="images/protech-logo.svg"
          alt="ProTech Solutions"
          className="h-16 mx-auto mb-4 object-contain"
        />
        <h1 className="text-2xl font-extrabold text-[#2D5A5C] tracking-tight">
          ProTech Solutions
        </h1>
        <p className="text-sm font-semibold uppercase tracking-wider text-slate-500 mt-1">
          CCTV Products &amp; Services
        </p>
        <p className="text-sm text-slate-600 mt-4 leading-relaxed">
          Redirecting to Customer Authentication Portal...
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <a
            href="Login.html"
            className="w-full py-3 px-4 bg-[#5F9EA0] hover:bg-[#497F81] text-white font-bold rounded-lg transition-colors inline-block"
          >
            Customer Login
          </a>
          <a
            href="S_Login.html"
            className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors inline-block"
          >
            Staff &amp; Admin Login
          </a>
        </div>
      </div>
    </div>
  );
}
