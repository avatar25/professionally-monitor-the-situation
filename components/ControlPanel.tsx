'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Plus, Volume2, VolumeX, LayoutGrid, Monitor, Maximize2, Fullscreen, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMonitorStore } from '@/store/useMonitorStore';
import { cn } from '@/lib/utils';
import {
    CONTROL_PANEL_CLEARANCE,
    getGridColsForWidth,
    GRID_EDGE_PADDING,
    GRID_MARGIN,
    GRID_ROW_HEIGHT,
    SIDEBAR_WIDTH,
    TOP_BAR_HEIGHT
} from '@/lib/autoFitLayout';

export function ControlPanel() {
    const [inputUrl, setInputUrl] = useState('');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const controlPanelRef = useRef<HTMLDivElement>(null);
    const {
        addStream,
        toggleGlobalMute,
        isGlobalMuted,
        resetLayout,
        fitLayoutToScreen,
        workspaces,
        activeWorkspaceId
    } = useMonitorStore();

    const activeStreams = workspaces.find(w => w.id === activeWorkspaceId)?.streams || [];

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(Boolean(document.fullscreenElement));
        };

        handleFullscreenChange();
        document.addEventListener('fullscreenchange', handleFullscreenChange);

        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const handleAddStream = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputUrl.trim()) return;
        addStream(inputUrl);
        setInputUrl('');
    };

    const handleFitLayoutToScreen = () => {
        const layoutElement = document.querySelector<HTMLElement>('.react-grid-layout');
        const layoutRect = layoutElement?.getBoundingClientRect();
        const controlPanelTop = controlPanelRef.current?.getBoundingClientRect().top
            ?? window.innerHeight - CONTROL_PANEL_CLEARANCE;
        const gridWidth = Math.max(layoutRect?.width ?? window.innerWidth - SIDEBAR_WIDTH - GRID_EDGE_PADDING * 2, 1);
        const gridHeight = Math.max(
            layoutRect
                ? controlPanelTop - layoutRect.top - GRID_MARGIN[1]
                : window.innerHeight - TOP_BAR_HEIGHT - GRID_EDGE_PADDING * 2 - CONTROL_PANEL_CLEARANCE,
            GRID_ROW_HEIGHT
        );

        fitLayoutToScreen({
            width: gridWidth,
            height: gridHeight,
            cols: getGridColsForWidth(gridWidth),
            rowHeight: GRID_ROW_HEIGHT,
            margin: GRID_MARGIN
        });
    };

    const handleToggleFullscreen = async () => {
        try {
            if (document.fullscreenElement) {
                await document.exitFullscreen();
                return;
            }

            await document.documentElement.requestFullscreen();
        } catch {
            // Some embedded browsers block fullscreen permission even from a user click.
        }
    };

    return (
        <div ref={controlPanelRef} className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl bg-zinc-900/90 backdrop-blur-md border border-zinc-800 rounded-xl p-3 shadow-2xl z-50 flex gap-4 items-center ring-1 ring-white/10">

            {/* Brand Icon */}
            <div className="hidden sm:flex items-center gap-2 px-2 border-r border-zinc-700/50 mr-2">
                <Monitor className="text-cyan-500" size={20} />
                <span className="font-mono font-bold text-sm tracking-wider text-zinc-300">NEWSGRID</span>
            </div>

            <form onSubmit={handleAddStream} className="flex-1 flex gap-2">
                <Input
                    disabled={activeStreams.length >= 16}
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="Paste YouTube Stream URL..."
                    className="bg-black/50 border-zinc-700 text-zinc-100 focus:ring-cyan-500/50 placeholder:text-zinc-600 font-mono text-sm"
                />
                <Button
                    disabled={!inputUrl}
                    type="submit"
                    variant="secondary"
                    className="bg-cyan-900/30 text-cyan-400 hover:bg-cyan-900/50 hover:text-cyan-200 border border-cyan-900/50"
                >
                    <Plus size={18} />
                    <span className="hidden sm:inline ml-1">Add</span>
                </Button>
            </form>

            <div className="flex items-center gap-1 sm:gap-2 border-l border-zinc-700/50 pl-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleGlobalMute}
                    className={cn("hover:bg-zinc-800", isGlobalMuted ? "text-yellow-500" : "text-zinc-400")}
                    title="Global Mute Toggle"
                >
                    {isGlobalMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleFitLayoutToScreen}
                    disabled={activeStreams.length === 0}
                    className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                    title="Fit Videos to Screen"
                >
                    <Maximize2 size={18} />
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleToggleFullscreen}
                    className={cn("hover:bg-zinc-800", isFullscreen ? "text-cyan-400" : "text-zinc-400 hover:text-white")}
                    title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                >
                    {isFullscreen ? <Minimize2 size={18} /> : <Fullscreen size={18} />}
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={resetLayout}
                    className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                    title="Reset Layout"
                >
                    <LayoutGrid size={18} />
                </Button>
            </div>
        </div>
    );
}
