import React from "react";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
              TG
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Temp-Gen
            </h1>
          </div>
        </div>
      </header>
      <main className="flex-grow">{children}</main>
      <footer className="border-t border-slate-800 py-8 bg-slate-900/80">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} Prantor Hawlader.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
