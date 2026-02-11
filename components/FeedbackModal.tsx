import React, { useState } from 'react';
import { generateRejectionFeedback } from '../services/geminiService';
import { Loader2, Sparkles, X, CheckCircle } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedback: string) => void;
  candidateName: string;
  jobTitle: string;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, onSubmit, candidateName, jobTitle }) => {
  const [reason, setReason] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [customReasons, setCustomReasons] = useState<string[]>([]);
  
  if (!isOpen) return null;

  const handleGenerateAI = async () => {
    if (customReasons.length === 0 && !reason) {
        alert("Please select or type at least one reason.");
        return;
    }
    
    setIsGenerating(true);
    const reasonsToUse = [...customReasons];
    if (reason) reasonsToUse.push(reason);

    const generated = await generateRejectionFeedback({
      candidateName,
      jobTitle,
      reasons: reasonsToUse,
      tone: 'encouraging'
    });
    setFeedback(generated);
    setIsGenerating(false);
  };

  const toggleReason = (r: string) => {
    if (customReasons.includes(r)) {
      setCustomReasons(customReasons.filter(cr => cr !== r));
    } else {
      setCustomReasons([...customReasons, r]);
    }
  };

  const predefinedReasons = [
    "Missing required technical skills",
    "Not enough relevant experience",
    "Located outside hiring zone",
    "Portfolio mismatch"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-semibold text-gray-800">Reject Candidate & Provide Feedback</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              Transparency is mandatory. Please select reasons why <strong>{candidateName}</strong> was not selected.
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              {predefinedReasons.map((r) => (
                <button
                  key={r}
                  onClick={() => toggleReason(r)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    customReasons.includes(r)
                      ? 'bg-blue-100 border-blue-300 text-blue-700'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-blue-200'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <textarea
              className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Or type specific notes here..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
            />
          </div>

          <div className="flex justify-end mb-4">
            <button
              onClick={handleGenerateAI}
              disabled={isGenerating || (customReasons.length === 0 && !reason.trim())}
              className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 font-medium disabled:opacity-50"
            >
              {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              Generate Polite Feedback with AI
            </button>
          </div>

          <div className="mb-2">
             <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
               Final Message to Candidate
             </label>
             <textarea
               className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
               value={feedback}
               onChange={(e) => setFeedback(e.target.value)}
               rows={6}
               placeholder="Generated feedback will appear here. You can edit it before sending."
             />
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium">
            Cancel
          </button>
          <button
            onClick={() => onSubmit(feedback)}
            disabled={!feedback.trim()}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg shadow-sm disabled:opacity-50 transition-colors flex items-center gap-2"
          >
             Confirm Rejection
          </button>
        </div>
      </div>
    </div>
  );
};