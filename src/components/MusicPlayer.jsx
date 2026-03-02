import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Music } from 'lucide-react';
import ElasticSlider from './ElasticSlider';

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(30);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  // Lofi track placeholder
  const trackUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"; 

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log("User interaction required"));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed bottom-6 left-4 md:bottom-8 md:left-8 z-[1001] flex items-center gap-2 md:gap-4 bg-white/5 backdrop-blur-xl border border-white/10 p-1.5 md:p-2 pr-4 md:pr-6 rounded-full shadow-2xl transition-all hover:bg-white/10 group">
      <audio ref={audioRef} src={trackUrl} loop />
      
      <button
        onClick={togglePlay}
        className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-blue-600 hover:bg-blue-500 rounded-full text-white transition-all shadow-lg shadow-blue-600/20 active:scale-90"
      >
        {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} className="ml-1" fill="currentColor" />}
      </button>

      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-0.5 md:mb-1">
          <Music size={10} className={`text-blue-400 ${isPlaying ? 'animate-pulse' : ''}`} />
          <span className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
            {isPlaying ? 'Playing' : 'Paused'}
          </span>
        </div>
        
        <div className="flex items-center gap-2 md:gap-3">
          <button onClick={() => setIsMuted(!isMuted)} className="text-gray-400 hover:text-white transition-colors">
            {isMuted || volume === 0 ? <VolumeX size={14} md:size={16} /> : <Volume2 size={14} md:size={16} />}
          </button>
          
          <ElasticSlider 
            defaultValue={volume} 
            maxValue={100} 
            className="w-16 md:w-24 !gap-0" 
            onChange={(val) => {
                setVolume(val);
                if (val > 0) setIsMuted(false);
            }}
            leftIcon={null}
            rightIcon={null}
          />
        </div>
      </div>

      {/* Decorative Bars */}
      {isPlaying && (
        <div className="flex gap-0.5 items-end h-3 ml-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="w-0.5 bg-blue-500 animate-bounce" style={{ height: `${Math.random() * 100}%`, animationDuration: `${0.5 + Math.random()}s` }} />
          ))}
        </div>
      )}
    </div>
  );
}
