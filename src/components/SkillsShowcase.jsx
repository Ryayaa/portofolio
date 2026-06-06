import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code, Server, Smartphone, Database, Terminal, Sparkles, CheckCircle2 } from "lucide-react";

const CATEGORIES = ["All", "Frontend", "Backend", "Mobile", "DB & DevOps"];

const TECH_DATA = [
  {
    name: "React",
    category: "Frontend",
    icon: "react",
    level: 90,
    status: "Advanced",
    color: "#61dafb",
    colorRgba: "rgba(97, 218, 251, 0.15)",
    desc: {
      id: "Membangun SPA & SSR interaktif dengan R3F (React Three Fiber), GSAP, & state management modern.",
      en: "Building interactive SPAs & SSR with R3F (React Three Fiber), GSAP, & modern state management."
    },
    project: {
      id: "Personal Portfolio, Lanyard 3D",
      en: "Personal Portfolio, 3D Lanyard"
    }
  },
  {
    name: "Next.js",
    category: "Frontend",
    icon: "nextjs",
    level: 85,
    status: "Advanced",
    color: "#ffffff",
    colorRgba: "rgba(255, 255, 255, 0.15)",
    desc: {
      id: "Pengembangan web app berskala besar dengan App Router, SSR/ISR, & routing performa tinggi.",
      en: "Large-scale web app development with App Router, SSR/ISR, & high-performance routing."
    },
    project: {
      id: "Kooperasi.com SaaS Platform",
      en: "Kooperasi.com SaaS Platform"
    }
  },
  {
    name: "Tailwind CSS",
    category: "Frontend",
    icon: "tailwind",
    level: 95,
    status: "Expert",
    color: "#38bdf8",
    colorRgba: "rgba(56, 189, 248, 0.15)",
    desc: {
      id: "Desain antarmuka responsif dan animatif dengan utilitas kelas v4 & kustomisasi penuh.",
      en: "Responsive and animated interface design with v4 utility classes & full customization."
    },
    project: {
      id: "Seluruh Tampilan Website",
      en: "All Website Interfaces"
    }
  },
  {
    name: "Laravel",
    category: "Backend",
    icon: "laravel",
    level: 90,
    status: "Advanced",
    color: "#ff2d20",
    colorRgba: "rgba(255, 45, 32, 0.15)",
    desc: {
      id: "Pembuatan REST API tangguh, arsitektur MVC, Filament Admin Panel v3, & integrasi database.",
      en: "Building robust REST APIs, MVC architecture, Filament Admin Panel v3, & database integration."
    },
    project: {
      id: "Sistem Informasi Ombudsman",
      en: "Ombudsman Information System"
    }
  },
  {
    name: "NestJS",
    category: "Backend",
    icon: "nestjs",
    level: 80,
    status: "Intermediate",
    color: "#e0234e",
    colorRgba: "rgba(224, 35, 78, 0.15)",
    desc: {
      id: "Arsitektur backend scalable modular berbasis TypeScript, microservices, & integrasi REST/WebSocket.",
      en: "Modular scalable backend architecture based on TypeScript, microservices, & REST/WebSocket integration."
    },
    project: {
      id: "Kooperasi.com Hub API",
      en: "Kooperasi.com Hub API"
    }
  },
  {
    name: "Go (Golang)",
    category: "Backend",
    icon: "go",
    level: 75,
    status: "Intermediate",
    color: "#00add8",
    colorRgba: "rgba(0, 173, 216, 0.15)",
    desc: {
      id: "Pengembangan high-performance microservices, concurrency (goroutines), & clean architecture.",
      en: "Development of high-performance microservices, concurrency (goroutines), & clean architecture."
    },
    project: {
      id: "High-throughput API Services",
      en: "High-throughput API Services"
    }
  },
  {
    name: "Python",
    category: "Backend",
    icon: "py",
    level: 75,
    status: "Intermediate",
    color: "#3776ab",
    colorRgba: "rgba(55, 118, 171, 0.15)",
    desc: {
      id: "Otomasi skrip backend, pengolahan data, integrasi model AI, & web scraping.",
      en: "Backend script automation, data processing, AI model integration, & web scraping."
    },
    project: {
      id: "AI-Powered Text Classification",
      en: "AI-Powered Text Classification"
    }
  },
  {
    name: "Flutter",
    category: "Mobile",
    icon: "flutter",
    level: 85,
    status: "Advanced",
    color: "#02569b",
    colorRgba: "rgba(2, 86, 155, 0.15)",
    desc: {
      id: "Pembuatan aplikasi mobile cross-platform (Android/iOS) dengan performa native & state management.",
      en: "Creating cross-platform mobile apps (Android/iOS) with native performance & state management."
    },
    project: {
      id: "I-Sawit Mobile App",
      en: "I-Sawit Mobile App"
    }
  },
  {
    name: "PostgreSQL",
    category: "DB & DevOps",
    icon: "postgres",
    level: 85,
    status: "Advanced",
    color: "#336791",
    colorRgba: "rgba(51, 103, 145, 0.15)",
    desc: {
      id: "Desain skema relasional kompleks, optimasi query, indexing, & manajemen transaksi data sensitif.",
      en: "Designing complex relational schemas, query optimization, indexing, & sensitive data transaction management."
    },
    project: {
      id: "Kooperasi.com SaaS DB",
      en: "Kooperasi.com SaaS DB"
    }
  },
  {
    name: "MySQL",
    category: "DB & DevOps",
    icon: "mysql",
    level: 90,
    status: "Advanced",
    color: "#00758f",
    colorRgba: "rgba(0, 117, 143, 0.15)",
    desc: {
      id: "Administrasi DB relasional, relasi antar tabel kompleks, store procedures, & integrasi Laravel.",
      en: "Relational DB administration, complex table relationships, stored procedures, & Laravel integration."
    },
    project: {
      id: "Ombudsman E-Lapor DB",
      en: "Ombudsman E-Lapor DB"
    }
  },
  {
    name: "Firebase",
    category: "DB & DevOps",
    icon: "firebase",
    level: 80,
    status: "Intermediate",
    color: "#ffca28",
    colorRgba: "rgba(255, 202, 40, 0.15)",
    desc: {
      id: "Integrasi Realtime Database, Firestore, Authentication, & FCM (Firebase Cloud Messaging).",
      en: "Realtime Database integration, Firestore, Authentication, & FCM (Firebase Cloud Messaging)."
    },
    project: {
      id: "I-Sawit IoT Realtime Data Sync",
      en: "I-Sawit IoT Realtime Data Sync"
    }
  },
  {
    name: "Docker",
    category: "DB & DevOps",
    icon: "docker",
    level: 80,
    status: "Intermediate",
    color: "#2496ed",
    colorRgba: "rgba(36, 150, 237, 0.15)",
    desc: {
      id: "Konteinerisasi aplikasi untuk portabilitas penuh, orkestrasi local dev, & deployment pipeline.",
      en: "Application containerization for full portability, local dev orchestration, & deployment pipelines."
    },
    project: {
      id: "DevOps Containerization",
      en: "DevOps Containerization"
    }
  }
];

