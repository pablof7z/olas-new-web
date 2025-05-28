import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RelativeTimeDisplay } from '@/components/ui/RelativeTimeDisplay';
import { UserAvatar } from '@/features/nostr/components/UserAvatar';
import { NDKImage } from '@nostr-dev-kit/ndk';
import NDKBlossom from '@nostr-dev-kit/ndk-blossom';
import { useNDK, useNDKCurrentUser, useProfileValue } from '@nostr-dev-kit/ndk-hooks';
import { X } from 'lucide-react';
import * as React from 'react';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';

// Fallback: No popover/calendar components available, so use inline UI for scheduling

function formatDateTime(dt: Date) {
    // Format as "MMM D, YYYY HH:mm"
    return dt
        .toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        })
        .replace(',', '');
}

function getFutureDateTime(date: Date, time: string): Date {
    // time: "HH:MM"
    const [hoursRaw, minutesRaw] = time.split(':');
    const hours = Number(hoursRaw);
    const minutes = Number(minutesRaw);
    const result = new Date(date);
    if (isNaN(hours) || isNaN(minutes)) {
        // fallback: use current time
        return new Date();
    }
    result.setHours(hours, minutes, 0, 0);
    // If in the past, bump to 5 minutes from now or next day at selected time
    const now = new Date();
    if (result.getTime() <= now.getTime()) {
        if (
            result.toDateString() === now.toDateString() &&
            (hours > now.getHours() || (hours === now.getHours() && minutes > now.getMinutes()))
        ) {
            // Same day, but time is in the future
            return result;
        }
        // If today and time is in the past, bump to 5 minutes from now
        if (result.toDateString() === now.toDateString()) {
            const bump = new Date(now.getTime() + 5 * 60 * 1000);
            bump.setSeconds(0, 0);
            return bump;
        }
        // Otherwise, bump to next day at selected time
        const nextDay = new Date(now);
        nextDay.setDate(now.getDate() + 1);
        nextDay.setHours(hours, minutes, 0, 0);
        return nextDay;
    }
    return result;
}

export interface PostEditorRef {
    publishPost: () => Promise<void>;
    hasImages: () => boolean;
    getImageCount: () => number;
}

export interface PostEditorProps {
    onImageCountChange?: (count: number) => void;
}

