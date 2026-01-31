import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Layout } from 'react-grid-layout';

export interface Stream {
    id: string;
    url: string;
    isMuted: boolean;
    layout?: Layout;
}

interface MonitorState {
    streams: Stream[];
    isGlobalMuted: boolean;
    addStream: (url: string) => void;
    removeStream: (id: string) => void;
    toggleMute: (id: string) => void;
    toggleGlobalMute: () => void;
    updateLayout: (layouts: Layout[]) => void;
    resetLayout: () => void;
}

export const useMonitorStore = create<MonitorState>()(
    persist(
        (set) => ({
            streams: [],
            isGlobalMuted: true,

            addStream: (url: string) => set((state) => {
                const id = crypto.randomUUID();
                // Default layout will be handled by auto-layout, but we can init it
                return {
                    streams: [...state.streams, { id, url, isMuted: true }]
                };
            }),

            removeStream: (id: string) => set((state) => ({
                streams: state.streams.filter((s) => s.id !== id),
            })),

            toggleMute: (id: string) => set((state) => ({
                streams: state.streams.map((s) =>
                    s.id === id ? { ...s, isMuted: !s.isMuted } : s
                ),
            })),

            toggleGlobalMute: () => set((state) => ({
                isGlobalMuted: !state.isGlobalMuted,
                streams: state.streams.map(s => ({ ...s, isMuted: !state.isGlobalMuted }))
            })),

            updateLayout: (layouts: Layout[]) => set((state) => {
                // Sync layout changes to streams
                const updatedStreams = state.streams.map(stream => {
                    // Cast l to any to avoid "property i does not exist" if Layout type is loose
                    const layout = layouts.find((l: any) => l.i === stream.id);
                    return layout ? { ...stream, layout } : stream;
                });
                return { streams: updatedStreams };
            }),

            resetLayout: () => set((state) => ({
                streams: state.streams.map(s => ({ ...s, layout: undefined }))
            })),
        }),
        {
            name: 'monitor-storage',
        }
    )
);
