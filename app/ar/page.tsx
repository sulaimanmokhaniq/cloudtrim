import type { Metadata } from "next";
import { Landing } from "@/components/Landing";
import { ar } from "@/lib/landing-copy";

export const metadata: Metadata = {
  title: "CloudTrim | إدارة تكاليف السحابة للشركات في السعودية والخليج",
  description: "يكتشف CloudTrim الهدر في فاتورة السحابة بصلاحية قراءة فقط، ويشرح كل توفير بلغة واضحة، ولا ينفذ شيئًا بدون موافقتك.",
};

export default function HomeAr() {
  return <Landing t={ar} />;
}
