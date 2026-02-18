import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, CheckCircle2, Loader2, ChevronRight, AlertCircle } from 'lucide-react';
import { MOCK_AVAILABILITY } from '../constants';
import { AvailabilitySlot } from '../types';

interface InterviewSchedulerProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (date: string, time: string) => void;
  candidateName: string;
  jobTitle: string;
}

export const InterviewScheduler: React.FC<InterviewSchedulerProps> = ({ isOpen, onClose, onConfirm, candidateName, jobTitle }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSelectedDate(null);
      setSelectedTime(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setStep(2);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleConfirm = async () => {
    if (!selectedDate || !selectedTime) return;
    setIsSyncing(true);
    // Simulate API delay and calendar sync
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSyncing(false);
    setStep(3);
    setTimeout(() => {
      onConfirm(selectedDate, selectedTime);
      onClose();
    }, 1500);
  };

  const currentSlot = MOCK_AVAILABILITY.find(s => s.date === selectedDate);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h3 className="font-bold text-gray-900">Schedule Interview</h3>
            <p className="text-xs text-gray-500">{jobTitle}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-blue-600 bg-blue-50 p-3 rounded-xl border border-blue-100">
                <Calendar size={18} />
                <span className="text-sm font-semibold">Select a Preferred Date</span>
              </div>
              <div className="grid gap-3">
                {MOCK_AVAILABILITY.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => handleDateSelect(slot.date)}
                    className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
                  >
                    <div className="text-left">
                      <p className="font-bold text-gray-900">
                        {new Date(slot.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                      </p>
                      <p className="text-xs text-gray-500">{slot.times.length} slots available</p>
                    </div>
                    <ChevronRight size={18} className="text-gray-300 group-hover:text-blue-500" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <button 
                onClick={() => setStep(1)} 
                className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
              >
                ← Back to dates
              </button>
              
              <div>
                <p className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Clock size={16} className="text-blue-600" />
                  Available times for {new Date(selectedDate!).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {currentSlot?.times.map((time) => (
                    <button
                      key={time}
                      onClick={() => handleTimeSelect(time)}
                      className={`p-3 rounded-lg text-sm font-medium border transition-all ${
                        selectedTime === time
                          ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200'
                          : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div className="flex gap-3">
                   <AlertCircle className="text-gray-400 shrink-0" size={18} />
                   <p className="text-[11px] text-gray-500 leading-relaxed">
                     Selecting a slot will automatically sync this event to your connected calendar and notify the hiring team.
                   </p>
                </div>
              </div>

              <button
                onClick={handleConfirm}
                disabled={!selectedTime || isSyncing}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2"
              >
                {isSyncing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Syncing Calendars...
                  </>
                ) : (
                  'Confirm Booking'
                )}
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="py-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h4 className="text-xl font-bold text-gray-900">Interview Confirmed!</h4>
              <p className="text-sm text-gray-500 mt-2 px-6">
                We've added this to your calendar. A confirmation email has been sent to your inbox.
              </p>
              <div className="mt-6 p-4 bg-gray-50 rounded-xl inline-block text-left border border-dashed border-gray-300">
                <p className="text-xs font-bold text-gray-400 uppercase">Appointment Details</p>
                <p className="text-sm font-bold text-gray-800 mt-1">
                  {new Date(selectedDate!).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
                <p className="text-sm font-medium text-gray-600">{selectedTime}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};