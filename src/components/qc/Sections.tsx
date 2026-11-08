import { useState } from "react";
import { toast } from "sonner";
import { Database, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { people, personById } from "@/lib/data";
import { AiAvatar, Avatar, Bar, Card, Pill, readinessLabel, readinessTone } from "./primitives";
import { useUI } from "./ui-context";
import { useAuth } from "@/lib/auth-store";
import { useQuickConnect } from "@/lib/quick-connect-store";

export function SectionView({ slug }: { slug: string }) {
  const ui = useUI();
  const { user, roleCategory } = useAuth();
  const { projects, sources: knowledgeSources, connectSource, disconnectSource, simulateSourceSync, handovers, activities, verification, answers, approvals, reviews, answerReviews, approveHandover, reviewHandover, resubmitHandover, reviewAnswer } = useQuickConnect();
  const [reviewDrafts, setReviewDrafts] = useState<Record<string, string>>({});
  const [answerReviewDrafts, setAnswerReviewDrafts] = useState<Record<string, string>>({});
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
        <div className="space-y-4">
          <Card className="space-y-1">
            <p className="font-semibold">Knowledge source connections</p>
            <p className="text-sm text-muted-foreground">Manage the sample connections used in this demo. Connect, disconnect, and simulate a refresh without accessing external accounts or services.</p>
          </Card>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {knowledgeSources.map((source) => (
              <Card key={source.name} className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-secondary-foreground"><Database className="h-4 w-4" /></span>
                  <div className="min-w-0 flex-1"><p className="font-semibold">{source.name}</p><p className="text-xs text-muted-foreground">{source.items}</p></div>
                  <Pill tone={source.status === "Synced" ? "success" : source.status === "Analyzing" ? "accent" : source.status === "Disconnected" ? "danger" : "warning"}>{source.status}</Pill>
                </div>
                <div className="text-xs text-muted-foreground">
                  {source.lastSyncedAt
                    ? `Last demo refresh: ${new Date(source.lastSyncedAt).toLocaleString()}`
                    : source.connected ? "No demo refresh recorded yet" : "This sample source is disconnected"}
                </div>
                <div className="flex flex-wrap gap-2">
                  {source.connected ? (
                    <>
                      <Button size="sm" onClick={() => {
                        simulateSourceSync(source.name, user.id);
                        toast.success(`${source.name} demo refresh completed.`);
                      }}>Simulate sync</Button>
                      <Button size="sm" variant="outline" onClick={() => {
                        disconnectSource(source.name, user.id);
                        toast.success(`${source.name} demo source disconnected.`);
                      }}>Disconnect</Button>
                    </>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => {
                      connectSource(source.name, user.id);
                      toast.success(`${source.name} demo source connected.`);
                    }}>Connect source</Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
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
        <div className="space-y-5">
          <section className="space-y-3">
            <div>
              <h3 className="font-semibold">Submitted verification answers</h3>
              <p className="text-sm text-muted-foreground">Review each response, or flag an answer that reveals a knowledge gap. This is a manual demo review, not AI grading.</p>
            </div>
            {answers.length === 0 ? (
              <Card><p className="font-medium">No submitted answers yet</p><p className="mt-1 text-sm text-muted-foreground">Incoming members' responses will appear here after they complete verification questions.</p></Card>
            ) : answers.map((answer) => {
              const handover = handovers.find((item) => item.id === answer.handoverId);
              const latestReview = answerReviews.filter((item) => item.answerId === answer.id).slice(-1)[0];
              const canReview = !latestReview;
              return (
                <Card key={answer.id} className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2"><Avatar id={answer.personId} size={34} /><div><p className="text-sm font-semibold">{personById(answer.personId).name}</p><p className="text-xs text-muted-foreground">{handover?.project ?? "Project handover"} · Submitted {new Date(answer.submittedAt).toLocaleString()}</p></div></div>
                    {latestReview ? (
                      <Pill tone={latestReview.action === "knowledge_gap" ? "warning" : "success"}>{latestReview.action === "knowledge_gap" ? "Knowledge gap flagged" : "Reviewed"}</Pill>
                    ) : <Pill tone="accent">Needs review</Pill>}
                  </div>
                  <div className="space-y-1"><p className="text-xs font-medium text-muted-foreground">Question</p><p className="text-sm">{answer.question}</p></div>
                  <div className="space-y-1 rounded-xl bg-muted p-3"><p className="text-xs font-medium text-muted-foreground">Incoming member's answer</p><p className="text-sm">{answer.answer}</p></div>
                  {latestReview ? (
                    <div className="rounded-xl border border-border p-3 text-sm">
                      <p className="font-medium">{latestReview.action === "knowledge_gap" ? "Manager feedback — knowledge gap" : "Manager review complete"}</p>
                      {latestReview.comment && <p className="mt-1 text-muted-foreground">{latestReview.comment}</p>}
                      <p className="mt-2 text-xs text-muted-foreground">Reviewed by {personById(latestReview.reviewerId).name} · {new Date(latestReview.reviewedAt).toLocaleString()}</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Textarea
                        rows={2}
                        value={answerReviewDrafts[answer.id] ?? ""}
                        onChange={(event) => setAnswerReviewDrafts((current) => ({ ...current, [answer.id]: event.target.value }))}
                        placeholder="Optional feedback for the incoming member. Required when flagging a knowledge gap."
                      />
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" onClick={() => {
                          reviewAnswer(answer.id, user.id, "reviewed", answerReviewDrafts[answer.id] ?? "");
                          setAnswerReviewDrafts((current) => ({ ...current, [answer.id]: "" }));
                        }}>Mark reviewed</Button>
                        <Button size="sm" disabled={!(answerReviewDrafts[answer.id] ?? "").trim()} onClick={() => {
                          reviewAnswer(answer.id, user.id, "knowledge_gap", answerReviewDrafts[answer.id] ?? "");
                          setAnswerReviewDrafts((current) => ({ ...current, [answer.id]: "" }));
                        }}>Flag knowledge gap</Button>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </section>
          <section className="space-y-3">
            <h3 className="font-semibold">Sample readiness indicators</h3>
            {verification.map((v) => (
              <Card key={v.who} className="flex items-center gap-4">
                <Avatar id={v.who} size={44} />
                <div className="min-w-0 flex-1"><div className="mb-1.5 flex justify-between text-sm"><b>{personById(v.who).name}</b><span>{v.readiness}%</span></div><Bar value={v.readiness} color={"var(--" + readinessTone(v.readiness) + ")"} /></div>
                <Pill tone={readinessTone(v.readiness)}>{readinessLabel(v.readiness)}</Pill>
                <Button size="sm" variant="outline" onClick={() => ui.openVerify(v.who)}>Ask questions</Button>
              </Card>
            ))}
          </section>
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
