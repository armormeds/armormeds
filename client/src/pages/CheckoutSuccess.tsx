import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Phone, Mail, Loader2, Video, Calendar, FileText } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useCreateLead } from "@/hooks/use-leads";
import { type InsertLead } from "@shared/routes";

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
          className="max-w-2xl mx-auto text-center"
        >
          <div className="mb-8">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="text-success-title">
              Payment Successful
            </h1>
            <p className="text-lg text-muted-foreground">
              Thank you for your purchase! Your subscription has been activated and your medical intake form has been submitted.
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>What Happens Next?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-left">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-semibold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Provider Review</h3>
                  <p className="text-muted-foreground text-sm">
                    A licensed healthcare provider will review your medical intake form and documents within 24-48 hours.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-semibold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Prescription Generated</h3>
                  <p className="text-muted-foreground text-sm">
                    If approved, you'll receive an email notification when your prescription is ready. No call required!
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-semibold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Free Shipping</h3>
                  <p className="text-muted-foreground text-sm">
                    Your medication will be shipped directly to your door with discreet packaging.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8 border-primary/20 bg-primary/5">
            <CardContent className="py-6">
              <div className="flex items-center gap-3 mb-3">
                <Video className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Want to Talk to a Provider? (Optional)</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                While a consultation is not required for your prescription, you can schedule a video call with a provider if you have questions or prefer to discuss your treatment.
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
              <p className="text-sm text-muted-foreground mb-4">
                Questions about your order? Our support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>1-800-WELLNESS</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>support@wellnessmeds.com</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
