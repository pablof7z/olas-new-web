'use client';

import { CommentInput } from '@/features/comment-input/components/CommentInput';
import { NDKEvent, NDKImage } from '@nostr-dev-kit/ndk';
import { useProfileValue, useSubscribe } from '@nostr-dev-kit/ndk-hooks';
import { EventContent } from 'features/nostr/components/EventContent';
import { Heart, MessageCircle, Repeat2, Share2, X } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { CommentCard } from './CommentCard';
import { UserAvatar } from './UserAvatar';

interface ImagePostModalProps {
    isOpen: boolean;
    onClose: () => void;
    event: NDKEvent;
}

function getImageUrlFromEvent(event: NDKEvent): string | undefined {
    if (event instanceof NDKImage && event.imetas && event.imetas[0] && event.imetas[0].url) {
        return event.imetas[0].url;
    }
    let imageUrl = event.tags.find((tag) => tag[0] === 'image')?.[1];
    if (imageUrl) return imageUrl;
    imageUrl = event.tags.find((tag) => tag[0] === 'url')?.[1];
    if (imageUrl) {
        const mimeType = event.tags.find((tag) => tag[0] === 'm')?.[1];
        if (mimeType?.startsWith('image/') || /\.(jpeg|jpg|gif|png|webp)$/i.test(imageUrl)) {
            return imageUrl;
        }
    }
    const markdownMatch = event.content.match(/!\[.*?\]\((.*?)\)/);
    if (markdownMatch && markdownMatch[1]) return markdownMatch[1];
    const urlRegex = /(https?:\/\/[^\s]+\.(?:png|jpg|jpeg|gif|webp))/gi;
    const contentMatch = event.content.match(urlRegex);
    if (contentMatch && contentMatch[0]) return contentMatch[0];
    return undefined;
}

export function ImagePostModal({ isOpen, onClose, event }: ImagePostModalProps) {
    const authorProfile = useProfileValue(event.pubkey);
    const imageUrl = getImageUrlFromEvent(event);
    const timestamp = event.created_at ? new Date(event.created_at * 1000).toLocaleString() : 'N/A';
    const modalRef = useRef<HTMLDivElement>(null);

    // Fetch top-level comments for this event
    const { events: commentEvents } = useSubscribe([{ kinds: [1, 1111], ...event.filter() }], undefined, [event.id]);

    // Trap focus and close on ESC
    useEffect(() => {
        if (!isOpen) return;
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape') onClose();
        }
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // Prevent background scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return createPortal(
        <div
            className="
                fixed inset-0 z-[1000] flex flex-row justify-center items-center
                bg-[rgba(18,18,20,0.92)] font-sans overscroll-contain
            "
            ref={modalRef}
            tabIndex={-1}
            aria-modal="true"
            role="dialog"
        >
            <button
                className="
                    absolute top-6 right-8 bg-none border-none text-foreground opacity-70 cursor-pointer z-[1100]
                    p-2 rounded-full transition-colors duration-150 hover:bg-foreground/10 hover:opacity-100
                    md:top-3 md:right-4
                "
                aria-label="Close"
                onClick={onClose}
                type="button"
            >
                <X size={24} />
            </button>
            <div
                className="
                    flex-1 min-w-0 min-h-0 flex items-center justify-center h-screen w-screen
                    md:max-w-full md:max-h-[60vh] md:h-[60vh]
                "
            >
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={event.content.substring(0, 100) || 'Nostr Image Post'}
                        className="max-w-full max-h-[90vh] object-contain bg-transparent shadow-none"
                    />
                ) : (
                    <div className="text-white text-center p-6">Image not found or format not supported.</div>
                )}
            </div>
            <aside
                className="
                    w-[400px] max-w-full h-screen bg-background text-foreground
                    flex flex-col border-l border-l-border
                    pt-8 pb-6 box-border overflow-y-auto text-[15px] font-inherit
                    lg:border-l-0 lg:border-t lg:border-t-border
                    lg:pt-5 lg:pb-3 lg:text-[14px]
                    p-4
                "
            >
                <Link className="flex items-center mb-4.5" href={`/p/${event.author.npub}`} onClick={onClose}>
                    <UserAvatar pubkey={event.pubkey} className="h-10 w-10" />
                    <div className="ml-3">
                        <div
                            className="
                                font-semibold text-[15px] leading-[1.2] mb-0.5 max-w-[180px]
                                overflow-hidden text-ellipsis whitespace-nowrap
                            "
                            title={authorProfile?.name || authorProfile?.displayName || event.pubkey}
                        >
                            {authorProfile?.name || authorProfile?.displayName || event.pubkey.substring(0, 10) + '...'}
                        </div>
                        {authorProfile?.nip05 && (
                            <div
                                className="
                                    text-xs overflow-hidden text-ellipsis whitespace-nowrap
                                    text-muted-foreground
                                "
                                title={authorProfile.nip05}
                            >
                                {authorProfile.nip05}
                            </div>
                        )}
                    </div>
                </Link>
                <div className="text-lg mb-4.5 break-words">
                    <EventContent content={event.content} />
                </div>
                <div className="text-[13px] mb-4.5">{timestamp}</div>
                <div className="flex gap-5 mb-4.5 items-center border-y border-muted py-3 -mx-4 px-4">
                    <span
                        className="
                            flex items-center gap-1.5 text-[16px] cursor-pointer opacity-85
                            transition-colors duration-150 hover:opacity-100
                        "
                        title="Like"
                    >
                        <Heart size={18} strokeWidth={1.5} />
                        <span>0</span>
                    </span>
                    <span
                        className="
                            flex items-center gap-1.5 text-[16px] cursor-pointer opacity-85
                            transition-colors duration-150 hover:opacity-100
                        "
                        title="Comments"
                    >
                        <MessageCircle size={18} strokeWidth={1.5} />
                        <span>0</span>
                    </span>
                    <span
                        className="
                            flex items-center gap-1.5 text-[16px] cursor-pointer opacity-85
                            transition-colors duration-150 hover:opacity-100
                        "
                        title="Repost"
                    >
                        <Repeat2 size={18} strokeWidth={1.5} />
                        <span>0</span>
                    </span>
                    <span
                        className="
                            flex items-center gap-1.5 text-[16px] cursor-pointer opacity-85
                            transition-colors duration-150 hover:opacity-100
                        "
                        title="Share"
                    >
                        <Share2 size={18} strokeWidth={1.5} />
                    </span>
                </div>
                <div className="flex-1 overflow-y-auto mb-4.5 pr-0.5 rounded-none">
                    <div className="font-medium text-[13px] mb-2 text-muted-foreground">Comments</div>
                    {commentEvents.length === 0 ? (
                        <div className="text-sm text-muted-foreground italic">No comments yet.</div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {commentEvents.map((commentEvent) => (
                                <CommentCard key={commentEvent.id} commentEvent={commentEvent} />
                            ))}
                        </div>
                    )}
                </div>
                <div className="mt-2">
                    <CommentInput event={event} />
                </div>
            </aside>
        </div>,
        typeof window !== 'undefined' ? document.body : (null as any)
    );
}
