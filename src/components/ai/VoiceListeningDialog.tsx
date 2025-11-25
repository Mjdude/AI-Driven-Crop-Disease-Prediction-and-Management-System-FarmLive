import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2 } from 'lucide-react';

interface VoiceListeningDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onTranscript: (text: string) => void;
}

export const VoiceListeningDialog: React.FC<VoiceListeningDialogProps> = ({
    open,
    onOpenChange,
    onTranscript
}) => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');

    useEffect(() => {
        if (open) {
            setIsListening(true);
            setTranscript('');

            // Simulate listening and transcription
            const timeouts = [
                setTimeout(() => setTranscript('How...'), 1000),
                setTimeout(() => setTranscript('How do I...'), 1500),
                setTimeout(() => setTranscript('How do I treat...'), 2000),
                setTimeout(() => setTranscript('How do I treat leaf blight...'), 2500),
                setTimeout(() => setTranscript('How do I treat leaf blight in wheat?'), 3000),
                setTimeout(() => {
                    setIsListening(false);
                    setTimeout(() => {
                        onTranscript('How do I treat leaf blight in wheat?');
                        onOpenChange(false);
                    }, 500);
                }, 3500)
            ];

            return () => timeouts.forEach(clearTimeout);
        }
    }, [open, onTranscript, onOpenChange]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px] text-center">
                <DialogHeader>
                    <DialogTitle>Listening...</DialogTitle>
                    <DialogDescription>
                        Speak clearly into your microphone
                    </DialogDescription>
                </DialogHeader>

                <div className="py-8 flex flex-col items-center justify-center space-y-6">
                    <div className={`relative flex items-center justify-center w-24 h-24 rounded-full ${isListening ? 'bg-red-100' : 'bg-gray-100'}`}>
                        {isListening && (
                            <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping"></span>
                        )}
                        <Mic className={`h-10 w-10 ${isListening ? 'text-red-600' : 'text-gray-400'}`} />
                    </div>

                    <div className="min-h-[3rem] text-lg font-medium text-gray-700">
                        {transcript || (isListening ? "Listening..." : "Processing...")}
                    </div>

                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="rounded-full"
                    >
                        <MicOff className="h-4 w-4 mr-2" />
                        Cancel
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
