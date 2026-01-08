import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon" data-testid="button-back-home">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-display font-bold">Terms of Service</h1>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-muted-foreground text-lg mb-8">
            Last Updated: January 2026
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using WellnessMeds telehealth services ("Services"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Description of Services</h2>
            <p>
              WellnessMeds provides telehealth consultations for weight management medications, including but not limited to GLP-1 receptor agonists such as Semaglutide and Tirzepatide. Our services include:
            </p>
            <ul className="list-disc pl-6">
              <li>Online medical consultations with licensed healthcare providers</li>
              <li>Medical evaluation and treatment recommendations</li>
              <li>Prescription services for appropriate candidates</li>
              <li>Ongoing patient support and monitoring</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Eligibility Requirements</h2>
            <p>To use our Services, you must:</p>
            <ul className="list-disc pl-6">
              <li>Be at least 18 years of age</li>
              <li>Be a resident of a state where we are licensed to practice</li>
              <li>Provide accurate and complete medical information</li>
              <li>Have a valid form of payment</li>
              <li>Not have any contraindications to the medications we prescribe</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Medical Disclaimer</h2>
            <p>
              <strong>Our Services are not a substitute for emergency medical care.</strong> If you are experiencing a medical emergency, call 911 or go to your nearest emergency room immediately.
            </p>
            <p>
              The information provided through our Services is for informational purposes and should not replace the advice of your primary care physician. Treatment decisions are made by licensed healthcare providers based on your individual medical history and current health status.
            </p>
            <p>
              <strong>Not all patients are candidates for treatment.</strong> Our providers may determine that certain medications are not appropriate for you based on your medical history, current medications, or other factors.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Prescription Policy</h2>
            <ul className="list-disc pl-6">
              <li>Prescriptions are issued at the sole discretion of our licensed healthcare providers</li>
              <li>We do not guarantee that any prescription will be issued</li>
              <li>All prescriptions are for legitimate medical purposes only</li>
              <li>We comply with all federal and state prescribing regulations</li>
              <li>Controlled substances are not prescribed through our platform</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Patient Responsibilities</h2>
            <p>As a patient, you agree to:</p>
            <ul className="list-disc pl-6">
              <li>Provide accurate, complete, and current medical information</li>
              <li>Notify us of any changes to your health status or medications</li>
              <li>Follow treatment instructions as directed by your provider</li>
              <li>Report any side effects or adverse reactions promptly</li>
              <li>Not share your prescribed medications with others</li>
              <li>Attend follow-up appointments as recommended</li>
              <li>Maintain communication with your primary care physician</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Payment and Billing</h2>
            <ul className="list-disc pl-6">
              <li>Payment is required at the time of service</li>
              <li>We accept major credit cards and other payment methods as indicated</li>
              <li>Consultation fees are separate from medication costs</li>
              <li>We do not currently accept insurance for our services</li>
              <li>All fees are clearly disclosed before you complete your purchase</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Telehealth Consent</h2>
            <p>By using our Services, you acknowledge and consent to:</p>
            <ul className="list-disc pl-6">
              <li>Receiving healthcare services via telehealth technology</li>
              <li>The limitations of telehealth compared to in-person visits</li>
              <li>The potential risks including technology failures or privacy breaches</li>
              <li>Your right to refuse telehealth services at any time</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Intellectual Property</h2>
            <p>
              All content on this website, including text, graphics, logos, and software, is the property of WellnessMeds and is protected by copyright and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, WellnessMeds shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our Services. Our total liability shall not exceed the amount you paid for the Services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless WellnessMeds, its officers, directors, employees, and agents from any claims, damages, or expenses arising from your use of our Services or violation of these Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Termination</h2>
            <p>
              We reserve the right to terminate or suspend your access to our Services at any time, with or without cause, and with or without notice. You may discontinue using our Services at any time.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">13. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the State of [Your State], without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">14. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting. Your continued use of our Services constitutes acceptance of the modified Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">15. Contact Information</h2>
            <p>
              If you have questions about these Terms, please contact us:
            </p>
            <div className="bg-muted/50 p-4 rounded-md mt-4">
              <p><strong>WellnessMeds</strong></p>
              <p>Email: legal@wellnessmeds.com</p>
              <p>Phone: 1-800-XXX-XXXX</p>
              <p>Address: [Your Business Address]</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
