import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useProfileValue, useSubscribe } from '@nostr-dev-kit/ndk-hooks';
import { Bubbles, MessageCircle } from 'lucide-react';
import { UserAvatar } from './UserAvatar';

interface CommentCardProps {
    commentEvent: NDKEvent;
}

export function CommentCard({ commentEvent }: CommentCardProps) {
    // Author profile
    const pubkey = commentEvent.pubkey;
    const profile = useProfileValue(pubkey);

    // Replies to this comment
    const { events: replies } = useSubscribe([{ kinds: [1111], ...commentEvent.filter() }], undefined, [
        commentEvent.id,
    ]);

    // Format timestamp
    const createdAt = commentEvent.created_at ? new Date(commentEvent.created_at * 1000).toLocaleString() : '';

    // Display name: prefer profile.displayName, then profile.nip05, then pubkey
    const displayName = profile?.displayName || profile?.nip05 || profile?.name || pubkey.substring(0, 8);

    return (
        <div className="flex flex-col gap-2 border-b border-muted w-full py-3">
            <div className="flex flex-row items-start gap-3 w-full">
                <UserAvatar pubkey={pubkey} size="sm" />
                <div className="flex flex-col items-start gap-3 flex-1">
                    <div className="flex items-center justify-stretch flex-1 w-full gap-3">
                        <div className="flex flex-row gap-2 items-end">
                            <span className="font-semibold text-sm text-foreground">{displayName}</span>
                        </div>
                        <span className="ml-auto text-xs text-muted-foreground">{createdAt}</span>
                    </div>
                    <p className="text-sm text-foreground break-words">{commentEvent.content}</p>

                    <div>
                        <span
                            className="
                                flex items-center gap-1.5 text-[16px] cursor-pointer opacity-85
                                transition-colors duration-150 hover:opacity-100
                            "
                            title="Comments"
                        >
                            <MessageCircle size={18} strokeWidth={1.5} />
                            {replies.length > 0 && (
                                <span className="text-xs text-muted-foreground">{replies.length}</span>
                            )}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
