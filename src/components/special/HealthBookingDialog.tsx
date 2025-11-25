import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock, MapPin, Stethoscope, User } from 'lucide-react';
import { toast } from 'sonner';

interface HealthBookingDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const HealthBookingDialog: React.FC<HealthBookingDialogProps> = ({
    open,
    onOpenChange
}) => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [specialty, setSpecialty] = useState('');
    const [doctor, setDoctor] = useState('');
    const [timeSlot, setTimeSlot] = useState('');
    const [symptoms, setSymptoms] = useState('');

    const handleBook = () => {
        if (!date || !specialty || !doctor || !timeSlot) {
            toast.error('Please fill in all required fields');
            return;
        }

        // Simulate API call
        toast.success('Appointment booked successfully!');
        onOpenChange(false);

        // Reset form
        setDate(new Date());
        setSpecialty('');
        setDoctor('');
        setTimeSlot('');
        setSymptoms('');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Book Health Appointment</DialogTitle>
                    <DialogDescription>
                        Schedule a consultation with a healthcare professional
                    </DialogDescription>
                </DialogHeader>

                <div className="grid md:grid-cols-2 gap-6 py-4">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Specialty</Label>
                            <Select value={specialty} onValueChange={setSpecialty}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select specialty" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="general">General Physician</SelectItem>
                                    <SelectItem value="gynecology">Gynecology</SelectItem>
                                    <SelectItem value="orthopedics">Orthopedics</SelectItem>
                                    <SelectItem value="dermatology">Dermatology</SelectItem>
                                    <SelectItem value="nutrition">Nutritionist</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Doctor</Label>
                            <Select value={doctor} onValueChange={setDoctor}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select doctor" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="dr_sharma">Dr. Anjali Sharma (Gen. Physician)</SelectItem>
                                    <SelectItem value="dr_patel">Dr. Priya Patel (Gynecologist)</SelectItem>
                                    <SelectItem value="dr_singh">Dr. R.K. Singh (Orthopedist)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Preferred Date</Label>
                            <div className="border rounded-md p-2">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    className="rounded-md border shadow-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Available Time Slots</Label>
                            <div className="grid grid-cols-2 gap-2">
                                {['09:00 AM', '10:30 AM', '02:00 PM', '04:30 PM'].map((slot) => (
                                    <Button
                                        key={slot}
                                        variant={timeSlot === slot ? 'default' : 'outline'}
                                        className="w-full text-sm"
                                        onClick={() => setTimeSlot(slot)}
                                    >
                                        <Clock className="h-3 w-3 mr-2" />
                                        {slot}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Symptoms / Reason for Visit</Label>
                            <Textarea
                                placeholder="Briefly describe your symptoms..."
                                value={symptoms}
                                onChange={(e) => setSymptoms(e.target.value)}
                                className="h-32"
                            />
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg text-sm space-y-2">
                            <div className="flex items-center gap-2 text-blue-700">
                                <MapPin className="h-4 w-4" />
                                <span>City Hospital, Sector 4</span>
                            </div>
                            <div className="flex items-center gap-2 text-blue-700">
                                <User className="h-4 w-4" />
                                <span>Consultation Fee: ₹500</span>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleBook}>Confirm Booking</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
