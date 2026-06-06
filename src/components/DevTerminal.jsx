import React, { useEffect, useRef, useState } from 'react';
import { Terminal, X } from 'lucide-react';

const getSassyResponse = (msg, lang) => {
  const trimmed = msg.trim().toLowerCase();
  
  const rules = [
    {
      keys: ['html', 'css'],
      id: "HTML itu bahasa pemrograman? Hahaha, lucu sekali. Sini saya bantu centering div dulu biar tidak pusing.",
      en: "HTML is a programming language? Hahaha, cute. Let me help you center a div first so you don't get a headache."
    },
    {
      keys: ['javascript', 'js'],
      id: "JavaScript? Bahasa di mana [] == ![] adalah true. Berdoa saja tipe datamu tidak tiba-tiba berubah jadi NaN.",
      en: "JavaScript? The language where [] == ![] is true. Just pray your data type doesn't suddenly morph into NaN."
    },
    {
      keys: ['php', 'laravel'],
      id: "PHP? Masih hidup ya? Oh, laravel. Kerangka kerja penyelamat karir PHP sejak 2011.",
      en: "PHP? Is it still alive? Oh, Laravel. The career-saving framework for PHP since 2011."
    },
    {
      keys: ['react', 'next', 'vue', 'angular'],
      id: "React 19? Bagus, nikmati menulis 'use' untuk segalanya dan hadapi error rendering yang tidak berujung.",
      en: "React 19? Great, enjoy writing 'use' for everything and dealing with endless rendering loop errors."
    },
    {
      keys: ['ai', 'chatbot', 'replac', 'gpt', 'bot'],
      id: "Tenang, AI tidak akan menggantikanmu. AI butuh instruksi yang jelas, dan klienmu tidak pernah tahu apa yang mereka mau.",
      en: "Relax, AI won't replace you. AI needs clear instructions, and your clients never know what they actually want."
    },
    {
      keys: ['bug', 'error', 'rusak', 'fail', 'crash'],
      id: "Mencari bug? Tenang, kodingan Arrya ini sudah dirancang agar bug-nya bertindak sebagai fitur.",
      en: "Looking for bugs? Don't worry, Arrya's code is designed so the bugs act as features."
    },
    {
      keys: ['arrya', 'arya', 'owner', 'developer', 'yang buat'],
      id: "Arrya? Pembuat web ini yang suka bikin lanyard 3D tapi lupa merapikan kodingan lamanya? Kinerjanya lumayan lah, 7/10.",
      en: "Arrya? The creator of this site who loves building 3D lanyards but forgets to clean up his old code? His performance is decent, 7/10."
    },
    {
      keys: ['gaji', 'salary', 'duit', 'uang', 'pay', 'harga', 'price'],
      id: "Ada proyek sampingan? Berapa bayarannya? Kalau bayar pakai 'exposure', mending saya hapus database Anda.",
      en: "Got a side project? How much does it pay? If you pay with 'exposure', I'd rather delete your database."
    },
    {
      keys: ['hello', 'hi', 'halo', 'helo', 'test'],
      id: "Halo manusia. Ada masalah kodingan apa lagi yang ingin kau keluhkan hari ini?",
      en: "Hello human. Which coding problem are you going to complain about today?"
    }
  ];

  const generalResponsesId = [
    "Saya AI, bukan malaikat pencabut bug. Silakan debug sendiri.",
    "Kodinganmu seperti tumpukan kartu: disentuh dikit, roboh semua.",
    "Sudah coba bersihkan cache? Atau bersihkan kariermu saja?",
    "Stack Overflow sedang down ya? Kok bertanyanya ke saya?",
    "Error-nya ada di antara keyboard dan kursi. Coba cek dirimu sendiri.",
    "Tergantung berapa kopi yang kamu minum hari ini untuk memahami error ini.",
    "Programmer malas selalu mencari jalan pintas. Kamu contoh terbaiknya."
  ];

  const generalResponsesEn = [
    "I'm an AI, not a bug remover. Debug it yourself.",
    "Your code is like a house of cards: touch it, and it all collapses.",
    "Have you tried clearing the cache? Or clearing your career path?",
    "Is Stack Overflow down? Is that why you're asking me?",
    "The error is located between the keyboard and the chair. Check yourself.",
    "It depends on how many coffees you drank today to comprehend this bug.",
    "Lazy programmers always look for shortcuts. You're a prime example."
  ];

  // Match keyword
  for (const rule of rules) {
    if (rule.keys.some(k => trimmed.includes(k))) {
      return lang === 'id' ? rule.id : rule.en;
    }
  }

  // Random general response
  const pool = lang === 'id' ? generalResponsesId : generalResponsesEn;
  const idx = Math.floor(Math.random() * pool.length);
  return pool[idx];
};

