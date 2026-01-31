# NewsGrid (CCTV-Style Monitor)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-development-orange.svg)

**NewsGrid** is a professional "Vibe Coding" public web app designed to function as a high-density news monitoring dashboard. Inspired by Cyberpunk aesthetics and Bloomberg Terminals, it allows users to monitor multiple YouTube news streams simultaneously in a customizable, draggable grid layout.

## 🚀 Features

- **Multi-Stream Monitoring**: Add unlimited YouTube live streams or videos.
- **CCTV Grid Layout**: Draggable and resizable video panels using `react-grid-layout`.
- **Cyberpunk Aesthetic**: Dark mode by default, high contrast, information-dense UI.
- **Audio Control**: Global mute/unmute and per-stream volume controls.
- **Persistence**: Layouts and active streams are saved individually using local storage.
- **Shareable Setups**: (Planned) Sync active video IDs to URL parameters for sharing.

## 🛠 Tech Stack

- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router, TypeScript)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (Radix UI)
- **Grid Engine**: [react-grid-layout](https://github.com/react-grid-layout/react-grid-layout)
- **Video Player**: [react-player](https://github.com/cookpete/react-player)
- **State Management**: [zustand](https://github.com/pmndrs/zustand)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📦 Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/newsgrid.git
    cd newsgrid
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  **Open the app:**
    Visit `http://localhost:3000` in your browser.

## 📂 Project Structure

```bash
├── app/                  # Next.js App Router pages
├── components/           # React components
│   ├── ui/               # shadcn/ui primitives
│   ├── StreamCard.tsx    # Video player card component
│   ├── MonitorGrid.tsx   # Draggable grid layout
│   └── ControlPanel.tsx  # Global controls (add stream, mute all)
├── lib/                  # Utilities (clsx, tailwind-merge)
├── store/                # Zustand state management
│   └── useMonitorStore.ts
└── public/               # Static assets
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
