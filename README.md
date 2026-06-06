# 🚀 Modern 3D Personal Portfolio

A modern, high-performance personal portfolio website built with **React 19**, **Vite**, and **Tailwind CSS 4**. This project features advanced interactive 3D graphics, smooth animations, and a polished dark-themed aesthetic with responsive layouts.

🔗 **Live Website:** [https://arrya-fitriansyah.my.id/](https://arrya-fitriansyah.my.id/)

---

## ✨ Key Features

*   **🕶️ Interactive 3D Physics Lanyard:** A high-fidelity 3D ID card/lanyard built using React Three Fiber (`r3f`) and Rapier Physics. Users can drag, grab, and fling the card which responds dynamically to physics, gravity, and cursor movement.
*   **📱 Auto-Scrolling Mobile Carousels:** Projects, certificates, and media highlights are presented as swipeable carousels on mobile viewports. Features automated auto-scroll loops with interactive pause detection.
*   **🧩 Spotlight Cards:** Custom interactive cards that feature dynamic ambient lighting reflecting the cursor's hover position.
*   **🏷️ Filterable Tech Stack:** A grid-based skills showcase categorized dynamically into Frontend, Backend, Mobile, and DB & DevOps with proficiency indicators and linked projects.
*   **🌐 Localization (Dwibahasa):** Full multi-language support (English and Indonesian) with dynamic switching.
*   **🌓 Dark Mode & Theme Persistence:** Sleek dark-mode aesthetic with custom-tailored v4 custom variants.
*   **🔍 SEO & Structured Metadata:** Semantic HTML5, full OpenGraph (OG) configurations, and Schema.org JSON-LD structured data for search engine optimization.

---

## 🛠️ Technology Stack

| Category | Technology |
| :--- | :--- |
| **Core Framework** | React 19, Vite 7 |
| **Styling & Design** | Tailwind CSS 4, PostCSS, Autoprefixer |
| **3D Graphics** | Three.js, `@react-three/fiber` (R3F), `@react-three/drei`, `@react-three/rapier` (Physics Engine), `meshline` |
| **Animations** | GSAP, Framer Motion |
| **Utility & Icons** | Lucide React |

---

## 📂 Project Structure

```text
├── public/                 # Static assets (favicons, sitemap, video)
├── src/
│   ├── assets/             # Images & 3D models (card.glb, lanyard texture)
│   ├── components/         # Reusable UI & 3D components
│   │   ├── Lanyard/        # 3D Physics-based Lanyard component
│   │   ├── AnimatedContent.jsx
│   │   ├── CardNav.jsx
│   │   ├── GooeyNav.jsx
│   │   ├── Preloader.jsx
│   │   ├── SkillsShowcase.jsx
│   │   └── SpotlightCard.jsx
│   ├── App.jsx             # Main Application hub
│   ├── index.css           # Global Tailwind 4 custom styles
│   └── main.jsx            # React Entry point
├── deploy.sh               # Automated deployment script for production VMs
├── tailwind.config.js      # Custom theme configurations
└── vite.config.js          # Vite configuration & split chunking
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have Node.js installed on your machine:
*   **Node.js:** `>= 20.0.0`
*   **npm:** `>= 10.0.0`

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Ryayaa/portofolio.git
    cd portofolio
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```
    Open `http://localhost:5173` on your browser to view it.

4.  **Build for production:**
    ```bash
    npm run build
    ```

---

## ⚙️ Deployment (Ubuntu / Nginx VM)

This project contains an automated deployment script `deploy.sh` to compile, copy, and reload the server instantly:

1.  Grant execution permissions to the script:
    ```bash
    chmod +x deploy.sh
    ```

2.  Run the script:
    ```bash
    ./deploy.sh
    ```

*Note: Ensure the target web root paths (`PROJECT_DIR` and `NGINX_ROOT`) in `deploy.sh` are set according to your VM configuration.*

---

## 📄 License

Created by **Arrya Fitriansyah**. All rights reserved.
