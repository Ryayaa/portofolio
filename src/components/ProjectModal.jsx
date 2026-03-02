import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Github, Code } from 'lucide-react';

export default function ProjectModal({ project, isOpen, onClose }) {
  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-4xl bg-[#0f0f0f] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black rounded-full text-white transition-colors"
            >
              <X size={20} />
            </button>

            {/* Left: Image/Preview Placeholder */}
            <div className="md:w-1/2 bg-slate-900 flex items-center justify-center p-12 border-b md:border-b-0 md:border-r border-white/5">
               <div className="relative group">
                  <div className="absolute -inset-4 bg-blue-500/20 blur-xl rounded-full group-hover:bg-blue-500/30 transition-all"></div>
                  <Code size={120} className="text-blue-500/50 relative" />
               </div>
            </div>

            {/* Right: Content */}
            <div className="md:w-1/2 p-8 md:p-12 overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <h3 className="text-3xl font-black text-white mb-2">{project.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tech?.map((t, i) => (
                      <span key={i} className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-wider rounded-md border border-blue-500/20">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 text-gray-400 leading-relaxed">
                  <p className="text-lg text-white font-medium italic">"Tantangan utama adalah sinkronisasi data realtime dengan performa tinggi."</p>
                  <p>{project.desc}</p>
                  <p>Project ini dibangun dengan fokus pada skalabilitas dan kemudahan pemeliharaan kode. Mengimplementasikan arsitektur clean-code dan optimasi performa di sisi client.</p>
                </div>

                <div className="pt-6 flex flex-wrap gap-4">
                  <a href="#" className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-600/20">
                    <ExternalLink size={18} /> Live Demo
                  </a>
                  <a href="#" className="p-4 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-all active:scale-95">
                    <Github size={20} />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
