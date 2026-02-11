import React from 'react';
import { X, Mail, Briefcase, Calendar, Clock, User } from 'lucide-react';

interface HistoryItem {
  id: string;
  jobTitle: string;
  company: string;
  status: string;
  appliedAt: string;
  feedback?: string;
}

interface CandidateProfileProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: {
    id: string;
    name: string;
    email: string;
    skills: string[];
  };
  history: HistoryItem[];
}

export const CandidateProfile: React.FC<CandidateProfileProps> = ({ isOpen, onClose, candidate, history }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-[2px] transition-opacity" 
        onClick={onClose} 
      />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-md bg-white shadow-2xl h-full flex flex-col animate-slide-in-right border-l border-gray-100">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-slate-50/50">
          <div className="flex gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shadow-inner">
                <User size={32} />
            </div>
            <div>
                <h2 className="text-xl font-bold text-gray-900">{candidate.name}</h2>
                <div className="flex items-center gap-1.5 text-gray-500 mt-1">
                <Mail size={14} />
                <span className="text-sm">{candidate.email}</span>
                </div>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 -mr-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          {/* Skills Section */}
          <div className="mb-8">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Briefcase size={14} /> Skills & Expertise
            </h3>
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map((skill, index) => (
                <span 
                    key={`${skill}-${index}`} 
                    className="bg-white text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 shadow-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* History Section */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Clock size={14} /> Application History
            </h3>
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-3.5 before:-z-10 before:h-full before:w-0.5 before:bg-gray-100">
              {history.map((item) => (
                <div key={item.id} className="relative pl-8">
                    {/* Timeline dot */}
                   <div className={`absolute left-1.5 top-1.5 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                        item.status === 'REJECTED' ? 'bg-red-400' :
                        item.status === 'OFFER' ? 'bg-green-500' :
                        item.status === 'APPLIED' ? 'bg-blue-400' :
                        'bg-amber-400'
                   }`}></div>

                  <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <div className="font-semibold text-gray-900">{item.jobTitle}</div>
                        <div className="text-xs text-gray-500">{item.company}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                          item.status === 'REJECTED' ? 'bg-red-50 text-red-600' :
                          item.status === 'OFFER' ? 'bg-green-50 text-green-600' :
                          'bg-blue-50 text-blue-600'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                      <Calendar size={12} />
                      {new Date(item.appliedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>

                    {item.feedback && (
                      <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-600 italic border border-gray-100 relative">
                        <span className="absolute -top-1.5 left-3 w-3 h-3 bg-gray-50 border-t border-l border-gray-100 transform rotate-45"></span>
                        "{item.feedback}"
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Footer actions could go here */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
            <button 
                onClick={onClose}
                className="w-full py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm text-sm"
            >
                Close Profile
            </button>
        </div>
      </div>
    </div>
  );
};