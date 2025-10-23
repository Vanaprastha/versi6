"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Route } from "next";
import type { ReactNode } from "react";

import { AiOutlineDashboard } from "react-icons/ai";
import { BiScatterChart } from "react-icons/bi";
import { RiRobot2Line } from "react-icons/ri";
import { FiSettings } from "react-icons/fi";
import { BsInfoCircle } from "react-icons/bs";
import Image from "next/image";

type NavItem = {
  href: Route;
  label: string;
  icon: ReactNode;
};

const items = [
  { href: "/" as Route,           label: "Dashboard",         icon: <AiOutlineDashboard /> },
  { href: "/clustering" as Route, label: "Clustering Wilayah",icon: <BiScatterChart /> },
  { href: "/tanyasdg" as Route,   label: "TanyaSDGs",      icon: <RiRobot2Line /> },
  { href: "/pengaturan" as Route, label: "Pengaturan",        icon: <FiSettings /> },
  { href: "/tentang" as Route,    label: "Tentang",           icon: <BsInfoCircle /> },
] as const satisfies readonly NavItem[];


export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="chip flex-col glass-2 glass-3 h-screen hidden md:flex p-4 rounded-2xl sticky text-[var(--text)] top-0 w-64">
      <div className="flex items-center gap-3 pb-4 border-b border-white/10">
        <Image src="/logo-pemda.png" alt="Logo Pemda" width={36} height={36} />
        <div className="text-sm">
          <p className="font-semibold">Dashboard SDGs</p>
          <p className="text-[var(--text)]">Pemerintah Daerah Kecamatan Wates</p>
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
              className={`flex items-center gap-3 px-3 py-2 rounded-xl  ${
                active ? "chip" : "hover:bg-white/5"
              }`}
            >
              <span className="text-lg opacity-80">{it.icon}</span>
              <span className="text-sm">{it.label}</span>
            </Link>
          );
        })}
      </nav>

      <p className="text-[11px] text-[var(--text-muted)]">
        © {new Date().getFullYear()} Pemerintah Daerah Kecamatan Wates
      </p>
    </aside>
  );
}

