// Landing page copy in English and Arabic. Both pages render components/Landing.tsx.

// Placeholder until the team sets real prices
const PRICE_PER_RESOURCE = 15;

export const en = {
  lang: "en" as "en" | "ar",
  dir: "ltr" as "ltr" | "rtl",
  switchHref: "/ar",
  switchLabel: "العربية",
  nav: { problem: "Problem", safety: "Safety", compliance: "Compliance", pricing: "Pricing", dashboard: "Dashboard" },
  cta: "Run free scan",
  demo: "See the demo",
  hero: {
    kicker: "AI FinOps · Saudi Arabia & GCC",
    // [plain, brand word, plain, amber word, plain]
    title: ["Every riyal of your ", "cloud", ", working. Every action, ", "approved", "."],
    body: "CloudTrim's AI agent scans your clouds with read-only access, finds the waste, and waits for your team's one-click approval before anything changes.",
    points: ["6 cloud providers", "Read-only by default", "Every action human-approved"],
  },
  card: {
    title: "Monthly cloud bill (SAR)",
    before: "Before",
    after: "After",
    withUs: "With CloudTrim",
    saved: "Saved every month",
    was: "Was",
    months: ["Apr", "May", "Jun", "Jul", "Aug", "Sep"],
  },
  tagline: ["Scan, ", "Explain, ", "Approve, ", "Save."],
  worksWith: "Works with",
  problem: {
    kicker: "The problem",
    title: "Why cloud spend gets out of control.",
    items: [
      {
        stat: "27%",
        title: "of cloud spend is wasted on idle and oversized resources",
        why: "Servers left running after a project ends, and sizes picked once and never revisited.",
        who: "Finance sees the bill; engineering never sees the cost.",
      },
      {
        stat: "3",
        title: "local clouds (STC, SCCC, CNTXT) that global FinOps tools leave out",
        why: "Data residency rules push workloads onto local clouds that global tools cannot read.",
        who: "Saudi companies running local and global clouds side by side.",
      },
      {
        stat: "1",
        title: "wrong click on an automated fix can take production down",
        why: "Tools that act on their own can stop a server that looked idle but was not.",
        who: "IT teams that cannot risk downtime, so they fix nothing.",
      },
      {
        stat: "12",
        title: "month contracts that put enterprise FinOps tools out of reach for SMEs",
        why: "Enterprise tools sell yearly licences sized for large cloud budgets.",
        who: "Companies of 50 to 250 staff without a FinOps team.",
      },
    ],
    whyLabel: "Why",
    whoLabel: "Who it hits",
    source:
      "Sources: 27% is the share of cloud spend that organizations estimate they waste (Flexera 2024 State of the Cloud Report). The other figures are CloudTrim team estimates.",
  },
  how: {
    kicker: "How it works",
    title: "From sign-up to savings in four steps.",
    steps: [
      { title: "Create account", body: "Name, work email and company. One minute, no credit card." },
      { title: "Connect read-only", body: "Paste a read-only API key or create a read-only role. CloudTrim can read costs and resources, and nothing else." },
      { title: "AI analysis", body: "The AI agent scans every resource, finds waste and ranks savings by value and risk." },
      { title: "Approve and save", body: "Your dashboard shows the numbers in plain language. You approve each fix with one click." },
    ],
  },
  compare: {
    kicker: "Why CloudTrim",
    title: "Built for Saudi SMEs, not adapted for them.",
    cols: ["CloudTrim", "Global FinOps suites", "Cloud-native cost tools"],
    rows: [
      { label: "STC, SCCC and CNTXT", v: ["yes", "no", "no"] },
      { label: "Human approval before any change", v: ["yes", "some", "no"] },
      { label: "Fixes, not just reports", v: ["yes", "some", "no"] },
      { label: "WhatsApp alerts and Arabic", v: ["yes", "no", "no"] },
      { label: "Priced for 50 to 250 staff", v: ["yes", "no", "yes"] },
    ],
    legend: { yes: "Yes", some: "Partly", no: "No" },
  },
  safety: {
    kicker: "Safety first",
    title: "AI recommends. Humans decide.",
    body: "The connection is read-only by default. Changes need a separate, opt-in permission scoped to one action, that expires on its own.",
    step: "Step {n} of {of}",
    steps: [
      { t: "Read-only scan", d: "IAM role can read costs and resources. It cannot change anything." },
      { t: "AI recommendation", d: "Each saving comes with evidence, risk level and a plain-language reason." },
      { t: "Human approval", d: "Your engineer reviews and approves with one click, on web or WhatsApp." },
      { t: "Scoped, temporary access", d: "A permission limited to that single action is granted for 15 minutes." },
      { t: "Safe execution", d: "Snapshot first, stop rather than delete, one-click rollback." },
      { t: "Revoke & audit", d: "Access returns to read-only and every step is logged for NCA and ISO audits." },
    ],
  },
  compliance: {
    kicker: "Compliance",
    title: "Aligned with Saudi rules from day one.",
    body: "Data stays in the Kingdom, and our controls are designed to align with Saudi cybersecurity and data protection rules. These are the frameworks we align with; CloudTrim does not claim certification.",
    aligned: "Aligned with",
    items: [
      { k: "NCA ECC", v: "National Cybersecurity Authority controls" },
      { k: "PDPL", v: "Personal Data Protection Law" },
      { k: "ISO 27001", v: "Information security management" },
      { k: "ISO 27017", v: "Cloud security controls" },
    ],
  },
  pricing: {
    kicker: "Pricing",
    title: "Start free, then pay per resource.",
    core: "Core",
    cap: "Usage-based plans have a monthly cap you set, so the CloudTrim bill never grows past what you agreed.",
    plans: [
      { title: "First scan", price: "Free", unit: "one-time, no card", items: ["Connect multi cloud account", "Full waste report as PDF", "Top savings with expected value"] },
      {
        title: "Usage-based",
        price: `From SAR ${PRICE_PER_RESOURCE}`,
        unit: "per managed resource / month",
        items: ["Continuous scanning and bill forecast", "WhatsApp & Telegram alerts", "One-click remediation with audit log", "Only pay for what we manage"],
      },
      { title: "FinOps consulting", price: "Quoted", unit: "per engagement", items: ["Dedicated FinOps engineer", "Commitment and reservation plans", "Cost governance across teams"] },
    ],
  },
  closing: {
    title: "See what your cloud is wasting.",
    body: "Connect a read-only key and get your first waste report free. Nothing changes without your approval.",
  },
  footer: { demo: "Demo", signup: "Sign up", privacy: "Privacy", github: "GitHub" },
  currency: "SAR",
  currencyAfter: false,
};

