'use client';

import React, { useState } from 'react';
import { useMonitorStore } from '@/store/useMonitorStore';
import { cn } from '@/lib/utils';
import {
    Layout,
    Plus,
    Monitor,
    Newspaper,
    Briefcase,
    Coffee,
    Gamepad2,
    Pencil,
    Trash2
} from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ICONS = [Layout, Newspaper, Briefcase, Coffee, Gamepad2];

export function Sidebar() {
    const {
        workspaces,
        activeWorkspaceId,
        setActiveWorkspace,
        addWorkspace,
        removeWorkspace,
        renameWorkspace
    } = useMonitorStore();

    const [isRenameOpen, setIsRenameOpen] = useState(false);
    const [workspaceToRename, setWorkspaceToRename] = useState<string | null>(null);
    const [newName, setNewName] = useState('');

    const handleAdd = () => {
        if (workspaces.length < 5) {
            addWorkspace(`Workspace ${workspaces.length + 1}`);
        }
    };

    const handleRenameClick = (id: string, currentName: string) => {
        setWorkspaceToRename(id);
        setNewName(currentName);
        setIsRenameOpen(true);
    };

    const confirmRename = () => {
        if (workspaceToRename && newName.trim()) {
            renameWorkspace(workspaceToRename, newName);
            setIsRenameOpen(false);
            setWorkspaceToRename(null);
        }
    };

    return (
        <>
            <div className="w-16 h-screen border-r border-zinc-800 bg-zinc-950 flex flex-col items-center py-4 gap-4 z-50">
                <div className="mb-2 p-2 bg-zinc-900 rounded-lg">
                    <Monitor className="text-cyan-500" size={24} />
                </div>

                <div className="flex-1 flex flex-col gap-3 w-full px-2">
                    <TooltipProvider delayDuration={0}>
                        {workspaces.map((ws, i) => {
                            const Icon = ICONS[i % ICONS.length];
                            const isActive = ws.id === activeWorkspaceId;

                            return (
                                <ContextMenu key={ws.id}>
                                    <ContextMenuTrigger>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button
                                                    onClick={() => setActiveWorkspace(ws.id)}
                                                    className={cn(
                                                        "w-full aspect-square rounded-xl flex items-center justify-center transition-all duration-200 relative group",
                                                        isActive
                                                            ? "bg-cyan-900/20 text-cyan-400 ring-1 ring-cyan-500/50"
                                                            : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
                                                    )}
                                                >
                                                    <Icon size={20} />
                                                    {isActive && (
                                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-cyan-500 rounded-r-full -ml-3" />
                                                    )}
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent side="right" className="bg-zinc-900 border-zinc-800 text-zinc-300">
                                                <p>{ws.name}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </ContextMenuTrigger>
                                    <ContextMenuContent className="bg-zinc-900 border-zinc-800 text-zinc-300">
                                        <ContextMenuItem
                                            onClick={() => handleRenameClick(ws.id, ws.name)}
                                            className="focus:bg-zinc-800 focus:text-cyan-400 cursor-pointer"
                                        >
                                            <Pencil className="mr-2 h-4 w-4" /> Rename
                                        </ContextMenuItem>
                                        <ContextMenuItem
                                            onClick={() => removeWorkspace(ws.id)}
                                            disabled={workspaces.length <= 1}
                                            className="focus:bg-red-900/30 focus:text-red-400 text-red-400 cursor-pointer"
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                        </ContextMenuItem>
                                    </ContextMenuContent>
                                </ContextMenu>
                            );
                        })}
                    </TooltipProvider>

                    {workspaces.length < 5 && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={handleAdd}
                                        className="w-full aspect-square rounded-xl flex items-center justify-center text-zinc-600 border border-zinc-800 border-dashed hover:border-zinc-600 hover:text-zinc-400 transition-colors"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="bg-zinc-900 border-zinc-800">
                                    <p>New Workspace</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </div>
            </div>

            <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
                <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-200">
                    <DialogHeader>
                        <DialogTitle>Rename Workspace</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <Input
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="Workspace Name"
                            className="bg-black/50 border-zinc-800 focus:ring-cyan-500/50"
                            onKeyDown={(e) => e.key === 'Enter' && confirmRename()}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsRenameOpen(false)} className="hover:bg-zinc-900 hover:text-white">Cancel</Button>
                        <Button onClick={confirmRename} className="bg-cyan-600 hover:bg-cyan-500 text-white">Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
