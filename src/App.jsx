import React, { useState, useEffect, useRef, Suspense, lazy, useMemo, useCallback } from "react";
import { Moon, Sun, ArrowRight, Mouse, Code, Database, Layout, Terminal, ExternalLink, Mail, Github, Linkedin, Instagram, Globe } from "lucide-react";

import TextType from "./components/TextType";
import ProfileCard from "./components/ProfileCard"; 
import GooeyNav from "./components/GooeyNav"; 
import CardNav from "./components/CardNav"; 
import SpotlightCard from "./components/SpotlightCard"; 
import AnimatedContent from "./components/AnimatedContent"; 
import Preloader from "./components/Preloader";
import Toast from "./components/Toast";
import SkillsShowcase from "./components/SkillsShowcase";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import fotoProfil from "./assets/foto-profil.jpg"; 
import imgOmbudsman from "./assets/ombudsman.webp";
import imgOmbudsmanSystem from "./assets/image.webp";
import imgPaduanSuara from "./assets/paduan-suara.webp";
import imgPMM4 from "./assets/pmm4.webp";
import imgKooperasi from "./assets/kooperasi.webp";
import imgISawit from "./assets/I-Sawit.webp";
import imgISawitMobile from "./assets/I-Sawit Mobile.jpeg";
import imgIPaymu from "./assets/ipaymu.webp";

// Lazy Load Heavy Components
const Lanyard = lazy(() => import("./components/Lanyard/Lanyard"));
const IntroVideo = lazy(() => import("./components/IntroVideo"));
const ProjectModal = lazy(() => import("./components/ProjectModal"));
const MusicPlayer = lazy(() => import("./components/MusicPlayer"));
const CertificateModal = lazy(() => import("./components/CertificateModal"));

// Memoized Project Card Component for better performance
const ProjectCard = React.memo(({ project, onClick }) => (
  <div onClick={() => onClick(project)} className="cursor-pointer group h-full snap-center shrink-0 w-[82vw] sm:w-[320px] md:w-auto md:shrink-1">
    <SpotlightCard spotlightColor={project.color} className="h-full !p-5">
      <div className="flex flex-col h-full space-y-5">
        <div className="w-full aspect-video bg-black/5 dark:bg-white/5 rounded-xl overflow-hidden border border-black/10 dark:border-white/10 relative shadow-lg">
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
           <div className="absolute top-3 left-3 px-2 py-0.5 bg-blue-600/90 rounded text-[9px] font-black uppercase tracking-wider backdrop-blur-md text-white">
              Project
           </div>
        </div>
        <div className="space-y-2">
           <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{project.title}</h3>
           <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">{project.desc}</p>
        </div>
        <div className="flex-grow"></div>
        <div className="flex flex-wrap gap-2 pt-2">
           {project.tech.map((t, idx) => (
              <span key={idx} className="px-2.5 py-1 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg text-[9px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                 {t}
              </span>
           ))}
        </div>
      </div>
    </SpotlightCard>
  </div>
));

// Memoized Media Card
const MediaCard = React.memo(({ item, index, lang = 'en' }) => (
  <AnimatedContent 
    distance={40} 
    direction="vertical" 
    delay={index * 0.1}
    className="snap-center shrink-0 w-[82vw] sm:w-[320px] md:w-auto md:shrink-1"
  >
    <a href={item.link} target="_blank" rel="noopener noreferrer" className="group block h-full">
        <SpotlightCard spotlightColor={item.color} className="h-full !p-5">
          <div className="flex flex-col h-full space-y-5">
            <div className="w-full aspect-video bg-black/5 dark:bg-white/5 rounded-xl overflow-hidden border border-black/10 dark:border-white/10 relative shadow-lg">
               <img 
                 src={item.image} 
                 alt={item.title} 
                 loading="lazy"
                 decoding="async"
                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" 
               />
               <div className="absolute top-3 left-3 px-2 py-0.5 bg-purple-600/90 rounded text-[9px] font-black uppercase tracking-wider backdrop-blur-md text-white">
                  {item.source}
               </div>
            </div>
            <div className="space-y-2">
               <h3 className="text-lg font-bold leading-tight text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300 line-clamp-2">{item.title}</h3>
               <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm line-clamp-3 leading-relaxed opacity-80">{item.desc}</p>
            </div>
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 text-[10px] font-black uppercase tracking-widest mt-auto group-hover:gap-3 transition-all">
               {lang === 'id' ? 'Baca Artikel' : 'Read Article'} <ArrowRight size={12} />
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
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.01 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className="w-full h-full min-h-[10px]">{isVisible ? children : <div className="w-full h-full bg-black" />}</div>;
};

// Web Audio API Synthesized Tick/Click Sounds
const playTickSound = (isClick = false) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (isClick) {
      // Mechanical deep click sound
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.03);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.03);
      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    } else {
      // High-pitched soft tick sound
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.012);
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.012);
      osc.start();
      osc.stop(ctx.currentTime + 0.012);
    }
  } catch (e) {
    // Fail silently
  }
};

const playSecretSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = window._audioCtx || new AudioContext();
    window._audioCtx = ctx;
    
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    
    const now = ctx.currentTime;
    // Classic 8-bit retro sound: C5 -> E5 -> G5 -> C6 -> E6 -> G6 -> C7
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98, 2093.00];
    const duration = 0.07;
    
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      gain.gain.setValueAtTime(0.08, now + i * duration);
      gain.gain.exponentialRampToValueAtTime(0.00001, now + i * duration + duration);
      
      osc.start(now + i * duration);
      osc.stop(now + i * duration + duration);
    });
  } catch (e) {
    // Fail silently
  }
};

