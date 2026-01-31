'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Responsive, type Layout } from 'react-grid-layout';
import { useMonitorStore } from '@/store/useMonitorStore';
import { StreamCard } from './StreamCard';

// Add styles for react-grid-layout
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

// Custom WidthProvider HOC to fix export issues
// This follows the pattern of react-grid-layout's WidthProvider
function withWidth(ComposedComponent: any) {
    return function WithWidth(props: any) {
        const [width, setWidth] = useState(1280);
        const [mounted, setMounted] = useState(false);
        const elementRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
            setMounted(true);
            if (!elementRef.current) return;

            const observer = new ResizeObserver((entries) => {
                for (const entry of entries) {
                    // Subtract padding/margin if needed, but clientWidth usually works
                    setWidth(entry.contentRect.width);
                }
            });

            observer.observe(elementRef.current);
            // Initial set
            setWidth(elementRef.current.offsetWidth);

            return () => observer.disconnect();
        }, []);

        return (
            <div className={props.className} style={props.style} ref={elementRef}>
                {mounted && <ComposedComponent {...props} width={width} />}
            </div>
        );
    };
}

const ResponsiveGridLayout = withWidth(Responsive);

export function MonitorGrid() {
    const { streams, updateLayout } = useMonitorStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Avoid hydration mismatch by rendering only after mount
    if (!mounted) {
        return (
            <div className="w-full h-[80vh] flex items-center justify-center text-zinc-500 animate-pulse">
                Loading Grid...
            </div>
        );
    }

    // Generate layout for RGL if not present (although store should handle this, RGL needs explicit layout array sometimes)
    const layout = streams.map((stream, index) => {
        return stream.layout || {
            i: stream.id,
            x: (index * 4) % 12,
            y: Math.floor(index / 3) * 4,
            w: 4,
            h: 4,
        };
    });

    return (
        <div className="w-full min-h-[calc(100vh-80px)] p-4">
            <ResponsiveGridLayout
                className="layout"
                layouts={{ lg: layout }}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                rowHeight={100}
                draggableHandle=".drag-handle"
                onLayoutChange={(currentLayout: Layout[]) => {
                    updateLayout(currentLayout);
                }}
                margin={[16, 16]}
            >
                {streams.map((stream) => (
                    <div key={stream.id}>
                        <StreamCard
                            id={stream.id}
                            url={stream.url}
                            isMuted={stream.isMuted}
                        />
                    </div>
                ))}
            </ResponsiveGridLayout>
        </div>
    );
}
