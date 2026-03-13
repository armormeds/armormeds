import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  Mail,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Pill,
  Calendar,
  Video,
  ChevronRight,
  ArrowLeft,
  User,
  FileText,
  CreditCard,
  Activity,
} from "lucide-react";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: (callback?: (notification: any) => void) => void;
          renderButton: (element: HTMLElement, config: any) => void;
        };
      };
    };
    AppleID?: {
      auth: {
        init: (config: any) => void;
        signIn: () => Promise<any>;
      };
    };
  }
}

interface PatientStatus {
  patient: {
    name: string;
    email: string;
    medicationInterest: string | null;
    createdAt: string;
  };
  status: {
    intake: string;
    payment: string;
    prescription: string;
  };
  prescriptions: Array<{
    id: number;
    medication: string;
    dosage: string;
    quantity: string;
    refills: string;
    instructions: string;
    providerName: string;
    prescriptionNumber: string;
    status: string;
    createdAt: string;
  }>;
  appointments: Array<{
    id: number;
    doctorName: string;
    reason: string;
    scheduledAt: string;
    duration: number;
    videoLink: string | null;
    status: string;
  }>;
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
const APPLE_CLIENT_ID = import.meta.env.VITE_APPLE_CLIENT_ID as string | undefined;

function StatusBadge({ status, type }: { status: string; type: "intake" | "payment" | "prescription" | "appointment" }) {
  const configs: Record<string, { label: string; className: string; icon: any }> = {
    // intake statuses
    new: { label: "Intake Received", className: "bg-blue-100 text-blue-700 border-blue-200", icon: CheckCircle },
    "in-review": { label: "Under Review", className: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: Clock },
    approved: { label: "Approved", className: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle },
    completed: { label: "Completed", className: "bg-purple-100 text-purple-700 border-purple-200", icon: CheckCircle },
    cancelled: { label: "Cancelled", className: "bg-red-100 text-red-700 border-red-200", icon: XCircle },
    // payment statuses
    pending: { label: "Pending", className: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: Clock },
    paid: { label: "Paid", className: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle },
    refunded: { label: "Refunded", className: "bg-gray-100 text-gray-700 border-gray-200", icon: AlertCircle },
    // prescription statuses (reuse keys with prefix)
    ready: { label: "Ready", className: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle },
    // appointment statuses
    scheduled: { label: "Scheduled", className: "bg-blue-100 text-blue-700 border-blue-200", icon: Calendar },
    "in-progress": { label: "In Progress", className: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: Activity },
    "no-show": { label: "No Show", className: "bg-red-100 text-red-700 border-red-200", icon: XCircle },
  };
  const config = configs[status] || { label: status, className: "bg-gray-100 text-gray-700 border-gray-200", icon: AlertCircle };
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${config.className}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
}

function StepTracker({ intakeStatus, paymentStatus, prescriptionStatus }: { intakeStatus: string; paymentStatus: string; prescriptionStatus: string }) {
  const steps = [
    {
      label: "Intake Submitted",
      done: true,
      icon: FileText,
    },
    {
      label: "Payment",
      done: paymentStatus === "paid",
      active: paymentStatus === "pending",
      icon: CreditCard,
    },
    {
      label: "Provider Review",
      done: ["approved", "completed"].includes(intakeStatus),
      active: intakeStatus === "in-review",
      icon: User,
    },
    {
      label: "Prescription Ready",
      done: prescriptionStatus === "ready",
      active: ["approved", "completed"].includes(intakeStatus) && prescriptionStatus !== "ready",
      icon: Pill,
    },
  ];

  return (
    <div className="flex items-center justify-between w-full">
      {steps.map((step, idx) => {
        const Icon = step.icon;
        return (
          <div key={idx} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-shrink-0">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  step.done
                    ? "bg-green-500 border-green-500 text-white"
                    : step.active
                    ? "bg-blue-50 border-blue-500 text-blue-500"
                    : "bg-gray-50 border-gray-300 text-gray-400"
                }`}
              >
                {step.done ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
              </div>
              <span className={`text-xs mt-1.5 text-center font-medium leading-tight max-w-[70px] ${step.done ? "text-green-600" : step.active ? "text-blue-600" : "text-gray-400"}`}>
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mb-5 ${step.done ? "bg-green-400" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function OrderStatus() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<PatientStatus | null>(null);
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const [appleLoaded, setAppleLoaded] = useState(false);

  const lookupByEmail = useCallback(async (emailToLookup: string) => {
    if (!emailToLookup) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/patient/status?email=${encodeURIComponent(emailToLookup)}`);
      if (!res.ok) {
        const json = await res.json();
        setError(json.error || "No account found with this email.");
        setData(null);
      } else {
        const json = await res.json();
        setData(json);
      }
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load Google Identity Services
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setGoogleLoaded(true);
      window.google?.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response: any) => {
          if (response.credential) {
            try {
              const payload = JSON.parse(atob(response.credential.split(".")[1]));
              if (payload.email) {
                setEmail(payload.email);
                lookupByEmail(payload.email);
              }
            } catch {
              setError("Could not extract email from Google account.");
            }
          }
        },
      });
    };
    document.head.appendChild(script);
  }, [lookupByEmail]);

  // Load Apple Sign-In JS
  useEffect(() => {
    if (!APPLE_CLIENT_ID) return;
    const script = document.createElement("script");
    script.src = "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";
    script.async = true;
    script.onload = () => {
      window.AppleID?.auth.init({
        clientId: APPLE_CLIENT_ID,
        scope: "name email",
        redirectURI: window.location.origin + "/order-status",
        usePopup: true,
      });
      setAppleLoaded(true);
    };
    document.head.appendChild(script);
  }, []);

  const handleGoogleSignIn = () => {
    if (!window.google) return;
    window.google.accounts.id.prompt();
  };

  const handleAppleSignIn = async () => {
    if (!window.AppleID) return;
    try {
      const response = await window.AppleID.auth.signIn();
      const appleEmail = response?.user?.email || response?.authorization?.id_token
        ? JSON.parse(atob((response.authorization.id_token as string).split(".")[1]))?.email
        : null;
      if (appleEmail) {
        setEmail(appleEmail);
        lookupByEmail(appleEmail);
      } else {
        setError("Could not retrieve email from Apple account.");
      }
    } catch {
      setError("Apple sign-in was cancelled or failed.");
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    lookupByEmail(email.trim());
  };

  const handleReset = () => {
    setData(null);
    setEmail("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white mb-4 shadow-lg">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Status</h1>
          <p className="text-gray-500 text-base">Track your prescription, payments, and appointments</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!data ? (
            /* Sign-In Card */
            <motion.div
              key="signin"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="pb-4 text-center">
                  <CardTitle className="text-xl font-semibold text-gray-800">Verify your identity</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">Sign in with your email or linked account to view your status</p>
                </CardHeader>
                <CardContent className="space-y-5">
                  {/* Google Sign-In */}
                  {GOOGLE_CLIENT_ID ? (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-11 text-sm font-medium border-gray-300 hover:bg-gray-50 flex items-center gap-3"
                      onClick={handleGoogleSignIn}
                      disabled={!googleLoaded}
                      data-testid="button-google-signin"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      Continue with Google
                    </Button>
                  ) : null}

                  {/* Apple Sign-In */}
                  {APPLE_CLIENT_ID ? (
                    <Button
                      type="button"
                      className="w-full h-11 text-sm font-medium bg-black hover:bg-gray-900 text-white flex items-center gap-3"
                      onClick={handleAppleSignIn}
                      disabled={!appleLoaded}
                      data-testid="button-apple-signin"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                      </svg>
                      Continue with Apple
                    </Button>
                  ) : null}

                  {(GOOGLE_CLIENT_ID || APPLE_CLIENT_ID) && (
                    <div className="flex items-center gap-3">
                      <Separator className="flex-1" />
                      <span className="text-xs text-gray-400 font-medium">or use email</span>
                      <Separator className="flex-1" />
                    </div>
                  )}

                  {/* Email Form */}
                  <form onSubmit={handleEmailSubmit} className="space-y-3">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="pl-10 h-11"
                        data-testid="input-email-lookup"
                      />
                    </div>
                    {error && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-500 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
                      </motion.p>
                    )}
                    <Button
                      type="submit"
                      className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={loading}
                      data-testid="button-check-status"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          Checking...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Check My Status <ChevronRight className="w-4 h-4" />
                        </span>
                      )}
                    </Button>
                  </form>

                  <p className="text-xs text-center text-gray-400">
                    Use the same email address you provided when completing your intake form.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            /* Status Dashboard */
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-5"
            >
              {/* Back + Patient Info */}
              <div className="flex items-center justify-between">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
                  data-testid="button-back-to-lookup"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800" data-testid="text-patient-name">{data.patient.name}</p>
                  <p className="text-xs text-gray-400">{data.patient.email}</p>
                </div>
              </div>

              {/* Progress Tracker */}
              <Card className="shadow-md border-0 bg-white/90">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-500" /> Your Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <StepTracker
                    intakeStatus={data.status.intake}
                    paymentStatus={data.status.payment}
                    prescriptionStatus={data.status.prescription}
                  />
                </CardContent>
              </Card>

              {/* Status Summary */}
              <Card className="shadow-md border-0 bg-white/90">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold text-gray-800">Status Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600 flex items-center gap-2"><FileText className="w-4 h-4 text-gray-400" /> Intake</span>
                    <StatusBadge status={data.status.intake} type="intake" />
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600 flex items-center gap-2"><CreditCard className="w-4 h-4 text-gray-400" /> Payment</span>
                    <StatusBadge status={data.status.payment} type="payment" />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-600 flex items-center gap-2"><Pill className="w-4 h-4 text-gray-400" /> Prescription</span>
                    <StatusBadge status={data.status.prescription} type="prescription" />
                  </div>
                  {data.patient.medicationInterest && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <p className="text-xs text-gray-400">Medication of interest</p>
                      <p className="text-sm font-medium text-gray-700 mt-0.5">{data.patient.medicationInterest}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Prescriptions */}
              {data.prescriptions.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 px-1">
                    <Pill className="w-4 h-4 text-purple-500" /> Prescriptions ({data.prescriptions.length})
                  </h3>
                  {data.prescriptions.map(rx => (
                    <Card key={rx.id} className="shadow-md border-0 bg-white/90" data-testid={`card-prescription-${rx.id}`}>
                      <CardContent className="pt-4 pb-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-semibold text-gray-900">{rx.medication}</p>
                            <p className="text-xs text-gray-400 mt-0.5">Rx# {rx.prescriptionNumber}</p>
                          </div>
                          <StatusBadge status={rx.status} type="prescription" />
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-xs text-gray-400">Dosage</p>
                            <p className="font-medium text-gray-700">{rx.dosage}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Quantity</p>
                            <p className="font-medium text-gray-700">{rx.quantity}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Refills</p>
                            <p className="font-medium text-gray-700">{rx.refills}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Provider</p>
                            <p className="font-medium text-gray-700">{rx.providerName}</p>
                          </div>
                        </div>
                        {rx.instructions && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-xs text-gray-400 mb-1">Instructions</p>
                            <p className="text-sm text-gray-600">{rx.instructions}</p>
                          </div>
                        )}
                        <p className="text-xs text-gray-400 mt-3">
                          Issued {new Date(rx.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Appointments */}
              {data.appointments.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 px-1">
                    <Calendar className="w-4 h-4 text-blue-500" /> Appointments ({data.appointments.length})
                  </h3>
                  {data.appointments.map(appt => (
                    <Card key={appt.id} className="shadow-md border-0 bg-white/90" data-testid={`card-appointment-${appt.id}`}>
                      <CardContent className="pt-4 pb-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-semibold text-gray-900">With {appt.doctorName}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{appt.reason}</p>
                          </div>
                          <StatusBadge status={appt.status} type="appointment" />
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-xs text-gray-400">Date & Time</p>
                            <p className="font-medium text-gray-700">
                              {new Date(appt.scheduledAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(appt.scheduledAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Duration</p>
                            <p className="font-medium text-gray-700">{appt.duration} minutes</p>
                          </div>
                        </div>
                        {appt.videoLink && appt.status !== "cancelled" && appt.status !== "completed" && (
                          <a
                            href={appt.videoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                            data-testid={`link-video-${appt.id}`}
                          >
                            <Video className="w-4 h-4" /> Join Video Call
                          </a>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Empty state if no prescriptions/appointments */}
              {data.prescriptions.length === 0 && data.appointments.length === 0 && (
                <Card className="shadow-md border-0 bg-white/90">
                  <CardContent className="pt-6 pb-6 text-center">
                    <Clock className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-600">No prescriptions or appointments yet</p>
                    <p className="text-xs text-gray-400 mt-1">Our team will reach out to you shortly after reviewing your intake.</p>
                  </CardContent>
                </Card>
              )}

              {/* Help */}
              <Card className="shadow-sm border border-blue-100 bg-blue-50/50">
                <CardContent className="pt-4 pb-4">
                  <p className="text-xs text-blue-700 text-center">
                    Need help? Email us at{" "}
                    <a href="mailto:support@armormeds.com" className="font-semibold underline">
                      support@armormeds.com
                    </a>
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
