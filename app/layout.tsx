import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { MovingBackground } from "@/components/MovingBackground";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const display = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["500", "600", "700", "800"], variable: "--font-jakarta" });

export const metadata: Metadata = {
  title: "CloudTrim | AI FinOps for Saudi & GCC businesses",
  description:
    "CloudTrim finds waste in your cloud bill with read-only access, explains every saving in plain language, and never acts without your approval.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" className={`${inter.variable} ${display.variable}`} suppressHydrationWarning>
      <head>
        {/* Apply the saved theme before paint so the page never flashes the wrong mode */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("ct-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <MovingBackground />
        {children}
      </body>
    </html>
  );
}
