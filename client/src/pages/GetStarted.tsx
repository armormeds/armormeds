import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertLeadSchema } from "@shared/schema";
import { type InsertLead } from "@shared/routes";
import { useCreateLead } from "@/hooks/use-leads";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ArrowRight, ArrowLeft, Shield, Clock, Stethoscope, Upload, FileText, X, Lock, CreditCard } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { z } from "zod";
import { useUpload } from "@/hooks/use-upload";
import { Card, CardContent } from "@/components/ui/card";
import { useCheckout } from "@/hooks/use-checkout";
import { useStripeProducts } from "@/hooks/use-stripe-products";

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
  "Wisconsin", "Wyoming"
];

const GOALS = [
  { id: "weight_loss", label: "Weight Loss" },
  { id: "energy", label: "Energy & Vitality" },
  { id: "metabolic_health", label: "Metabolic Health" },
  { id: "appetite_control", label: "Appetite Control" },
  { id: "blood_sugar", label: "Blood Sugar Management" },
];

const MEDICAL_CONDITIONS = [
  { id: "high_blood_pressure", label: "High/Low Blood Pressure" },
  { id: "heart_issues", label: "Heart Related Issues" },
  { id: "irregular_heartbeat", label: "Irregular Heart Rhythm" },
  { id: "liver_kidney", label: "Liver or Kidney Issues" },
  { id: "chest_pain", label: "Chest Pain or Angina" },
  { id: "blood_disorders", label: "Blood Disorders (Leukemia, Sickle Cell, etc.)" },
  { id: "retinopathy", label: "Retinopathy" },
  { id: "stroke", label: "Stroke History" },
  { id: "none", label: "NONE" },
];

const SOLUTION_TYPES = [
  { id: "injections", label: "Injections (Weekly)" },
  { id: "pills", label: "Pills (Daily)" },
];

