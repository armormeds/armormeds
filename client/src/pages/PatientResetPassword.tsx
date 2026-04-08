import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";

export default function PatientResetPassword() {
  const [, navigate] = useLocation();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");
    if (!t) { setError("Invalid or missing reset link. Please request a new one."); return; }
    setToken(t);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!password || !confirm) { setError("Please fill in all fields"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    if (password !== confirm) { setError("Passwords do not match"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/patient/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to reset password"); return; }
      setSuccess(true);
      setTimeout(() => navigate("/patient"), 3000);
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-4">
            <div className="bg-primary p-2.5 rounded-xl shadow-lg">
              <Shield className="w-6 h-6 text-white fill-white" />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight">
              Armor<span className="text-primary">Meds</span>
            </span>
          </div>
          <p className="text-gray-500 text-sm">Patient Portal</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="shadow-xl border-0 bg-white/95 backdrop-blur">
            <CardHeader className="text-center">
              <CardTitle className="text-xl font-semibold text-gray-800">
                {success ? "Password Updated" : "Set New Password"}
              </CardTitle>
              <CardDescription className="text-gray-500 text-sm mt-1">
                {success ? "Your password has been updated successfully." : "Choose a strong password for your account."}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {success ? (
                <div className="text-center space-y-4 py-2">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7 text-green-600" />
                  </div>
                  <p className="text-sm text-gray-600">You'll be redirected to sign in shortly...</p>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white" onClick={() => navigate("/patient")} data-testid="button-go-to-login">Go to Sign In</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5" data-testid="error-message">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">New Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Min. 6 characters"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="h-11 pr-10"
                        data-testid="input-new-password"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" tabIndex={-1}>
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="confirm" className="text-sm font-medium text-gray-700">Confirm Password</Label>
                    <Input
                      id="confirm"
                      type={showPassword ? "text" : "password"}
                      placeholder="Repeat your password"
                      value={confirm}
                      onChange={e => setConfirm(e.target.value)}
                      className="h-11"
                      data-testid="input-confirm-password"
                    />
                  </div>

                  <Button type="submit" className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-medium" disabled={loading || !token} data-testid="button-reset-password">
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Updating...
                      </span>
                    ) : "Update Password"}
                  </Button>

                  <button type="button" onClick={() => navigate("/patient")} className="w-full text-sm text-center text-primary hover:underline" data-testid="link-back-to-login">Back to Sign In</button>
                </form>
              )}

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
