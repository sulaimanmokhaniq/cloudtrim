// Seeded demo data: a fictional Saudi SME so the live demo never depends on a real account.

export const TEAM_NAME = "CloudTrim Team"; // TODO: replace with the official team name

export type Risk = "low" | "medium" | "high";

export type Finding = {
  id: string;
  category: string;
  title: string;
  resource: string;
  detail: string;
  monthlySavings: number; // SAR
  risk: Risk;
  action: string;
  safeguards: string[];
  explanation: string; // cached AI explanation, used when the live model is unavailable
};

export const company = {
  name: "شركة نخلة للتقنية (افتراضية)",
  employees: 120,
  provider: "AWS",
  region: "me-central-1",
  monthlySpend: 85400,
  lastScan: "قبل 12 دقيقة",
  resourcesScanned: 342,
};

export const monthlyTrend = [
  { month: "أبريل", value: 61200 },
  { month: "مايو", value: 66800 },
  { month: "يونيو", value: 70100 },
  { month: "يوليو", value: 74900 },
  { month: "أغسطس", value: 79600 },
  { month: "سبتمبر", value: 85400 },
  { month: "أكتوبر", value: 91300, forecast: true },
];

export const byService = [
  { name: "EC2 (السيرفرات)", value: 38900 },
  { name: "RDS (قواعد البيانات)", value: 19700 },
  { name: "EBS والـ Snapshots", value: 11200 },
  { name: "S3 (التخزين)", value: 6800 },
  { name: "نقل البيانات", value: 5400 },
  { name: "أخرى", value: 3400 },
];

export const providers = [
  { name: "AWS", status: "connected" as const, note: "متصل بصلاحية قراءة فقط" },
  { name: "STC Cloud", status: "soon" as const, note: "قريباً" },
  { name: "SCCC (Alibaba)", status: "soon" as const, note: "قريباً" },
  { name: "CNTXT", status: "soon" as const, note: "قريباً" },
  { name: "Microsoft Azure", status: "soon" as const, note: "قريباً" },
  { name: "Google Cloud", status: "soon" as const, note: "قريباً" },
];

export const readOnlyPermissions = [
  "ce:GetCostAndUsage",
  "ce:GetCostForecast",
  "ec2:DescribeInstances",
  "ec2:DescribeVolumes",
  "ec2:DescribeSnapshots",
  "ec2:DescribeAddresses",
  "rds:DescribeDBInstances",
  "cloudwatch:GetMetricStatistics",
];

