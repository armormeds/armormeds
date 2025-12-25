import { ShieldCheck, Heart, Users } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <div className="min-h-screen bg-white pt-32 pb-24">
      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-display font-bold text-slate-900 mb-8">
            Healthcare That Actually Cares
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            We started WellnessMeds with a simple mission: to make effective weight management treatments accessible, affordable, and judgment-free.
          </p>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-slate-50 py-24 mb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Safety First</h3>
              <p className="text-slate-600">
                We only partner with FDA-regulated 503B and 503A compounding pharmacies to ensure the highest quality medications.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Patient-Centric</h3>
              <p className="text-slate-600">
                You're more than just a patient ID. Our providers take the time to understand your unique health history and goals.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Continuous Support</h3>
              <p className="text-slate-600">
                Our support team is available 7 days a week to answer questions, manage refills, and support your journey.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1">
            {/* abstract medical team working */}
            <img 
              src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?q=80&w=2091&auto=format&fit=crop" 
              alt="Medical Team" 
              className="rounded-[2.5rem] shadow-2xl w-full"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-4xl font-display font-bold mb-6">The WellnessMeds Difference</h2>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Traditional healthcare is often slow, expensive, and impersonal. We've rebuilt the experience from the ground up.
            </p>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              By leveraging telehealth technology, we connect you directly with specialized providers who understand modern weight management. 
              No waiting rooms, no hidden fees, just effective care delivered to your door.
            </p>
            <Link href="/get-started">
              <Button className="h-14 px-8 text-lg rounded-full bg-slate-900 text-white hover:bg-slate-800 shadow-xl hover:-translate-y-1 transition-all">
                Join Our Community
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
