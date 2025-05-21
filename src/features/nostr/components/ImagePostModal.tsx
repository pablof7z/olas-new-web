'use client';

import { NDKEvent, NDKImage } from '@nostr-dev-kit/ndk';
import { useProfileValue } from '@nostr-dev-kit/ndk-hooks';
import { Heart, MessageCircle, Repeat2, Share2, X } from 'lucide-react';
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './ImagePostModal.module.css';
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
        <div className={styles.modalRoot} ref={modalRef} tabIndex={-1} aria-modal="true" role="dialog">
            <button className={styles.closeButton} aria-label="Close" onClick={onClose} type="button">
                <X size={24} />
            </button>
            <div className={styles.centeredImageContainer}>
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={event.content.substring(0, 100) || 'Nostr Image Post'}
                        className={styles.centeredImage}
                    />
                ) : (
                    <div style={{ color: '#fff', textAlign: 'center', padding: 24 }}>
                        Image not found or format not supported.
                    </div>
                )}
            </div>
            <aside className={styles.sidebar}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
                    <UserAvatar pubkey={event.pubkey} className="h-10 w-10" />
                    <div style={{ marginLeft: 12 }}>
                        <div
                            style={{
                                fontWeight: 600,
                                fontSize: 15,
                                lineHeight: 1.2,
                                marginBottom: 2,
                                color: '#fff',
                                maxWidth: 180,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}
                            title={authorProfile?.name || authorProfile?.displayName || event.pubkey}
                        >
                            {authorProfile?.name || authorProfile?.displayName || event.pubkey.substring(0, 10) + '...'}
                        </div>
                        {authorProfile?.nip05 && (
                            <div
                                style={{
                                    fontSize: 12,
                                    color: '#bdbdbd',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}
                                title={authorProfile.nip05}
                            >
                                {authorProfile.nip05}
                            </div>
                        )}
                    </div>
                </div>
                {event.content && (
                    <div style={{ fontSize: 15, marginBottom: 18, color: '#e0e0e0', wordBreak: 'break-word' }}>
                        {event.content}
                    </div>
                )}
                <div style={{ fontSize: 13, color: '#bdbdbd', marginBottom: 18 }}>{timestamp}</div>
                <div className={styles.interactions}>
                    <span className={styles.interactionIcon} title="Like">
                        <Heart size={18} strokeWidth={1.5} />
                        <span>0</span>
                    </span>
                    <span className={styles.interactionIcon} title="Comments">
                        <MessageCircle size={18} strokeWidth={1.5} />
                        <span>0</span>
                    </span>
                    <span className={styles.interactionIcon} title="Repost">
                        <Repeat2 size={18} strokeWidth={1.5} />
                        <span>0</span>
                    </span>
                    <span className={styles.interactionIcon} title="Share">
                        <Share2 size={18} strokeWidth={1.5} />
                    </span>
                </div>
                <div className={styles.commentsSection}>
                    <div style={{ fontWeight: 500, fontSize: 13, marginBottom: 8, color: '#bdbdbd' }}>Comments</div>
                    <div style={{ fontSize: 14, color: '#888', fontStyle: 'italic' }}>Comments will appear here.</div>
                </div>
                <form className={styles.addComment} onSubmit={(e) => e.preventDefault()}>
                    <input
                        type="text"
                        placeholder="Write a comment..."
                        aria-label="Write a comment"
                        autoComplete="off"
                    />
                    <button type="submit">Post</button>
                </form>
            </aside>
        </div>,
        typeof window !== 'undefined' ? document.body : (null as any)
    );
}
