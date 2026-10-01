import { findings, sar, totalSavings } from "@/lib/data";

// Sends a real Telegram message when TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID are set;
// otherwise reports a simulated send so the demo flow still completes.
export async function POST() {
  const top = [...findings].sort((a, b) => b.monthlySavings - a.monthlySavings).slice(0, 3);
  const text = [
    "CloudTrim | تنبيه توفير",
    `اكتشفنا فرص توفير بقيمة ${sar(totalSavings)} شهرياً:`,
    ...top.map((f) => `- ${f.title}: ${sar(f.monthlySavings)}`),
    "راجع ووافق من لوحة التحكم.",
  ].join("\n");

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return Response.json({ sent: false, simulated: true, text });

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
    return Response.json({ sent: res.ok, simulated: !res.ok, text });
  } catch {
    return Response.json({ sent: false, simulated: true, text });
  }
}
