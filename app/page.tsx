import Link from "next/link";
import { TEAM_NAME, company, findings, sar, totalSavings } from "@/lib/data";

const problems = [
  {
    title: "فواتير سحابية تكبر كل شهر",
    body: "سيرفرات خاملة وأقراص يتيمة ونسخ قديمة تُدفع قيمتها كل شهر دون أن يلاحظها أحد.",
  },
  {
    title: "الأدوات العالمية لا ترى المزودين المحليين",
    body: "لا توجد أداة FinOps تجمع STC Cloud وSCCC وCNTXT مع AWS وAzure وGCP في لوحة واحدة.",
  },
  {
    title: "الخوف من الأتمتة",
    body: "الفرق التقنية تتجنب أدوات الإيقاف التلقائي خوفاً من تعطيل خدمة حيوية بالخطأ.",
  },
  {
    title: "اشتراكات لا تناسب الشركات المتوسطة",
    body: "الأدوات العالمية مصممة للشركات الكبرى باشتراكات ثابتة مرتفعة.",
  },
];

const steps = [
  { n: "1", title: "سجّل مجاناً", body: "حساب في دقيقة، بدون بطاقة ائتمان." },
  { n: "2", title: "اربط سحابتك بصلاحية قراءة فقط", body: "دور IAM يقرأ التكاليف والموارد، ولا يستطيع تغيير أي شيء." },
  { n: "3", title: "الوكيل الذكي يفحص ويحلل", body: "يكتشف الهدر ويتوقع فاتورة الشهر القادم ويرتب الفرص حسب التوفير والخطورة." },
  { n: "4", title: "أنت تقرر", body: "تنبيه على WhatsApp أو Telegram، ثم توافق بنقرة أو تطلب مهندس FinOps." },
];

const safety = [
  { title: "قراءة فقط افتراضياً", body: "الربط الأساسي لا يملك أي صلاحية تنفيذ. لا يمكن للمنصة إيقاف أو حذف شيء." },
  { title: "صلاحية تنفيذ منفصلة باختيارك", body: "عند الموافقة تُمنح صلاحية مؤقتة محدودة بالإجراء نفسه فقط، وتنتهي تلقائياً." },
  { title: "شبكة أمان قبل كل إجراء", body: "Snapshot قبل أي حذف، إيقاف بدلاً من الحذف كلما أمكن، وتراجع بنقرة." },
  { title: "سجل تدقيق كامل", body: "كل توصية وموافقة وتنفيذ مسجل بالوقت واسم المسؤول، جاهز للمراجعة." },
];

const compliance = ["NCA ECC", "PDPL", "ISO 27001", "ISO 27017"];

