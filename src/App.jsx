import React, { useState, useEffect, useRef, Suspense, lazy, useMemo, useCallback } from "react";
import { Moon, Sun, ArrowRight, Mouse, Code, Database, Layout, Terminal, ExternalLink, Mail, Github, Linkedin, Instagram } from "lucide-react";

import TextType from "./components/TextType";
import ProfileCard from "./components/ProfileCard"; 
import GooeyNav from "./components/GooeyNav"; 
import CardNav from "./components/CardNav"; 
import SpotlightCard from "./components/SpotlightCard"; 
import AnimatedContent from "./components/AnimatedContent"; 
import Preloader from "./components/Preloader";
import Toast from "./components/Toast";
import SkillsShowcase from "./components/SkillsShowcase";
import { AnimatePresence, motion } from "framer-motion";
import fotoProfil from "./assets/foto-profil.jpg"; 
import imgOmbudsman from "./assets/ombudsman.webp";
import imgOmbudsmanSystem from "./assets/image.webp";
import imgPaduanSuara from "./assets/paduan-suara.webp";
import imgPMM4 from "./assets/pmm4.webp";
import imgKooperasi from "./assets/kooperasi.webp";
import imgISawit from "./assets/I-Sawit.webp";
import imgISawitMobile from "./assets/I-Sawit Mobile.jpeg";
import imgPreview from "./assets/preview.png";
import imgIPaymu from "./assets/ipaymu.webp";

// Lazy Load Heavy Components
const Lanyard = lazy(() => import("./components/Lanyard/Lanyard"));
const IntroVideo = lazy(() => import("./components/IntroVideo"));
const ProjectModal = lazy(() => import("./components/ProjectModal"));
const MusicPlayer = lazy(() => import("./components/MusicPlayer"));
const CertificateModal = lazy(() => import("./components/CertificateModal"));

// Memoized Project Card Component for better performance
const ProjectCard = React.memo(({ project, onClick }) => (
  <div onClick={() => onClick(project)} className="cursor-pointer group h-full">
    <SpotlightCard spotlightColor={project.color} className="h-full !p-5">
      <div className="flex flex-col h-full space-y-5">
        <div className="w-full aspect-video bg-white/5 rounded-xl overflow-hidden border border-white/10 relative shadow-lg">
           {project.image ? (
              <img 
                src={project.image} 
                alt={project.title} 
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" 
              />
           ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                 <Code size={40} className="text-white/20 group-hover:scale-110 transition-transform duration-500" />
              </div>
           )}
           <div className="absolute top-3 left-3 px-2 py-0.5 bg-blue-600/90 rounded text-[9px] font-black uppercase tracking-wider backdrop-blur-md">
              Project
           </div>
        </div>
        <div className="space-y-2">
           <h3 className="text-xl font-bold group-hover:text-blue-400 transition-colors">{project.title}</h3>
           <p className="text-gray-400 text-sm line-clamp-2">{project.desc}</p>
        </div>
        <div className="flex-grow"></div>
        <div className="flex flex-wrap gap-2 pt-2">
           {project.tech.map((t, idx) => (
              <span key={idx} className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-bold uppercase tracking-wider text-gray-300">
                 {t}
              </span>
           ))}
        </div>
      </div>
    </SpotlightCard>
  </div>
));