export type LandingCopy = typeof en;

export const ar: LandingCopy = {
  lang: "ar",
  dir: "rtl",
  switchHref: "/",
  switchLabel: "English",
  nav: { problem: "المشكلة", safety: "الأمان", compliance: "الامتثال", pricing: "الأسعار", dashboard: "لوحة التحكم" },
  cta: "ابدأ فحصًا مجانيًا",
  demo: "شاهد العرض",
  hero: {
    kicker: "إدارة تكاليف السحابة بالذكاء الاصطناعي · السعودية والخليج",
    title: ["كل ريال في ", "سحابتك", " يعمل لصالحك. وكل إجراء ", "بموافقتك", "."],
    body: "يفحص وكيل CloudTrim الذكي سحاباتك بصلاحية قراءة فقط، ويكتشف الهدر، ولا يغيّر شيئًا قبل موافقة فريقك بنقرة واحدة.",
    points: ["6 مزودي سحابة", "قراءة فقط افتراضيًا", "كل إجراء بموافقة بشرية"],
  },
  card: {
    title: "فاتورة السحابة الشهرية (ريال)",
    before: "قبل",
    after: "بعد",
    withUs: "مع CloudTrim",
    saved: "التوفير الشهري",
    was: "كانت",
    months: ["أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر"],
  },
  tagline: ["افحص، ", "اشرح، ", "وافق، ", "وفّر."],
  worksWith: "يعمل مع",
  problem: {
    kicker: "المشكلة",
    title: "لماذا تخرج تكاليف السحابة عن السيطرة؟",
    items: [
      {
        stat: "27%",
        title: "من الإنفاق السحابي يُهدر على موارد خاملة أو أكبر من الحاجة",
        why: "خوادم تبقى تعمل بعد انتهاء المشروع، وأحجام اختيرت مرة ولم تُراجع.",
        who: "المالية ترى الفاتورة، والهندسة لا ترى التكلفة.",
      },
      {
        stat: "3",
        title: "سحابات محلية (STC وSCCC وCNTXT) لا تدعمها الأدوات العالمية",
        why: "أنظمة توطين البيانات تنقل الأعمال إلى سحابات محلية لا تقرؤها الأدوات العالمية.",
        who: "الشركات السعودية التي تستخدم سحابات محلية وعالمية معًا.",
      },
      {
        stat: "1",
        title: "نقرة خاطئة في إصلاح آلي قد توقف بيئة الإنتاج",
        why: "الأدوات التي تتصرف وحدها قد توقف خادمًا بدا خاملًا وهو ليس كذلك.",
        who: "فرق التقنية التي لا تتحمل التوقف، فلا تصلح شيئًا.",
      },
      {
        stat: "12",
        title: "شهرًا مدة عقود الأدوات الكبرى، وهذا يبعدها عن الشركات الصغيرة والمتوسطة",
        why: "الأدوات الكبرى تبيع تراخيص سنوية مصممة لميزانيات سحابية ضخمة.",
        who: "الشركات من 50 إلى 250 موظفًا بدون فريق FinOps.",
      },
    ],
    whyLabel: "السبب",
    whoLabel: "المتأثرون",
    source:
      "المصادر: نسبة 27% هي تقدير المؤسسات لحجم الهدر في إنفاقها السحابي (تقرير Flexera لحالة السحابة 2024). باقي الأرقام تقديرات فريق CloudTrim.",
  },
  how: {
    kicker: "كيف يعمل",
    title: "من التسجيل إلى التوفير في أربع خطوات.",
    steps: [
      { title: "أنشئ حسابًا", body: "الاسم والبريد واسم الشركة. دقيقة واحدة وبدون بطاقة." },
      { title: "اربط للقراءة فقط", body: "الصق مفتاحًا للقراءة فقط أو أنشئ دورًا للقراءة فقط. يقرأ CloudTrim التكاليف والموارد ولا شيء غيرها." },
      { title: "تحليل بالذكاء الاصطناعي", body: "يفحص الوكيل الذكي كل مورد، ويكتشف الهدر، ويرتب فرص التوفير حسب القيمة والمخاطرة." },
      { title: "وافق ووفّر", body: "تعرض لوحتك الأرقام بلغة واضحة، وتوافق على كل إصلاح بنقرة واحدة." },
    ],
  },
  compare: {
    kicker: "لماذا CloudTrim",
    title: "مصمم للشركات السعودية الصغيرة والمتوسطة من البداية.",
    cols: ["CloudTrim", "منصات FinOps العالمية", "أدوات التكلفة المدمجة في السحابة"],
    rows: [
      { label: "STC وSCCC وCNTXT", v: ["yes", "no", "no"] },
      { label: "موافقة بشرية قبل أي تغيير", v: ["yes", "some", "no"] },
      { label: "إصلاحات، وليس تقارير فقط", v: ["yes", "some", "no"] },
      { label: "تنبيهات واتساب وواجهة عربية", v: ["yes", "no", "no"] },
      { label: "أسعار مناسبة لـ 50 إلى 250 موظفًا", v: ["yes", "no", "yes"] },
    ],
    legend: { yes: "نعم", some: "جزئيًا", no: "لا" },
  },
  safety: {
    kicker: "الأمان أولًا",
    title: "الذكاء الاصطناعي يقترح، والإنسان يقرر.",
    body: "الاتصال للقراءة فقط افتراضيًا. أي تغيير يحتاج صلاحية منفصلة واختيارية، محصورة في إجراء واحد وتنتهي تلقائيًا.",
    step: "الخطوة {n} من {of}",
    steps: [
      { t: "فحص للقراءة فقط", d: "دور IAM يقرأ التكاليف والموارد فقط، ولا يستطيع تغيير أي شيء." },
      { t: "توصية الذكاء الاصطناعي", d: "كل توفير يأتي مع الدليل ومستوى المخاطرة وسبب بلغة واضحة." },
      { t: "موافقة بشرية", d: "يراجع مهندسك التوصية ويوافق بنقرة واحدة من الموقع أو واتساب." },
      { t: "صلاحية مؤقتة ومحدودة", d: "تُمنح صلاحية لهذا الإجراء وحده لمدة 15 دقيقة." },
      { t: "تنفيذ آمن", d: "نسخة احتياطية أولًا، إيقاف بدل الحذف، والتراجع بنقرة واحدة." },
      { t: "سحب الصلاحية والتدقيق", d: "تعود الصلاحية للقراءة فقط، وتُسجّل كل خطوة لتدقيق NCA وISO." },
    ],
  },
  compliance: {
    kicker: "الامتثال",
    title: "متوافق مع الأنظمة السعودية من اليوم الأول.",
    body: "تبقى البيانات داخل المملكة، وضوابطنا مصممة لتتوافق مع أنظمة الأمن السيبراني وحماية البيانات في السعودية. هذه هي الأطر التي نتوافق معها، ولا ندّعي أن CloudTrim حاصل على شهاداتها.",
    aligned: "متوافق مع",
    items: [
      { k: "NCA ECC", v: "ضوابط الهيئة الوطنية للأمن السيبراني" },
      { k: "PDPL", v: "نظام حماية البيانات الشخصية" },
      { k: "ISO 27001", v: "إدارة أمن المعلومات" },
      { k: "ISO 27017", v: "ضوابط أمن السحابة" },
    ],
  },
  pricing: {
    kicker: "الأسعار",
    title: "ابدأ مجانًا، ثم ادفع لكل مورد.",
    core: "الأساسية",
    cap: "خطة الاستخدام لها حد أقصى شهري تحدده أنت، فلا تتجاوز فاتورة CloudTrim ما اتفقنا عليه.",
    plans: [
      { title: "الفحص الأول", price: "مجاني", unit: "مرة واحدة، بدون بطاقة", items: ["ربط حسابات سحابية متعددة", "تقرير كامل عن الهدر بصيغة PDF", "أعلى فرص التوفير مع قيمتها المتوقعة"] },
      {
        title: "حسب الاستخدام",
        price: `من ${PRICE_PER_RESOURCE} ريال`,
        unit: "لكل مورد مُدار شهريًا",
        items: ["فحص مستمر وتوقع للفاتورة", "تنبيهات واتساب وتيليجرام", "إصلاح بنقرة واحدة مع سجل تدقيق", "تدفع فقط مقابل ما نديره"],
      },
      { title: "استشارات FinOps", price: "حسب الطلب", unit: "لكل مشروع", items: ["مهندس FinOps مخصص", "خطط الالتزام والحجوزات", "حوكمة التكاليف بين الفرق"] },
    ],
  },
  closing: {
    title: "اكتشف كم تهدر سحابتك.",
    body: "اربط مفتاحًا للقراءة فقط واحصل على أول تقرير هدر مجانًا. لا شيء يتغير بدون موافقتك.",
  },
  footer: { demo: "العرض", signup: "التسجيل", privacy: "الخصوصية", github: "GitHub" },
  currency: "ريال",
  currencyAfter: true,
};
