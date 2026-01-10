import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, isPast, isFuture } from "date-fns";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Video, 
  Calendar, 
  Clock, 
  User, 
  ExternalLink,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus
} from "lucide-react";
import { Link } from "wouter";
import type { Appointment } from "@shared/schema";

function AppointmentStatusBadge({ status }: { status: string }) {
  const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; className: string }> = {
    scheduled: { variant: "default", className: "bg-blue-500" },
    "in-progress": { variant: "secondary", className: "bg-amber-500 text-white" },
    completed: { variant: "secondary", className: "bg-green-500 text-white" },
    cancelled: { variant: "destructive", className: "" },
    "no-show": { variant: "destructive", className: "" },
  };
  
  const config = variants[status] || { variant: "outline" as const, className: "" };
  
  return (
    <Badge variant={config.variant} className={config.className}>
      {status === "in-progress" ? "In Progress" : status === "no-show" ? "No Show" : status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

function AppointmentCard({ appointment }: { appointment: Appointment }) {
  const scheduledDate = new Date(appointment.scheduledAt);
  const isUpcoming = isFuture(scheduledDate);
  const isPastAppointment = isPast(scheduledDate);
  const canJoin = appointment.status === "scheduled" || appointment.status === "in-progress";
  
  return (
    <Card className={`${isPastAppointment && appointment.status === "completed" ? "opacity-75" : ""}`} data-testid={`card-appointment-${appointment.id}`}>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <Video className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{appointment.reason}</h3>
                <p className="text-sm text-muted-foreground">with Dr. {appointment.doctorName}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{format(scheduledDate, "EEEE, MMMM d, yyyy")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{format(scheduledDate, "h:mm a")} ({appointment.duration} min)</span>
              </div>
            </div>
            
            <AppointmentStatusBadge status={appointment.status} />
          </div>
          
          {canJoin && appointment.videoLink && (
            <Button 
              asChild 
              className="md:self-center"
              data-testid={`button-join-call-${appointment.id}`}
            >
              <a href={appointment.videoLink} target="_blank" rel="noopener noreferrer">
                <Video className="h-4 w-4 mr-2" />
                Join Video Call
                <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </Button>
          )}
        </div>
        
        {isUpcoming && appointment.status === "scheduled" && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-md">
            <p className="text-sm text-blue-800 dark:text-blue-200 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Please be ready 5 minutes before your scheduled time. Make sure your camera and microphone are working.
            </p>
          </div>
        )}
        
        {appointment.status === "completed" && (
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/30 rounded-md">
            <p className="text-sm text-green-800 dark:text-green-200 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              This appointment has been completed. If you have any questions, please contact our support team.
            </p>
          </div>
        )}
        
        {(appointment.status === "cancelled" || appointment.status === "no-show") && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/30 rounded-md">
            <p className="text-sm text-red-800 dark:text-red-200 flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              This appointment was {appointment.status === "cancelled" ? "cancelled" : "marked as no-show"}. Please contact us to reschedule.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function MyAppointments() {
  const [searchEmail, setSearchEmail] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  
  const { data: appointments, isLoading, error } = useQuery<Appointment[]>({
    queryKey: ["/api/appointments", "patient", submittedEmail],
    enabled: !!submittedEmail,
    queryFn: async () => {
      const response = await fetch(`/api/appointments/patient/${encodeURIComponent(submittedEmail)}`);
      if (!response.ok) throw new Error("Failed to fetch appointments");
      return response.json();
    },
  });
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchEmail.trim()) {
      setSubmittedEmail(searchEmail.trim().toLowerCase());
    }
  };
  
  const upcomingAppointments = appointments?.filter(a => 
    a.status === "scheduled" || a.status === "in-progress"
  ).sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()) ?? [];
  
  const pastAppointments = appointments?.filter(a => 
    a.status === "completed" || a.status === "cancelled" || a.status === "no-show"
  ).sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()) ?? [];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-bold mb-2">My Appointments</h1>
            <p className="text-muted-foreground">
              View and manage your scheduled video consultations
            </p>
          </div>
          
          {!submittedEmail ? (
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Find Your Appointments
                </CardTitle>
                <CardDescription>
                  Enter the email address you used when booking to view your appointments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={searchEmail}
                      onChange={(e) => setSearchEmail(e.target.value)}
                      required
                      data-testid="input-search-email"
                    />
                  </div>
                  <Button type="submit" className="w-full" data-testid="button-search-appointments">
                    <Search className="h-4 w-4 mr-2" />
                    Find Appointments
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <p className="text-sm text-muted-foreground">
                  Showing appointments for: <span className="font-medium text-foreground">{submittedEmail}</span>
                </p>
                <div className="flex items-center gap-2">
                  <Link href="/schedule">
                    <Button size="sm" data-testid="button-schedule-new">
                      <Plus className="h-4 w-4 mr-2" />
                      Schedule New
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={() => {
                    setSubmittedEmail("");
                    setSearchEmail("");
                  }} data-testid="button-change-email">
                    Change Email
                  </Button>
                </div>
              </div>
              
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <Skeleton key={i} className="h-40 w-full" />
                  ))}
                </div>
              ) : error ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <XCircle className="h-12 w-12 mx-auto mb-4 text-destructive opacity-50" />
                    <p className="text-muted-foreground">Failed to load appointments. Please try again.</p>
                  </CardContent>
                </Card>
              ) : appointments && appointments.length > 0 ? (
                <div className="space-y-8">
                  {upcomingAppointments.length > 0 && (
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        Upcoming Appointments
                      </h2>
                      <div className="space-y-4">
                        {upcomingAppointments.map((appointment) => (
                          <AppointmentCard key={appointment.id} appointment={appointment} />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {pastAppointments.length > 0 && (
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-muted-foreground" />
                        Past Appointments
                      </h2>
                      <div className="space-y-4">
                        {pastAppointments.map((appointment) => (
                          <AppointmentCard key={appointment.id} appointment={appointment} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground mb-4">No appointments found for this email address.</p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Link href="/schedule">
                        <Button data-testid="button-schedule-appointment">
                          <Plus className="h-4 w-4 mr-2" />
                          Schedule Appointment
                        </Button>
                      </Link>
                      <Link href="/get-started">
                        <Button variant="outline" data-testid="button-get-started">
                          Get Started
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
