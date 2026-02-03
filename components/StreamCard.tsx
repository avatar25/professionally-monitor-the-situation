'use client';

import React, { useEffect, useMemo, useState } from 'react';
import ReactPlayer from 'react-player';
import { X, Volume2, VolumeX, Move, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useMonitorStore } from '@/store/useMonitorStore';
import { cn } from '@/lib/utils';

interface StreamProps {
    id: string;
    url: string;
    isMuted: boolean;
    className?: string;
    onMouseDown?: React.MouseEventHandler;
    onMouseUp?: React.MouseEventHandler;
    onTouchEnd?: React.TouchEventHandler;
    style?: React.CSSProperties;
    width?: number;
}

// Derive per-provider config (mainly Twitch needs a parent host)
function buildPlayerConfig(hostname: string) {
    return {
        youtube: {
            playerVars: { modestbranding: 1, rel: 0, playsinline: 1 },
        },
        twitch: {
            options: { parent: [hostname || 'localhost'], autoplay: true, muted: true },
        },
        file: {
            attributes: { controlsList: 'nodownload', crossOrigin: 'anonymous' },
        },
    };
}

export function StreamCard({ id, url, isMuted, className, onMouseDown, onMouseUp, onTouchEnd, style, ...props }: StreamProps) {
    const { removeStream, toggleMute } = useMonitorStore();
    const [mounted, setMounted] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [hostname, setHostname] = useState('localhost');

    useEffect(() => {
        setMounted(true);
        if (typeof window !== 'undefined') {
            setHostname(window.location.hostname);
        }
    }, []);

    const canPlay = useMemo(() => ReactPlayer.canPlay(url), [url]);
    const playerConfig = useMemo(() => buildPlayerConfig(hostname), [hostname]);

    if (!mounted) return <Card className="h-full bg-zinc-900 animate-pulse" />;

    return (
        <Card
            className={cn("h-full relative group overflow-hidden border-zinc-700 bg-zinc-950 flex flex-col scale-100", className)}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            style={style}
            {...props}
        >
            {/* Drag Handle */}
            <div
                className="drag-handle absolute top-0 left-0 right-0 h-8 bg-black/40 z-20 cursor-move flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                onTouchEnd={onTouchEnd}
            >
                <Move className="w-4 h-4 text-white/70" />
            </div>

            {/* Controls Overlay */}
            <div className={cn(
                "absolute top-2 right-2 z-30 flex gap-2 transition-opacity duration-200",
                isHovering ? "opacity-100" : "opacity-0"
            )}>
                <button
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={() => toggleMute(id)}
                    className="p-1.5 rounded-full bg-black/60 hover:bg-zinc-800 text-white backdrop-blur-sm cursor-pointer"
                >
                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
                <button
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={() => removeStream(id)}
                    className="p-1.5 rounded-full bg-red-900/60 hover:bg-red-700/80 text-white backdrop-blur-sm cursor-pointer"
                >
                    <X size={16} />
                </button>
            </div>

            {/* Video Player */}
            <div className="flex-1 w-full h-full relative pointer-events-auto bg-black">
                {canPlay ? (
                    <ReactPlayer
                        url={url}
                        playing
                        muted={isMuted}
                        controls
                        width="100%"
                        height="100%"
                        config={playerConfig}
                        playsinline
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-zinc-500 gap-2">
                        <AlertCircle size={20} />
                        <span>Unsupported or invalid stream</span>
                    </div>
                )}
            </div>
        </Card>
    );
}
