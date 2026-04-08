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
import { useState, useCallback, useEffect, useMemo } from "react";
import { z } from "zod";
import { useUpload } from "@/hooks/use-upload";
import { Card, CardContent } from "@/components/ui/card";
import { useCheckout } from "@/hooks/use-checkout";
import { useStripeProducts } from "@/hooks/use-stripe-products";
import { useSearch } from "wouter";

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

const WEIGHT_LOSS_GOALS = [
  { id: "weight_loss", label: "Weight Loss" },
  { id: "energy", label: "Energy & Vitality" },
  { id: "metabolic_health", label: "Metabolic Health" },
  { id: "appetite_control", label: "Appetite Control" },
  { id: "blood_sugar", label: "Blood Sugar Management" },
];

const HAIR_LOSS_GOALS = [
  { id: "stop_hair_loss", label: "Stop Hair Loss" },
  { id: "regrow_hair", label: "Regrow Hair" },
  { id: "thicken_hair", label: "Thicken Existing Hair" },
  { id: "prevent_further_loss", label: "Prevent Further Loss" },
  { id: "boost_confidence", label: "Boost Confidence" },
];

const SEXUAL_HEALTH_GOALS = [
  { id: "improve_performance", label: "Improve Performance" },
  { id: "maintain_erection", label: "Maintain Erection" },
  { id: "increase_confidence", label: "Increase Confidence" },
  { id: "spontaneous_intimacy", label: "More Spontaneous Intimacy" },
  { id: "overall_wellness", label: "Overall Sexual Wellness" },
];

// MEDVi Health Questions 1 — Disqualifying conditions
const DISQUALIFYING_CONDITIONS = [
  { id: "end_stage_kidney", label: "End-stage kidney disease (on or about to be on dialysis)" },
  { id: "end_stage_liver", label: "End-stage liver disease (cirrhosis)" },
  { id: "suicidal_thoughts", label: "Current suicidal thoughts and/or prior suicidal attempt" },
  { id: "active_cancer", label: "Cancer (active diagnosis, active treatment, or in remission / cancer-free for less than 5 continuous years — does not apply to non-melanoma skin cancer cured via simple excision)" },
  { id: "severe_gi", label: "Severe gastrointestinal condition (gastroparesis, blockage, inflammatory bowel disease)" },
  { id: "substance_disorder", label: "Current diagnosis of or treatment for alcohol, opioid, or substance use disorder/dependence" },
  { id: "none_disqualifying", label: "None of the above" },
];

