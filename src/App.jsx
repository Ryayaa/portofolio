import React, { useState, useEffect, useRef, Suspense, lazy } from "react";
import { Moon, Sun, ArrowRight, Mouse, Code, Database, Layout, Terminal, ExternalLink } from "lucide-react";

import TextType from "./components/TextType";
import ProfileCard from "./components/ProfileCard"; 
import GooeyNav from "./components/GooeyNav"; 
import CardNav from "./components/CardNav"; 
import SpotlightCard from "./components/SpotlightCard"; 
import AnimatedContent from "./components/AnimatedContent"; 
import fotoProfil from "./assets/foto-profil.jpg"; 

// Lazy Load Komponen Lanyard
const Lanyard = lazy(() => import("./components/Lanyard/Lanyard"));

// Sensor Visibilitas
const VisibilitySensor = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.01 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} className="w-full h-full min-h-[10px]">{isVisible ? children : <div className="w-full h-full bg-black" />}</div>;
};

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState(0); 
  
  const portfolioItems = [
    { label: "Projects", href: "#certificates" },
    { label: "Certificates", href: "#certificates" },
    { label: "Tech Stack", href: "#techstack" },
  ];

  const projects = [
    { title: "POSKU (Point of Sales)", desc: "Aplikasi kasir modern untuk UMKM.", tech: ["Go", "PostgreSQL", "React"], color: "rgba(0, 229, 255, 0.2)" },
    { title: "Koperasi Digital", desc: "Sistem manajemen koperasi realtime.", tech: ["NestJS", "TypeScript", "MySQL"], color: "rgba(139, 92, 246, 0.2)" },
    { title: "IoT Smart Garden", desc: "Monitoring kelembaban tanah otomatis.", tech: ["IoT", "ESP32", "Firebase"], color: "rgba(34, 197, 94, 0.2)" }
  ];

  const certificates = [
    { title: "Fullstack Web Developer", issuer: "Dicoding Indonesia", date: "2024", desc: "Frontend & Backend competency.", color: "rgba(234, 179, 8, 0.2)" },
    { title: "Architecting on AWS", issuer: "AWS", date: "2025", desc: "Cloud architecture design.", color: "rgba(249, 115, 22, 0.2)" }
  ];

  const navItems = [
    {
      label: "Navigation",
      bgColor: isDarkMode ? "#170D27" : "#f3f4f6",
      textColor: isDarkMode ? "#fff" : "#111",
      links: [
        { label: "Home", href: "#home" },
        { label: "About Me", href: "#about" }
      ]
    },
    {
      label: "Portfolio", 
      bgColor: isDarkMode ? "#0D0716" : "#e5e7eb",
      textColor: isDarkMode ? "#fff" : "#111",
      links: [
        { label: "Works", href: "#certificates" },
        { label: "Certificates", href: "#certificates" }
      ]
    },
    {
      label: "Social",
      bgColor: isDarkMode ? "#271E37" : "#d1d5db", 
      textColor: isDarkMode ? "#fff" : "#111",
      links: [
        { label: "LinkedIn", href: "#" },
        { label: "GitHub", href: "#" }
      ]
    }
  ];

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <div className="relative w-full transition-colors duration-300 bg-gray-50 text-gray-900 dark:bg-[#0a0a0a] dark:text-white font-sans overflow-x-hidden">
      
      {/* NAVBAR */}
      <CardNav 
        logoText="ARRYA"
        items={navItems}
        baseColor={isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.8)"}
        menuColor={isDarkMode ? "#fff" : "#111"}
        buttonBgColor={isDarkMode ? "#2563eb" : "#111"}
        buttonTextColor="#fff"
        onCtaClick={() => window.open('mailto:your@email.com')}
      />

      {/* TEMA TOGGLE */}
      <button
        onClick={toggleTheme}
        className="fixed bottom-8 right-8 z-[50] p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:scale-110 transition-transform shadow-xl cursor-pointer text-white"
      >
        {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
      </button>

      {/* --- SECTION 1: HERO SECTION --- */}
      <section id="home" className="relative min-h-screen w-full flex items-center pt-24 md:pt-32 pb-12 overflow-hidden bg-black">
        <div className="absolute inset-0 z-0 bg-black">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a] z-10 pointer-events-none"></div>
        </div>

        <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 md:order-1 flex flex-col items-center md:items-start text-center md:text-left space-y-8">
              <AnimatedContent distance={100} direction="horizontal" reverse={true}>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-lg md:text-xl font-medium text-blue-300 uppercase tracking-[0.2em] opacity-80">Halo, saya</h2>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.1] tracking-tight">
                      Arrya <br/>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Fitriansyah</span>
                    </h1>
                  </div>
                  <div className="h-10 flex items-center justify-center md:justify-start">
                    <div className="text-xl md:text-3xl font-semibold text-gray-300">Seorang&nbsp;</div>
                    <div className="text-xl md:text-3xl font-bold text-blue-400">
                      <TextType text={["Fullstack Developer", "React Enthusiast"]} loop={true} />
                    </div>
                  </div>
                  <p className="max-w-lg text-gray-400 text-lg md:text-xl leading-relaxed">
                    Membangun aplikasi web yang <span className="text-white font-semibold">cepat</span>, <span className="text-white font-semibold">responsif</span>, dan <span className="text-white font-semibold">interaktif</span>.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-4 justify-center md:justify-start">
                    <button className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold shadow-2xl shadow-blue-500/20 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer">
                      <span>Lihat Projek</span>
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </div>
              </AnimatedContent>
            </div>

            <div className="order-1 md:order-2 flex justify-center md:justify-end relative z-20">
               <AnimatedContent distance={100} direction="horizontal" delay={0.2}>
                 <div className="w-full max-w-[400px] hover:scale-[1.02] transition-transform duration-500">
                    <ProfileCard 
                      name="Arrya Fitriansyah" 
                      title="Fullstack Developer" 
                      handle="arryafit" 
                      avatarUrl={fotoProfil} 
                      onContactClick={() => alert("Contact!")} 
                    />
                 </div>
               </AnimatedContent>
            </div>
          </div>
        </main>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white/50"><Mouse size={24} /></div>
      </section>

      {/* --- SECTION 2: ABOUT & LANYARD SECTION --- */}
      <section id="about" className="relative min-h-screen w-full bg-[#0a0a0a] flex items-center justify-center overflow-hidden border-t border-white/5 py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full h-full grid md:grid-cols-2 gap-10 items-center">
          <div className="order-1 w-full h-[50vh] md:h-screen relative flex items-center justify-center">
             <div className="absolute w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
             <div className="w-full h-full">
                <VisibilitySensor>
                   <Suspense fallback={<div className="flex items-center justify-center h-full text-white/20">Loading 3D...</div>}>
                      <Lanyard />
                   </Suspense>
                </VisibilitySensor>
             </div>
          </div>
          <div className="order-2 flex flex-col items-start space-y-6">
            <AnimatedContent distance={50} direction="vertical">
              <div className="space-y-6 text-left">
                <div className="inline-block px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-medium backdrop-blur-sm">Tentang Saya</div>
                <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">Menggabungkan <span className="text-blue-500">Kode</span> dengan <span className="text-purple-500">Kreativitas</span>.</h2>
                <p className="text-gray-300 text-lg leading-relaxed">Saya adalah Fullstack Developer yang berfokus pada performa dan estetika menggunakan teknologi modern.</p>
              </div>
            </AnimatedContent>
          </div>
        </div>
      </section>

      {/* --- SECTION 3: PORTFOLIO SECTION --- */}
      <section id="certificates" className="relative min-h-screen w-full bg-[#050505] text-white py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center">
            <h2 className="text-4xl font-bold mb-12">Portfolio <span className="text-blue-500">Showcase</span></h2>
            <GooeyNav items={portfolioItems} onItemClick={(index) => setActiveTab(index)} />
            <div className="w-full mt-16">
                <AnimatedContent key={activeTab}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {activeTab === 0 ? projects.map((p, i) => (
                      <SpotlightCard key={i} spotlightColor={p.color} className="h-full">
                        <div className="flex flex-col h-full space-y-4">
                          <h3 className="text-2xl font-bold mb-2">{p.title}</h3>
                          <p className="text-gray-400 text-sm">{p.desc}</p>
                          <div className="flex-grow"></div>
                          <div className="flex flex-wrap gap-2 pt-4">{p.tech.map((t, idx) => <span key={idx} className="px-3 py-1 bg-white/10 rounded-full text-xs">{t}</span>)}</div>
                        </div>
                      </SpotlightCard>
                    )) : activeTab === 1 ? certificates.map((c, i) => (
                      <SpotlightCard key={i} spotlightColor={c.color} className="h-full">
                        <div className="flex flex-col h-full">
                          <h3 className="text-xl font-bold mb-1">{c.title}</h3>
                          <p className="text-blue-400 text-sm mb-2">{c.issuer}</p>
                          <p className="text-gray-400 text-sm">{c.desc}</p>
                        </div>
                      </SpotlightCard>
                    )) : (
                      <div className="col-span-full grid grid-cols-2 md:grid-cols-4 gap-6 w-full text-center">
                         <div className="p-8 bg-white/5 rounded-2xl border border-white/10">React</div>
                         <div className="p-8 bg-white/5 rounded-2xl border border-white/10">NestJS</div>
                         <div className="p-8 bg-white/5 rounded-2xl border border-white/10">Go</div>
                         <div className="p-8 bg-white/5 rounded-2xl border border-white/10">PostgreSQL</div>
                      </div>
                    )}
                  </div>
                </AnimatedContent>
            </div>
        </div>
      </section>
    </div>
  );
}

export default App;
