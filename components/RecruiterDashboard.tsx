import React, { useState } from 'react';
import { Application, ApplicationStatus, Job, User } from '../types';
import { Check, X, Clock, MessageSquare, Briefcase, Eye, Plus, FileText, Calendar } from 'lucide-react';
import { FeedbackModal } from './FeedbackModal';
import { CandidateProfile } from './CandidateProfile';
import { CreateJobModal } from './CreateJobModal';

interface RecruiterDashboardProps {
  jobs: Job[];
  applications: Application[];
  onUpdateStatus: (appId: string, status: ApplicationStatus, feedback?: string) => void;
  onAddJob: (job: Omit<Job, 'id'>) => void;
  currentUser: User;
}

export const RecruiterDashboard: React.FC<RecruiterDashboardProps> = ({ jobs, applications, onUpdateStatus, onAddJob, currentUser }) => {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(jobs[0]?.id || null);
  const [feedbackModal, setFeedbackModal] = useState<{ isOpen: boolean; appId: string; candidateName: string } | null>(null);
  const [viewCandidate, setViewCandidate] = useState<{ id: string; name: string; email: string; skills: string[] } | null>(null);
  const [isJobModalOpen, setJobModalOpen] = useState(false);

  // In a real app, we would filter jobs by the recruiter's company or ID
  // For this mock, we assume the recruiter owns all jobs
  const myJobs = jobs; 
  const selectedJob = myJobs.find(j => j.id === selectedJobId);
  const jobApplications = applications.filter(a => a.jobId === selectedJobId);

  const handleRejectClick = (app: Application) => {
    setFeedbackModal({
      isOpen: true,
      appId: app.id,
      candidateName: app.candidateName
    });
  };

  const handleSubmitFeedback = (feedback: string) => {
    if (feedbackModal) {
      onUpdateStatus(feedbackModal.appId, ApplicationStatus.REJECTED, feedback);
      setFeedbackModal(null);
    }
  };

  const handleCreateJob = (jobData: Omit<Job, 'id'>) => {
      onAddJob(jobData);
  };

  const handleViewProfile = (app: Application) => {
      const candidateApps = applications.filter(a => a.candidateId === app.candidateId);
      const allSkills = Array.from(new Set(candidateApps.flatMap(a => a.skills)));

      setViewCandidate({
          id: app.candidateId,
          name: app.candidateName,
          email: app.candidateEmail,
          skills: allSkills
      });
  };

  const getCandidateHistory = (candidateId: string) => {
      return applications
        .filter(app => app.candidateId === candidateId)
        .map(app => {
            const job = jobs.find(j => j.id === app.jobId);
            return {
                id: app.id,
                jobTitle: job?.title || 'Unknown Job',
                company: job?.company || 'Unknown Company',
                status: app.status,
                appliedAt: app.appliedAt,
                feedback: app.feedback
            };
        })
        .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());
  };

  return (
    <div className="flex flex-col h-full bg-gray-50/50">
      {/* Job Selector with Add Button */}
      <div className="bg-white border-b px-4 py-3 sticky top-0 z-10 flex gap-4 items-center justify-between">
        <div className="overflow-x-auto whitespace-nowrap flex-1 -mr-4 pr-4 scrollbar-hide">
            <div className="flex gap-2">
            {myJobs.map(job => (
                <button
                key={job.id}
                onClick={() => setSelectedJobId(job.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedJobId === job.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                >
                {job.title}
                </button>
            ))}
            </div>
        </div>
        <button 
           onClick={() => setJobModalOpen(true)}
           className="shrink-0 flex items-center gap-2 px-3 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm"
        >
           <Plus size={16} /> <span className="hidden sm:inline">Post Job</span>
        </button>
      </div>

      <div className="p-4 max-w-5xl mx-auto w-full flex-1">
        {selectedJob && (
          <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2">
            <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedJob.title}</h2>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                  <span>{selectedJob.company} • {jobApplications.length} Applicants</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                  <span className="flex items-center gap-1"><Clock size={12}/> Posted: {selectedJob.postedAt}</span>
                </div>
            </div>
            {selectedJob.deadline && (
                <div className="text-sm text-gray-500 flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                     <Calendar size={14} className="text-gray-400" />
                     Deadline: <span className="font-medium text-gray-900">{new Date(selectedJob.deadline).toLocaleDateString()}</span>
                </div>
            )}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {jobApplications.length === 0 ? (
                <div className="col-span-full text-center py-10 text-gray-400">
                    <Briefcase size={48} className="mx-auto mb-2 opacity-20" />
                    No applications yet for this role.
                </div>
            ) : (
                jobApplications.map(app => (
                <div key={app.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                    <div className="flex justify-between items-start mb-3">
                    <div 
                        className="cursor-pointer hover:bg-blue-50 -m-2 p-2 rounded-lg transition-colors flex-1 mr-2"
                        onClick={() => handleViewProfile(app)}
                        title="View Candidate Profile"
                    >
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            {app.candidateName}
                            <Eye size={14} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </h3>
                        <p className="text-xs text-gray-500">{app.candidateEmail}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        app.status === ApplicationStatus.APPLIED ? 'bg-blue-50 text-blue-600' :
                        app.status === ApplicationStatus.REVIEWING ? 'bg-amber-50 text-amber-600' :
                        app.status === ApplicationStatus.REJECTED ? 'bg-red-50 text-red-600' :
                        'bg-green-50 text-green-600'
                    }`}>
                        {app.status}
                    </span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                    {app.skills.map(skill => (
                        <span key={skill} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        {skill}
                        </span>
                    ))}
                    </div>

                    {app.resumeLink && app.resumeLink !== '#' && (
                        <a 
                            href={app.resumeLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline mb-4 px-2 py-1.5 bg-blue-50 rounded-md w-fit"
                        >
                            <FileText size={14} /> View Resume
                        </a>
                    )}

                    {app.status !== ApplicationStatus.REJECTED && app.status !== ApplicationStatus.OFFER && (
                    <div className="flex gap-2 pt-3 border-t border-gray-50">
                        <button
                        onClick={() => handleRejectClick(app)}
                        className="flex-1 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg flex items-center justify-center gap-1 transition-colors"
                        >
                        <X size={16} /> Reject
                        </button>
                        <button
                        onClick={() => onUpdateStatus(app.id, app.status === ApplicationStatus.APPLIED ? ApplicationStatus.REVIEWING : ApplicationStatus.OFFER)}
                        className="flex-1 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center justify-center gap-1 transition-colors"
                        >
                         {app.status === ApplicationStatus.APPLIED ? <><Clock size={16}/> Review</> : <><Check size={16}/> Offer</>}
                        </button>
                    </div>
                    )}
                    
                    {app.status === ApplicationStatus.REJECTED && (
                        <div className="pt-3 border-t border-gray-50 text-xs text-gray-500 italic">
                            <div className="flex items-center gap-1 mb-1 text-gray-400">
                                <MessageSquare size={12} /> Feedback sent:
                            </div>
                            "{app.feedback?.substring(0, 60)}..."
                        </div>
                    )}
                </div>
                ))
            )}
        </div>
      </div>

      {feedbackModal && selectedJob && (
        <FeedbackModal
          isOpen={feedbackModal.isOpen}
          onClose={() => setFeedbackModal(null)}
          candidateName={feedbackModal.candidateName}
          jobTitle={selectedJob.title}
          onSubmit={handleSubmitFeedback}
        />
      )}

      {viewCandidate && (
          <CandidateProfile 
            isOpen={!!viewCandidate}
            onClose={() => setViewCandidate(null)}
            candidate={viewCandidate}
            history={getCandidateHistory(viewCandidate.id)}
          />
      )}

      <CreateJobModal 
        isOpen={isJobModalOpen}
        onClose={() => setJobModalOpen(false)}
        onSubmit={handleCreateJob}
      />
    </div>
  );
};