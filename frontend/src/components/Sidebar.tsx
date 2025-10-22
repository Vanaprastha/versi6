"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Route } from "next";
import type { ReactNode } from "react";
import { useState } from "react";

import { AiOutlineDashboard } from "react-icons/ai";
import { BiScatterChart } from "react-icons/bi";
import { RiRobot2Line } from "react-icons/ri";
import { FiSettings, FiMenu, FiX } from "react-icons/fi";
import { BsInfoCircle } from "react-icons/bs";
import Image from "next/image";

type NavItem = {
  href: Route;
  label: string;
  icon: ReactNode;
};

const items = [
  { href: "/" as Route, label: "Dashboard", icon: <AiOutlineDashboard /> },
  { href: "/clustering" as Route, label: "Clustering Wilayah", icon: <BiScatterChart /> },
  { href: "/tanyasdg" as Route, label: "TanyaSDGs", icon: <RiRobot2Line /> },
  { href: "/pengaturan" as Route, label: "Pengaturan", icon: <FiSettings /> },
  { href: "/tentang" as Route, label: "Tentang", icon: <BsInfoCircle /> },
] as const satisfies readonly NavItem[];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      {/* Tombol Toggle Sidebar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/10 text-white"
      >
        {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`glass-2 h-screen w-64 p-4 fixed md:sticky top-0 z-40 flex flex-col rounded-2xl transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:flex`}
      >
        <div className="flex items-center gap-3 pb-4 border-b border-white/10">
          <Image src="/logo-pemda.png" alt="Logo Pemda" width={36} height={36} />
          <div className="text-sm">
            <p className="font-semibold">Dashboard SDGs</p>
            <p className="text-neutral-300">Pemerintah Daerah Kecamatan Wates</p>
          </div>
        </div>

        <nav className="mt-4 flex-1 space-y-1">
          {items.map((it) => {
            const active = pathname === it.href;
            return (
              <Link
                key={it.href}
                href={it.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl transition ${
                  active ? "bg-white/10" : "hover:bg-white/5"
                }`}
                onClick={() => setIsOpen(false)} // auto-close di mobile
              >
                <span className="text-lg opacity-80">{it.icon}</span>
                <span className="text-sm">{it.label}</span>
              </Link>
            );
          })}
        </nav>

        <p className="text-[11px] text-neutral-400">
          © {new Date().getFullYear()} Pemerintah Daerah Kecamatan Wates
        </p>
      </aside>
    </>
  );
}

