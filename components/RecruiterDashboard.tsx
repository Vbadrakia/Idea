import React, { useState, useMemo } from 'react';
import { Application, ApplicationStatus, Job, User, SourcingAgent, ExternalCandidate, RecruiterSubscription } from '../types';
import { Check, X, Clock, MessageSquare, Briefcase, Eye, Plus, FileText, Calendar, Video, TrendingUp, Cpu, Sparkles, Target, Zap, ShieldCheck } from 'lucide-react';
import { FeedbackModal } from './FeedbackModal';
import { CandidateProfile } from './CandidateProfile';
import { CreateJobModal } from './CreateJobModal';
import { ReputationBadge } from './ReputationBadge';
import { calculateReputation } from '../utils/reputationUtils';
import { AISourcingDashboard } from './AISourcingDashboard';
import { SubscriptionManager } from './SubscriptionManager';

interface RecruiterDashboardProps {
  jobs: Job[];
  applications: Application[];
  onUpdateStatus: (appId: string, status: ApplicationStatus, feedback?: string) => void;
  onAddJob: (job: Omit<Job, 'id'>) => void;
  onSubscribe: (tier: string) => void;
  currentUser: User;
}

export const RecruiterDashboard: React.FC<RecruiterDashboardProps> = ({ jobs, applications, onUpdateStatus, onAddJob, onSubscribe, currentUser }) => {
  const [activeTab, setActiveTab] = useState<'talent' | 'ai-sourcing' | 'billing'>('talent');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(jobs[0]?.id || null);
  const [feedbackModal, setFeedbackModal] = useState<{ isOpen: boolean; appId: string; candidateName: string } | null>(null);
  const [viewCandidate, setViewCandidate] = useState<{ id: string; name: string; email: string; skills: string[] } | null>(null);
  const [isJobModalOpen, setJobModalOpen] = useState(false);
  
  // Sourcing Agents State (Normally in parent or server)
  const [agents, setAgents] = useState<SourcingAgent[]>([]);

  const myJobs = jobs; 
  const selectedJob = myJobs.find(j => j.id === selectedJobId);
  const jobApplications = applications.filter(a => a.jobId === selectedJobId);

  const reputationStats = useMemo(() => calculateReputation(applications), [applications]);

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

  const handleAddAgent = (agentData: Omit<SourcingAgent, 'id'>) => {
    const newAgent: SourcingAgent = {
      ...agentData,
      id: `agent_${Date.now()}`
    };
    setAgents([...agents, newAgent]);
  };

  const handleToggleAgent = (agentId: string) => {
    setAgents(prev => prev.map(a => a.id === agentId ? { ...a, status: a.status === 'active' ? 'paused' : 'active' } : a));
  };

  const handleFoundMatch = (jobId: string, candidate: ExternalCandidate, score: number, reason: string) => {
    // Add to applications as an "AI Sourced" entry
    const newApp: Application = {
      id: `ai_${Date.now()}`,
      jobId,
      candidateId: candidate.id,
      candidateName: candidate.name,
      candidateEmail: candidate.email,
      appliedAt: new Date().toISOString(),
      status: ApplicationStatus.APPLIED,
      skills: candidate.skills,
      aiScore: score,
      aiReason: reason
    };
    // Use local update to avoid parent propagation complexity in this turn
    // (In real app, this would hit API and update global state)
    // For now we just alert
    alert(`AI Found High-Fit Match for ${jobs.find(j => j.id === jobId)?.title}: ${candidate.name} (${score}%)`);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50/50">
      {/* Top Navigation */}
      <div className="bg-white px-4 border-b border-gray-100 sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4 items-start md:items-center justify-between py-4">
           <div className="flex items-center gap-4">
              <img src={currentUser.avatar} className="w-10 h-10 rounded-xl shadow-sm border border-gray-200" alt="Avatar" />
              <div>
                 <h1 className="text-sm font-black text-gray-900 leading-none">Recruiter HQ</h1>
                 <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">{currentUser.company}</p>
              </div>
           </div>
           
           <div className="flex items-center bg-gray-100 p-1 rounded-xl">
              <button 
                onClick={() => setActiveTab('talent')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'talent' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Talent Hub
              </button>
              <button 
                onClick={() => setActiveTab('ai-sourcing')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'ai-sourcing' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              >
                <Cpu size={14} /> AI Sourcing
              </button>
              <button 
                onClick={() => setActiveTab('billing')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'billing' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              >
                <ShieldCheck size={14} /> SaaS Plan
              </button>
           </div>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'billing' ? (
            <SubscriptionManager 
              currentUser={currentUser} 
              onSubscribe={onSubscribe} 
            />
          ) : activeTab === 'ai-sourcing' ? (
            <AISourcingDashboard 
              currentUser={currentUser}
              jobs={jobs}
              agents={agents}
              onAddAgent={handleAddAgent}
              onToggleAgent={handleToggleAgent}
              onFoundMatch={handleFoundMatch}
            />
          ) : (
            <div className="space-y-8 animate-in fade-in duration-500">
               {/* Quick Stats */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <ReputationBadge stats={reputationStats} />
                  <div className="md:col-span-2 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-6 text-white shadow-xl shadow-indigo-100 relative overflow-hidden flex items-center">
                    <div className="relative z-10">
                      <h3 className="text-xl font-black mb-2">Hire Smarter with AI Agents</h3>
                      <p className="text-indigo-100 text-sm max-w-sm mb-4">Your current plan includes 3 sourcing agents. Deploy one now to start seeing autonomous talent matches.</p>
                      <button 
                        onClick={() => setActiveTab('ai-sourcing')}
                        className="bg-white text-indigo-700 px-6 py-2 rounded-xl text-xs font-black shadow-lg hover:bg-indigo-50 transition-all flex items-center gap-2"
                      >
                        <Bot size={16} /> Deploy New Agent
                      </button>
                    </div>
                    <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                       <Cpu size={180} />
                    </div>
                  </div>
               </div>

               {/* Job Navigation & Post Button */}
               <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                  <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                    {myJobs.map(job => (
                        <button
                          key={job.id}
                          onClick={() => setSelectedJobId(job.id)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                              selectedJobId === job.id
                              ? 'bg-gray-900 text-white shadow-md'
                              : 'bg-transparent text-gray-500 hover:bg-gray-100'
                          }`}
                        >
                        {job.title}
                        </button>
                    ))}
                  </div>
                  <button 
                    onClick={() => setJobModalOpen(true)}
                    className="shrink-0 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100"
                  >
                    <Plus size={16} /> Post Job
                  </button>
               </div>

               {/* Candidate List */}
               <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {jobApplications.length === 0 ? (
                      <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-gray-100 border-dashed">
                          <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Briefcase size={24} className="text-gray-300" />
                          </div>
                          <p className="text-gray-400 font-bold">No applications for this role yet.</p>
                      </div>
                  ) : (
                    jobApplications
                      .sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0))
                      .map(app => (
                      <div key={app.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all group relative">
                          {/* AI Score Badge */}
                          {app.aiScore && (
                            <div className={`absolute -top-3 left-6 px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1.5 shadow-lg ${
                              app.aiScore >= 80 ? 'bg-indigo-600 text-white' : 'bg-gray-900 text-white'
                            }`}>
                              <Cpu size={12} /> AI Match: {app.aiScore}%
                            </div>
                          )}

                          <div className="flex justify-between items-start mb-4 mt-2">
                            <div 
                                className="cursor-pointer"
                                onClick={() => setViewCandidate({
                                  id: app.candidateId,
                                  name: app.candidateName,
                                  email: app.candidateEmail,
                                  skills: app.skills
                                })}
                            >
                                <h3 className="font-black text-gray-900 flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                                    {app.candidateName}
                                </h3>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{app.candidateEmail}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                                app.status === ApplicationStatus.APPLIED ? 'bg-blue-50 text-blue-600' :
                                app.status === ApplicationStatus.REVIEWING ? 'bg-amber-50 text-amber-600' :
                                app.status === ApplicationStatus.INTERVIEWING ? 'bg-purple-50 text-purple-600' :
                                app.status === ApplicationStatus.SCHEDULED ? 'bg-green-600 text-white' :
                                app.status === ApplicationStatus.REJECTED ? 'bg-red-50 text-red-600' :
                                'bg-green-50 text-green-600'
                            }`}>
                                {app.status}
                            </span>
                          </div>

                          {/* Explainable AI Rationale */}
                          {app.aiReason && (
                             <div className="mb-4 bg-gray-50 p-3 rounded-2xl border border-gray-100 flex gap-3">
                                <Sparkles size={14} className="text-indigo-600 shrink-0 mt-0.5" />
                                <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
                                   {app.aiReason}
                                </p>
                             </div>
                          )}

                          <div className="flex flex-wrap gap-1.5 mb-6">
                            {app.skills.map(skill => (
                                <span key={skill} className="text-[10px] bg-white text-gray-500 px-2.5 py-1 rounded-lg border border-gray-100 font-bold">
                                {skill}
                                </span>
                            ))}
                          </div>

                          {app.status !== ApplicationStatus.REJECTED && app.status !== ApplicationStatus.OFFER && app.status !== ApplicationStatus.SCHEDULED && (
                            <div className="flex gap-2">
                                <button
                                  onClick={() => handleRejectClick(app)}
                                  className="flex-1 py-2.5 text-xs font-black text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                                >
                                  Reject
                                </button>
                                <button
                                  onClick={() => {
                                    const nextStatus = 
                                      app.status === ApplicationStatus.APPLIED ? ApplicationStatus.REVIEWING : 
                                      app.status === ApplicationStatus.REVIEWING ? ApplicationStatus.INTERVIEWING :
                                      ApplicationStatus.OFFER;
                                    onUpdateStatus(app.id, nextStatus);
                                  }}
                                  className="flex-1 py-2.5 text-xs font-black text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                                >
                                  <Zap size={14} /> Next Step
                                </button>
                            </div>
                          )}
                      </div>
                    ))
                  )}
               </div>
            </div>
          )}
        </div>
      </main>

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
            history={applications
              .filter(a => a.candidateId === viewCandidate.id)
              .map(a => {
                const job = jobs.find(j => j.id === a.jobId);
                return {
                  id: a.id,
                  jobTitle: job?.title || 'Unknown Job',
                  company: job?.company || 'Unknown Company',
                  status: a.status,
                  appliedAt: a.appliedAt,
                  feedback: a.feedback
                };
              })}
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

// Internal Bot helper
const Bot: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" />
  </svg>
);