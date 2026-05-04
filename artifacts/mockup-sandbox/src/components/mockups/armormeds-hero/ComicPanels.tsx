import React from "react";
import { Link } from "wouter";
import { Search, ChevronRight, Zap, Pill, ShieldCheck, HeartPulse } from "lucide-react";

export function ComicPanels() {
  return (
    <div className="relative min-h-[900px] w-full overflow-hidden bg-white text-black antialiased selection:bg-[#E63946] selection:text-white" style={{ fontFamily: "'Archivo Black', sans-serif" }}>
      {/* Load Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Bangers&family=Archivo+Black&display=swap" rel="stylesheet" />

      {/* Halftone background pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #000 2px, transparent 2.5px)",
          backgroundSize: "16px 16px"
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        {/* Navigation */}
        <nav className="flex items-center justify-between mb-8 pb-4 border-b-4 border-black">
          {/* Logo as a speech bubble */}
          <div className="relative inline-flex items-center">
            <div className="absolute -inset-2 bg-[#E63946] transform -skew-x-6 border-4 border-black z-0"></div>
            <span className="relative z-10 text-3xl text-white tracking-wider" style={{ fontFamily: "'Bangers', cursive" }}>
              ArmorMeds
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-xl tracking-tight">
            <a href="#" className="hover:text-[#E63946] hover:-translate-y-1 transition-transform decoration-4 underline-offset-4 hover:underline">Weight Loss</a>
            <a href="#" className="hover:text-[#E63946] hover:-translate-y-1 transition-transform decoration-4 underline-offset-4 hover:underline">Hair Loss</a>
            <a href="#" className="hover:text-[#E63946] hover:-translate-y-1 transition-transform decoration-4 underline-offset-4 hover:underline">Sexual Health</a>
          </div>

          <div className="flex items-center gap-4">
            <a href="#" className="hidden sm:block text-xl hover:text-[#E63946] transition-colors">Login</a>
            <button className="px-6 py-2 bg-[#FFD60A] text-black border-4 border-black rounded-full text-xl font-bold uppercase shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all active:shadow-none active:translate-x-[4px] active:translate-y-[4px]">
              Get Started
            </button>
          </div>
        </nav>

        {/* Comic Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
          
          {/* MAIN PANEL (Large Left) */}
          <div className="lg:col-span-8 bg-white border-4 border-black shadow-[8px_8px_0px_#000] p-6 md:p-10 relative overflow-hidden flex flex-col justify-between min-h-[600px] group">
            
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-2/3 h-full bg-[#E63946] -skew-x-12 translate-x-20 border-l-4 border-black z-0"></div>
            
            {/* Starburst */}
            <div className="absolute top-4 right-4 z-20 w-32 h-32 animate-[spin_10s_linear_infinite] opacity-90">
              <svg viewBox="0 0 100 100" className="w-full h-full fill-[#FFD60A] stroke-black" strokeWidth="3">
                <polygon points="50,0 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35" />
              </svg>
            </div>
            <div className="absolute top-4 right-4 w-32 h-32 z-20 flex items-center justify-center -rotate-12">
              <span className="text-black text-2xl font-bold text-center leading-none" style={{ fontFamily: "'Bangers', cursive" }}>
                FAST!<br/>RESULTS!
              </span>
            </div>

            <div className="relative z-10 max-w-lg mt-4">
              <div className="inline-block bg-[#FFD60A] border-4 border-black px-4 py-1 mb-4 shadow-[4px_4px_0px_#000] transform -rotate-2">
                <span className="text-xl uppercase tracking-widest">Doctor-Approved. Judgment-Free.</span>
              </div>
              
              <h1 className="text-6xl md:text-7xl lg:text-[80px] leading-[0.9] text-black mb-6 uppercase" style={{ fontFamily: "'Bangers', cursive" }}>
                <span className="inline-block hover:scale-105 transition-transform origin-left">BIG RESULTS.</span><br/>
                <span className="inline-block text-white" style={{ textShadow: "4px 4px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000" }}>LITTLE PILLS.</span>
              </h1>
              
              <p className="text-2xl mb-8 leading-snug font-medium bg-white p-4 border-4 border-black shadow-[4px_4px_0px_#000] relative inline-block">
                Stop waiting. Start treating. Discreet meds for weight loss, hair loss, and more—shipped fast.
                {/* Speech Bubble tail */}
                <div className="absolute -bottom-4 left-8 w-6 h-6 bg-white border-b-4 border-l-4 border-black transform -rotate-45 -z-10"></div>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button className="px-8 py-4 bg-[#E63946] text-white border-4 border-black rounded-full text-2xl font-bold uppercase shadow-[6px_6px_0px_#000] hover:shadow-[3px_3px_0px_#000] hover:translate-x-[3px] hover:translate-y-[3px] transition-all active:shadow-none active:translate-x-[6px] active:translate-y-[6px] flex items-center justify-center gap-2">
                  START MY VISIT
                  <Zap size={24} className="fill-white" />
                </button>
                <button className="px-8 py-4 bg-white text-black border-4 border-black rounded-full text-2xl font-bold uppercase shadow-[6px_6px_0px_#000] hover:shadow-[3px_3px_0px_#000] hover:translate-x-[3px] hover:translate-y-[3px] transition-all active:shadow-none active:translate-x-[6px] active:translate-y-[6px]">
                  SEE TREATMENTS
                </button>
              </div>
            </div>

            {/* Hero Image inside the panel */}
            <div className="absolute bottom-0 right-0 w-2/3 h-2/3 z-10 pointer-events-none transform translate-y-12 translate-x-12 group-hover:translate-x-8 group-hover:-translate-y-4 transition-transform duration-500">
              <img 
                src="/__mockup/images/comic-hero-man.png" 
                alt="Confident man holding pill" 
                className="w-full h-full object-contain object-bottom drop-shadow-[8px_0px_0px_#000]"
              />
            </div>
            
          </div>

          {/* SIDE PANELS (3 stacked vertically) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Step 1 */}
            <div className="bg-[#FFD60A] border-4 border-black shadow-[6px_6px_0px_#000] p-6 relative flex-1 flex flex-col justify-center transform hover:-rotate-2 transition-transform">
              <div className="absolute -top-4 -left-4 bg-white border-4 border-black rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold z-10" style={{ fontFamily: "'Bangers', cursive" }}>
                1
              </div>
              <div className="flex items-center gap-4 mb-2">
                <HeartPulse size={36} className="text-black" />
                <h3 className="text-3xl uppercase leading-none" style={{ fontFamily: "'Bangers', cursive" }}>Chat with Doctor</h3>
              </div>
              <p className="text-lg font-medium">Quick online consult. 100% judgment-free zone.</p>
              
              {/* Action lines */}
              <div className="absolute right-4 bottom-4 flex gap-1 opacity-50">
                <div className="w-1 h-8 bg-black -skew-x-12"></div>
                <div className="w-1 h-12 bg-black -skew-x-12"></div>
                <div className="w-1 h-6 bg-black -skew-x-12"></div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white border-4 border-black shadow-[6px_6px_0px_#000] p-6 relative flex-1 flex flex-col justify-center transform hover:rotate-1 transition-transform">
              <div className="absolute -top-4 -left-4 bg-[#E63946] text-white border-4 border-black rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold z-10" style={{ fontFamily: "'Bangers', cursive" }}>
                2
              </div>
              <div className="flex items-center gap-4 mb-2">
                <Pill size={36} className="text-black" />
                <h3 className="text-3xl uppercase leading-none" style={{ fontFamily: "'Bangers', cursive" }}>Get Meds Fast</h3>
              </div>
              <p className="text-lg font-medium">Discreetly shipped to your door. No waiting in line.</p>
              
              {/* Halftone accent */}
              <div className="absolute top-0 right-0 w-16 h-full opacity-20"
                style={{
                  backgroundImage: "radial-gradient(circle, #000 2px, transparent 2.5px)",
                  backgroundSize: "10px 10px"
                }}
              />
            </div>

            {/* Step 3 */}
            <div className="bg-[#48CAE4] border-4 border-black shadow-[6px_6px_0px_#000] p-6 relative flex-1 flex flex-col justify-center transform hover:-rotate-1 transition-transform overflow-hidden">
              <div className="absolute -top-4 -left-4 bg-white border-4 border-black rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold z-10" style={{ fontFamily: "'Bangers', cursive" }}>
                3
              </div>
              <div className="flex items-center gap-4 mb-2 relative z-10">
                <ShieldCheck size={36} className="text-black" />
                <h3 className="text-3xl uppercase leading-none" style={{ fontFamily: "'Bangers', cursive" }}>Feel KAPOW!</h3>
              </div>
              <p className="text-lg font-medium relative z-10">Crush your goals and get your edge back.</p>
              
              {/* Pow shape bg */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 opacity-30 z-0">
                <svg viewBox="0 0 100 100" className="w-full h-full fill-white">
                  <path d="M50 0 L60 30 L95 20 L70 50 L95 80 L60 70 L50 100 L40 70 L5 80 L30 50 L5 20 L40 30 Z" />
                </svg>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