export default function Home() {
  return (
    <main>
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-navy/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Logo />
          <nav className="hidden gap-6 text-sm text-white/75 md:flex">
            <a href="#problem" className="hover:text-white">المشكلة</a>
            <a href="#how" className="hover:text-white">كيف يعمل</a>
            <a href="#safety" className="hover:text-white">الأمان</a>
            <a href="#pricing" className="hover:text-white">التسعير</a>
          </nav>
          <Link href="/demo" className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-2">
            جرّب العرض الحي
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-navy text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <p className="mb-4 inline-block rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">
              FinOps محلي للشركات السعودية والخليجية
            </p>
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">
              اكتشف الهدر في فاتورة السحابة.
              <br />
              <span className="text-[#5fd3b0]">وأنت من يقرر.</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-8 text-white/75">
              وكيل ذكاء اصطناعي يفحص سحابتك بصلاحية قراءة فقط، ويرسل لك التوصيات على WhatsApp،
              ولا يُنفّذ أي إجراء إلا بموافقتك.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/demo" className="rounded-lg bg-brand px-6 py-3 font-semibold hover:bg-brand-2">
                شاهد العرض الحي
              </Link>
              <a href="#how" className="rounded-lg border border-white/25 px-6 py-3 font-semibold hover:bg-white/10">
                كيف يعمل؟
              </a>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 text-ink shadow-2xl">
            <div className="flex items-center justify-between text-sm text-muted">
              <span>{company.name}</span>
              <span className="rounded-full bg-brand-soft px-2 py-0.5 text-xs text-brand-2">قراءة فقط</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Stat label="الفاتورة الشهرية" value={sar(company.monthlySpend)} />
              <Stat label="توفير ممكن شهرياً" value={sar(totalSavings)} accent />
            </div>
            <ul className="mt-4 divide-y divide-line text-sm">
              {findings.slice(0, 3).map((f) => (
                <li key={f.id} className="flex items-center justify-between py-2.5">
                  <span>{f.title}</span>
                  <span className="num font-semibold text-good">{sar(f.monthlySavings)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section id="problem" className="mx-auto max-w-6xl px-4 py-20">
        <SectionTitle kicker="المشكلة" title="لماذا تدفع الشركات أكثر مما تحتاج؟" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {problems.map((p) => (
            <div key={p.title} className="rounded-xl border border-line bg-card p-5">
              <h3 className="font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm leading-7 text-ink-2">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How */}
      <section id="how" className="border-y border-line bg-card">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <SectionTitle kicker="الحل" title="أربع خطوات من الربط إلى التوفير" />
          <ol className="mt-10 grid gap-6 md:grid-cols-4">
            {steps.map((s) => (
              <li key={s.n}>
                <span className="num flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white font-bold">
                  {s.n}
                </span>
                <h3 className="mt-4 font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-7 text-ink-2">{s.body}</p>
              </li>
            ))}
          </ol>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-surface p-6">
              <h3 className="font-semibold">وكيل ذكاء اصطناعي للعمل اليومي</h3>
              <p className="mt-2 text-sm leading-7 text-ink-2">
                يفحص الموارد باستمرار، ويشرح كل توصية بلغة واضحة: لماذا هي هدر، وكم توفر، وما أثرها.
              </p>
            </div>
            <div className="rounded-xl bg-surface p-6">
              <h3 className="font-semibold">مهندس FinOps عند الحاجة</h3>
              <p className="mt-2 text-sm leading-7 text-ink-2">
                للقرارات المعقدة مثل خطط الالتزام وإعادة هيكلة البنية، يتولى مستشار بشري المهمة.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Safety */}
      <section id="safety" className="mx-auto max-w-6xl px-4 py-20">
        <SectionTitle kicker="الأمان أولاً" title="الذكاء الاصطناعي يوصي، والإنسان يقرر" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {safety.map((s) => (
            <div key={s.title} className="flex gap-4 rounded-xl border border-line bg-card p-5">
              <Check />
              <div>
                <h3 className="font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm leading-7 text-ink-2">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Local */}
      <section className="bg-navy text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-[#5fd3b0]">مصمم للسوق المحلي</p>
            <h2 className="mt-2 text-3xl font-bold">كل مزوديك في لوحة واحدة</h2>
            <p className="mt-4 leading-8 text-white/75">
              المزودون المحليون والعالميون معاً، مع بيانات تبقى داخل المملكة وتصميم يتوافق مع متطلبات
              الهيئة الوطنية للأمن السيبراني ونظام حماية البيانات الشخصية.
            </p>
          </div>
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              {["STC Cloud", "SCCC (Alibaba)", "CNTXT", "AWS", "Azure", "Google Cloud"].map((p) => (
                <span key={p} className="rounded-lg border border-white/20 px-3 py-2 text-sm">{p}</span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {compliance.map((c) => (
                <span key={c} className="rounded-lg bg-white/10 px-3 py-2 text-sm text-white/85">{c}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-6xl px-4 py-20">
        <SectionTitle kicker="التسعير" title="ادفع حسب ما تستخدم، بلا اشتراك ثابت" />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <PriceCard title="الفحص الأول" price="مجاناً" items={["ربط حساب سحابي واحد", "تقرير هدر كامل PDF", "أهم التوصيات بالتوفير المتوقع"]} />
          <PriceCard
            title="حسب الاستخدام"
            price="حسب الموارد المُدارة"
            highlight
            items={["فحص مستمر وتوقع للفاتورة", "تنبيهات WhatsApp وTelegram", "تنفيذ بنقرة مع سجل تدقيق", "تدفع فقط على ما نديره لك"]}
          />
          <PriceCard title="استشارات FinOps" price="حسب المشروع" items={["مهندس FinOps مخصص", "خطط الالتزام والحجوزات", "حوكمة التكاليف بين الفرق"]} />
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-brand p-8 text-white md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-bold">شاهد CloudTrim يعمل الآن</h2>
            <p className="mt-2 text-white/85">عرض تفاعلي على بيانات شركة سعودية افتراضية.</p>
          </div>
          <Link href="/demo" className="rounded-lg bg-white px-6 py-3 font-semibold text-brand-2 hover:bg-white/90">
            افتح العرض الحي
          </Link>
        </div>
      </section>

      <footer className="border-t border-line bg-card">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-muted md:flex-row">
          <Logo dark />
          <span>{TEAM_NAME} · VentureX 2026</span>
        </div>
      </footer>
    </main>
  );
}

function Logo({ dark }: { dark?: boolean }) {
  return (
    <span className={`flex items-center gap-2 font-bold ${dark ? "text-ink" : "text-white"}`} dir="ltr">
      <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden>
        <rect width="32" height="32" rx="8" fill="#0f8a6d" />
        <path d="M9 20a5 5 0 0 1 1.5-9.8A7 7 0 0 1 23.5 12 4 4 0 0 1 23 20Z" fill="#fff" />
        <path d="M12 16h8" stroke="#0f8a6d" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
      CloudTrim
    </span>
  );
}

function SectionTitle({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div>
      <p className="text-sm font-semibold text-brand">{kicker}</p>
      <h2 className="mt-2 text-3xl font-bold">{title}</h2>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl p-3 ${accent ? "bg-brand-soft" : "bg-surface"}`}>
      <p className="text-xs text-muted">{label}</p>
      <p className={`num mt-1 text-xl font-bold ${accent ? "text-brand-2" : ""}`}>{value}</p>
    </div>
  );
}

function Check() {
  return (
    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-2">
      <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden>
        <path d="M3 8.5 6.5 12 13 4.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function PriceCard({ title, price, items, highlight }: { title: string; price: string; items: string[]; highlight?: boolean }) {
  return (
    <div className={`rounded-xl border p-6 ${highlight ? "border-brand bg-card shadow-lg" : "border-line bg-card"}`}>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-2xl font-bold text-brand-2">{price}</p>
      <ul className="mt-5 space-y-2 text-sm text-ink-2">
        {items.map((i) => (
          <li key={i} className="flex gap-2">
            <span className="text-brand">•</span>
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}
