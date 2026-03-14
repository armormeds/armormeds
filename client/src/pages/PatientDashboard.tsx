import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Heart, LogOut, User, Pill, Calendar, ClipboardList, Video,
  CheckCircle, Clock, AlertCircle, XCircle, CreditCard,
  FileText, Activity, Phone, Shield, ChevronRight, Package,
  Truck, MapPin, ExternalLink,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { clearPatientSession, getPatientToken, getPatientUser } from "./PatientPortal";

const STEPS = [
  { label: "Intake Submitted", icon: FileText },
  { label: "Payment", icon: CreditCard },
  { label: "Provider Review", icon: User },
  { label: "Prescription Ready", icon: Pill },
];

function getStepsDone(intakeStatus: string, paymentStatus: string, prescriptionStatus: string) {
  return [
    true,
    paymentStatus === "paid",
    ["approved", "completed"].includes(intakeStatus),
    prescriptionStatus === "ready",
  ];
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string; icon: any }> = {
    new: { label: "Intake Received", cls: "bg-blue-100 text-blue-700 border-blue-200", icon: CheckCircle },
    "in-review": { label: "Under Review", cls: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: Clock },
    approved: { label: "Approved", cls: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle },
    completed: { label: "Completed", cls: "bg-purple-100 text-purple-700 border-purple-200", icon: CheckCircle },
    cancelled: { label: "Cancelled", cls: "bg-red-100 text-red-700 border-red-200", icon: XCircle },
    pending: { label: "Pending", cls: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: Clock },
    paid: { label: "Paid", cls: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle },
    refunded: { label: "Refunded", cls: "bg-gray-100 text-gray-600 border-gray-200", icon: AlertCircle },
    ready: { label: "Ready", cls: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle },
    scheduled: { label: "Scheduled", cls: "bg-blue-100 text-blue-700 border-blue-200", icon: Calendar },
    "in-progress": { label: "In Progress", cls: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: Activity },
    "no-show": { label: "No Show", cls: "bg-red-100 text-red-700 border-red-200", icon: XCircle },
  };
  const c = map[status] || { label: status, cls: "bg-gray-100 text-gray-600 border-gray-200", icon: AlertCircle };
  const Icon = c.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${c.cls}`}>
      <Icon className="w-3 h-3" /> {c.label}
    </span>
  );
}

export default function PatientDashboard() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [showProfile, setShowProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: "", phone: "", currentPassword: "", newPassword: "" });

  const token = getPatientToken();
  const cachedUser = getPatientUser();

  // Redirect if not logged in
  useEffect(() => {
    if (!token) navigate("/patient");
  }, [token, navigate]);

  // Fetch patient profile
  const { data: profile } = useQuery<any>({
    queryKey: ["/api/patient/me"],
    queryFn: async () => {
      const res = await fetch("/api/patient/me", { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) { clearPatientSession(); navigate("/patient"); throw new Error("Session expired"); }
      return res.json();
    },
    enabled: !!token,
  });

  // Fetch shipments
  const { data: shipments = [] } = useQuery<any[]>({
    queryKey: ["/api/patient/shipments"],
    queryFn: async () => {
      const res = await fetch("/api/patient/shipments", { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!token,
  });

  // Fetch dashboard data
  const { data: dashboard, isLoading } = useQuery<any>({
    queryKey: ["/api/patient/dashboard"],
    queryFn: async () => {
      const res = await fetch("/api/patient/dashboard", { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error("Failed to load dashboard");
      return res.json();
    },
    enabled: !!token,
  });

  const profileMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/patient/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Update failed");
      return json;
    },
    onSuccess: () => {
      toast({ title: "Profile updated successfully" });
      qc.invalidateQueries({ queryKey: ["/api/patient/me"] });
      setShowProfile(false);
    },
    onError: (e: any) => toast({ title: e.message, variant: "destructive" }),
  });

  const handleLogout = async () => {
    await fetch("/api/patient/logout", { method: "POST", headers: { Authorization: `Bearer ${token}` } });
    clearPatientSession();
    navigate("/patient");
  };

  const user = profile || cachedUser;
  const stepsDone = dashboard?.order ? getStepsDone(dashboard.order.status, dashboard.order.paymentStatus, dashboard.order.prescriptionStatus) : [false, false, false, false];

  const handleProfileSave = () => {
    const payload: any = {};
    if (profileForm.name) payload.name = profileForm.name;
    if (profileForm.phone !== undefined) payload.phone = profileForm.phone;
    if (profileForm.newPassword) {
      payload.currentPassword = profileForm.currentPassword;
      payload.newPassword = profileForm.newPassword;
    }
    profileMutation.mutate(payload);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="bg-primary p-1.5 rounded-lg">
              <Heart className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight">
              Armor<span className="text-primary">Meds</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            {user && (
              <button
                onClick={() => { setShowProfile(true); setProfileForm({ name: user.name || "", phone: user.phone || "", currentPassword: "", newPassword: "" }); }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                data-testid="button-open-profile"
              >
                {user.avatar ? (
                  <img src={user.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-semibold text-primary">{user.name?.[0]?.toUpperCase()}</span>
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700 hidden sm:block">{user.name}</span>
              </button>
            )}
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-500 hover:text-gray-700" data-testid="button-logout">
              <LogOut className="w-4 h-4 mr-1.5" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name?.split(" ")[0] || "there"} 👋</h1>
          <p className="text-gray-500 text-sm mt-1">Here's a full overview of your health journey with ArmorMeds.</p>
        </motion.div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse" />)}
          </div>
        ) : (
          <Tabs defaultValue="overview" className="space-y-5">
            <TabsList className="bg-white border border-gray-200 rounded-xl p-1 h-auto flex-wrap">
              <TabsTrigger value="overview" className="rounded-lg text-sm" data-testid="tab-overview">Overview</TabsTrigger>
              <TabsTrigger value="prescriptions" className="rounded-lg text-sm" data-testid="tab-prescriptions">
                Prescriptions {dashboard?.prescriptions?.length > 0 && <Badge variant="secondary" className="ml-1.5 text-xs">{dashboard.prescriptions.length}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="appointments" className="rounded-lg text-sm" data-testid="tab-appointments">
                Appointments {dashboard?.appointments?.length > 0 && <Badge variant="secondary" className="ml-1.5 text-xs">{dashboard.appointments.length}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="shipments" className="rounded-lg text-sm" data-testid="tab-shipments">
                Shipments {shipments.length > 0 && <Badge variant="secondary" className="ml-1.5 text-xs">{shipments.length}</Badge>}
              </TabsTrigger>
            </TabsList>

            {/* OVERVIEW TAB */}
            <TabsContent value="overview" className="space-y-5">
              {!dashboard?.hasIntake ? (
                <Card className="border-0 shadow-md">
                  <CardContent className="pt-12 pb-12 text-center">
                    <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-700 mb-1">No intake form yet</h3>
                    <p className="text-sm text-gray-400 mb-5">Complete your intake form to get started with treatment</p>
                    <Link href="/get-started">
                      <Button className="rounded-full px-6">
                        Start Your Intake <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* Progress Steps */}
                  <Card className="border-0 shadow-md">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-semibold flex items-center gap-2 text-gray-800">
                        <Activity className="w-4 h-4 text-primary" /> Your Progress
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-start justify-between">
                        {STEPS.map((step, idx) => {
                          const Icon = step.icon;
                          const done = stepsDone[idx];
                          const active = !done && (idx === 0 || stepsDone[idx - 1]);
                          return (
                            <div key={idx} className="flex items-center flex-1">
                              <div className="flex flex-col items-center flex-shrink-0">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${done ? "bg-green-500 border-green-500 text-white" : active ? "bg-primary/10 border-primary text-primary" : "bg-gray-100 border-gray-300 text-gray-400"}`}>
                                  {done ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                                </div>
                                <span className={`text-xs mt-1.5 text-center font-medium max-w-[72px] leading-tight ${done ? "text-green-600" : active ? "text-primary" : "text-gray-400"}`}>
                                  {step.label}
                                </span>
                              </div>
                              {idx < STEPS.length - 1 && (
                                <div className={`flex-1 h-0.5 mx-2 mb-5 ${done ? "bg-green-400" : "bg-gray-200"}`} />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Order Status Card */}
                  <Card className="border-0 shadow-md">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-semibold flex items-center gap-2 text-gray-800">
                        <ClipboardList className="w-4 h-4 text-primary" /> Current Order
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {dashboard.order.medicationInterest && (
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                          <span className="text-sm text-gray-600 flex items-center gap-2"><Pill className="w-4 h-4 text-gray-400" /> Medication</span>
                          <span className="text-sm font-semibold text-gray-800">{dashboard.order.medicationInterest}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600 flex items-center gap-2"><FileText className="w-4 h-4 text-gray-400" /> Intake Status</span>
                        <StatusBadge status={dashboard.order.status} />
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600 flex items-center gap-2"><CreditCard className="w-4 h-4 text-gray-400" /> Payment</span>
                        <StatusBadge status={dashboard.order.paymentStatus} />
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-gray-600 flex items-center gap-2"><Pill className="w-4 h-4 text-gray-400" /> Prescription</span>
                        <StatusBadge status={dashboard.order.prescriptionStatus} />
                      </div>
                      <p className="text-xs text-gray-400 pt-1">
                        Order submitted {new Date(dashboard.order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Quick stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="border-0 shadow-md">
                      <CardContent className="pt-5 pb-5 flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <Pill className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{dashboard.prescriptions?.length || 0}</p>
                          <p className="text-xs text-gray-500">Prescription{dashboard.prescriptions?.length !== 1 ? "s" : ""}</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="border-0 shadow-md">
                      <CardContent className="pt-5 pb-5 flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{dashboard.appointments?.length || 0}</p>
                          <p className="text-xs text-gray-500">Appointment{dashboard.appointments?.length !== 1 ? "s" : ""}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}
            </TabsContent>

            {/* PRESCRIPTIONS TAB */}
            <TabsContent value="prescriptions" className="space-y-4">
              {!dashboard?.prescriptions?.length ? (
                <Card className="border-0 shadow-md">
                  <CardContent className="pt-12 pb-12 text-center">
                    <Pill className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-700 mb-1">No prescriptions yet</h3>
                    <p className="text-sm text-gray-400">Your provider will issue a prescription once your intake is reviewed and approved.</p>
                  </CardContent>
                </Card>
              ) : (
                dashboard.prescriptions.map((rx: any) => (
                  <Card key={rx.id} className="border-0 shadow-md" data-testid={`card-prescription-${rx.id}`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base font-semibold text-gray-900">{rx.medication}</CardTitle>
                          <p className="text-xs text-gray-400 mt-0.5">Rx# {rx.prescriptionNumber}</p>
                        </div>
                        <StatusBadge status={rx.status} />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                        {[["Dosage", rx.dosage], ["Quantity", rx.quantity], ["Refills", rx.refills], ["Provider", rx.providerName]].map(([label, value]) => (
                          <div key={label}>
                            <p className="text-xs text-gray-400">{label}</p>
                            <p className="text-sm font-medium text-gray-800">{value}</p>
                          </div>
                        ))}
                      </div>
                      {rx.instructions && (
                        <div className="bg-blue-50 rounded-lg px-3 py-2.5 mb-2">
                          <p className="text-xs text-blue-600 font-medium mb-0.5">Instructions</p>
                          <p className="text-sm text-blue-800">{rx.instructions}</p>
                        </div>
                      )}
                      <p className="text-xs text-gray-400">
                        Issued {new Date(rx.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* SHIPMENTS TAB */}
            <TabsContent value="shipments" className="space-y-4">
              {!shipments.length ? (
                <Card className="border-0 shadow-md">
                  <CardContent className="pt-12 pb-12 text-center">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-700 mb-1">No shipments yet</h3>
                    <p className="text-sm text-gray-400">Your medication will appear here once it's been shipped by our pharmacy.</p>
                  </CardContent>
                </Card>
              ) : (
                shipments.map((shipment: any) => {
                  const statusConfig: Record<string, { label: string; cls: string; icon: any; dot: string }> = {
                    label_created:  { label: "Label Created",  cls: "bg-gray-100 text-gray-700 border-gray-200",  icon: Package,     dot: "bg-gray-400" },
                    shipped:        { label: "Shipped",        cls: "bg-blue-100 text-blue-700 border-blue-200",  icon: Truck,       dot: "bg-blue-500" },
                    in_transit:     { label: "In Transit",     cls: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: MapPin, dot: "bg-yellow-500" },
                    out_for_delivery: { label: "Out for Delivery", cls: "bg-orange-100 text-orange-700 border-orange-200", icon: Truck, dot: "bg-orange-500" },
                    delivered:      { label: "Delivered",      cls: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle, dot: "bg-green-500" },
                    exception:      { label: "Exception",      cls: "bg-red-100 text-red-700 border-red-200",    icon: AlertCircle, dot: "bg-red-500" },
                  };
                  const sc = statusConfig[shipment.status] || statusConfig.label_created;
                  const StatusIcon = sc.icon;
                  const CARRIER_NAMES: Record<string, string> = { usps: "USPS", ups: "UPS", fedex: "FedEx", dhl: "DHL", amazon: "Amazon" };
                  const carrierLabel = CARRIER_NAMES[shipment.carrier?.toLowerCase()] || shipment.carrier;

                  const TIMELINE_STEPS = [
                    { key: "label_created", label: "Label Created" },
                    { key: "shipped", label: "Shipped" },
                    { key: "in_transit", label: "In Transit" },
                    { key: "out_for_delivery", label: "Out for Delivery" },
                    { key: "delivered", label: "Delivered" },
                  ];
                  const stepKeys = TIMELINE_STEPS.map(s => s.key);
                  const currentIdx = stepKeys.indexOf(shipment.status);

                  return (
                    <Card key={shipment.id} className="border-0 shadow-md" data-testid={`card-shipment-${shipment.id}`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
                              <Truck className="w-4 h-4 text-primary" /> {carrierLabel} Shipment
                            </CardTitle>
                            <p className="text-xs text-gray-400 mt-0.5 font-mono">#{shipment.trackingNumber}</p>
                          </div>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${sc.cls}`}>
                            <StatusIcon className="w-3 h-3" /> {sc.label}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0 space-y-4">
                        {/* Timeline bar */}
                        <div className="flex items-start justify-between">
                          {TIMELINE_STEPS.map((step, idx) => {
                            const done = currentIdx >= idx;
                            const active = currentIdx === idx;
                            return (
                              <div key={step.key} className="flex items-center flex-1">
                                <div className="flex flex-col items-center flex-shrink-0">
                                  <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 text-xs ${done ? "bg-primary border-primary text-white" : "bg-gray-100 border-gray-300 text-gray-400"} ${active ? "ring-2 ring-primary/20" : ""}`}>
                                    {done ? <CheckCircle className="w-3.5 h-3.5" /> : <span className="text-[10px]">{idx + 1}</span>}
                                  </div>
                                  <span className={`text-[10px] mt-1 text-center font-medium max-w-[52px] leading-tight ${done ? "text-primary" : "text-gray-400"}`}>
                                    {step.label}
                                  </span>
                                </div>
                                {idx < TIMELINE_STEPS.length - 1 && (
                                  <div className={`flex-1 h-0.5 mx-1 mb-4 ${done && currentIdx > idx ? "bg-primary" : "bg-gray-200"}`} />
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-xs text-gray-400">Carrier</p>
                            <p className="font-medium text-gray-800">{carrierLabel}</p>
                          </div>
                          {shipment.shippedAt && (
                            <div>
                              <p className="text-xs text-gray-400">Shipped</p>
                              <p className="font-medium text-gray-800">{new Date(shipment.shippedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                            </div>
                          )}
                          {shipment.estimatedDelivery && (
                            <div>
                              <p className="text-xs text-gray-400">Est. Delivery</p>
                              <p className="font-medium text-gray-800">{new Date(shipment.estimatedDelivery).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                            </div>
                          )}
                          {shipment.deliveredAt && (
                            <div>
                              <p className="text-xs text-gray-400">Delivered</p>
                              <p className="font-medium text-green-700 font-semibold">{new Date(shipment.deliveredAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                            </div>
                          )}
                        </div>

                        {shipment.notes && (
                          <div className="bg-gray-50 rounded-lg px-3 py-2.5 text-sm text-gray-600">{shipment.notes}</div>
                        )}

                        {shipment.trackingUrl && (
                          <a
                            href={shipment.trackingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                            data-testid={`link-track-${shipment.id}`}
                          >
                            <ExternalLink className="w-4 h-4" /> Track on {carrierLabel}
                          </a>
                        )}
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </TabsContent>

            {/* APPOINTMENTS TAB */}
            <TabsContent value="appointments" className="space-y-4">
              {!dashboard?.appointments?.length ? (
                <Card className="border-0 shadow-md">
                  <CardContent className="pt-12 pb-12 text-center">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-700 mb-1">No appointments yet</h3>
                    <p className="text-sm text-gray-400 mb-5">Schedule a video consultation with one of our providers.</p>
                    <Link href="/schedule">
                      <Button variant="outline" className="rounded-full px-6">Book Appointment</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                dashboard.appointments.map((appt: any) => (
                  <Card key={appt.id} className="border-0 shadow-md" data-testid={`card-appointment-${appt.id}`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base font-semibold text-gray-900">With {appt.doctorName}</CardTitle>
                          <p className="text-xs text-gray-400 mt-0.5">{appt.reason}</p>
                        </div>
                        <StatusBadge status={appt.status} />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <p className="text-xs text-gray-400">Date</p>
                          <p className="text-sm font-medium text-gray-800">
                            {new Date(appt.scheduledAt).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Time</p>
                          <p className="text-sm font-medium text-gray-800">
                            {new Date(appt.scheduledAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })} · {appt.duration} min
                          </p>
                        </div>
                      </div>
                      {appt.videoLink && !["cancelled", "completed"].includes(appt.status) && (
                        <a
                          href={appt.videoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                          data-testid={`link-join-video-${appt.id}`}
                        >
                          <Video className="w-4 h-4" /> Join Video Call
                        </a>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* Profile Edit Dialog */}
      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><User className="w-5 h-5 text-primary" /> My Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            {/* Avatar / identity */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              {user?.avatar ? (
                <img src={user.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">{user?.name?.[0]?.toUpperCase()}</span>
                </div>
              )}
              <div>
                <p className="font-semibold text-gray-800">{user?.name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">Full Name</Label>
              <Input
                value={profileForm.name}
                onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))}
                placeholder={user?.name}
                data-testid="input-profile-name"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Phone</Label>
              <Input
                value={profileForm.phone}
                onChange={e => setProfileForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="+1 (555) 000-0000"
                data-testid="input-profile-phone"
              />
            </div>

            <div className="border-t border-gray-100 pt-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> Change Password</p>
              <div className="space-y-2">
                <Input
                  type="password"
                  value={profileForm.currentPassword}
                  onChange={e => setProfileForm(f => ({ ...f, currentPassword: e.target.value }))}
                  placeholder="Current password"
                  data-testid="input-current-password"
                />
                <Input
                  type="password"
                  value={profileForm.newPassword}
                  onChange={e => setProfileForm(f => ({ ...f, newPassword: e.target.value }))}
                  placeholder="New password (min. 6 characters)"
                  data-testid="input-new-password"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <Button variant="outline" className="flex-1" onClick={() => setShowProfile(false)}>Cancel</Button>
              <Button
                className="flex-1"
                onClick={handleProfileSave}
                disabled={profileMutation.isPending}
                data-testid="button-save-profile"
              >
                {profileMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
