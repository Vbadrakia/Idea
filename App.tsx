import React, { useState } from 'react';
import { MOCK_APPLICATIONS, MOCK_JOBS } from './constants';
import { Application, ApplicationStatus, User, Job } from './types';
import { RecruiterDashboard } from './components/RecruiterDashboard';
import { CandidateDashboard } from './components/CandidateDashboard';
import { AuthScreen } from './components/AuthScreen';
import { LayoutGrid, User as UserIcon, ShieldCheck, LogOut, ChevronRight } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authRole, setAuthRole] = useState<'candidate' | 'recruiter' | null>(null);
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [applications, setApplications] = useState<Application[]>(MOCK_APPLICATIONS);

  const handleUpdateStatus = (appId: string, status: ApplicationStatus, feedback?: string) => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        return { 
          ...app, 
          status, 
          feedback,
          lastStatusUpdateAt: new Date().toISOString()
        };
      }
      return app;
    }));
  };

  const handleApply = (jobId: string, resumeFile: File) => {
    if (!user) return;
    
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;

    if (applications.some(a => a.jobId === jobId && a.candidateId === user.id)) {
        alert("You have already applied for this job.");
        return;
    }

    const resumeLink = URL.createObjectURL(resumeFile);

    const newApp: Application = {
      id: `new_${Date.now()}`,
      jobId: jobId,
      candidateId: user.id,
      candidateName: user.name,
      candidateEmail: user.email,
      appliedAt: new Date().toISOString(),
      status: ApplicationStatus.APPLIED,
      skills: ['React', 'TypeScript'],
      resumeLink: resumeLink
    };
    setApplications([newApp, ...applications]);
    alert("Application submitted successfully!");
  };

  const handleConfirmInterview = (appId: string, date: string, time: string) => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        return { 
          ...app, 
          status: ApplicationStatus.SCHEDULED, 
          interviewDate: date, 
          interviewTime: time,
          lastStatusUpdateAt: new Date().toISOString()
        };
      }
      return app;
    }));
  };

  const handleAddJob = (jobData: Omit<Job, 'id'>) => {
    const newJob: Job = {
        ...jobData,
        id: `j${Date.now()}`,
    };
    setJobs([newJob, ...jobs]);
  };

  const handleSubscribe = (tier: string) => {
    if (!user || user.role !== 'recruiter') return;
    
    // Create or update mock subscription
    const maxAgents = tier === 'basic' ? 3 : tier === 'pro' ? 10 : 999;
    const maxCredits = tier === 'basic' ? 50 : tier === 'pro' ? 250 : 9999;
    
    const newSubscription = {
      tier: (tier.charAt(0).toUpperCase() + tier.slice(1)) as any,
      status: 'active' as const,
      renewsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      usage: {
        activeAgents: 0,
        maxAgents,
        outreachCredits: 0,
        maxOutreachCredits: maxCredits
      }
    };
    
    setUser({
      ...user,
      subscription: newSubscription
    });
    alert(`Successfully subscribed to ${tier.toUpperCase()} plan!`);
  };

  if (authRole && !user) {
      return <AuthScreen role={authRole} onLogin={setUser} onBack={() => setAuthRole(null)} />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center border border-gray-100">
            <div className="w-20 h-20 bg-blue-600 rounded-3xl mx-auto flex items-center justify-center mb-8 shadow-xl shadow-blue-200 transform -rotate-3 hover:rotate-0 transition-transform">
                <ShieldCheck className="text-white" size={40} />
            </div>
          <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">ClearPath Recruit</h1>
          <p className="text-gray-500 mb-10 font-medium leading-relaxed">The transparent recruitment platform where feedback is standard, not optional.</p>
          
          <div className="space-y-4">
            <button
              onClick={() => setAuthRole('recruiter')}
              className="w-full py-5 px-6 border-2 border-gray-100 rounded-2xl hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 transition-all group flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-4">
                <div className="bg-gray-100 p-3 rounded-xl group-hover:bg-blue-100 transition-colors">
                    <LayoutGrid size={24} className="text-gray-600 group-hover:text-blue-600" />
                </div>
                <div>
                    <span className="block font-black text-gray-900 group-hover:text-blue-700 text-lg">I am a Recruiter</span>
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Manage jobs & track reputation</span>
                </div>
              </div>
              <ChevronRight size={20} className="text-gray-300 group-hover:text-blue-400" />
            </button>
            <button
              onClick={() => setAuthRole('candidate')}
              className="w-full py-5 px-6 border-2 border-gray-100 rounded-2xl hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 transition-all group flex items-center justify-between text-left"
            >
               <div className="flex items-center gap-4">
                <div className="bg-gray-100 p-3 rounded-xl group-hover:bg-blue-100 transition-colors">
                    <UserIcon size={24} className="text-gray-600 group-hover:text-blue-600" />
                </div>
                <div>
                    <span className="block font-black text-gray-900 group-hover:text-blue-700 text-lg">I am a Candidate</span>
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Find responsive companies</span>
                </div>
              </div>
              <ChevronRight size={20} className="text-gray-300 group-hover:text-blue-400" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="bg-blue-600 p-1.5 rounded-lg">
                         <ShieldCheck className="text-white" size={20} />
                    </div>
                    <span className="font-bold text-gray-900 tracking-tight">ClearPath</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        {user.avatar && <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border border-gray-200 shadow-sm" />}
                        <div className="hidden sm:block text-right">
                             <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                             <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">{user.role}</div>
                        </div>
                    </div>
                    <button 
                        onClick={() => {
                            setUser(null);
                            setAuthRole(null);
                        }}
                        className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                        title="Sign Out"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </div>
        </header>

      <main className="flex-1 overflow-hidden">
        {user.role === 'recruiter' ? (
          <RecruiterDashboard
            jobs={jobs}
            applications={applications}
            onUpdateStatus={handleUpdateStatus}
            onAddJob={handleAddJob}
            onSubscribe={handleSubscribe}
            currentUser={user}
          />
        ) : (
          <CandidateDashboard
            jobs={jobs}
            applications={applications}
            onApply={handleApply}
            onConfirmInterview={handleConfirmInterview}
            currentUser={user}
          />
        )}
      </main>
    </div>
  );
};

export default App;