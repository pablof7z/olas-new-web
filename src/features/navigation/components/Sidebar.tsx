import { Button } from '@/components/ui/button';
import { shellExpandedAtom } from '@/features/app/stores/state';
import LoginComponent from '@/features/login/components/login-component';
import { useAtom } from 'jotai';
import { Moon, MoonIcon, PlusCircle, Sun } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import { PostEditorModal } from '../../post-editor/components/modal';
import { useTheme } from './ThemeProvider';

function OlasIcon() {
    // Simple, unique Olas SVG icon
    return (
        <svg width="32" height="32" viewBox="0 0 32 32" aria-label="Olas" fill="none">
            <circle cx="16" cy="16" r="16" fill="#0A0A23" />
            <path
                d="M8 20c2-4 6-8 8-8s6 4 8 8"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle cx="16" cy="16" r="4" fill="#fff" />
            <circle cx="16" cy="16" r="2" fill="#0A0A23" />
        </svg>
    );
}

function ToggleShellExpandedButton() {
    const [isExpanded, setIsExpanded] = useAtom(shellExpandedAtom);

    const handleClick = useCallback(() => {
        setIsExpanded(!isExpanded);
    }, [isExpanded]);

    return (
        <Button
            variant="ghost"
            size="icon"
            className="!p-0"
            aria-label={isExpanded ? 'Collapse shell' : 'Expand shell'}
            onClick={handleClick}
        >
            {isExpanded ? (
                <Sun className="!w-8 !h-8" strokeWidth={1.5} />
            ) : (
                <MoonIcon className="!w-8 !h-8" strokeWidth={1.5} />
            )}
        </Button>
    );
}

export function Sidebar() {
    const { theme, toggleTheme } = useTheme();
    const [isPostEditorOpen, setIsPostEditorOpen] = useState(false);

    return (
        <aside
            className="flex flex-col h-screen w-16 items-center justify-between py-4 fixed left-0 top-0 z-40"
            aria-label="Sidebar"
        >
            {/* Top: Olas Icon */}
            <div className="flex flex-col items-center gap-4 w-full">
                <div className="mb-2">
                    <OlasIcon />
                </div>
                {/* Explore section */}
                <Link
                    href="/"
                    className="flex items-center justify-center w-10 h-10 rounded hover:bg-muted transition-colors"
                    aria-label="Explore"
                >
                    {/* Compass icon */}
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" />
                        <polygon points="12,7 15,17 12,15 9,17" fill="currentColor" />
                    </svg>
                </Link>
                {/* New Post button */}
                <Button
                    variant="default"
                    aria-label="Create new post"
                    className="w-12 h-12"
                    tabIndex={0}
                    onClick={() => setIsPostEditorOpen(true)}
                >
                    <PlusCircle className="!w-8 !h-8 text-primary-foreground" strokeWidth={1.5} />
                </Button>
                <PostEditorModal isOpen={isPostEditorOpen} onOpenChange={setIsPostEditorOpen} />
                <Button
                    variant="ghost"
                    size="icon"
                    className="!p-0"
                    aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                    onClick={toggleTheme}
                >
                    {theme === 'dark' ? (
                        <Sun className="!w-8 !h-8" strokeWidth={1.5} />
                    ) : (
                        <MoonIcon className="!w-8 !h-8" strokeWidth={1.5} />
                    )}
                </Button>
                {/* <ToggleShellExpandedButton /> */}
            </div>
            {/* Bottom: Avatar (noop for now) */}
            <div className="mb-2">
                <LoginComponent />
            </div>
        </aside>
    );
}
