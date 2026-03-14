import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function HipaaPrivacy() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon" data-testid="button-back-home">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-display font-bold">HIPAA Notice of Privacy Practices</h1>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-muted-foreground text-lg mb-2">
            Last Updated: March 2026
          </p>
          <p className="text-muted-foreground mb-8">
            <strong>This notice describes how medical information about you may be used and disclosed, and how you can get access to this information. Please review it carefully.</strong>
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Who We Are</h2>
            <p>
              ArmorMeds operates as a telehealth platform that connects patients with licensed healthcare providers for prescription medications related to weight management, hair loss, and sexual health. As a covered entity under the Health Insurance Portability and Accountability Act (HIPAA), we are required by law to maintain the privacy of your Protected Health Information (PHI) and to provide you with this Notice of Privacy Practices.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Protected Health Information We Collect</h2>
            <p>We may collect and maintain the following categories of PHI:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Name, date of birth, address, and contact information</li>
              <li>Medical history, current health conditions, and medications</li>
              <li>Allergies and adverse drug reactions</li>
              <li>Height, weight, and physical measurements</li>
              <li>Lab results and documents you upload</li>
              <li>Prescription history and treatment plans</li>
              <li>Information exchanged during telehealth consultations</li>
              <li>Payment and billing information</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. How We Use and Disclose Your Information</h2>

            <h3 className="text-xl font-medium mb-2">Treatment</h3>
            <p className="mb-4">
              We use your PHI to provide, coordinate, and manage your healthcare and related services. This includes sharing your information with licensed providers who review your intake, issue prescriptions, and conduct video consultations.
            </p>

            <h3 className="text-xl font-medium mb-2">Healthcare Operations</h3>
            <p className="mb-4">
              We may use your PHI for business operations such as quality assurance, staff training, compliance activities, and improving our telehealth services.
            </p>

            <h3 className="text-xl font-medium mb-2">Payment</h3>
            <p className="mb-4">
              We may use and disclose your PHI to process payments for services rendered, including sharing information with payment processors and pharmacy partners.
            </p>

            <h3 className="text-xl font-medium mb-2">Other Permitted Disclosures</h3>
            <p>We may also disclose PHI as required or permitted by law, including:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>To comply with federal, state, or local laws</li>
              <li>To public health authorities for disease control and reporting</li>
              <li>To law enforcement under specific legal requirements</li>
              <li>To avert a serious threat to health or safety</li>
              <li>As required by a court order or subpoena</li>
            </ul>

            <h3 className="text-xl font-medium mb-2">Uses Requiring Your Authorization</h3>
            <p>We will only use or disclose your PHI for the following purposes with your written authorization:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Marketing communications</li>
              <li>Sale of your PHI</li>
              <li>Most uses of psychotherapy notes</li>
              <li>Any use not described in this Notice</li>
            </ul>
            <p>You may revoke your authorization at any time in writing, except where we have already acted in reliance on it.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Your Rights Regarding Your Health Information</h2>

            <h3 className="text-xl font-medium mb-2">Right to Access</h3>
            <p className="mb-4">
              You have the right to inspect and request a copy of your PHI that we maintain. We will respond within 30 days of your request. We may charge a reasonable fee for copies.
            </p>

            <h3 className="text-xl font-medium mb-2">Right to Amendment</h3>
            <p className="mb-4">
              You have the right to request that we amend PHI that you believe is inaccurate or incomplete. We may deny your request in certain circumstances and will explain the reason.
            </p>

            <h3 className="text-xl font-medium mb-2">Right to an Accounting of Disclosures</h3>
            <p className="mb-4">
              You may request a list of disclosures we have made of your PHI other than for treatment, payment, and healthcare operations, for up to six years prior to the date of your request.
            </p>

            <h3 className="text-xl font-medium mb-2">Right to Request Restrictions</h3>
            <p className="mb-4">
              You may request that we restrict how we use or disclose your PHI for treatment, payment, or operations. We are not required to agree to all restrictions, but we will consider your request.
            </p>

            <h3 className="text-xl font-medium mb-2">Right to Confidential Communications</h3>
            <p className="mb-4">
              You may request that we communicate with you about health matters in a specific way or at a specific location. We will accommodate reasonable requests.
            </p>

            <h3 className="text-xl font-medium mb-2">Right to a Copy of This Notice</h3>
            <p className="mb-4">
              You have the right to receive a paper copy of this Notice at any time, even if you have agreed to receive it electronically.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Our Responsibilities</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>We are required by law to maintain the privacy of your PHI</li>
              <li>We will notify you in the event of a breach of your unsecured PHI</li>
              <li>We must follow the privacy practices described in this Notice while it is in effect</li>
              <li>We reserve the right to change the terms of this Notice and will make the new Notice available upon request</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. How to Exercise Your Rights or File a Complaint</h2>

            <h3 className="text-xl font-medium mb-2">Contact Our Privacy Officer</h3>
            <p className="mb-4">
              To exercise any of the rights described above, or if you have questions about this Notice, please contact our Privacy Officer:
            </p>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 mb-4">
              <p><strong>ArmorMeds Privacy Officer</strong></p>
              <p>Email: privacy@armormeds.com</p>
              <p>Mailing Address: ArmorMeds, [Address], United States</p>
            </div>

            <h3 className="text-xl font-medium mb-2">File a Complaint</h3>
            <p className="mb-4">
              If you believe your privacy rights have been violated, you may file a complaint with us using the contact information above, or directly with the U.S. Department of Health and Human Services Office for Civil Rights:
            </p>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 mb-4">
              <p><strong>HHS Office for Civil Rights</strong></p>
              <p>Website: <a href="https://www.hhs.gov/ocr/privacy/hipaa/complaints/" target="_blank" rel="noopener noreferrer" className="text-primary underline">hhs.gov/ocr/privacy/hipaa/complaints</a></p>
              <p>Phone: 1-800-368-1019</p>
            </div>
            <p className="text-sm text-muted-foreground">
              We will not retaliate against you for filing a complaint.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Effective Date</h2>
            <p>
              This Notice of Privacy Practices is effective as of March 2026. We reserve the right to change this Notice and apply the new Notice to all PHI we maintain. Any revised Notice will be posted on our website and made available upon request.
            </p>
          </section>

          <div className="border-t pt-6 text-sm text-muted-foreground">
            <p>For more information about HIPAA and your privacy rights, visit <a href="https://www.hhs.gov/hipaa" target="_blank" rel="noopener noreferrer" className="text-primary underline">hhs.gov/hipaa</a>.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
