import React, { useState } from 'react';
import { Application, ApplicationStatus, Job, User } from '../types';
import { MapPin, DollarSign, Building, ChevronRight, Info, AlertCircle, X, CheckCircle2, Calendar, ListChecks, Clock } from 'lucide-react';
import { ApplyJobModal } from './ApplyJobModal';

interface CandidateDashboardProps {
  jobs: Job[];
  applications: Application[];
  onApply: (jobId: string, resume: File) => void;
  currentUser: User;
}

export const CandidateDashboard: React.FC<CandidateDashboardProps> = ({ jobs, applications, onApply, currentUser }) => {
  const [activeTab, setActiveTab] = useState<'jobs' | 'applications'>('jobs');
  const [selectedFeedback, setSelectedFeedback] = useState<Application | null>(null);
  const [applyingJob, setApplyingJob] = useState<Job | null>(null);

  const myApplications = applications.filter(a => a.candidateId === currentUser.id);
  const appliedJobIds = myApplications.map(a => a.jobId);

  const handleApplyClick = (job: Job) => {
    setApplyingJob(job);
  };

  const handleApplySubmit = (file: File) => {
    if (applyingJob) {
      onApply(applyingJob.id, file);
      setApplyingJob(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 pb-20">
      <div className="bg-white border-b px-6 py-4 sticky top-0 z-10">
        <div className="flex gap-6 justify-center">
            <button
                onClick={() => setActiveTab('jobs')}
                className={`pb-2 text-sm font-semibold transition-colors border-b-2 ${activeTab === 'jobs' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
                Explore Jobs
            </button>
            <button
                onClick={() => setActiveTab('applications')}
                className={`pb-2 text-sm font-semibold transition-colors border-b-2 ${activeTab === 'applications' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
                My Applications
                {myApplications.length > 0 && <span className="ml-2 bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full text-xs">{myApplications.length}</span>}
            </button>
        </div>
      </div>

      <div className="p-4 max-w-3xl mx-auto w-full">
        {activeTab === 'jobs' ? (
          <div className="space-y-4">
            {jobs.map(job => (
              <div key={job.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-lg text-gray-900">{job.title}</h3>
                        <div className="flex items-center gap-3 text-gray-600 text-sm mt-1">
                            <span className="flex items-center gap-1"><Building size={14} /> {job.company}</span>
                            <span className="flex items-center gap-1 text-gray-400 text-xs"><Clock size={12} /> Posted: {job.postedAt}</span>
                        </div>
                    </div>
                    {appliedJobIds.includes(job.id) ? (
                        <span className="flex items-center gap-1 text-xs font-semibold bg-green-50 text-green-600 px-3 py-1 rounded-full border border-green-100">
                          <CheckCircle2 size={12} /> Applied
                        </span>
                    ) : (
                        <button
                            onClick={() => handleApplyClick(job)}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors shadow-sm shadow-blue-200"
                        >
                            Apply
                        </button>
                    )}
                </div>
                
                <div className="mt-4 flex flex-wrap gap-y-2 gap-x-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                    <span className="flex items-center gap-1"><DollarSign size={14} /> {job.salary}</span>
                    {job.deadline && (
                        <span className="flex items-center gap-1 text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-100">
                            <Calendar size={14} /> Apply by {new Date(job.deadline).toLocaleDateString()}
                        </span>
                    )}
                </div>
                
                <p className="mt-4 text-sm text-gray-600 leading-relaxed">{job.description}</p>
                
                {job.responsibilities && job.responsibilities.length > 0 && (
                    <div className="mt-4">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                           <ListChecks size={14} /> Key Responsibilities
                        </h4>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-1">
                            {job.responsibilities.slice(0, 3).map((resp, i) => (
                                <li key={i} className="leading-relaxed">{resp}</li>
                            ))}
                            {job.responsibilities.length > 3 && (
                                <li className="list-none text-xs text-blue-500 font-medium pl-4 pt-1">+ {job.responsibilities.length - 3} more</li>
                            )}
                        </ul>
                    </div>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                    {job.requirements.slice(0, 3).map(req => (
                        <span key={req} className="bg-slate-50 text-slate-600 px-2.5 py-1 rounded text-xs border border-slate-100 font-medium">{req}</span>
                    ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
              {myApplications.length === 0 && (
                  <div className="text-center py-10">
                    <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                       <Building className="text-gray-400" size={24} />
                    </div>
                    <p className="text-gray-500 font-medium">You haven't applied to any jobs yet.</p>
                    <button onClick={() => setActiveTab('jobs')} className="text-blue-600 text-sm font-semibold mt-2 hover:underline">Find a job</button>
                  </div>
              )}
            {myApplications.map(app => {
                const job = jobs.find(j => j.id === app.jobId);
                const isRejected = app.status === ApplicationStatus.REJECTED;
                return (
                    <div 
                        key={app.id} 
                        className={`bg-white p-5 rounded-xl shadow-sm border border-gray-100 transition-all ${isRejected && app.feedback ? 'cursor-pointer hover:shadow-md hover:border-red-200' : ''}`}
                        onClick={() => {
                            if (isRejected && app.feedback) {
                                setSelectedFeedback(app);
                            }
                        }}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="font-semibold text-gray-900">{job?.title}</h3>
                                <p className="text-sm text-gray-500">{job?.company}</p>
                            </div>
                            <span className={`px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wide ${
                                app.status === ApplicationStatus.REJECTED ? 'bg-red-50 text-red-600 border border-red-100' :
                                app.status === ApplicationStatus.OFFER ? 'bg-green-50 text-green-600 border border-green-100' :
                                'bg-blue-50 text-blue-600 border border-blue-100'
                            }`}>
                                {app.status}
                            </span>
                        </div>

                        {/* Transparency Feature: Mandatory Feedback Display */}
                        {isRejected && app.feedback && (
                            <div className="mt-3 bg-red-50/50 border border-red-100 rounded-lg p-3 group hover:bg-red-50 transition-colors">
                                <div className="flex items-start gap-3">
                                    <div className="bg-red-100 p-1.5 rounded-full mt-0.5">
                                        <Info className="text-red-600" size={14} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <p className="text-xs font-bold text-red-800 uppercase tracking-wide mb-1">Feedback Received</p>
                                        </div>
                                        <p className="text-sm text-gray-800 italic line-clamp-2 font-medium">"{app.feedback}"</p>
                                        <p className="text-xs text-red-600 mt-2 font-semibold flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                                            Tap to read full feedback <ChevronRight size={12} />
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {app.status !== ApplicationStatus.REJECTED && (
                            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 bg-gray-50 py-1.5 px-3 rounded-lg w-fit">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                                Application in progress
                            </div>
                        )}
                    </div>
                );
            })}
          </div>
        )}
      </div>

      {/* Feedback Detail Modal */}
      {selectedFeedback && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedFeedback(null)}>
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-red-50">
                      <h3 className="font-bold text-red-800 flex items-center gap-2">
                          <Info size={18} />
                          Review Feedback
                      </h3>
                      <button onClick={() => setSelectedFeedback(null)} className="text-red-400 hover:text-red-700 rounded-full p-1 hover:bg-red-100">
                          <X size={20} />
                      </button>
                  </div>
                  <div className="p-6">
                      <div className="mb-4">
                        <h4 className="font-bold text-gray-900 text-lg">{jobs.find(j => j.id === selectedFeedback.jobId)?.title}</h4>
                        <p className="text-sm text-gray-500">{jobs.find(j => j.id === selectedFeedback.jobId)?.company}</p>
                      </div>
                      
                      <div className="bg-red-50 p-5 rounded-xl border border-red-100 relative">
                          <div className="absolute top-4 left-4 text-red-200">
                              <Info size={24} />
                          </div>
                          <div className="relative z-10 pl-8">
                             <p className="text-gray-800 italic leading-relaxed text-sm md:text-base font-medium">
                                "{selectedFeedback.feedback}"
                             </p>
                          </div>
                      </div>
                      
                      <div className="mt-6 flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                          <AlertCircle className="text-blue-500 shrink-0 mt-0.5" size={16} />
                          <p className="text-xs text-blue-700 leading-relaxed">
                              <strong>Transparency Commitment:</strong> We believe every candidate deserves to know why. Use this feedback to grow and find the perfect role for you.
                          </p>
                      </div>
                  </div>
                  <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                      <button 
                          onClick={() => setSelectedFeedback(null)}
                          className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors shadow-sm text-sm"
                      >
                          Close
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Apply Job Modal */}
      {applyingJob && (
        <ApplyJobModal
          isOpen={!!applyingJob}
          onClose={() => setApplyingJob(null)}
          onSubmit={handleApplySubmit}
          jobTitle={applyingJob.title}
          companyName={applyingJob.company}
        />
      )}
    </div>
  );
};