import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface TrainingProgram {
    id: string;
    title: string;
    organizer: string;
    date: string;
    duration: string;
    location: string;
    seats: number;
    fee: string;
    description: string;
    topics: string[];
}

interface TrainingEnrollmentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const mockPrograms: TrainingProgram[] = [
    {
        id: '1',
        title: 'Organic Farming Techniques',
        organizer: 'Krishi Vigyan Kendra',
        date: '2024-11-15',
        duration: '3 Days',
        location: 'District Training Center',
        seats: 25,
        fee: 'Free',
        description: 'Learn advanced organic farming methods, composting, and pest management.',
        topics: ['Soil Health', 'Composting', 'Bio-pesticides']
    },
    {
        id: '2',
        title: 'Dairy Management Workshop',
        organizer: 'State Dairy Board',
        date: '2024-11-20',
        duration: '1 Day',
        location: 'Community Hall, Village Center',
        seats: 40,
        fee: '₹100',
        description: 'Best practices for cattle care, milk hygiene, and disease prevention.',
        topics: ['Cattle Feed', 'Milk Hygiene', 'Vaccination']
    },
    {
        id: '3',
        title: 'Financial Literacy for Women',
        organizer: 'NABARD',
        date: '2024-11-25',
        duration: '2 Days',
        location: 'Panchayat Bhawan',
        seats: 30,
        fee: 'Free',
        description: 'Understanding banking, loans, savings, and digital transactions.',
        topics: ['Banking Basics', 'Savings', 'Digital Payments']
    }
];

export const TrainingEnrollmentDialog: React.FC<TrainingEnrollmentDialogProps> = ({
    open,
    onOpenChange
}) => {
    const [selectedProgram, setSelectedProgram] = useState<string | null>(null);

    const handleEnroll = (programId: string) => {
        // Simulate API call
        toast.success('Successfully enrolled in training program!');
        onOpenChange(false);
        setSelectedProgram(null);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Training Programs</DialogTitle>
                    <DialogDescription>
                        Skill development and capacity building workshops for women farmers
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {mockPrograms.map((program) => (
                        <div key={program.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-semibold text-lg text-gray-900">{program.title}</h3>
                                    <p className="text-sm text-gray-500">{program.organizer}</p>
                                </div>
                                <Badge variant={program.fee === 'Free' ? 'default' : 'secondary'}>
                                    {program.fee}
                                </Badge>
                            </div>

                            <p className="text-gray-600 text-sm mb-3">{program.description}</p>

                            <div className="grid grid-cols-2 gap-2 text-sm text-gray-500 mb-3">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>{program.date}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <span>{program.duration}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    <span>{program.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    <span>{program.seats} seats available</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {program.topics.map((topic, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                        {topic}
                                    </Badge>
                                ))}
                            </div>

                            <Button
                                className="w-full"
                                onClick={() => handleEnroll(program.id)}
                            >
                                Enroll Now
                            </Button>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
};
