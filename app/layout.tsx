import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";

const arabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic",
});

export const metadata: Metadata = {
  title: "CloudTrim | إدارة تكاليف السحابة بذكاء",
  description:
    "منصة FinOps محلية للشركات السعودية والخليجية: وكيل ذكاء اصطناعي يكتشف الهدر في فاتورة السحابة، وأنت توافق قبل أي تنفيذ.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={arabic.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
