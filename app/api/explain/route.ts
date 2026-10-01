import Anthropic from "@anthropic-ai/sdk";
import { findings } from "@/lib/data";

// Returns an Arabic explanation for one finding. Uses Claude when ANTHROPIC_API_KEY is set,
// otherwise (or on any error) the cached explanation, so the demo never breaks.
export async function POST(req: Request) {
  const { id } = (await req.json()) as { id: string };
  const finding = findings.find((f) => f.id === id);
  if (!finding) return Response.json({ error: "not found" }, { status: 404 });

  const cached = { text: finding.explanation, source: "cached" as const };
  if (!process.env.ANTHROPIC_API_KEY) return Response.json(cached);

  try {
    const client = new Anthropic();
    const response = await client.messages.create(
      {
        model: "claude-opus-5-5",
        max_tokens: 1024,
        output_config: { effort: "low" },
        system:
          "أنت مستشار FinOps لدى منصة CloudTrim. اشرح التوصية لمدير تقني في شركة سعودية متوسطة، بالعربية الفصحى المبسطة، في 2-3 جمل: لماذا هذا المورد هدر، وكم يوفر، وما أثر التنفيذ وكيف نحمي الخدمة. بلا عناوين ولا نقاط.",
        messages: [
          {
            role: "user",
            content: JSON.stringify({
              title: finding.title,
              resource: finding.resource,
              evidence: finding.detail,
              proposedAction: finding.action,
              safeguards: finding.safeguards,
              monthlySavingsSAR: finding.monthlySavings,
            }),
          },
        ],
      },
      { timeout: 15_000 },
    );
    if (response.stop_reason === "refusal") return Response.json(cached);
    const text = response.content
      .flatMap((b) => (b.type === "text" ? [b.text] : []))
      .join("")
      .trim();
    return Response.json(text ? { text, source: "live" } : cached);
  } catch {
    return Response.json(cached);
  }
}
