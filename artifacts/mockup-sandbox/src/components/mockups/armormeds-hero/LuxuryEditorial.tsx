import React from "react";
import { Link } from "wouter";
import { ArrowRight, Check } from "lucide-react";

export function LuxuryEditorial() {
  return (
    <div className="relative min-h-[900px] w-full bg-[#F5F0E8] text-black overflow-hidden flex flex-col font-sans selection:bg-black selection:text-[#F5F0E8]">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,800;1,400&family=Manrope:wght@300;400;600&display=swap');
        
        .font-editorial {
          font-family: 'Playfair Display', serif;
        }
        .font-body {
          font-family: 'Manrope', sans-serif;
        }
      ` }} />
      
      {/* Framing Lines */}
      <div className="absolute inset-4 border border-black/20 pointer-events-none z-50"></div>
      <div className="absolute inset-5 border border-black/10 pointer-events-none z-50"></div>

      {/* Navigation */}
      <nav className="relative z-40 w-full px-12 py-8 flex items-center justify-between font-body">
        <div className="flex items-center gap-12">
          <Link href="/" className="text-2xl font-editorial font-bold tracking-tight">
            ArmorMeds
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm tracking-widest uppercase font-semibold text-black/70">
            <Link href="/weight-loss" className="hover:text-black transition-colors">Weight Loss</Link>
            <Link href="/hair-loss" className="hover:text-black transition-colors">Hair Loss</Link>
            <Link href="/sexual-health" className="hover:text-black transition-colors">Sexual Health</Link>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm tracking-widest uppercase font-semibold">
          <Link href="/login" className="text-black/70 hover:text-black transition-colors">Login</Link>
          <Link href="/start" className="px-6 py-2.5 bg-black text-white rounded-full hover:bg-black/80 transition-colors">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 relative w-full max-w-7xl mx-auto px-12 flex flex-col justify-center">
        
        {/* Magazine Labels */}
        <div className="absolute top-12 right-12 flex flex-col items-end text-xs tracking-[0.2em] font-body text-black/60 z-40">
          <span>ISSUE 01 / VOL 26</span>
          <span className="mt-1">THE WELLNESS EDITION</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Column: Text */}
          <div className="lg:col-span-6 flex flex-col pt-12 lg:pt-0">
            <h1 className="font-editorial text-7xl lg:text-8xl xl:text-[9rem] leading-[0.85] tracking-tight mb-8 z-30">
              <span className="block">THE ART</span>
              <span className="block text-black/40 italic">of</span>
              <span className="block">FEELING</span>
              <span className="block">WELL.</span>
            </h1>
            
            <div className="max-w-md ml-2 border-l border-black/20 pl-6 mb-12">
              <p className="font-body text-lg text-black/70 leading-relaxed font-light">
                Premium treatments for weight loss, hair care, and sexual health. 
                Science-backed solutions delivered with uncompromising discretion and elegance.
              </p>
            </div>
            
            <div className="flex items-center gap-8 ml-2 font-body text-sm tracking-widest uppercase font-semibold">
              <Link href="/start" className="px-8 py-4 bg-black text-white rounded-full hover:bg-black/80 transition-colors flex items-center gap-2">
                Begin Journey <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/treatments" className="text-black border-b border-black pb-1 hover:text-black/60 hover:border-black/60 transition-all">
                Explore Treatments
              </Link>
            </div>
          </div>

          {/* Right Column: Image */}
          <div className="lg:col-span-6 relative h-[600px] xl:h-[700px] w-full mt-12 lg:mt-0">
            <div className="absolute inset-0 bg-black/5 object-cover">
              <img 
                src="/__mockup/images/luxury-editorial-model.png" 
                alt="Elegant editorial wellness model" 
                className="w-full h-full object-cover object-center mix-blend-multiply opacity-90"
              />
            </div>
            {/* Overlay Gradient for text readability if needed */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#F5F0E8] via-transparent to-transparent opacity-40 lg:hidden"></div>
          </div>
        </div>

        {/* Bottom Benefits Panel */}
        <div className="absolute bottom-12 left-12 right-12 z-40 border-t border-black/10 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs font-body tracking-[0.15em] uppercase text-black/60">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
              DISCREET, ELEGANT DELIVERY
            </div>
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
              LICENSED MEDICAL CONCIERGE
            </div>
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
              NO INSURANCE REQUIRED
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
