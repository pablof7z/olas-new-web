'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    useAvailableSessions,
    useNDK,
    useNDKCurrentPubkey,
    useNDKSessionLogout,
    useNDKSessionSwitch,
    useProfileValue,
} from '@nostr-dev-kit/ndk-hooks';
import { LogOut, PersonStanding, UserPlus } from 'lucide-react';
import { useState } from 'react';
import LoginModal from './login-modal';
import SessionItem from './session-item';

export default function LoginComponent() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const currentPubkey = useNDKCurrentPubkey();
    const availableSessions = useAvailableSessions();
    const logout = useNDKSessionLogout();
    const switchSession = useNDKSessionSwitch();
    const { ndk } = useNDK();

    // Get profile for current pubkey
    const currentProfile = useProfileValue(currentPubkey);

    // Function to get initials from the current profile
    const getInitials = () => {
        if (currentProfile?.name) {
            return currentProfile.name.charAt(0).toUpperCase();
        }
        return currentPubkey?.substring(0, 2) || '?';
    };

    // Function to get display name from the current profile
    const getDisplayName = () => {
        return currentProfile?.displayName || currentProfile?.name || currentPubkey?.substring(0, 10) + '...';
    };

    const handleLogout = () => {
        if (currentPubkey && ndk) {
            logout(currentPubkey);
        }
    };

    const handleSwitchSession = (pubkey: string) => {
        if (pubkey !== currentPubkey) {
            switchSession(pubkey);
        }
    };

    return (
        <div className="relative">
            {currentPubkey ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Avatar className="h-10 w-10 cursor-pointer border-2 border-primary/10 hover:border-primary/30 transition-all">
                            <AvatarImage
                                src={currentProfile?.image || '/placeholder.svg'}
                                alt={currentProfile?.name || 'User'}
                            />
                            <AvatarFallback className="bg-primary text-primary-foreground">
                                {getInitials()}
                            </AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64">
                        {/* Current active session */}
                        <div className="flex items-center p-2">
                            <Avatar className="h-8 w-8 mr-2">
                                <AvatarImage
                                    src={currentProfile?.picture || '/placeholder.svg'}
                                    alt={currentProfile?.name || 'User'}
                                />
                                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                    {getInitials()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">{getDisplayName()}</span>
                                <span className="text-xs text-muted-foreground">Active session</span>
                            </div>
                        </div>

                        <DropdownMenuSeparator />

                        {/* Other available sessions */}
                        {availableSessions.length > 1 && (
                            <>
                                <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
                                    Switch Account
                                </DropdownMenuLabel>
                                <DropdownMenuGroup>
                                    {availableSessions
                                        .filter((pubkey) => pubkey !== currentPubkey)
                                        .map((pubkey) => (
                                            <SessionItem key={pubkey} pubkey={pubkey} onClick={handleSwitchSession} />
                                        ))}
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                            </>
                        )}

                        {/* Actions */}
                        <DropdownMenuItem onClick={() => setIsModalOpen(true)} className="cursor-pointer">
                            <UserPlus className="mr-2 h-4 w-4" />
                            <span>Add another session</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={handleLogout}
                            className="cursor-pointer text-red-500 focus:text-red-500"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Logout</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <Button size="icon" className="!p-0" variant="ghost" onClick={() => setIsModalOpen(true)}>
                    <PersonStanding className="h-8 w-8" />
                </Button>
            )}

            <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}
