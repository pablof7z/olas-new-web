'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RefreshCw } from 'lucide-react';
import { useState } from 'react';

interface AvatarSelectorProps {
    value: string;
    onChange: (value: string) => void;
    size?: 'sm' | 'md' | 'lg';
}

export default function AvatarSelector({ value, onChange, size = 'md' }: AvatarSelectorProps) {
    // Generate a random seed for the avatar
    const generateRandomSeed = () => {
        return Math.random().toString(36).substring(2, 10);
    };

    // Initialize with a random seed if none provided
    const [seed, setSeed] = useState(value || generateRandomSeed());

    // Update the avatar with a new random seed
    const refreshAvatar = () => {
        const newSeed = generateRandomSeed();
        setSeed(newSeed);
        onChange(newSeed);
    };

    // Determine avatar size
    const sizeClass = {
        sm: 'h-12 w-12',
        md: 'h-20 w-20',
        lg: 'h-28 w-28',
    }[size];

    // Generate avatar URL using dicebear
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;

    return (
        <div className="flex flex-col items-center">
            <div className="relative group cursor-pointer" onClick={refreshAvatar}>
                <Avatar className={`${sizeClass} border-2 border-gray-200 group-hover:border-primary transition-all`}>
                    <AvatarImage src={avatarUrl || '/placeholder.svg'} alt="Avatar" />
                    <AvatarFallback>...</AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black/30 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <RefreshCw className="text-white h-6 w-6" />
                </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Click to change</p>
        </div>
    );
}
