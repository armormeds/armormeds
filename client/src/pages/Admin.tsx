import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Users, Package, ArrowLeft, Mail, Phone, MessageSquare, Calendar, RefreshCw, FileText, ChevronDown, ChevronUp, User, MapPin, Target, Pill, Heart, Scale, Ruler, ClipboardList, CheckCircle, AlertCircle, ExternalLink, Plus, Pencil, Trash2, X, FileSignature, Printer, Video, Clock, StickyNote, Play, Lock, LogOut, CreditCard, BarChart3, DollarSign, TrendingUp, Shield, Wallet, Globe, KeyRound, Copy, CheckCheck } from "lucide-react";
import { Link } from "wouter";
import type { Lead, Product, Prescription, Appointment, CallNote, ProviderAvailability, AdminPermissions } from "@shared/schema";
import { LeadCrmPanel } from "@/components/LeadCrmPanel";
import { buildUrl } from "@shared/routes";
import { format } from "date-fns";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";

const ADMIN_TOKEN_KEY = "wellness_admin_token";
const ADMIN_USER_KEY = "wellness_admin_user";

interface AdminUserInfo {
  id: number;
  email: string;
  name: string;
  role: string;
  permissions: AdminPermissions;
}

interface AdminUserListItem {
  id: number;
  email: string;
  name: string;
  role: string;
  permissions: AdminPermissions;
  isActive: string;
  lastLoginAt: string | null;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  contacted: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  archived: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
  "follow-up": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
};

const appointmentStatusColors: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  "in-progress": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  "no-show": "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
};

function InfoRow({ icon: Icon, label, value, testId }: { icon: typeof Mail; label: string; value: string | null | undefined; testId?: string }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2 text-sm">
      <Icon className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
      <div>
        <span className="font-medium">{label}:</span>{" "}
        <span className="text-muted-foreground" data-testid={testId}>{value}</span>
      </div>
    </div>
  );
}

function ArrayBadges({ items, testIdPrefix }: { items: string[] | null | undefined; testIdPrefix: string }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1">
      {items.map((item, idx) => (
        <Badge 
          key={idx} 
          variant="secondary" 
          className="text-xs no-default-hover-elevate no-default-active-elevate"
          data-testid={`${testIdPrefix}-${idx}`}
        >
          {item}
        </Badge>
      ))}
    </div>
  );
}

interface PrescriptionFormData {
  patientAddress: string;
  medication: string;
  dosage: string;
  quantity: string;
  refills: string;
  instructions: string;
  providerName: string;
  providerNpi: string;
  providerLicense: string;
}

function CreateUserForm({ 
  onSubmit, 
  onCancel, 
  isSubmitting 
}: { 
  onSubmit: (data: { email: string; password: string; name: string; role: string }) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="new-user-name">Full Name</Label>
        <Input
          id="new-user-name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="John Smith"
          required
          data-testid="input-new-user-name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="new-user-email">Email</Label>
        <Input
          id="new-user-email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="john@example.com"
          required
          data-testid="input-new-user-email"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="new-user-password">Password</Label>
        <Input
          id="new-user-password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          placeholder="Create a password"
          required
          data-testid="input-new-user-password"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="new-user-role">Role</Label>
        <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
          <SelectTrigger data-testid="select-new-user-role">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="super_admin">Super Admin - Full access</SelectItem>
            <SelectItem value="provider">Provider - Leads, prescriptions, appointments</SelectItem>
            <SelectItem value="staff">Staff - View leads, manage appointments</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DialogFooter className="gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting} data-testid="button-submit-new-user">
          {isSubmitting ? "Creating..." : "Create User"}
        </Button>
      </DialogFooter>
    </form>
  );
}

function EditUserForm({ 
  user,
  currentUserId,
  onSubmit, 
  onDelete,
  onCancel, 
  isSubmitting,
  isDeleting,
}: { 
  user: AdminUserListItem;
  currentUserId: number;
  onSubmit: (data: { name?: string; email?: string; role?: string; isActive?: string; password?: string }) => void;
  onDelete: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  isDeleting: boolean;
}) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    password: "",
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updates: any = {
      name: formData.name,
      email: formData.email,
      role: formData.role,
      isActive: formData.isActive,
    };
    if (formData.password) {
      updates.password = formData.password;
    }
    onSubmit(updates);
  };

  const isSelf = user.id === currentUserId;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="edit-user-name">Full Name</Label>
        <Input
          id="edit-user-name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          data-testid="input-edit-user-name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-user-email">Email</Label>
        <Input
          id="edit-user-email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          data-testid="input-edit-user-email"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-user-password">New Password (leave blank to keep current)</Label>
        <Input
          id="edit-user-password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          placeholder="Enter new password"
          data-testid="input-edit-user-password"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-user-role">Role</Label>
        <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
          <SelectTrigger data-testid="select-edit-user-role">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="super_admin">Super Admin - Full access</SelectItem>
            <SelectItem value="provider">Provider - Leads, prescriptions, appointments</SelectItem>
            <SelectItem value="staff">Staff - View leads, manage appointments</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-user-active">Status</Label>
        <Select value={formData.isActive} onValueChange={(value) => setFormData({ ...formData, isActive: value })}>
          <SelectTrigger data-testid="select-edit-user-active">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Active</SelectItem>
            <SelectItem value="false">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DialogFooter className="gap-2 flex-wrap">
        {!isSelf && !showDeleteConfirm && (
          <Button 
            type="button" 
            variant="destructive" 
            onClick={() => setShowDeleteConfirm(true)}
            data-testid="button-delete-user"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        )}
        {showDeleteConfirm && (
          <div className="flex gap-2 flex-1">
            <Button type="button" variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={onDelete}
              disabled={isDeleting}
              data-testid="button-confirm-delete-user"
            >
              {isDeleting ? "Deleting..." : "Confirm Delete"}
            </Button>
          </div>
        )}
        {!showDeleteConfirm && (
          <>
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting} data-testid="button-submit-edit-user">
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </>
        )}
      </DialogFooter>
    </form>
  );
}

