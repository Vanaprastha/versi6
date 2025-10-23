"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Route } from "next";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import {
  AiOutlineDashboard,
} from "react-icons/ai";
import { BiScatterChart } from "react-icons/bi";
import { RiRobot2Line } from "react-icons/ri";
import { FiSettings } from "react-icons/fi";
import { BsInfoCircle } from "react-icons/bs";
import Image from "next/image";
import { Menu, X } from "lucide-react";

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

const LS_KEY = "sidebar_visible_v1";

export default function Sidebar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(LS_KEY);
      if (saved !== null) setVisible(saved === "1");
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(LS_KEY, visible ? "1" : "0");
    }
  }, [visible]);

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`glass-2 h-screen w-64 p-4 top-0 hidden md:flex flex-col rounded-2xl transition-all duration-300 ease-in-out z-40
          ${visible ? "sticky translate-x-0 opacity-100" : "absolute -translate-x-full opacity-0"}`}
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

      {/* Tombol hamburger di pojok kiri atas dalam konten utama */}
      <button
        onClick={() => setVisible(!visible)}
        className="hidden md:flex absolute top-5 left-5 z-50 h-10 w-10 items-center justify-center rounded-xl bg-white/80 text-neutral-800 shadow hover:bg-white transition"
        aria-label="Toggle Sidebar"
      >
        {visible ? <X size={22} /> : <Menu size={22} />}
      </button>
    </>
  );
}
