import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Layout } from 'react-grid-layout';

export interface Stream {
    id: string;
    url: string;
    isMuted: boolean;
    layout?: Layout;
}

export interface Workspace {
    id: string;
    name: string;
    streams: Stream[];
}

interface MonitorState {
    workspaces: Workspace[];
    activeWorkspaceId: string;
    isGlobalMuted: boolean;

    // Workspace Actions
    addWorkspace: (name: string) => void;
    removeWorkspace: (id: string) => void;
    renameWorkspace: (id: string, newName: string) => void;
    setActiveWorkspace: (id: string) => void;

    // Stream Actions (Scoped to Active Workspace)
    addStream: (url: string) => void;
    removeStream: (id: string) => void;
    toggleMute: (id: string) => void;
    toggleGlobalMute: () => void;
    updateLayout: (layouts: Layout[]) => void;
    resetLayout: () => void;
}

const DEFAULT_NEWS_STREAMS: Stream[] = [
    { id: 'news-1', url: 'https://www.youtube.com/watch?v=vfszY1JYbMc&pp=ygURbGl2ZSBuZXdzIHN0cmVhbXM%3D', isMuted: true }, // Sky News
    { id: 'news-2', url: 'https://www.youtube.com/watch?v=YDvsBbKfLPA&pp=ygURbGl2ZSBuZXdzIHN0cmVhbXM%3D', isMuted: true }, // ABC News
    { id: 'news-3', url: 'https://www.youtube.com/watch?v=9NyxcX3rhQs', isMuted: true }, // Live News
];

const DEFAULT_WORKSPACES: Workspace[] = [
    {
        id: 'news-preset',
        name: 'News',
        streams: DEFAULT_NEWS_STREAMS
    }
];

export const useMonitorStore = create<MonitorState>()(
    persist(
        (set) => ({
            workspaces: DEFAULT_WORKSPACES,
            activeWorkspaceId: 'news-preset',
            isGlobalMuted: true,

            // Workspace Actions
            addWorkspace: (name: string) => set((state) => {
                if (state.workspaces.length >= 5) return state;
                const newId = crypto.randomUUID();
                return {
                    workspaces: [...state.workspaces, { id: newId, name, streams: [] }],
                    activeWorkspaceId: newId // Auto-switch to new tab
                };
            }),

            removeWorkspace: (id: string) => set((state) => {
                if (state.workspaces.length <= 1) return state; // Prevent deleting last tab
                const newWorkspaces = state.workspaces.filter(w => w.id !== id);
                // If active tab was deleted, switch to the first available
                const newActiveId = state.activeWorkspaceId === id ? newWorkspaces[0].id : state.activeWorkspaceId;
                return { workspaces: newWorkspaces, activeWorkspaceId: newActiveId };
            }),

            renameWorkspace: (id: string, newName: string) => set((state) => ({
                workspaces: state.workspaces.map(w => w.id === id ? { ...w, name: newName } : w)
            })),

            setActiveWorkspace: (id: string) => set({ activeWorkspaceId: id }),

            // Stream Actions
            addStream: (url: string) => set((state) => {
                const streamId = crypto.randomUUID();
                const newStream = { id: streamId, url, isMuted: true };

                return {
                    workspaces: state.workspaces.map(w => {
                        if (w.id === state.activeWorkspaceId) {
                            return { ...w, streams: [...w.streams, newStream] };
                        }
                        return w;
                    })
                };
            }),

            removeStream: (id: string) => set((state) => ({
                workspaces: state.workspaces.map(w => {
                    if (w.id === state.activeWorkspaceId) {
                        return { ...w, streams: w.streams.filter(s => s.id !== id) };
                    }
                    return w;
                })
            })),

            toggleMute: (id: string) => set((state) => ({
                workspaces: state.workspaces.map(w => {
                    if (w.id === state.activeWorkspaceId) {
                        return {
                            ...w,
                            streams: w.streams.map(s => s.id === id ? { ...s, isMuted: !s.isMuted } : s)
                        };
                    }
                    return w;
                })
            })),

            toggleGlobalMute: () => set((state) => {
                const newGlobalMute = !state.isGlobalMuted;
                return {
                    isGlobalMuted: newGlobalMute,
                    workspaces: state.workspaces.map(w => ({
                        ...w,
                        streams: w.streams.map(s => ({ ...s, isMuted: newGlobalMute }))
                    }))
                };
            }),

            updateLayout: (layouts: Layout[]) => set((state) => ({
                workspaces: state.workspaces.map(w => {
                    if (w.id === state.activeWorkspaceId) {
                        const updatedStreams = w.streams.map(stream => {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const layout = layouts.find((l: any) => l.i === stream.id);
                            return layout ? { ...stream, layout } : stream;
                        });
                        return { ...w, streams: updatedStreams };
                    }
                    return w;
                })
            })),

            resetLayout: () => set((state) => ({
                workspaces: state.workspaces.map(w => {
                    if (w.id === state.activeWorkspaceId) {
                        return { ...w, streams: w.streams.map(s => ({ ...s, layout: undefined })) };
                    }
                    return w;
                })
            })),
        }),
        {
            name: 'monitor-storage',
            version: 2,
            migrate: (persistedState: any, version) => {
                if (version === 0 || version === 1) {
                    // Forcefully prepend the News Preset
                    // Even if they have data, we want "News" to be the first tab and active

                    const existingWorkspaces = persistedState.workspaces || [];
                    // Check if a workspace named 'News' likely exists effectively
                    // but simplest is just to prepend our authoritative list

                    // Filter out any previous 'default' if it was empty, maybe?
                    // Let's just keep their data but put ours first.

                    // If migration from v0 (original list of streams)
                    let migratedWorkspaces = existingWorkspaces;
                    if (version === 0 && persistedState.streams) {
                        migratedWorkspaces = [{
                            id: 'old-data',
                            name: 'My Workspace',
                            streams: persistedState.streams
                        }];
                    }

                    return {
                        workspaces: [
                            ...DEFAULT_WORKSPACES,
                            ...migratedWorkspaces
                        ],
                        activeWorkspaceId: 'news-preset', // Focus the preset
                        isGlobalMuted: true
                    };
                }
                return persistedState;
            },
        }
    )
);
