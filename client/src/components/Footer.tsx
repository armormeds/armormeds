import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6 cursor-pointer">
              <span className="font-display font-bold text-2xl tracking-tight text-white">
                Wellness<span className="text-primary">Meds</span>
              </span>
            </Link>
            <p className="text-slate-400 max-w-sm leading-relaxed">
              Making modern weight management accessible, affordable, and simple. 
              Our telehealth platform connects you with licensed providers from the comfort of your home.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/medications" className="hover:text-white transition-colors">Medications</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/providers" className="hover:text-white transition-colors">Our Providers</Link></li>
              <li><Link href="/get-started" className="hover:text-white transition-colors">Get Started</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-6">Legal</h4>
            <ul className="space-y-4">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link></li>
            </ul>
          </div>
          
        </div>
        
        <div className="border-t border-slate-800 mt-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h4 className="text-white font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>support@wellnessmeds.com</li>
                <li>1-800-555-0123</li>
                <li>123 Wellness Blvd, Suite 100, Austin, TX 78701</li>
              </ul>
            </div>
            <div className="text-sm text-slate-400">
              <p className="mb-2">
                WellnessMeds provides telehealth consultations for weight management medications. 
                All consultations are conducted by licensed healthcare providers.
              </p>
              <p>
                <strong className="text-slate-300">Not a substitute for emergency care.</strong> If you are experiencing a medical emergency, call 911.
              </p>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-6 text-sm text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
            <p>© 2026 WellnessMeds. All rights reserved.</p>
            <div className="flex flex-wrap gap-6 justify-center">
              <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
              <Link href="/refund-policy" className="hover:text-slate-300 transition-colors">Refund Policy</Link>
              <Link href="/providers" className="hover:text-slate-300 transition-colors">Our Providers</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
