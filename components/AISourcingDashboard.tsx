
import React, { useState } from 'react';
import { User, SourcingAgent, Job, ExternalCandidate, Application } from '../types';
import { MOCK_EXTERNAL_CANDIDATES } from '../constants';
// Added Clock to the import list from lucide-react
import { Bot, Plus, Search, Activity, Power, MessageSquare, TrendingUp, Cpu, Target, Loader2, Sparkles, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { scoreCandidateMatch } from '../services/geminiService';

interface AISourcingDashboardProps {
  currentUser: User;
  jobs: Job[];
  agents: SourcingAgent[];
  onAddAgent: (agent: Omit<SourcingAgent, 'id'>) => void;
  onToggleAgent: (agentId: string) => void;
  onFoundMatch: (jobId: string, candidate: ExternalCandidate, score: number, reason: string) => void;
}

export const AISourcingDashboard: React.FC<AISourcingDashboardProps> = ({ currentUser, jobs, agents, onAddAgent, onToggleAgent, onFoundMatch }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [showNewAgent, setShowNewAgent] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(jobs[0]?.id || '');

  const subscription = currentUser.subscription;
  const isSubscribed = subscription && subscription.status === 'active';

  const handleRunScan = async () => {
    if (!isSubscribed) return;
    setIsScanning(true);
    
    // Simulate AI scan logic
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const activeAgents = agents.filter(a => a.status === 'active');
    for (const agent of activeAgents) {
      const job = jobs.find(j => j.id === agent.jobId);
      if (!job) continue;
      
      // Randomly pick one external candidate to "source"
      const candidate = MOCK_EXTERNAL_CANDIDATES[Math.floor(Math.random() * MOCK_EXTERNAL_CANDIDATES.length)];
      
      // Use AI to score
      const result = await scoreCandidateMatch(candidate, job);
      
      if (result.score > 70) {
        onFoundMatch(job.id, candidate, result.score, result.reason);
      }
    }
    
    setIsScanning(false);
  };

  if (!isSubscribed) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200">
        <div className="w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-6 text-gray-300">
          <Bot size={40} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">AI Sourcing is Locked</h3>
        <p className="text-gray-500 max-w-sm mb-8">
          Unlock 24/7 autonomous sourcing agents that find the best candidates while you sleep.
        </p>
        <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
          Explore SaaS Plans
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Active Agents</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-black text-gray-900">{agents.filter(a => a.status === 'active').length}</p>
            <div className="bg-green-50 text-green-600 p-1.5 rounded-lg">
              <Activity size={18} />
            </div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Credits Used</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-black text-gray-900">{subscription?.usage.outreachCredits} / {subscription?.usage.maxOutreachCredits}</p>
            <div className="bg-blue-50 text-blue-600 p-1.5 rounded-lg">
              <MessageSquare size={18} />
            </div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Matches</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-black text-gray-900">{agents.reduce((acc, a) => acc + a.matchesFound, 0)}</p>
            <div className="bg-purple-50 text-purple-600 p-1.5 rounded-lg">
              <TrendingUp size={18} />
            </div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Agent Tier</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-black text-amber-600">{subscription?.tier}</p>
            <div className="bg-amber-50 text-amber-600 p-1.5 rounded-lg">
              <Sparkles size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Agents List */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Cpu size={20} className="text-blue-600" /> Sourcing Agents
            </h3>
            <button 
              onClick={() => setShowNewAgent(true)}
              className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={18} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto min-h-[400px]">
            {agents.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-400 text-sm font-medium">No agents deployed. Start by adding one for your open roles.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {agents.map(agent => {
                  const job = jobs.find(j => j.id === agent.jobId);
                  return (
                    <div key={agent.id} className="p-5 hover:bg-gray-50/50 transition-colors group">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm">{job?.title}</h4>
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{job?.company}</p>
                        </div>
                        <button 
                          onClick={() => onToggleAgent(agent.id)}
                          className={`p-1.5 rounded-lg transition-colors ${agent.status === 'active' ? 'text-green-600 bg-green-50' : 'text-gray-400 bg-gray-100'}`}
                        >
                          <Power size={14} />
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${agent.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                          <span className="text-[11px] font-bold text-gray-500 uppercase">{agent.status}</span>
                        </div>
                        <div className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          {agent.matchesFound} Matches Found
                        </div>
                        <div className="text-[11px] font-medium text-gray-400 flex items-center gap-1">
                          {/* Fixed: Clock icon is now imported correctly */}
                          <Clock size={12} /> Last scan: {agent.lastScanAt === 'never' ? 'Just now' : '10m ago'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Action Center */}
        <div className="w-full md:w-[360px] space-y-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 text-white shadow-xl">
             <div className="flex items-center gap-3 mb-4">
                <div className="bg-white/10 p-2 rounded-xl">
                  <Cpu size={24} />
                </div>
                <div>
                   <h3 className="font-bold">Agent Control</h3>
                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Autonomous Sourcing</p>
                </div>
             </div>
             
             <p className="text-sm text-gray-300 mb-6 leading-relaxed">
               Run a manual cross-platform scan now to force your agents to find immediate high-fit matches.
             </p>

             <button 
                onClick={handleRunScan}
                disabled={isScanning || agents.length === 0}
                className="w-full py-4 bg-white text-gray-900 rounded-2xl font-black text-sm hover:bg-gray-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
             >
               {isScanning ? (
                 <>
                   <Loader2 size={18} className="animate-spin" />
                   Scanning Talent Pools...
                 </>
               ) : (
                 <>
                   <Target size={18} />
                   Trigger AI Scan
                 </>
               )}
             </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
             <h4 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
                <AlertCircle size={16} className="text-amber-500" /> System Insights
             </h4>
             <div className="space-y-4">
                <div className="flex gap-3 items-start">
                   <div className="bg-blue-50 text-blue-600 p-1.5 rounded-lg shrink-0">
                      <Target size={14} />
                   </div>
                   <div>
                      <p className="text-xs font-bold text-gray-800">High-fit lead detected</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">Jordan Rivera matches "Senior Frontend" (94% score).</p>
                   </div>
                </div>
                <div className="flex gap-3 items-start">
                   <div className="bg-green-50 text-green-600 p-1.5 rounded-lg shrink-0">
                      <CheckCircle size={14} />
                   </div>
                   <div>
                      <p className="text-xs font-bold text-gray-800">Auto-Outreach Successful</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">3 messages delivered to new matches in the last hour.</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* New Agent Modal (Inline simplification for speed) */}
      {showNewAgent && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
           <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-300">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                 <h3 className="font-bold text-gray-900">Configure AI Sourcing Agent</h3>
                 <button onClick={() => setShowNewAgent(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-4">
                 <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Target Job</label>
                    <select 
                      value={selectedJobId}
                      onChange={(e) => setSelectedJobId(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                       {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
                    </select>
                 </div>
                 
                 <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Seniority</label>
                        <select className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                            <option>Senior</option>
                            <option>Mid-level</option>
                            <option>Junior</option>
                            <option>Director+</option>
                        </select>
                    </div>
                    <div className="flex-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Outreach</label>
                        <div className="h-[46px] flex items-center">
                            <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            <span className="ml-2 text-xs font-bold text-gray-600">Auto-Email</span>
                        </div>
                    </div>
                 </div>

                 <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                    <div className="flex gap-3">
                       <Sparkles size={18} className="text-blue-600 shrink-0" />
                       <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
                          Our AI will scan LinkedIn, GitHub, and 50+ niche talent networks to find candidates that match your specific tech stack.
                       </p>
                    </div>
                 </div>

                 <button 
                    onClick={() => {
                      onAddAgent({
                        jobId: selectedJobId,
                        status: 'active',
                        criteria: { seniority: 'Senior', industry: 'Software', skills: [] },
                        outreachEnabled: true,
                        lastScanAt: 'never',
                        matchesFound: 0
                      });
                      setShowNewAgent(false);
                    }}
                    className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 shadow-lg shadow-blue-200"
                 >
                    Deploy Agent
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

// Internal X helper
const X: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);
