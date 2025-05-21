'use client';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { UserAvatar } from '@/features/nostr/components/UserAvatar';
import { useProfileValue } from '@nostr-dev-kit/ndk-hooks';

interface SessionItemProps {
    pubkey: string;
    onClick: (pubkey: string) => void;
    isActive?: boolean;
}

export default function SessionItem({ pubkey, onClick, isActive = false }: SessionItemProps) {
    const profile = useProfileValue(pubkey);

    // Get display name from profile or pubkey
    const getDisplayName = () => {
        return profile?.displayName || profile?.name || pubkey.substring(0, 10) + '...';
    };

    return (
        <DropdownMenuItem onClick={() => onClick(pubkey)} className="cursor-pointer py-2">
            <div className="flex items-center w-full">
                <UserAvatar pubkey={pubkey} size="sm" className="mr-2" />
                <span className="text-sm truncate flex-1">{getDisplayName()}</span>
                {isActive && <span className="ml-2 h-2 w-2 rounded-full bg-green-500" />}
            </div>
        </DropdownMenuItem>
    );
}
