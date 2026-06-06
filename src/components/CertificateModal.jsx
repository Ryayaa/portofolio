import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Calendar, Award } from 'lucide-react';

const CertificateModal = React.memo(({ certificate, isOpen, onClose, lang = 'id' }) => {
  if (!certificate) return null;

  const t = {
    credential: lang === 'id' ? 'Sertifikat Kredensial' : 'Credential Certificate',
    issuer: lang === 'id' ? 'Penerbit' : 'Issuer',
    gradYear: lang === 'id' ? 'Tahun Kelulusan' : 'Graduation Year',
    note: lang === 'id' 
      ? 'Sertifikat ini diperoleh setelah menyelesaikan kurikulum pelatihan terstruktur dan menyelesaikan proyek/ujian kelulusan yang dinilai langsung oleh tim instruktur.'
      : 'This certificate was obtained after completing a structured training curriculum and passing projects/exams evaluated directly by instructors.',
    viewPdf: lang === 'id' ? 'Lihat PDF Sertifikat' : 'View PDF Certificate'
  };

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
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black rounded-full text-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Left: Certificate Preview Image */}
            <div className="md:w-1/2 bg-slate-900 flex items-center justify-center border-b md:border-b-0 md:border-r border-white/5 overflow-hidden p-6 md:p-8">
              <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-lg relative group">
                <img 
                  src={certificate.image} 
                  alt={certificate.title} 
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
            </div>

            {/* Right: Content Details */}
            <div className="md:w-1/2 p-8 md:p-12 overflow-y-auto flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-wider rounded-md border border-blue-500/20 mb-3">
                    <Award size={12} /> {t.credential}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-black text-white leading-tight mb-2">
                    {certificate.title}
                  </h3>
                  <p className="text-blue-400 text-sm font-semibold">
                    {t.issuer}: {certificate.issuer}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-gray-400 text-xs">
                  <Calendar size={14} className="text-gray-500" />
                  <span>{t.gradYear}: {certificate.date}</span>
                </div>

                <div className="space-y-4 text-gray-400 leading-relaxed text-sm md:text-base">
                  <p>{certificate.desc}</p>
                  <p className="text-xs text-gray-500 italic border-l-2 border-blue-500/50 pl-3">
                    {t.note}
                  </p>
                </div>
              </div>

              <div className="pt-8">
                <a 
                  href={certificate.pdf} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-600/20 text-sm uppercase tracking-wider cursor-pointer"
                >
                  <ExternalLink size={16} /> {t.viewPdf}
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

export default CertificateModal;
