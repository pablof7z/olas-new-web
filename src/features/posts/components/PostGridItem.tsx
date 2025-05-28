'use client';

import { ImagePostModal } from '@/features/nostr/components/ImagePostModal';
import { UserAvatar } from '@/features/nostr/components/UserAvatar';
import { cn } from '@/lib/utils';
import { NDKEvent } from '@nostr-dev-kit/ndk';
// Subcomponent to render author name using profile
import { useProfileValue } from '@nostr-dev-kit/ndk-hooks';
import React, { useState } from 'react';

// Helper to extract image URL from event (mirrors ImagePostModal logic)
function getImageUrlFromEvent(event: NDKEvent): string | undefined {
    // Safely check for imetas property (NDKImage)
    if ('imetas' in event && Array.isArray((event as any).imetas) && (event as any).imetas[0]?.url) {
        return (event as any).imetas[0].url;
    }
    let imageUrl = event.tags.find((tag: string[]) => tag[0] === 'image')?.[1];
    if (imageUrl) return imageUrl;
    imageUrl = event.tags.find((tag: string[]) => tag[0] === 'url')?.[1];
    if (imageUrl) {
        const mimeType = event.tags.find((tag: string[]) => tag[0] === 'm')?.[1];
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

interface PostGridItemProps {
    event: NDKEvent;
    className?: string;
    width?: number;
    height?: number;
    sizes?: string;
    onClick?: () => void;
}

export function PostGridItem({ event, className, width, height, sizes, onClick }: PostGridItemProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const imageUrl = getImageUrlFromEvent(event);
    const authorPubkey = event.pubkey;
    const description = event.content;

    // Author name: prefer profile.name, fallback to pubkey substring
    // We'll use UserAvatar for avatar, and optionally display name if available
    // For now, we can only get name via UserAvatar's useProfileValue, so we can render it in overlay as well
    return (
        <img
            src={imageUrl}
            alt={description?.slice(0, 100) || 'Nostr Image Post'}
            className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-105 cursor-pointer"
            width={width}
            height={height}
            sizes={sizes}
            loading="lazy"
            decoding="async"
            draggable={false}
            onClick={onClick}
        />
    );

    return (
        <>
            <div
                className={cn(
                    'relative aspect-square cursor-pointer overflow-hidden group transition-shadow duration-200',
                    className
                )}
                style={{ width, height }}
                tabIndex={0}
                role="button"
                aria-label="Open post"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onFocus={() => setIsHovered(true)}
                onBlur={() => setIsHovered(false)}
                onClick={() => setIsModalOpen(true)}
            >
                {imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={imageUrl}
                        alt={description?.slice(0, 100) || 'Nostr Image Post'}
                        className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-105"
                        sizes={sizes}
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-full bg-muted text-muted-foreground">
                        Image not found
                    </div>
                )}

                {/* Overlay on hover/focus */}
                <div
                    className={cn(
                        'absolute inset-0 flex flex-col justify-end p-4 opacity-0 pointer-events-none group-hover:opacity-100 group-focus:opacity-100 group-hover:pointer-events-auto group-focus:pointer-events-auto transition-opacity duration-200',
                        'bg-gradient-to-t from-black/80 via-black/40 to-transparent'
                    )}
                    aria-hidden={!isHovered}
                >
                    <div className="flex items-center gap-3 mb-2">
                        <UserAvatar pubkey={authorPubkey} size="sm" className="border border-white/30 shadow" />
                        <AuthorName pubkey={authorPubkey} />
                    </div>
                    {description && (
                        <div className="text-sm text-white font-medium line-clamp-3 drop-shadow">{description}</div>
                    )}
                </div>
            </div>
            {isModalOpen && <ImagePostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} event={event} />}
        </>
    );
}

function AuthorName({ pubkey }: { pubkey: string }) {
    const profile = useProfileValue(pubkey);
    return (
        <span className="text-white font-semibold text-base drop-shadow" title={profile?.name || pubkey}>
            {profile?.name || profile?.displayName || pubkey.substring(0, 10) + '...'}
        </span>
    );
}
