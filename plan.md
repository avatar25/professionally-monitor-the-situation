# Project Specification: NewsGrid (Multi-Workspace Edition)

## 1. Project Overview
**Goal:** Build a "Vibe Coding" public web app that functions as a professional news monitoring dashboard with **multiple workspaces**.
**Core Function:** Users can organize YouTube streams into distinct "Tabs" or "Pages" (e.g., News, Finance, Memes) and slide between them instantly.
**Vibe:** Cyberpunk/Bloomberg Terminal. Dark mode by default. High information density.
**Deployment:** Public-facing (Vercel).

## 2. Tech Stack (Strict)
* **Framework:** Next.js 14+ (App Router, TypeScript).
* **Styling:** Tailwind CSS (with `clsx` and `tailwind-merge`).
* **UI Library:** shadcn/ui (Radix UI primitives).
* **Grid Engine:** `react-grid-layout` (Draggable/resizable CCTV panels).
* **Video Engine:** `react-player` (YouTube embeds).
* **Animation:** `framer-motion` (For sliding transitions between tabs).
* **State Management:** `zustand` (with `persist` middleware).
* **Icons:** Lucide React.

## 3. Core Features & Requirements

### A. Workspace System (The "Tabs")
* **Structure:** The app supports multiple "Workspaces." Each Workspace has its own independent grid layout and list of videos.
* **Navigation:** A slim vertical sidebar (Rail) on the left to switch contexts.
* **Transitions:** Switching tabs triggers a smooth "Slide" animation (using `AnimatePresence` from Framer Motion).
* **Default Workspaces:** On first load, initialize with:
    1.  "News" (Empty or default stream)
    2.  "Alpha/Finance"
    3.  "Chill/Lofi"

### B. The Grid (The "CCTV" View)
* **Layout:** `ResponsiveGridLayout`. Unique to the *currently active* workspace.
* **Behavior:**
    * Panels draggable/resizable.
    * **Drag Barrier:** You cannot drag a video *between* tabs (keep it simple for now).
* **Performance:**
    * `react-player` must use `light={true}` (thumbnail preview) for non-playing videos.
    * **Global Mute:** Default `muted={true}`. Only one video should have audio focus at a time (click to unmute).

### C. The Control Bar (Top or Bottom)
* **Context Aware:** The "Add Stream" button only adds to the *current* active tab.
* **Workspace Controls:**
    * "Rename Tab" (Double click tab icon).
    * "Delete Tab" (Context menu).
    * "New Tab" (+ Button).

### D. State Management (Zustand)
Store Name: `useMonitorStore`
* **Data Structure:**
    ```typescript
    interface Stream { id: string; url: string; layout: { x, y, w, h } }
    interface Workspace { id: string; name: string; streams: Stream[] }

    state: {
      workspaces: Workspace[],
      activeWorkspaceId: string,
      isGlobalMute: boolean
    }
    ```
* **Actions:**
    * `addWorkspace(name)`: Creates new empty tab.
    * `setActiveWorkspace(id)`: Triggers the slide animation and switches data.
    * `addStreamToWorkspace(workspaceId, url)`: Adds video to specific grid.

## 4. Design System (Shadcn/Tailwind)
* **Theme:** Force Dark Mode (`bg-zinc-950`).
* **Sidebar:** A thin `w-16` border-r border-zinc-800 rail containing Icons (Newspaper for News, DollarSign for Finance, etc.).
* **Animation:** When switching tabs, the old grid slides out left, new grid slides in from right.

## 5. Implementation Plan (Step-by-Step for Agent)

**Step 1: Scaffold & Architecture**
* Initialize Next.js, Install dependencies (`framer-motion`, `zustand`, `react-grid-layout`).
* Set up Shadcn components: `sheet` (mobile nav), `tooltip` (sidebar hover), `dialog` (rename tab), `context-menu`.

**Step 2: The Store (Critical Refactor)**
* define `useMonitorStore` with the nested `workspaces` array structure.
* Implement `persist` so all tabs and their videos are saved to LocalStorage.

**Step 3: The Workspace Shell**
* Create `Sidebar.tsx`: Renders the list of workspaces as icons.
* Create `WorkspaceManager.tsx`: A wrapper component that handles the `framer-motion` transition logic between grids.

**Step 4: The Grid Logic**
* Adapt `MonitorGrid.tsx` to accept a `workspaceId` prop.
* Ensure the grid only renders the streams *belonging to that ID*.

**Step 5: URL Sync (Advanced)**
* Update URL logic. Instead of just `?v=...`, use `?tab=news&v=...`.
* When sharing a link, it should open the specific tab and video set.

## 6. Edge Cases to Handle
1.  **Animation Jitter:** `react-grid-layout` calculates positions on mount. Ensure the entrance animation finishes *before* the grid tries to calculate layout, or use `layout` prop in Framer Motion to smooth it.
2.  **Memory Leaks:** If a user has 5 tabs with 10 videos each, that's 50 iframes.
    * *Fix:* **Aggressive Unmounting.** Only render the `react-player` instances for the *Active Tab*. The background tabs should be fully unmounted or just keep their state in Zustand without rendering the DOM nodes.
3.  **Iframe Dragging:** Maintain the `pointer-events: none` fix on iframes during drag operations.