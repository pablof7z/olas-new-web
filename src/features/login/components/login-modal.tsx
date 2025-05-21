'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NDKNip07Signer } from '@nostr-dev-kit/ndk';
import { useNDKCurrentPubkey, useNDKSessionLogin, useNDKSessionSwitch } from '@nostr-dev-kit/ndk-hooks';
import { ChromeIcon as Browser, Globe, KeyRound } from 'lucide-react';
import { useState } from 'react';
import PrivateKeyLogin from './private-key-login';
import RemoteSignerLogin from './remote-signer-login';
import SignUpForm from './sign-up-form';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const [activeTab, setActiveTab] = useState('signin');
    const [loginMethod, setLoginMethod] = useState<string | null>(null);
    const login = useNDKSessionLogin();
    const switchSession = useNDKSessionSwitch();
    const currentPubkey = useNDKCurrentPubkey();
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleNip07Login = async () => {
        try {
            setStatus('loading');
            const signer = new NDKNip07Signer();
            await signer.blockUntilReady();

            // Login with the signer
            await login(signer);

            setStatus('success');
            setTimeout(() => {
                onClose();
            }, 1000);
        } catch (error) {
            console.error('Login error:', error);
            setStatus('error');
        }
    };

    const renderLoginOptions = () => {
        if (loginMethod === 'privateKey') {
            return <PrivateKeyLogin onClose={onClose} onBack={() => setLoginMethod(null)} />;
        }

        if (loginMethod === 'remoteSigner') {
            return <RemoteSignerLogin onClose={onClose} onBack={() => setLoginMethod(null)} />;
        }

        return (
            <div className="flex flex-col space-y-4 py-4">
                <Button onClick={() => setLoginMethod('privateKey')} className="w-full justify-start" variant="outline">
                    <KeyRound className="mr-3 h-5 w-5" />
                    Login with Private Key
                </Button>
                <Button
                    onClick={() => setLoginMethod('remoteSigner')}
                    className="w-full justify-start"
                    variant="outline"
                >
                    <Globe className="mr-3 h-5 w-5" />
                    Login with Remote Signer
                </Button>
                <Button
                    onClick={handleNip07Login}
                    className="w-full justify-start"
                    variant="outline"
                    disabled={status === 'loading'}
                >
                    <Browser className="mr-3 h-5 w-5" />
                    {status === 'loading' ? 'Connecting...' : 'Login with Browser Extension'}
                </Button>
            </div>
        );
    };

    const dialogTitle = currentPubkey ? 'Add Another Session' : 'Welcome to Nostr';

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-center text-xl font-bold">{dialogTitle}</DialogTitle>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="signin" onClick={() => setLoginMethod(null)}>
                            Sign In
                        </TabsTrigger>
                        <TabsTrigger value="signup" onClick={() => setLoginMethod(null)}>
                            Sign Up
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="signin" className="mt-0">
                        {renderLoginOptions()}
                    </TabsContent>

                    <TabsContent value="signup" className="mt-0">
                        <SignUpForm onClose={onClose} />
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
