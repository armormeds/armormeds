import React from "react";
import { Link } from "wouter";
import { Shield, Zap, Activity, Satellite } from "lucide-react";

export function Hologram() {
  return (
    <div className="relative min-h-[900px] w-full bg-[#000814] overflow-hidden font-sans text-white">
      {/* Google Fonts */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Rajdhani:wght@400;500;600;700&display=swap" />
      
      {/* Sci-Fi Background Elements */}
      <div 
        className="absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage: "radial-gradient(circle at center, #001d3d 0%, #000814 100%)",
        }}
      />
      {/* Starfield overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-50"
        style={{
          backgroundImage: "radial-gradient(1px 1px at 20px 30px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 40px 70px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 50px 160px, #ffffff, rgba(0,0,0,0)), radial-gradient(1.5px 1.5px at 90px 40px, #ffffff, rgba(0,0,0,0)), radial-gradient(2px 2px at 130px 80px, rgba(255,255,255,0.8), rgba(0,0,0,0)), radial-gradient(1px 1px at 160px 120px, #ffffff, rgba(0,0,0,0))",
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px"
        }}
      />
      {/* Hex grid overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='103.92304845413264' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 103.92304845413264L0 86.60254037844386L0 51.96152422706632L30 34.64101615137754L60 51.96152422706632L60 86.60254037844386Z' fill='none' stroke='%2300B4D8' stroke-width='1'/%3E%3Cpath d='M30 51.96152422706632L0 34.64101615137754L0 0L30 -17.32050807568877L60 0L60 34.64101615137754Z' fill='none' stroke='%2300B4D8' stroke-width='1'/%3E%3C/svg%3E\")",
          backgroundSize: "60px 103.92px"
        }}
      />

      {/* Navigation */}
      <nav className="relative z-20 flex items-center justify-between px-8 py-6 border-b border-[#00B4D8]/20 bg-[#000814]/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-[#00B4D8]" style={{ filter: "drop-shadow(0 0 8px rgba(0,180,216,0.8))" }} />
          <span className="text-2xl font-bold tracking-widest text-white uppercase" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            Armor<span className="text-[#00B4D8]">Meds</span>
          </span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wider text-gray-300 uppercase" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
          <a href="#" className="hover:text-[#00B4D8] transition-colors hover:drop-shadow-[0_0_8px_rgba(0,180,216,0.8)]">Weight Loss</a>
          <a href="#" className="hover:text-[#00B4D8] transition-colors hover:drop-shadow-[0_0_8px_rgba(0,180,216,0.8)]">Hair Loss</a>
          <a href="#" className="hover:text-[#00B4D8] transition-colors hover:drop-shadow-[0_0_8px_rgba(0,180,216,0.8)]">Sexual Health</a>
          <a href="#" className="hover:text-white transition-colors">Login</a>
        </div>
        
        <button className="px-6 py-2.5 bg-transparent border-2 border-[#00B4D8] text-[#00B4D8] uppercase font-bold tracking-wider text-sm transition-all hover:bg-[#00B4D8]/10 hover:shadow-[0_0_15px_rgba(0,180,216,0.5)]" style={{ fontFamily: "'Orbitron', sans-serif" }}>
          INITIATE
        </button>
      </nav>

      {/* Main Hero Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-16 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[calc(900px-90px)]">
        
        {/* Left Column: Text */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3 text-[#00B4D8] mb-2">
            <Satellite className="w-5 h-5 animate-pulse" />
            <span className="text-xs uppercase tracking-[0.3em] font-bold" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              Transmission Incoming // Comms Open
            </span>
          </div>
          
          <h1 
            className="text-5xl md:text-7xl font-black uppercase leading-[1.1] tracking-wide"
            style={{ 
              fontFamily: "'Orbitron', sans-serif",
              color: "#00B4D8",
              textShadow: "0 0 10px rgba(0, 180, 216, 0.4), 0 0 20px rgba(0, 180, 216, 0.2)"
            }}
          >
            <span className="block text-white mb-2">The Force of</span>
            Modern Medicine
          </h1>
          
          <p 
            className="text-xl text-gray-300 max-w-xl leading-relaxed mt-4 border-l-4 border-[#00B4D8] pl-6"
            style={{ fontFamily: "'Rajdhani', sans-serif" }}
          >
            Access clinical-grade treatments from anywhere in the sector. Licensed physicians, discreet delivery, and no insurance required for your health mission.
          </p>
          
          <div className="flex flex-wrap gap-5 mt-8">
            <button 
              className="group relative px-8 py-4 bg-[#00B4D8] text-[#000814] uppercase font-black tracking-widest text-sm overflow-hidden transition-all hover:shadow-[0_0_25px_rgba(0,180,216,0.6)]"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-in-out skew-x-[-20deg]"></div>
              Start My Mission
            </button>
            
            <button 
              className="px-8 py-4 bg-transparent border border-[#48CAE4]/30 text-[#48CAE4] uppercase font-bold tracking-widest text-sm transition-all hover:border-[#48CAE4] hover:bg-[#48CAE4]/5 hover:shadow-[inset_0_0_15px_rgba(72,202,228,0.2)]"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Explore Treatments
            </button>
          </div>

          {/* Data panel */}
          <div className="mt-12 grid grid-cols-3 gap-4 border border-[#00B4D8]/20 bg-[#001d3d]/40 backdrop-blur p-4">
            <div className="flex flex-col gap-2 border-r border-[#00B4D8]/20 pr-4">
              <span className="text-[#00B4D8] text-xs uppercase tracking-widest font-bold" style={{ fontFamily: "'Orbitron', sans-serif" }}>Delivery</span>
              <span className="text-white text-sm font-medium" style={{ fontFamily: "'Rajdhani', sans-serif" }}>100% DISCREET</span>
            </div>
            <div className="flex flex-col gap-2 border-r border-[#00B4D8]/20 px-4">
              <span className="text-[#00B4D8] text-xs uppercase tracking-widest font-bold" style={{ fontFamily: "'Orbitron', sans-serif" }}>Network</span>
              <span className="text-white text-sm font-medium" style={{ fontFamily: "'Rajdhani', sans-serif" }}>LICENSED MDs</span>
            </div>
            <div className="flex flex-col gap-2 pl-4">
              <span className="text-[#00B4D8] text-xs uppercase tracking-widest font-bold" style={{ fontFamily: "'Orbitron', sans-serif" }}>Access</span>
              <span className="text-white text-sm font-medium" style={{ fontFamily: "'Rajdhani', sans-serif" }}>NO INSURANCE</span>
            </div>
          </div>
        </div>

        {/* Right Column: Hologram */}
        <div className="relative flex justify-center items-center h-[600px]">
          {/* Hologram Projector Base */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-48 h-8 rounded-full bg-[#00B4D8]/20 blur-xl animate-pulse"></div>
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-24 h-4 rounded-full bg-white/40 blur-md"></div>
          
          {/* Scanlines effect overlay */}
          <div 
            className="absolute inset-0 z-20 pointer-events-none opacity-20 mix-blend-overlay rounded-lg overflow-hidden"
            style={{
              backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, #00B4D8 2px, #00B4D8 4px)"
            }}
          ></div>
          
          {/* Generated Image Wrapper */}
          <div className="relative z-10 w-full max-w-[500px] aspect-[4/5] object-cover rounded-xl overflow-hidden border border-[#00B4D8]/30 shadow-[0_0_40px_rgba(0,180,216,0.3)] bg-[#001d3d]/50 backdrop-blur-sm">
            {/* Overlay gradient to enhance holographic feel */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#00B4D8]/20 to-transparent mix-blend-color z-10 pointer-events-none"></div>
            
            <img 
              src="/__mockup/images/hologram-medical.png" 
              alt="Holographic medical capsule" 
              className="w-full h-full object-cover opacity-90"
              style={{ filter: "contrast(1.2) saturate(1.5) hue-rotate(-10deg)" }}
            />
            
            {/* Holographic UI elements over the image */}
            <div className="absolute top-4 left-4 z-20">
              <div className="flex items-center gap-2 text-[#00B4D8] text-[10px] uppercase tracking-widest" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                <Activity className="w-3 h-3" />
                <span>Scanning...</span>
              </div>
            </div>
            
            <div className="absolute bottom-4 right-4 z-20 flex flex-col items-end gap-1 text-[#00B4D8] text-[10px] uppercase tracking-widest" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              <span>SEQ: 948.332</span>
              <span>STS: OPTIMAL</span>
            </div>
            
            {/* Sci-fi corners */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#00B4D8] z-20"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#00B4D8] z-20"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#00B4D8] z-20"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#00B4D8] z-20"></div>
          </div>
          
          {/* Side Accent Line (Lightsaber style) */}
          <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-1 h-64 bg-gradient-to-b from-transparent via-[#00B4D8] to-transparent shadow-[0_0_15px_#00B4D8]"></div>
        </div>
      </main>
    </div>
  );
}
