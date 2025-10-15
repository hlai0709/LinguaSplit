import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTutoringSessionSchema, type TutoringSession } from "@shared/schema";
import { z } from "zod";
import { Plus, Edit2, Trash2, Calendar, Clock, User, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const sessionFormSchema = insertTutoringSessionSchema.extend({
  date: z.string().min(1, "Date is required"),
  topicsCovered: z.string().min(1, "Topics are required"),
});

type SessionFormData = z.infer<typeof sessionFormSchema>;

export default function Tutoring() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<TutoringSession | null>(null);
  const { toast } = useToast();

  const { data: sessions = [], isLoading } = useQuery<TutoringSession[]>({
    queryKey: ["/api/tutoring-sessions"],
  });

  const form = useForm<SessionFormData>({
    resolver: zodResolver(sessionFormSchema),
    defaultValues: {
      weekNumber: 1,
      date: "",
      studentName: "",
      topicsCovered: "",
      notes: "",
      duration: 60,
      status: "scheduled",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: SessionFormData) => {
      const response = await apiRequest("POST", "/api/tutoring-sessions", {
        ...data,
        date: new Date(data.date),
        topicsCovered: data.topicsCovered.split(',').map(t => t.trim()).filter(Boolean),
        notes: data.notes || null,
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tutoring-sessions"] });
      setDialogOpen(false);
      form.reset();
      toast({
        title: "Session Created",
        description: "Tutoring session has been scheduled successfully!",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<SessionFormData> }) => {
      const response = await apiRequest("PATCH", `/api/tutoring-sessions/${id}`, {
        ...data,
        date: data.date ? new Date(data.date) : undefined,
        topicsCovered: data.topicsCovered ? data.topicsCovered.split(',').map(t => t.trim()).filter(Boolean) : undefined,
        notes: data.notes || null,
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tutoring-sessions"] });
      setDialogOpen(false);
      setEditingSession(null);
      form.reset();
      toast({
        title: "Session Updated",
        description: "Tutoring session has been updated successfully!",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/tutoring-sessions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tutoring-sessions"] });
      toast({
        title: "Session Deleted",
        description: "Tutoring session has been removed.",
      });
    },
  });

  const onSubmit = (data: SessionFormData) => {
    if (editingSession) {
      updateMutation.mutate({ id: editingSession.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (session: TutoringSession) => {
    setEditingSession(session);
    form.reset({
      weekNumber: session.weekNumber,
      date: format(new Date(session.date), "yyyy-MM-dd"),
      studentName: session.studentName,
      topicsCovered: session.topicsCovered.join(", "),
      notes: session.notes || "",
      duration: session.duration,
      status: session.status,
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this tutoring session?")) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-success text-success-foreground";
      case "scheduled": return "bg-secondary text-secondary-foreground";
      case "cancelled": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-display font-bold text-foreground mb-2" data-testid="text-tutoring-header">
              Weekly Tutoring Tracker
            </h1>
            <p className="text-lg text-muted-foreground">
              Manage and track your tutoring sessions week by week
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
              setEditingSession(null);
              form.reset();
            }
          }}>
            <DialogTrigger asChild>
              <Button size="lg" data-testid="button-add-session">
                <Plus className="w-5 h-5 mr-2" />
                Add Session
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-display">
                  {editingSession ? "Edit Tutoring Session" : "Schedule New Session"}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="weekNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Week Number</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              value={field.value || ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                field.onChange(val === "" ? "" : parseInt(val) || "");
                              }}
                              data-testid="input-week-number"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} data-testid="input-date" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="studentName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Student Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter student name" data-testid="input-student-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="topicsCovered"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Topics Covered (comma-separated)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Algebra, Geometry, etc." data-testid="input-topics" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration (minutes)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              value={field.value || ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                field.onChange(val === "" ? "" : parseInt(val) || "");
                              }}
                              data-testid="input-duration"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-status">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="scheduled">Scheduled</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes (optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Additional notes or observations..."
                            rows={4}
                            data-testid="textarea-notes"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={createMutation.isPending || updateMutation.isPending}
                      data-testid="button-save-session"
                    >
                      {editingSession ? "Update Session" : "Schedule Session"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setDialogOpen(false);
                        setEditingSession(null);
                        form.reset();
                      }}
                      data-testid="button-cancel"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg text-muted-foreground">Loading sessions...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-2xl border border-border">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-display font-semibold text-foreground mb-2">No Sessions Yet</h3>
            <p className="text-muted-foreground mb-6">Start tracking your tutoring journey by adding your first session</p>
            <Button onClick={() => setDialogOpen(true)} data-testid="button-add-first-session">
              <Plus className="w-5 h-5 mr-2" />
              Add Your First Session
            </Button>
          </div>
        ) : (
          <div className="grid gap-6">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow"
                data-testid={`card-session-${session.id}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-display font-semibold text-foreground">
                        Week {session.weekNumber}
                      </h3>
                      <Badge className={getStatusColor(session.status)}>
                        {session.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(session.date), "PPP")}
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {session.studentName}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {session.duration} minutes
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(session)}
                      data-testid={`button-edit-${session.id}`}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(session.id)}
                      data-testid={`button-delete-${session.id}`}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-sm font-medium text-foreground mb-2">Topics Covered:</p>
                  <div className="flex flex-wrap gap-2">
                    {session.topicsCovered.map((topic, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {session.notes && (
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm font-medium text-foreground mb-1">Notes:</p>
                    <p className="text-sm text-muted-foreground">{session.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
