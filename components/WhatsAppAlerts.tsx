"use client";

import { useState } from "react";

/* ---------- WhatsApp alerts subscription (offline demo, nothing is sent) ---------- */

export type WaSubscription = { phone: string; types: string[] };

export const waAlertTypes = [
  { id: "spike", label: "Cost spike", hint: "Spend jumps well above the usual daily level" },
  { id: "suspicious", label: "Suspicious activity", hint: "New region, unknown access key or login from abroad" },
  { id: "risky", label: "Risky change", hint: "Public storage bucket, open port or deleted backup" },
  { id: "waste", label: "Big waste found", hint: "A saving above SAR 1,000 per month" },
  { id: "weekly", label: "Weekly summary", hint: "Savings realized and open recommendations" },
];

export function WhatsAppModal({
  current,
  onClose,
  onSubscribe,
  onUnsubscribe,
}: {
  current: WaSubscription | null;
  onClose: () => void;
  onSubscribe: (sub: WaSubscription) => void;
  onUnsubscribe: () => void;
}) {
  const [phone, setPhone] = useState(current?.phone.replace("+966 ", "") ?? "");
  const [types, setTypes] = useState<string[]>(current?.types ?? ["spike", "suspicious", "risky"]);
  const [consent, setConsent] = useState(!!current);
  const [done, setDone] = useState(!!current);
  const digits = phone.replace(/\D/g, "");
  const valid = /^5\d{8}$/.test(digits) && types.length > 0 && consent;

  function toggle(id: string) {
    setTypes((t) => (t.includes(id) ? t.filter((x) => x !== id) : [...t, id]));
  }

  if (done) {
    return (
      <Modal onClose={onClose}>
        <p className="text-sm font-semibold text-brand">✓ Subscribed</p>
        <h2 className="font-display mt-1 text-2xl font-semibold">WhatsApp alerts are on</h2>
        <p className="mt-1 text-sm text-muted">
          Alerts go to <span className="num text-ink">+966 {digits}</span>. This is the demo, so no real message is sent. Here is what an alert looks like:
        </p>
        <div className="mt-5 border border-line bg-bg-2 p-4 text-sm">
          <div className="max-w-[92%] border border-line bg-card p-3.5">
            <p className="font-semibold text-brand">⚠️ CloudTrim: suspicious activity</p>
            <p className="mt-1 text-ink-2">
              A new access key created 12 virtual machines in <span className="text-ink">eu-west-3</span>, a region you never use.
              Estimated cost: <span className="num font-semibold text-ink">SAR 2,300</span> per day.
            </p>
            <p className="mt-2 text-ink-2">Nothing was changed. Reply 1 to stop these machines, or open the dashboard to review.</p>
            <p className="mt-2 text-brand underline">Review in CloudTrim</p>
            <p className="num mt-1 text-right text-[11px] text-muted">02:14</p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <button onClick={onClose} className="btn-primary bg-brand px-5 py-2.5 font-semibold text-onbrand">Done</button>
          <button onClick={() => setDone(false)} className="btn-ghost border border-line px-5 py-2.5">Edit alerts</button>
          <button onClick={onUnsubscribe} className="px-3 py-2.5 text-sm text-muted underline hover:text-ink">Unsubscribe</button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal onClose={onClose}>
      <h2 className="font-display text-2xl font-semibold">Get WhatsApp alerts</h2>
      <p className="mt-1 text-sm text-muted">We message you the moment something costly or dangerous happens in your cloud.</p>
      <form
        className="mt-5 space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          if (!valid) return;
          onSubscribe({ phone: `+966 ${digits}`, types });
          setDone(true);
        }}
      >
        <label className="block">
          <span className="text-sm font-medium">WhatsApp number</span>
          <div className="mt-1.5 flex items-center border border-line bg-bg-2 focus-within:border-brand">
            <span className="num border-e border-line px-3.5 py-2.5 text-muted">+966</span>
            <input
              inputMode="tel"
              placeholder="5X XXX XXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="num w-full bg-transparent px-3.5 py-2.5 placeholder:text-muted focus:outline-none"
            />
          </div>
          {phone && !/^5\d{8}$/.test(digits) && <span className="mt-1 block text-xs text-brand">Enter a Saudi mobile number starting with 5 (9 digits).</span>}
        </label>

        <fieldset>
          <legend className="text-sm font-medium">Alert me about</legend>
          <div className="mt-2 space-y-2">
            {waAlertTypes.map((t) => (
              <label key={t.id} className={`flex cursor-pointer gap-3 border p-3 ${types.includes(t.id) ? "border-brand/50 bg-brand-soft" : "border-line"}`}>
                <input type="checkbox" checked={types.includes(t.id)} onChange={() => toggle(t.id)} className="mt-1 h-4 w-4 accent-[#8e2f3c]" />
                <span>
                  <span className="block text-sm font-medium">{t.label}</span>
                  <span className="block text-xs text-muted">{t.hint}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <label className="flex cursor-pointer gap-3 text-sm text-ink-2">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-4 w-4 accent-[#8e2f3c]" />
          I agree to receive alerts from CloudTrim on WhatsApp. I can unsubscribe at any time.
        </label>

        <div className="flex gap-2">
          <button disabled={!valid} className="btn-primary bg-brand px-5 py-2.5 font-semibold text-onbrand disabled:opacity-50">Subscribe</button>
          <button type="button" onClick={onClose} className="btn-ghost border border-line px-5 py-2.5">Cancel</button>
        </div>
      </form>
    </Modal>
  );
}

/* Same overlay as the dashboard modals */
function Modal({ children, onClose }: { children: React.ReactNode; onClose?: () => void }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div className="rise max-h-[90vh] w-full max-w-lg overflow-y-auto border border-line bg-card p-7" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
