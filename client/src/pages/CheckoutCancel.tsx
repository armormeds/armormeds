import { motion } from "framer-motion";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function CheckoutCancel() {
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
            <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-destructive" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Payment Cancelled
            </h1>
            <p className="text-lg text-muted-foreground">
              Your payment was cancelled. No charges have been made to your account.
            </p>
          </div>

          <Card className="mb-8">
            <CardContent className="py-8">
              <p className="text-muted-foreground mb-6">
                If you experienced any issues during checkout or have questions about our medications, 
                please don't hesitate to reach out to our support team.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/medications">
                  <Button variant="outline" size="lg" data-testid="button-try-again">
                    <RefreshCw className="mr-2 w-4 h-4" />
                    Try Again
                  </Button>
                </Link>
                <Link href="/">
                  <Button size="lg" data-testid="button-back-home">
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    Back to Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <p className="text-sm text-muted-foreground">
            Need help? Contact us at{" "}
            <a href="mailto:support@wellnessmeds.com" className="text-primary hover:underline">
              support@wellnessmeds.com
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
