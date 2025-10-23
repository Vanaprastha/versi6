"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AiOutlineDashboard } from "react-icons/ai";
import { BiScatterChart } from "react-icons/bi";
import { RiRobot2Line } from "react-icons/ri";
import { FiSettings } from "react-icons/fi";
import { BsInfoCircle } from "react-icons/bs";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Item = { href: string; label: string; icon?: React.ReactNode };

const items: Item[] = [
  { href: "/",           label: "Dashboard",         icon: <AiOutlineDashboard /> },
  { href: "/clustering", label: "Clustering Wilayah",icon: <BiScatterChart /> },
  { href: "/tanyasdg",   label: "TanyaSDGs",         icon: <RiRobot2Line /> },
  { href: "/pengaturan", label: "Pengaturan",        icon: <FiSettings /> },
  { href: "/tentang",    label: "Tentang",           icon: <BsInfoCircle /> },
];

const LS_KEY = "sidebar_collapsed_v1";

export default function DesktopSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState<boolean>(false);

  // Restore persisted state on mount (desktop only)
  useEffect(() => {
    // guard: only apply on md+ (no effect on mobile SSR mismatch)
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem(LS_KEY);
      if (saved !== null) setCollapsed(saved === "1");
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(LS_KEY, collapsed ? "1" : "0");
    }
  }, [collapsed]);

  const widthCls = collapsed ? "md:w-16" : "md:w-64";
  const labelCls = collapsed ? "md:opacity-0 md:pointer-events-none md:w-0" : "md:opacity-100";
  const gapCls = collapsed ? "md:gap-3" : "md:gap-3";

  return (
    <aside
      className={`hidden md:flex ${widthCls} shrink-0 glass-2 h-screen sticky top-0 rounded-2xl p-4 flex-col justify-between`}
    >
      {/* Top: Logo + Nav */}
      <div className="flex flex-col gap-6">
        {/* Logo / Title */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-white/10 flex items-center justify-center text-xl">🌱</div>
          <div className={`text-sm font-medium transition-all duration-200 ${labelCls} overflow-hidden`}>
            Smart Dashboard SDGs
          </div>
        </div>

        {/* Nav */}
        <nav>
          <ul className="flex flex-col gap-1">
            {items.map((it) => {
              const active = pathname === it.href;
              return (
                <li key={it.href}>
                  <Link
                    href={it.href as any}
                    title={it.label} className={`flex items-center ${gapCls} rounded-xl px-3 py-2 transition
                      ${active ? "bg-white/20" : "bg-white/10 hover:bg-white/20"}`}
                  >
                    <span className="text-lg opacity-80">{it.icon}</span>
                    <span className={`text-sm whitespace-nowrap transition-all duration-200 ${labelCls}`}>{it.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <p className={`text-[11px] text-neutral-400 transition-all duration-200 ${labelCls} overflow-hidden`}>
          © {new Date().getFullYear()} Kec. Wates
        </p>
      </div>

      {/* Toggle (desktop only) */}
      <button
        type="button"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        onClick={() => setCollapsed((v) => !v)}
        className="hidden md:flex absolute -right-3 top-16 h-8 w-8 rounded-full bg-white/80 text-neutral-800 shadow hover:bg-white transition items-center justify-center"
      >
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>
    </aside>
  );
}
