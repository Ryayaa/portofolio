import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Developer Console Easter Egg
if (typeof window !== 'undefined') {
  console.log(
    "%c" +
    "  __ _ _ __ _ __ _   _  __ _ \n" +
    " / _` | '__| '__| | | |/ _` |\n" +
    "| (_| | |  | |  | |_| | (_| |\n" +
    " \\__,_|_|  |_|   \\__, |\\__,_|\n" +
    "                 |___/       ",
    "color: #3b82f6; font-weight: bold; font-family: monospace;"
  );
  console.log(
    "%c🚀 Welcome to Arrya Fitriansyah's Portfolio!",
    "color: #3b82f6; font-size: 16px; font-weight: bold; font-family: sans-serif;"
  );
  console.log(
    "%c👨‍💻 Fullstack Developer & Creative Coder",
    "color: #a855f7; font-size: 12px; font-weight: bold; font-family: sans-serif;"
  );
  console.log(
    "%cInterested in hiring or collaborating? Let's connect!\n" +
    "📧 Email:    arryawork@gmail.com\n" +
    "💼 LinkedIn: linkedin.com/in/arrya-fitriansyah/\n" +
    "🐙 GitHub:   github.com/arrya-fitriansyah",
    "color: #94a3b8; font-size: 11px; line-height: 1.6; font-family: monospace;"
  );
}
