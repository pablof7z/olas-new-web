import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function SiteHeader() {
    return (
        <>
            <header className="z-50 fixed top-0 left-0 right-0 blurred !px-6 !py-3 !bg-black/80 backdrop-blur-md">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 gap-4">
                        <Link href="/" className="text-xl font-bold !text-white hover:text-white">
                            Olas
                        </Link>
                        <Link href="/" className="!text-white hover:text-white text-sm">
                            Explore
                        </Link>
                    </div>
                    <div>
                        <Button variant="ghost">Sign In</Button>
                    </div>
                </div>
            </header>
            <div className="h-16"></div>
        </>
    );
}
