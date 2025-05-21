import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import LoginComponent from '@/features/login/components/login-component';
import Link from 'next/link';
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

export function Sidebar() {
    const { theme, toggleTheme } = useTheme();

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
                {/* Theme toggle button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="w-10 h-10"
                    aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                    onClick={toggleTheme}
                >
                    {theme === 'dark' ? (
                        // Sun icon
                        <svg
                            width="24"
                            height="24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            aria-hidden="true"
                        >
                            <circle cx="12" cy="12" r="5" stroke="currentColor" />
                            <g>
                                <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" />
                                <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" />
                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" />
                                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" />
                                <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" />
                                <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" />
                                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" />
                                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" />
                            </g>
                        </svg>
                    ) : (
                        // Moon icon
                        <svg
                            width="24"
                            height="24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            aria-hidden="true"
                        >
                            <path
                                d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
                                stroke="currentColor"
                                strokeWidth="2"
                                fill="none"
                            />
                        </svg>
                    )}
                </Button>
            </div>
            {/* Bottom: Avatar (noop for now) */}
            <div className="mb-2">
                <LoginComponent />
            </div>
        </aside>
    );
}
