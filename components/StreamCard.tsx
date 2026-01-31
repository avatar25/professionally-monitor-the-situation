'use client';

import React, { useState, useEffect, useRef } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';
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

// Helper to extract YouTube ID
function getYouTubeID(url: string): string | null {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

export function StreamCard({ id, url, isMuted, className, onMouseDown, onMouseUp, onTouchEnd, style, ...props }: StreamProps) {
    const { removeStream, toggleMute } = useMonitorStore();
    const [mounted, setMounted] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [videoID, setVideoID] = useState<string | null>(null);
    const playerRef = useRef<any>(null);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
        setVideoID(getYouTubeID(url));
    }, [url]);

    // Sync mute state with player
    useEffect(() => {
        if (playerRef.current) {
            if (isMuted) {
                playerRef.current.mute();
            } else {
                playerRef.current.unMute();
            }
        }
    }, [isMuted]);

    const onReady = (event: any) => {
        playerRef.current = event.target;
        if (isMuted) {
            event.target.mute();
        }
        // Attempt playback
        event.target.playVideo();
    };

    const opts: YouTubeProps['opts'] = {
        height: '100%',
        width: '100%',
        playerVars: {
            autoplay: 1,
            controls: 1, // Show controls so user can interact
            modestbranding: 1,
            playsinline: 1,
            mute: 1, // Force mute for autoplay
        },
    };

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
                {videoID ? (
                    <YouTube
                        videoId={videoID}
                        opts={opts}
                        onReady={onReady}
                        className="w-full h-full"
                        iframeClassName="w-full h-full"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-zinc-500 gap-2">
                        <AlertCircle size={20} />
                        <span>Invalid Video ID</span>
                    </div>
                )}

            </div>
        </Card>
    );
}