export const findings: Finding[] = [
  {
    id: "dev-schedule",
    category: "جدولة",
    title: "بيئة التطوير تعمل 24/7",
    resource: "8 سيرفرات بوسم env=dev",
    detail: "لا يوجد استخدام بين 8 مساءً و7 صباحاً ولا في عطلة نهاية الأسبوع",
    monthlySavings: 3100,
    risk: "low",
    action: "إيقاف السيرفرات تلقائياً خارج ساعات العمل وتشغيلها صباحاً",
    safeguards: ["لا حذف لأي بيانات", "تشغيل يدوي فوري عند الحاجة"],
    explanation:
      "سيرفرات التطوير تعمل طوال الأسبوع بينما يستخدمها الفريق قرابة 55 ساعة فقط. إيقافها ليلاً وفي عطلة نهاية الأسبوع يخفض تكلفتها بنحو 65% دون أي أثر على العملاء، لأنها ليست بيئة إنتاج.",
  },
  {
    id: "rds-rightsize",
    category: "تحجيم",
    title: "قاعدة بيانات أكبر من الحاجة",
    resource: "rds: orders-db (db.r5.2xlarge)",
    detail: "متوسط استخدام المعالج 9% وأقصاه 31% خلال 30 يوماً",
    monthlySavings: 2900,
    risk: "medium",
    action: "تصغير الحجم إلى db.r6g.xlarge في نافذة الصيانة",
    safeguards: ["Snapshot قبل التغيير", "تنفيذ في نافذة الصيانة فقط", "تراجع بنقرة"],
    explanation:
      "قاعدة البيانات لا تتجاوز ثلث طاقتها حتى في الذروة. الانتقال إلى حجم أصغر من جيل Graviton الأحدث يحافظ على هامش أمان مريح ويوفر قرابة النصف. لأنها قاعدة إنتاج، نوصي بالتنفيذ في نافذة الصيانة مع Snapshot مسبق.",
  },
  {
    id: "idle-ec2",
    category: "موارد خاملة",
    title: "سيرفر خامل منذ 14 يوماً",
    resource: "ec2: staging-api-old (m5.2xlarge)",
    detail: "استخدام المعالج 2.1% ولا حركة شبكة منذ 14 يوماً",
    monthlySavings: 1380,
    risk: "low",
    action: "إيقاف السيرفر (Stop) مع الإبقاء على القرص",
    safeguards: ["إيقاف وليس حذف", "إعادة التشغيل بنقرة"],
    explanation:
      "هذا السيرفر لم يستقبل أي طلبات منذ أسبوعين، ويبدو أنه نسخة قديمة من بيئة الاختبار بقيت بعد إطلاق النسخة الجديدة. الإيقاف آمن تماماً لأن القرص يبقى ويمكن إعادة التشغيل في أي لحظة.",
  },
  {
    id: "old-snapshots",
    category: "تخزين",
    title: "Snapshots قديمة تجاوزت 180 يوماً",
    resource: "41 snapshot بحجم 3.8 TB",
    detail: "لا ترتبط بأي سيرفر قائم ولا بسياسة نسخ احتياطي",
    monthlySavings: 710,
    risk: "medium",
    action: "نقلها إلى التخزين الأرشيفي (Archive) بدلاً من الحذف",
    safeguards: ["أرشفة وليس حذف", "قابلة للاستعادة"],
    explanation:
      "هذه النسخ تراكمت من سيرفرات حُذفت منذ أشهر. بدلاً من حذفها نقترح أرشفتها، فتنخفض تكلفتها 75% وتبقى متاحة إن احتاجها فريق الامتثال لاحقاً.",
  },
  {
    id: "gp2-gp3",
    category: "تحديث",
    title: "أقراص من الجيل القديم gp2",
    resource: "23 قرص EBS بحجم 4.1 TB",
    detail: "gp3 أرخص بنحو 20% وأداؤه مساوٍ أو أفضل",
    monthlySavings: 620,
    risk: "low",
    action: "ترقية الأقراص إلى gp3 دون إيقاف السيرفرات",
    safeguards: ["بدون توقف للخدمة", "لا تغيير في البيانات"],
    explanation:
      "الترقية من gp2 إلى gp3 تتم والسيرفر يعمل، دون أي انقطاع، وتمنح أداءً أساسياً أعلى بسعر أقل. هذه من أسهل التوصيات وأقلها خطورة.",
  },
  {
    id: "orphan-ebs",
    category: "موارد يتيمة",
    title: "أقراص غير مرتبطة بأي سيرفر",
    resource: "6 أقراص EBS بحجم 1.2 TB",
    detail: "حالتها available منذ أكثر من 30 يوماً",
    monthlySavings: 450,
    risk: "medium",
    action: "أخذ Snapshot ثم حذف الأقراص",
    safeguards: ["Snapshot قبل الحذف", "استعادة القرص من الـ Snapshot"],
    explanation:
      "هذه الأقراص بقيت بعد حذف سيرفراتها ولا يقرأ منها أحد. نأخذ Snapshot لكل قرص أولاً ثم نحذفه، فإن احتجتم أي قرص لاحقاً يمكن استعادته خلال دقائق.",
  },
  {
    id: "unused-eip",
    category: "موارد يتيمة",
    title: "عناوين IP ثابتة غير مستخدمة",
    resource: "3 Elastic IPs",
    detail: "غير مرتبطة بأي سيرفر",
    monthlySavings: 42,
    risk: "low",
    action: "تحرير العناوين",
    safeguards: ["التحقق من عدم وجودها في سجلات DNS"],
    explanation:
      "AWS تحاسب على عناوين IP الثابتة غير المستخدمة. المبلغ صغير لكنه هدر خالص، ونتحقق قبل التحرير من أن العنوان غير مذكور في أي سجل DNS.",
  },
];

export const totalSavings = findings.reduce((s, f) => s + f.monthlySavings, 0);

export const riskLabel: Record<Risk, string> = {
  low: "خطورة منخفضة",
  medium: "خطورة متوسطة",
  high: "خطورة عالية",
};

export function sar(n: number) {
  return new Intl.NumberFormat("en-US").format(Math.round(n)) + " ر.س";
}
