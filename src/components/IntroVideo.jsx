import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, VolumeX, Maximize2 } from 'lucide-react';

const IntroVideo = ({ onVideoEnd }) => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      // Attempt to play with sound
      const playPromise = videoRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          // If browser blocks unmuted autoplay, fallback to muted
          console.log("Unmuted autoplay blocked by browser, falling back to muted.");
          setIsMuted(true);
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play();
          }
        });
      }
    }
  }, []);

  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
      className="fixed bottom-8 left-8 z-[4000] w-[320px] md:w-[400px] aspect-video bg-black rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 group"
    >
      <video
        ref={videoRef}
        src="/video.mp4"
        className="w-full h-full object-cover"
        onEnded={onVideoEnd}
        autoPlay
        muted={isMuted}
        playsInline
      />
      
      {/* Overlay controls */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Close Button */}
      <button 
        onClick={onVideoEnd}
        className="absolute top-3 right-3 p-1.5 bg-black/50 backdrop-blur-md rounded-full text-white/70 hover:text-white transition-colors"
      >
        <X size={16} />
      </button>

      {/* Mute Button */}
      <button
        onClick={toggleMute}
        className="absolute bottom-3 right-3 p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:scale-110 transition-all"
      >
        {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
      </button>

      {/* Label */}
      <div className="absolute bottom-3 left-4">
        <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">Showreel 2026</p>
      </div>

      {/* Progress bar (Visual only) */}
      <div className="absolute bottom-0 left-0 h-1 bg-blue-500/50 w-full overflow-hidden">
        <motion.div 
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 15, ease: "linear" }}
          className="h-full bg-blue-500"
        />
      </div>
    </motion.div>
  );
};

export default IntroVideo;