// MEDVi Health Questions 2 — Monitoring conditions
const MONITORING_CONDITIONS = [
  { id: "gallbladder", label: "Gallbladder disease" },
  { id: "hypertension", label: "Hypertension (high blood pressure)" },
  { id: "seizures", label: "Seizures" },
  { id: "glaucoma", label: "Glaucoma" },
  { id: "sleep_apnea", label: "Sleep apnea" },
  { id: "t2_diabetes_no_insulin", label: "Type 2 diabetes (not on insulin)" },
  { id: "t2_diabetes_insulin", label: "Type 2 diabetes (on insulin)" },
  { id: "t1_diabetes", label: "Type 1 diabetes" },
  { id: "diabetic_retinopathy", label: "Diabetic retinopathy (diabetic eye disease), damage to the optic nerve from trauma or reduced blood flow, or blindness" },
  { id: "warfarin", label: "Use of the blood thinner warfarin (Coumadin/Jantoven)" },
  { id: "pancreatitis", label: "History of or current pancreatitis" },
  { id: "thyroid_cancer", label: "Personal or family history of thyroid cyst/nodule, thyroid cancer, medullary thyroid carcinoma, or multiple endocrine neoplasia syndrome type 2" },
  { id: "gout", label: "Gout" },
  { id: "high_cholesterol", label: "High cholesterol or triglycerides" },
  { id: "depression", label: "Depression" },
  { id: "head_injury", label: "Head injury" },
  { id: "brain_tumor", label: "Tumor/infection in brain/spinal cord" },
  { id: "low_sodium", label: "Low sodium" },
  { id: "liver_disease", label: "Liver disease, including fatty liver" },
  { id: "kidney_disease", label: "Kidney disease" },
  { id: "tachycardia", label: "Elevated resting heart rate (tachycardia)" },
  { id: "heart_attack_stroke", label: "Coronary artery disease or heart attack/stroke in last 2 years" },
  { id: "medication_allergy", label: "Allergic to any medication" },
  { id: "heart_failure", label: "Congestive heart failure" },
  { id: "qt_prolongation", label: "QT prolongation or other heart rhythm disorder" },
  { id: "recent_hospitalization", label: "Hospitalization within the last 1 year" },
  { id: "hiv", label: "Human immunodeficiency virus (HIV)" },
  { id: "acid_reflux", label: "Acid reflux" },
  { id: "asthma", label: "Asthma/reactive airway disease" },
  { id: "urinary_incontinence", label: "Urinary stress incontinence" },
  { id: "pcos", label: "Polycystic ovarian syndrome (PCOS)" },
  { id: "low_testosterone", label: "Clinically proven low testosterone" },
  { id: "osteoarthritis", label: "Osteoarthritis" },
  { id: "constipation", label: "Constipation" },
  { id: "none_monitoring", label: "None of the above" },
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
  consentAccuracy: z.string().optional(),
  consentTelehealth: z.string().optional(),
  documentPaths: z.array(z.string()).optional(),
  goalWeight: z.string().optional(),
  bloodPressureRange: z.string().optional(),
  heartRateRange: z.string().optional(),
  hasOpiateUse: z.string().optional(),
  hasPriorSurgery: z.string().optional(),
  hasDisqualifyingConditions: z.array(z.string()).optional(),
  hasMonitoringConditions: z.array(z.string()).optional(),
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
    try {
      return sessionStorage.getItem('selectedPriceId') || null;
    } catch {
      return null;
    }
  });
  const { checkout, isLoading: isCheckoutLoading } = useCheckout();
  
  const searchString = useSearch();
  const category = useMemo(() => {
    const params = new URLSearchParams(searchString);
    return params.get('category') || 'weight-loss';
  }, [searchString]);
  
  const { products: stripeProducts, isLoading: isProductsLoading } = useStripeProducts(category);
  
  const medicationOptions = useMemo(() => {
    switch (category) {
      case 'hair-loss':
        return [
          { value: 'finasteride', label: 'Finasteride' },
          { value: 'minoxidil', label: 'Minoxidil' },
          { value: 'unsure', label: 'Not sure / Need advice' },
        ];
      case 'sexual-health':
        return [
          { value: 'sildenafil', label: 'Sildenafil (Generic Viagra)' },
          { value: 'tadalafil', label: 'Tadalafil (Generic Cialis)' },
          { value: 'vardenafil', label: 'Vardenafil (Generic Levitra)' },
          { value: 'unsure', label: 'Not sure / Need advice' },
        ];
      default:
        return [
          { value: 'semaglutide', label: 'Semaglutide' },
          { value: 'tirzepatide', label: 'Tirzepatide' },
          { value: 'unsure', label: 'Not sure / Need advice' },
        ];
    }
  }, [category]);
  
  const categoryLabels = useMemo(() => {
    switch (category) {
      case 'hair-loss':
        return {
          programName: 'hair restoration program',
          step6Title: 'Treatment-Specific Questions',
          step6Subtitle: 'Help us understand your hair loss history',
        };
      case 'sexual-health':
        return {
          programName: 'sexual wellness program',
          step6Title: 'Treatment-Specific Questions',
          step6Subtitle: 'Help us understand your needs',
        };
      default:
        return {
          programName: 'weight management program',
          step6Title: 'GLP-1 Specific Questions',
          step6Subtitle: 'Important safety information',
        };
    }
  }, [category]);
  
  const isWeightLoss = category === 'weight-loss';
  const isHairLoss = category === 'hair-loss';
  const isSexualHealth = category === 'sexual-health';
  
  const goals = useMemo(() => {
    switch (category) {
      case 'hair-loss':
        return HAIR_LOSS_GOALS;
      case 'sexual-health':
        return SEXUAL_HEALTH_GOALS;
      default:
        return WEIGHT_LOSS_GOALS;
    }
  }, [category]);

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
      consentAccuracy: "",
      consentTelehealth: "",
      documentPaths: [],
      goalWeight: "",
      bloodPressureRange: "",
      heartRateRange: "",
      hasOpiateUse: "",
      hasPriorSurgery: "",
      hasDisqualifyingConditions: [],
      hasMonitoringConditions: [],
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

  const dobValue = form.watch("dateOfBirth");
  const isUnderAge = (() => {
    if (!dobValue) return false;
    const dob = new Date(dobValue);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear() -
      (today < new Date(today.getFullYear(), dob.getMonth(), dob.getDate()) ? 1 : 0);
    return age < 18;
  })();

  if (isSuccess) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-background flex items-center justify-center px-4">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-card rounded-xl p-8 sm:p-10 max-w-md w-full text-center shadow-lg border border-border/50"
        >
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-display font-bold mb-3" data-testid="text-success-title">Form Submitted!</h2>
          <p className="text-muted-foreground mb-6">
            Your intake form has been received. A licensed provider will review your information within 24–48 hours and may reach out by phone or text. No email confirmation will be sent at this time.
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground mb-6">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> 24-48 hours
            </span>
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" /> HIPAA Compliant
            </span>
          </div>
          <div className="space-y-2">
            <Button 
              className="w-full rounded-full"
              onClick={() => window.location.href = '/schedule'}
              data-testid="button-schedule-consultation"
            >
              Schedule Consultation
            </Button>
            <Button 
              variant="outline"
              className="w-full rounded-full"
              onClick={() => window.location.href = '/'}
              data-testid="button-return-home"
            >
              Return Home
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-3xl font-display font-bold mb-2">
            Medical Intake Form
          </h1>
          <p className="text-muted-foreground">
            Complete this form to see if you qualify for our {categoryLabels.programName}.
          </p>
        </motion.div>

        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Step {currentStep} of {TOTAL_STEPS}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl shadow-md border border-border/50 p-6 sm:p-8"
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
                            {goals.map((goal) => (
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
                          {isUnderAge && (
                            <p className="text-sm text-red-600 font-medium mt-1 flex items-center gap-2" data-testid="text-underage-warning">
                              ⚠️ You must be 18 or older to use this service. Please speak with a doctor in person.
                            </p>
                          )}
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

                    {isWeightLoss && (
                      <>
                        <div className="grid grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name="heightFeet"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Height (ft)</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                                  <FormControl>
                                    <SelectTrigger className="h-12 rounded-xl" data-testid="select-height-feet">
                                      <SelectValue placeholder="Ft" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {[4,5,6,7].map(n => <SelectItem key={n} value={String(n)}>{n} ft</SelectItem>)}
                                  </SelectContent>
                                </Select>
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
                                <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                                  <FormControl>
                                    <SelectTrigger className="h-12 rounded-xl" data-testid="select-height-inches">
                                      <SelectValue placeholder="In" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {[0,1,2,3,4,5,6,7,8,9,10,11].map(n => <SelectItem key={n} value={String(n)}>{n} in</SelectItem>)}
                                  </SelectContent>
                                </Select>
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

                        <FormField
                          control={form.control}
                          name="goalWeight"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>What is your goal weight? (lbs)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="e.g. 160" 
                                  className="h-12 rounded-xl"
                                  data-testid="input-goal-weight"
                                  {...field} 
                                  value={field.value || ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}
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
                      <h2 className="text-2xl font-bold text-slate-900 mb-2">Health Questions</h2>
                      <p className="text-slate-600">Please select all conditions that apply to you</p>
                    </div>

                    <FormField
                      control={form.control}
                      name="hasDisqualifyingConditions"
                      render={() => (
                        <FormItem>
                          <div className="mb-3">
                            <FormLabel className="text-base font-semibold">Do any of these apply to you?</FormLabel>
                          </div>
                          <div className="grid gap-2">
                            {DISQUALIFYING_CONDITIONS.map((condition) => (
                              <FormField
                                key={condition.id}
                                control={form.control}
                                name="hasDisqualifyingConditions"
                                render={({ field }) => (
                                  <FormItem className="flex items-start space-x-3 space-y-0 p-3 rounded-lg border border-gray-200 hover:border-primary/50 hover:bg-primary/5 transition-all">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(condition.id)}
                                        onCheckedChange={(checked) => {
                                          if (condition.id === "none_disqualifying" && checked) {
                                            field.onChange(["none_disqualifying"]);
                                          } else if (checked) {
                                            const filtered = (field.value || []).filter(v => v !== "none_disqualifying");
                                            field.onChange([...filtered, condition.id]);
                                          } else {
                                            field.onChange((field.value || []).filter(v => v !== condition.id));
                                          }
                                        }}
                                        data-testid={`checkbox-disqualifying-${condition.id}`}
                                      />
                                    </FormControl>
                                    <FormLabel className={`font-normal cursor-pointer text-sm leading-relaxed ${condition.id === "none_disqualifying" ? "font-semibold text-primary" : ""}`}>
                                      {condition.label}
                                    </FormLabel>
                                  </FormItem>
                                )}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Warning for disqualifying conditions selected */}
                    {(form.watch("hasDisqualifyingConditions") || []).some(c => c !== "none_disqualifying") && (
                      <div className="p-4 rounded-xl bg-amber-50 border border-amber-300" data-testid="disqualifying-warning">
                        <p className="font-semibold text-amber-900 mb-1">⚠️ Important Notice</p>
                        <p className="text-sm text-amber-800">
                          Based on your answers, a licensed provider will carefully review your medical history before any prescription is issued. If you are found ineligible, you will receive a full refund.
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}

                {currentStep === 6 && (
                  <motion.div
                    key="step6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold text-slate-900 mb-2">{categoryLabels.step6Title}</h2>
                      <p className="text-slate-600">{categoryLabels.step6Subtitle}</p>
                    </div>

                    {/* Weight-loss: MEDVi Health Questions 2 + additional questions */}
                    {isWeightLoss && (
                      <>
                        <FormField
                          control={form.control}
                          name="hasMonitoringConditions"
                          render={() => (
                            <FormItem>
                              <div className="mb-3">
                                <FormLabel className="text-base font-semibold">Do any of these apply to you? <span className="text-slate-500 font-normal text-sm">(select all that apply)</span></FormLabel>
                              </div>
                              <div className="grid gap-2">
                                {MONITORING_CONDITIONS.map((condition) => (
                                  <FormField
                                    key={condition.id}
                                    control={form.control}
                                    name="hasMonitoringConditions"
                                    render={({ field }) => (
                                      <FormItem className="flex items-start space-x-3 space-y-0 p-3 rounded-lg border border-gray-200 hover:border-primary/50 hover:bg-primary/5 transition-all">
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(condition.id)}
                                            onCheckedChange={(checked) => {
                                              if (condition.id === "none_monitoring" && checked) {
                                                field.onChange(["none_monitoring"]);
                                              } else if (checked) {
                                                const filtered = (field.value || []).filter(v => v !== "none_monitoring");
                                                field.onChange([...filtered, condition.id]);
                                              } else {
                                                field.onChange((field.value || []).filter(v => v !== condition.id));
                                              }
                                            }}
                                            data-testid={`checkbox-monitoring-${condition.id}`}
                                          />
                                        </FormControl>
                                        <FormLabel className={`font-normal cursor-pointer text-sm leading-relaxed ${condition.id === "none_monitoring" ? "font-semibold text-primary" : ""}`}>
                                          {condition.label}
                                        </FormLabel>
                                      </FormItem>
                                    )}
                                  />
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="border-t pt-6 space-y-6">
                          {/* Opiate use in last 3 months */}
                          <FormField
                            control={form.control}
                            name="hasOpiateUse"
                            render={({ field }) => (
                              <FormItem className="space-y-3">
                                <FormLabel className="font-medium">Within the last 3 months, have you taken opiate pain medications and/or opiate-based street drugs?</FormLabel>
                                <FormControl>
                                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                                    <FormItem className="flex items-center space-x-3 space-y-0 p-3 rounded-lg border border-gray-200 hover:border-primary/50 transition-colors flex-1">
                                      <FormControl><RadioGroupItem value="yes" data-testid="radio-opiate-yes" /></FormControl>
                                      <FormLabel className="font-normal cursor-pointer">Yes</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0 p-3 rounded-lg border border-gray-200 hover:border-primary/50 transition-colors flex-1">
                                      <FormControl><RadioGroupItem value="no" data-testid="radio-opiate-no" /></FormControl>
                                      <FormLabel className="font-normal cursor-pointer">No</FormLabel>
                                    </FormItem>
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Prior weight loss surgery */}
                          <FormField
                            control={form.control}
                            name="hasPriorSurgery"
                            render={({ field }) => (
                              <FormItem className="space-y-3">
                                <FormLabel className="font-medium">Have you had prior weight loss surgeries?</FormLabel>
                                <FormControl>
                                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                                    <FormItem className="flex items-center space-x-3 space-y-0 p-3 rounded-lg border border-gray-200 hover:border-primary/50 transition-colors flex-1">
                                      <FormControl><RadioGroupItem value="yes" data-testid="radio-surgery-yes" /></FormControl>
                                      <FormLabel className="font-normal cursor-pointer">Yes</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0 p-3 rounded-lg border border-gray-200 hover:border-primary/50 transition-colors flex-1">
                                      <FormControl><RadioGroupItem value="no" data-testid="radio-surgery-no" /></FormControl>
                                      <FormLabel className="font-normal cursor-pointer">No</FormLabel>
                                    </FormItem>
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Current prescription medications */}
                          <FormField
                            control={form.control}
                            name="currentMedications"
                            render={({ field }) => (
                              <FormItem className="space-y-3">
                                <FormLabel className="font-medium">Do you currently take any prescription medications?</FormLabel>
                                <FormControl>
                                  <RadioGroup onValueChange={(v) => { field.onChange(v); }} defaultValue={field.value === "" ? undefined : (field.value && field.value !== "no" ? "yes" : field.value)} className="flex gap-4">
                                    <FormItem className="flex items-center space-x-3 space-y-0 p-3 rounded-lg border border-gray-200 hover:border-primary/50 transition-colors flex-1">
                                      <FormControl><RadioGroupItem value="yes" data-testid="radio-prescriptions-yes" /></FormControl>
                                      <FormLabel className="font-normal cursor-pointer">Yes</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0 p-3 rounded-lg border border-gray-200 hover:border-primary/50 transition-colors flex-1">
                                      <FormControl><RadioGroupItem value="no" data-testid="radio-prescriptions-no" /></FormControl>
                                      <FormLabel className="font-normal cursor-pointer">No</FormLabel>
                                    </FormItem>
                                  </RadioGroup>
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          {form.watch("currentMedications") === "yes" && (
                            <FormField
                              control={form.control}
                              name="allergies"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Please list your current prescription medications</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="e.g. Metformin 500mg, Lisinopril 10mg..."
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
                          )}

                          {/* Blood pressure range */}
                          <FormField
                            control={form.control}
                            name="bloodPressureRange"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="font-medium">What is your blood pressure range?</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                                  <FormControl>
                                    <SelectTrigger className="h-12 rounded-xl" data-testid="select-blood-pressure">
                                      <SelectValue placeholder="Select your blood pressure range" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="normal">&lt;120/80 (Normal)</SelectItem>
                                    <SelectItem value="elevated">120 to 129/&lt;80 (Elevated)</SelectItem>
                                    <SelectItem value="high_stage1">130 to 139/80-89 (High Stage 1)</SelectItem>
                                    <SelectItem value="high_stage2">≥140/90 (High Stage 2)</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Heart rate range */}
                          <FormField
                            control={form.control}
                            name="heartRateRange"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="font-medium">What is your average resting heart rate?</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                                  <FormControl>
                                    <SelectTrigger className="h-12 rounded-xl" data-testid="select-heart-rate">
                                      <SelectValue placeholder="Select your resting heart rate" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="slow">&lt;60 beats per minute (Slow)</SelectItem>
                                    <SelectItem value="normal">60 to 100 beats per minute (Normal)</SelectItem>
                                    <SelectItem value="slightly_fast">101 to 110 beats per minute (Slightly Fast)</SelectItem>
                                    <SelectItem value="fast">&gt;110 beats per minute (Fast)</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Previous GLP-1 experience */}
                          <FormField
                            control={form.control}
                            name="previousGlp"
                            render={({ field }) => (
                              <FormItem className="space-y-3">
                                <FormLabel className="font-medium">Have you previously taken a GLP-1 medication (Ozempic, Wegovy, Mounjaro, etc.)?</FormLabel>
                                <FormControl>
                                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                                    <FormItem className="flex items-center space-x-3 space-y-0 p-3 rounded-lg border border-gray-200 hover:border-primary/50 transition-colors flex-1">
                                      <FormControl><RadioGroupItem value="yes" data-testid="radio-glp-yes" /></FormControl>
                                      <FormLabel className="font-normal cursor-pointer">Yes</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0 p-3 rounded-lg border border-gray-200 hover:border-primary/50 transition-colors flex-1">
                                      <FormControl><RadioGroupItem value="no" data-testid="radio-glp-no" /></FormControl>
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
                                  <FormLabel>Please describe your previous GLP-1 experience</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Which medication? What dosage? How long ago?"
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
                        </div>

                        {/* Medication selection */}
                        <FormField
                          control={form.control}
                          name="medicationInterest"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-medium">Which medication are you interested in?</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                                <FormControl>
                                  <SelectTrigger className="h-12 rounded-xl" data-testid="select-medication">
                                    <SelectValue placeholder="Select medication" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {medicationOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}

                    {/* Hair loss: treatment-specific info + medication selection */}
                    {isHairLoss && (
                      <>
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                          <h4 className="font-semibold text-amber-900 mb-2">About Hair Loss Treatments</h4>
                          <p className="text-sm text-amber-800">
                            Our treatments target the root cause of male pattern baldness. Finasteride blocks DHT (the hormone that causes hair loss), while Minoxidil stimulates hair follicles. Many patients see results in 3–6 months.
                          </p>
                        </div>

                        <FormField control={form.control} name="currentMedications" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Medications (or write "None")</FormLabel>
                            <FormControl><Textarea placeholder="List any medications you currently take" className="min-h-[80px] rounded-xl resize-none" data-testid="textarea-medications" {...field} value={field.value || ""} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />

                        <FormField control={form.control} name="allergies" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Allergies (or write "None")</FormLabel>
                            <FormControl><Input placeholder="e.g. Penicillin, sulfa drugs..." className="h-12 rounded-xl" data-testid="input-allergies" {...field} value={field.value || ""} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />

                        <FormField control={form.control} name="medicationInterest" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Which medication are you interested in?</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                              <FormControl><SelectTrigger className="h-12 rounded-xl" data-testid="select-medication"><SelectValue placeholder="Select medication" /></SelectTrigger></FormControl>
                              <SelectContent>
                                {medicationOptions.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </>
                    )}

                    {/* Sexual health: treatment-specific info + medication selection */}
                    {isSexualHealth && (
                      <>
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                          <h4 className="font-semibold text-blue-900 mb-2">About ED Treatments</h4>
                          <p className="text-sm text-blue-800">
                            PDE5 inhibitors like Sildenafil and Tadalafil are safe and effective for most men. They work by increasing blood flow. Your provider will help determine the right option for your needs.
                          </p>
                        </div>

                        <FormField control={form.control} name="currentMedications" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Medications (or write "None")</FormLabel>
                            <FormControl><Textarea placeholder="List any medications you currently take" className="min-h-[80px] rounded-xl resize-none" data-testid="textarea-medications" {...field} value={field.value || ""} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />

                        <FormField control={form.control} name="allergies" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Allergies (or write "None")</FormLabel>
                            <FormControl><Input placeholder="e.g. Penicillin, sulfa drugs..." className="h-12 rounded-xl" data-testid="input-allergies" {...field} value={field.value || ""} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />

                        <FormField control={form.control} name="medicationInterest" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Which medication are you interested in?</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                              <FormControl><SelectTrigger className="h-12 rounded-xl" data-testid="select-medication"><SelectValue placeholder="Select medication" /></SelectTrigger></FormControl>
                              <SelectContent>
                                {medicationOptions.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </>
                    )}
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
                          Document upload is optional. You can skip this step and submit documents later by contacting our support team if preferred.
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

                    <div className="space-y-3">
                      <FormField
                        control={form.control}
                        name="consentAccuracy"
                        render={({ field }) => (
                          <FormItem className="flex items-start space-x-3 space-y-0 p-4 rounded-xl border border-gray-200">
                            <FormControl>
                              <Checkbox
                                checked={field.value === "yes"}
                                onCheckedChange={(checked) => field.onChange(checked ? "yes" : "")}
                                data-testid="checkbox-consent-accuracy"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="font-medium">Medical Information Accuracy</FormLabel>
                              <p className="text-sm text-slate-500">
                                I confirm all information I have provided is accurate and complete to the best of my knowledge.
                              </p>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="consentTelehealth"
                        render={({ field }) => (
                          <FormItem className="flex items-start space-x-3 space-y-0 p-4 rounded-xl border border-gray-200">
                            <FormControl>
                              <Checkbox
                                checked={field.value === "yes"}
                                onCheckedChange={(checked) => field.onChange(checked ? "yes" : "")}
                                data-testid="checkbox-consent-telehealth"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="font-medium">Telehealth Services Consent</FormLabel>
                              <p className="text-sm text-slate-500">
                                I understand I am receiving telehealth services remotely, not in-person care, and I have the right to stop treatment at any time.
                              </p>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="consentGiven"
                        render={({ field }) => (
                          <FormItem className="flex items-start space-x-3 space-y-0 p-4 rounded-xl border border-gray-200">
                            <FormControl>
                              <Checkbox
                                checked={field.value === "yes"}
                                onCheckedChange={(checked) => field.onChange(checked ? "yes" : "")}
                                data-testid="checkbox-consent"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="font-medium">Terms, Privacy & HIPAA</FormLabel>
                              <p className="text-sm text-slate-500">
                                I have read and agree to the{" "}
                                <a href="/terms" target="_blank" rel="noopener noreferrer" className="underline text-primary">Terms of Service</a>
                                ,{" "}
                                <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline text-primary">Privacy Policy</a>
                                , and{" "}
                                <a href="/hipaa-privacy" target="_blank" rel="noopener noreferrer" className="underline text-primary">HIPAA Notice of Privacy Practices</a>
                                , and consent to my health information being used as described therein.
                              </p>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

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

              {currentStep === 8 && (() => {
                const selectedProduct = stripeProducts.find(p =>
                  p.prices.some((price: any) => price.id === selectedPriceId)
                );
                const selectedPrice = selectedProduct?.prices.find((p: any) => p.id === selectedPriceId);
                const amount = selectedPrice?.unit_amount ? (selectedPrice.unit_amount / 100).toFixed(2) : null;
                const interval = selectedPrice?.recurring?.interval ?? "month";
                return amount ? (
                  <div className="mb-4 p-4 rounded-xl bg-blue-50 border border-blue-200 text-sm text-blue-800" data-testid="billing-disclosure">
                    <p className="font-semibold mb-1">💳 Billing Summary</p>
                    <p>
                      You will be charged <strong>${amount}/{interval}</strong> for <strong>{selectedProduct?.name}</strong>.
                      Your subscription renews automatically each {interval}. You may cancel at any time by contacting us.
                    </p>
                  </div>
                ) : null;
              })()}

              <div className="flex justify-between gap-4 pt-6 border-t">
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
                    disabled={
                      form.watch("consentGiven") !== "yes" ||
                      form.watch("consentAccuracy") !== "yes" ||
                      form.watch("consentTelehealth") !== "yes" ||
                      isCheckoutLoading
                    }
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
                    disabled={currentStep === 2 && isUnderAge}
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
