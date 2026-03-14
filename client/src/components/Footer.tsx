import { Link } from "wouter";
import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="bg-primary p-1.5 rounded-lg">
                <Heart className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="font-display font-bold text-lg text-white">
                ArmorMeds
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              Modern telehealth for weight management, hair loss, and sexual health. 
              Licensed providers, delivered to your door.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-medium text-sm mb-4">Treatments</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/medications" className="hover:text-white transition-colors">Weight Loss</Link></li>
              <li><Link href="/hair-loss" className="hover:text-white transition-colors">Hair Loss</Link></li>
              <li><Link href="/sexual-health" className="hover:text-white transition-colors">Sexual Health</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-medium text-sm mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/providers" className="hover:text-white transition-colors">Our Providers</Link></li>
              <li><Link href="/get-started" className="hover:text-white transition-colors">Get Started</Link></li>
              <li><Link href="/patient" className="hover:text-white transition-colors">Patient Portal</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-medium text-sm mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/hipaa-privacy" className="hover:text-white transition-colors">HIPAA Notice of Privacy Practices</Link></li>
              <li><Link href="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8">
          <div className="text-xs text-slate-500 mb-6">
            <p className="mb-2">
              ArmorMeds provides telehealth consultations for prescription medications. 
              All consultations are conducted by licensed healthcare providers.
            </p>
            <p>
              <strong className="text-slate-400">Not a substitute for emergency care.</strong> If you are experiencing a medical emergency, call 911.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <p>&copy; 2026 ArmorMeds. All rights reserved.</p>
            <p>support@armormeds.com</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
