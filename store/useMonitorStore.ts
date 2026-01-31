import { create } from 'zustand';

interface MonitorState {
    streams: any[];
    addStream: (url: string) => void;
}

export const useMonitorStore = create<MonitorState>((set) => ({
    streams: [],
    addStream: (url: string) => set((state) => ({ streams: [...state.streams, url] })),
}));
