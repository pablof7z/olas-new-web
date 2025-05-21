'use client';

import { Input } from '@/components/ui/input';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';

interface UsernameInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    id?: string;
}

export default function UsernameInput({
    value,
    onChange,
    placeholder = 'username',
    id = 'username',
}: UsernameInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [cursorPosition, setCursorPosition] = useState<number | null>(null);

    // Handle input change and remove spaces
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value.replace(/\s+/g, '');
        onChange(newValue);

        // Save cursor position for later restoration
        if (inputRef.current) {
            setCursorPosition(inputRef.current.selectionStart);
        }
    };

    // Restore cursor position after value change
    useEffect(() => {
        if (inputRef.current && cursorPosition !== null) {
            inputRef.current.selectionStart = cursorPosition;
            inputRef.current.selectionEnd = cursorPosition;
            setCursorPosition(null);
        }
    }, [value, cursorPosition]);

    return (
        <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">@</span>
            <Input
                ref={inputRef}
                id={id}
                value={value}
                onChange={handleChange}
                className="pl-7"
                placeholder={placeholder}
            />
        </div>
    );
}
