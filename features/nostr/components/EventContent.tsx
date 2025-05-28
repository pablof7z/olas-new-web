import React from 'react';

export interface EventContentProps {
    content: string;
    className?: string;
}

export function EventContent({ content, className }: EventContentProps) {
    // Regex to match hashtags (words starting with #, not preceded by a word character)
    const hashtagRegex = /(^|\s)(#\w+)/g;

    // Split and map content to render hashtags as links
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    const regex = new RegExp(hashtagRegex);

    while ((match = regex.exec(content)) !== null) {
        const [fullMatch, pre, hashtag] = match;
        const start = match.index;
        const end = regex.lastIndex;

        // Push text before hashtag
        if (start > lastIndex) {
            parts.push(content.slice(lastIndex, start));
        }
        // Push pre (space or start of line)
        if (pre) parts.push(pre);

        // Push hashtag as link, only if hashtag is defined
        if (hashtag) {
            parts.push(
                <a
                    key={start}
                    href={`/search?q=${encodeURIComponent(hashtag)}`}
                    className="!text-indigo-600 font-medium hover:underline"
                >
                    {hashtag}
                </a>
            );
        }
        lastIndex = end;
    }
    // Push remaining text
    if (lastIndex < content.length) {
        parts.push(content.slice(lastIndex));
    }

    return <span className={className}>{parts}</span>;
}
