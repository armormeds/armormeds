import { useState } from "react";
import { ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";

const SAFETY_INFO: Record<string, string[]> = {
  semaglutide: [
    "Common side effects include nausea, vomiting, and diarrhea, especially when starting treatment.",
    "Risk of pancreatitis. Stop use and seek care if you have severe abdominal pain.",
    "Not for use if you or a family member have a history of medullary thyroid carcinoma or MEN2.",
  ],
  tirzepatide: [
    "Common side effects include nausea, vomiting, and diarrhea, especially during dose increases.",
    "Risk of pancreatitis. Stop use and seek care if you have severe abdominal pain.",
    "Not recommended with a personal or family history of medullary thyroid carcinoma or MEN2.",
  ],
  finasteride: [
    "May cause decreased libido, erectile dysfunction, or decreased ejaculate volume.",
    "Not for use by women or children. Women who are pregnant should not handle crushed tablets.",
    "Rare reports of high-grade prostate cancer; discuss screening with your provider.",
  ],
  minoxidil: [
    "Topical use may cause scalp irritation, itching, or unwanted facial/body hair growth.",
    "Oral minoxidil can cause dizziness, fluid retention, or rapid heartbeat.",
    "Results typically require consistent daily use for at least 3–6 months.",
  ],
  sildenafil: [
    "Common side effects include headache, facial flushing, upset stomach, and nasal congestion.",
    "Do not take with nitrates (used for chest pain) — this combination can cause a dangerous drop in blood pressure.",
    "Rare cases of sudden vision or hearing loss reported; stop use and seek care immediately if this occurs.",
  ],
  tadalafil: [
    "Common side effects include headache, back pain, muscle aches, and flushing.",
    "Do not take with nitrates — the combination can cause a severe and dangerous drop in blood pressure.",
    "Not recommended for patients with severe heart or liver disease without physician guidance.",
  ],
  vardenafil: [
    "Common side effects include headache, flushing, runny nose, and indigestion.",
    "Do not take with nitrates or alpha-blockers without medical supervision.",
    "Rare reports of sudden vision changes (NAION); stop use immediately if vision is affected.",
  ],
};

function getSafetyInfo(name: string): string[] | null {
  const key = Object.keys(SAFETY_INFO).find((k) => name.toLowerCase().includes(k));
  return key ? SAFETY_INFO[key] : null;
}

export function SafetyDisclosure({ productName }: { productName: string }) {
  const [open, setOpen] = useState(false);
  const info = getSafetyInfo(productName);
  if (!info) return null;

  return (
    <div className="mt-3 text-xs border border-amber-200 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-3 py-2 bg-amber-50 text-amber-800 hover:bg-amber-100 transition-colors font-medium"
        data-testid={`button-safety-disclosure-${productName.toLowerCase().replace(/\s+/g, "-")}`}
      >
        <span className="flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
          Important Safety Information
        </span>
        {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>
      {open && (
        <ul className="px-3 py-2 bg-white space-y-1.5 text-slate-600">
          {info.map((point, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-amber-500 flex-shrink-0">•</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
