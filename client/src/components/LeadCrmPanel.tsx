import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Lead } from "@shared/schema";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Clock, MessageSquare, FileSignature, Calendar, Tag, CheckCircle,
  Plus, X, ListTodo, StickyNote, Activity, User, Trash2, CircleDot,
  Phone, Mail, Pill, Send, AlertCircle, Video
} from "lucide-react";

interface LeadCrmPanelProps {
  lead: Lead;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUserName: string;
}

const activityIcons: Record<string, any> = {
  status_change: CircleDot,
  prescription_created: FileSignature,
  appointment_scheduled: Video,
  sms_sent: Send,
  note_added: StickyNote,
  tag_added: Tag,
  task_created: ListTodo,
  task_completed: CheckCircle,
  appointment: Calendar,
  prescription: Pill,
  note: StickyNote,
};

const activityColors: Record<string, string> = {
  status_change: "text-blue-500",
  prescription_created: "text-green-500",
  appointment_scheduled: "text-purple-500",
  sms_sent: "text-orange-500",
  note_added: "text-yellow-500",
  tag_added: "text-cyan-500",
  task_created: "text-indigo-500",
  task_completed: "text-green-600",
  appointment: "text-purple-500",
  prescription: "text-green-500",
  note: "text-yellow-500",
};

const SUGGESTED_TAGS = ["VIP", "Follow-up Needed", "Insurance", "Priority", "New Patient", "Returning", "Urgent"];

