'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NDKEvent, NDKKind, NDKPrivateKeySigner } from '@nostr-dev-kit/ndk';
import { useNDK, useNDKCurrentPubkey, useNDKSessionLogin, useNDKSessionSwitch } from '@nostr-dev-kit/ndk-hooks';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import AvatarSelector from './avatar-selector';
import UsernameInput from './username-input';

interface SignUpFormProps {
    onClose: () => void;
}

export default function SignUpForm({ onClose }: SignUpFormProps) {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [avatarSeed, setAvatarSeed] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [generatedKey, setGeneratedKey] = useState('');
    const login = useNDKSessionLogin();
    const currentPubkey = useNDKCurrentPubkey();
    const { ndk } = useNDK();

    const handleSignUp = async () => {
        try {
            setStatus('loading');

            // Generate a new private key
            const signer = NDKPrivateKeySigner.generate();
            setGeneratedKey(signer.nsec);

            // Login with the new key
            await login(signer);

            // Create a profile event if we have a name or username
            if ((name || username) && ndk) {
                try {
                    const profileEvent = new NDKEvent(ndk);
                    profileEvent.kind = NDKKind.Metadata;

                    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`;

                    profileEvent.content = JSON.stringify({
                        name: username,
                        display_name: name,
                        ...(avatarSeed ? { picture: avatarUrl } : {}),
                    });

                    await profileEvent.publish();
                } catch (error) {
                    console.error('Failed to publish profile:', error);
                }
            }

            setStatus('success');
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (error) {
            console.error('Sign up error:', error);
            setStatus('error');
            setErrorMessage(error instanceof Error ? error.message : 'Failed to create account');
        }
    };

    return (
        <div className="flex flex-col space-y-4 py-4">
            <div className="flex justify-center mb-2">
                <AvatarSelector value={avatarSeed} onChange={setAvatarSeed} size="lg" />
            </div>

            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" />
            </div>

            <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <UsernameInput id="username" value={username} onChange={setUsername} placeholder="username" />
            </div>

            {status === 'error' && (
                <div className="flex items-center text-red-500 bg-red-50 p-3 rounded-md">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    <span className="text-sm">{errorMessage}</span>
                </div>
            )}

            {status === 'success' && (
                <div className="space-y-4">
                    <div className="flex items-center text-green-500 bg-green-50 p-3 rounded-md">
                        <CheckCircle2 className="h-5 w-5 mr-2" />
                        <span className="text-sm">Account created successfully!</span>
                    </div>

                    {generatedKey && (
                        <div className="p-3 bg-yellow-50 rounded-md">
                            <p className="text-sm font-medium text-yellow-800 mb-1">
                                Your private key (save this somewhere safe):
                            </p>
                            <p className="text-xs font-mono break-all">{generatedKey}</p>
                        </div>
                    )}
                </div>
            )}

            <Button
                onClick={handleSignUp}
                disabled={status === 'loading' || status === 'success'}
                className="w-full h-10 mt-2"
            >
                {status === 'loading' ? 'Creating Account...' : 'Create Account'}
            </Button>
        </div>
    );
}
