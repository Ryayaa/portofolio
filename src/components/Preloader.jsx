import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Preloader({ isLoaded, onExitComplete }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(() => setShow(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoaded]);

  return (
    <AnimatePresence onExitComplete={onExitComplete}>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[3000] bg-[#050505] flex flex-col items-center justify-center"
        >
          <div className="relative">
            {/* Spinning Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-24 h-24 border-2 border-blue-500/20 border-t-blue-500 rounded-full"
            />
            
            {/* Inner Logo/Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-blue-500 font-black text-xl tracking-tighter"
              >
                A
              </motion.span>
            </div>
          </div>

          <div className="mt-8 text-center space-y-2">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-500 font-mono text-[10px] uppercase tracking-[0.3em]"
            >
              Initializing Core...
            </motion.p>
            <div className="w-48 h-px bg-white/10 relative overflow-hidden">
              <motion.div
                initial={{ left: "-100%" }}
                animate={{ left: "100%" }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
