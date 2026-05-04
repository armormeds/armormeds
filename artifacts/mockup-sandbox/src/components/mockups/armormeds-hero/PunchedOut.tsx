import React from "react";

export function PunchedOut() {
  return (
    <div className="relative w-full min-h-[900px] overflow-hidden bg-white text-black selection:bg-yellow-300">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bangers&family=DM+Sans:wght@700&display=swap" />
      
      {/* Background Halftone + Red Slash */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0"
          style={{ 
            backgroundImage: "radial-gradient(circle, #000 1.5px, transparent 2px)", 
            backgroundSize: "16px 16px",
            opacity: 0.15
          }} 
        />
        <div 
          className="absolute right-0 top-0 w-2/3 h-full bg-[#E63946] border-l-8 border-black origin-bottom-left"
          style={{ transform: "skewX(-15deg) scaleX(1.2)" }}
        />
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col min-h-[900px]">
        
        {/* Navbar */}
        <nav className="flex items-center justify-between py-6">
          <div className="flex items-center">
            {/* Logo in a small explosion/speech bubble */}
            <div className="relative inline-block">
              <svg viewBox="0 0 200 100" className="absolute w-[180px] h-[90px] -top-[20px] -left-[10px] -z-10 fill-yellow-400 stroke-black stroke-[4px]">
                <path d="M10,50 Q20,20 50,10 Q80,20 100,5 Q120,20 150,10 Q180,20 190,50 Q180,80 150,90 Q120,80 100,95 Q80,80 50,90 Q20,80 10,50 Z" />
              </svg>
              <span className="font-['Bangers'] text-4xl tracking-wide ml-4 pt-2 block transform -rotate-2">ArmorMeds</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8 font-['Bangers'] text-2xl tracking-wide">
            <a href="#" className="hover:text-yellow-400 transition-colors drop-shadow-[2px_2px_0_rgba(0,0,0,1)] text-white">Weight Loss</a>
            <a href="#" className="hover:text-yellow-400 transition-colors drop-shadow-[2px_2px_0_rgba(0,0,0,1)] text-white">Hair Loss</a>
            <a href="#" className="hover:text-yellow-400 transition-colors drop-shadow-[2px_2px_0_rgba(0,0,0,1)] text-white">Sexual Health</a>
            <a href="#" className="hover:text-yellow-400 transition-colors drop-shadow-[2px_2px_0_rgba(0,0,0,1)] text-white">Login</a>
            <button className="bg-yellow-400 text-black px-6 py-2 rounded-full border-4 border-black font-['Bangers'] text-2xl uppercase shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all">
              Get Started
            </button>
          </div>
        </nav>

        {/* Hero Area */}
        <div className="flex-1 flex items-center justify-between mt-12 mb-20 relative">
          
          {/* Left Side: Speech Bubble & Copy */}
          <div className="w-full md:w-[55%] relative z-20">
            {/* Giant Speech Bubble */}
            <div className="relative bg-white border-[6px] border-black rounded-3xl p-10 md:p-14 shadow-[12px_12px_0_0_rgba(0,0,0,1)]">
              {/* Pointed Tail pointing to the right */}
              <svg className="absolute -right-[40px] top-[40%] w-[50px] h-[50px] z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0,0 L100,50 L0,100 Z" fill="white" stroke="black" strokeWidth="12" strokeLinejoin="miter"/>
                <path d="M0,8 L90,50 L0,92 Z" fill="white" stroke="none" />
              </svg>
              
              <h1 className="font-['Bangers'] text-6xl md:text-8xl leading-[0.9] tracking-wide mb-6 uppercase">
                <span className="block transform -rotate-2 mb-2">MEDS THAT WORK.</span>
                <span className="inline-block bg-yellow-400 px-4 py-2 border-4 border-black transform rotate-1 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">NO SHAME.</span>
              </h1>
              
              <p className="font-['DM_Sans'] font-bold text-xl md:text-2xl mb-8 leading-tight">
                Get your edge back with discreet, fast, doctor-approved treatments delivered straight to your door.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <button className="bg-[#E63946] text-white px-8 py-4 rounded-full border-[5px] border-black font-['Bangers'] text-3xl uppercase tracking-wider shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[3px_3px_0_0_rgba(0,0,0,1)] transition-all">
                  START MY VISIT
                </button>
                <button className="bg-white text-black px-8 py-4 rounded-full border-[5px] border-black font-['Bangers'] text-3xl uppercase tracking-wider shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:bg-yellow-400 hover:translate-y-1 hover:shadow-[3px_3px_0_0_rgba(0,0,0,1)] transition-all">
                  SEE TREATMENTS
                </button>
              </div>
            </div>

            {/* Bullet points speech bubble */}
            <div className="absolute -bottom-16 left-10 bg-yellow-400 border-[4px] border-black rounded-2xl p-4 shadow-[6px_6px_0_0_rgba(0,0,0,1)] transform -rotate-3 z-30">
               <ul className="font-['Bangers'] text-2xl space-y-1">
                 <li className="flex items-center gap-2">
                   <span className="text-[#E63946]">★</span> DISCREET DELIVERY
                 </li>
                 <li className="flex items-center gap-2">
                   <span className="text-[#E63946]">★</span> LICENSED DOCTORS
                 </li>
                 <li className="flex items-center gap-2">
                   <span className="text-[#E63946]">★</span> NO INSURANCE NEEDED
                 </li>
               </ul>
               {/* Small tail pointing up */}
               <svg className="absolute -top-[15px] left-[20px] w-[20px] h-[20px]" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0,100 L50,0 L100,100 Z" fill="#FACC15" stroke="black" strokeWidth="12" strokeLinejoin="miter"/>
                <path d="M10,100 L50,15 L90,100 Z" fill="#FACC15" stroke="none" />
              </svg>
            </div>
            
            {/* Starburst badge */}
            <div className="absolute -top-12 -left-6 z-30 transform -rotate-12 hover:rotate-12 transition-transform duration-300">
               <div className="relative flex items-center justify-center w-[120px] h-[120px]">
                 <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full fill-[#E63946] stroke-black stroke-[4px]">
                    <path d="M50,0 L61,35 L98,35 L68,57 L79,91 L50,70 L21,91 L32,57 L2,35 L39,35 Z" />
                 </svg>
                 <span className="relative z-10 font-['Bangers'] text-white text-4xl transform -rotate-6 shadow-black drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">FAST!</span>
               </div>
            </div>

          </div>

          {/* Right Side: Character Illustration */}
          <div className="w-full md:w-[45%] h-full flex justify-end items-end relative z-10">
            {/* Action lines behind character */}
            <div className="absolute inset-0 overflow-hidden flex justify-center items-center pointer-events-none -z-10 opacity-60 mix-blend-overlay">
               <div className="w-[800px] h-[800px] bg-[repeating-conic-gradient(from_0deg,#000_0deg_10deg,transparent_10deg_20deg)] rounded-full animate-spin-slow" style={{ animationDuration: '30s' }}></div>
            </div>
            <img 
              src="/__mockup/images/punched-out-hero.png" 
              alt="Confident pop-art doctor" 
              className="object-contain h-[750px] drop-shadow-[15px_15px_0_rgba(0,0,0,1)] relative z-20"
            />
          </div>
          
        </div>
      </div>
    </div>
  );
}
