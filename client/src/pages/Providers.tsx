import { ArrowLeft, Stethoscope, Shield, Award, GraduationCap, Clock, MapPin } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Providers() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon" data-testid="button-back-home">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-display font-bold">Our Healthcare Providers</h1>
            <p className="text-muted-foreground">Licensed, board-certified telehealth professionals</p>
          </div>
        </div>

        <section className="mb-12">
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-4">
              <Shield className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-semibold mb-2">Our Commitment to Quality Care</h2>
                <p className="text-muted-foreground">
                  All WellnessMeds healthcare providers are fully licensed, board-certified medical professionals with specialized training in weight management and metabolic health. Our providers undergo rigorous credentialing and maintain active licenses in all states where they practice.
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6 text-center">
                <GraduationCap className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Board Certified</h3>
                <p className="text-sm text-muted-foreground">
                  All providers are board-certified in their respective specialties
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Award className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Specialized Training</h3>
                <p className="text-sm text-muted-foreground">
                  Advanced training in obesity medicine and GLP-1 therapies
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Clock className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Ongoing Education</h3>
                <p className="text-sm text-muted-foreground">
                  Continuous medical education to stay current with best practices
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Provider Qualifications</h2>
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p>
              Our medical team includes physicians (MD/DO), nurse practitioners (NP), and physician assistants (PA) who meet the following requirements:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Active, unrestricted medical license in good standing</li>
              <li>Board certification in primary care, internal medicine, family medicine, or related specialty</li>
              <li>DEA registration (where applicable)</li>
              <li>No disciplinary actions or malpractice issues</li>
              <li>Minimum of 2 years clinical experience</li>
              <li>Specialized training in telehealth medicine</li>
              <li>Ongoing continuing medical education (CME) requirements</li>
            </ul>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Credentialing Process</h2>
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p>
              Every provider on our platform undergoes a comprehensive credentialing process that includes:
            </p>
            <ol className="list-decimal pl-6 mb-6">
              <li><strong>License Verification:</strong> Primary source verification of all state medical licenses</li>
              <li><strong>Board Certification:</strong> Verification of specialty board certifications</li>
              <li><strong>Education:</strong> Confirmation of medical education and training</li>
              <li><strong>Background Check:</strong> Criminal background screening and identity verification</li>
              <li><strong>Malpractice History:</strong> Review of malpractice claims and disciplinary history</li>
              <li><strong>Reference Checks:</strong> Professional reference verification</li>
              <li><strong>Ongoing Monitoring:</strong> Continuous license monitoring and re-credentialing</li>
            </ol>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">States We Serve</h2>
          <p className="text-muted-foreground mb-4">
            Our providers are licensed to practice in the following states. We continuously expand our coverage to serve more patients.
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              "Alabama", "Arizona", "California", "Colorado", "Connecticut", "Florida", 
              "Georgia", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Maryland",
              "Massachusetts", "Michigan", "Minnesota", "Missouri", "Nevada", "New Jersey",
              "New York", "North Carolina", "Ohio", "Oregon", "Pennsylvania", "Tennessee",
              "Texas", "Utah", "Virginia", "Washington", "Wisconsin"
            ].map((state) => (
              <Badge 
                key={state} 
                variant="secondary" 
                className="no-default-hover-elevate no-default-active-elevate"
              >
                <MapPin className="h-3 w-3 mr-1" />
                {state}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            If your state is not listed, please contact us to check availability.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Our Medical Director</h2>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Stethoscope className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">[Medical Director Name], MD</h3>
                  <p className="text-muted-foreground mb-2">Medical Director, WellnessMeds</p>
                  <p className="text-sm text-muted-foreground mb-3">
                    Board Certified in Internal Medicine and Obesity Medicine
                  </p>
                  <p className="text-sm">
                    Our Medical Director oversees all clinical operations, ensures quality of care, 
                    and maintains our commitment to evidence-based medicine. With over [X] years of 
                    experience in weight management and metabolic health, they lead our team in 
                    delivering safe, effective telehealth services.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Quality Assurance</h2>
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p>
              We maintain the highest standards of care through:
            </p>
            <ul className="list-disc pl-6">
              <li>Regular clinical audits and case reviews</li>
              <li>Patient outcome tracking and quality metrics</li>
              <li>Peer review processes</li>
              <li>Patient satisfaction monitoring</li>
              <li>Adverse event reporting and investigation</li>
              <li>Compliance with state and federal telehealth regulations</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Contact Our Medical Team</h2>
          <div className="bg-muted/50 p-6 rounded-lg">
            <p className="mb-4">
              If you have questions about our providers or medical services, please contact us:
            </p>
            <p><strong>Email:</strong> medical@wellnessmeds.com</p>
            <p><strong>Phone:</strong> 1-800-XXX-XXXX</p>
            <p className="text-sm text-muted-foreground mt-4">
              For licensing verification requests, please email compliance@wellnessmeds.com
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
