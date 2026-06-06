import React, { useEffect, useRef, useState } from 'react';
import { Terminal, X } from 'lucide-react';

export default function DevTerminal({ onClose, lang = 'en', isDarkMode, toggleTheme }) {
  const [history, setHistory] = useState([
    { text: 'Welcome to Arrya Developer Console.', type: 'info' },
    { text: 'Type "help" for a list of available commands.', type: 'info' },
    { text: '', type: 'output' }
  ]);
  const [input, setInput] = useState('');
  const outputEndRef = useRef(null);

  useEffect(() => {
    outputEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const executeCommand = (cmd) => {
    const trimmed = cmd.trim().toLowerCase();
    const newHistory = [...history, { text: `arrya-fitriansyah ~ % ${cmd}`, type: 'input' }];

    if (!trimmed) {
      setHistory(newHistory);
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
      case 'clear':
        setHistory([]);
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
          <span className="text-blue-500 font-mono text-xs md:text-sm">arrya-fitriansyah ~ %</span>
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
