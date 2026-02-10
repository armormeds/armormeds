import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon" data-testid="button-back-home">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-display font-bold">Privacy Policy</h1>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-muted-foreground text-lg mb-8">
            Last Updated: January 2026
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p>
              ArmorMeds ("we," "our," or "us") is committed to protecting your privacy and ensuring the security of your personal health information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our telehealth services.
            </p>
            <p>
              We comply with the Health Insurance Portability and Accountability Act (HIPAA) and other applicable federal and state privacy laws. Your trust is important to us, and we take our responsibility to protect your information seriously.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            <h3 className="text-xl font-medium mb-2">Personal Information</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Full name, date of birth, and contact information</li>
              <li>Email address and phone number</li>
              <li>Mailing address and state of residence</li>
              <li>Government-issued identification (when required)</li>
            </ul>

            <h3 className="text-xl font-medium mb-2">Protected Health Information (PHI)</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Medical history and current health conditions</li>
              <li>Current medications and allergies</li>
              <li>Height, weight, and other physical measurements</li>
              <li>Lab results and medical records you provide</li>
              <li>Information from your telehealth consultations</li>
              <li>Prescription history and treatment plans</li>
            </ul>

            <h3 className="text-xl font-medium mb-2">Technical Information</h3>
            <ul className="list-disc pl-6">
              <li>IP address and browser type</li>
              <li>Device information</li>
              <li>Website usage data and cookies</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p>We use your information for the following purposes:</p>
            <ul className="list-disc pl-6">
              <li><strong>Treatment:</strong> To provide telehealth consultations, prescribe medications, and coordinate your care</li>
              <li><strong>Payment:</strong> To process payments and verify insurance coverage</li>
              <li><strong>Healthcare Operations:</strong> To improve our services, ensure quality, and train staff</li>
              <li><strong>Communication:</strong> To contact you about appointments, prescriptions, and health information</li>
              <li><strong>Legal Compliance:</strong> To comply with applicable laws, regulations, and legal processes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. How We Protect Your Information</h2>
            <p>We implement comprehensive security measures to protect your information:</p>
            <ul className="list-disc pl-6">
              <li><strong>Encryption:</strong> All data is encrypted in transit (SSL/TLS) and at rest</li>
              <li><strong>Access Controls:</strong> Only authorized healthcare providers and staff can access your PHI</li>
              <li><strong>Secure Storage:</strong> Documents are stored in HIPAA-compliant cloud storage</li>
              <li><strong>Audit Trails:</strong> We maintain logs of all access to your health information</li>
              <li><strong>Staff Training:</strong> All employees receive HIPAA privacy and security training</li>
              <li><strong>Business Associate Agreements:</strong> We require all vendors to sign BAAs</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Information Sharing and Disclosure</h2>
            <p>We may share your information in the following circumstances:</p>
            <ul className="list-disc pl-6">
              <li><strong>Partner Pharmacies:</strong> To fulfill your prescriptions</li>
              <li><strong>Other Healthcare Providers:</strong> With your consent, for continuity of care</li>
              <li><strong>Payment Processors:</strong> To complete transactions securely</li>
              <li><strong>Legal Requirements:</strong> When required by law, subpoena, or court order</li>
              <li><strong>Public Health:</strong> To report conditions required by law</li>
              <li><strong>Business Associates:</strong> With vendors who sign HIPAA-compliant agreements</li>
            </ul>
            <p className="mt-4">
              <strong>We never sell your personal health information to third parties.</strong>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Your Rights Under HIPAA</h2>
            <p>You have the following rights regarding your health information:</p>
            <ul className="list-disc pl-6">
              <li><strong>Access:</strong> Request a copy of your medical records</li>
              <li><strong>Amendment:</strong> Request corrections to your health information</li>
              <li><strong>Accounting of Disclosures:</strong> Request a list of who has accessed your information</li>
              <li><strong>Restriction Requests:</strong> Request limitations on how we use your information</li>
              <li><strong>Confidential Communications:</strong> Request communication through specific channels</li>
              <li><strong>Complaint:</strong> File a complaint if you believe your rights have been violated</li>
            </ul>
            <p className="mt-4">
              To exercise any of these rights, please contact our Privacy Officer at privacy@armormeds.com.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Data Retention</h2>
            <p>
              We retain your medical records and health information for the period required by applicable state and federal laws, typically 7-10 years from your last visit. After this period, records are securely destroyed in accordance with HIPAA requirements.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Cookies and Tracking</h2>
            <p>
              We use cookies and similar technologies to improve your experience on our website. These help us understand how you use our site and remember your preferences. You can control cookie settings through your browser.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Children's Privacy</h2>
            <p>
              Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children without parental consent.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last Updated" date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or our privacy practices, please contact us:
            </p>
            <div className="bg-muted/50 p-4 rounded-md mt-4">
              <p><strong>ArmorMeds Privacy Officer</strong></p>
              <p>Email: privacy@armormeds.com</p>
              <p>Phone: 1-800-XXX-XXXX</p>
              <p>Address: [Your Business Address]</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Notice of Privacy Practices</h2>
            <p>
              This notice describes how medical information about you may be used and disclosed and how you can get access to this information. Please review it carefully. A full copy of our Notice of Privacy Practices is available upon request.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
