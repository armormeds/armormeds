import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Phone, Mail, Loader2, Video, Calendar, FileText, Package, RefreshCcw, Headphones, Stethoscope, ClipboardCheck } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useCreateLead } from "@/hooks/use-leads";
import { type InsertLead } from "@shared/routes";

const NEXT_STEPS = [
  {
    icon: <Stethoscope className="w-5 h-5 text-primary" />,
    title: "Provider Review",
    description: "A board-certified healthcare provider will review your medical intake and documents. Most prescriptions are reviewed in less than 24 hours."
  },
  {
    icon: <ClipboardCheck className="w-5 h-5 text-primary" />,
    title: "Prescription Approval",
    description: "If approved, your prescription is generated. Our team may reach out by text with any questions — no phone call required."
  },
  {
    icon: <Package className="w-5 h-5 text-primary" />,
    title: "Medication Shipping",
    description: "Your medication is prepared and shipped discreetly to your door. You'll receive tracking info within 2 business days."
  },
  {
    icon: <RefreshCcw className="w-5 h-5 text-primary" />,
    title: "Monthly Refills",
    description: "At the end of each month, a quick refill form keeps your treatment on track. We'll send text and email updates as each shipment heads your way."
  },
  {
    icon: <Headphones className="w-5 h-5 text-primary" />,
    title: "Unlimited Support",
    description: "Have questions about side effects, dosage, or your progress? You have unlimited 24/7 access to our care team and licensed providers — whenever you need."
  }
];

export default function CheckoutSuccess() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { mutate, isPending } = useCreateLead();

  useEffect(() => {
    const pendingData = sessionStorage.getItem('pendingLeadData');
    if (pendingData && !hasSubmitted) {
      setIsSubmitting(true);
      try {
        const leadData = JSON.parse(pendingData) as InsertLead;
        mutate(leadData, {
          onSuccess: () => {
            sessionStorage.removeItem('pendingLeadData');
            setHasSubmitted(true);
            setIsSubmitting(false);
          },
          onError: () => {
            setIsSubmitting(false);
          }
        });
      } catch (error) {
        console.error("Failed to parse pending lead data:", error);
        setIsSubmitting(false);
      }
    }
  }, [mutate, hasSubmitted]);

  if (isSubmitting || isPending) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Finalizing your order...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          {/* Success Header */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3" data-testid="text-success-title">
              You're all set! 🎉
            </h1>
            <p className="text-lg text-muted-foreground">
              Your payment is confirmed and your medical intake has been submitted. 
              A licensed provider will review your information shortly.
            </p>
          </div>

          {/* What Happens Next — 5 Steps */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">What Happens Next</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {NEXT_STEPS.map((step, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      {step.icon}
                    </div>
                    {idx < NEXT_STEPS.length - 1 && (
                      <div className="w-px flex-1 bg-border mt-2 mb-1 min-h-[20px]" />
                    )}
                  </div>
                  <div className="pb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-primary/60 uppercase tracking-wide">Step {idx + 1}</span>
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Optional Consultation */}
          <Card className="mb-8 border-primary/20 bg-primary/5">
            <CardContent className="py-6">
              <div className="flex items-center gap-3 mb-3">
                <Video className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Want to Talk to a Provider? (Optional)</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                A consultation isn't required — but if you'd like to speak directly with a licensed clinician about your treatment plan, you can schedule a video call at any time.
              </p>
              <Link href="/schedule">
                <Button variant="outline" className="w-full sm:w-auto" data-testid="button-schedule-optional">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Optional Consultation
                </Button>
              </Link>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/my-appointments">
              <Button size="lg" variant="outline" data-testid="button-view-appointments">
                <FileText className="w-4 h-4 mr-2" />
                View My Appointments
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg" data-testid="button-back-home">
                Back to Home
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          <Card className="bg-muted/50">
            <CardContent className="py-6">
              <p className="text-sm text-muted-foreground mb-4 text-center">
                Questions about your order? Our support team is available 24/7.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>1-800-ARMORMEDS</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>support@armormeds.com</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
