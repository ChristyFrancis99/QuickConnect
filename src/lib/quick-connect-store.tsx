import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  activities as initialActivities,
  currentUser,
  handovers as initialHandovers,
  projects as initialProjects,
  verification as initialVerification,
  type Activity,
  type Handover,
  type Project,
} from "./data";

type VerificationAnswer = {
  id: string;
  handoverId: string;
  personId: string;
  question: string;
  answer: string;
  submittedAt: string;
};

type HandoverReview = {
  id: string;
  handoverId: string;
  reviewerId: string;
  action: "changes_requested" | "rejected";
  comment: string;
  reviewedAt: string;
};

type HandoverApproval = {
  id: string;
  handoverId: string;
  approvedBy: string;
  approvedAt: string;
};

type QuickConnectData = {
  projects: Project[];
  handovers: Handover[];
  verification: typeof initialVerification;
  answers: VerificationAnswer[];
  approvals: HandoverApproval[];\n  reviews: HandoverReview[];
  activities: Activity[];
};

type QuickConnectApi = QuickConnectData & {
  addHandover: (handover: Omit<Handover, "id" | "status">) => void;
  approveHandover: (id: string, approvedBy: string) => void;\n  reviewHandover: (id: string, reviewerId: string, action: "changes_requested" | "rejected", comment: string) => void;
  submitAnswer: (answer: Omit<VerificationAnswer, "id" | "submittedAt">) => void;
};

const STORAGE_KEY = "quickconnect.dashboard.v1";
const initialData: QuickConnectData = {
  projects: initialProjects,
  handovers: initialHandovers,
  verification: initialVerification,
  answers: [],
  approvals: [],
  activities: initialActivities,
};

const QuickConnectContext = createContext<QuickConnectApi | null>(null);

function isQuickConnectData(value: unknown): value is QuickConnectData {
  if (!value || typeof value !== "object") return false;
  const data = value as Record<string, unknown>;
  return ["projects", "handovers", "verification", "answers", "approvals", "activities"].every(
    (key) => Array.isArray(data[key]),
  );
}

function loadSavedData(): { data: QuickConnectData; error: unknown | null } {
  if (typeof window === "undefined") return { data: initialData, error: null };
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return { data: initialData, error: null };
    const parsed: unknown = JSON.parse(saved);
    if (!isQuickConnectData(parsed)) {
      return { data: initialData, error: new Error("Saved dashboard data has an invalid format.") };
    }
    return { data: parsed, error: null };
  } catch (error) {
    return { data: initialData, error };
  }
}

function activity(who: string, text: string): Activity {
  return { id: crypto.randomUUID(), who, text, when: "Just now" };
}

export function QuickConnectProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState(initialData);
  const [loaded, setLoaded] = useState(false);
  const [storageError, setStorageError] = useState<unknown | null>(null);

  useEffect(() => {
    const saved = loadSavedData();
    setData(saved.data);
    setStorageError(saved.error);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (storageError) toast.error("Saved dashboard data could not be loaded. The sample data is shown instead.");
  }, [storageError]);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setStorageError(null);
    } catch (error) {
      console.error("Could not save QuickConnect dashboard data.", error);
      toast.error("Dashboard changes could not be saved in this browser.");
    }
  }, [data, loaded]);

  const api = useMemo<QuickConnectApi>(() => ({
    ...data,
    addHandover: (handover) => {
      const newHandover: Handover = {
        ...handover,
        id: crypto.randomUUID(),
        status: "Pending approval",
      };
      setData((current) => ({
        ...current,
        handovers: [newHandover, ...current.handovers],
        activities: [activity(currentUser.id, `created a handover for ${newHandover.project}`), ...current.activities],
      }));
    },
    reviewHandover: (id, reviewerId, action, comment) => {\n      const trimmedComment = comment.trim();\n      if (!trimmedComment) return;\n      setData((current) => {\n        const handover = current.handovers.find((item) => item.id === id);\n        if (!handover || handover.status === "Approved" || handover.status === "Rejected") return current;\n        const now = new Date().toISOString();\n        const status = action === "changes_requested" ? "Changes requested" : "Rejected";\n        const activityText = action === "changes_requested" ? `requested changes to the ${handover.project} handover` : `rejected the ${handover.project} handover`;\n        return {\n          ...current,\n          handovers: current.handovers.map((item) => item.id === id ? { ...item, status } : item),\n          reviews: [...(current.reviews ?? []), { id: crypto.randomUUID(), handoverId: id, reviewerId, action, comment: trimmedComment, reviewedAt: now }],\n          activities: [activity(reviewerId, activityText), ...current.activities],\n        };\n      });\n    },\n    approveHandover: (id, approvedBy) => {
      setData((current) => {
        const handover = current.handovers.find((item) => item.id === id);
        if (!handover || handover.status === "Approved" || handover.status === "Rejected") return current;
        const now = new Date().toISOString();
        return {
          ...current,
          handovers: current.handovers.map((item) => item.id === id ? { ...item, status: "Approved" } : item),
          approvals: [...current.approvals, { id: crypto.randomUUID(), handoverId: id, approvedBy, approvedAt: now }],
          activities: [activity(approvedBy, `approved the ${handover.project} handover`), ...current.activities],
        };
      });
    },
    submitAnswer: (answer) => {
      setData((current) => ({
        ...current,
        answers: [...current.answers, { ...answer, id: crypto.randomUUID(), submittedAt: new Date().toISOString() }],
        activities: [activity(answer.personId, "completed a knowledge verification answer"), ...current.activities],
      }));
    },
  }), [data]);

  return <QuickConnectContext.Provider value={api}>{children}</QuickConnectContext.Provider>;
}

export function useQuickConnect() {
  const value = useContext(QuickConnectContext);
  if (!value) throw new Error("useQuickConnect must be used within QuickConnectProvider");
  return value;
}