// Memoized Media Card
const MediaCard = React.memo(({ item, index }) => (
  <AnimatedContent distance={40} direction="vertical" delay={index * 0.1}>
    <a href={item.link} target="_blank" rel="noopener noreferrer" className="group block h-full">
        <SpotlightCard spotlightColor={item.color} className="h-full !p-5">
          <div className="flex flex-col h-full space-y-5">
            <div className="w-full aspect-video bg-white/5 rounded-xl overflow-hidden border border-white/10 relative shadow-lg">
               <img 
                 src={item.image} 
                 alt={item.title} 
                 loading="lazy"
                 decoding="async"
                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" 
               />
               <div className="absolute top-3 left-3 px-2 py-0.5 bg-purple-600/90 rounded text-[9px] font-black uppercase tracking-wider backdrop-blur-md">
                  {item.source}
               </div>
            </div>
            <div className="space-y-2">
               <h3 className="text-lg font-bold leading-tight group-hover:text-purple-400 transition-colors duration-300 line-clamp-2">{item.title}</h3>
               <p className="text-gray-400 text-xs md:text-sm line-clamp-3 leading-relaxed opacity-80">{item.desc}</p>
            </div>
            <div className="flex items-center gap-2 text-purple-400 text-[10px] font-black uppercase tracking-widest mt-auto group-hover:gap-3 transition-all">
               Baca Artikel <ArrowRight size={12} />
            </div>
          </div>
        </SpotlightCard>
    </a>
  </AnimatedContent>
));

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
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [videoDone, setVideoDone] = useState(false);
  const [activeTab, setActiveTab] = useState(0); 
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [toastConfig, setToastConfig] = useState({ isVisible: false, message: '', type: 'success' });
  
  const portfolioItems = useMemo(() => [
    { label: "Projects", href: "#certificates" },
    { label: "Certificates", href: "#certificates" },
    { label: "Tech Stack", href: "#techstack" },
  ], []);

  const projects = useMemo(() => [
    { 
      id: 1, 
      title: "Sistem Informasi Ombudsman", 
      desc: "Sistem manajemen pengaduan masyarakat (E-Lapor) dan internal Ombudsman berbasis Laravel 11 & Filament 3.", 
      tech: ["Laravel", "Filament", "MySQL", "Tailwind"], 
      image: imgOmbudsmanSystem, 
      color: "rgba(0, 229, 255, 0.2)",
      quote: "Mempermudah birokrasi penanganan laporan masyarakat secara transparan dan teratur.",
      longDesc: "Platform E-Lapor ini digunakan oleh Ombudsman RI Kantor Perwakilan Kalimantan Selatan untuk memfasilitasi pengaduan masyarakat atas dugaan maladministrasi pelayanan publik. Dilengkapi panel admin Filament 3 yang intuitif untuk pelacakan status laporan, manajemen investigasi, serta visualisasi data statistik pengaduan."
    },
    { 
      id: 2, 
      title: "Kooperasi.com", 
      desc: "Platform SaaS HUB Koperasi Digital untuk KSP & KSU di Indonesia. Dilengkapi WhatsApp Banking, eKYC, dan Credit Scoring.", 
      tech: ["NestJS", "WhatsApp API", "PostgreSQL", "NextJs"], 
      image: imgKooperasi, 
      color: "rgba(139, 92, 246, 0.2)",
      link: "https://kooperasi.com",
      quote: "Mendigitalkan koperasi konvensional dengan ekosistem finansial berbasis SaaS.",
      longDesc: "Kooperasi.com mendigitalisasi operasional Koperasi Simpan Pinjam (KSP) dan Koperasi Serba Usaha (KSU). Sistem ini mengintegrasikan WhatsApp API untuk penarikan/setoran otomatis (WhatsApp Banking), verifikasi keanggotaan berbasis eKYC, serta credit scoring digital untuk menilai kelayakan kredit anggota secara realtime."
    },
    { 
      id: 3, 
      title: "I-Sawit", 
      desc: "Sistem monitoring dan manajemen perkebunan sawit berbasis IoT. Memantau suhu, kelembaban, dan lokasi GPS secara realtime melalui Flutter & Firebase.", 
      tech: ["Flutter", "Firebase", "ESP32", "LoRa"], 
      image: imgISawit, 
      modalImage: imgISawitMobile, 
      color: "rgba(34, 197, 94, 0.2)",
      quote: "Pemantauan perkebunan sawit secara presisi dari jarak jauh dengan jaringan sensor IoT.",
      longDesc: "Sistem IoT terintegrasi untuk membantu pengawasan perkebunan kelapa sawit secara cerdas. Menggunakan mikrokontroler ESP32 dengan sensor kelembapan tanah, suhu udara, dan GPS Tracker yang ditransmisikan melalui modul LoRaWAN untuk mengatasi keterbatasan sinyal seluler di area perkebunan, disinkronkan secara realtime ke aplikasi Flutter."
    },
    { 
      id: 4, 
      title: "iPaymu Core Engine Migration", 
      desc: "Migrasi sistem core payment gateway iPaymu v3 ke Golang. Mengoptimalkan pemrosesan transaksi berkecepatan tinggi, sistem antrean pesan, dan sinkronisasi webhook.", 
      tech: ["Go", "PostgreSQL", "Docker"], 
      image: imgIPaymu, 
      color: "rgba(220, 38, 38, 0.2)",
      link: "https://ipaymu.com",
      quote: "Optimasi konkurensi tinggi dan latensi rendah untuk memproses jutaan transaksi pembayaran online.",
      longDesc: "Mengerjakan migrasi arsitektur core payment gateway iPaymu v3 dari PHP/monolith lama ke microservices berbasis Golang. Proyek ini memfokuskan pada penanganan beban transaksi tinggi secara concurrent, meminimalkan latensi pemrosesan API, mengimplementasikan antrean pesan yang andal, sinkronisasi webhook ke merchant secara aman, serta optimasi efisiensi memori container Docker di lingkungan cloud."
    }
  ], []);

  const techStack = useMemo(() => [
    { name: "React", icon: "react" },
    { name: "Next.js", icon: "nextjs" },
    { name: "Laravel", icon: "laravel" },
    { name: "NestJS", icon: "nestjs" },
    { name: "Go", icon: "go" },
    { name: "Flutter", icon: "flutter" },
    { name: "Python", icon: "py" },
    { name: "PostgreSQL", icon: "postgres" },
    { name: "MySQL", icon: "mysql" },
    { name: "Tailwind", icon: "tailwind" },
    { name: "Firebase", icon: "firebase" },
    { name: "Docker", icon: "docker" },
  ], []);

  const certificates = useMemo(() => [
    {
      title: "Belajar Dasar Google Cloud",
      issuer: "Google Cloud / Dicoding Indonesia",
      date: "2024",
      desc: "Lulus dari kelas Belajar Dasar Google Cloud yang berfokus pada pemahaman fundamental cloud computing menggunakan Google Cloud Platform (GCP). Dalam pelatihan ini, saya mempelajari konsep layanan cloud, pengelolaan server dan jaringan, storage dan database, hingga aspek keamanan dan billing.",
      image: "/sertif-arrya/preview google cloud.webp",
      pdf: "/sertif-arrya/google cloud.pdf",
      color: "rgba(66, 133, 244, 0.2)"
    },
    {
      title: "Memulai Pemrograman dengan Python",
      issuer: "Dicoding Indonesia",
      date: "2024",
      desc: "Menyelesaikan pelatihan dasar pemrograman Python dengan standar industri. Saya mempelajari berbagai konsep penting seperti pengolahan data, control flow, struktur data (array & matriks), hingga Object-Oriented Programming (OOP). Selain itu, saya juga memahami penggunaan berbagai tools seperti VS Code, Jupyter Notebook, serta praktik terbaik seperti PEP8 dan unit testing.",
      image: "/sertif-arrya/preview pemprograman python.webp",
      pdf: "/sertif-arrya/pemprograman python.pdf",
      color: "rgba(55, 118, 171, 0.2)"
    },
    {
      title: "Prompt Engineering untuk Software Developer",
      issuer: "Dicoding Indonesia",
      date: "2024",
      desc: "Mengikuti pelatihan prompt engineering yang berfokus pada pemanfaatan Generative AI dalam software development. Saya mempelajari cara menyusun prompt yang efektif, berbagai pola prompt, serta penerapannya dalam meningkatkan produktivitas pengembangan software.",
      image: "/sertif-arrya/preview prompt engineer.webp",
      pdf: "/sertif-arrya/prompt engineer.pdf",
      color: "rgba(168, 85, 247, 0.2)"
    },
    {
      title: "Belajar Dasar Data Science",
      issuer: "Dicoding Indonesia",
      date: "2024",
      desc: "Menyelesaikan pelatihan dasar data science yang mencakup pemahaman konsep data, analisis data, serta penggunaan teknologi dan tools seperti SQL, Python, dan Tableau. Saya juga mempelajari dasar machine learning serta bagaimana memanfaatkan data untuk pengambilan keputusan.",
      image: "/sertif-arrya/preview data science.webp",
      pdf: "/sertif-arrya/data science.pdf",
      color: "rgba(34, 197, 94, 0.2)"
    },
    {
      title: "Belajar Membuat Aplikasi Back-End dengan Python",
      issuer: "Dicoding Indonesia",
      date: "2024",
      desc: "Pelatihan lanjutan untuk membangun backend RESTful API menggunakan Python. Mempelajari penanganan request-response, routing, pengelolaan database, autentikasi, serta deployment aplikasi backend.",
      image: "/sertif-arrya/preview backend python.webp",
      pdf: "/sertif-arrya/Backend Python.pdf",
      color: "rgba(239, 68, 68, 0.2)"
    },
    {
      title: "Belajar Dasar-Dasar AI",
      issuer: "Dicoding Indonesia",
      date: "2024",
      desc: "Pengenalan dasar konsep Artificial Intelligence (AI), Machine Learning, Deep Learning, Generative AI, pemanfaatan neural networks, serta implementasi kecerdasan buatan dalam memecahkan masalah nyata.",
      image: "/sertif-arrya/preview dasar AI.webp",
      pdf: "/sertif-arrya/Dasar AI.pdf",
      color: "rgba(249, 115, 22, 0.2)"
    },
    {
      title: "Belajar Dasar Machine Learning",
      issuer: "Dicoding Indonesia",
      date: "2024",
      desc: "Mempelajari dasar machine learning, pra-pemrosesan data (data preprocessing), algoritma supervised learning (klasifikasi, regresi), unsupervised learning (clustering), serta evaluasi performa model.",
      image: "/sertif-arrya/preview machine learning.webp",
      pdf: "/sertif-arrya/Machine Learning.pdf",
      color: "rgba(234, 179, 8, 0.2)"
    },
    {
      title: "Belajar Dasar UX Design",
      issuer: "Dicoding Indonesia",
      date: "2024",
      desc: "Mempelajari dasar-dasar User Experience (UX) design, proses design thinking (empathize, define, ideate, prototype, test), riset pengguna, pembuatan user persona, user journey map, wireframe, hingga usability testing.",
      image: "/sertif-arrya/preview UX design.webp",
      pdf: "/sertif-arrya/UX Design.pdf",
      color: "rgba(236, 72, 153, 0.2)"
    }
  ], []);

  const mediaItems = useMemo(() => [
    { 
      title: "Mahasiswa Poliban Ciptakan Aplikasi Penerimaan Laporan", 
      source: "Ombudsman RI", 
      image: imgOmbudsman,
      link: "https://ombudsman.go.id/perwakilan/news/r/pwk--magang-di-ombudsman-ri-kalsel-mahasiswa-poliban-ciptakan-aplikasi-penerimaan-laporan", 
      desc: "Inovasi aplikasi untuk memudahkan masyarakat dalam menyampaikan laporan ke Ombudsman. Proyek ini merupakan bagian dari kontribusi nyata mahasiswa untuk pelayanan publik.",
      color: "rgba(59, 130, 246, 0.2)"
    },
    { 
      title: "Paduan Suara Poliban Berhasil Menjuarai Lomba", 
      source: "LPM Lensa", 
      image: imgPaduanSuara,
      link: "https://www.lpmlensa.info/2023/07/paduan-suara-poliban-berhasil-menjuarai.html", 
      desc: "Prestasi gemilang tim paduan suara Poliban dalam ajang perlombaan bergengsi. Menunjukkan bakat dan kerja keras dalam bidang seni dan kreativitas.",
      color: "rgba(168, 85, 247, 0.2)"
    },
    { 
      title: "Pertukaran Mahasiswa Merdeka 4", 
      source: "Kemendikbudristek", 
      image: imgPMM4,
      link: "#", 
      desc: "Berpartisipasi dalam program Pertukaran Mahasiswa Merdeka Angkatan 4, memperluas wawasan akademik dan budaya di universitas mitra di seluruh Indonesia.",
      color: "rgba(34, 197, 94, 0.2)"
    }
  ], []);

  const navItems = useMemo(() => [
    { label: "Navigation", bgColor: "#170D27", textColor: "#fff", links: [{ label: "Home", href: "#home" }, { label: "About Me", href: "#about" }, { label: "Contact", href: "#contact" }] },
    { label: "Portfolio", bgColor: "#0D0716", textColor: "#fff", links: [{ label: "Works", href: "#certificates" }, { label: "News", href: "#news" }] },
    { label: "Social", bgColor: "#271E37", textColor: "#fff", links: [{ label: "LinkedIn", href: "https://www.linkedin.com/in/arrya-fitriansyah/" }, { label: "Instagram", href: "https://www.instagram.com/aryya_/" }] }
  ], []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleContactSubmit = useCallback(async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    try {
      const response = await fetch("https://formspree.io/f/xjgpayeq", {
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setToastConfig({ isVisible: true, message: "Pesan Anda telah berhasil dikirim!", type: "success" });
        form.reset();
        setTimeout(() => setToastConfig(prev => ({ ...prev, isVisible: false })), 4000);
      } else {
        setToastConfig({ isVisible: true, message: "Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.", type: "error" });
        setTimeout(() => setToastConfig(prev => ({ ...prev, isVisible: false })), 4000);
      }
    } catch (error) {
      setToastConfig({ isVisible: true, message: "Terjadi masalah koneksi. Periksa koneksi internet Anda.", type: "error" });
      setTimeout(() => setToastConfig(prev => ({ ...prev, isVisible: false })), 4000);
    }
  }, []);

  const handleProjectClick = useCallback((project) => {
    setSelectedProject(project);
  }, []);

  return (
    <div className="relative w-full transition-colors duration-300 bg-gray-50 text-gray-900 dark:bg-[#0a0a0a] dark:text-white font-sans overflow-x-hidden">
      
      {/* 2. PRELOADER */}
      {!preloaderDone && (
        <Preloader isLoaded={isLoaded} onExitComplete={() => setPreloaderDone(true)} />
      )}

      {/* 2.5 INTRO VIDEO (Floating Popup) */}
      <AnimatePresence>
        {preloaderDone && !videoDone && (
          <Suspense fallback={null}>
            <IntroVideo onVideoEnd={() => setVideoDone(true)} />
          </Suspense>
        )}
      </AnimatePresence>

      {/* 3. PROJECT MODAL */}
      <Suspense fallback={null}>
        <ProjectModal 
          isOpen={!!selectedProject} 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      </Suspense>

      {/* 3.5 CERTIFICATE MODAL */}
      <Suspense fallback={null}>
        <CertificateModal 
          isOpen={!!selectedCertificate} 
          certificate={selectedCertificate} 
          onClose={() => setSelectedCertificate(null)} 
        />
      </Suspense>

      {/* 4. TOAST NOTIFICATION */}
      <Toast 
        isVisible={toastConfig.isVisible} 
        message={toastConfig.message} 
        type={toastConfig.type}
        onClose={() => setToastConfig(prev => ({ ...prev, isVisible: false }))} 
      />

      <Suspense fallback={null}>
        <MusicPlayer />
      </Suspense>

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
                    <span className="text-white font-semibold">Selalu belajar</span>, Selalu berkembang, <span className="text-white font-semibold">Selalu lebih baik</span> dari kemarin.
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
                <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">Membangun Masa Depan Melalui <span className="text-blue-500">Teknologi</span>.</h2>
                <div className="space-y-4 text-gray-400 text-base md:text-lg leading-relaxed">
                  <p>
                    Halo! Saya <span className="text-white font-semibold">Arrya Fitriansyah</span>, seorang Fullstack Developer dan mahasiswa Teknik Informatika di Politeknik Negeri Banjarmasin<span className="text-blue-400 font-bold"></span>.
                  </p>
                  <p>
                    Saat ini, saya aktif berkarir di <span className="text-blue-400 font-bold">iPaymu</span> (Payment Gateway), Pengalaman saya mencakup pengembangan di <span className="text-white font-medium">Ombudsman RI</span> hingga implementasi solusi <span className="text-green-400 font-medium">IoT berbasis LoRaWAN</span>.
                  </p>
                  <p>
                    Saya menggabungkan keahlian <span className="text-white">Laravel, Golang, dan Flutter</span> dengan minat mendalam pada <span className="text-purple-400 italic">AI Engineering</span> untuk menciptakan solusi digital yang inovatif dan efisien.
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-2">
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/10 text-[10px] md:text-xs uppercase font-bold tracking-wider">
                    <Code size={14} className="text-blue-400" /> <span>Fullstack</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/10 text-[10px] md:text-xs uppercase font-bold tracking-wider">
                    <Terminal size={14} className="text-purple-400" /> <span>AI Enthusiast</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/10 text-[10px] md:text-xs uppercase font-bold tracking-wider">
                    <Database size={14} className="text-green-400" /> <span>IoT Geek</span>
                  </div>
                </div>
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
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="w-full"
                  >
                    {activeTab === 2 ? (
                      <SkillsShowcase />
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {activeTab === 0 ? projects.map((p, i) => (
                          <ProjectCard key={p.id} project={p} onClick={handleProjectClick} />
                        )) : certificates.map((c, i) => (
                          <div key={i} onClick={() => setSelectedCertificate(c)} className="group flex flex-col h-full cursor-pointer">
                            <SpotlightCard spotlightColor={c.color} className="h-full !p-5 flex flex-col justify-between">
                              <div className="space-y-4">
                                {/* Certificate Image Preview */}
                                <div className="w-full aspect-[4/3] bg-white/5 rounded-xl overflow-hidden border border-white/10 relative shadow-lg">
                                  <img 
                                    src={c.image} 
                                    alt={c.title} 
                                    loading="lazy"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100" 
                                  />
                                </div>
                                {/* Certificate Metadata */}
                                <div className="space-y-1">
                                  <h3 className="text-xl font-bold leading-tight group-hover:text-blue-400 transition-colors">{c.title}</h3>
                                  <p className="text-blue-400 text-xs font-semibold">{c.issuer}</p>
                                </div>
                                <p className="text-gray-400 text-sm line-clamp-4 leading-relaxed">{c.desc}</p>
                              </div>
                              {/* View PDF Button */}
                              <a 
                                href={c.pdf} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                onClick={(e) => e.stopPropagation()}
                                className="mt-6 w-full py-3 bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white rounded-xl font-bold flex items-center justify-center gap-2 border border-blue-500/20 hover:border-transparent transition-all active:scale-[0.98] text-xs uppercase tracking-wider cursor-pointer"
                              >
                                <span>Lihat Sertifikat</span>
                                <ExternalLink size={14} />
                              </a>
                            </SpotlightCard>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
            </div>
        </div>
      </section>

      {/* --- SECTION 4: MEDIA SECTION --- */}
      <section id="news" className="relative min-h-screen w-full bg-[#0a0a0a] text-white py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="flex flex-col items-center mb-16 space-y-4 text-center">
               <div className="inline-block px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-sm font-medium backdrop-blur-sm">Pemberitaan</div>
               <h2 className="text-4xl md:text-6xl font-bold tracking-tight">Media <span className="text-purple-500">Highlights</span>.</h2>
               <p className="text-gray-400 text-lg max-w-2xl">Liputan media dan publikasi mengenai proyek serta pencapaian saya di berbagai platform.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
               {mediaItems.map((m, i) => (
                  <MediaCard key={i} item={m} index={i} />
               ))}
            </div>
        </div>
      </section>

      {/* --- SECTION 5: CONTACT SECTION --- */}
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
                  <a href="https://github.com/arrya-fitriansyah" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10"><Github size={20} /></a>
                  <a href="https://www.linkedin.com/in/arrya-fitriansyah/" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10"><Linkedin size={20} /></a>
                  <a href="https://www.instagram.com/aryya_/" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10"><Instagram size={20} /></a>
                </div>
              </div>
            </AnimatedContent>

            <AnimatedContent distance={50} direction="horizontal" reverse={true}>
              <div className="p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm shadow-2xl">
                <form className="space-y-6" onSubmit={handleContactSubmit}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Nama</label>
                      <input required name="name" type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Email</label>
                      <input required name="email" type="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" placeholder="john@example.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Pesan</label>
                    <textarea required name="message" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors h-32 resize-none" placeholder="Tuliskan pesan Anda di sini..."></textarea>
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
          <div className="flex justify-center gap-6 mb-8">
             <a href="https://www.linkedin.com/in/arrya-fitriansyah/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">LinkedIn</a>
             <a href="https://www.instagram.com/aryya_/" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition-colors">Instagram</a>
             <a href="https://github.com/arrya-fitriansyah" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
          </div>
          <p className="text-xs opacity-50">&copy; 2026 Crafted with Passion. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
