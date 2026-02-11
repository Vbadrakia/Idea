import React, { useState } from 'react';
import { MOCK_APPLICATIONS, MOCK_JOBS } from './constants';
import { Application, ApplicationStatus, User, Job } from './types';
import { RecruiterDashboard } from './components/RecruiterDashboard';
import { CandidateDashboard } from './components/CandidateDashboard';
import { AuthScreen } from './components/AuthScreen';
import { LayoutGrid, User as UserIcon, ShieldCheck, LogOut } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authRole, setAuthRole] = useState<'candidate' | 'recruiter' | null>(null); // Controls which auth screen to show
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [applications, setApplications] = useState<Application[]>(MOCK_APPLICATIONS);

  const handleUpdateStatus = (appId: string, status: ApplicationStatus, feedback?: string) => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        return { ...app, status, feedback };
      }
      return app;
    }));
  };

  const handleApply = (jobId: string, resumeFile: File) => {
    if (!user) return;
    
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;

    // Check if already applied
    if (applications.some(a => a.jobId === jobId && a.candidateId === user.id)) {
        alert("You have already applied for this job.");
        return;
    }

    // Create a fake URL for the uploaded file (blob URL)
    // In a real app, this would be an S3/storage link
    const resumeLink = URL.createObjectURL(resumeFile);

    const newApp: Application = {
      id: `new_${Date.now()}`,
      jobId: jobId,
      candidateId: user.id,
      candidateName: user.name,
      candidateEmail: user.email,
      appliedAt: new Date().toISOString(),
      status: ApplicationStatus.APPLIED,
      skills: ['React', 'TypeScript'], // In a real app, this would come from user profile
      resumeLink: resumeLink
    };
    setApplications([newApp, ...applications]);
    alert("Application submitted successfully!");
  };

  const handleAddJob = (jobData: Omit<Job, 'id'>) => {
    const newJob: Job = {
        ...jobData,
        id: `j${Date.now()}`,
    };
    setJobs([newJob, ...jobs]);
  };

  // Auth Flow Handling
  if (authRole && !user) {
      return <AuthScreen role={authRole} onLogin={setUser} onBack={() => setAuthRole(null)} />;
  }

  // Landing Page
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-blue-200">
                <ShieldCheck className="text-white" size={32} />
            </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ClearPath Recruit</h1>
          <p className="text-gray-500 mb-8">The transparent recruitment platform where feedback is standard, not optional.</p>
          
          <div className="space-y-3">
            <button
              onClick={() => setAuthRole('recruiter')}
              className="w-full py-4 px-6 border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 transition-all group flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 p-2 rounded-lg group-hover:bg-blue-100">
                    <LayoutGrid size={20} />
                </div>
                <div className="text-left">
                    <span className="block font-semibold text-gray-900 group-hover:text-blue-700">I am a Recruiter</span>
                    <span className="text-xs text-gray-500">Manage jobs & provide feedback</span>
                </div>
              </div>
            </button>
            <button
              onClick={() => setAuthRole('candidate')}
              className="w-full py-4 px-6 border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 transition-all group flex items-center justify-between"
            >
               <div className="flex items-center gap-3">
                <div className="bg-gray-100 p-2 rounded-lg group-hover:bg-blue-100">
                    <UserIcon size={20} />
                </div>
                <div className="text-left">
                    <span className="block font-semibold text-gray-900 group-hover:text-blue-700">I am a Candidate</span>
                    <span className="text-xs text-gray-500">Find jobs & track status</span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Application
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="bg-blue-600 p-1.5 rounded-lg">
                         <ShieldCheck className="text-white" size={20} />
                    </div>
                    <span className="font-bold text-gray-900 tracking-tight">ClearPath</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        {user.avatar && <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border border-gray-200" />}
                        <div className="hidden sm:block text-right">
                             <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                             <div className="text-xs text-gray-500 capitalize">{user.role}</div>
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
            currentUser={user}
          />
        ) : (
          <CandidateDashboard
            jobs={jobs}
            applications={applications}
            onApply={handleApply}
            currentUser={user}
          />
        )}
      </main>
    </div>
  );
};

export default App;