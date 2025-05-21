'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { NDKEvent, NDKImage } from '@nostr-dev-kit/ndk';
import { useProfileValue } from '@nostr-dev-kit/ndk-hooks';
import { X } from 'lucide-react';
import React from 'react';
import { UserAvatar } from './UserAvatar';

interface ImagePostModalProps {
    isOpen: boolean;
    onClose: () => void;
    event: NDKEvent;
}

// Helper function to extract image URL from event
function getImageUrlFromEvent(event: NDKEvent): string | undefined {
    if (event instanceof NDKImage) {
        return event.imetas?.[0].url;
    }

    // 1. Check 'image' tag
    let imageUrl = event.tags.find((tag) => tag[0] === 'image')?.[1];
    if (imageUrl) return imageUrl;

    // 2. Check 'url' tag (often used in kind 1063 for file metadata)
    imageUrl = event.tags.find((tag) => tag[0] === 'url')?.[1];
    if (imageUrl) {
        const mimeType = event.tags.find((tag) => tag[0] === 'm')?.[1];
        if (mimeType?.startsWith('image/') || /\.(jpeg|jpg|gif|png|webp)$/i.test(imageUrl)) {
            return imageUrl;
        }
    }

    // 3. Check for markdown image in content (e.g., ![alt](url))
    const markdownMatch = event.content.match(/!\[.*?\]\((.*?)\)/);
    if (markdownMatch && markdownMatch[1]) return markdownMatch[1];

    // 4. Check for direct image URL in content
    const urlRegex = /(https?:\/\/[^\s]+\.(?:png|jpg|jpeg|gif|webp))/gi;
    const contentMatch = event.content.match(urlRegex);
    if (contentMatch && contentMatch[0]) return contentMatch[0];

    return undefined;
}

export function ImagePostModal({ isOpen, onClose, event }: ImagePostModalProps) {
    const authorProfile = useProfileValue(event.pubkey);
    const imageUrl = getImageUrlFromEvent(event);
    const timestamp = event.created_at ? new Date(event.created_at * 1000).toLocaleString() : 'N/A';

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(openStatus: boolean) => {
                if (!openStatus) onClose();
            }}
        >
            <DialogContent className="max-w-4xl w-[90vw] md:w-full h-[80vh] p-0 flex flex-col sm:flex-row overflow-hidden">
                <DialogClose asChild className="absolute top-2 right-2 z-50">
                    <Button variant="ghost" size="icon" aria-label="Close">
                        <X className="h-5 w-5" />
                    </Button>
                </DialogClose>

                {/* Left Side: Image */}
                <div className="w-full sm:w-[60%] md:w-2/3 h-1/2 sm:h-full bg-black flex items-center justify-center overflow-hidden">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={event.content.substring(0, 100) || 'Nostr Image Post'}
                            className="max-h-full max-w-full object-contain"
                        />
                    ) : (
                        <div className="text-white p-4 text-center">Image not found or format not supported.</div>
                    )}
                </div>

                {/* Right Side: Post Details */}
                <div className="w-full sm:w-[40%] md:w-1/3 h-1/2 sm:h-full flex flex-col p-4 md:p-6 overflow-y-auto border-t sm:border-t-0 sm:border-l border-border">
                    {/* Author Info */}
                    <div className="flex items-center mb-4 flex-shrink-0">
                        <UserAvatar pubkey={event.pubkey} className="h-10 w-10 mr-3" />
                        <div>
                            <p
                                className="font-semibold text-sm truncate"
                                title={authorProfile?.name || authorProfile?.displayName || event.pubkey}
                            >
                                {authorProfile?.name ||
                                    authorProfile?.displayName ||
                                    event.pubkey.substring(0, 10) + '...'}
                            </p>
                            {authorProfile?.nip05 && (
                                <p className="text-xs text-muted-foreground truncate" title={authorProfile.nip05}>
                                    {authorProfile.nip05}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Post Content */}
                    {event.content && (
                        <p className="text-sm mb-4 whitespace-pre-wrap break-words flex-shrink-0">{event.content}</p>
                    )}

                    {/* Timestamp */}
                    <p className="text-xs text-muted-foreground mb-6 flex-shrink-0">{timestamp}</p>

                    {/* Interactions (Placeholder) */}
                    <div className="mb-6 flex-shrink-0">
                        <h3 className="text-xs font-medium text-muted-foreground mb-1">INTERACTIONS</h3>
                        <div className="flex space-x-4 text-xs">
                            <span>Likes: N/A</span>
                            <span>Comments: N/A</span>
                        </div>
                    </div>

                    {/* Comments Section (Placeholder) */}
                    <div className="flex-grow mb-4 border-t pt-4 mt-4 border-border">
                        <h3 className="text-xs font-medium text-muted-foreground mb-2">COMMENTS</h3>
                        <div className="text-sm text-muted-foreground italic">Comments will appear here.</div>
                    </div>

                    {/* Add Comment Input (Placeholder) */}
                    <div className="mt-auto pt-4 border-t border-border flex-shrink-0">
                        <div className="flex space-x-2">
                            <Input type="text" placeholder="Write a comment..." className="flex-grow" />
                            <Button size="sm">Post</Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