export function LeadCrmPanel({ lead, open, onOpenChange, currentUserName }: LeadCrmPanelProps) {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState<"timeline" | "notes" | "tags" | "tasks">("timeline");
  const [newNote, setNewNote] = useState("");
  const [newTag, setNewTag] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDue, setNewTaskDue] = useState("");
  const [newTaskAssignee, setNewTaskAssignee] = useState("");
  const [leadSource, setLeadSource] = useState(lead.leadSource || "");
  const [editingSource, setEditingSource] = useState(false);

  const timelineQuery = useQuery({
    queryKey: ["/api/leads", lead.id, "timeline"],
    queryFn: async () => {
      const res = await fetch(`/api/leads/${lead.id}/timeline`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });
      if (!res.ok) throw new Error("Failed to fetch timeline");
      return res.json();
    },
    enabled: open,
  });

  const tagsQuery = useQuery({
    queryKey: ["/api/leads", lead.id, "tags"],
    queryFn: async () => {
      const res = await fetch(`/api/leads/${lead.id}/tags`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });
      if (!res.ok) throw new Error("Failed to fetch tags");
      return res.json();
    },
    enabled: open,
  });

  const tasksQuery = useQuery({
    queryKey: ["/api/leads", lead.id, "tasks"],
    queryFn: async () => {
      const res = await fetch(`/api/leads/${lead.id}/tasks`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });
      if (!res.ok) throw new Error("Failed to fetch tasks");
      return res.json();
    },
    enabled: open,
  });

  const notesQuery = useQuery({
    queryKey: ["/api/leads", lead.id, "notes"],
    queryFn: async () => {
      const res = await fetch(`/api/leads/${lead.id}/notes`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });
      if (!res.ok) throw new Error("Failed to fetch notes");
      return res.json();
    },
    enabled: open,
  });

  const addNoteMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await fetch(`/api/leads/${lead.id}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify({ content, authorName: currentUserName }),
      });
      if (!res.ok) throw new Error("Failed to add note");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads", lead.id, "notes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/leads", lead.id, "timeline"] });
      setNewNote("");
      toast({ title: "Note added" });
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: async (noteId: number) => {
      const res = await fetch(`/api/leads/${lead.id}/notes/${noteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });
      if (!res.ok) throw new Error("Failed to delete note");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads", lead.id, "notes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/leads", lead.id, "timeline"] });
      toast({ title: "Note deleted" });
    },
  });

  const addTagMutation = useMutation({
    mutationFn: async (tag: string) => {
      const res = await fetch(`/api/leads/${lead.id}/tags`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify({ tag }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add tag");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads", lead.id, "tags"] });
      queryClient.invalidateQueries({ queryKey: ["/api/leads", lead.id, "timeline"] });
      setNewTag("");
      toast({ title: "Tag added" });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const deleteTagMutation = useMutation({
    mutationFn: async (tagId: number) => {
      const res = await fetch(`/api/leads/${lead.id}/tags/${tagId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });
      if (!res.ok) throw new Error("Failed to delete tag");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads", lead.id, "tags"] });
      toast({ title: "Tag removed" });
    },
  });

  const addTaskMutation = useMutation({
    mutationFn: async (data: { title: string; dueAt?: string; assignedTo?: string }) => {
      const res = await fetch(`/api/leads/${lead.id}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify({ ...data, createdBy: currentUserName }),
      });
      if (!res.ok) throw new Error("Failed to create task");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads", lead.id, "tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/leads", lead.id, "timeline"] });
      setNewTaskTitle("");
      setNewTaskDue("");
      setNewTaskAssignee("");
      toast({ title: "Task created" });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ taskId, ...updates }: { taskId: number; status?: string }) => {
      const res = await fetch(`/api/leads/${lead.id}/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update task");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads", lead.id, "tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/leads", lead.id, "timeline"] });
      toast({ title: "Task updated" });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: number) => {
      const res = await fetch(`/api/leads/${lead.id}/tasks/${taskId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });
      if (!res.ok) throw new Error("Failed to delete task");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads", lead.id, "tasks"] });
      toast({ title: "Task deleted" });
    },
  });

  const updateLeadSourceMutation = useMutation({
    mutationFn: async (source: string) => {
      const res = await fetch(`/api/leads/${lead.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify({ leadSource: source || null }),
      });
      if (!res.ok) throw new Error("Failed to update lead source");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
      setEditingSource(false);
      toast({ title: "Lead source updated" });
    },
  });

  const tags = tagsQuery.data || [];
  const tasks = tasksQuery.data || [];
  const notes = notesQuery.data || [];
  const timeline = timelineQuery.data || [];
  const pendingTasks = tasks.filter((t: any) => t.status === "pending");
  const completedTasks = tasks.filter((t: any) => t.status === "completed");

  const sectionButtons = [
    { key: "timeline" as const, label: "Timeline", icon: Activity, count: timeline.length },
    { key: "notes" as const, label: "Notes", icon: StickyNote, count: notes.length },
    { key: "tags" as const, label: "Tags", icon: Tag, count: tags.length },
    { key: "tasks" as const, label: "Tasks", icon: ListTodo, count: pendingTasks.length },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto" data-testid="dialog-crm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {lead.name} - CRM
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-3 items-center text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              {lead.email}
            </div>
            {lead.phone && (
              <div className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                {lead.phone}
              </div>
            )}
            {lead.medicationInterest && (
              <div className="flex items-center gap-1">
                <Pill className="h-4 w-4" />
                {lead.medicationInterest}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {tags.map((tag: any) => (
              <Badge key={tag.id} variant="secondary" data-testid={`badge-crm-tag-${tag.id}`}>
                {tag.tag}
                <button
                  onClick={() => deleteTagMutation.mutate(tag.id)}
                  className="ml-1 hover:text-destructive"
                  data-testid={`button-remove-tag-${tag.id}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground font-medium">Source:</span>
            {editingSource ? (
              <div className="flex items-center gap-2">
                <Select value={leadSource} onValueChange={setLeadSource}>
                  <SelectTrigger className="w-[180px]" data-testid="select-lead-source">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                    <SelectItem value="google">Google Ads</SelectItem>
                    <SelectItem value="social">Social Media</SelectItem>
                    <SelectItem value="phone">Phone Call</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <Button size="sm" onClick={() => updateLeadSourceMutation.mutate(leadSource)} data-testid="button-save-source">
                  Save
                </Button>
                <Button size="sm" variant="ghost" onClick={() => { setEditingSource(false); setLeadSource(lead.leadSource || ""); }}>
                  Cancel
                </Button>
              </div>
            ) : (
              <button onClick={() => setEditingSource(true)} className="text-primary hover:underline" data-testid="button-edit-source">
                {lead.leadSource || "Not set - click to add"}
              </button>
            )}
          </div>

          <div className="flex gap-1 border-b">
            {sectionButtons.map((btn) => (
              <Button
                key={btn.key}
                variant={activeSection === btn.key ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveSection(btn.key)}
                data-testid={`button-crm-section-${btn.key}`}
              >
                <btn.icon className="h-4 w-4 mr-1" />
                {btn.label}
                {btn.count > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs">{btn.count}</Badge>
                )}
              </Button>
            ))}
          </div>

          {activeSection === "timeline" && (
            <div className="space-y-3" data-testid="section-timeline">
              {timelineQuery.isLoading && <p className="text-sm text-muted-foreground">Loading timeline...</p>}
              {timeline.length === 0 && !timelineQuery.isLoading && (
                <p className="text-sm text-muted-foreground text-center py-4">No activity yet</p>
              )}
              {timeline.map((item: any, idx: number) => {
                const IconComp = activityIcons[item.type] || Activity;
                const colorClass = activityColors[item.type] || "text-muted-foreground";
                return (
                  <div key={`${item.id}-${idx}`} className="flex gap-3 items-start" data-testid={`timeline-item-${idx}`}>
                    <div className={`mt-1 ${colorClass}`}>
                      <IconComp className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{item.summary}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        <Clock className="h-3 w-3" />
                        {format(new Date(item.createdAt), "MMM d, yyyy 'at' h:mm a")}
                        {item.authorName && (
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {item.authorName}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeSection === "notes" && (
            <div className="space-y-3" data-testid="section-notes">
              <div className="flex gap-2">
                <Textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add an internal note..."
                  className="min-h-[60px]"
                  data-testid="input-crm-note"
                />
              </div>
              <Button
                size="sm"
                onClick={() => newNote.trim() && addNoteMutation.mutate(newNote.trim())}
                disabled={!newNote.trim() || addNoteMutation.isPending}
                data-testid="button-add-note"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Note
              </Button>

              {notesQuery.isLoading && <p className="text-sm text-muted-foreground">Loading notes...</p>}
              {notes.length === 0 && !notesQuery.isLoading && (
                <p className="text-sm text-muted-foreground text-center py-4">No notes yet</p>
              )}
              {notes.map((note: any) => (
                <Card key={note.id} data-testid={`note-card-${note.id}`}>
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                          <User className="h-3 w-3" />
                          {note.authorName}
                          <Clock className="h-3 w-3 ml-1" />
                          {format(new Date(note.createdAt), "MMM d, yyyy 'at' h:mm a")}
                        </div>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteNoteMutation.mutate(note.id)}
                        data-testid={`button-delete-note-${note.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeSection === "tags" && (
            <div className="space-y-3" data-testid="section-tags">
              <div className="flex gap-2 items-center">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag..."
                  className="max-w-[200px]"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newTag.trim()) {
                      addTagMutation.mutate(newTag.trim());
                    }
                  }}
                  data-testid="input-crm-tag"
                />
                <Button
                  size="sm"
                  onClick={() => newTag.trim() && addTagMutation.mutate(newTag.trim())}
                  disabled={!newTag.trim() || addTagMutation.isPending}
                  data-testid="button-add-tag"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-2">Quick add:</p>
                <div className="flex gap-1 flex-wrap">
                  {SUGGESTED_TAGS.filter(st => !tags.some((t: any) => t.tag.toLowerCase() === st.toLowerCase())).map((st) => (
                    <Button
                      key={st}
                      variant="outline"
                      size="sm"
                      onClick={() => addTagMutation.mutate(st)}
                      data-testid={`button-quick-tag-${st.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      {st}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {tags.length === 0 && !tagsQuery.isLoading && (
                  <p className="text-sm text-muted-foreground">No tags yet</p>
                )}
                {tags.map((tag: any) => (
                  <Badge key={tag.id} variant="secondary" className="text-sm" data-testid={`crm-tag-${tag.id}`}>
                    <Tag className="h-3 w-3 mr-1" />
                    {tag.tag}
                    <button
                      onClick={() => deleteTagMutation.mutate(tag.id)}
                      className="ml-2 hover:text-destructive"
                      data-testid={`button-delete-tag-${tag.id}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {activeSection === "tasks" && (
            <div className="space-y-4" data-testid="section-tasks">
              <Card>
                <CardContent className="p-3 space-y-2">
                  <Input
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Task title..."
                    data-testid="input-task-title"
                  />
                  <div className="flex gap-2 flex-wrap">
                    <Input
                      type="date"
                      value={newTaskDue}
                      onChange={(e) => setNewTaskDue(e.target.value)}
                      className="w-[160px]"
                      data-testid="input-task-due"
                    />
                    <Input
                      value={newTaskAssignee}
                      onChange={(e) => setNewTaskAssignee(e.target.value)}
                      placeholder="Assign to..."
                      className="w-[160px]"
                      data-testid="input-task-assignee"
                    />
                    <Button
                      size="sm"
                      onClick={() => {
                        if (newTaskTitle.trim()) {
                          addTaskMutation.mutate({
                            title: newTaskTitle.trim(),
                            dueAt: newTaskDue || undefined,
                            assignedTo: newTaskAssignee || undefined,
                          });
                        }
                      }}
                      disabled={!newTaskTitle.trim() || addTaskMutation.isPending}
                      data-testid="button-add-task"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Task
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {pendingTasks.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                    Pending ({pendingTasks.length})
                  </h4>
                  <div className="space-y-2">
                    {pendingTasks.map((task: any) => (
                      <Card key={task.id} data-testid={`task-card-${task.id}`}>
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium">{task.title}</p>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1 flex-wrap">
                                {task.dueAt && (
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    Due: {format(new Date(task.dueAt), "MMM d, yyyy")}
                                  </span>
                                )}
                                {task.assignedTo && (
                                  <span className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    {task.assignedTo}
                                  </span>
                                )}
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  Created by {task.createdBy}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateTaskMutation.mutate({ taskId: task.id, status: "completed" })}
                                data-testid={`button-complete-task-${task.id}`}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Done
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => deleteTaskMutation.mutate(task.id)}
                                data-testid={`button-delete-task-${task.id}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {completedTasks.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Completed ({completedTasks.length})
                  </h4>
                  <div className="space-y-2">
                    {completedTasks.map((task: any) => (
                      <Card key={task.id} className="opacity-60" data-testid={`task-card-completed-${task.id}`}>
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm line-through">{task.title}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                {task.completedAt && (
                                  <span>Completed {format(new Date(task.completedAt), "MMM d")}</span>
                                )}
                              </div>
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => deleteTaskMutation.mutate(task.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {tasks.length === 0 && !tasksQuery.isLoading && (
                <p className="text-sm text-muted-foreground text-center py-4">No tasks yet</p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