export const PostEditor = forwardRef<PostEditorRef, PostEditorProps>(function PostEditor(props, ref) {
    const user = useNDKCurrentUser();
    const profile = useProfileValue(user?.pubkey);
    const { ndk } = useNDK();

    // Scheduling state
    const [scheduledAt, setScheduledAt] = useState<Date | null>(null);
    // For time input, keep as string "HH:MM"
    const [timeInput, setTimeInput] = useState(() => {
        const now = new Date();
        return now.toTimeString().slice(0, 5);
    });
    // For date input, keep as string "YYYY-MM-DD"
    const [dateInput, setDateInput] = useState(() => {
        const now = new Date();
        return now.toISOString().slice(0, 10);
    });
    const [showSchedule, setShowSchedule] = useState(false);

    // Image upload state
    const [images, setImages] = useState<string[]>([]);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Track previous image count to avoid unnecessary calls
    const prevImageCountRef = useRef<number>(0);

    // Uploading state for publish
    const [isUploading, setIsUploading] = useState(false);

    // Notify parent when image count changes
    React.useEffect(() => {
        if (props.onImageCountChange && images.length !== prevImageCountRef.current) {
            props.onImageCountChange(images.length);
            prevImageCountRef.current = images.length;
        }
    }, [images.length, props.onImageCountChange]);

    function handleRemoveImage(idx: number) {
        setImages((prev) => {
            const newImages = prev.filter((_, i) => i !== idx);
            return newImages;
        });
        setImageFiles((prev) => {
            const newFiles = prev.filter((_, i) => i !== idx);
            return newFiles;
        });
        setSelectedImageIndex((prevIdx) => {
            if (images.length === 1) return 0; // will be empty after removal
            if (idx < prevIdx) return prevIdx - 1;
            if (idx === prevIdx) {
                // If removing last image, select new last; else, keep at same index
                if (idx === images.length - 1) return Math.max(0, prevIdx - 1);
                return prevIdx;
            }
            return prevIdx;
        });
        // onImageCountChange will be triggered by useEffect on images.length change
    }

    // Caption state
    const [caption, setCaption] = useState('');

    function handleDateInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        setDateInput(e.target.value);
        const date = new Date(e.target.value + 'T' + timeInput);
        const now = new Date();
        // If selected date is in the past, default to today
        if (date.setHours(0, 0, 0, 0) < now.setHours(0, 0, 0, 0)) {
            const today = new Date();
            setDateInput(today.toISOString().slice(0, 10));
            setScheduledAt(getFutureDateTime(today, timeInput));
        } else {
            setScheduledAt(getFutureDateTime(date, timeInput));
        }
    }

    function handleTimeChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        setTimeInput(value);
        const date = new Date(dateInput + 'T' + value);
        setScheduledAt(getFutureDateTime(date, value));
    }

    function handleSetNow() {
        setScheduledAt(null);
        setShowSchedule(false);
        const now = new Date();
        setDateInput(now.toISOString().slice(0, 10));
        setTimeInput(now.toTimeString().slice(0, 5));
    }

    function SchedulingDisplay() {
        return (
            <span>
                <button
                    type="button"
                    className="text-xs text-muted-foreground hover:underline focus:outline-none"
                    aria-label="Set scheduled time"
                    onClick={() => setShowSchedule((v) => !v)}
                >
                    ·{' '}
                    {scheduledAt ? (
                        <span>
                            {formatDateTime(scheduledAt)} <RelativeTimeDisplay date={scheduledAt} className="ml-1" />
                        </span>
                    ) : (
                        'publishing now'
                    )}
                </button>
                {showSchedule && (
                    <div className="mt-2 p-2 border rounded bg-popover shadow-lg absolute z-50">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs text-muted-foreground">
                                Date:
                                <Input
                                    type="date"
                                    value={dateInput}
                                    onChange={handleDateInputChange}
                                    min={new Date().toISOString().slice(0, 10)}
                                    className="w-36 ml-2"
                                />
                            </label>
                            <label className="text-xs text-muted-foreground">
                                Time:
                                <Input
                                    type="time"
                                    value={timeInput}
                                    onChange={handleTimeChange}
                                    className="w-24 ml-2"
                                />
                            </label>
                            <div className="flex gap-2 mt-2">
                                <Button variant="default" onClick={() => setShowSchedule(false)}>
                                    Choose this time
                                </Button>
                                <Button variant={'outline'} onClick={handleSetNow}>
                                    Set to now
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </span>
        );
    }

    // Image upload handlers
    function handleFiles(files: FileList | null) {
        if (!files) return;
        const fileArr = Array.from(files).filter((file) => file.type.startsWith('image/'));
        if (fileArr.length === 0) return;
        // Read all files as data URLs
        Promise.all(
            fileArr.map(
                (file) =>
                    new Promise<string>((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = () => resolve(reader.result as string);
                        reader.onerror = reject;
                        reader.readAsDataURL(file);
                    })
            )
        ).then((dataUrls) => {
            setImages((prev) => {
                const newImages = [...prev, ...dataUrls];
                setSelectedImageIndex(prev.length); // select the first of the new images
                return newImages;
            });
            setImageFiles((prev) => [...prev, ...fileArr]);
            // onImageCountChange will be triggered by useEffect on images.length change
        });
    }

    function handleMainAreaClick() {
        fileInputRef.current?.click();
    }

    function handleMainAreaDrop(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        e.stopPropagation();
        handleFiles(e.dataTransfer.files);
    }

    function handleMainAreaDragOver(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        e.stopPropagation();
    }

    function handleFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        handleFiles(e.target.files);
        // Reset input so selecting the same file again works
        e.target.value = '';
    }

    function handleCarouselAddClick() {
        fileInputRef.current?.click();
    }

    function handleThumbnailClick(idx: number) {
        setSelectedImageIndex(idx);
    }

    // Expose publishPost via ref
    // Local publish handler for both button and imperative ref
    const handlePublish = async () => {
        if (!ndk) return;
        setIsUploading(true);
        try {
            let imetas: unknown[] = [];
            if (imageFiles.length > 0) {
                const blossom = new NDKBlossom(ndk);
                imetas = await Promise.all(
                    imageFiles.map((file) => blossom.upload(file, { fallbackServer: 'https://blossom.primal.net' }))
                );
            }
            const post = new NDKImage(ndk);
            post.content = caption;
            // @ts-expect-error: imetas is not yet typed in NDKImage
            post.imetas = imetas;
            if (scheduledAt) {
                post.created_at = Math.floor(scheduledAt.getTime() / 1000);
            }
            post.publish();
        } catch (err) {
            console.error('Image upload or publish failed', err);
        } finally {
            setIsUploading(false);
        }
    };

    useImperativeHandle(ref, () => ({
        publishPost: async () => {
            await handlePublish();
        },
        hasImages: () => images.length > 0,
        getImageCount: () => images.length,
    }));

    return (
        <div className="flex gap-3">
            <div>{user?.pubkey && <UserAvatar pubkey={user.pubkey} size="lg" />}</div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="font-medium truncate">
                        {profile?.displayName || profile?.name || user?.npub || 'Anonymous'}
                    </span>
                    <SchedulingDisplay />
                </div>

                {/* Main image upload/preview area */}
                <div
                    className="mt-2 w-full aspect-[16/9] rounded-lg bg-muted flex items-center justify-center border border-dashed border-border cursor-pointer transition hover:bg-muted/80 relative overflow-hidden"
                    tabIndex={0}
                    aria-label="Add main image"
                    onClick={handleMainAreaClick}
                    onDrop={handleMainAreaDrop}
                    onDragOver={handleMainAreaDragOver}
                >
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileInputChange}
                        tabIndex={-1}
                    />
                    {images.length === 0 ? (
                        <span className="text-muted-foreground text-sm select-none">
                            Drag & drop or click to add an image
                        </span>
                    ) : (
                        <img
                            src={images[selectedImageIndex]}
                            alt={`Selected upload ${selectedImageIndex + 1}`}
                            className="object-contain w-full h-full"
                        />
                    )}
                </div>

                {/* Image carousel with "+" button and thumbnails */}
                <div className="mt-3 flex items-center gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-neutral-300 min-h-[56px]">
                    {images.map((img, idx) => (
                        <div key={img} className="relative h-14 w-14 flex-shrink-0">
                            <button
                                type="button"
                                className={`h-14 w-14 rounded-lg border-2 ${
                                    idx === selectedImageIndex ? 'border-primary' : 'border-border'
                                } overflow-hidden focus:outline-none`}
                                aria-label={`Select image ${idx + 1}`}
                                onClick={() => handleThumbnailClick(idx)}
                            >
                                <img src={img} className="object-cover w-full h-full" />
                            </button>
                            <button
                                type="button"
                                aria-label="Remove image"
                                className="absolute top-0 right-0 m-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition z-10"
                                tabIndex={0}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveImage(idx);
                                }}
                            >
                                <X />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        className="flex items-center justify-center h-14 w-14 rounded-lg border-2 border-dashed border-border text-muted-foreground hover:bg-muted transition focus:outline-none"
                        aria-label="Add more pictures"
                        onClick={handleCarouselAddClick}
                    >
                        <svg width="28" height="28" fill="none" viewBox="0 0 28 28">
                            <circle cx="14" cy="14" r="13" stroke="currentColor" strokeWidth="2" />
                            <path d="M14 9v10M9 14h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                {/* Caption input */}
                <div className="mt-4">
                    <textarea
                        placeholder="Write a caption..."
                        className="w-full bg-transparent outline-none text-base placeholder:text-muted-foreground border-0 focus:ring-0 p-0 min-h-[80px]"
                        maxLength={300}
                        aria-label="Post caption"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                    />
                </div>
            </div>
            {/* Publish button */}
            <div className="flex justify-end mt-4">
                <Button
                    type="button"
                    onClick={async () => {
                        if (!isUploading) {
                            await handlePublish();
                        }
                    }}
                    disabled={isUploading}
                >
                    {isUploading ? (
                        <span>
                            <svg
                                className="inline mr-2 animate-spin"
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                            >
                                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2" opacity="0.25" />
                                <path
                                    d="M15 8A7 7 0 1 1 8 1"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            </svg>
                            Uploading...
                        </span>
                    ) : (
                        'Publish'
                    )}
                </Button>
            </div>
        </div>
    );
});
