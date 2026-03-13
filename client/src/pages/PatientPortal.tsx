import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Shield, Eye, EyeOff, AlertCircle, Heart, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

declare global {
  interface Window {
    google?: {
      accounts: { id: { initialize: (c: any) => void; prompt: () => void; renderButton: (el: HTMLElement, c: any) => void } };
    };
  }
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

const PATIENT_TOKEN_KEY = "armor_patient_token";
const PATIENT_USER_KEY = "armor_patient_user";

export function savePatientSession(token: string, user: any) {
  localStorage.setItem(PATIENT_TOKEN_KEY, token);
  localStorage.setItem(PATIENT_USER_KEY, JSON.stringify(user));
}

export function getPatientToken(): string | null {
  return localStorage.getItem(PATIENT_TOKEN_KEY);
}

export function getPatientUser(): any | null {
  const u = localStorage.getItem(PATIENT_USER_KEY);
  return u ? JSON.parse(u) : null;
}

export function clearPatientSession() {
  localStorage.removeItem(PATIENT_TOKEN_KEY);
  localStorage.removeItem(PATIENT_USER_KEY);
}

export default function PatientPortal() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [googleLoaded, setGoogleLoaded] = useState(false);

  const [form, setForm] = useState({ name: "", email: "", password: "" });

  // Redirect if already logged in
  useEffect(() => {
    const token = getPatientToken();
    if (token) navigate("/patient/dashboard");
  }, [navigate]);

  // Load Google Identity Services
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;
    const existing = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existing) { setGoogleLoaded(true); return; }
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setGoogleLoaded(true);
      window.google?.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCredential,
      });
    };
    document.head.appendChild(script);
  }, []);

  const handleGoogleCredential = async (response: any) => {
    if (!response.credential) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/patient/google-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Google sign-in failed"); return; }
      savePatientSession(data.token, data.patient);
      toast({ title: `Welcome, ${data.patient.name}!` });
      navigate("/patient/dashboard");
    } catch {
      setError("Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    if (!window.google) return;
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID!,
      callback: handleGoogleCredential,
    });
    window.google.accounts.id.prompt();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError("Please fill in all fields"); return; }
    if (mode === "signup" && !form.name) { setError("Please enter your name"); return; }
    setLoading(true);
    setError("");
    try {
      const endpoint = mode === "login" ? "/api/patient/login" : "/api/patient/register";
      const body = mode === "login" ? { email: form.email, password: form.password } : { email: form.email, name: form.name, password: form.password };
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong"); return; }
      savePatientSession(data.token, data.patient);
      toast({ title: mode === "signup" ? `Account created! Welcome, ${data.patient.name}!` : `Welcome back, ${data.patient.name}!` });
      navigate("/patient/dashboard");
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-4">
            <div className="bg-primary p-2.5 rounded-xl shadow-lg">
              <Heart className="w-6 h-6 text-white fill-white" />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight">
              Armor<span className="text-primary">Meds</span>
            </span>
          </div>
          <p className="text-gray-500 text-sm">Patient Portal</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="shadow-xl border-0 bg-white/95 backdrop-blur">
            <CardHeader className="pb-0 text-center">
              {/* Mode Toggle */}
              <div className="flex bg-gray-100 rounded-xl p-1 mb-4">
                <button
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === "login" ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
                  onClick={() => { setMode("login"); setError(""); }}
                  data-testid="tab-login"
                >
                  Sign In
                </button>
                <button
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === "signup" ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
                  onClick={() => { setMode("signup"); setError(""); }}
                  data-testid="tab-signup"
                >
                  Create Account
                </button>
              </div>
              <CardTitle className="text-xl font-semibold text-gray-800">
                {mode === "login" ? "Welcome back" : "Create your account"}
              </CardTitle>
              <CardDescription className="text-gray-500 text-sm mt-1">
                {mode === "login" ? "Sign in to view your prescriptions and appointments" : "Join ArmorMeds to track your health journey"}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-5 space-y-4">
              {/* Google Sign-In */}
              {GOOGLE_CLIENT_ID && (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-11 border-gray-300 hover:bg-gray-50 flex items-center gap-3 font-medium text-sm"
                    onClick={handleGoogleSignIn}
                    disabled={!googleLoaded || loading}
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
                  <div className="flex items-center gap-3">
                    <Separator className="flex-1" />
                    <span className="text-xs text-gray-400 font-medium">or</span>
                    <Separator className="flex-1" />
                  </div>
                </>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <AnimatePresence>
                  {mode === "signup" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-1.5 pb-1">
                        <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="John Smith"
                          value={form.name}
                          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                          className="h-11"
                          data-testid="input-name"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="h-11"
                    data-testid="input-email"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={mode === "signup" ? "Min. 6 characters" : "••••••••"}
                      value={form.password}
                      onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                      className="h-11 pr-10"
                      data-testid="input-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                  </motion.div>
                )}

                <Button
                  type="submit"
                  className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-medium"
                  disabled={loading}
                  data-testid="button-submit"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      {mode === "login" ? "Signing in..." : "Creating account..."}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      {mode === "login" ? "Sign In" : "Create Account"}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </form>

              <p className="text-xs text-center text-gray-400 pt-1">
                {mode === "login" ? (
                  <>Don't have an account?{" "}<button onClick={() => { setMode("signup"); setError(""); }} className="text-primary font-medium hover:underline">Create one</button></>
                ) : (
                  <>Already have an account?{" "}<button onClick={() => { setMode("login"); setError(""); }} className="text-primary font-medium hover:underline">Sign in</button></>
                )}
              </p>

              <div className="flex items-center gap-1.5 justify-center text-xs text-gray-400 pt-1">
                <Shield className="w-3.5 h-3.5" />
                <span>Your health data is protected and encrypted</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