function AdminLogin({ onLogin }: { onLogin: (token: string, user: AdminUserInfo) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSetup, setIsCheckingSetup] = useState(true);
  const [error, setError] = useState("");
  const [isSetupMode, setIsSetupMode] = useState(false);
  const [setupName, setSetupName] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const checkSetup = async () => {
      try {
        const response = await fetch("/api/admin/setup-required", {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' }
        });
        const data = await response.json();
        console.log("Setup check result:", data);
        setIsSetupMode(data.setupRequired === true);
      } catch (err) {
        console.error("Setup check error:", err);
      } finally {
        setIsCheckingSetup(false);
      }
    };
    checkSetup();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (isSetupMode) {
        // Create initial admin
        const response = await fetch("/api/admin/setup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name: setupName }),
        });
        const data = await response.json();
        if (response.ok && data.success) {
          setIsSetupMode(false);
          toast({
            title: "Admin account created",
            description: "Please log in with your new credentials.",
          });
          setPassword("");
        } else {
          setError(data.message || "Failed to create admin account");
        }
      } else {
        // Normal login
        const response = await fetch("/api/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
          localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(data.user));
          onLogin(data.token, data.user);
          toast({
            title: `Welcome back, ${data.user.name}`,
            description: "You have successfully logged in.",
          });
        } else {
          setError(data.message || "Invalid email or password");
        }
      }
    } catch (err) {
      setError("Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingSetup) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="py-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">
            {isSetupMode ? "Create Admin Account" : "Admin Login"}
          </CardTitle>
          <p className="text-muted-foreground text-sm mt-2">
            {isSetupMode 
              ? "Set up your first admin account to get started"
              : "Enter your credentials to access the admin dashboard"
            }
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSetupMode && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={setupName}
                  onChange={(e) => setSetupName(e.target.value)}
                  required
                  data-testid="input-admin-name"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="text"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                data-testid="input-admin-email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder={isSetupMode ? "Create a password" : "Enter your password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                data-testid="input-admin-password"
              />
            </div>
            {error && (
              <div className="text-destructive text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              data-testid="button-admin-login"
            >
              {isLoading 
                ? (isSetupMode ? "Creating account..." : "Logging in...") 
                : (isSetupMode ? "Create Admin Account" : "Login")
              }
            </Button>
          </form>
          <div className="mt-6 pt-4 border-t">
            <Link href="/">
              <Button variant="ghost" className="w-full" data-testid="button-back-home">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PrescriptionForm({ 
  lead, 
  onSubmit, 
  onCancel,
  isSubmitting 
}: { 
  lead: Lead;
  onSubmit: (data: PrescriptionFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<PrescriptionFormData>({
    defaultValues: {
      patientAddress: '',
      medication: lead.medicationInterest || '',
      dosage: '',
      quantity: '30',
      refills: '0',
      instructions: '',
      providerName: '',
      providerNpi: '',
      providerLicense: '',
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 p-3 bg-muted/30 rounded-md space-y-3">
          <h4 className="font-medium text-sm">Patient Information</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><span className="font-medium">Name:</span> {lead.name}</div>
            <div><span className="font-medium">DOB:</span> {lead.dateOfBirth || 'N/A'}</div>
            <div><span className="font-medium">Phone:</span> {lead.phone || 'N/A'}</div>
            <div><span className="font-medium">State:</span> {lead.state || 'N/A'}</div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="patientAddress">Patient Address</Label>
            <Input 
              id="patientAddress" 
              {...register("patientAddress", { required: "Patient address is required for prescriptions" })} 
              placeholder="123 Main St, City, State ZIP"
              data-testid="input-rx-patient-address"
            />
            {errors.patientAddress && <p className="text-sm text-destructive">{errors.patientAddress.message}</p>}
          </div>
        </div>

        <div className="col-span-2 space-y-2">
          <Label htmlFor="medication">Medication</Label>
          <Input 
            id="medication" 
            {...register("medication", { required: "Medication is required" })} 
            placeholder="e.g., Semaglutide"
            data-testid="input-rx-medication"
          />
          {errors.medication && <p className="text-sm text-destructive">{errors.medication.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="dosage">Dosage</Label>
          <Input 
            id="dosage" 
            {...register("dosage", { required: "Dosage is required" })} 
            placeholder="e.g., 0.25mg weekly"
            data-testid="input-rx-dosage"
          />
          {errors.dosage && <p className="text-sm text-destructive">{errors.dosage.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input 
            id="quantity" 
            {...register("quantity", { required: "Quantity is required" })} 
            placeholder="e.g., 30"
            data-testid="input-rx-quantity"
          />
          {errors.quantity && <p className="text-sm text-destructive">{errors.quantity.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="refills">Refills</Label>
          <Input 
            id="refills" 
            {...register("refills")} 
            placeholder="e.g., 3"
            data-testid="input-rx-refills"
          />
        </div>

        <div className="col-span-2 space-y-2">
          <Label htmlFor="instructions">Sig (Instructions)</Label>
          <Textarea 
            id="instructions" 
            {...register("instructions", { required: "Instructions are required" })} 
            placeholder="Take as directed..."
            rows={2}
            data-testid="input-rx-instructions"
          />
          {errors.instructions && <p className="text-sm text-destructive">{errors.instructions.message}</p>}
        </div>

        <div className="col-span-2 border-t pt-4">
          <h4 className="font-medium text-sm mb-3">Provider Information</h4>
        </div>

        <div className="col-span-2 space-y-2">
          <Label htmlFor="providerName">Provider Name</Label>
          <Input 
            id="providerName" 
            {...register("providerName", { required: "Provider name is required" })} 
            placeholder="Dr. John Smith, MD"
            data-testid="input-rx-provider-name"
          />
          {errors.providerName && <p className="text-sm text-destructive">{errors.providerName.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="providerNpi">NPI Number</Label>
          <Input 
            id="providerNpi" 
            {...register("providerNpi")} 
            placeholder="10-digit NPI"
            data-testid="input-rx-provider-npi"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="providerLicense">License Number</Label>
          <Input 
            id="providerLicense" 
            {...register("providerLicense")} 
            placeholder="State license #"
            data-testid="input-rx-provider-license"
          />
        </div>
      </div>

      <DialogFooter className="gap-2">
        <Button type="button" variant="outline" onClick={onCancel} data-testid="button-cancel-rx">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} data-testid="button-generate-rx">
          {isSubmitting ? "Generating..." : "Generate Prescription"}
        </Button>
      </DialogFooter>
    </form>
  );
}

function PrescriptionView({ prescription, onClose }: { prescription: Prescription; onClose: () => void }) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (printRef.current) {
      const printContent = printRef.current.innerHTML;
      const printWindow = window.open('', '', 'width=800,height=600');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Prescription - ${prescription.prescriptionNumber}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
              .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 20px; }
              .header h1 { margin: 0; font-size: 24px; }
              .header p { margin: 5px 0; color: #666; }
              .rx-symbol { font-size: 48px; font-weight: bold; color: #2563eb; }
              .patient-info, .rx-info, .provider-info { margin-bottom: 20px; }
              .section-title { font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 10px; }
              .info-row { display: flex; margin-bottom: 5px; }
              .info-label { width: 120px; font-weight: bold; }
              .rx-box { border: 2px solid #000; padding: 20px; margin: 20px 0; }
              .medication { font-size: 20px; font-weight: bold; }
              .sig { margin-top: 15px; }
              .signature-line { border-top: 1px solid #000; margin-top: 40px; padding-top: 5px; width: 300px; }
              .footer { margin-top: 40px; font-size: 12px; color: #666; text-align: center; }
              @media print { body { padding: 20px; } }
            </style>
          </head>
          <body>${printContent}</body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  return (
    <div className="space-y-4">
      <div ref={printRef} className="bg-white text-black p-6 rounded-lg border">
        <div className="header text-center border-b-2 border-black pb-4 mb-4">
          <h1 className="text-2xl font-bold">ArmorMeds</h1>
          <p className="text-sm text-gray-600">Telehealth Medical Services</p>
          <p className="text-xs text-gray-500">Licensed Healthcare Provider</p>
        </div>

        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-sm"><span className="font-bold">Date:</span> {format(new Date(prescription.createdAt), "MMMM d, yyyy")}</p>
            <p className="text-sm"><span className="font-bold">Rx #:</span> {prescription.prescriptionNumber}</p>
          </div>
          <div className="text-6xl font-bold text-blue-600">Rx</div>
        </div>

        <div className="patient-info mb-4">
          <h3 className="font-bold border-b border-gray-300 pb-1 mb-2">Patient Information</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <p><span className="font-bold">Name:</span> {prescription.patientName}</p>
            <p><span className="font-bold">DOB:</span> {prescription.patientDob || 'N/A'}</p>
            <p><span className="font-bold">Phone:</span> {prescription.patientPhone || 'N/A'}</p>
            <p><span className="font-bold">Address:</span> {prescription.patientAddress || 'N/A'}</p>
          </div>
        </div>

        <div className="rx-box border-2 border-black p-4 my-4">
          <p className="medication text-xl font-bold">{prescription.medication}</p>
          <p className="text-lg mt-2"><span className="font-bold">Dosage:</span> {prescription.dosage}</p>
          <p><span className="font-bold">Quantity:</span> {prescription.quantity}</p>
          <p><span className="font-bold">Refills:</span> {prescription.refills}</p>
          <div className="sig mt-4 pt-2 border-t border-gray-300">
            <p className="font-bold">Sig:</p>
            <p className="mt-1">{prescription.instructions}</p>
          </div>
        </div>

        <div className="provider-info mt-6">
          <h3 className="font-bold border-b border-gray-300 pb-1 mb-2">Prescriber Information</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <p><span className="font-bold">Provider:</span> {prescription.providerName}</p>
            <p><span className="font-bold">NPI:</span> {prescription.providerNpi || 'N/A'}</p>
            <p><span className="font-bold">License:</span> {prescription.providerLicense || 'N/A'}</p>
          </div>
          <div className="signature-line border-t border-black mt-8 pt-1 w-64">
            <p className="text-sm">Prescriber Signature</p>
          </div>
        </div>

        <div className="footer mt-8 text-xs text-center text-gray-500">
          <p>This prescription is valid for controlled substances per applicable state and federal regulations.</p>
          <p>For questions, contact support@armormeds.com</p>
        </div>
      </div>

      <DialogFooter className="gap-2">
        <Button variant="outline" onClick={onClose} data-testid="button-close-rx-view">
          Close
        </Button>
        <Button onClick={handlePrint} data-testid="button-print-rx">
          <Printer className="h-4 w-4 mr-2" />
          Print Prescription
        </Button>
      </DialogFooter>
    </div>
  );
}

interface AppointmentFormData {
  doctorName: string;
  reason: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: string;
  videoLink: string;
}

function AppointmentForm({ 
  lead, 
  onSubmit, 
  onCancel,
  isSubmitting 
}: { 
  lead: Lead;
  onSubmit: (data: AppointmentFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<AppointmentFormData>({
    defaultValues: {
      doctorName: '',
      reason: '',
      scheduledDate: '',
      scheduledTime: '',
      duration: '30',
      videoLink: '',
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 p-3 bg-muted/30 rounded-md">
          <h4 className="font-medium text-sm mb-2">Patient Information</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><span className="font-medium">Name:</span> {lead.name}</div>
            <div><span className="font-medium">Email:</span> {lead.email}</div>
            <div><span className="font-medium">Phone:</span> {lead.phone || 'N/A'}</div>
            <div><span className="font-medium">Medication:</span> {lead.medicationInterest || 'N/A'}</div>
          </div>
        </div>

        <div className="col-span-2 space-y-2">
          <Label htmlFor="doctorName">Doctor Name</Label>
          <Input 
            id="doctorName" 
            {...register("doctorName", { required: "Doctor name is required" })} 
            placeholder="Dr. John Smith"
            data-testid="input-appt-doctor"
          />
          {errors.doctorName && <p className="text-sm text-destructive">{errors.doctorName.message}</p>}
        </div>

        <div className="col-span-2 space-y-2">
          <Label htmlFor="reason">Reason for Call</Label>
          <Textarea 
            id="reason" 
            {...register("reason", { required: "Reason is required" })} 
            placeholder="Review medical intake form, discuss treatment options..."
            rows={2}
            data-testid="input-appt-reason"
          />
          {errors.reason && <p className="text-sm text-destructive">{errors.reason.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="scheduledDate">Date</Label>
          <Input 
            id="scheduledDate" 
            type="date"
            {...register("scheduledDate", { required: "Date is required" })} 
            data-testid="input-appt-date"
          />
          {errors.scheduledDate && <p className="text-sm text-destructive">{errors.scheduledDate.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="scheduledTime">Time</Label>
          <Input 
            id="scheduledTime" 
            type="time"
            {...register("scheduledTime", { required: "Time is required" })} 
            data-testid="input-appt-time"
          />
          {errors.scheduledTime && <p className="text-sm text-destructive">{errors.scheduledTime.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Select 
            defaultValue="30"
            onValueChange={(val) => {
              const event = { target: { name: 'duration', value: val } };
              register("duration").onChange(event as any);
            }}
          >
            <SelectTrigger data-testid="select-appt-duration">
              <SelectValue placeholder="Duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15 minutes</SelectItem>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="45">45 minutes</SelectItem>
              <SelectItem value="60">60 minutes</SelectItem>
            </SelectContent>
          </Select>
          <input type="hidden" {...register("duration")} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="videoLink">Video Link (optional)</Label>
          <Input 
            id="videoLink" 
            {...register("videoLink")} 
            placeholder="https://zoom.us/j/..."
            data-testid="input-appt-video-link"
          />
        </div>
      </div>

      <DialogFooter className="gap-2">
        <Button type="button" variant="outline" onClick={onCancel} data-testid="button-cancel-appt">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} data-testid="button-schedule-appt">
          {isSubmitting ? "Scheduling..." : "Schedule Appointment"}
        </Button>
      </DialogFooter>
    </form>
  );
}

function AppointmentCard({ 
  appointment, 
  onStatusChange, 
  onViewNotes 
}: { 
  appointment: Appointment; 
  onStatusChange: (id: number, status: string) => void; 
  onViewNotes: (appointment: Appointment) => void;
}) {
  return (
    <Card data-testid={`card-appointment-${appointment.id}`}>
      <CardContent className="p-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <h3 className="font-semibold text-lg" data-testid={`text-appt-patient-${appointment.id}`}>
                {appointment.patientName}
              </h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <Mail className="h-4 w-4" />
                <span>{appointment.patientEmail}</span>
              </div>
              {appointment.patientPhone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Phone className="h-4 w-4" />
                  <span>{appointment.patientPhone}</span>
                </div>
              )}
            </div>
            <Badge 
              className={`${appointmentStatusColors[appointment.status] || appointmentStatusColors.scheduled} no-default-hover-elevate no-default-active-elevate`}
              data-testid={`badge-appt-status-${appointment.id}`}
            >
              {appointment.status}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Doctor:</span>
              <span className="text-muted-foreground">{appointment.doctorName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Duration:</span>
              <span className="text-muted-foreground">{appointment.duration} min</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="font-medium">Scheduled:</span>
            <span className="text-muted-foreground">
              {format(new Date(appointment.scheduledAt), "MMM d, yyyy 'at' h:mm a")}
            </span>
          </div>

          <div className="text-sm">
            <span className="font-medium">Reason:</span>
            <p className="text-muted-foreground mt-1">{appointment.reason}</p>
          </div>

          {appointment.videoLink && (
            <div className="flex items-center gap-2 text-sm">
              <Video className="h-4 w-4 text-primary" />
              <a 
                href={appointment.videoLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center gap-1"
              >
                Join Video Call <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}

          <div className="flex items-center justify-between gap-4 pt-2 border-t flex-wrap">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Created: {format(new Date(appointment.createdAt), "MMM d, yyyy")}</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewNotes(appointment)}
                data-testid={`button-view-notes-${appointment.id}`}
              >
                <StickyNote className="h-4 w-4 mr-1" />
                Notes
              </Button>
              {appointment.videoLink && appointment.status === 'scheduled' && (
                <Button
                  size="sm"
                  onClick={() => onStatusChange(appointment.id, 'in-progress')}
                  data-testid={`button-start-call-${appointment.id}`}
                >
                  <Play className="h-4 w-4 mr-1" />
                  Start Call
                </Button>
              )}
              <Select
                value={appointment.status}
                onValueChange={(value) => onStatusChange(appointment.id, value)}
              >
                <SelectTrigger className="w-[140px]" data-testid={`select-appt-status-${appointment.id}`}>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="no-show">No Show</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function LeadCard({ lead, onStatusChange, onCreatePrescription, onScheduleCall, onSendSMS, onOpenCRM, onShipOrder, onResetPassword }: { lead: Lead; onStatusChange: (id: number, status: string) => void; onCreatePrescription: (lead: Lead) => void; onScheduleCall: (lead: Lead) => void; onSendSMS: (lead: Lead) => void; onOpenCRM: (lead: Lead) => void; onShipOrder: (lead: Lead) => void; onResetPassword: (lead: Lead) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  
  const hasExtendedInfo = lead.goals || lead.state || lead.dateOfBirth || lead.weight || 
    lead.medicalConditions || lead.currentMedications || lead.allergies || 
    lead.hasPancreatitis || lead.previousGlp || lead.documentPaths;

  return (
    <Card data-testid={`card-lead-${lead.id}`}>
      <CardContent className="p-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <h3 className="font-semibold text-lg" data-testid={`text-lead-name-${lead.id}`}>{lead.name}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <Mail className="h-4 w-4" />
                <span data-testid={`text-lead-email-${lead.id}`}>{lead.email}</span>
              </div>
              {lead.phone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Phone className="h-4 w-4" />
                  <span data-testid={`text-lead-phone-${lead.id}`}>{lead.phone}</span>
                </div>
              )}
              {lead.state && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <MapPin className="h-4 w-4" />
                  <span data-testid={`text-lead-state-${lead.id}`}>{lead.state}</span>
                </div>
              )}
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge className={`${statusColors[lead.status]} no-default-hover-elevate no-default-active-elevate`} data-testid={`badge-lead-status-${lead.id}`}>
                {lead.status}
              </Badge>
              {(lead as any).prescriptionStatus && (lead as any).prescriptionStatus !== "pending" && (
                <Badge 
                  variant="outline" 
                  className={`no-default-hover-elevate no-default-active-elevate ${
                    (lead as any).prescriptionStatus === "ready" 
                      ? "text-green-600 border-green-600" 
                      : "text-yellow-600 border-yellow-600"
                  }`}
                  data-testid={`badge-rx-status-${lead.id}`}
                >
                  {(lead as any).prescriptionStatus === "ready" ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Rx Ready
                    </>
                  ) : (
                    <>
                      <Clock className="h-3 w-3 mr-1" />
                      Rx {(lead as any).prescriptionStatus}
                    </>
                  )}
                </Badge>
              )}
              {lead.consentGiven && (
                <Badge 
                  variant="outline" 
                  className={`no-default-hover-elevate no-default-active-elevate ${
                    lead.consentGiven === "yes" 
                      ? "text-green-600 border-green-600" 
                      : "text-red-600 border-red-600"
                  }`}
                  data-testid={`badge-consent-${lead.id}`}
                >
                  {lead.consentGiven === "yes" ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Consent Given
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-3 w-3 mr-1" />
                      No Consent
                    </>
                  )}
                </Badge>
              )}
            </div>
          </div>

          {lead.medicationInterest && (
            <div className="flex items-center gap-2 text-sm">
              <Pill className="h-4 w-4 text-primary" />
              <span className="font-medium">Interested in:</span>{" "}
              <span className="text-muted-foreground" data-testid={`text-lead-medication-${lead.id}`}>{lead.medicationInterest}</span>
            </div>
          )}

          {lead.goals && lead.goals.length > 0 && (
            <div className="text-sm">
              <div className="flex items-center gap-2 mb-1">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Goals:</span>
              </div>
              <ArrayBadges items={lead.goals} testIdPrefix={`badge-goal-${lead.id}`} />
            </div>
          )}

          {lead.documentPaths && lead.documentPaths.length > 0 && (
            <div className="text-sm">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-primary" />
                <span className="font-medium">Documents ({lead.documentPaths.length}):</span>
              </div>
              <div className="space-y-1 ml-6">
                {lead.documentPaths.map((path, idx) => {
                  const fileName = path.split('/').pop() || path;
                  return (
                    <div 
                      key={idx} 
                      className="flex items-center gap-2 text-xs bg-muted/50 p-2 rounded"
                      data-testid={`doc-${lead.id}-${idx}`}
                    >
                      <FileText className="h-3 w-3" />
                      <span className="truncate flex-1">{fileName}</span>
                      <a 
                        href={`/api/object-storage/download?path=${encodeURIComponent(path)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1"
                        data-testid={`link-download-doc-${lead.id}-${idx}`}
                      >
                        <ExternalLink className="h-3 w-3" />
                        View
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {lead.message && (
            <div className="flex items-start gap-2 text-sm bg-muted/50 p-3 rounded-md">
              <MessageSquare className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p className="text-muted-foreground" data-testid={`text-lead-message-${lead.id}`}>{lead.message}</p>
            </div>
          )}

          {hasExtendedInfo && (
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full" data-testid={`button-expand-${lead.id}`}>
                  {isOpen ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-2" />
                      Hide Details
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-2" />
                      View Full Medical Intake
                    </>
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3 p-3 bg-muted/30 rounded-md">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Personal Information
                    </h4>
                    <InfoRow icon={Calendar} label="Date of Birth" value={lead.dateOfBirth} testId={`text-dob-${lead.id}`} />
                    <InfoRow icon={User} label="Sex" value={lead.sex} testId={`text-sex-${lead.id}`} />
                    {(lead.heightFeet || lead.heightInches) && (
                      <div className="flex items-start gap-2 text-sm">
                        <Ruler className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                        <div>
                          <span className="font-medium">Height:</span>{" "}
                          <span className="text-muted-foreground" data-testid={`text-height-${lead.id}`}>
                            {lead.heightFeet}'{lead.heightInches}"
                          </span>
                        </div>
                      </div>
                    )}
                    <InfoRow icon={Scale} label="Weight" value={lead.weight ? `${lead.weight} lbs` : null} testId={`text-weight-${lead.id}`} />
                    <InfoRow icon={User} label="Patient Type" value={lead.patientType} testId={`text-patient-type-${lead.id}`} />
                    <InfoRow icon={ClipboardList} label="Previous Treatments" value={lead.previousTreatments} testId={`text-prev-treatments-${lead.id}`} />
                  </div>

                  <div className="space-y-3 p-3 bg-muted/30 rounded-md">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      Medical History
                    </h4>
                    {lead.medicalConditions && lead.medicalConditions.length > 0 && (
                      <div className="text-sm">
                        <span className="font-medium">Conditions:</span>
                        <div className="mt-1">
                          <ArrayBadges items={lead.medicalConditions} testIdPrefix={`badge-condition-${lead.id}`} />
                        </div>
                      </div>
                    )}
                    <InfoRow icon={Pill} label="Current Medications" value={lead.currentMedications} testId={`text-medications-${lead.id}`} />
                    <InfoRow icon={AlertCircle} label="Allergies" value={lead.allergies} testId={`text-allergies-${lead.id}`} />
                  </div>
                </div>

                <div className="p-3 bg-muted/30 rounded-md space-y-3">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <ClipboardList className="h-4 w-4" />
                    GLP-1 Screening Questions
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                    {lead.hasPancreatitis && (
                      <div data-testid={`text-pancreatitis-${lead.id}`}>
                        <span className="font-medium">Pancreatitis:</span>{" "}
                        <span className={lead.hasPancreatitis === "yes" ? "text-red-600" : "text-muted-foreground"}>
                          {lead.hasPancreatitis}
                        </span>
                      </div>
                    )}
                    {lead.hasThyroidCancer && (
                      <div data-testid={`text-thyroid-${lead.id}`}>
                        <span className="font-medium">Thyroid Cancer:</span>{" "}
                        <span className={lead.hasThyroidCancer === "yes" ? "text-red-600" : "text-muted-foreground"}>
                          {lead.hasThyroidCancer}
                        </span>
                      </div>
                    )}
                    {lead.hasKidneyIssues && (
                      <div data-testid={`text-kidney-${lead.id}`}>
                        <span className="font-medium">Kidney Issues:</span>{" "}
                        <span className={lead.hasKidneyIssues === "yes" ? "text-red-600" : "text-muted-foreground"}>
                          {lead.hasKidneyIssues}
                        </span>
                      </div>
                    )}
                    {lead.hasDiabetes && (
                      <div data-testid={`text-diabetes-${lead.id}`}>
                        <span className="font-medium">Diabetes:</span>{" "}
                        <span className="text-muted-foreground">{lead.hasDiabetes}</span>
                      </div>
                    )}
                    {lead.isPregnant && (
                      <div data-testid={`text-pregnant-${lead.id}`}>
                        <span className="font-medium">Pregnant:</span>{" "}
                        <span className={lead.isPregnant === "yes" ? "text-red-600" : "text-muted-foreground"}>
                          {lead.isPregnant}
                        </span>
                      </div>
                    )}
                    {lead.previousGlp && (
                      <div data-testid={`text-prev-glp-${lead.id}`}>
                        <span className="font-medium">Previous GLP-1:</span>{" "}
                        <span className="text-muted-foreground">{lead.previousGlp}</span>
                      </div>
                    )}
                  </div>
                  {lead.glpDetails && (
                    <div className="text-sm mt-2">
                      <span className="font-medium">GLP-1 Details:</span>{" "}
                      <span className="text-muted-foreground" data-testid={`text-glp-details-${lead.id}`}>{lead.glpDetails}</span>
                    </div>
                  )}
                </div>

                {lead.solutionTypes && lead.solutionTypes.length > 0 && (
                  <div className="text-sm">
                    <span className="font-medium">Preferred Solution Types:</span>
                    <div className="mt-1">
                      <ArrayBadges items={lead.solutionTypes} testIdPrefix={`badge-solution-${lead.id}`} />
                    </div>
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>
          )}

          <div className="flex items-center justify-between gap-4 pt-2 border-t flex-wrap">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span data-testid={`text-lead-date-${lead.id}`}>{format(new Date(lead.createdAt), "MMM d, yyyy 'at' h:mm a")}</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenCRM(lead)}
                data-testid={`button-open-crm-${lead.id}`}
              >
                <ClipboardList className="h-4 w-4 mr-1" />
                CRM
              </Button>
              {lead.phone && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSendSMS(lead)}
                  data-testid={`button-send-sms-${lead.id}`}
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Send SMS
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onScheduleCall(lead)}
                data-testid={`button-schedule-call-${lead.id}`}
              >
                <Video className="h-4 w-4 mr-1" />
                Schedule Call (Optional)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCreatePrescription(lead)}
                data-testid={`button-create-rx-${lead.id}`}
              >
                <FileSignature className="h-4 w-4 mr-1" />
                Generate Rx
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onShipOrder(lead)}
                data-testid={`button-ship-order-${lead.id}`}
              >
                <Package className="h-4 w-4 mr-1" />
                Ship Order
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onResetPassword(lead)}
                data-testid={`button-reset-password-${lead.id}`}
              >
                <KeyRound className="h-4 w-4 mr-1" />
                Reset Password
              </Button>
              <Select
                value={lead.status}
                onValueChange={(value) => onStatusChange(lead.id, value)}
              >
                <SelectTrigger className="w-[140px]" data-testid={`select-lead-status-${lead.id}`}>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="follow-up">Follow-up</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  image: string;
  benefits: string;
  category: string;
}

function ProductForm({ 
  product, 
  onSubmit, 
  onCancel,
  isSubmitting 
}: { 
  product?: Product; 
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}) {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<ProductFormData>({
    defaultValues: product ? {
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      benefits: Array.isArray(product.benefits) ? product.benefits.join('\n') : '',
      category: product.category || 'weight-loss',
    } : {
      name: '',
      category: 'weight-loss',
      description: '',
      price: '',
      image: '',
      benefits: '',
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Product Name</Label>
        <Input 
          id="name" 
          {...register("name", { required: "Name is required" })} 
          placeholder="e.g., Semaglutide"
          data-testid="input-product-name"
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          {...register("description", { required: "Description is required" })} 
          placeholder="Describe the medication..."
          rows={3}
          data-testid="input-product-description"
        />
        {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price</Label>
        <Input 
          id="price" 
          {...register("price", { required: "Price is required" })} 
          placeholder="e.g., Starts at $299/mo"
          data-testid="input-product-price"
        />
        {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Image URL</Label>
        <Input 
          id="image" 
          {...register("image", { required: "Image URL is required" })} 
          placeholder="https://..."
          data-testid="input-product-image"
        />
        {errors.image && <p className="text-sm text-destructive">{errors.image.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="benefits">Benefits (one per line)</Label>
        <Textarea 
          id="benefits" 
          {...register("benefits", { required: "At least one benefit is required" })} 
          placeholder="Reduces appetite&#10;Supports weight loss&#10;Weekly injection"
          rows={4}
          data-testid="input-product-benefits"
        />
        {errors.benefits && <p className="text-sm text-destructive">{errors.benefits.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <input type="hidden" {...register("category")} />
        <Select value={watch("category")} onValueChange={(val) => setValue("category", val, { shouldValidate: true })}>
          <SelectTrigger data-testid="select-product-category">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weight-loss">Weight Loss</SelectItem>
            <SelectItem value="hair-loss">Hair Loss</SelectItem>
            <SelectItem value="sexual-health">Sexual Health</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DialogFooter className="gap-2">
        <Button type="button" variant="outline" onClick={onCancel} data-testid="button-cancel-product">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} data-testid="button-save-product">
          {isSubmitting ? "Saving..." : (product ? "Update Product" : "Add Product")}
        </Button>
      </DialogFooter>
    </form>
  );
}

function ProductCard({ 
  product, 
  onEdit, 
  onDelete 
}: { 
  product: Product; 
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <Card data-testid={`card-product-${product.id}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-20 h-20 object-cover rounded-md flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-lg" data-testid={`text-product-name-${product.id}`}>{product.name}</h3>
                  <Badge variant="outline" className="text-xs no-default-hover-elevate no-default-active-elevate capitalize" data-testid={`badge-category-${product.id}`}>
                    {product.category?.replace('-', ' ')}
                  </Badge>
                </div>
                <p className="text-primary font-medium" data-testid={`text-product-price-${product.id}`}>{product.price}</p>
              </div>
              <div className="flex gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onEdit(product)}
                  data-testid={`button-edit-product-${product.id}`}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive hover:text-destructive"
                      data-testid={`button-delete-product-${product.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Product</DialogTitle>
                    </DialogHeader>
                    <p className="text-muted-foreground">
                      Are you sure you want to delete "{product.name}"? This action cannot be undone.
                    </p>
                    <DialogFooter className="gap-2">
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button 
                        variant="destructive" 
                        onClick={() => {
                          onDelete(product.id);
                          setShowDeleteConfirm(false);
                        }}
                        data-testid={`button-confirm-delete-${product.id}`}
                      >
                        Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{product.description}</p>
            {Array.isArray(product.benefits) && product.benefits.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {product.benefits.slice(0, 3).map((benefit, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs no-default-hover-elevate no-default-active-elevate">
                    {benefit}
                  </Badge>
                ))}
                {product.benefits.length > 3 && (
                  <Badge variant="outline" className="text-xs no-default-hover-elevate no-default-active-elevate">
                    +{product.benefits.length - 3} more
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Admin() {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [currentUser, setCurrentUser] = useState<AdminUserInfo | null>(null);
  const [activeTab, setActiveTab] = useState<"leads" | "products" | "appointments" | "availability" | "users" | "payments" | "reports">("leads");
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showPrescriptionDialog, setShowPrescriptionDialog] = useState(false);
  const [selectedLeadForRx, setSelectedLeadForRx] = useState<Lead | null>(null);
  const [createdPrescription, setCreatedPrescription] = useState<Prescription | null>(null);
  const [showAppointmentDialog, setShowAppointmentDialog] = useState(false);
  const [selectedLeadForAppt, setSelectedLeadForAppt] = useState<Lead | null>(null);
  const [showNotesDialog, setShowNotesDialog] = useState(false);
  const [selectedAppointmentForNotes, setSelectedAppointmentForNotes] = useState<Appointment | null>(null);
  const [newNoteContent, setNewNoteContent] = useState("");
  const [showShipmentDialog, setShowShipmentDialog] = useState(false);
  const [selectedLeadForShipment, setSelectedLeadForShipment] = useState<Lead | null>(null);
  const [shipmentForm, setShipmentForm] = useState({ carrier: "usps", trackingNumber: "", estimatedDelivery: "", notes: "" });
  const [showAvailabilityDialog, setShowAvailabilityDialog] = useState(false);
  const [newSlotDoctor, setNewSlotDoctor] = useState("");
  const [newSlotDate, setNewSlotDate] = useState("");
  const [newSlotStartTime, setNewSlotStartTime] = useState("");
  const [newSlotEndTime, setNewSlotEndTime] = useState("");
  const [showCreateUserDialog, setShowCreateUserDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUserListItem | null>(null);
  const [showSMSDialog, setShowSMSDialog] = useState(false);
  const [selectedLeadForSMS, setSelectedLeadForSMS] = useState<Lead | null>(null);
  const [showCRMPanel, setShowCRMPanel] = useState(false);
  const [selectedLeadForCRM, setSelectedLeadForCRM] = useState<Lead | null>(null);
  const [smsMessage, setSmsMessage] = useState("");
  const [showResetPasswordDialog, setShowResetPasswordDialog] = useState(false);
  const [selectedLeadForReset, setSelectedLeadForReset] = useState<Lead | null>(null);
  const [resetPasswordResult, setResetPasswordResult] = useState<{ tempPassword: string; patientName: string } | null>(null);

  // Check for existing authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem(ADMIN_TOKEN_KEY);
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const response = await fetch("/api/admin/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        
        if (response.ok) {
          const data = await response.json();
          setCurrentUser(data.user);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem(ADMIN_TOKEN_KEY);
          localStorage.removeItem(ADMIN_USER_KEY);
          setIsAuthenticated(false);
        }
      } catch {
        localStorage.removeItem(ADMIN_TOKEN_KEY);
        localStorage.removeItem(ADMIN_USER_KEY);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    
    // Invalidate token on server
    if (token) {
      try {
        await fetch("/api/admin/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
      } catch {
        // Ignore logout errors - we'll clear local storage anyway
      }
    }
    
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
    setCurrentUser(null);
    setIsAuthenticated(false);
    toast({
      title: "Logged out",
      description: "You have been logged out of the admin dashboard.",
    });
  };

  const { data: leads, isLoading: leadsLoading, refetch: refetchLeads } = useQuery<Lead[]>({
    queryKey: ["/api/leads"],
    enabled: isAuthenticated === true,
  });

  const { data: products, isLoading: productsLoading, refetch: refetchProducts } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    enabled: isAuthenticated === true,
  });

  const { data: appointments, isLoading: appointmentsLoading, refetch: refetchAppointments } = useQuery<Appointment[]>({
    queryKey: ["/api/appointments"],
    enabled: isAuthenticated === true,
  });

  const { data: appointmentNotes, refetch: refetchNotes } = useQuery<CallNote[]>({
    queryKey: ["/api/appointments", selectedAppointmentForNotes?.id, "notes"],
    enabled: isAuthenticated === true && !!selectedAppointmentForNotes,
    queryFn: async () => {
      if (!selectedAppointmentForNotes) return [];
      const response = await fetch(`/api/appointments/${selectedAppointmentForNotes.id}/notes`);
      if (!response.ok) throw new Error("Failed to fetch notes");
      return response.json();
    },
  });

  const { data: availabilitySlots, isLoading: availabilityLoading, refetch: refetchAvailability } = useQuery<ProviderAvailability[]>({
    queryKey: ["/api/availability"],
    enabled: isAuthenticated === true,
  });

  const { data: adminUsers, isLoading: usersLoading, refetch: refetchUsers } = useQuery<AdminUserListItem[]>({
    queryKey: ["/api/admin/users"],
    enabled: isAuthenticated === true && currentUser?.permissions?.manageUsers === true,
  });

  const { data: payments, isLoading: paymentsLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/payments"],
    enabled: isAuthenticated === true,
  });

  const { data: reports, isLoading: reportsLoading } = useQuery<any>({
    queryKey: ["/api/admin/reports"],
    enabled: isAuthenticated === true,
  });

  const [showRefundDialog, setShowRefundDialog] = useState(false);
  const [selectedPaymentForRefund, setSelectedPaymentForRefund] = useState<any>(null);
  const [refundAmount, setRefundAmount] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [refundType, setRefundType] = useState<"full" | "partial">("full");

  const refundMutation = useMutation({
    mutationFn: async (data: { paymentIntentId: string; amount?: number; reason?: string }) => {
      return apiRequest("POST", "/api/admin/refund", data);
    },
    onSuccess: async (response) => {
      const result = await response.json();
      queryClient.invalidateQueries({ queryKey: ["/api/admin/payments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/reports"] });
      setShowRefundDialog(false);
      setSelectedPaymentForRefund(null);
      setRefundAmount("");
      setRefundReason("");
      setRefundType("full");
      toast({
        title: "Refund processed",
        description: `Refund of ${result.refund.amount.toLocaleString("en-US", { style: "currency", currency: result.refund.currency || "usd" })} has been initiated. Status: ${result.refund.status}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Refund failed",
        description: error?.message || "Failed to process refund. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleRefundClick = (payment: any) => {
    setSelectedPaymentForRefund(payment);
    setRefundAmount(String(payment.amount - payment.amountRefunded));
    setRefundReason("");
    setRefundType("full");
    setShowRefundDialog(true);
  };

  const handleRefundSubmit = () => {
    if (!selectedPaymentForRefund?.paymentIntentId) return;
    const data: any = { paymentIntentId: selectedPaymentForRefund.paymentIntentId };
    if (refundType === "partial" && refundAmount) {
      data.amount = Number(refundAmount);
    }
    if (refundReason) {
      data.reason = refundReason;
    }
    refundMutation.mutate(data);
  };

  const createUserMutation = useMutation({
    mutationFn: async (userData: { email: string; password: string; name: string; role: string }) => {
      return apiRequest("POST", "/api/admin/users", userData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setShowCreateUserDialog(false);
      toast({ title: "User created", description: "New admin user has been created successfully." });
    },
    onError: (error: any) => {
      toast({ title: "Failed to create user", description: error?.message || "An error occurred", variant: "destructive" });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ id, ...updates }: { id: number; name?: string; email?: string; role?: string; isActive?: string; password?: string }) => {
      return apiRequest("PATCH", `/api/admin/users/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setEditingUser(null);
      toast({ title: "User updated", description: "Admin user has been updated successfully." });
    },
    onError: (error: any) => {
      toast({ title: "Failed to update user", description: error?.message || "An error occurred", variant: "destructive" });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/admin/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "User deleted", description: "Admin user has been deleted." });
    },
    onError: (error: any) => {
      toast({ title: "Failed to delete user", description: error?.message || "An error occurred", variant: "destructive" });
    },
  });

  const updateLeadMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const url = buildUrl("/api/leads/:id", { id });
      return apiRequest("PATCH", url, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
      toast({
        title: "Status updated",
        description: "Lead status has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update lead status.",
        variant: "destructive",
      });
    },
  });

  const createProductMutation = useMutation({
    mutationFn: async (data: { name: string; description: string; price: string; image: string; benefits: string[] }) => {
      return apiRequest("POST", "/api/products", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setShowProductDialog(false);
      toast({
        title: "Product created",
        description: "New product has been added successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create product.",
        variant: "destructive",
      });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, ...data }: { id: number; name: string; description: string; price: string; image: string; benefits: string[] }) => {
      const url = buildUrl("/api/products/:id", { id });
      return apiRequest("PATCH", url, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setShowProductDialog(false);
      setEditingProduct(null);
      toast({
        title: "Product updated",
        description: "Product has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update product.",
        variant: "destructive",
      });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl("/api/products/:id", { id });
      return apiRequest("DELETE", url);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Product deleted",
        description: "Product has been removed successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete product.",
        variant: "destructive",
      });
    },
  });

  const createPrescriptionMutation = useMutation({
    mutationFn: async (data: {
      leadId: number;
      patientName: string;
      patientDob?: string;
      patientPhone?: string;
      patientAddress: string;
      medication: string;
      dosage: string;
      quantity: string;
      refills: string;
      instructions: string;
      providerName: string;
      providerNpi?: string;
      providerLicense?: string;
    }) => {
      const response = await apiRequest("POST", "/api/prescriptions", data);
      return response.json();
    },
    onSuccess: (prescription: Prescription) => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
      setCreatedPrescription(prescription);
      setSelectedLeadForRx(null);
      toast({
        title: "Prescription created",
        description: `Prescription ${prescription.prescriptionNumber} has been generated.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create prescription.",
        variant: "destructive",
      });
    },
  });

  const handleStatusChange = (id: number, status: string) => {
    updateLeadMutation.mutate({ id, status });
  };

  const handleCreatePrescription = (lead: Lead) => {
    setSelectedLeadForRx(lead);
    setShowPrescriptionDialog(true);
  };

  const handlePrescriptionSubmit = (data: PrescriptionFormData) => {
    if (!selectedLeadForRx) return;
    
    createPrescriptionMutation.mutate({
      leadId: selectedLeadForRx.id,
      patientName: selectedLeadForRx.name,
      patientDob: selectedLeadForRx.dateOfBirth || undefined,
      patientPhone: selectedLeadForRx.phone || undefined,
      patientAddress: data.patientAddress,
      medication: data.medication,
      dosage: data.dosage,
      quantity: data.quantity,
      refills: data.refills,
      instructions: data.instructions,
      providerName: data.providerName,
      providerNpi: data.providerNpi || undefined,
      providerLicense: data.providerLicense || undefined,
    });
  };

  const handleClosePrescriptionDialog = () => {
    setShowPrescriptionDialog(false);
    setSelectedLeadForRx(null);
    setCreatedPrescription(null);
  };

  const handleProductSubmit = (data: ProductFormData) => {
    const benefits = data.benefits.split('\n').map(b => b.trim()).filter(b => b.length > 0);
    const productData = {
      name: data.name,
      description: data.description,
      price: data.price,
      image: data.image,
      benefits,
      category: data.category,
    };

    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, ...productData });
    } else {
      createProductMutation.mutate(productData);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductDialog(true);
  };

  const handleDeleteProduct = (id: number) => {
    deleteProductMutation.mutate(id);
  };

  const handleCloseDialog = () => {
    setShowProductDialog(false);
    setEditingProduct(null);
  };

  // Appointment mutations
  const createAppointmentMutation = useMutation({
    mutationFn: async (data: {
      leadId: number;
      patientName: string;
      patientEmail: string;
      patientPhone?: string;
      doctorName: string;
      reason: string;
      scheduledAt: string;
      duration: number;
      videoLink?: string;
    }) => {
      const response = await apiRequest("POST", "/api/appointments", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
      setShowAppointmentDialog(false);
      setSelectedLeadForAppt(null);
      toast({
        title: "Appointment scheduled",
        description: "Video call appointment has been scheduled successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to schedule appointment.",
        variant: "destructive",
      });
    },
  });

  const updateAppointmentMutation = useMutation({
    mutationFn: async ({ id, ...updates }: { id: number; status?: string; completedAt?: string }) => {
      const response = await apiRequest("PATCH", `/api/appointments/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      toast({
        title: "Appointment updated",
        description: "Appointment status has been updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update appointment.",
        variant: "destructive",
      });
    },
  });

  const createNoteMutation = useMutation({
    mutationFn: async (data: { appointmentId: number; authorName: string; noteType: string; content: string }) => {
      const response = await apiRequest("POST", `/api/appointments/${data.appointmentId}/notes`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments", selectedAppointmentForNotes?.id, "notes"] });
      setNewNoteContent("");
      toast({
        title: "Note added",
        description: "Call documentation has been saved.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add note.",
        variant: "destructive",
      });
    },
  });

  const createAvailabilityMutation = useMutation({
    mutationFn: async (data: { doctorName: string; startAt: string; endAt: string }) => {
      const response = await apiRequest("POST", "/api/availability", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/availability"] });
      setShowAvailabilityDialog(false);
      setNewSlotDoctor("");
      setNewSlotDate("");
      setNewSlotStartTime("");
      setNewSlotEndTime("");
      toast({
        title: "Availability added",
        description: "New time slot has been created for patient scheduling.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create availability slot.",
        variant: "destructive",
      });
    },
  });

  const deleteAvailabilityMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/availability/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/availability"] });
      toast({
        title: "Slot deleted",
        description: "Availability slot has been removed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete availability slot.",
        variant: "destructive",
      });
    },
  });

  const handleCreateAvailability = () => {
    if (!newSlotDoctor || !newSlotDate || !newSlotStartTime || !newSlotEndTime) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }
    const startAt = new Date(`${newSlotDate}T${newSlotStartTime}`).toISOString();
    const endAt = new Date(`${newSlotDate}T${newSlotEndTime}`).toISOString();
    createAvailabilityMutation.mutate({ doctorName: newSlotDoctor, startAt, endAt });
  };

  const handleSendSMS = (lead: Lead) => {
    setSelectedLeadForSMS(lead);
    setSmsMessage("");
    setShowSMSDialog(true);
  };

  const handleOpenCRM = (lead: Lead) => {
    setSelectedLeadForCRM(lead);
    setShowCRMPanel(true);
  };

  const handleResetPatientPassword = (lead: Lead) => {
    setSelectedLeadForReset(lead);
    setResetPasswordResult(null);
    setShowResetPasswordDialog(true);
  };

  const resetPasswordMutation = useMutation({
    mutationFn: async ({ email, leadId }: { email: string; leadId: number }) => {
      const res = await apiRequest("POST", "/api/admin/patient-reset-password", { email, leadId });
      return res as { tempPassword: string; patientName: string };
    },
    onSuccess: (data) => {
      setResetPasswordResult(data);
    },
    onError: (e: any) => {
      toast({ title: e.message || "Failed to reset password", variant: "destructive" });
    },
  });

  const sendSMSMutation = useMutation({
    mutationFn: async ({ phone, message }: { phone: string; message: string }) => {
      return apiRequest("POST", "/api/admin/send-sms", { phone, message });
    },
    onSuccess: () => {
      setShowSMSDialog(false);
      setSelectedLeadForSMS(null);
      setSmsMessage("");
      toast({
        title: "SMS sent",
        description: "Text message has been sent successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to send SMS",
        description: error?.message || "Could not send the text message.",
        variant: "destructive",
      });
    },
  });

  const handleScheduleCall = (lead: Lead) => {
    setSelectedLeadForAppt(lead);
    setShowAppointmentDialog(true);
  };

  const createShipmentMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/admin/shipments", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem(ADMIN_TOKEN_KEY)}` },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to create shipment");
      return json;
    },
    onSuccess: () => {
      toast({ title: "Shipment created", description: "The patient will see tracking info in their portal." });
      setShowShipmentDialog(false);
      setSelectedLeadForShipment(null);
      setShipmentForm({ carrier: "usps", trackingNumber: "", estimatedDelivery: "", notes: "" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const handleShipOrder = (lead: Lead) => {
    setSelectedLeadForShipment(lead);
    setShipmentForm({ carrier: "usps", trackingNumber: "", estimatedDelivery: "", notes: "" });
    setShowShipmentDialog(true);
  };

  const handleShipmentSubmit = () => {
    if (!selectedLeadForShipment || !shipmentForm.trackingNumber) return;
    createShipmentMutation.mutate({
      leadId: selectedLeadForShipment.id,
      carrier: shipmentForm.carrier,
      trackingNumber: shipmentForm.trackingNumber,
      estimatedDelivery: shipmentForm.estimatedDelivery || undefined,
      notes: shipmentForm.notes || undefined,
    });
  };

  const handleAppointmentSubmit = (data: AppointmentFormData) => {
    if (!selectedLeadForAppt) return;
    
    const scheduledAt = new Date(`${data.scheduledDate}T${data.scheduledTime}`).toISOString();
    
    createAppointmentMutation.mutate({
      leadId: selectedLeadForAppt.id,
      patientName: selectedLeadForAppt.name,
      patientEmail: selectedLeadForAppt.email,
      patientPhone: selectedLeadForAppt.phone || undefined,
      doctorName: data.doctorName,
      reason: data.reason,
      scheduledAt,
      duration: parseInt(data.duration) || 30,
      videoLink: data.videoLink || undefined,
    });
  };

  const handleCloseAppointmentDialog = () => {
    setShowAppointmentDialog(false);
    setSelectedLeadForAppt(null);
  };

  const handleAppointmentStatusChange = (id: number, status: string) => {
    const updates: { status: string; completedAt?: string } = { status };
    if (status === 'completed') {
      updates.completedAt = new Date().toISOString();
    }
    updateAppointmentMutation.mutate({ id, ...updates });
  };

  const handleViewNotes = (appointment: Appointment) => {
    setSelectedAppointmentForNotes(appointment);
    setShowNotesDialog(true);
  };

  const handleCloseNotesDialog = () => {
    setShowNotesDialog(false);
    setSelectedAppointmentForNotes(null);
    setNewNoteContent("");
  };

  const handleAddNote = () => {
    if (!selectedAppointmentForNotes || !newNoteContent.trim()) return;
    
    createNoteMutation.mutate({
      appointmentId: selectedAppointmentForNotes.id,
      authorName: selectedAppointmentForNotes.doctorName,
      noteType: 'consultation',
      content: newNoteContent.trim(),
    });
  };

  const newLeadsCount = leads?.filter((l) => l.status === "new").length ?? 0;
  const upcomingAppointments = appointments?.filter((a) => a.status === "scheduled").length ?? 0;

  // Show loading while checking auth
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin onLogin={(token, user) => {
      setCurrentUser(user);
      setIsAuthenticated(true);
    }} />;
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" data-testid="button-back-home">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-display font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                {currentUser ? `Welcome, ${currentUser.name} (${currentUser.role.replace('_', ' ')})` : 'Manage leads and products'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => {
              if (activeTab === "leads") refetchLeads();
              else if (activeTab === "products") refetchProducts();
              else if (activeTab === "appointments") refetchAppointments();
              else if (activeTab === "users") refetchUsers();
              else refetchAvailability();
            }} data-testid="button-refresh">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="ghost" onClick={handleLogout} data-testid="button-logout">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          <Button
            variant={activeTab === "leads" ? "default" : "outline"}
            onClick={() => setActiveTab("leads")}
            data-testid="button-tab-leads"
          >
            <Users className="h-4 w-4 mr-2" />
            Leads
            {newLeadsCount > 0 && (
              <Badge variant="secondary" className="ml-2">{newLeadsCount}</Badge>
            )}
          </Button>
          <Button
            variant={activeTab === "appointments" ? "default" : "outline"}
            onClick={() => setActiveTab("appointments")}
            data-testid="button-tab-appointments"
          >
            <Video className="h-4 w-4 mr-2" />
            Appointments
            {upcomingAppointments > 0 && (
              <Badge variant="secondary" className="ml-2">{upcomingAppointments}</Badge>
            )}
          </Button>
          <Button
            variant={activeTab === "products" ? "default" : "outline"}
            onClick={() => setActiveTab("products")}
            data-testid="button-tab-products"
          >
            <Package className="h-4 w-4 mr-2" />
            Products
          </Button>
          <Button
            variant={activeTab === "availability" ? "default" : "outline"}
            onClick={() => setActiveTab("availability")}
            data-testid="button-tab-availability"
          >
            <Clock className="h-4 w-4 mr-2" />
            Availability
            {availabilitySlots && availabilitySlots.length > 0 && (
              <Badge variant="secondary" className="ml-2">{availabilitySlots.length}</Badge>
            )}
          </Button>
          <Button
            variant={activeTab === "payments" ? "default" : "outline"}
            onClick={() => setActiveTab("payments")}
            data-testid="button-tab-payments"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Payments
            {payments && payments.length > 0 && (
              <Badge variant="secondary" className="ml-2">{payments.length}</Badge>
            )}
          </Button>
          <Button
            variant={activeTab === "reports" ? "default" : "outline"}
            onClick={() => setActiveTab("reports")}
            data-testid="button-tab-reports"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Reports
          </Button>
          {currentUser?.permissions?.manageUsers && (
            <Button
              variant={activeTab === "users" ? "default" : "outline"}
              onClick={() => setActiveTab("users")}
              data-testid="button-tab-users"
            >
              <User className="h-4 w-4 mr-2" />
              Users
              {adminUsers && adminUsers.length > 0 && (
                <Badge variant="secondary" className="ml-2">{adminUsers.length}</Badge>
              )}
            </Button>
          )}
        </div>

        {activeTab === "leads" && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Customer Inquiries
                </CardTitle>
              </CardHeader>
              <CardContent>
                {leadsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-32 w-full" />
                    ))}
                  </div>
                ) : leads && leads.length > 0 ? (
                  <div className="grid gap-4">
                    {leads
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .map((lead) => (
                        <LeadCard
                          key={lead.id}
                          lead={lead}
                          onStatusChange={handleStatusChange}
                          onCreatePrescription={handleCreatePrescription}
                          onScheduleCall={handleScheduleCall}
                          onSendSMS={handleSendSMS}
                          onOpenCRM={handleOpenCRM}
                          onShipOrder={handleShipOrder}
                          onResetPassword={handleResetPatientPassword}
                        />
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No leads yet. When customers submit inquiries, they will appear here.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "products" && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Products
                  </CardTitle>
                  <Dialog open={showProductDialog} onOpenChange={(open) => {
                    if (!open) handleCloseDialog();
                    else setShowProductDialog(true);
                  }}>
                    <DialogTrigger asChild>
                      <Button data-testid="button-add-product">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
                      </DialogHeader>
                      <ProductForm 
                        product={editingProduct || undefined}
                        onSubmit={handleProductSubmit}
                        onCancel={handleCloseDialog}
                        isSubmitting={createProductMutation.isPending || updateProductMutation.isPending}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {productsLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <Skeleton key={i} className="h-24 w-full" />
                    ))}
                  </div>
                ) : products && products.length > 0 ? (
                  <div className="grid gap-4">
                    {products.map((product) => (
                      <ProductCard 
                        key={product.id} 
                        product={product}
                        onEdit={handleEditProduct}
                        onDelete={handleDeleteProduct}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No products found. Click "Add Product" to create one.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "appointments" && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Scheduled Video Consultations
                </CardTitle>
              </CardHeader>
              <CardContent>
                {appointmentsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-32 w-full" />
                    ))}
                  </div>
                ) : appointments && appointments.length > 0 ? (
                  <div className="grid gap-4">
                    {appointments.map((appointment) => (
                      <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                        onStatusChange={handleAppointmentStatusChange}
                        onViewNotes={handleViewNotes}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No scheduled appointments. Use "Schedule Call" from a lead's card to create one.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "availability" && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Provider Availability
                  </CardTitle>
                  <Dialog open={showAvailabilityDialog} onOpenChange={setShowAvailabilityDialog}>
                    <DialogTrigger asChild>
                      <Button data-testid="button-add-availability">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Time Slot
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[450px]">
                      <DialogHeader>
                        <DialogTitle>Add Availability Slot</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="slot-doctor">Doctor Name</Label>
                          <Input
                            id="slot-doctor"
                            value={newSlotDoctor}
                            onChange={(e) => setNewSlotDoctor(e.target.value)}
                            placeholder="Dr. Smith"
                            data-testid="input-slot-doctor"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="slot-date">Date</Label>
                          <Input
                            id="slot-date"
                            type="date"
                            value={newSlotDate}
                            onChange={(e) => setNewSlotDate(e.target.value)}
                            data-testid="input-slot-date"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="slot-start">Start Time</Label>
                            <Input
                              id="slot-start"
                              type="time"
                              value={newSlotStartTime}
                              onChange={(e) => setNewSlotStartTime(e.target.value)}
                              data-testid="input-slot-start"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="slot-end">End Time</Label>
                            <Input
                              id="slot-end"
                              type="time"
                              value={newSlotEndTime}
                              onChange={(e) => setNewSlotEndTime(e.target.value)}
                              data-testid="input-slot-end"
                            />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAvailabilityDialog(false)}>
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleCreateAvailability}
                          disabled={createAvailabilityMutation.isPending}
                          data-testid="button-save-slot"
                        >
                          {createAvailabilityMutation.isPending ? "Saving..." : "Add Slot"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Set available time slots for patients to self-schedule telehealth consultations.
                </p>
              </CardHeader>
              <CardContent>
                {availabilityLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : availabilitySlots && availabilitySlots.length > 0 ? (
                  <div className="grid gap-3">
                    {availabilitySlots.map((slot) => (
                      <div 
                        key={slot.id} 
                        className="flex items-center justify-between p-4 border rounded-lg"
                        data-testid={`availability-slot-${slot.id}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-full bg-primary/10">
                            <Calendar className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{slot.doctorName}</div>
                            <div className="text-sm text-muted-foreground">
                              {format(new Date(slot.startAt), "EEEE, MMM d, yyyy")}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {format(new Date(slot.startAt), "h:mm a")} - {format(new Date(slot.endAt), "h:mm a")}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            className={slot.status === "available" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"}
                          >
                            {slot.status}
                          </Badge>
                          {slot.status === "available" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteAvailabilityMutation.mutate(slot.id)}
                              disabled={deleteAvailabilityMutation.isPending}
                              data-testid={`button-delete-slot-${slot.id}`}
                            >
                              <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No availability slots set. Click "Add Time Slot" to let patients schedule consultations.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "users" && currentUser?.permissions?.manageUsers && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Admin Users
                  </CardTitle>
                  <Dialog open={showCreateUserDialog} onOpenChange={setShowCreateUserDialog}>
                    <DialogTrigger asChild>
                      <Button data-testid="button-add-user">
                        <Plus className="h-4 w-4 mr-2" />
                        Add User
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[450px]">
                      <DialogHeader>
                        <DialogTitle>Create Admin User</DialogTitle>
                      </DialogHeader>
                      <CreateUserForm 
                        onSubmit={(data) => createUserMutation.mutate(data)}
                        isSubmitting={createUserMutation.isPending}
                        onCancel={() => setShowCreateUserDialog(false)}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                ) : adminUsers && adminUsers.length > 0 ? (
                  <div className="grid gap-4">
                    {adminUsers.map((user) => (
                      <Card key={user.id} className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={user.isActive === "true" ? "default" : "secondary"}>
                              {user.isActive === "true" ? "Active" : "Inactive"}
                            </Badge>
                            <Badge variant="outline" className="capitalize">
                              {user.role.replace('_', ' ')}
                            </Badge>
                            <Dialog open={editingUser?.id === user.id} onOpenChange={(open) => !open && setEditingUser(null)}>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => setEditingUser(user)}
                                  data-testid={`button-edit-user-${user.id}`}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[450px]">
                                <DialogHeader>
                                  <DialogTitle>Edit User</DialogTitle>
                                </DialogHeader>
                                {editingUser && (
                                  <EditUserForm 
                                    user={editingUser}
                                    currentUserId={currentUser?.id || 0}
                                    onSubmit={(data) => updateUserMutation.mutate({ id: editingUser.id, ...data })}
                                    onDelete={() => deleteUserMutation.mutate(editingUser.id)}
                                    isSubmitting={updateUserMutation.isPending}
                                    isDeleting={deleteUserMutation.isPending}
                                    onCancel={() => setEditingUser(null)}
                                  />
                                )}
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                        {user.lastLoginAt && (
                          <div className="text-xs text-muted-foreground mt-2 ml-13">
                            Last login: {format(new Date(user.lastLoginAt), "MMM d, yyyy 'at' h:mm a")}
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No admin users yet</h3>
                    <p className="text-muted-foreground mb-4">Create your first admin user to get started.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "payments" && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {paymentsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : payments && payments.length > 0 ? (
                  <div className="space-y-3">
                    {payments
                      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .map((payment: any) => (
                      <Collapsible key={payment.id}>
                        <Card className="overflow-visible" data-testid={`row-payment-${payment.id}`}>
                          <CollapsibleTrigger className="w-full text-left" data-testid={`button-expand-payment-${payment.id}`}>
                            <div className="p-4 flex flex-wrap items-center gap-3 justify-between">
                              <div className="flex items-center gap-3 flex-wrap min-w-0">
                                <span className="text-sm text-muted-foreground whitespace-nowrap">
                                  {payment.createdAt ? format(new Date(payment.createdAt), "MMM d, yyyy h:mm a") : "N/A"}
                                </span>
                                <span className="text-sm font-medium truncate" data-testid={`text-payment-email-${payment.id}`}>
                                  {payment.customerName || payment.customerEmail || "N/A"}
                                </span>
                                <span className="text-sm font-bold" data-testid={`text-payment-amount-${payment.id}`}>
                                  {(payment.amount).toLocaleString("en-US", { style: "currency", currency: payment.currency || "usd" })}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 flex-wrap">
                                {payment.paymentMethod?.cardBrand && (
                                  <Badge variant="outline" className="no-default-hover-elevate no-default-active-elevate capitalize">
                                    <CreditCard className="h-3 w-3 mr-1" />
                                    {payment.paymentMethod.cardBrand} {payment.paymentMethod.cardLast4 ? `****${payment.paymentMethod.cardLast4}` : ""}
                                  </Badge>
                                )}
                                <Badge variant="outline" className="no-default-hover-elevate no-default-active-elevate" data-testid={`badge-payment-type-${payment.id}`}>
                                  {payment.mode === "subscription" ? "Subscription" : "One-time"}
                                </Badge>
                                <Badge
                                  variant="secondary"
                                  className={`no-default-hover-elevate no-default-active-elevate ${
                                    payment.paymentStatus === "paid"
                                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                      : payment.paymentStatus === "unpaid"
                                      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                      : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                                  }`}
                                  data-testid={`badge-payment-status-${payment.id}`}
                                >
                                  {payment.paymentStatus || "unknown"}
                                </Badge>
                                {payment.isRefunded && (
                                  <Badge
                                    variant="secondary"
                                    className="no-default-hover-elevate no-default-active-elevate bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                    data-testid={`badge-refunded-${payment.id}`}
                                  >
                                    {payment.amount <= payment.amountRefunded ? "Fully Refunded" : "Partially Refunded"}
                                  </Badge>
                                )}
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              </div>
                            </div>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div className="px-4 pb-4 border-t">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                                <div className="space-y-3">
                                  <h4 className="text-sm font-semibold flex items-center gap-1.5">
                                    <CreditCard className="h-3.5 w-3.5" />
                                    Payment Method
                                  </h4>
                                  <div className="text-sm space-y-1">
                                    {payment.paymentMethod?.cardBrand ? (
                                      <>
                                        <p className="capitalize"><span className="text-muted-foreground">Card: </span>{payment.paymentMethod.cardBrand} ending in {payment.paymentMethod.cardLast4}</p>
                                        {payment.paymentMethod.cardExpMonth && (
                                          <p><span className="text-muted-foreground">Expires: </span>{payment.paymentMethod.cardExpMonth}/{payment.paymentMethod.cardExpYear}</p>
                                        )}
                                        {payment.paymentMethod.cardFunding && (
                                          <p className="capitalize"><span className="text-muted-foreground">Funding: </span>{payment.paymentMethod.cardFunding}</p>
                                        )}
                                        {payment.paymentMethod.cardCountry && (
                                          <p><span className="text-muted-foreground">Card Country: </span>{payment.paymentMethod.cardCountry}</p>
                                        )}
                                        {payment.paymentMethod.wallet && (
                                          <p className="capitalize"><span className="text-muted-foreground">Wallet: </span>{payment.paymentMethod.wallet.replace('_', ' ')}</p>
                                        )}
                                      </>
                                    ) : (
                                      <p className="text-muted-foreground">No card details available</p>
                                    )}
                                    {payment.paymentIntentId && (
                                      <p className="text-xs text-muted-foreground break-all mt-2"><span className="font-medium">Transaction ID: </span>{payment.paymentIntentId}</p>
                                    )}
                                  </div>
                                </div>

                                <div className="space-y-3">
                                  <h4 className="text-sm font-semibold flex items-center gap-1.5">
                                    <MapPin className="h-3.5 w-3.5" />
                                    Customer & Billing
                                  </h4>
                                  <div className="text-sm space-y-1">
                                    {payment.customerName && (
                                      <p><span className="text-muted-foreground">Name: </span>{payment.customerName}</p>
                                    )}
                                    <p><span className="text-muted-foreground">Email: </span>{payment.customerEmail || "N/A"}</p>
                                    {payment.billingAddress && (payment.billingAddress.line1 || payment.billingAddress.city) ? (
                                      <>
                                        {payment.billingAddress.line1 && (
                                          <p><span className="text-muted-foreground">Address: </span>{payment.billingAddress.line1}{payment.billingAddress.line2 ? `, ${payment.billingAddress.line2}` : ""}</p>
                                        )}
                                        <p>
                                          <span className="text-muted-foreground">Location: </span>
                                          {[payment.billingAddress.city, payment.billingAddress.state, payment.billingAddress.postalCode].filter(Boolean).join(", ")}
                                          {payment.billingAddress.country ? ` (${payment.billingAddress.country})` : ""}
                                        </p>
                                      </>
                                    ) : (
                                      <p className="text-muted-foreground">No billing address on file</p>
                                    )}
                                    {payment.metadata?.productName && (
                                      <p className="mt-1"><span className="text-muted-foreground">Product: </span>{payment.metadata.productName}</p>
                                    )}
                                  </div>
                                </div>

                                <div className="space-y-3">
                                  <h4 className="text-sm font-semibold flex items-center gap-1.5">
                                    <Shield className="h-3.5 w-3.5" />
                                    Verification & Risk
                                  </h4>
                                  <div className="text-sm space-y-1">
                                    {payment.riskAssessment?.riskLevel ? (
                                      <>
                                        <div className="flex items-center gap-2">
                                          <span className="text-muted-foreground">Risk Level: </span>
                                          <Badge
                                            variant="secondary"
                                            className={`no-default-hover-elevate no-default-active-elevate text-xs ${
                                              payment.riskAssessment.riskLevel === "normal"
                                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                : payment.riskAssessment.riskLevel === "elevated"
                                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                            }`}
                                          >
                                            {payment.riskAssessment.riskLevel}
                                          </Badge>
                                        </div>
                                        {payment.riskAssessment.riskScore !== null && (
                                          <p><span className="text-muted-foreground">Risk Score: </span>{payment.riskAssessment.riskScore}/100</p>
                                        )}
                                        {payment.riskAssessment.networkStatus && (
                                          <p className="capitalize"><span className="text-muted-foreground">Network: </span>{payment.riskAssessment.networkStatus.replace(/_/g, ' ')}</p>
                                        )}
                                        {payment.riskAssessment.sellerMessage && (
                                          <p><span className="text-muted-foreground">Result: </span>{payment.riskAssessment.sellerMessage}</p>
                                        )}
                                      </>
                                    ) : (
                                      <p className="text-muted-foreground">No risk data available</p>
                                    )}
                                    {payment.chargeStatus && (
                                      <p className="mt-1"><span className="text-muted-foreground">Charge: </span>{payment.chargeStatus}</p>
                                    )}
                                    <p className="text-xs text-muted-foreground break-all mt-2"><span className="font-medium">Session ID: </span>{payment.id}</p>
                                  </div>
                                </div>
                              </div>

                              {payment.refunds && payment.refunds.length > 0 && (
                                <div className="mt-4 pt-4 border-t">
                                  <h4 className="text-sm font-semibold flex items-center gap-1.5 mb-2">
                                    <RefreshCw className="h-3.5 w-3.5" />
                                    Refund History
                                  </h4>
                                  <div className="space-y-2">
                                    {payment.refunds.map((refund: any) => (
                                      <div key={refund.id} className="flex items-center justify-between text-sm p-2 bg-muted/30 rounded-md">
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <span className="font-medium">{refund.amount.toLocaleString("en-US", { style: "currency", currency: payment.currency || "usd" })}</span>
                                          <Badge
                                            variant="secondary"
                                            className={`no-default-hover-elevate no-default-active-elevate text-xs ${
                                              refund.status === "succeeded"
                                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                : refund.status === "pending"
                                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                            }`}
                                          >
                                            {refund.status}
                                          </Badge>
                                          {refund.reason && (
                                            <span className="text-muted-foreground capitalize">{refund.reason.replace(/_/g, ' ')}</span>
                                          )}
                                        </div>
                                        <span className="text-muted-foreground text-xs">
                                          {refund.createdAt ? format(new Date(refund.createdAt), "MMM d, yyyy h:mm a") : ""}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {payment.paymentIntentId && payment.paymentStatus === "paid" && payment.amount > payment.amountRefunded && (
                                <div className="mt-4 pt-4 border-t flex items-center justify-between gap-2">
                                  <div className="text-sm">
                                    {payment.amountRefunded > 0 ? (
                                      <span className="text-muted-foreground">
                                        Refunded: {payment.amountRefunded.toLocaleString("en-US", { style: "currency", currency: payment.currency || "usd" })} of {payment.amount.toLocaleString("en-US", { style: "currency", currency: payment.currency || "usd" })}
                                      </span>
                                    ) : (
                                      <span className="text-muted-foreground">No refunds issued</span>
                                    )}
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => { e.stopPropagation(); handleRefundClick(payment); }}
                                    data-testid={`button-refund-${payment.id}`}
                                  >
                                    <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                                    {payment.amountRefunded > 0 ? "Refund More" : "Issue Refund"}
                                  </Button>
                                </div>
                              )}

                              {payment.isRefunded && payment.amount <= payment.amountRefunded && (
                                <div className="mt-4 pt-4 border-t">
                                  <Badge variant="secondary" className="no-default-hover-elevate no-default-active-elevate bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                    Fully Refunded
                                  </Badge>
                                </div>
                              )}
                            </div>
                          </CollapsibleContent>
                        </Card>
                      </Collapsible>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No payments yet</h3>
                    <p className="text-muted-foreground">Payment data will appear here once customers make purchases.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="space-y-4">
            {reportsLoading ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-32 w-full" />
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-32 w-full" />
                  ))}
                </div>
                <Skeleton className="h-64 w-full" />
              </div>
            ) : reports ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card data-testid="card-total-revenue">
                    <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold" data-testid="text-total-revenue">
                        {(reports.overview?.totalRevenue || 0).toLocaleString("en-US", { style: "currency", currency: "usd" })}
                      </div>
                    </CardContent>
                  </Card>
                  <Card data-testid="card-revenue-month">
                    <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Revenue This Month</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold" data-testid="text-revenue-month">
                        {(reports.overview?.revenueThisMonth || 0).toLocaleString("en-US", { style: "currency", currency: "usd" })}
                      </div>
                    </CardContent>
                  </Card>
                  <Card data-testid="card-successful-payments">
                    <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Successful Payments</CardTitle>
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold" data-testid="text-successful-payments">
                        {reports.overview?.totalPaid || 0}
                      </div>
                    </CardContent>
                  </Card>
                  <Card data-testid="card-failed-payments">
                    <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Failed/Unpaid Payments</CardTitle>
                      <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold" data-testid="text-failed-payments">
                        {reports.overview?.totalUnpaid || 0}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card data-testid="card-active-subscriptions">
                    <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold" data-testid="text-active-subscriptions">
                        {reports.subscriptions?.active || 0}
                      </div>
                    </CardContent>
                  </Card>
                  <Card data-testid="card-total-leads">
                    <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold" data-testid="text-total-leads">
                        {reports.leads?.total || 0}
                      </div>
                    </CardContent>
                  </Card>
                  <Card data-testid="card-conversion-rate">
                    <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold" data-testid="text-conversion-rate">
                        {reports.leads?.conversionRate || 0}%
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {reports.monthlyRevenue && Object.keys(reports.monthlyRevenue).length > 0 && (
                  <Card data-testid="card-monthly-revenue">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Monthly Revenue Breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-3 px-2 font-medium">Month</th>
                              <th className="text-left py-3 px-2 font-medium">Revenue</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(reports.monthlyRevenue)
                              .sort(([a], [b]) => b.localeCompare(a))
                              .map(([month, revenue]: [string, any]) => (
                              <tr key={month} className="border-b last:border-0" data-testid={`row-monthly-revenue-${month}`}>
                                <td className="py-3 px-2">{month}</td>
                                <td className="py-3 px-2 font-medium" data-testid={`text-monthly-revenue-${month}`}>
                                  {(revenue).toLocaleString("en-US", { style: "currency", currency: "usd" })}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No report data available</h3>
                <p className="text-muted-foreground">Reports will be generated once payment data is available.</p>
              </div>
            )}
          </div>
        )}

        {/* Reset Patient Password Dialog */}
        <Dialog open={showResetPasswordDialog} onOpenChange={(open) => {
          if (!open) {
            setShowResetPasswordDialog(false);
            setSelectedLeadForReset(null);
            setResetPasswordResult(null);
          }
        }}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-primary" />
                Reset Patient Password
              </DialogTitle>
            </DialogHeader>
            {selectedLeadForReset && (
              <div className="space-y-4">
                {!resetPasswordResult ? (
                  <>
                    <div className="p-3 bg-muted/30 rounded-md space-y-1">
                      <div className="text-sm"><span className="font-medium">Patient:</span> {selectedLeadForReset.name}</div>
                      <div className="text-sm text-muted-foreground">{selectedLeadForReset.email}</div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      This will generate a temporary password for the patient's portal account. Share it with them by phone or SMS, and ask them to change it after logging in.
                    </p>
                    <p className="text-sm font-medium text-amber-700 bg-amber-50 border border-amber-100 rounded-md px-3 py-2">
                      If this patient doesn't have a portal account yet, this will fail. They must register at /patient first.
                    </p>
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" onClick={() => setShowResetPasswordDialog(false)}>Cancel</Button>
                      <Button
                        onClick={() => resetPasswordMutation.mutate({ email: selectedLeadForReset.email, leadId: selectedLeadForReset.id })}
                        disabled={resetPasswordMutation.isPending}
                        data-testid="button-confirm-reset-password"
                      >
                        {resetPasswordMutation.isPending ? "Generating..." : "Generate Temp Password"}
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-3 bg-green-50 border border-green-100 rounded-md space-y-1">
                      <div className="text-sm font-medium text-green-800">Password reset successful</div>
                      <div className="text-sm text-green-700">Account: {resetPasswordResult.patientName}</div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Temporary password — share this with the patient securely:</p>
                      <div className="flex items-center gap-2 bg-muted/40 border rounded-md px-3 py-2">
                        <code className="text-base font-mono flex-1 select-all" data-testid="text-temp-password">{resetPasswordResult.tempPassword}</code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 shrink-0"
                          onClick={() => { navigator.clipboard.writeText(resetPasswordResult!.tempPassword); toast({ title: "Copied to clipboard" }); }}
                          data-testid="button-copy-temp-password"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Ask the patient to log in with this password and change it immediately from their profile settings.</p>
                    <div className="flex justify-end">
                      <Button onClick={() => { setShowResetPasswordDialog(false); setResetPasswordResult(null); }}>Done</Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={showSMSDialog} onOpenChange={(open) => {
          if (!open) {
            setShowSMSDialog(false);
            setSelectedLeadForSMS(null);
            setSmsMessage("");
          }
        }}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Send Text Message
              </DialogTitle>
            </DialogHeader>
            {selectedLeadForSMS && (
              <div className="space-y-4">
                <div className="p-3 bg-muted/30 rounded-md space-y-1">
                  <div className="text-sm">
                    <span className="font-medium">To:</span> {selectedLeadForSMS.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Phone:</span> {selectedLeadForSMS.phone}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Message</Label>
                  <Textarea
                    placeholder="Type your message here..."
                    value={smsMessage}
                    onChange={(e) => setSmsMessage(e.target.value)}
                    rows={4}
                    maxLength={1600}
                    data-testid="input-sms-message"
                  />
                  <div className="text-xs text-muted-foreground text-right">
                    {smsMessage.length}/1600
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium">Quick templates:</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSmsMessage(`Hi ${selectedLeadForSMS.name.split(' ')[0]}, this is ArmorMeds. We received your inquiry and a provider will review your information shortly. Reply with any questions.`)}
                    data-testid="button-sms-template-inquiry"
                  >
                    Inquiry Received
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSmsMessage(`Hi ${selectedLeadForSMS.name.split(' ')[0]}, your ArmorMeds provider has reviewed your file. Please check your email for next steps. Questions? Reply here.`)}
                    data-testid="button-sms-template-reviewed"
                  >
                    File Reviewed
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSmsMessage(`Hi ${selectedLeadForSMS.name.split(' ')[0]}, just a friendly follow-up from ArmorMeds. We'd love to help you get started on your wellness journey. Reply or call us anytime.`)}
                    data-testid="button-sms-template-followup"
                  >
                    Follow-up
                  </Button>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowSMSDialog(false);
                      setSelectedLeadForSMS(null);
                      setSmsMessage("");
                    }}
                    data-testid="button-cancel-sms"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      if (selectedLeadForSMS?.phone && smsMessage.trim()) {
                        sendSMSMutation.mutate({ phone: selectedLeadForSMS.phone, message: smsMessage.trim() });
                      }
                    }}
                    disabled={!smsMessage.trim() || sendSMSMutation.isPending}
                    data-testid="button-confirm-sms"
                  >
                    {sendSMSMutation.isPending ? "Sending..." : "Send SMS"}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={showAppointmentDialog} onOpenChange={(open) => {
          if (!open) handleCloseAppointmentDialog();
        }}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Schedule Video Consultation
              </DialogTitle>
            </DialogHeader>
            {selectedLeadForAppt && (
              <AppointmentForm
                lead={selectedLeadForAppt}
                onSubmit={handleAppointmentSubmit}
                onCancel={handleCloseAppointmentDialog}
                isSubmitting={createAppointmentMutation.isPending}
              />
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={showNotesDialog} onOpenChange={(open) => {
          if (!open) handleCloseNotesDialog();
        }}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <StickyNote className="h-5 w-5" />
                Call Documentation
              </DialogTitle>
            </DialogHeader>
            {selectedAppointmentForNotes && (
              <div className="space-y-4">
                <div className="p-3 bg-muted/30 rounded-md">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="font-medium">Patient:</span> {selectedAppointmentForNotes.patientName}</div>
                    <div><span className="font-medium">Doctor:</span> {selectedAppointmentForNotes.doctorName}</div>
                    <div><span className="font-medium">Date:</span> {format(new Date(selectedAppointmentForNotes.scheduledAt), "MMM d, yyyy 'at' h:mm a")}</div>
                    <div><span className="font-medium">Status:</span> {selectedAppointmentForNotes.status}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Add Note</Label>
                  <Textarea
                    placeholder="Document the call discussion, findings, recommendations..."
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    rows={3}
                    data-testid="input-note-content"
                  />
                  <Button
                    onClick={handleAddNote}
                    disabled={!newNoteContent.trim() || createNoteMutation.isPending}
                    className="w-full"
                    data-testid="button-add-note"
                  >
                    {createNoteMutation.isPending ? "Saving..." : "Add Note"}
                  </Button>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                    <ClipboardList className="h-4 w-4" />
                    Previous Notes
                  </h4>
                  {appointmentNotes && appointmentNotes.length > 0 ? (
                    <div className="space-y-3">
                      {appointmentNotes.map((note) => (
                        <div key={note.id} className="p-3 bg-muted/30 rounded-md">
                          <div className="flex items-center justify-between mb-2 text-sm">
                            <span className="font-medium">{note.authorName}</span>
                            <span className="text-muted-foreground">{format(new Date(note.createdAt), "MMM d, yyyy h:mm a")}</span>
                          </div>
                          <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No notes yet for this appointment.</p>
                  )}
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={handleCloseNotesDialog}>
                    Close
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={showPrescriptionDialog} onOpenChange={(open) => {
          if (!open) handleClosePrescriptionDialog();
        }}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileSignature className="h-5 w-5" />
                {createdPrescription ? "Prescription Generated" : "Generate Prescription"}
              </DialogTitle>
            </DialogHeader>
            {createdPrescription ? (
              <PrescriptionView 
                prescription={createdPrescription} 
                onClose={handleClosePrescriptionDialog} 
              />
            ) : selectedLeadForRx ? (
              <PrescriptionForm
                lead={selectedLeadForRx}
                onSubmit={handlePrescriptionSubmit}
                onCancel={handleClosePrescriptionDialog}
                isSubmitting={createPrescriptionMutation.isPending}
              />
            ) : null}
          </DialogContent>
        </Dialog>

        {/* Ship Order Dialog */}
        <Dialog open={showShipmentDialog} onOpenChange={(open) => { if (!open) { setShowShipmentDialog(false); setSelectedLeadForShipment(null); } }}>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" /> Add Shipment Tracking
              </DialogTitle>
            </DialogHeader>
            {selectedLeadForShipment && (
              <div className="space-y-4">
                <div className="p-3 bg-muted/30 rounded-md text-sm">
                  <p className="font-medium">{selectedLeadForShipment.name}</p>
                  <p className="text-muted-foreground">{selectedLeadForShipment.email}</p>
                  {selectedLeadForShipment.medicationInterest && <p className="text-muted-foreground mt-0.5">Medication: {selectedLeadForShipment.medicationInterest}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Carrier</Label>
                  <Select value={shipmentForm.carrier} onValueChange={v => setShipmentForm(f => ({ ...f, carrier: v }))}>
                    <SelectTrigger data-testid="select-shipment-carrier">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usps">USPS</SelectItem>
                      <SelectItem value="ups">UPS</SelectItem>
                      <SelectItem value="fedex">FedEx</SelectItem>
                      <SelectItem value="dhl">DHL</SelectItem>
                      <SelectItem value="amazon">Amazon Logistics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tracking Number *</Label>
                  <Input
                    value={shipmentForm.trackingNumber}
                    onChange={e => setShipmentForm(f => ({ ...f, trackingNumber: e.target.value }))}
                    placeholder="e.g. 9400111899223456789012"
                    data-testid="input-tracking-number"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Estimated Delivery (optional)</Label>
                  <Input
                    type="date"
                    value={shipmentForm.estimatedDelivery}
                    onChange={e => setShipmentForm(f => ({ ...f, estimatedDelivery: e.target.value }))}
                    data-testid="input-estimated-delivery"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Notes (optional)</Label>
                  <Input
                    value={shipmentForm.notes}
                    onChange={e => setShipmentForm(f => ({ ...f, notes: e.target.value }))}
                    placeholder="e.g. 30-day supply of Semaglutide"
                    data-testid="input-shipment-notes"
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <Button variant="outline" className="flex-1" onClick={() => { setShowShipmentDialog(false); setSelectedLeadForShipment(null); }}>
                    Cancel
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleShipmentSubmit}
                    disabled={!shipmentForm.trackingNumber || createShipmentMutation.isPending}
                    data-testid="button-submit-shipment"
                  >
                    {createShipmentMutation.isPending ? "Creating..." : "Create Shipment"}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={showRefundDialog} onOpenChange={(open) => {
          if (!open) {
            setShowRefundDialog(false);
            setSelectedPaymentForRefund(null);
            setRefundAmount("");
            setRefundReason("");
            setRefundType("full");
          }
        }}>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                Issue Refund
              </DialogTitle>
            </DialogHeader>
            {selectedPaymentForRefund && (
              <div className="space-y-4">
                <div className="p-3 bg-muted/30 rounded-md space-y-1">
                  <p className="text-sm"><span className="text-muted-foreground">Customer: </span>{selectedPaymentForRefund.customerName || selectedPaymentForRefund.customerEmail}</p>
                  <p className="text-sm"><span className="text-muted-foreground">Original Amount: </span>{selectedPaymentForRefund.amount.toLocaleString("en-US", { style: "currency", currency: selectedPaymentForRefund.currency || "usd" })}</p>
                  {selectedPaymentForRefund.amountRefunded > 0 && (
                    <p className="text-sm"><span className="text-muted-foreground">Already Refunded: </span>{selectedPaymentForRefund.amountRefunded.toLocaleString("en-US", { style: "currency", currency: selectedPaymentForRefund.currency || "usd" })}</p>
                  )}
                  <p className="text-sm"><span className="text-muted-foreground">Refundable: </span>{(selectedPaymentForRefund.amount - selectedPaymentForRefund.amountRefunded).toLocaleString("en-US", { style: "currency", currency: selectedPaymentForRefund.currency || "usd" })}</p>
                </div>

                <div className="space-y-2">
                  <Label>Refund Type</Label>
                  <Select value={refundType} onValueChange={(val: "full" | "partial") => {
                    setRefundType(val);
                    if (val === "full") {
                      setRefundAmount(String(selectedPaymentForRefund.amount - selectedPaymentForRefund.amountRefunded));
                    }
                  }}>
                    <SelectTrigger data-testid="select-refund-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">Full Refund</SelectItem>
                      <SelectItem value="partial">Partial Refund</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {refundType === "partial" && (
                  <div className="space-y-2">
                    <Label>Refund Amount ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0.50"
                      max={selectedPaymentForRefund.amount - selectedPaymentForRefund.amountRefunded}
                      value={refundAmount}
                      onChange={(e) => setRefundAmount(e.target.value)}
                      data-testid="input-refund-amount"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Reason (optional)</Label>
                  <Select value={refundReason} onValueChange={setRefundReason}>
                    <SelectTrigger data-testid="select-refund-reason">
                      <SelectValue placeholder="Select a reason..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="duplicate">Duplicate charge</SelectItem>
                      <SelectItem value="fraudulent">Fraudulent</SelectItem>
                      <SelectItem value="requested_by_customer">Customer request</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md text-sm text-yellow-800 dark:text-yellow-200 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Refunds are processed through Stripe and cannot be undone. The customer will receive the refund within 5-10 business days.</span>
                </div>

                <DialogFooter className="gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowRefundDialog(false);
                      setSelectedPaymentForRefund(null);
                    }}
                    data-testid="button-cancel-refund"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleRefundSubmit}
                    disabled={refundMutation.isPending || (refundType === "partial" && (!refundAmount || Number(refundAmount) <= 0))}
                    data-testid="button-confirm-refund"
                  >
                    {refundMutation.isPending ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Confirm Refund
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {selectedLeadForCRM && (
          <LeadCrmPanel
            lead={selectedLeadForCRM}
            open={showCRMPanel}
            onOpenChange={(open) => {
              setShowCRMPanel(open);
              if (!open) setSelectedLeadForCRM(null);
            }}
            currentUserName={currentUser?.name || "Admin"}
          />
        )}
      </div>
    </div>
  );
}
