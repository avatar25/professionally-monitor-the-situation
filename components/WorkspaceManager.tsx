'use client';

import React from 'react';
import { useMonitorStore } from '@/store/useMonitorStore';
import { MonitorGrid } from '@/components/MonitorGrid';
import { AnimatePresence, motion } from 'framer-motion';

export function WorkspaceManager() {
    const { activeWorkspaceId } = useMonitorStore();

    return (
        <div className="flex-1 relative overflow-hidden bg-zinc-950">
            <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                    key={activeWorkspaceId}
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -300, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="absolute inset-0 w-full h-full"
                >
                    <MonitorGrid workspaceId={activeWorkspaceId} />
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