const formSchema = insertLeadSchema.extend({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  goals: z.array(z.string()).optional(),
  state: z.string().optional(),
  patientType: z.string().optional(),
  previousTreatments: z.string().optional(),
  solutionTypes: z.array(z.string()).optional(),
  medicalConditions: z.array(z.string()).optional(),
  currentMedications: z.string().optional(),
  allergies: z.string().optional(),
  dateOfBirth: z.string().optional(),
  heightFeet: z.string().optional(),
  heightInches: z.string().optional(),
  weight: z.string().optional(),
  sex: z.string().optional(),
  hasPancreatitis: z.string().optional(),
  hasThyroidCancer: z.string().optional(),
  hasKidneyIssues: z.string().optional(),
  hasDiabetes: z.string().optional(),
  isPregnant: z.string().optional(),
  previousGlp: z.string().optional(),
  glpDetails: z.string().optional(),
  consentGiven: z.string().optional(),
  documentPaths: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof formSchema>;

interface UploadedFile {
  name: string;
  path: string;
  size: number;
}

const TOTAL_STEPS = 8;
const ALLOWED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function GetStarted() {
  const { mutate, isPending } = useCreateLead();
  const [isSuccess, setIsSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedPriceId, setSelectedPriceId] = useState<string | null>(() => {
    // Initialize from sessionStorage if available
    try {
      return sessionStorage.getItem('selectedPriceId') || null;
    } catch {
      return null;
    }
  });
  const { checkout, isLoading: isCheckoutLoading } = useCheckout();
  const { products: stripeProducts, isLoading: isProductsLoading } = useStripeProducts("weight-loss");

  // Persist selectedPriceId to sessionStorage
  useEffect(() => {
    if (selectedPriceId) {
      sessionStorage.setItem('selectedPriceId', selectedPriceId);
    }
  }, [selectedPriceId]);
  const { uploadFile } = useUpload({
    onSuccess: (response) => {
      const newFile: UploadedFile = {
        name: response.metadata.name,
        path: response.objectPath,
        size: response.metadata.size,
      };
      setUploadedFiles(prev => [...prev, newFile]);
    },
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      medicationInterest: "",
      message: "",
      goals: [],
      state: "",
      patientType: "",
      previousTreatments: "",
      solutionTypes: [],
      medicalConditions: [],
      currentMedications: "",
      allergies: "",
      dateOfBirth: "",
      heightFeet: "",
      heightInches: "",
      weight: "",
      sex: "",
      hasPancreatitis: "",
      hasThyroidCancer: "",
      hasKidneyIssues: "",
      hasDiabetes: "",
      isPregnant: "",
      previousGlp: "",
      glpDetails: "",
      consentGiven: "",
      documentPaths: [],
    }
  });

  const onSubmit = (data: FormData) => {
    const submitData = {
      ...data,
      documentPaths: uploadedFiles.map(f => f.path),
    };
    mutate(submitData as InsertLead, {
      onSuccess: () => setIsSuccess(true)
    });
  };

  const handleCheckout = () => {
    if (!selectedPriceId) return;
    
    const formData = form.getValues();
    const submitData = {
      ...formData,
      documentPaths: uploadedFiles.map(f => f.path),
    };
    
    sessionStorage.setItem('pendingLeadData', JSON.stringify(submitData));
    
    const selectedProduct = stripeProducts.find(p => 
      p.prices.some(price => price.id === selectedPriceId)
    );
    
    checkout({
      priceId: selectedPriceId,
      productName: selectedProduct?.name,
      customerEmail: formData.email,
    });
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount / 100);
  };

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        alert(`File type not allowed: ${file.name}. Please upload PDF, JPEG, or PNG files only.`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        alert(`File too large: ${file.name}. Maximum size is 10MB.`);
        continue;
      }

      setIsUploading(true);
      try {
        await uploadFile(file);
      } catch (error) {
        console.error("Upload failed:", error);
      } finally {
        setIsUploading(false);
      }
    }
    e.target.value = "";
  }, [uploadFile]);

  const removeFile = (path: string) => {
    setUploadedFiles(prev => prev.filter(f => f.path !== path));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getFieldsForStep = (step: number): (keyof FormData)[] => {
    switch (step) {
      case 1: return []; // Medication selection - validated by selectedPriceId
      case 2: return []; // Goals
      case 3: return ["email"]; // Contact info
      case 4: return ["name"]; // Personal info
      case 5: return []; // Medical history
      case 6: return []; // GLP-1 questions
      case 7: return []; // Documents
      case 8: return []; // Review & consent
      default: return [];
    }
  };

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    if (fieldsToValidate.length > 0) {
      const isValid = await form.trigger(fieldsToValidate);
      if (!isValid) return;
    }
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = (currentStep / TOTAL_STEPS) * 100;

  if (isSuccess) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-slate-50 flex items-center justify-center px-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-12 max-w-lg w-full text-center shadow-xl border border-gray-100"
        >
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-display font-bold mb-4 text-slate-900" data-testid="text-success-title">Medical Form Submitted!</h2>
          <p className="text-slate-600 mb-8 text-lg">
            Thank you for completing your medical intake form. A licensed provider will review your information and contact you within 24-48 hours to discuss your treatment options.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-slate-500 mb-8">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>24-48 hour response</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>HIPAA Compliant</span>
            </div>
          </div>
          <Button 
            className="w-full h-12 rounded-xl"
            onClick={() => window.location.href = '/'}
            data-testid="button-return-home"
          >
            Return Home
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-28 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-display font-bold text-slate-900 mb-3">
            Medical Intake Form
          </h1>
          <p className="text-slate-600">
            Complete this form to see if you qualify for our weight management program.
          </p>
        </motion.div>

        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
            <span>Step {currentStep} of {TOTAL_STEPS}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8"
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {currentStep > 1 && selectedPriceId && (() => {
                const selectedProduct = stripeProducts.find(p => 
                  p.prices.some(price => price.id === selectedPriceId)
                );
                const selectedPrice = selectedProduct?.prices.find(p => p.id === selectedPriceId);
                if (selectedProduct && selectedPrice) {
                  return (
                    <div className="mb-6 bg-primary/5 border border-primary/20 rounded-xl p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <CreditCard className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{selectedProduct.name}</p>
                          <p className="text-xs text-slate-500">Selected Plan</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">{formatPrice(selectedPrice.unit_amount)}</p>
                        <p className="text-xs text-slate-500">per {selectedPrice.recurring?.interval}</p>
                      </div>
                    </div>
                  );
                }
                return null;
              })()}
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold text-slate-900 mb-2">Choose Your Treatment Plan</h2>
                      <p className="text-slate-600">Select your preferred medication to get started</p>
                    </div>

                    {isProductsLoading ? (
                      <div className="space-y-4">
                        {[1, 2].map((i) => (
                          <div key={i} className="h-32 bg-slate-100 rounded-xl animate-pulse" />
                        ))}
                      </div>
                    ) : stripeProducts.length === 0 ? (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800">
                        No treatment plans available at this time. Please contact support.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {stripeProducts.map((product) => {
                          const price = product.prices.find(p => p.active && p.recurring);
                          if (!price) return null;
                          return (
                            <Card 
                              key={product.id}
                              className={`cursor-pointer transition-all ${
                                selectedPriceId === price.id 
                                  ? 'ring-2 ring-primary border-primary' 
                                  : 'hover:border-primary/50'
                              }`}
                              onClick={() => setSelectedPriceId(price.id)}
                              data-testid={`card-product-${product.id}`}
                            >
                              <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-4">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                      selectedPriceId === price.id 
                                        ? 'border-primary bg-primary' 
                                        : 'border-gray-300'
                                    }`}>
                                      {selectedPriceId === price.id && (
                                        <div className="w-2 h-2 bg-white rounded-full" />
                                      )}
                                    </div>
                                    <div>
                                      <h3 className="font-semibold text-lg text-slate-900">{product.name}</h3>
                                      <p className="text-sm text-slate-600">{product.description}</p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-2xl font-bold text-primary">{formatPrice(price.unit_amount)}</p>
                                    <p className="text-sm text-slate-500">per {price.recurring?.interval}</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    )}

                    <div className="bg-green-50 rounded-xl p-4 flex items-start gap-3">
                      <CreditCard className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-green-900">Secure Payment</h4>
                        <p className="text-sm text-green-800">
                          Your payment is processed securely through Stripe. Cancel anytime with no hidden fees.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step2-goals"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold text-slate-900 mb-2">What are your goals?</h2>
                      <p className="text-slate-600">Select all that apply to you</p>
                    </div>

                    <FormField
                      control={form.control}
                      name="goals"
                      render={() => (
                        <FormItem>
                          <div className="grid gap-3">
                            {GOALS.map((goal) => (
                              <FormField
                                key={goal.id}
                                control={form.control}
                                name="goals"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={goal.id}
                                      className="flex items-center space-x-3 space-y-0 p-4 rounded-xl border border-gray-200 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(goal.id)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...(field.value || []), goal.id])
                                              : field.onChange(
                                                  field.value?.filter((value) => value !== goal.id)
                                                );
                                          }}
                                          data-testid={`checkbox-goal-${goal.id}`}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-medium cursor-pointer flex-1">
                                        {goal.label}
                                      </FormLabel>
                                    </FormItem>
                                  );
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold text-slate-900 mb-2">Contact Information</h2>
                      <p className="text-slate-600">How can we reach you?</p>
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address *</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="your@email.com" 
                              className="h-12 rounded-xl"
                              data-testid="input-email"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input 
                              type="tel" 
                              placeholder="(555) 123-4567" 
                              className="h-12 rounded-xl"
                              data-testid="input-phone"
                              {...field} 
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Which state do you live in?</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                            <FormControl>
                              <SelectTrigger className="h-12 rounded-xl" data-testid="select-state">
                                <SelectValue placeholder="Select your state" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {US_STATES.map((state) => (
                                <SelectItem key={state} value={state}>{state}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="patientType"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Are you a new or existing patient?</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-2"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0 p-3 rounded-lg border border-gray-200 hover:border-primary/50 transition-colors">
                                <FormControl>
                                  <RadioGroupItem value="new" data-testid="radio-patient-new" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">New Patient</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0 p-3 rounded-lg border border-gray-200 hover:border-primary/50 transition-colors">
                                <FormControl>
                                  <RadioGroupItem value="existing" data-testid="radio-patient-existing" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">Existing Patient</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                )}

                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold text-slate-900 mb-2">Personal Information</h2>
                      <p className="text-slate-600">Tell us about yourself</p>
                    </div>

                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Jane Doe" 
                              className="h-12 rounded-xl"
                              data-testid="input-name"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl>
                            <Input 
                              type="date" 
                              className="h-12 rounded-xl"
                              data-testid="input-dob"
                              {...field} 
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sex"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Sex</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex gap-4"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0 p-3 rounded-lg border border-gray-200 hover:border-primary/50 transition-colors flex-1">
                                <FormControl>
                                  <RadioGroupItem value="male" data-testid="radio-sex-male" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">Male</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0 p-3 rounded-lg border border-gray-200 hover:border-primary/50 transition-colors flex-1">
                                <FormControl>
                                  <RadioGroupItem value="female" data-testid="radio-sex-female" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">Female</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="heightFeet"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Height (ft)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="5" 
                                className="h-12 rounded-xl"
                                data-testid="input-height-feet"
                                {...field} 
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="heightInches"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Height (in)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="8" 
                                className="h-12 rounded-xl"
                                data-testid="input-height-inches"
                                {...field} 
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Weight (lbs)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="180" 
                                className="h-12 rounded-xl"
                                data-testid="input-weight"
                                {...field} 
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </motion.div>
                )}

                {currentStep === 5 && (
                  <motion.div
                    key="step5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold text-slate-900 mb-2">Medical History</h2>
                      <p className="text-slate-600">Help us understand your health background</p>
                    </div>

                    <FormField
                      control={form.control}
                      name="medicalConditions"
                      render={() => (
                        <FormItem>
                          <FormLabel>Do you have any of the following conditions?</FormLabel>
                          <div className="grid gap-2 mt-2">
                            {MEDICAL_CONDITIONS.map((condition) => (
                              <FormField
                                key={condition.id}
                                control={form.control}
                                name="medicalConditions"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={condition.id}
                                      className="flex items-center space-x-3 space-y-0 p-3 rounded-lg border border-gray-200 hover:border-primary/50 transition-colors"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(condition.id)}
                                          onCheckedChange={(checked) => {
                                            if (condition.id === "none" && checked) {
                                              field.onChange(["none"]);
                                            } else if (checked) {
                                              const filtered = field.value?.filter(v => v !== "none") || [];
                                              field.onChange([...filtered, condition.id]);
                                            } else {
                                              field.onChange(
                                                field.value?.filter((value) => value !== condition.id)
                                              );
                                            }
                                          }}
                                          data-testid={`checkbox-condition-${condition.id}`}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal cursor-pointer text-sm">
                                        {condition.label}
                                      </FormLabel>
                                    </FormItem>
                                  );
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="currentMedications"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Medications</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="List any medications you are currently taking (or write 'None')" 
                              className="min-h-[80px] rounded-xl resize-none"
                              data-testid="textarea-medications"
                              {...field} 
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="allergies"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Allergies</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="List any allergies (or write 'None')" 
                              className="h-12 rounded-xl"
                              data-testid="input-allergies"
                              {...field} 
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                )}

                {currentStep === 6 && (
                  <motion.div
                    key="step6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold text-slate-900 mb-2">GLP-1 Specific Questions</h2>
                      <p className="text-slate-600">Important safety information</p>
                    </div>

                    <FormField
                      control={form.control}
                      name="hasPancreatitis"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Do you have pancreatitis or a history of pancreatitis?</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex gap-4"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0 p-3 rounded-lg border border-gray-200 hover:border-primary/50 transition-colors flex-1">
                                <FormControl>
                                  <RadioGroupItem value="yes" data-testid="radio-pancreatitis-yes" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">Yes</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0 p-3 rounded-lg border border-gray-200 hover:border-primary/50 transition-colors flex-1">
                                <FormControl>
                                  <RadioGroupItem value="no" data-testid="radio-pancreatitis-no" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">No</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="hasThyroidCancer"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Do you have medullary thyroid cancer or a family history of it?</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex gap-4"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0 p-3 rounded-lg border border-gray-200 hover:border-primary/50 transition-colors flex-1">
                                <FormControl>
                                  <RadioGroupItem value="yes" data-testid="radio-thyroid-yes" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">Yes</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0 p-3 rounded-lg border border-gray-200 hover:border-primary/50 transition-colors flex-1">
                                <FormControl>
                                  <RadioGroupItem value="no" data-testid="radio-thyroid-no" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">No</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="hasKidneyIssues"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Do you have renal (kidney) impairment?</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex gap-4"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0 p-3 rounded-lg border border-gray-200 hover:border-primary/50 transition-colors flex-1">
                                <FormControl>
                                  <RadioGroupItem value="yes" data-testid="radio-kidney-yes" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">Yes</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0 p-3 rounded-lg border border-gray-200 hover:border-primary/50 transition-colors flex-1">
                                <FormControl>
                                  <RadioGroupItem value="no" data-testid="radio-kidney-no" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">No</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="previousGlp"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Have you previously taken a GLP-1 medication (Ozempic, Wegovy, Mounjaro, etc.)?</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex gap-4"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0 p-3 rounded-lg border border-gray-200 hover:border-primary/50 transition-colors flex-1">
                                <FormControl>
                                  <RadioGroupItem value="yes" data-testid="radio-glp-yes" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">Yes</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0 p-3 rounded-lg border border-gray-200 hover:border-primary/50 transition-colors flex-1">
                                <FormControl>
                                  <RadioGroupItem value="no" data-testid="radio-glp-no" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">No</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {form.watch("previousGlp") === "yes" && (
                      <FormField
                        control={form.control}
                        name="glpDetails"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Please provide details about your previous GLP-1 experience</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Which medication did you take? What dosage? How long ago?" 
                                className="min-h-[80px] rounded-xl resize-none"
                                data-testid="textarea-glp-details"
                                {...field} 
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="medicationInterest"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Which medication are you interested in?</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                            <FormControl>
                              <SelectTrigger className="h-12 rounded-xl" data-testid="select-medication">
                                <SelectValue placeholder="Select medication" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="semaglutide">Semaglutide</SelectItem>
                              <SelectItem value="tirzepatide">Tirzepatide</SelectItem>
                              <SelectItem value="unsure">Not sure / Need advice</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                )}

                {currentStep === 7 && (
                  <motion.div
                    key="step7"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold text-slate-900 mb-2">Secure Document Upload</h2>
                      <p className="text-slate-600">Upload any relevant medical documents (optional)</p>
                    </div>

                    <Card className="border-2 border-dashed border-gray-200 hover:border-primary/50 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-3 mb-4">
                          <Lock className="w-5 h-5 text-primary mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-slate-900">HIPAA-Compliant Storage</h4>
                            <p className="text-sm text-muted-foreground">
                              Your documents are encrypted and securely stored. Only authorized healthcare providers can access them.
                            </p>
                          </div>
                        </div>

                        <div className="text-center py-6">
                          <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-sm text-muted-foreground mb-4">
                            Upload photo ID, lab results, or other medical documents
                          </p>
                          <div className="flex justify-center">
                            <label className="cursor-pointer">
                              <input
                                type="file"
                                className="hidden"
                                accept=".pdf,.jpg,.jpeg,.png"
                                multiple
                                onChange={handleFileUpload}
                                disabled={isUploading}
                                data-testid="input-file-upload"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                disabled={isUploading}
                                onClick={(e) => {
                                  e.preventDefault();
                                  const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                  input?.click();
                                }}
                                data-testid="button-upload-files"
                              >
                                {isUploading ? "Uploading..." : "Select Files"}
                              </Button>
                            </label>
                          </div>
                          <p className="text-xs text-muted-foreground mt-3">
                            Accepted formats: PDF, JPEG, PNG (max 10MB each)
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {uploadedFiles.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm text-slate-700">Uploaded Documents</h4>
                        {uploadedFiles.map((file) => (
                          <div
                            key={file.path}
                            className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                            data-testid={`file-item-${file.path}`}
                          >
                            <div className="flex items-center gap-3">
                              <FileText className="w-5 h-5 text-primary" />
                              <div>
                                <p className="text-sm font-medium text-slate-700">{file.name}</p>
                                <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFile(file.path)}
                              data-testid={`button-remove-file-${file.path}`}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="bg-blue-50 rounded-xl p-4 flex items-start gap-3">
                      <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-blue-800">
                          Document upload is optional. You can skip this step and submit documents later via email if preferred.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 8 && (
                  <motion.div
                    key="step8"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold text-slate-900 mb-2">Review & Consent</h2>
                      <p className="text-slate-600">Almost done! Please review and agree to our terms.</p>
                    </div>

                    {(() => {
                      const selectedProduct = stripeProducts.find(p => 
                        p.prices.some(price => price.id === selectedPriceId)
                      );
                      const selectedPrice = selectedProduct?.prices.find(p => p.id === selectedPriceId);
                      if (selectedProduct && selectedPrice) {
                        return (
                          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-slate-900">Your Selected Plan</h4>
                              <p className="text-sm text-slate-600">{selectedProduct.name}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold text-primary">{formatPrice(selectedPrice.unit_amount)}</p>
                              <p className="text-sm text-slate-500">per {selectedPrice.recurring?.interval}</p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })()}

                    <div className="bg-slate-50 rounded-xl p-6 space-y-4">
                      <div className="flex items-start gap-3">
                        <Stethoscope className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-slate-900">Telehealth Consultation</h4>
                          <p className="text-sm text-slate-600">
                            I understand that I will receive a telehealth consultation with a licensed healthcare provider who will review my medical history and determine my eligibility for treatment.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-slate-900">Privacy & HIPAA Compliance</h4>
                          <p className="text-sm text-slate-600">
                            My personal health information will be kept confidential and handled in accordance with HIPAA regulations.
                          </p>
                        </div>
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="consentGiven"
                      render={({ field }) => (
                        <FormItem className="flex items-start space-x-3 space-y-0 p-4 rounded-xl border border-gray-200">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "yes"}
                              onCheckedChange={(checked) => {
                                field.onChange(checked ? "yes" : "");
                              }}
                              data-testid="checkbox-consent"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="font-medium">
                              I agree to the terms and conditions
                            </FormLabel>
                            <p className="text-sm text-slate-500">
                              By checking this box, I confirm that the information provided is accurate and I consent to telehealth services.
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Comments (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Is there anything else you'd like us to know?" 
                              className="min-h-[80px] rounded-xl resize-none"
                              data-testid="textarea-message"
                              {...field} 
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-between gap-4 mt-8 pt-6 border-t">
                {currentStep > 1 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="h-12 px-6 rounded-xl"
                    data-testid="button-prev-step"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                ) : (
                  <div />
                )}

                {currentStep === 1 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!selectedPriceId}
                    className="h-12 px-8 rounded-xl"
                    data-testid="button-next-step"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : currentStep === 8 ? (
                  <Button
                    type="button"
                    onClick={handleCheckout}
                    disabled={form.watch("consentGiven") !== "yes" || isCheckoutLoading}
                    className="h-12 px-8 rounded-xl"
                    data-testid="button-checkout"
                  >
                    {isCheckoutLoading ? "Processing..." : "Complete Purchase"}
                    <CreditCard className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="h-12 px-8 rounded-xl"
                    data-testid="button-next-step"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </motion.div>

        <p className="text-xs text-center text-slate-400 mt-6">
          Your information is encrypted and secure. We never share your data with third parties.
        </p>
      </div>
    </div>
  );
}
