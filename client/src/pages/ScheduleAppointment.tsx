import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Calendar, Clock, User, Mail, Phone, Video, CheckCircle, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { ProviderAvailability } from "@shared/schema";

type BookingStep = "select-slot" | "patient-info" | "confirmation";

interface PatientInfo {
  name: string;
  email: string;
  phone: string;
}

export default function ScheduleAppointment() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<BookingStep>("select-slot");
  const [selectedSlot, setSelectedSlot] = useState<ProviderAvailability | null>(null);
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({ name: "", email: "", phone: "" });
  const [bookedAppointment, setBookedAppointment] = useState<{ id: number; scheduledAt: string; doctorName: string } | null>(null);

  const { data: availableSlots, isLoading } = useQuery<ProviderAvailability[]>({
    queryKey: ["/api/availability"],
  });

  const bookAppointmentMutation = useMutation({
    mutationFn: async (data: { availabilityId: number; patientName: string; patientEmail: string; patientPhone?: string }) => {
      const response = await apiRequest("POST", "/api/availability/book", data);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/availability"] });
      setBookedAppointment({
        id: data.id,
        scheduledAt: data.scheduledAt,
        doctorName: selectedSlot?.doctorName || "",
      });
      setCurrentStep("confirmation");
      toast({
        title: "Appointment Booked",
        description: "Your telehealth consultation has been scheduled successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Booking Failed",
        description: "Unable to book this time slot. It may no longer be available.",
        variant: "destructive",
      });
    },
  });

  const availableSlotsOnly = availableSlots?.filter((slot) => slot.status === "available") || [];

  const groupedByDate: Record<string, ProviderAvailability[]> = {};
  availableSlotsOnly.forEach((slot) => {
    const dateKey = format(new Date(slot.startAt), "yyyy-MM-dd");
    if (!groupedByDate[dateKey]) {
      groupedByDate[dateKey] = [];
    }
    groupedByDate[dateKey].push(slot);
  });

  const handleSlotSelect = (slot: ProviderAvailability) => {
    setSelectedSlot(slot);
    setCurrentStep("patient-info");
  };

  const handlePatientInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;
    if (!patientInfo.name.trim() || !patientInfo.email.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your name and email.",
        variant: "destructive",
      });
      return;
    }
    bookAppointmentMutation.mutate({
      availabilityId: selectedSlot.id,
      patientName: patientInfo.name.trim(),
      patientEmail: patientInfo.email.trim().toLowerCase(),
      patientPhone: patientInfo.phone.trim() || undefined,
    });
  };

  const handleBack = () => {
    if (currentStep === "patient-info") {
      setCurrentStep("select-slot");
      setSelectedSlot(null);
    }
  };

  return (
    <div className="pt-24 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Schedule Your Consultation
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Book a video consultation with one of our licensed healthcare providers.
              Select an available time slot that works for you.
            </p>
          </motion.div>

          {currentStep === "select-slot" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Available Time Slots
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-20 w-full" />
                      ))}
                    </div>
                  ) : Object.keys(groupedByDate).length > 0 ? (
                    <div className="space-y-6">
                      {Object.entries(groupedByDate)
                        .sort(([a], [b]) => a.localeCompare(b))
                        .map(([dateKey, slots]) => (
                          <div key={dateKey}>
                            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-primary" />
                              {format(new Date(dateKey), "EEEE, MMMM d, yyyy")}
                            </h3>
                            <div className="grid gap-3 sm:grid-cols-2">
                              {slots
                                .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())
                                .map((slot) => (
                                  <Button
                                    key={slot.id}
                                    variant="outline"
                                    className="h-auto p-4 flex flex-col items-start text-left justify-start"
                                    onClick={() => handleSlotSelect(slot)}
                                    data-testid={`button-slot-${slot.id}`}
                                  >
                                    <div className="flex items-center gap-2 mb-1">
                                      <Clock className="h-4 w-4 text-primary" />
                                      <span className="font-semibold">
                                        {format(new Date(slot.startAt), "h:mm a")} - {format(new Date(slot.endAt), "h:mm a")}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                      <User className="h-3 w-3" />
                                      <span>{slot.doctorName}</span>
                                    </div>
                                  </Button>
                                ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="mb-4">No available time slots at the moment.</p>
                      <p className="text-sm">Please check back later or contact us directly.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentStep === "patient-info" && selectedSlot && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Button
                variant="ghost"
                onClick={handleBack}
                className="mb-4"
                data-testid="button-back"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Time Slots
              </Button>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Your Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <h4 className="font-semibold mb-2">Selected Appointment</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        {format(new Date(selectedSlot.startAt), "EEEE, MMMM d, yyyy")}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        {format(new Date(selectedSlot.startAt), "h:mm a")} - {format(new Date(selectedSlot.endAt), "h:mm a")}
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        {selectedSlot.doctorName}
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handlePatientInfoSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="patient-name">Full Name *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="patient-name"
                          value={patientInfo.name}
                          onChange={(e) => setPatientInfo({ ...patientInfo, name: e.target.value })}
                          placeholder="John Doe"
                          className="pl-10"
                          required
                          data-testid="input-patient-name"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="patient-email">Email Address *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="patient-email"
                          type="email"
                          value={patientInfo.email}
                          onChange={(e) => setPatientInfo({ ...patientInfo, email: e.target.value })}
                          placeholder="john@example.com"
                          className="pl-10"
                          required
                          data-testid="input-patient-email"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        You'll use this email to view your appointment details.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="patient-phone">Phone Number (optional)</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="patient-phone"
                          type="tel"
                          value={patientInfo.phone}
                          onChange={(e) => setPatientInfo({ ...patientInfo, phone: e.target.value })}
                          placeholder="(555) 123-4567"
                          className="pl-10"
                          data-testid="input-patient-phone"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={bookAppointmentMutation.isPending}
                      data-testid="button-confirm-booking"
                    >
                      {bookAppointmentMutation.isPending ? "Booking..." : "Confirm Appointment"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentStep === "confirmation" && bookedAppointment && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="text-center">
                <CardContent className="pt-8 pb-8">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-2xl font-display font-bold mb-2">Appointment Confirmed!</h2>
                    <p className="text-muted-foreground">
                      Your telehealth consultation has been scheduled successfully.
                    </p>
                  </div>

                  <div className="max-w-sm mx-auto p-4 bg-muted/30 rounded-lg mb-6">
                    <div className="space-y-3 text-left">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-primary" />
                        <span>{format(new Date(bookedAppointment.scheduledAt), "EEEE, MMMM d, yyyy")}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-primary" />
                        <span>{format(new Date(bookedAppointment.scheduledAt), "h:mm a")}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-primary" />
                        <span>{bookedAppointment.doctorName}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Video className="h-5 w-5 text-primary" />
                        <Badge variant="secondary">Video Consultation</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      You can view your appointment details anytime using your email address.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Link href="/my-appointments">
                        <Button data-testid="button-view-appointments">
                          View My Appointments
                        </Button>
                      </Link>
                      <Link href="/">
                        <Button variant="outline" data-testid="button-back-home">
                          Back to Home
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
    </div>
  );
}
