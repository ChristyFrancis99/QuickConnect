import { useState } from "react";
import { toast } from "sonner";
import { Database, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { people, personById, sources } from "@/lib/data";
import { AiAvatar, Avatar, Bar, Card, Pill, readinessLabel, readinessTone } from "./primitives";
import { useUI } from "./ui-context";
import { useAuth } from "@/lib/auth-store";
import { useQuickConnect } from "@/lib/quick-connect-store";

export function SectionView({ slug }: { slug: string }) {
  const ui = useUI();
  const { user, roleCategory } = useAuth();
  const { projects, handovers, activities, verification, approvals, reviews, approveHandover, reviewHandover, resubmitHandover } = useQuickConnect();
  const [reviewDrafts, setReviewDrafts] = useState<Record<string, string>>({});
  const [editingHandover, setEditingHandover] = useState<string | null>(null);
  const [knowledgeDrafts, setKnowledgeDrafts] = useState<Record<string, { question: string; answer: string }[]>>({});
  const allowedSections: Record<string, string[]> = {
    "Outgoing Member": ["projects", "handovers", "activity"],
    "Incoming Member": ["projects", "verification", "activity"],
    "Project Manager": ["projects", "team", "handovers", "verification", "readiness", "activity"],
    "Organisation Admin": ["projects", "team", "sources", "analysis", "handovers", "verification", "readiness", "activity", "settings"],
  };
  if (!allowedSections[roleCategory]?.includes(slug)) {
    return <Card><p className="font-semibold">This section is not available for your demo role.</p><p className="mt-1 text-sm text-muted-foreground">Switch to a role with access to continue.</p></Card>;
  }

  switch (slug) {
    case "projects":
      return (
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((p) => (
            <Card key={p.id} onClick={() => ui.openProject(p.id)}>
              <div className="mb-2 flex items-center justify-between"><h3 className="font-semibold">{p.name}</h3><Pill tone={p.risk === "high" ? "danger" : p.risk === "medium" ? "warning" : "success"}>{p.risk} risk</Pill></div>
              <p className="mb-4 text-sm text-muted-foreground">{p.description}</p>
              <div className="mb-1.5 flex justify-between text-sm"><span>Progress</span><b>{p.progress}%</b></div>
              <Bar value={p.progress} color={p.color} />
              <div className="mt-4 flex items-center justify-between"><div className="flex -space-x-2">{p.members.map((m) => <Avatar key={m} id={m} size={30} ring />)}</div><span className="text-xs text-muted-foreground">Handover {p.due}</span></div>
            </Card>
          ))}
        </div>
      );
    case "team":
      return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {people.map((p) => (
            <Card key={p.id} onClick={() => ui.openProfile(p.id)} className="flex items-center gap-4">
              <img src={p.avatar} alt={p.name} className="h-14 w-14 shrink-0 rounded-full object-cover shadow-xs" style={{ backgroundColor: p.bgColor }} />
              <div className="min-w-0"><p className="truncate font-semibold">{p.name}</p><p className="text-sm text-muted-foreground">{p.role}</p><Pill tone={p.status === "active" ? "success" : "warning"}>{p.status}</Pill></div>
            </Card>
          ))}
        </div>
      );
    case "sources":
      return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {sources.map((s) => (
            <Card key={s.name}>
              <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-secondary-foreground"><Database className="h-4 w-4" /></span><div className="flex-1"><p className="font-semibold">{s.name}</p><p className="text-xs text-muted-foreground">{s.items}</p></div>
                <Pill tone={s.status === "Synced" ? "success" : s.status === "Analyzing" ? "accent" : "warning"}>{s.status}</Pill></div>
            </Card>
          ))}
        </div>
      );
    case "analysis":
      return (
        <div className="space-y-4">
          {[
            { t: "Refund retry logic lives only in Alex's branch notes, not in docs.", p: "Payment Integration", tone: "danger" as const },
            { t: "Design tokens decision (Oct 12) was agreed in Slack, never recorded.", p: "QuickConnect Website", tone: "warning" as const },
            { t: "Push notification certificates expire 2 Dec; owner unassigned.", p: "Mobile Application", tone: "danger" as const },
            { t: "Embedding pipeline is well documented across 9 pages.", p: "AI Knowledge Engine", tone: "success" as const },
          ].map((f) => (
            <Card key={f.t} className="flex items-start gap-3"><AiAvatar /><div className="flex-1"><p className="text-sm">{f.t}</p><p className="text-xs text-muted-foreground">{f.p}</p></div><Pill tone={f.tone}>{f.tone === "success" ? "Covered" : "Gap"}</Pill></Card>
          ))}
        </div>
      );
    case "handovers":
      return (
        <div className="space-y-3">
          {(roleCategory === "Outgoing Member" || roleCategory === "Organisation Admin") && <Button onClick={ui.openHandover}>Create New Handover</Button>}
          {handovers.filter((h) => roleCategory !== "Outgoing Member" || h.from === user.id).map((h) => (
            <Card key={h.id} className="flex flex-wrap items-center gap-4">
              <FileText className="h-5 w-5 text-primary" />
              <div className="min-w-0 flex-1"><p className="font-semibold">{h.project}</p><p className="text-xs text-muted-foreground">{h.date} {h.month} · {h.time}</p></div>
              <div className="flex items-center gap-2"><Avatar id={h.from} size={30} /><span className="text-muted-foreground">→</span><Avatar id={h.to} size={30} /></div>
              <Pill tone={h.status === "Approved" ? "success" : h.status === "Rejected" ? "danger" : h.status === "Changes requested" ? "warning" : "accent"}>{h.status}</Pill>
              {reviews.filter((review) => review.handoverId === h.id).slice(-1).map((review) => (
                <p key={review.id} className="w-full rounded-lg bg-muted p-2 text-xs text-muted-foreground">
                  Latest feedback: {review.comment} · {personById(review.reviewerId).name}
                </p>
              ))}
              {h.status === "Approved" ? (
                <span className="text-xs text-muted-foreground">Approved by {personById(approvals.find((approval) => approval.handoverId === h.id)?.approvedBy ?? "christy").name}</span>
              ) : (h.status === "Rejected" ? (
                <span className="text-xs text-muted-foreground">Rejected</span>
              ) : (roleCategory === "Project Manager" || roleCategory === "Organisation Admin") ? (
                <div className="w-full space-y-2">
                  <Textarea
                    value={reviewDrafts[h.id] ?? ""}
                    onChange={(event) => setReviewDrafts((current) => ({ ...current, [h.id]: event.target.value }))}
                    placeholder="Add review feedback or explain what needs to change..."
                    rows={2}
                  />
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" onClick={() => { approveHandover(h.id, user.id); setReviewDrafts((current) => ({ ...current, [h.id]: "" })); }}>Approve handover</Button>
                    <Button size="sm" variant="outline" disabled={!(reviewDrafts[h.id] ?? "").trim()} onClick={() => { reviewHandover(h.id, user.id, "changes_requested", reviewDrafts[h.id]); setReviewDrafts((current) => ({ ...current, [h.id]: "" })); }}>Request changes</Button>
                    <Button size="sm" variant="ghost" disabled={!(reviewDrafts[h.id] ?? "").trim()} onClick={() => { reviewHandover(h.id, user.id, "rejected", reviewDrafts[h.id]); setReviewDrafts((current) => ({ ...current, [h.id]: "" })); }}>Reject</Button>
                  </div>
                </div>
              ) : roleCategory === "Outgoing Member" && h.status === "Changes requested" ? (
                <div className="w-full space-y-3">
                  {editingHandover === h.id ? (
                    <>
                      {(knowledgeDrafts[h.id] ?? h.knowledge).map((item, index) => (
                        <div key={index} className="space-y-2 rounded-xl border border-border p-3">
                          <label className="block space-y-1 text-xs font-medium">
                            Knowledge question
                            <Textarea rows={2} value={item.question} onChange={(event) => setKnowledgeDrafts((current) => ({
                              ...current,
                              [h.id]: (current[h.id] ?? h.knowledge).map((entry, itemIndex) => itemIndex === index ? { ...entry, question: event.target.value } : entry),
                            }))} />
                          </label>
                          <label className="block space-y-1 text-xs font-medium">
                            Answer
                            <Textarea rows={3} value={item.answer} onChange={(event) => setKnowledgeDrafts((current) => ({
                              ...current,
                              [h.id]: (current[h.id] ?? h.knowledge).map((entry, itemIndex) => itemIndex === index ? { ...entry, answer: event.target.value } : entry),
                            }))} />
                          </label>
                        </div>
                      ))}
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" disabled={!(knowledgeDrafts[h.id] ?? h.knowledge).some((item) => item.question.trim() && item.answer.trim())} onClick={() => {
                          resubmitHandover(h.id, user.id, knowledgeDrafts[h.id] ?? h.knowledge);
                          setEditingHandover(null);
                          setKnowledgeDrafts((current) => { const next = { ...current }; delete next[h.id]; return next; });
                        }}>Save and resubmit</Button>
                        <Button size="sm" variant="outline" onClick={() => { setEditingHandover(null); setKnowledgeDrafts((current) => { const next = { ...current }; delete next[h.id]; return next; }); }}>Cancel</Button>
                      </div>
                    </>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => {
                      setKnowledgeDrafts((current) => ({ ...current, [h.id]: h.knowledge.map((item) => ({ ...item })) }));
                      setEditingHandover(h.id);
                    }}>Edit and resubmit</Button>
                  )}
                </div>
              ) : <span className="text-xs text-muted-foreground">Awaiting manager review</span>))}
            </Card>
          ))}
        </div>
      );
    case "verification":
      if (roleCategory === "Incoming Member") {
        const myHandovers = handovers.filter((item) => item.status === "Approved" && item.to === user.id);
        const answeredFor = (handoverId: string) => answers.filter((item) => item.personId === user.id && item.handoverId === handoverId).length;
        const totalQuestions = myHandovers.reduce((total, item) => total + item.knowledge.length, 0);
        const totalAnswered = myHandovers.reduce((total, item) => total + answeredFor(item.id), 0);
        return (
          <div className="space-y-4">
            <Card className="space-y-2">
              <div className="flex items-center justify-between gap-3"><div><p className="font-semibold">Your verification progress</p><p className="text-xs text-muted-foreground">Across all approved handovers assigned to you</p></div><b className="text-lg">{totalAnswered}/{totalQuestions}</b></div>
              <Bar value={totalQuestions ? (totalAnswered / totalQuestions) * 100 : 0} />
              <p className="text-xs text-muted-foreground">{totalQuestions ? (Math.round((totalAnswered / totalQuestions) * 100) + "% completed") : "Verification will appear here when a manager approves a handover for you."}</p>
            </Card>
            {myHandovers.length === 0 ? (
              <Card><p className="font-semibold">No approved handovers yet</p><p className="mt-1 text-sm text-muted-foreground">Once a project manager approves a handover addressed to you, its knowledge questions will appear here.</p></Card>
            ) : myHandovers.map((handover) => {
              const completed = answeredFor(handover.id);
              const total = handover.knowledge.length;
              const percent = total ? (completed / total) * 100 : 0;
              return (
                <Card key={handover.id} className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2"><div><p className="font-semibold">{handover.project}</p><p className="text-xs text-muted-foreground">From {personById(handover.from).name} · {handover.date} {handover.month}</p></div><Pill tone={completed === total ? "success" : "accent"}>{completed === total ? "Completed" : "In progress"}</Pill></div>
                  <div className="flex items-center justify-between text-xs"><span className="text-muted-foreground">Questions answered</span><b>{completed}/{total}</b></div>
                  <Bar value={percent} />
                  <div className="flex justify-end"><Button size="sm" variant="outline" onClick={() => ui.openVerify(user.id)}>{completed === total ? "Review answers" : completed > 0 ? "Continue verification" : "Start verification"}</Button></div>
                </Card>
              );
            })}
          </div>
        );
      }
      return (
        <div className="space-y-3">
          {verification.map((v) => (
            <Card key={v.who} className="flex items-center gap-4">
              <Avatar id={v.who} size={44} />
              <div className="min-w-0 flex-1"><div className="mb-1.5 flex justify-between text-sm"><b>{personById(v.who).name}</b><span>{v.readiness}%</span></div><Bar value={v.readiness} color={"var(--" + readinessTone(v.readiness) + ")"} /></div>
              <Pill tone={readinessTone(v.readiness)}>{readinessLabel(v.readiness)}</Pill>
              <Button size="sm" variant="outline" onClick={() => ui.openVerify(v.who)}>Ask questions</Button>
            </Card>
          ))}
        </div>
      );
    case "readiness":
      return (
        <div className="space-y-3">
          {verification.map((v) => (
            <Card key={v.who} className="flex items-center gap-4">
              <Avatar id={v.who} size={44} />
              <div className="min-w-0 flex-1"><div className="mb-1.5 flex justify-between text-sm"><b>{personById(v.who).name}</b><span>{v.readiness}%</span></div><Bar value={v.readiness} color={"var(--" + readinessTone(v.readiness) + ")"} /></div>
              <Pill tone={readinessTone(v.readiness)}>{readinessLabel(v.readiness)}</Pill>
            </Card>
          ))}
        </div>
      );
    case "activity":
      return (
        <div className="space-y-3">
          {activities.map((a) => (
            <Card key={a.id} className="flex items-center gap-3"><Avatar id={a.who} size={38} status /><p className="flex-1 text-sm"><b>{personById(a.who).name}</b> {a.text}</p><span className="text-xs text-muted-foreground">{a.when}</span></Card>
          ))}
        </div>
      );
    case "settings":
      return (
        <Card className="max-w-xl space-y-5">
          {["Email me when a handover is due", "Alert on single-person knowledge risks", "Weekly readiness digest"].map((l, i) => (
            <label key={l} className="flex items-center justify-between gap-4 text-sm">{l}<Switch defaultChecked={i !== 2} onCheckedChange={() => toast.success("Preference saved")} /></label>
          ))}
        </Card>
      );
    default:
      return null;
  }
}
