# Monitoring the Situation

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-development-orange.svg)

**Monitoring the Situation** is a professional "Vibe Coding" public web app designed for high-density information monitoring. Inspired by Cyberpunk aesthetics and financial terminals, it allows users to organize and view multiple YouTube streams across different workspaces.

## 🚀 Features

- **Multi-Workspace System**: Organize streams into up to 5 distinct tabs (e.g., News, Finance, Sports).
- **Default Presets**: Comes pre-loaded with a "News" workspace featuring top live news channels.
- **CCTV Grid Layout**: Draggable and resizable video panels using `react-grid-layout`.
- **Smooth Transitions**: Slick sliding animations between workspaces.
- **Cyberpunk Aesthetic**: Dark mode by default, high contrast, information-dense UI.
- **Audio Control**: Global mute/unmute and per-stream volume controls.
- **Smart Persistence**:Layouts and workspaces are saved to local storage automatically.
- **Performance**: Inactive tabs automatically unmount streams to save resources.

## 🛠 Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router, TypeScript)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (Radix UI)
- **Grid Engine**: [react-grid-layout](https://github.com/react-grid-layout/react-grid-layout)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Video Player**: [react-player](https://github.com/cookpete/react-player)
- **State Management**: [zustand](https://github.com/pmndrs/zustand) + Persist Middleware
- **Icons**: [Lucide React](https://lucide.dev/)

## 📦 Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/avatar25/professionally-monitor-the-situation.git
    cd professionally-monitor-the-situation
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
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main application shell
├── components/           # React components
│   ├── ui/               # shadcn/ui primitives
│   ├── Sidebar.tsx       # Workspace navigation rail
│   ├── WorkspaceManager.tsx # Transitions & Grid wrapper
│   ├── MonitorGrid.tsx   # Draggable grid layout
│   ├── StreamCard.tsx    # Video player card component
│   └── ControlPanel.tsx  # Global controls
├── lib/                  # Utilities
├── store/                # Zustand state management
│   └── useMonitorStore.ts # Workspaces & Streams state
└── public/               # Static assets
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