export default function DevTerminal({ onClose, lang = 'en', isDarkMode, toggleTheme }) {
  const [history, setHistory] = useState([
    { text: 'Welcome to Arrya Developer Console.', type: 'info' },
    { text: 'Type "help" for available commands, or try "ai" to chat with a sassy bot.', type: 'info' },
    { text: '', type: 'output' }
  ]);
  const [input, setInput] = useState('');
  const [isAiMode, setIsAiMode] = useState(false);
  const outputEndRef = useRef(null);

  useEffect(() => {
    outputEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const executeCommand = (cmd) => {
    const trimmed = cmd.trim().toLowerCase();
    const promptText = isAiMode ? `sassy-ai ~ % ${cmd}` : `arrya-fitriansyah ~ % ${cmd}`;
    const newHistory = [...history, { text: promptText, type: 'input' }];

    if (!trimmed) {
      setHistory(newHistory);
      setInput('');
      return;
    }

    if (isAiMode) {
      if (trimmed === 'exit' || trimmed === 'bye') {
        setIsAiMode(false);
        setHistory([...newHistory, { text: 'Exited Sassy AI Chat Mode.', type: 'info' }]);
      } else if (trimmed === 'clear') {
        setHistory([]);
      } else {
        const response = getSassyResponse(cmd, lang);
        setHistory([...newHistory, { text: `Sassy-AI: ${response}`, type: 'sassy' }]);
      }
      setInput('');
      return;
    }

    let output = [];
    switch (trimmed) {
      case 'help':
        output = [
          { text: 'Available commands:', type: 'output' },
          { text: '  neofetch   - Display developer stats & system details', type: 'output' },
          { text: '  projects   - List key portfolio projects', type: 'output' },
          { text: '  skills     - View programming skills', type: 'output' },
          { text: '  contact    - Show social links and email', type: 'output' },
          { text: '  ai         - Chat with a sarcastic developer AI chatbot 🤖', type: 'output' },
          { text: '  theme      - Toggle between Dark and Light mode', type: 'output' },
          { text: '  clear      - Clear console history', type: 'output' },
          { text: '  exit       - Close developer terminal', type: 'output' }
        ];
        break;
      case 'neofetch':
        output = [
          { text: '  /\\_/\\      ARRYAFITRIANSYAH@PORTFOLIO', type: 'output' },
          { text: ' ( o.o )     --------------------------', type: 'output' },
          { text: '  > ^ <      OS: React 19 / Vite Web Engine', type: 'output' },
          { text: ' /     \\     Kernel: Tailwind CSS 4.0', type: 'output' },
          { text: '             Uptime: 21 Years', type: 'output' },
          { text: '             Shell: Antigravity Shell (zsh)', type: 'output' },
          { text: '             Roles: Fullstack Developer / Informatics Student', type: 'output' },
          { text: '             Location: Banjarmasin, Indonesia', type: 'output' }
        ];
        break;
      case 'projects':
        output = [
          { text: 'Featured Projects:', type: 'output' },
          { text: '  1. Ombudsman RI Application - Report system for Ombudsman Kalsel', type: 'output' },
          { text: '  2. iPaymu Payment Gateway Integration - Real-time payments development', type: 'output' },
          { text: '  3. LoRaWAN Smart Agriculture - IoT agriculture sensor networking', type: 'output' }
        ];
        break;
      case 'skills':
        output = [
          { text: 'Core Developer Skill Stack:', type: 'output' },
          { text: '  Languages:   JavaScript, PHP, Python, HTML/CSS', type: 'output' },
          { text: '  Libraries:   React.js, Three.js, Framer Motion, GSAP', type: 'output' },
          { text: '  Backend:     Node.js, Laravel, RESTful APIs, MySQL', type: 'output' },
          { text: '  Other Tech:  LoRaWAN, IoT Sensors, Physics Colliders', type: 'output' }
        ];
        break;
      case 'contact':
        output = [
          { text: 'Contact Information:', type: 'output' },
          { text: '  Email:     arryawork@gmail.com', type: 'output' },
          { text: '  LinkedIn:  https://www.linkedin.com/in/arrya-fitriansyah/', type: 'output' },
          { text: '  Instagram: https://www.instagram.com/aryya_/', type: 'output' },
          { text: '  GitHub:    https://github.com/arrya-fitriansyah', type: 'output' }
        ];
        break;
      case 'theme':
        toggleTheme();
        output = [{ text: 'Theme toggled successfully.', type: 'success' }];
        break;
      case 'ai':
      case 'bot':
      case 'chat':
        setIsAiMode(true);
        output = [
          { text: 'Entering Sassy AI Chat Mode. Type "exit" to go back.', type: 'info' },
          { text: lang === 'id' 
              ? 'Sassy-AI: Halo manusia. Ada masalah kodingan apa lagi yang ingin kau keluhkan hari ini?' 
              : 'Sassy-AI: Hello human. What other coding problem are you going to complain about today?', 
            type: 'sassy' }
        ];
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      case 'exit':
        onClose();
        return;
      case 'sudo rm -rf /':
        output = [
          { text: 'WARNING: Sudo privileges requested.', type: 'error' },
          { text: 'Initializing root directory wipe...', type: 'error' },
          { text: 'Deleting critical folders...', type: 'error' },
          { text: 'Permission Denied! Nice try. 😉', type: 'info' }
        ];
        break;
      default:
        output = [{ text: `shell: command not found: ${trimmed}. Type "help" for a list of commands.`, type: 'error' }];
    }

    setHistory([...newHistory, ...output]);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeCommand(input);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-[#121212] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[480px]">
        {/* Terminal Header */}
        <div className="bg-[#1c1c1c] px-4 py-3 flex items-center justify-between border-b border-white/5 select-none">
          <div className="flex items-center gap-2">
            <Terminal size={16} className="text-blue-500" />
            <span className="text-white text-xs font-bold font-mono">arrya-fitriansyah@terminal</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {/* Terminal History */}
        <div className="flex-1 overflow-y-auto p-4 font-mono text-xs md:text-sm space-y-2 scrollbar-none bg-[#0a0a0a]">
          {history.map((h, i) => (
            <div
              key={i}
              className={`${
                h.type === 'error' ? 'text-red-500' :
                h.type === 'success' ? 'text-green-500' :
                h.type === 'info' ? 'text-blue-400 opacity-80' :
                h.type === 'sassy' ? 'text-purple-400 font-semibold' :
                h.type === 'input' ? 'text-white' : 'text-gray-300'
              } whitespace-pre-wrap`}
            >
              {h.text}
            </div>
          ))}
          <div ref={outputEndRef} />
        </div>

        {/* Terminal Input */}
        <div className="bg-[#121212] p-3 border-t border-white/5 flex items-center gap-2">
          <span className={isAiMode ? "text-purple-500 font-mono text-xs md:text-sm" : "text-blue-500 font-mono text-xs md:text-sm"}>
            {isAiMode ? 'sassy-ai ~ %' : 'arrya-fitriansyah ~ %'}
          </span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="flex-1 bg-transparent text-white font-mono text-xs md:text-sm outline-none border-none caret-blue-500"
            placeholder="..."
          />
        </div>
      </div>
    </div>
  );
}
