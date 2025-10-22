import {
  HeartPulse,
  Users,
  Droplets,
  Leaf,
  Factory,
  Building2,
  Handshake,
  Globe,
  Trees,
  GraduationCap,
  BriefcaseBusiness,
  Shield,
  Sparkles,
  Recycle,
  Sun,
  Waves,
} from "lucide-react";

type Props = {
  goalNo: number;
  title: string;
  successPercentage: number;
};

const SDG_COLORS: Record<number, string> = {
  1: "#E5243B", 2: "#DDA63A", 3: "#4C9F38", 4: "#C5192D", 5: "#FF3A21",
  6: "#26BDE2", 7: "#FCC30B", 8: "#A21942", 9: "#FD6925", 10: "#DD1367",
  11: "#FD9D24", 12: "#BF8B2E", 13: "#3F7E44", 14: "#0A97D9", 15: "#56C02B",
  16: "#00689D", 17: "#19486A",
};

const SDG_ICONS: Record<number, JSX.Element> = {
  1: <Users size={22} />,             // Tanpa Kemiskinan
  2: <HeartPulse size={22} />,        // Tanpa Kelaparan
  3: <Shield size={22} />,            // Kesehatan
  4: <GraduationCap size={22} />,     // Pendidikan
  5: <Users size={22} />,             // Gender
  6: <Droplets size={22} />,          // Air Bersih
  7: <Sun size={22} />,               // Energi Bersih
  8: <BriefcaseBusiness size={22} />, // Pekerjaan Layak
  9: <Factory size={22} />,           // Industri
  10: <Handshake size={22} />,        // Kesenjangan
  11: <Building2 size={22} />,        // Kota
  12: <Recycle size={22} />,          // Konsumsi
  13: <Leaf size={22} />,             // Iklim
  14: <Waves size={22} />,            // Lautan
  15: <Trees size={22} />,            // Daratan
  16: <Sparkles size={22} />,         // Institusi
  17: <Globe size={22} />,            // Kemitraan
};

export default function SDGCard({ goalNo, title, successPercentage }: Props) {
  const base = SDG_COLORS[goalNo] ?? "#10b981";
  const bg = `linear-gradient(135deg, ${base}15, ${base}35)`;
  const border = base + "55";
  const icon = SDG_ICONS[goalNo];

  return (
    <div
      className="relative p-4 rounded-2xl border backdrop-blur-xl shadow hover:shadow-lg cursor-pointer transition"
      style={{ background: bg, borderColor: border }}
    >
      {/* Icon di pojok kanan atas */}
      <div className="absolute top-3 right-3 text-white/90">
        {icon}
      </div>

      {/* Judul SDG */}
      <h3 className="font-semibold text-white drop-shadow-md mb-3 pr-10">
        SDG {goalNo}: {title}
      </h3>

      {/* Progress bar container */}
      <div className="mt-2 mb-1 w-full bg-white/20 h-2 rounded-full overflow-hidden">
        <div
          className="h-2 rounded-full transition-all duration-700 ease-in-out"
          style={{
            width: `${successPercentage}%`,
            backgroundColor: base,
          }}
        ></div>
      </div>

      {/* Persentase keberhasilan */}
      <p className="text-sm text-gray-100 mt-2 pr-10">
        Keberhasilan:{" "}
        <span className="font-semibold text-white">
          {successPercentage.toFixed(1)}%
        </span>
      </p>
    </div>
  );
}

