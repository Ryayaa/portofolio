import React, { useState, useEffect, useRef, Suspense, lazy } from "react";
import { Moon, Sun, ArrowRight, Mouse, Code, Database, Layout, Terminal, ExternalLink, Mail, Github, Linkedin } from "lucide-react";

import TextType from "./components/TextType";
import ProfileCard from "./components/ProfileCard"; 
import GooeyNav from "./components/GooeyNav"; 
import CardNav from "./components/CardNav"; 
import SpotlightCard from "./components/SpotlightCard"; 
import AnimatedContent from "./components/AnimatedContent"; 
import MusicPlayer from "./components/MusicPlayer";
import Preloader from "./components/Preloader";
import ProjectModal from "./components/ProjectModal";
import Toast from "./components/Toast";
import fotoProfil from "./assets/foto-profil.jpg"; 

// Lazy Load Komponen Lanyard
const Lanyard = lazy(() => import("./components/Lanyard/Lanyard"));

// Sensor Visibilitas
const VisibilitySensor = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setIsVisible(true); }, { threshold: 0.01 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className="w-full h-full min-h-[10px]">{isVisible ? children : <div className="w-full h-full bg-black" />}</div>;
};

function App() {
  // 1. THEME PERSISTENCE
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState(0); 
  const [selectedProject, setSelectedProject] = useState(null);
  const [showToast, setShowToast] = useState(false);
  
  const portfolioItems = [
    { label: "Projects", href: "#certificates" },
    { label: "Certificates", href: "#certificates" },
    { label: "Tech Stack", href: "#techstack" },
  ];

  const projects = [
    { id: 1, title: "POSKU (Point of Sales)", desc: "Aplikasi kasir modern untuk UMKM dengan manajemen stok realtime.", tech: ["Go", "PostgreSQL", "React"], color: "rgba(0, 229, 255, 0.2)" },
    { id: 2, title: "Koperasi Digital", desc: "Sistem manajemen koperasi realtime dengan dashboard admin lengkap.", tech: ["NestJS", "TypeScript", "MySQL"], color: "rgba(139, 92, 246, 0.2)" },
    { id: 3, title: "IoT Smart Garden", desc: "Monitoring kelembaban tanah otomatis berbasis ESP32 dan Firebase.", tech: ["IoT", "ESP32", "Firebase"], color: "rgba(34, 197, 94, 0.2)" }
  ];

  const certificates = [
    { title: "Fullstack Web Developer", issuer: "Dicoding Indonesia", date: "2024", desc: "Frontend & Backend competency.", color: "rgba(234, 179, 8, 0.2)" },
    { title: "Architecting on AWS", issuer: "AWS", date: "2025", desc: "Cloud architecture design.", color: "rgba(249, 115, 22, 0.2)" }
  ];

  const navItems = [
    { label: "Navigation", bgColor: "#170D27", textColor: "#fff", links: [{ label: "Home", href: "#home" }, { label: "About Me", href: "#about" }, { label: "Contact", href: "#contact" }] },
    { label: "Portfolio", bgColor: "#0D0716", textColor: "#fff", links: [{ label: "Works", href: "#certificates" }, { label: "Certificates", href: "#certificates" }] },
    { label: "Social", bgColor: "#271E37", textColor: "#fff", links: [{ label: "LinkedIn", href: "#" }, { label: "GitHub", href: "#" }] }
  ];

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  return (
    <div className="relative w-full transition-colors duration-300 bg-gray-50 text-gray-900 dark:bg-[#0a0a0a] dark:text-white font-sans overflow-x-hidden">
      
      {/* 2. PRELOADER */}
      <Preloader isLoaded={isLoaded} />

      {/* 3. PROJECT MODAL */}
      <ProjectModal 
        isOpen={!!selectedProject} 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />

      {/* 4. TOAST NOTIFICATION */}
      <Toast 
        isVisible={showToast} 
        message="Pesan Anda telah berhasil dikirim!" 
        onClose={() => setShowToast(false)} 
      />

      <MusicPlayer />

      <CardNav 
        logoText="ARRYA"
        items={navItems}
        baseColor={isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.8)"}
        menuColor={isDarkMode ? "#fff" : "#111"}
        buttonBgColor={isDarkMode ? "#2563eb" : "#111"}
        buttonTextColor="#fff"
        onCtaClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
      />

      {/* TEMA TOGGLE */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="fixed bottom-8 right-8 z-[50] p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:scale-110 transition-transform shadow-xl cursor-pointer text-white"
      >
        {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
      </button>

      {/* --- SECTION 1: HERO SECTION --- */}
      <section id="home" className="relative min-h-screen w-full flex items-center pt-20 md:pt-32 pb-12 overflow-hidden bg-black">
        <div className="absolute inset-0 z-0 bg-black">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a] z-10 pointer-events-none"></div>
        </div>

        <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-20 items-center">
            <div className="order-2 md:order-1 flex flex-col items-center md:items-start text-center md:text-left space-y-6 md:space-y-8">
              <AnimatedContent distance={100} direction="horizontal" reverse={true}>
                <div className="space-y-4 md:space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-sm md:text-xl font-medium text-blue-300 uppercase tracking-[0.2em] opacity-80">Halo, saya</h2>
                    <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.1] tracking-tight">
                      Arrya <br/>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Fitriansyah</span>
                    </h1>
                  </div>
                  <div className="h-8 md:h-10 flex items-center justify-center md:justify-start">
                    <div className="text-lg md:text-3xl font-semibold text-gray-300">Seorang&nbsp;</div>
                    <div className="text-lg md:text-3xl font-bold text-blue-400">
                      <Suspense fallback={<span>Developer</span>}>
                        <TextType text={["Fullstack Developer", "React Enthusiast"]} loop={true} />
                      </Suspense>
                    </div>
                  </div>
                  <p className="max-w-lg text-gray-400 text-base md:text-xl leading-relaxed">
                    Membangun aplikasi web yang <span className="text-white font-semibold">cepat</span>, <span className="text-white font-semibold">responsif</span>, dan <span className="text-white font-semibold">interaktif</span>.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-4 justify-center md:justify-start">
                    <button 
                      onClick={() => document.getElementById('certificates').scrollIntoView({ behavior: 'smooth' })}
                      className="px-6 py-3 md:px-8 md:py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl md:rounded-2xl font-bold shadow-2xl shadow-blue-500/20 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    >
                      <span>Lihat Projek</span>
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </AnimatedContent>
            </div>

            <div className="order-1 md:order-2 flex justify-center md:justify-end relative z-20">
               <AnimatedContent distance={100} direction="horizontal" delay={0.2}>
                 <div className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[400px] hover:scale-[1.02] transition-transform duration-500">
                    <ProfileCard name="Arrya Fitriansyah" title="Fullstack Developer" handle="aryya_" avatarUrl={fotoProfil} onContactClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })} />
                 </div>
               </AnimatedContent>
            </div>
          </div>
        </main>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce text-white/30 hidden md:block"><Mouse size={24} /></div>
      </section>

      {/* --- SECTION 2: ABOUT & LANYARD SECTION --- */}
      <section id="about" className="relative min-h-screen w-full bg-[#0a0a0a] flex items-center justify-center overflow-hidden border-t border-white/5 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full h-full grid md:grid-cols-2 gap-10 items-center">
          <div className="order-2 md:order-1 w-full h-[40vh] md:h-screen relative flex items-center justify-center">
             <div className="absolute w-[200px] md:w-[300px] h-[200px] md:h-[300px] bg-blue-600/10 rounded-full blur-[80px] md:blur-[100px] pointer-events-none"></div>
             <div className="w-full h-full">
                <VisibilitySensor>
                   <Suspense fallback={<div className="flex items-center justify-center h-full text-white/20 font-mono text-xs uppercase tracking-widest">Loading 3D...</div>}>
                      <Lanyard />
                   </Suspense>
                </VisibilitySensor>
             </div>
          </div>
          <div className="order-1 md:order-2 flex flex-col items-start space-y-4 md:space-y-6">
            <AnimatedContent distance={50} direction="vertical">
              <div className="space-y-4 md:space-y-6 text-center md:text-left">
                <div className="inline-block px-3 py-1 md:px-4 md:py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs md:text-sm font-medium backdrop-blur-sm">Tentang Saya</div>
                <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">Menggabungkan <span className="text-blue-500">Kode</span> dengan <span className="text-purple-500">Kreativitas</span>.</h2>
                <p className="text-gray-400 text-base md:text-lg leading-relaxed">Saya adalah Fullstack Developer yang berfokus pada performa dan estetika menggunakan teknologi modern.</p>
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
                      <div key={i} onClick={() => setSelectedProject(p)} className="cursor-pointer group">
                        <SpotlightCard spotlightColor={p.color} className="h-full">
                          <div className="flex flex-col h-full space-y-4">
                            <h3 className="text-2xl font-bold mb-2 group-hover:text-blue-400 transition-colors">{p.title}</h3>
                            <p className="text-gray-400 text-sm">{p.desc}</p>
                            <div className="flex-grow"></div>
                            <div className="flex flex-wrap gap-2 pt-4">{p.tech.map((t, idx) => <span key={idx} className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase">{t}</span>)}</div>
                          </div>
                        </SpotlightCard>
                      </div>
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

      {/* --- SECTION 4: CONTACT SECTION --- */}
      <section id="contact" className="relative min-h-screen w-full bg-[#0a0a0a] text-white py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <AnimatedContent distance={50} direction="horizontal">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-4xl md:text-6xl font-bold tracking-tight">Let's <span className="text-blue-500">Connect</span>.</h2>
                  <p className="text-gray-400 text-lg max-w-md">Punya ide proyek atau sekadar ingin menyapa? Jangan ragu untuk menghubungi saya!</p>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/20">
                      <Mail className="text-blue-500" size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 uppercase tracking-widest font-bold">Email</p>
                      <p className="text-lg underline underline-offset-4 decoration-blue-500/30">arryawork@gmail.com</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <a href="#" className="p-3 bg-white/5 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10"><Github size={20} /></a>
                  <a href="#" className="p-3 bg-white/5 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10"><Linkedin size={20} /></a>
                </div>
              </div>
            </AnimatedContent>

            <AnimatedContent distance={50} direction="horizontal" reverse={true}>
              <div className="p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm shadow-2xl">
                <form className="space-y-6" onSubmit={handleContactSubmit}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Nama</label>
                      <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Email</label>
                      <input required type="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" placeholder="john@example.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Pesan</label>
                    <textarea required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors h-32 resize-none" placeholder="Tuliskan pesan Anda di sini..."></textarea>
                  </div>
                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold transition-all transform active:scale-[0.98] shadow-lg shadow-blue-600/20">
                    Kirim Pesan
                  </button>
                </form>
              </div>
            </AnimatedContent>
          </div>
        </div>
      </section>

      <footer className="w-full py-12 bg-black border-t border-white/5 text-center text-gray-500">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-sm tracking-widest uppercase font-bold text-white/20 mb-4">Arrya Fitriansyah</p>
          <p className="text-xs opacity-50">&copy; 2026 Crafted with Passion. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
