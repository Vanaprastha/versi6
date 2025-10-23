"use client";
export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
      <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
        Dashboard SDGs
      </h2>
      <div className="text-gray-500 dark:text-gray-300 text-sm">
        Versi 6 • Data Desa Wates
      </div>
    </header>
  );
}

