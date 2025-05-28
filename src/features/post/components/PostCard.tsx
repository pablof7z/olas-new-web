import { UserAvatar } from '@/features/nostr/components/UserAvatar';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import type { NDKEvent, NDKImage } from '@nostr-dev-kit/ndk';
import { useProfileValue } from '@nostr-dev-kit/ndk-hooks';
import { EventContent } from 'features/nostr/components/EventContent';
import Link from 'next/link';
import * as React from 'react';

interface PostCardProps {
    event: NDKImage;
    onClick?: (event: NDKEvent) => void;
}

function formatTimestamp(ts: number): string {
    const now = Date.now() / 1000;
    const diff = now - ts;
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    const date = new Date(ts * 1000);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

interface ImageCarouselProps {
    imetas: { url?: string }[];
    onClick?: (event: NDKEvent) => void;
}

function ImageCarousel({ imetas, onClick }: ImageCarouselProps) {
    const [activeIdx, setActiveIdx] = React.useState(0);

    // Only show valid images, and assert url is always present
    const images = imetas.filter((meta): meta is { url: string } => !!meta.url);

    if (images.length === 0) return null;

    return (
        <div className="mt-2 flex flex-col items-center">
            <div className="relative w-full flex justify-center">
                <button
                    className="absolute top-0 left-0 w-full h-full bg-black/40 hover:bg-black/70 transition"
                    onClick={() => onClick?.(images[activeIdx])}
                    type="button"
                    aria-label={`Open image ${activeIdx + 1}`}
                >
                    <img
                        src={images[activeIdx]!.url}
                        alt={`Post image ${activeIdx + 1}`}
                        className="rounded-lg max-h-[800px] w-full object-cover transition-all duration-300 shadow-lg"
                        style={{ aspectRatio: '16/9', objectFit: 'cover' }}
                    />
                </button>
                {images.length > 1 && (
                    <>
                        <button
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full p-1.5 shadow transition disabled:opacity-30"
                            onClick={() => setActiveIdx((idx) => Math.max(0, idx - 1))}
                            disabled={activeIdx === 0}
                            aria-label="Previous image"
                            type="button"
                        >
                            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path
                                    d="M15 19l-7-7 7-7"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                        <button
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full p-1.5 shadow transition disabled:opacity-30"
                            onClick={() => setActiveIdx((idx) => Math.min(images.length - 1, idx + 1))}
                            disabled={activeIdx === images.length - 1}
                            aria-label="Next image"
                            type="button"
                        >
                            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path
                                    d="M9 5l7 7-7 7"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    </>
                )}
            </div>
            {images.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-neutral-300">
                    {images.map((img, idx) => (
                        <button
                            key={img.url + idx}
                            className={`border-2 rounded-lg transition-all duration-200 focus:outline-none ${
                                idx === activeIdx
                                    ? 'border-primary shadow-lg scale-105'
                                    : 'border-transparent opacity-70 hover:opacity-100'
                            }`}
                            style={{ padding: 0, background: 'none' }}
                            onClick={() => setActiveIdx(idx)}
                            aria-label={`Show image ${idx + 1}`}
                            type="button"
                        >
                            <img
                                src={img.url}
                                alt={`Thumbnail ${idx + 1}`}
                                className="h-14 w-20 object-cover rounded-lg"
                                style={{
                                    boxShadow: idx === activeIdx ? '0 0 0 2px var(--primary)' : undefined,
                                    border: idx === activeIdx ? '2px solid var(--primary)' : undefined,
                                }}
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export function PostCard({ event, onClick }: PostCardProps) {
    const user = event.author;
    const pubkey = event.pubkey;
    const profile = useProfileValue(pubkey);

    return (
        <div className="flex gap-3 pt-4 pb-3 px-4 border-b border-border">
            <Link href={`/p/${user.npub}`}>
                <UserAvatar pubkey={pubkey} size="lg" />
            </Link>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="font-medium truncate">{profile?.displayName || profile?.name || user?.npub}</span>
                    <span className="text-xs text-muted-foreground">· {formatTimestamp(event.created_at)}</span>
                </div>

                {event.imetas?.length > 1 ? (
                    <ImageCarousel imetas={event.imetas} onClick={() => onClick?.(event)} />
                ) : event.imetas?.[0]?.url ? (
                    <button className="mt-2" onClick={() => onClick?.(event)} type="button">
                        <img
                            src={event.imetas[0].url}
                            alt="Post image"
                            className="rounded-lg max-h-[800px] w-full object-cover"
                        />
                    </button>
                ) : null}

                <div className="mt-4 whitespace-pre-line break-words">
                    <EventContent content={event.content} />
                </div>

                <div className="flex gap-4 mt-3 text-muted-foreground text-xs">
                    <button className="hover:text-primary transition-colors" title="Reply" type="button">
                        <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
                            <path
                                d="M7 15l-5-5 5-5v3h4a4 4 0 014 4v1"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                    <button className="hover:text-primary transition-colors" title="Repost" type="button">
                        <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
                            <path
                                d="M15 13v-2a4 4 0 00-4-4H3m0 0l3-3m-3 3l3 3"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                    <button className="hover:text-primary transition-colors" title="Like" type="button">
                        <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
                            <path
                                d="M9 15s-5-3.33-5-7.5A3.5 3.5 0 019 4a3.5 3.5 0 015 3.5C14 11.67 9 15 9 15z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                    <button className="hover:text-primary transition-colors" title="Zap" type="button">
                        <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
                            <path
                                d="M10 2L4 10h4l-2 6 6-8h-4l2-6z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
