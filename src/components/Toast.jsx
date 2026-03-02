import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Info, XCircle } from 'lucide-react';

export default function Toast({ message, type = 'success', isVisible, onClose }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className="fixed top-24 right-8 z-[2500]"
        >
          <div className="flex items-center gap-4 bg-[#1a1a1a] border border-white/10 p-4 pr-6 rounded-2xl shadow-2xl backdrop-blur-xl">
            <div className={`p-2 rounded-xl ${type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
              {type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
            </div>
            <div>
              <p className="text-white font-bold text-sm">{type === 'success' ? 'Success!' : 'Error'}</p>
              <p className="text-gray-400 text-xs">{message}</p>
            </div>
            <button onClick={onClose} className="ml-4 text-gray-600 hover:text-white transition-colors">
              <Info size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
