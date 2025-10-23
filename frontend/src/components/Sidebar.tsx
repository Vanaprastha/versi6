"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { AiOutlineDashboard } from "react-icons/ai";
import { BiScatterChart } from "react-icons/bi";
import { RiRobot2Line } from "react-icons/ri";
import { FiSettings } from "react-icons/fi";
import { BsInfoCircle } from "react-icons/bs";
import { motion } from "framer-motion";

const items = [
  { href: "/", label: "Dashboard", icon: <AiOutlineDashboard /> },
  { href: "/clustering", label: "Clustering Wilayah", icon: <BiScatterChart /> },
  { href: "/tanyasdg", label: "Tanya SDGs", icon: <RiRobot2Line /> },
  { href: "/pengaturan", label: "Pengaturan", icon: <FiSettings /> },
  { href: "/tentang", label: "Tentang", icon: <BsInfoCircle /> },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Deteksi ukuran layar
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Tombol toggle di mobile */}
      {isMobile && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-4 left-4 z-50 bg-white/80 dark:bg-gray-800 shadow-md rounded-full p-2 backdrop-blur-md"
        >
          ☰
        </button>
      )}

      {/* Sidebar */}
      <motion.aside
        animate={{ width: isOpen ? (isMobile ? "16rem" : "18rem") : "4rem" }}
        transition={{ duration: 0.3 }}
        className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-sm z-40 flex flex-col`}
      >
        <div className="flex items-center justify-between p-4">
          {isOpen && <h1 className="font-semibold text-lg">🌍 SDGs Wates</h1>}
          {!isMobile && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 dark:text-gray-300 hover:text-blue-500"
            >
              {isOpen ? "⟨" : "⟩"}
            </button>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto">
          {items.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-gray-700 transition ${
                !isOpen && "justify-center"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {isOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 text-xs text-center text-gray-400">
          {isOpen && "© 2025 SDGs Dashboard"}
        </div>
      </motion.aside>

      {/* Overlay untuk mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}

