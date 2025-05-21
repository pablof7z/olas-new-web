import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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

export function Sidebar() {
    return (
        <aside
            className="flex flex-col h-screen w-16 bg-background border-r items-center justify-between py-4 fixed left-0 top-0 z-40"
            aria-label="Sidebar"
        >
            {/* Top: Olas Icon */}
            <div className="flex flex-col items-center gap-4">
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
                {/* New Post button (noop) */}
                <Button variant="ghost" size="icon" className="w-10 h-10" aria-label="Create new post" tabIndex={0}>
                    {/* Plus icon */}
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" />
                        <line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" />
                        <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" />
                    </svg>
                </Button>
            </div>
            {/* Bottom: Avatar (noop for now) */}
            <div className="mb-2">
                <Button variant="ghost" size="icon" className="w-10 h-10" aria-label="Sign in / Sign up">
                    <Avatar>
                        {/* Placeholder avatar */}
                        <svg
                            width="24"
                            height="24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            aria-hidden="true"
                        >
                            <circle cx="12" cy="8" r="4" stroke="currentColor" />
                            <path d="M4 20c0-4 16-4 16 0" stroke="currentColor" />
                        </svg>
                    </Avatar>
                </Button>
            </div>
        </aside>
    );
}
