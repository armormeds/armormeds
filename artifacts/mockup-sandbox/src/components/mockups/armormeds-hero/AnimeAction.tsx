import React from 'react';

export function AnimeAction() {
  return (
    <div className="relative w-full min-h-[900px] overflow-hidden bg-[#1A0B2E] text-white selection:bg-[#FF6B35] selection:text-white font-sans">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Bangers&family=Rubik+Mono+One&family=Teko:wght@500;700&display=swap" rel="stylesheet" />

      {/* Speed lines background SVG */}
      <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <defs>
            <radialGradient id="speed" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FF6B35" stopOpacity="1" />
              <stop offset="100%" stopColor="#8A2BE2" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#speed)" />
          <g transform="translate(640, 450)">
            {Array.from({ length: 36 }).map((_, i) => (
              <polygon
                key={i}
                points="0,0 2000,-50 2000,50"
                fill="#FF6B35"
                transform={`rotate(${i * 10})`}
                opacity={i % 2 === 0 ? 0.3 : 0.6}
              />
            ))}
          </g>
        </svg>
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 pt-6 pb-20 min-h-[900px] flex flex-col">
        {/* Navigation */}
        <nav className="flex items-center justify-between border-b-4 border-black pb-4 mb-12 bg-[#FF6B35] px-6 py-4 transform -skew-x-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-2">
            <span style={{ fontFamily: "'Rubik Mono One', sans-serif" }} className="text-2xl text-white drop-shadow-[2px_2px_0px_#000] tracking-tighter">
              ARMORMEDS
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 font-black tracking-widest text-black" style={{ fontFamily: "'Teko', sans-serif", fontSize: "1.25rem" }}>
            <a href="#" className="hover:text-white transition-colors uppercase">Weight Loss</a>
            <a href="#" className="hover:text-white transition-colors uppercase">Hair Loss</a>
            <a href="#" className="hover:text-white transition-colors uppercase">Sexual Health</a>
            <a href="#" className="hover:text-white transition-colors uppercase">Login</a>
          </div>
          <button style={{ fontFamily: "'Rubik Mono One', sans-serif" }} className="bg-[#FF1493] text-white px-6 py-2 border-2 border-black uppercase text-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
            Get Started
          </button>
        </nav>

        <div className="flex-1 flex flex-col lg:flex-row items-center gap-12 relative">
          
          {/* Main Content */}
          <div className="flex-1 space-y-8 z-20 relative">
            <div className="absolute -inset-10 bg-[#8A2BE2]/20 blur-3xl rounded-full -z-10"></div>
            
            <div className="relative transform -rotate-2">
              <span style={{ fontFamily: "'Rubik Mono One', sans-serif" }} className="inline-block bg-[#FF1493] text-white px-4 py-1 text-sm border-2 border-black mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                LEVEL UP YOUR HEALTH
              </span>
              <h1 style={{ fontFamily: "'Bangers', cursive" }} className="text-7xl lg:text-8xl leading-none text-white drop-shadow-[6px_6px_0px_#000] stroke-black"
                style={{
                  fontFamily: "'Bangers', cursive",
                  WebkitTextStroke: "3px black",
                  textShadow: "6px 6px 0 #FF6B35, 12px 12px 0 #000"
                }}>
                AWAKEN YOUR<br/>BEST SELF!
              </h1>
            </div>

            <p style={{ fontFamily: "'Teko', sans-serif" }} className="text-3xl text-white font-bold leading-tight max-w-xl bg-black/50 p-4 border-l-8 border-[#FF6B35]">
              Elite telehealth treatments for weight loss, hair loss, and sexual health. No waiting rooms. Just pure power.
            </p>

            <div className="flex flex-wrap gap-6 pt-4">
              <button 
                style={{ fontFamily: "'Rubik Mono One', sans-serif" }}
                className="group relative bg-[#FF6B35] text-white px-8 py-4 text-xl border-4 border-black uppercase shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all"
              >
                <div className="absolute -inset-2 border-2 border-[#FF6B35] opacity-0 group-hover:opacity-100 group-hover:animate-ping rounded-sm z-[-1]"></div>
                START MY VISIT!
              </button>
              <button 
                style={{ fontFamily: "'Rubik Mono One', sans-serif" }}
                className="bg-white text-black px-8 py-4 text-xl border-4 border-black uppercase shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:bg-[#8A2BE2] hover:text-white hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all"
              >
                SEE TREATMENTS
              </button>
            </div>

            {/* Benefits jagged bubble */}
            <div className="mt-12 relative w-fit">
              <svg className="absolute inset-0 w-full h-full text-[#FF1493] z-[-1] scale-110" viewBox="0 0 200 100" preserveAspectRatio="none">
                <polygon points="0,10 10,0 190,0 200,10 195,50 200,90 190,100 10,100 0,90 5,50" fill="currentColor" stroke="black" strokeWidth="4" />
              </svg>
              <div style={{ fontFamily: "'Teko', sans-serif" }} className="p-6 text-xl text-white font-bold flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[#FF6B35] text-2xl">⚡</span> DISCREET DELIVERY
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#FF6B35] text-2xl">⚡</span> LICENSED PHYSICIANS
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#FF6B35] text-2xl">⚡</span> NO INSURANCE NEEDED
                </div>
              </div>
            </div>
          </div>

          {/* Hero Illustration */}
          <div className="flex-1 relative z-10 w-full max-w-lg mx-auto lg:max-w-none">
            {/* Burst behind character */}
            <div className="absolute inset-0 bg-[#FF6B35] rounded-full blur-[100px] opacity-50 animate-pulse"></div>
            
            <div className="relative p-2 border-8 border-black bg-white shadow-[16px_16px_0px_0px_#8A2BE2] transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <div className="absolute -top-6 -right-6 bg-black text-white px-4 py-2 border-4 border-[#FF1493] transform rotate-12 z-20">
                <span style={{ fontFamily: "'Rubik Mono One', sans-serif" }} className="text-xl">100% POWER!</span>
              </div>
              <img 
                src="/__mockup/images/anime-action-hero.png" 
                alt="Shounen hero holding medical capsule" 
                className="w-full h-auto border-4 border-black relative z-10"
              />
              {/* Halftone dot overlay pattern */}
              <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-multiply z-10" style={{
                backgroundImage: 'radial-gradient(black 1px, transparent 1px)',
                backgroundSize: '10px 10px'
              }}></div>
            </div>
            
            {/* Manga SFX text */}
            <div style={{ fontFamily: "'Bangers', cursive" }} className="absolute -bottom-10 -left-10 text-6xl text-[#FF1493] transform -rotate-12 drop-shadow-[4px_4px_0px_#000] z-30"
              style={{
                fontFamily: "'Bangers', cursive",
                WebkitTextStroke: "2px black"
              }}>
              DODON!!
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
