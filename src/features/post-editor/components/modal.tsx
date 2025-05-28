import { useMemo, useRef, useState } from 'react';
import { Button } from '../../../components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../../../components/ui/dialog';
import { PostEditor, PostEditorRef } from './PostEditor';

interface PostEditorModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function PostEditorModal({ isOpen, onOpenChange }: PostEditorModalProps) {
    const postEditorRef = useRef<PostEditorRef>(null);
    const [imageCount, setImageCount] = useState(0);

    const handlePublish = async () => {
        await postEditorRef.current?.publishPost();
        onOpenChange(false);
    };

    const handleCancel = () => {
        onOpenChange(false);
    };

    const submitEnabled = useMemo(() => imageCount > 0, [imageCount]);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent onInteractOutside={(event) => event.preventDefault()}>
                <PostEditor ref={postEditorRef} onImageCountChange={setImageCount} />
                <DialogFooter>
                    <Button variant="outline" type="button" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button type="button" onClick={handlePublish} disabled={!submitEnabled}>
                        Publish
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
