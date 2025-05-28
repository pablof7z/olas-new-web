import { formatDistanceToNow, isValid, parseISO } from 'date-fns';
import React, { useEffect, useState } from 'react';

export interface RelativeTimeDisplayProps {
    date: Date | string;
    className?: string;
}

/**
 * Displays a human-readable relative time (e.g., "in 2 hours", "3 days ago") for a given date.
 * Updates automatically as time passes.
 */
export function RelativeTimeDisplay({ date, className }: RelativeTimeDisplayProps) {
    // Parse the date prop to a Date object
    const parsedDate =
        typeof date === 'string'
            ? isValid(new Date(date))
                ? new Date(date)
                : isValid(parseISO(date))
                  ? parseISO(date)
                  : null
            : date;

    const getRelative = () =>
        parsedDate && isValid(parsedDate) ? formatDistanceToNow(parsedDate, { addSuffix: true }) : '';

    const [relative, setRelative] = useState(getRelative);

    useEffect(() => {
        setRelative(getRelative());
        if (!parsedDate || !isValid(parsedDate)) return;

        // Update every minute for most cases, every second if less than 1 minute away
        const msToNext = Math.abs(Date.now() - parsedDate.getTime()) < 60 * 1000 ? 1000 : 60 * 1000;

        const interval = setInterval(() => {
            setRelative(getRelative());
        }, msToNext);

        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [date]);

    if (!parsedDate || !isValid(parsedDate)) return null;

    return <span className={className}>{relative}</span>;
}
