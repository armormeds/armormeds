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
              <li><Link href="/get-started" className="hover:text-white transition-colors">Get Started</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-6">Contact</h4>
            <ul className="space-y-4 text-slate-400">
              <li>support@wellnessmeds.com</li>
              <li>1-800-555-0123</li>
              <li>123 Wellness Blvd<br/>Suite 100<br/>Austin, TX 78701</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-12 pt-8 text-sm text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2024 WellnessMeds. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="cursor-pointer hover:text-slate-300">Privacy Policy</span>
            <span className="cursor-pointer hover:text-slate-300">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