const getCategoryIcon = (category) => {
  switch (category) {
    case "Frontend":
      return <Code className="w-4 h-4" />;
    case "Backend":
      return <Server className="w-4 h-4" />;
    case "Mobile":
      return <Smartphone className="w-4 h-4" />;
    case "DB & DevOps":
      return <Database className="w-4 h-4" />;
    default:
      return <Sparkles className="w-4 h-4" />;
  }
};

const STATUS_LABELS = {
  id: {
    Advanced: "Mahir",
    Expert: "Ahli",
    Intermediate: "Menengah",
  },
  en: {
    Advanced: "Advanced",
    Expert: "Expert",
    Intermediate: "Intermediate",
  }
};

const SkillsShowcase = ({ lang = 'en' }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [hoveredSkill, setHoveredSkill] = useState(null);

  const filteredSkills = TECH_DATA.filter((skill) =>
    selectedCategory === "All" ? true : skill.category === selectedCategory
  );

  return (
    <div className="w-full flex flex-col items-center">
      {/* Categories Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-10 max-w-3xl px-4 py-2 bg-black/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 rounded-2xl">
        {CATEGORIES.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`relative px-4 py-2 rounded-xl text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                isActive
                  ? "text-white"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              {getCategoryIcon(category)}
              <span className="relative z-10">{category === "All" ? (lang === 'id' ? "Semua" : "All") : category}</span>
              {isActive && (
                <motion.div
                  layoutId="activeCategoryBg"
                  className="absolute inset-0 bg-blue-600 rounded-xl -z-10 shadow-lg shadow-blue-600/30"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Skills Showcase Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedCategory}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full px-4"
        >
          {filteredSkills.map((tech) => (
            <div
              key={tech.name}
              onMouseEnter={() => setHoveredSkill(tech.name)}
              onMouseLeave={() => setHoveredSkill(null)}
              className="relative group p-6 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 overflow-hidden backdrop-blur-sm transition-all duration-300 hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer"
              style={{
                borderColor: hoveredSkill === tech.name ? `${tech.color}40` : undefined,
                boxShadow: hoveredSkill === tech.name 
                  ? `0 10px 30px -10px ${tech.colorRgba}, inset 0 0 12px 1px ${tech.colorRgba}`
                  : "none"
              }}
            >
              {/* Background ambient glow matching tech color */}
              <div 
                className="absolute -top-12 -right-12 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none"
                style={{ backgroundColor: tech.color }}
              />

              {/* Main Card Content */}
              <div className="flex flex-col h-full space-y-4 relative z-10">
                {/* Tech Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <img
                        src={`https://skillicons.dev/icons?i=${tech.icon}`}
                        alt={tech.name}
                        className="w-10 h-10 object-contain"
                        loading="lazy"
                      />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-gray-900 dark:text-white leading-tight">{tech.name}</h3>
                      <span className="text-[10px] uppercase font-bold text-gray-600 dark:text-gray-500 tracking-wider">
                        {tech.category}
                      </span>
                    </div>
                  </div>
                  <span 
                    className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider backdrop-blur-md"
                    style={{ backgroundColor: `${tech.color}20`, color: tech.color }}
                  >
                    {STATUS_LABELS[lang]?.[tech.status] || tech.status}
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed min-h-[48px]">
                  {tech.desc[lang] || tech.desc['en']}
                </p>

                {/* Animated Level Bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-gray-600 dark:text-gray-500 uppercase tracking-widest">{lang === 'id' ? "Kemahiran" : "Proficiency"}</span>
                    <span style={{ color: tech.color }}>{tech.level}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden border border-black/5 dark:border-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${tech.level}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ 
                        backgroundColor: tech.color,
                        boxShadow: `0 0 8px ${tech.color}`
                      }}
                    />
                  </div>
                </div>

                {/* Project association link badge */}
                {tech.project && (
                  <div className="flex items-center gap-1.5 pt-3 border-t border-black/5 dark:border-white/5 text-[9px] font-black uppercase text-gray-600 dark:text-gray-500 group-hover:text-gray-800 dark:group-hover:text-gray-300 transition-colors">
                    <CheckCircle2 size={10} style={{ color: tech.color }} />
                    <span className="truncate max-w-[200px]">
                      {tech.project[lang] || tech.project['en']}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SkillsShowcase;
