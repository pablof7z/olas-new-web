import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { NDKEvent } from '@nostr-dev-kit/ndk';
import { useNDK } from '@nostr-dev-kit/ndk-hooks';
import * as React from 'react';

export interface CommentInputProps {
    event: NDKEvent;
}

export function CommentInput({ event }: CommentInputProps) {
    const { ndk } = useNDK();
    const [comment, setComment] = React.useState('');

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        setComment(e.target.value);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!comment.trim()) return;
        const commentEvent = event.reply();
        commentEvent.content = comment;
        commentEvent.publish();
        setComment('');
    }

    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full mt-2" autoComplete="off">
            <Input
                type="text"
                value={comment}
                onChange={handleInputChange}
                placeholder="Write a comment…"
                className="flex-1"
                maxLength={500}
                aria-label="Write a comment"
            />
            <Button type="submit" variant="default" size="sm" disabled={!comment.trim()} className="shrink-0">
                Post
            </Button>
        </form>
    );
}