function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });



  // Global sound interaction listener
  useEffect(() => {
    const handleGlobalClick = (e) => {
      const target = e.target.closest('a, button, [role="button"], .cursor-pointer');
      if (target) {
        playTickSound(true);
      }
    };

    const handleGlobalMouseOver = (e) => {
      const target = e.target.closest('a, button, [role="button"], .cursor-pointer');
      if (target) {
        if (target !== window._lastHoveredElement) {
          playTickSound(false);
          window._lastHoveredElement = target;
        }
      } else {
        window._lastHoveredElement = null;
      }
    };

    window.addEventListener('click', handleGlobalClick, { passive: true });
    window.addEventListener('mouseover', handleGlobalMouseOver, { passive: true });

    return () => {
      window.removeEventListener('click', handleGlobalClick);
      window.removeEventListener('mouseover', handleGlobalMouseOver);
    };
  }, []);

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
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('lang');
    return saved || 'en';
  });

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  // Konami Code Easter Egg
  useEffect(() => {
    const konamiCode = [
      'arrowup', 'arrowup',
      'arrowdown', 'arrowdown',
      'arrowleft', 'arrowright',
      'arrowleft', 'arrowright',
      'b', 'a'
    ];
    let konamiIndex = 0;

    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          playSecretSound();
          
          setToastConfig({
            isVisible: true,
            message: lang === 'id' 
              ? "👾 Kode Konami Berhasil! Selamat datang di Mode Rahasia Developer!" 
              : "👾 Konami Code Activated! Welcome to Secret Developer Mode!",
            type: "success"
          });
          
          setTimeout(() => {
            setToastConfig(prev => ({ ...prev, isVisible: false }));
          }, 5000);
          
          konamiIndex = 0;
        }
      } else {
        konamiIndex = key === konamiCode[0] ? 1 : 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lang]);

  const portfolioRef = useRef(null);
  const mediaRef = useRef(null);

  // Auto Scroll Mobile Carousel
  useEffect(() => {
    const isMobile = () => window.innerWidth < 768;

    const setupAutoScroll = (ref) => {
      const container = ref.current;
      if (!container) return null;

      let intervalId;
      let isInteracting = false;
      let interactionTimeout;

      const startAutoScroll = () => {
        if (intervalId) clearInterval(intervalId);
        intervalId = setInterval(() => {
          if (isInteracting || !isMobile()) return;

          const card = container.firstElementChild;
          if (!card) return;

          const cardWidth = card.offsetWidth;
          const gap = 24; // gap-6 is 24px
          const step = cardWidth + gap;

          const maxScroll = container.scrollWidth - container.clientWidth;
          
          if (container.scrollLeft >= maxScroll - 5) {
            container.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            container.scrollTo({ left: container.scrollLeft + step, behavior: 'smooth' });
          }
        }, 3500);
      };

      const handleInteraction = () => {
        isInteracting = true;
        if (interactionTimeout) clearTimeout(interactionTimeout);
        interactionTimeout = setTimeout(() => {
          isInteracting = false;
        }, 5000);
      };

      container.addEventListener('touchstart', handleInteraction, { passive: true });
      container.addEventListener('scroll', handleInteraction, { passive: true });

      if (isMobile()) {
        startAutoScroll();
      }

      return () => {
        if (intervalId) clearInterval(intervalId);
        if (interactionTimeout) clearTimeout(interactionTimeout);
        container.removeEventListener('touchstart', handleInteraction);
        container.removeEventListener('scroll', handleInteraction);
      };
    };

    const cleanupPortfolio = setupAutoScroll(portfolioRef);
    const cleanupMedia = setupAutoScroll(mediaRef);

    return () => {
      cleanupPortfolio?.();
      cleanupMedia?.();
    };
  }, [activeTab]);

  // Helper translations dictionary
  const t = useMemo(() => {
    const getDynamicGreeting = () => {
      const hour = new Date().getHours();
      if (lang === 'id') {
        if (hour >= 4 && hour < 11) return "Selamat Pagi 🌅, saya";
        if (hour >= 11 && hour < 15) return "Selamat Siang ☀️, saya";
        if (hour >= 15 && hour < 18.5) return "Selamat Sore 🌇, saya";
        return "Selamat Malam 🌙, saya";
      } else {
        if (hour >= 4 && hour < 12) return "Good Morning 🌅, I am";
        if (hour >= 12 && hour < 17) return "Good Afternoon ☀️, I am";
        if (hour >= 17 && hour < 19) return "Good Evening 🌇, I am";
        return "Good Night 🌙, I am";
      }
    };

    return {
      // Navbar
      home: lang === 'id' ? 'Beranda' : 'Home',
      about: lang === 'id' ? 'Tentang' : 'About Me',
      contact: lang === 'id' ? 'Kontak' : 'Contact',
      works: lang === 'id' ? 'Karya' : 'Works',
      news: lang === 'id' ? 'Berita' : 'News',
      ctaButton: lang === 'id' ? 'Hubungi Saya' : 'Contact Me',
      
      // Hero
      greeting: getDynamicGreeting(),
      rolePrefix: lang === 'id' ? 'Seorang\u00a0' : 'A\u00a0',
    heroMotto: lang === 'id' ? (
      <>
        <span className="text-gray-900 dark:text-white font-semibold">Selalu belajar</span>, Selalu berkembang, <span className="text-gray-900 dark:text-white font-semibold">Selalu lebih baik</span> dari kemarin.
      </>
    ) : (
      <>
        <span className="text-gray-900 dark:text-white font-semibold">Always learning</span>, Always growing, <span className="text-gray-900 dark:text-white font-semibold">Always better</span> than yesterday.
      </>
    ),
    viewProjects: lang === 'id' ? 'Lihat Projek' : 'View Projects',
    
    // About
    aboutMeTag: lang === 'id' ? 'Tentang Saya' : 'About Me',
    aboutTitle: lang === 'id' ? <>Membangun Masa Depan Melalui <span className="text-blue-500">Teknologi</span>.</> : <>Building the Future Through <span className="text-blue-500">Technology</span>.</>,
    aboutP1: lang === 'id' ? (
      <p>
        Halo! Saya <span className="text-gray-900 dark:text-white font-semibold">Arrya Fitriansyah</span>, seorang  Fullstack Developer dan mahasiswa Teknik Informatika di Politeknik Negeri Banjarmasin.
      </p>
    ) : (
      <p>
        Hello! I am <span className="text-gray-900 dark:text-white font-semibold">Arrya Fitriansyah</span>, a  Fullstack Developer and Informatics Engineering student at State Polytechnic of Banjarmasin.
      </p>
    ),
    aboutP2: lang === 'id' ? (
      <p>
        Saat ini, saya aktif berkarir di <span className="text-blue-600 dark:text-blue-400 font-bold">iPaymu</span> (Payment Gateway). Pengalaman saya mencakup pengembangan di <span className="text-gray-900 dark:text-white font-medium">Ombudsman RI</span> hingga implementasi solusi <span className="text-green-600 dark:text-green-400 font-medium">IoT berbasis LoRaWAN</span>.
      </p>
    ) : (
      <p>
        Currently, I am active at <span className="text-blue-600 dark:text-blue-400 font-bold">iPaymu</span> (Payment Gateway). My experience covers development at <span className="text-gray-900 dark:text-white font-medium">Ombudsman RI</span> to implementing <span className="text-green-600 dark:text-green-400 font-medium">LoRaWAN-based IoT</span> solutions.
      </p>
    ),
    aboutP3: lang === 'id' ? (
      <p>
        Saya menggabungkan keahlian <span className="text-gray-900 dark:text-white font-medium">Laravel, Golang, dan Flutter</span> dengan minat mendalam pada <span className="text-purple-600 dark:text-purple-400 italic">AI Engineering</span> untuk menciptakan solusi digital yang inovatif dan efisien.
      </p>
    ) : (
      <p>
        I combine expertise in <span className="text-gray-900 dark:text-white font-medium">Laravel, Golang, and Flutter</span> with a deep interest in <span className="text-purple-600 dark:text-purple-400 italic">AI Engineering</span> to create innovative and efficient digital solutions.
      </p>
    ),
    skillsTag: lang === 'id' ? 'Kemampuan' : 'Skills',
    
    // Portfolio Showcase
    showcaseTitle: lang === 'id' ? 'Portfolio Showcase' : 'Portfolio Showcase',
    gradYear: lang === 'id' ? 'Tahun Kelulusan' : 'Graduation Year',
    viewCertCardBtn: lang === 'id' ? 'Lihat Sertifikat' : 'View Certificate',
    
    // Media
    newsTag: lang === 'id' ? 'Pemberitaan' : 'Media Coverage',
    newsTitle: lang === 'id' ? 'Media Highlights' : 'Media Highlights',
    newsDesc: lang === 'id' ? 'Liputan media dan publikasi mengenai proyek serta pencapaian saya di berbagai platform.' : 'Media coverage and publications regarding my projects and achievements on various platforms.',
    readArticle: lang === 'id' ? 'Baca Artikel' : 'Read Article',
    
    // Contact
    contactTitle: lang === 'id' ? "Let's Connect." : "Let's Connect.",
    contactDesc: lang === 'id' ? 'Punya ide proyek atau sekadar ingin menyapa? Jangan ragu untuk menghubungi saya!' : "Have a project idea or just want to say hi? Don't hesitate to contact me!",
    nameLabel: lang === 'id' ? 'Nama' : 'Name',
    emailLabel: lang === 'id' ? 'Email' : 'Email',
    messageLabel: lang === 'id' ? 'Pesan' : 'Message',
    messagePlaceholder: lang === 'id' ? 'Tuliskan pesan Anda di sini...' : 'Write your message here...',
    sendButton: lang === 'id' ? 'Kirim Pesan' : 'Send Message',
    
    // Footer & General
    footerSub: lang === 'id' ? 'Crafted with Passion. All Rights Reserved.' : 'Crafted with Passion. All Rights Reserved.',
    successToast: lang === 'id' ? 'Pesan Anda telah berhasil dikirim!' : 'Your message has been successfully sent!',
    errorToast: lang === 'id' ? 'Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.' : 'An error occurred while sending your message. Please try again.',
    connErrorToast: lang === 'id' ? 'Terjadi masalah koneksi. Periksa koneksi internet Anda.' : 'Connection problem occurred. Please check your internet connection.'
    };
  }, [lang]);
  
  const portfolioItems = useMemo(() => [
    { label: lang === 'id' ? "Proyek" : "Projects", href: "#certificates" },
    { label: lang === 'id' ? "Sertifikat" : "Certificates", href: "#certificates" },
    { label: lang === 'id' ? "Keahlian" : "Tech Stack", href: "#techstack" },
  ], [lang]);

  const projects = useMemo(() => [
    { 
      id: 1, 
      title: "Sistem Informasi Ombudsman", 
      desc: lang === 'id' 
        ? "Sistem manajemen pengaduan masyarakat (E-Lapor) dan internal Ombudsman berbasis Laravel 11 & Filament 3."
        : "Public complaint management system (E-Lapor) and internal Ombudsman system based on Laravel 11 & Filament 3.", 
      tech: ["Laravel", "Filament", "MySQL", "Tailwind"], 
      image: imgOmbudsmanSystem, 
      color: "rgba(0, 229, 255, 0.2)",
      quote: lang === 'id'
        ? "Mempermudah birokrasi penanganan laporan masyarakat secara transparan dan teratur."
        : "Simplifying the bureaucracy of public report handling in a transparent and organized manner.",
      longDesc: lang === 'id'
        ? "Platform E-Lapor ini digunakan oleh Ombudsman RI Kantor Perwakilan Kalimantan Selatan untuk memfasilitasi pengaduan masyarakat atas dugaan maladministrasi pelayanan publik. Dilengkapi panel admin Filament 3 yang intuitif untuk pelacakan status laporan, manajemen investigasi, serta visualisasi data statistik pengaduan."
        : "This E-Lapor platform is used by the Ombudsman RI South Kalimantan Representative Office to facilitate public complaints regarding public service maladministration. Equipped with an intuitive Filament 3 admin panel for tracking report statuses, managing investigations, and visualizing statistics."
    },
    { 
      id: 2, 
      title: "Kooperasi.com", 
      desc: lang === 'id'
        ? "Platform SaaS HUB Koperasi Digital untuk KSP & KSU di Indonesia. Dilengkapi WhatsApp Banking, eKYC, dan Credit Scoring."
        : "SaaS HUB platform for Digital Cooperatives (KSP & KSU) in Indonesia. Features WhatsApp Banking, eKYC, and Credit Scoring.", 
      tech: ["NestJS", "WhatsApp API", "PostgreSQL", "NextJs"], 
      image: imgKooperasi, 
      color: "rgba(139, 92, 246, 0.2)",
      link: "https://kooperasi.com",
      quote: lang === 'id'
        ? "Mendigitalkan koperasi konvensional dengan ekosistem finansial berbasis SaaS."
        : "Digitizing conventional cooperatives with a SaaS-based financial ecosystem.",
      longDesc: lang === 'id'
        ? "Kooperasi.com mendigitalisasi operasional Koperasi Simpan Pinjam (KSP) dan Koperasi Serba Usaha (KSU). Sistem ini mengintegrasikan WhatsApp API untuk penarikan/setoran otomatis (WhatsApp Banking), verifikasi keanggotaan berbasis eKYC, serta credit scoring digital untuk menilai kelayakan kredit anggota secara realtime."
        : "Kooperasi.com digitizes the operations of Savings and Loan Cooperatives (KSP) and Multipurpose Cooperatives (KSU). It integrates the WhatsApp API for automatic deposit/withdrawal notifications (WhatsApp Banking), eKYC-based membership verification, and real-time digital credit scoring to analyze borrower risk."
    },
    { 
      id: 3, 
      title: "I-Sawit", 
      desc: lang === 'id'
        ? "Sistem monitoring dan manajemen perkebunan sawit berbasis IoT. Memantau suhu, kelembaban, dan lokasi GPS secara realtime melalui Flutter & Firebase."
        : "IoT-based palm oil plantation monitoring and management system. Tracks temperature, soil moisture, and GPS location in real-time via Flutter & Firebase.", 
      tech: ["Flutter", "Firebase", "ESP32", "LoRa"], 
      image: imgISawit, 
      modalImage: imgISawitMobile, 
      color: "rgba(34, 197, 94, 0.2)",
      quote: lang === 'id'
        ? "Pemantauan perkebunan sawit secara presisi dari jarak jauh dengan jaringan sensor IoT."
        : "Precision remote monitoring of palm oil plantations using an IoT sensor network.",
      longDesc: lang === 'id'
        ? "Sistem IoT terintegrasi untuk membantu pengawasan perkebunan kelapa sawit secara cerdas. Menggunakan mikrokontroler ESP32 dengan sensor kelembapan tanah, suhu udara, dan GPS Tracker yang ditransmisikan melalui modul LoRaWAN untuk mengatasi keterbatasan sinyal seluler di area perkebunan, disinkronkan secara realtime ke aplikasi Flutter."
        : "An integrated IoT system for smart palm oil plantation surveillance. It utilizes ESP32 microcontrollers with soil moisture, air temperature, and GPS tracking sensors transmitted via LoRaWAN modules to bypass cellular coverage limitations in remote areas, synchronized in real-time with a Flutter dashboard."
    },
    { 
      id: 4, 
      title: "iPaymu Core Engine Migration", 
      desc: lang === 'id'
        ? "Migrasi sistem core payment gateway iPaymu v3 ke Golang. Mengoptimalkan pemrosesan transaksi berkecepatan tinggi, sistem antrean pesan, dan sinkronisasi webhook."
        : "Migration of the iPaymu core payment gateway engine v3 to Golang. Optimizing high-speed transaction processing, message queuing, and webhook sync.", 
      tech: ["Go", "PostgreSQL", "Docker"], 
      image: imgIPaymu, 
      color: "rgba(220, 38, 38, 0.2)",
      link: "https://ipaymu.com",
      quote: lang === 'id'
        ? "Optimasi konkurensi tinggi dan latensi rendah untuk memproses jutaan transaksi pembayaran online."
        : "High concurrency and low latency optimization to process millions of online payment transactions.",
      longDesc: lang === 'id'
        ? "Mengerjakan migrasi arsitektur core payment gateway iPaymu v3 dari PHP/monolith lama ke microservices berbasis Golang. Proyek ini memfokuskan pada penanganan beban transaksi tinggi secara concurrent, meminimalkan latensi pemrosesan API, mengimplementasikan antrean pesan yang andal, sinkronisasi webhook ke merchant secara aman, serta optimasi efisiensi memori container Docker di lingkungan cloud."
        : "Migrating the core payment gateway architecture of iPaymu v3 from a legacy PHP monolith to Golang-based microservices. Focuses on high-concurrency transaction handling, minimizing API latency, implementing reliable message queues, securing merchant webhook delivery, and optimizing Docker container memory utilization in cloud environments."
    }
  ], [lang]);

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
      title: lang === 'id' ? "Belajar Dasar Google Cloud" : "Google Cloud Fundamentals",
      issuer: "Google Cloud / Dicoding Indonesia",
      date: "2024",
      desc: lang === 'id'
        ? "Lulus dari kelas Belajar Dasar Google Cloud yang berfokus pada pemahaman fundamental cloud computing menggunakan Google Cloud Platform (GCP). Dalam pelatihan ini, saya mempelajari konsep layanan cloud, pengelolaan server dan jaringan, storage dan database, hingga aspek keamanan dan billing."
        : "Completed Google Cloud Fundamentals course covering the core concepts of cloud computing using GCP. Learned about cloud services, server and network management, storage, databases, security, and billing.",
      image: "/sertif-arrya/preview google cloud.webp",
      pdf: "/sertif-arrya/google cloud.pdf",
      color: "rgba(66, 133, 244, 0.2)"
    },
    {
      title: lang === 'id' ? "Memulai Pemrograman dengan Python" : "Beginning Programming with Python",
      issuer: "Dicoding Indonesia",
      date: "2024",
      desc: lang === 'id'
        ? "Menyelesaikan pelatihan dasar pemrograman Python dengan standar industri. Saya mempelajari berbagai konsep penting seperti pengolahan data, control flow, struktur data (array & matriks), hingga Object-Oriented Programming (OOP). Selain itu, saya juga memahami penggunaan berbagai tools seperti VS Code, Jupyter Notebook, serta praktik terbaik seperti PEP8 dan unit testing."
        : "Completed industry-standard Python programming basics. Covered data processing, control flow, data structures (arrays & matrices), Object-Oriented Programming (OOP), and best practices including PEP8 and unit testing.",
      image: "/sertif-arrya/preview pemprograman python.webp",
      pdf: "/sertif-arrya/pemprograman python.pdf",
      color: "rgba(55, 118, 171, 0.2)"
    },
    {
      title: lang === 'id' ? "Prompt Engineering untuk Software Developer" : "Prompt Engineering for Software Developers",
      issuer: "Dicoding Indonesia",
      date: "2024",
      desc: lang === 'id'
        ? "Mengikuti pelatihan prompt engineering yang berfokus pada pemanfaatan Generative AI dalam software development. Saya mempelajari cara menyusun prompt yang efektif, berbagai pola prompt, serta penerapannya dalam meningkatkan produktivitas pengembangan software."
        : "Completed prompt engineering training focused on leveraging Generative AI in software development. Learned effective prompting patterns, context engineering, and productivity enhancement strategies.",
      image: "/sertif-arrya/preview prompt engineer.webp",
      pdf: "/sertif-arrya/prompt engineer.pdf",
      color: "rgba(168, 85, 247, 0.2)"
    },
    {
      title: lang === 'id' ? "Belajar Dasar Data Science" : "Data Science Fundamentals",
      issuer: "Dicoding Indonesia",
      date: "2024",
      desc: lang === 'id'
        ? "Menyelesaikan pelatihan dasar data science yang mencakup pemahaman konsep data, analisis data, serta penggunaan teknologi dan tools seperti SQL, Python, dan Tableau. Saya juga mempelajari dasar machine learning serta bagaimana memanfaatkan data untuk pengambilan keputusan."
        : "Completed data science foundations covering data concepts, analysis, and data tools like SQL, Python, and Tableau. Introduced basic machine learning concepts and data-driven decision-making.",
      image: "/sertif-arrya/preview data science.webp",
      pdf: "/sertif-arrya/data science.pdf",
      color: "rgba(34, 197, 94, 0.2)"
    },
    {
      title: lang === 'id' ? "Belajar Membuat Aplikasi Back-End dengan Python" : "Building Back-End Applications with Python",
      issuer: "Dicoding Indonesia",
      date: "2024",
      desc: lang === 'id'
        ? "Pelatihan lanjutan untuk membangun backend RESTful API menggunakan Python. Mempelajari penanganan request-response, routing, pengelolaan database, autentikasi, serta deployment aplikasi backend."
        : "Advanced course on building RESTful APIs using Python. Covered request-response handling, routing, database management, user authentication, and backend server deployment.",
      image: "/sertif-arrya/preview backend python.webp",
      pdf: "/sertif-arrya/Backend Python.pdf",
      color: "rgba(239, 68, 68, 0.2)"
    },
    {
      title: lang === 'id' ? "Belajar Dasar-Dasar AI" : "AI Fundamentals",
      issuer: "Dicoding Indonesia",
      date: "2024",
      desc: lang === 'id'
        ? "Pengenalan dasar konsep Artificial Intelligence (AI), Machine Learning, Deep Learning, Generative AI, pemanfaatan neural networks, serta implementasi kecerdasan buatan dalam memecahkan masalah nyata."
        : "Foundational introduction to Artificial Intelligence (AI), Machine Learning, Deep Learning, Generative AI, neural networks, and their real-world implementations to solve complex problems.",
      image: "/sertif-arrya/preview dasar AI.webp",
      pdf: "/sertif-arrya/Dasar AI.pdf",
      color: "rgba(249, 115, 22, 0.2)"
    },
    {
      title: lang === 'id' ? "Belajar Dasar Machine Learning" : "Machine Learning Fundamentals",
      issuer: "Dicoding Indonesia",
      date: "2024",
      desc: lang === 'id'
        ? "Mempelajari dasar machine learning, pra-pemrosesan data (data preprocessing), algoritma supervised learning (klasifikasi, regresi), unsupervised learning (clustering), serta evaluasi performa model."
        : "Learned machine learning foundations, including data preprocessing, supervised learning algorithms (classification, regression), unsupervised learning (clustering), and model evaluation metrics.",
      image: "/sertif-arrya/preview machine learning.webp",
      pdf: "/sertif-arrya/Machine Learning.pdf",
      color: "rgba(234, 179, 8, 0.2)"
    },
    {
      title: lang === 'id' ? "Belajar Dasar UX Design" : "UX Design Fundamentals",
      issuer: "Dicoding Indonesia",
      date: "2024",
      desc: lang === 'id'
        ? "Mempelajari dasar-dasar User Experience (UX) design, proses design thinking (empathize, define, ideate, prototype, test), riset pengguna, pembuatan user persona, user journey map, wireframe, hingga usability testing."
        : "Learned User Experience (UX) design basics, focusing on the design thinking process (empathize, define, ideate, prototype, test), user research, user personas, journey mapping, wireframing, and usability testing.",
      image: "/sertif-arrya/preview UX design.webp",
      pdf: "/sertif-arrya/UX Design.pdf",
      color: "rgba(236, 72, 153, 0.2)"
    }
  ], [lang]);

  const mediaItems = useMemo(() => [
    { 
      title: lang === 'id' 
        ? "Mahasiswa Poliban Ciptakan Aplikasi Penerimaan Laporan"
        : "Poliban Student Creates Report Receiving Application", 
      source: "Ombudsman RI", 
      image: imgOmbudsman,
      link: "https://ombudsman.go.id/perwakilan/news/r/pwk--magang-di-ombudsman-ri-kalsel-mahasiswa-poliban-ciptakan-aplikasi-penerimaan-laporan", 
      desc: lang === 'id'
        ? "Inovasi aplikasi untuk memudahkan masyarakat dalam menyampaikan laporan ke Ombudsman. Proyek ini merupakan bagian dari kontribusi nyata mahasiswa untuk pelayanan publik."
        : "Application innovation to facilitate the public in submitting reports to the Ombudsman. This project represents a practical student contribution to public service.",
      color: "rgba(59, 130, 246, 0.2)"
    },
    { 
      title: lang === 'id'
        ? "Paduan Suara Poliban Berhasil Menjuarai Lomba"
        : "Poliban Choir Succeeds in Winning Competition", 
      source: "LPM Lensa", 
      image: imgPaduanSuara,
      link: "https://www.lpmlensa.info/2023/07/paduan-suara-poliban-berhasil-menjuarai.html", 
      desc: lang === 'id'
        ? "Prestasi gemilang tim paduan suara Poliban dalam ajang perlombaan bergengsi. Menunjukkan bakat dan kerja keras dalam bidang seni dan kreativitas."
        : "Brilliant achievement of the Poliban choir team in a prestigious competition. Demonstrates talent, discipline, and hard work in the field of arts and creativity.",
      color: "rgba(168, 85, 247, 0.2)"
    },
    { 
      title: lang === 'id'
        ? "Pertukaran Mahasiswa Merdeka 4"
        : "Independent Student Exchange 4", 
      source: "Kemendikbudristek", 
      image: imgPMM4,
      link: "#", 
      desc: lang === 'id'
        ? "Berpartisipasi dalam program Pertukaran Mahasiswa Merdeka Angkatan 4, memperluas wawasan akademik dan budaya di universitas mitra di seluruh Indonesia."
        : "Participating in the Independent Student Exchange Program (PMM) Batch 4, expanding academic and cultural horizons at partner universities across Indonesia.",
      color: "rgba(34, 197, 94, 0.2)"
    }
  ], [lang]);

  const navItems = useMemo(() => [
    { label: lang === 'id' ? "Navigasi" : "Navigation", bgColor: "#170D27", textColor: "#fff", links: [{ label: lang === 'id' ? "Beranda" : "Home", href: "#home" }, { label: lang === 'id' ? "Tentang Saya" : "About Me", href: "#about" }, { label: lang === 'id' ? "Kontak" : "Contact", href: "#contact" }] },
    { label: "Portfolio", bgColor: "#0D0716", textColor: "#fff", links: [{ label: lang === 'id' ? "Karya" : "Works", href: "#certificates" }, { label: lang === 'id' ? "Berita" : "News", href: "#news" }] },
    { label: "Social", bgColor: "#271E37", textColor: "#fff", links: [{ label: "LinkedIn", href: "https://www.linkedin.com/in/arrya-fitriansyah/" }, { label: "Instagram", href: "https://www.instagram.com/aryya_/" }] }
  ], [lang]);

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
        setToastConfig({ isVisible: true, message: t.successToast, type: "success" });
        form.reset();
        setTimeout(() => setToastConfig(prev => ({ ...prev, isVisible: false })), 4000);
      } else {
        setToastConfig({ isVisible: true, message: t.errorToast, type: "error" });
        setTimeout(() => setToastConfig(prev => ({ ...prev, isVisible: false })), 4000);
      }
    } catch (error) {
      setToastConfig({ isVisible: true, message: t.connErrorToast, type: "error" });
      setTimeout(() => setToastConfig(prev => ({ ...prev, isVisible: false })), 4000);
    }
  }, [t]);

  const handleProjectClick = useCallback((project) => {
    setSelectedProject(project);
  }, []);

  return (
    <div className="relative w-full transition-colors duration-300 bg-gray-50 text-gray-900 dark:bg-[#0a0a0a] dark:text-white font-sans overflow-x-hidden">
      
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 origin-left z-[100]"
        style={{ scaleX }}
      />

      
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
          lang={lang}
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

      {/* LANGUAGE TOGGLE */}
      <button
        onClick={() => setLang(lang === 'id' ? 'en' : 'id')}
        className="fixed bottom-20 right-4 md:bottom-24 md:right-8 z-[50] p-3 rounded-full bg-black/10 dark:bg-white/10 backdrop-blur-md border border-black/20 dark:border-white/20 hover:scale-110 transition-transform shadow-xl cursor-pointer text-gray-900 dark:text-white flex items-center justify-center gap-1.5 w-[56px] h-[56px] font-bold text-xs uppercase"
        title={lang === 'id' ? "Switch to English" : "Ubah ke Bahasa Indonesia"}
      >
        <Globe size={18} />
        <span>{lang.toUpperCase()}</span>
      </button>

      {/* TEMA TOGGLE */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[50] p-4 rounded-full bg-black/10 dark:bg-white/10 backdrop-blur-md border border-black/20 dark:border-white/20 hover:scale-110 transition-transform shadow-xl cursor-pointer text-gray-900 dark:text-white"
      >
        {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
      </button>

      {/* --- SECTION 1: HERO SECTION --- */}
      <section id="home" className="relative min-h-screen w-full flex items-center pt-20 md:pt-32 pb-12 overflow-hidden bg-white dark:bg-black transition-colors duration-300">
        <div className="absolute inset-0 z-0 bg-white dark:bg-black transition-colors duration-300">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-50 dark:to-[#0a0a0a] z-10 pointer-events-none transition-colors duration-300"></div>
        </div>

        <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-20 items-center">
            <div className="order-2 md:order-1 flex flex-col items-center md:items-start text-center md:text-left space-y-6 md:space-y-8">
              <AnimatedContent distance={100} direction="horizontal" reverse={true}>
                <div className="space-y-4 md:space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-sm md:text-xl font-medium text-blue-600 dark:text-blue-300 uppercase tracking-[0.2em] opacity-80">{t.greeting}</h2>
                    <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 dark:text-white leading-[1.1] tracking-tight">
                      Arrya <br/>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Fitriansyah</span>
                    </h1>
                  </div>
                  <div className="h-8 md:h-10 flex items-center justify-center md:justify-start">
                    <div className="text-lg md:text-3xl font-semibold text-gray-700 dark:text-gray-300">{t.rolePrefix}</div>
                    <div className="text-lg md:text-3xl font-bold text-blue-600 dark:text-blue-400">
                      <Suspense fallback={<span>Developer</span>}>
                        <TextType text={["Fullstack Developer", "React Enthusiast"]} loop={true} />
                      </Suspense>
                    </div>
                  </div>
                  <p className="max-w-lg text-gray-600 dark:text-gray-400 text-base md:text-xl leading-relaxed">
                    {t.heroMotto}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-4 justify-center md:justify-start">
                    <button 
                      onClick={() => document.getElementById('certificates').scrollIntoView({ behavior: 'smooth' })}
                      className="px-6 py-3 md:px-8 md:py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl md:rounded-2xl font-bold shadow-2xl shadow-blue-500/20 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    >
                      <span>{t.viewProjects}</span>
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
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce text-gray-900/30 dark:text-white/30 hidden md:block"><Mouse size={24} /></div>
      </section>

      {/* --- SECTION 2: ABOUT & LANYARD SECTION --- */}
      <section id="about" className="relative min-h-screen w-full bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center overflow-hidden border-t border-black/5 dark:border-white/5 py-12 md:py-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full h-full grid md:grid-cols-2 gap-10 items-center">
          <div className="order-2 md:order-1 w-full h-[40vh] md:h-screen relative flex items-center justify-center">
             <div className="absolute w-[200px] md:w-[300px] h-[200px] md:h-[300px] bg-blue-600/10 rounded-full blur-[80px] md:blur-[100px] pointer-events-none"></div>
             <div className="w-full h-full">
                <VisibilitySensor>
                   <Suspense fallback={<div className="flex items-center justify-center h-full text-gray-400 dark:text-white/20 font-mono text-xs uppercase tracking-widest">Loading 3D...</div>}>
                      <Lanyard />
                   </Suspense>
                </VisibilitySensor>
             </div>
          </div>
          <div className="order-1 md:order-2 flex flex-col items-center md:items-start space-y-4 md:space-y-6">
            <AnimatedContent distance={50} direction="vertical">
              <div className="space-y-4 md:space-y-6 text-center md:text-left">
                <div className="inline-block px-3 py-1 md:px-4 md:py-1.5 rounded-full border border-blue-500/20 dark:border-blue-500/30 bg-blue-500/5 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs md:text-sm font-medium backdrop-blur-sm">{t.aboutMeTag}</div>
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">{t.aboutTitle}</h2>
                <div className="space-y-4 text-gray-600 dark:text-gray-400 text-base md:text-lg leading-relaxed">
                  {t.aboutP1}
                  {t.aboutP2}
                  {t.aboutP3}
                </div>
                
                <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-2">
                  <div className="flex items-center gap-2 px-3 py-1 bg-black/5 dark:bg-white/5 rounded-lg border border-black/10 dark:border-white/10 text-[10px] md:text-xs uppercase font-bold tracking-wider text-gray-700 dark:text-white">
                    <Code size={14} className="text-blue-600 dark:text-blue-400" /> <span>Fullstack</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-black/5 dark:bg-white/5 rounded-lg border border-black/10 dark:border-white/10 text-[10px] md:text-xs uppercase font-bold tracking-wider text-gray-700 dark:text-white">
                    <Terminal size={14} className="text-purple-600 dark:text-purple-400" /> <span>AI Enthusiast</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-black/5 dark:bg-white/5 rounded-lg border border-black/10 dark:border-white/10 text-[10px] md:text-xs uppercase font-bold tracking-wider text-gray-700 dark:text-white">
                    <Database size={14} className="text-green-600 dark:text-green-400" /> <span>IoT Geek</span>
                  </div>
                </div>
              </div>
            </AnimatedContent>
          </div>
        </div>
      </section>

      {/* --- SECTION 3: PORTFOLIO SECTION --- */}
      <section id="certificates" className="relative min-h-screen w-full bg-white dark:bg-[#050505] text-gray-900 dark:text-white py-20 border-t border-black/5 dark:border-white/5 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center">
            <h2 className="text-4xl font-bold mb-12 text-gray-900 dark:text-white">Portfolio <span className="text-blue-500">Showcase</span></h2>
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
                      <SkillsShowcase lang={lang} />
                    ) : (
                      <div ref={portfolioRef} className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 snap-x snap-mandatory scrollbar-none pb-6 w-full -mx-6 px-6 md:mx-0 md:px-0">
                        {activeTab === 0 ? projects.map((p, i) => (
                          <ProjectCard key={p.id} project={p} onClick={handleProjectClick} />
                        )) : certificates.map((c, i) => (
                          <div key={i} onClick={() => setSelectedCertificate(c)} className="group flex flex-col h-full cursor-pointer snap-center shrink-0 w-[82vw] sm:w-[320px] md:w-auto md:shrink-1">
                            <SpotlightCard spotlightColor={c.color} className="h-full !p-5 flex flex-col justify-between">
                              <div className="space-y-4">
                                {/* Certificate Image Preview */}
                                <div className="w-full aspect-[4/3] bg-black/5 dark:bg-white/5 rounded-xl overflow-hidden border border-black/10 dark:border-white/10 relative shadow-lg">
                                  <img 
                                    src={c.image} 
                                    alt={c.title} 
                                    loading="lazy"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100" 
                                  />
                                </div>
                                {/* Certificate Metadata */}
                                <div className="space-y-1">
                                  <h3 className="text-xl font-bold leading-tight text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{c.title}</h3>
                                  <p className="text-blue-600 dark:text-blue-400 text-xs font-semibold">{c.issuer}</p>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-4 leading-relaxed">{c.desc}</p>
                              </div>
                              {/* View PDF Button */}
                              <a 
                                href={c.pdf} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                onClick={(e) => e.stopPropagation()}
                                className="mt-6 w-full py-3 bg-blue-600/10 hover:bg-blue-600 text-blue-600 dark:text-blue-400 hover:text-white rounded-xl font-bold flex items-center justify-center gap-2 border border-blue-500/20 hover:border-transparent transition-all active:scale-[0.98] text-xs uppercase tracking-wider cursor-pointer"
                              >
                                <span>{t.viewCertCardBtn}</span>
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
      <section id="news" className="relative min-h-screen w-full bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-white py-20 border-t border-black/5 dark:border-white/5 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="flex flex-col items-center mb-16 space-y-4 text-center">
               <div className="inline-block px-4 py-1.5 rounded-full border border-purple-500/20 dark:border-purple-500/30 bg-purple-500/5 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 text-sm font-medium backdrop-blur-sm">{t.newsTag}</div>
               <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">Media <span className="text-purple-500">Highlights</span>.</h2>
               <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl">{t.newsDesc}</p>
            </div>
            
            <div ref={mediaRef} className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto snap-x snap-mandatory scrollbar-none pb-6 w-full -mx-6 px-6 md:mx-0 md:px-0">
               {mediaItems.map((m, i) => (
                  <MediaCard key={i} item={m} index={i} lang={lang} />
               ))}
            </div>
        </div>
      </section>

      {/* --- SECTION 5: CONTACT SECTION --- */}
      <section id="contact" className="relative min-h-screen w-full bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white py-20 border-t border-black/5 dark:border-white/5 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <AnimatedContent distance={50} direction="horizontal">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">Let's <span className="text-blue-500">Connect</span>.</h2>
                  <p className="text-gray-600 dark:text-gray-400 text-lg max-w-md">{t.contactDesc}</p>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/20">
                      <Mail className="text-blue-500" size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 uppercase tracking-widest font-bold">Email</p>
                      <p className="text-lg underline underline-offset-4 decoration-blue-500/30 text-gray-900 dark:text-white">arryawork@gmail.com</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <a href="https://github.com/arrya-fitriansyah" target="_blank" rel="noopener noreferrer" className="p-3 bg-black/5 dark:bg-white/5 rounded-xl flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 transition-colors border border-black/10 dark:border-white/10 text-gray-700 dark:text-white"><Github size={20} /></a>
                  <a href="https://www.linkedin.com/in/arrya-fitriansyah/" target="_blank" rel="noopener noreferrer" className="p-3 bg-black/5 dark:bg-white/5 rounded-xl flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 transition-colors border border-black/10 dark:border-white/10 text-gray-700 dark:text-white"><Linkedin size={20} /></a>
                  <a href="https://www.instagram.com/aryya_/" target="_blank" rel="noopener noreferrer" className="p-3 bg-black/5 dark:bg-white/5 rounded-xl flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 transition-colors border border-black/10 dark:border-white/10 text-gray-700 dark:text-white"><Instagram size={20} /></a>
                </div>
              </div>
            </AnimatedContent>
 
            <AnimatedContent distance={50} direction="horizontal" reverse={true}>
              <div className="p-8 bg-black/5 dark:bg-white/5 rounded-3xl border border-black/10 dark:border-white/10 backdrop-blur-sm shadow-2xl">
                <form className="space-y-6" onSubmit={handleContactSubmit}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">{t.nameLabel}</label>
                      <input required name="name" type="text" className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors text-gray-900 dark:text-white" placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">{t.emailLabel}</label>
                      <input required name="email" type="email" className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors text-gray-900 dark:text-white" placeholder="john@example.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">{t.messageLabel}</label>
                    <textarea required name="message" className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors h-32 resize-none text-gray-900 dark:text-white" placeholder={t.messagePlaceholder}></textarea>
                  </div>
                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold transition-all transform active:scale-[0.98] shadow-lg shadow-blue-600/20 text-white cursor-pointer">
                    {t.sendButton}
                  </button>
                </form>
              </div>
            </AnimatedContent>
          </div>
        </div>
      </section>
 
      <footer className="w-full py-12 bg-gray-50 dark:bg-black border-t border-black/5 dark:border-white/5 text-center text-gray-500 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-sm tracking-widest uppercase font-bold text-gray-900/30 dark:text-white/20 mb-4">Arrya Fitriansyah</p>
          <div className="flex justify-center gap-6 mb-8">
             <a href="https://www.linkedin.com/in/arrya-fitriansyah/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">LinkedIn</a>
             <a href="https://www.instagram.com/aryya_/" target="_blank" rel="noopener noreferrer" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">Instagram</a>
             <a href="https://github.com/arrya-fitriansyah" target="_blank" rel="noopener noreferrer" className="hover:text-black dark:hover:text-white transition-colors">GitHub</a>
          </div>
          <p className="text-xs opacity-50">&copy; 2026 {t.footerSub}</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
