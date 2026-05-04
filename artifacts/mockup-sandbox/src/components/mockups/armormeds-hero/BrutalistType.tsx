import React from "react";
import { Link } from "wouter";

export function BrutalistType() {
  return (
    <div className="relative min-h-[900px] w-full bg-[#EFEDE8] text-black overflow-hidden flex flex-col font-sans selection:bg-[#FF3300] selection:text-white">
      {/* Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet" />

      {/* Grid Overlay (Faint) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] grid grid-cols-12 gap-4 px-6 md:px-12 z-0">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="col-span-1 h-full border-l border-black" />
        ))}
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-8 md:px-12 border-b-2 border-black">
        <div className="flex items-center gap-2">
          <span className="font-['Archivo_Black'] text-3xl tracking-tighter uppercase leading-none mt-1">ArmorMeds</span>
        </div>
        <div className="hidden md:flex items-center gap-8 font-['Space_Mono'] text-sm tracking-widest uppercase">
          <Link href="#weight-loss" className="hover:text-[#FF3300] transition-colors">Weight Loss</Link>
          <Link href="#hair-loss" className="hover:text-[#FF3300] transition-colors">Hair Loss</Link>
          <Link href="#sexual-health" className="hover:text-[#FF3300] transition-colors">Sexual Health</Link>
          <Link href="#login" className="hover:text-[#FF3300] transition-colors">Login</Link>
        </div>
        <Link href="#start" className="hidden md:inline-flex items-center justify-center font-['Space_Mono'] text-sm tracking-widest uppercase bg-black text-white px-6 py-3 border-2 border-black hover:bg-[#FF3300] hover:text-black hover:border-[#FF3300] transition-all">
          Get Started
        </Link>
      </nav>

      {/* Main Hero Content */}
      <main className="relative z-10 flex-1 flex flex-col justify-center px-6 md:px-12 py-12">
        <div className="grid grid-cols-12 gap-4 h-full items-center">
          
          {/* Left Column - Colossal Headline */}
          <div className="col-span-12 lg:col-span-10 flex flex-col">
            <h1 className="font-['Archivo_Black'] text-[12vw] leading-[0.85] tracking-tighter uppercase text-black break-words m-0 p-0">
              MEDICATIONS.<br/>
              <span className="text-[#FF3300]">DELIVERED.</span><br/>
              PERIOD.
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16 lg:mt-24 items-start">
              <div className="font-['Space_Mono'] text-base leading-relaxed max-w-md border-l-2 border-black pl-6">
                <p>
                  STOP WAITING. START LIVING. CLINICALLY PROVEN TREATMENTS FOR WEIGHT LOSS, HAIR LOSS, AND SEXUAL HEALTH. SHIPPED TO YOUR DOOR.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link href="#start" className="inline-flex items-center justify-center font-['Archivo_Black'] text-xl tracking-tight uppercase bg-[#FF3300] text-black px-8 py-5 border-2 border-black hover:bg-black hover:text-white transition-colors">
                    Start Treatment
                  </Link>
                  <Link href="#explore" className="inline-flex items-center justify-center font-['Archivo_Black'] text-xl tracking-tight uppercase bg-transparent text-black px-8 py-5 border-2 border-black hover:bg-black hover:text-white transition-colors">
                    View Meds
                  </Link>
                </div>
              </div>
              
              <div className="flex flex-col gap-4">
                <div className="font-['Space_Mono'] text-xs tracking-widest uppercase flex flex-col gap-2 border-t-2 border-black pt-4">
                  <div className="flex justify-between items-center pb-2 border-b border-black/20">
                    <span>// 01</span>
                    <span className="font-bold">DISCREET DELIVERY</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-black/20">
                    <span>// 02</span>
                    <span className="font-bold">LICENSED PHYSICIANS</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-black/20">
                    <span>// 03</span>
                    <span className="font-bold">NO INSURANCE NEEDED</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Accent Image */}
          <div className="hidden lg:flex col-span-2 h-full items-end justify-end pb-8">
            <div className="w-48 h-48 border-2 border-black bg-black p-1 relative group overflow-hidden">
              <img 
                src="/__mockup/images/brutalist-pills-accent.png" 
                alt="Medical capsules" 
                className="w-full h-full object-cover filter grayscale contrast-150 group-hover:grayscale-0 transition-all duration-500"
              />
              <div className="absolute top-2 left-2 bg-black text-white font-['Space_Mono'] text-[10px] px-2 py-1 uppercase tracking-widest">
                FIG. 1
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer ticker / decorative */}
      <div className="border-t-2 border-black overflow-hidden py-2 bg-black text-white relative z-10 flex">
        <div className="font-['Space_Mono'] text-xs tracking-widest uppercase whitespace-nowrap animate-pulse flex space-x-8 px-4">
          <span>CLINICAL GRADE.</span>
          <span>100% ONLINE.</span>
          <span>PRESCRIBED BY EXPERTS.</span>
          <span>CLINICAL GRADE.</span>
          <span>100% ONLINE.</span>
          <span>PRESCRIBED BY EXPERTS.</span>
          <span>CLINICAL GRADE.</span>
          <span>100% ONLINE.</span>
          <span>PRESCRIBED BY EXPERTS.</span>
        </div>
      </div>
    </div>
  );
}
