import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "SDGs Dashboard Wates",
  description: "Smart Dashboard Pencapaian SDGs per Desa",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
        <Sidebar />
        <main className="ml-0 md:ml-[18rem] transition-all duration-300">
          <Navbar />
          <div className="p-4 md:p-6">{children}</div>
        </main>
      </body>
    </html>
  );
}

