import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon" data-testid="button-back-home">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-display font-bold">Refund & Cancellation Policy</h1>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-muted-foreground text-lg mb-8">
            Last Updated: January 2026
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Overview</h2>
            <p>
              At WellnessMeds, we strive to provide excellent telehealth services. This policy outlines our refund and cancellation terms to ensure transparency and fairness for all patients.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Consultation Fees</h2>
            <h3 className="text-xl font-medium mb-2">Refund Eligibility</h3>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Before Provider Review:</strong> Full refund available if you cancel before a provider has reviewed your medical intake form</li>
              <li><strong>After Provider Review:</strong> No refund available once a licensed provider has reviewed your information, regardless of the treatment decision</li>
              <li><strong>Not Approved for Treatment:</strong> If you are determined to be ineligible for treatment after provider review, the consultation fee is non-refundable as the medical service has been rendered</li>
            </ul>

            <h3 className="text-xl font-medium mb-2">Non-Refundable Situations</h3>
            <ul className="list-disc pl-6">
              <li>Providing false or misleading medical information</li>
              <li>Failure to respond to provider requests for additional information</li>
              <li>Cancellation after provider review has begun</li>
              <li>Change of mind after consultation</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Medication Fees</h2>
            <h3 className="text-xl font-medium mb-2">Prescription Medications</h3>
            <p>
              Medication purchases are handled by our partner pharmacies. Refund policies for medications are as follows:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Before Shipment:</strong> Full refund available if you cancel before your medication has been shipped</li>
              <li><strong>After Shipment:</strong> No refund available once medication has been shipped due to safety regulations</li>
              <li><strong>Damaged or Incorrect Medication:</strong> Full replacement or refund for medications that arrive damaged or are incorrect</li>
            </ul>

            <h3 className="text-xl font-medium mb-2">Why We Cannot Accept Returned Medications</h3>
            <p>
              Due to FDA regulations and patient safety requirements, we cannot accept returned medications. Once a prescription medication leaves the pharmacy, it cannot be resold or redistributed to ensure the safety and integrity of all medications.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Subscription Services</h2>
            <p>If you are enrolled in a subscription or membership program:</p>
            <ul className="list-disc pl-6">
              <li><strong>Cancellation:</strong> You may cancel your subscription at any time</li>
              <li><strong>Refunds:</strong> No refunds for partial months or unused portions of your subscription</li>
              <li><strong>Renewal:</strong> Subscriptions automatically renew unless cancelled before the renewal date</li>
              <li><strong>Notice:</strong> Please cancel at least 48 hours before your next billing date to avoid charges</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. How to Request a Refund</h2>
            <p>To request a refund, please:</p>
            <ol className="list-decimal pl-6">
              <li>Email us at refunds@wellnessmeds.com with your order number</li>
              <li>Include your full name and reason for the refund request</li>
              <li>Allow 3-5 business days for us to review your request</li>
              <li>Approved refunds will be processed within 5-10 business days</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Refund Processing</h2>
            <ul className="list-disc pl-6">
              <li>Refunds are issued to the original payment method</li>
              <li>Credit card refunds may take 5-10 business days to appear on your statement</li>
              <li>Bank processing times may vary</li>
              <li>You will receive email confirmation when your refund is processed</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Exceptions</h2>
            <p>We may make exceptions to this policy in cases of:</p>
            <ul className="list-disc pl-6">
              <li>Technical errors that prevented service delivery</li>
              <li>Documented medical emergencies</li>
              <li>Billing errors on our part</li>
              <li>Other extenuating circumstances at our discretion</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Chargebacks</h2>
            <p>
              We encourage patients to contact us directly to resolve any billing issues before initiating a chargeback with their credit card company. Chargebacks initiated for services that were properly rendered may result in termination of services and potential collection action.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
            <p>
              If you have questions about our refund policy or need assistance, please contact us:
            </p>
            <div className="bg-muted/50 p-4 rounded-md mt-4">
              <p><strong>WellnessMeds Billing Department</strong></p>
              <p>Email: refunds@wellnessmeds.com</p>
              <p>Phone: 1-800-XXX-XXXX</p>
              <p>Hours: Monday-Friday, 9am-5pm EST</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
