import { useState } from "react";
import { toast } from "sonner";
import { Check, Mail, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { people, personById, sources } from "@/lib/data";
import { Avatar, AiAvatar, Bar, Pill, readinessLabel, readinessTone } from "./primitives";
import { useUI } from "./ui-context";
import { useQuickConnect } from "@/lib/quick-connect-store";
import { useAuth } from "@/lib/auth-store";

export type DialogState =
  | { kind: "profile"; id: string }
  | { kind: "project"; id: string }
  | { kind: "handover" }
  | { kind: "verify"; id: string }
  | { kind: "notifications" }
  | null;

export function Dialogs({ state, close }: { state: DialogState; close: () => void }) {
  return (
    <Dialog open={!!state} onOpenChange={(o) => !o && close()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl sm:max-w-lg">
        {state?.kind === "profile" && <Profile id={state.id} />}
        {state?.kind === "project" && <ProjectDetail id={state.id} />}
        {state?.kind === "handover" && <HandoverWizard close={close} />}
        {state?.kind === "verify" && <Verify id={state.id} close={close} />}
        {state?.kind === "notifications" && <Notifications />}
      </DialogContent>
    </Dialog>
  );
}

function Profile({ id }: { id: string }) {
  const p = personById(id);
  const ui = useUI();
  const { projects, verification } = useQuickConnect();
  const v = verification.find((x) => x.who === id);
  return (
    <>
      <DialogHeader className="items-center text-center">
        <img src={p.avatar} alt={p.name} className="mb-2 h-24 w-24 rounded-full object-cover shadow-sm ring-2 ring-border/30" style={{ backgroundColor: p.bgColor }} />
        <DialogTitle>{p.name}</DialogTitle>
        <DialogDescription>{p.role}</DialogDescription>
      </DialogHeader>
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Mail className="h-4 w-4" /> {p.email}
      </div>
      {v && (
        <div className="rounded-2xl bg-muted p-4">
          <div className="mb-2 flex justify-between text-sm"><span>Knowledge readiness</span><b>{v.readiness}%</b></div>
          <Bar value={v.readiness} />
        </div>
      )}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Projects</p>
        <div className="flex flex-wrap gap-2">
          {p.projects.length ? p.projects.map((pid) => {
            const pr = projects.find((x) => x.id === pid)!;
            return <button key={pid} onClick={() => ui.openProject(pid)} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground hover:bg-primary hover:text-primary-foreground">{pr.name}</button>;
          }) : <span className="text-sm text-muted-foreground">No assigned projects</span>}
        </div>
      </div>
    </>
  );
}

function ProjectDetail({ id }: { id: string }) {
  const { projects } = useQuickConnect();
  const p = projects.find((x) => x.id === id)!;
  return (
    <>
      <DialogHeader>
        <DialogTitle>{p.name}</DialogTitle>
        <DialogDescription>{p.description}</DialogDescription>
      </DialogHeader>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="rounded-2xl bg-muted p-3"><p className="text-xl font-bold">{p.progress}%</p><p className="text-[11px] text-muted-foreground">Complete</p></div>
        <div className="rounded-2xl bg-muted p-3"><p className="text-xl font-bold">{p.due}</p><p className="text-[11px] text-muted-foreground">Handover</p></div>
        <div className="rounded-2xl bg-muted p-3"><p className="text-xl font-bold capitalize">{p.risk}</p><p className="text-[11px] text-muted-foreground">Knowledge risk</p></div>
      </div>
      <Bar value={p.progress} color={p.color} />
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Team</p>
        <div className="space-y-2">
          {p.members.map((m) => {
            const pp = personById(m);
            return (
              <div key={m} className="flex items-center gap-3">
                <Avatar id={m} size={32} />
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{pp.name}</p><p className="text-xs text-muted-foreground">{pp.role}</p></div>
                {m === p.owner && <Pill tone="accent">Owner</Pill>}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

function HandoverWizard({ close }: { close: () => void }) {
  const { projects, addHandover } = useQuickConnect();
  const [step, setStep] = useState(0);
  const [project, setProject] = useState("pay");
  const [from, setFrom] = useState(user.id);
  const [to, setTo] = useState("priya");
  const [picked, setPicked] = useState<string[]>(["GitHub", "Jira", "Slack"]);
  const steps = ["Project", "People", "Sources", "Review"];
  const sel = "w-full rounded-xl border border-input bg-background px-3 py-2 text-sm";
  return (
    <>
      <DialogHeader>
        <DialogTitle>Create new handover</DialogTitle>
        <DialogDescription>Step {step + 1} of 4 · {steps[step]}</DialogDescription>
      </DialogHeader>
      <div className="flex gap-1.5">{steps.map((s, i) => <div key={s} className={`h-1 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-muted"}`} />)}</div>
      {step === 0 && (
        <div className="space-y-2">
          {projects.map((p) => (
            <button key={p.id} onClick={() => setProject(p.id)} className={`flex w-full items-center justify-between rounded-xl border p-3 text-left text-sm ${project === p.id ? "border-primary bg-secondary" : "border-border"}`}>
              {p.name} {project === p.id && <Check className="h-4 w-4 text-primary" />}
            </button>
          ))}
        </div>
      )}
      {step === 1 && (
        <div className="space-y-3 text-sm">
          <label className="block">Outgoing member<select className={sel} value={from} disabled={roleCategory === "Outgoing Member"} onChange={(e) => setFrom(e.target.value)}>{people.filter((p) => roleCategory !== "Outgoing Member" || p.id === user.id).map((p) => <option key={p.id} value={p.id}>{p.name} · {p.role}</option>)}</select></label>
          <label className="block">Incoming member<select className={sel} value={to} onChange={(e) => setTo(e.target.value)}>{people.map((p) => <option key={p.id} value={p.id}>{p.name} · {p.role}</option>)}</select></label>
        </div>
      )}
      {step === 2 && (
        <div className="grid grid-cols-2 gap-2">
          {sources.map((s) => {
            const on = picked.includes(s.name);
            return (
              <button key={s.name} onClick={() => setPicked(on ? picked.filter((x) => x !== s.name) : [...picked, s.name])} className={`rounded-xl border p-3 text-left text-sm ${on ? "border-primary bg-secondary" : "border-border"}`}>
                <p className="font-medium">{s.name}</p><p className="text-xs text-muted-foreground">{s.items}</p>
              </button>
            );
          })}
        </div>
      )}
      {step === 3 && (
        <div className="space-y-3 rounded-2xl bg-muted p-4 text-sm">
          <p><b>{projects.find((p) => p.id === project)!.name}</b></p>
          <div className="flex items-center gap-2"><Avatar id={from} size={28} /> → <Avatar id={to} size={28} /><span className="text-muted-foreground">{personById(from).name} to {personById(to).name}</span></div>
          <p className="text-muted-foreground">{picked.length} sources will be analyzed: {picked.join(", ")}</p>
          <div className="flex items-center gap-2 text-accent"><Sparkles className="h-4 w-4" /> AI will draft the report and verification questions.</div>
        </div>
      )}
      <div className="flex justify-between">
        <Button variant="ghost" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</Button>
        {step < 3 ? (
          <Button onClick={() => setStep(step + 1)} disabled={step === 1 && from === to}>Continue</Button>
        ) : (
          <Button onClick={() => {
            const selectedProject = projects.find((item) => item.id === project)!;
            const now = new Date();
            addHandover({
              projectId: selectedProject.id,
              project: selectedProject.name,
              date: String(now.getDate()).padStart(2, "0"),
              month: now.toLocaleString("en", { month: "short" }),
              from,
              to,
              time: now.toLocaleTimeString("en", { hour: "numeric", minute: "2-digit" }),
              knowledge: [
                { question: `What is the primary focus of ${selectedProject.name}?`, answer: selectedProject.description },
                { question: `Which knowledge sources were selected for ${selectedProject.name}?`, answer: picked.length ? picked.join(", ") : "No external sources were selected; use the project description as the handover source." },
                { question: `Who is handing over ${selectedProject.name} to ${personById(to).name}?`, answer: `${personById(from).name} is the outgoing team member.` },
              ],
            });
            toast.success("Handover created and saved. It is awaiting approval.");
            close();
          }}>Create handover</Button>
        )}
      </div>
    </>
  );
}

function Verify({ id, close }: { id: string; close: () => void }) {
  const p = personById(id);
  const [answer, setAnswer] = useState("");
  const { handovers, answers, submitAnswer } = useQuickConnect();
  const approvedHandovers = handovers.filter((item) => item.status === "Approved" && item.to === id);
  const questions = approvedHandovers.flatMap((handover) =>
    handover.knowledge.map((item) => ({ ...item, handoverId: handover.id, project: handover.project })),
  );
  const log = answers.filter((item) => approvedHandovers.some((handover) => handover.id === item.handoverId));
  const nextQuestion = questions.find((item) =>
    !answers.some((entry) => entry.personId === id && entry.handoverId === item.handoverId && entry.question === item.question),
  );
  const done = questions.length > 0 && !nextQuestion;
  const submit = () => {
    if (!nextQuestion || !answer.trim()) return;
    submitAnswer({
      handoverId: nextQuestion.handoverId,
      personId: id,
      question: nextQuestion.question,
      answer: answer.trim(),
    });
    setAnswer("");
  };
  return (
    <>
      <DialogHeader>
        <DialogTitle>Knowledge verification</DialogTitle>
        <DialogDescription>Questions for {p.name} are drawn from approved handover data.</DialogDescription>
      </DialogHeader>
      <div className="space-y-3">
        {log.map((l, k) => (
          <div key={l.id} className="space-y-2">
            <div className="flex gap-2"><AiAvatar size={28} /><p className="rounded-2xl bg-muted px-3 py-2 text-sm">{l.question}</p></div>
            <div className="flex justify-end gap-2"><p className="rounded-2xl bg-secondary px-3 py-2 text-sm">{l.answer}</p><Avatar id={id} size={28} /></div>
          </div>
        ))}
        {questions.length === 0 ? (
          <div className="rounded-2xl bg-muted p-4 text-sm">
            <p className="font-semibold">No approved handover is available yet.</p>
            <p className="mt-1 text-muted-foreground">Approve a handover for {p.name} before starting knowledge verification.</p>
            <Button className="mt-3" size="sm" variant="outline" onClick={close}>Close</Button>
          </div>
        ) : !done ? (
          <>
            <div className="flex gap-2"><AiAvatar size={28} /><div className="rounded-2xl bg-muted px-3 py-2 text-sm"><p className="mb-1 text-[11px] text-muted-foreground">{nextQuestion?.project}</p>{nextQuestion?.question}</div></div>
            <Textarea value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Type your answer…" className="rounded-xl" />
            <div className="flex justify-between text-xs text-muted-foreground"><span>Question {log.length + 1} of {questions.length}</span>
              <Button size="sm" disabled={!answer.trim()} onClick={submit}>Submit answer</Button></div>
          </>
        ) : (
          <div className="rounded-2xl bg-success/10 p-4 text-sm">
            <p className="font-semibold text-success">All questions answered</p>
            <p className="mt-1 text-muted-foreground">Answers were sent to the project manager for review.</p>
            <Button className="mt-3" size="sm" onClick={close}>Done</Button>
          </div>
        )}
      </div>
    </>
  );
}

function Notifications() {
  return (
    <>
      <DialogHeader><DialogTitle>Notifications</DialogTitle></DialogHeader>
      <div className="space-y-2">
        {notifications.map((n) => (
          <div key={n.id} className="flex items-start gap-3 rounded-2xl bg-muted p-3">
            <Pill tone={n.tone}>•</Pill>
            <div className="flex-1"><p className="text-sm">{n.text}</p><p className="text-xs text-muted-foreground">{n.when}</p></div>
          </div>
        ))}
      </div>
    </>
  );
}

export { readinessLabel, readinessTone };
