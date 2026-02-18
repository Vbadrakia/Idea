import React, { useState } from 'react';
import { CareerPath, CareerMilestone } from '../types';
import { MOCK_CAREER_PATHS } from '../constants';
import { ChevronRight, Target, DollarSign, Calendar, Zap, Sparkles, Loader2, Info, CheckCircle2 } from 'lucide-react';
import { generateCareerStrategy } from '../services/geminiService';

interface CareerMapProps {
  userSkills: string[];
}

export const CareerMap: React.FC<CareerMapProps> = ({ userSkills }) => {
  const [selectedPath, setSelectedPath] = useState<CareerPath>(MOCK_CAREER_PATHS[0]);
  const [selectedMilestone, setSelectedMilestone] = useState<CareerMilestone | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [goals, setGoals] = useState<string[]>([]);

  const toggleGoal = (milestoneId: string) => {
    if (goals.includes(milestoneId)) {
      setGoals(goals.filter(id => id !== milestoneId));
    } else {
      setGoals([...goals, milestoneId]);
    }
  };

  const handleGetAdvice = async (milestone: CareerMilestone) => {
    setIsGenerating(true);
    setAiAdvice(null);
    const advice = await generateCareerStrategy(userSkills, milestone.title);
    setAiAdvice(advice);
    setIsGenerating(false);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      {/* Path Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {MOCK_CAREER_PATHS.map(path => (
          <button
            key={path.id}
            onClick={() => {
              setSelectedPath(path);
              setSelectedMilestone(null);
              setAiAdvice(null);
            }}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
              selectedPath.id === path.id
                ? 'bg-violet-600 text-white border-violet-600 shadow-lg shadow-violet-200'
                : 'bg-white text-gray-600 border-gray-200 hover:border-violet-300'
            }`}
          >
            {path.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Roadmap Visual */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-8">
             <div className="p-2 bg-violet-100 rounded-lg text-violet-600">
                <Target size={20} />
             </div>
             <div>
                <h3 className="font-bold text-gray-900">{selectedPath.name} Roadmap</h3>
                <p className="text-xs text-gray-500">Visualize your path to {selectedPath.milestones[selectedPath.milestones.length - 1].title}</p>
             </div>
          </div>

          <div className="relative space-y-12 before:absolute before:inset-0 before:left-6 before:-z-10 before:h-full before:w-1 before:bg-gradient-to-b before:from-violet-500 before:via-violet-300 before:to-gray-100">
            {selectedPath.milestones.map((milestone, index) => {
              const isGoal = goals.includes(milestone.id);
              const isSelected = selectedMilestone?.id === milestone.id;
              
              return (
                <div key={milestone.id} className="relative pl-14">
                  {/* Timeline Node */}
                  <div 
                    onClick={() => setSelectedMilestone(milestone)}
                    className={`absolute left-0 top-1 w-12 h-12 rounded-full border-4 border-white shadow-md flex items-center justify-center cursor-pointer transition-all hover:scale-110 ${
                      isSelected ? 'bg-violet-600 text-white ring-4 ring-violet-100' : isGoal ? 'bg-green-500 text-white' : 'bg-white text-violet-600'
                    }`}
                  >
                    {isGoal ? <CheckCircle2 size={24} /> : <span className="font-bold text-sm">Lv{index + 1}</span>}
                  </div>

                  {/* Milestone Card */}
                  <div 
                    onClick={() => setSelectedMilestone(milestone)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected ? 'border-violet-600 bg-violet-50/50 ring-1 ring-violet-200 shadow-md' : 'border-gray-100 bg-white hover:border-violet-200'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-bold text-violet-500 uppercase tracking-widest">{milestone.level}</p>
                            <h4 className="font-bold text-gray-900">{milestone.title}</h4>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-bold text-gray-900">${(milestone.minSalary/1000).toFixed(0)}k - ${(milestone.maxSalary/1000).toFixed(0)}k</p>
                            <p className="text-[10px] text-gray-400 font-medium">Est. Target Salary</p>
                        </div>
                    </div>
                    
                    <div className="mt-3 flex items-center gap-4">
                        <div className="flex items-center gap-1 text-[11px] text-gray-500 font-medium">
                            <Calendar size={12} /> {milestone.avgYears} Year{milestone.avgYears > 1 ? 's' : ''} avg.
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-violet-600 font-bold bg-violet-50 px-2 py-0.5 rounded">
                            <Zap size={10} /> {milestone.requiredSkills.length} Core Skills
                        </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Milestone Detail & AI Advisor */}
        <div className="space-y-6">
          {selectedMilestone ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-24 animate-in slide-in-from-right-4 duration-300">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-gray-900">Role Deep Dive</h3>
                  <button 
                    onClick={() => toggleGoal(selectedMilestone.id)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        goals.includes(selectedMilestone.id) 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-600 hover:bg-violet-100 hover:text-violet-700'
                    }`}
                  >
                    <Target size={14} /> {goals.includes(selectedMilestone.id) ? 'Goal Set' : 'Set as Goal'}
                  </button>
               </div>

               <div className="space-y-6">
                  <div>
                     <p className="text-xs font-bold text-gray-400 uppercase mb-2">Description</p>
                     <p className="text-sm text-gray-600 leading-relaxed">{selectedMilestone.description}</p>
                  </div>

                  <div>
                     <p className="text-xs font-bold text-gray-400 uppercase mb-3">Skill Benchmarks</p>
                     <div className="flex flex-wrap gap-2">
                        {selectedMilestone.requiredSkills.map(skill => {
                            const hasSkill = userSkills.some(s => s.toLowerCase().includes(skill.toLowerCase()));
                            return (
                                <span key={skill} className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border ${
                                    hasSkill ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-500'
                                }`}>
                                    {hasSkill && <CheckCircle2 size={12} />}
                                    {skill}
                                </span>
                            );
                        })}
                     </div>
                  </div>

                  <div className="p-4 bg-violet-50 rounded-xl border border-violet-100">
                     <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="text-violet-600" size={16} />
                        <span className="text-xs font-bold text-violet-800 uppercase tracking-wider">AI Growth Strategy</span>
                     </div>
                     
                     {aiAdvice ? (
                        <div className="text-xs text-violet-700 leading-relaxed whitespace-pre-wrap font-medium">
                            {aiAdvice}
                        </div>
                     ) : (
                        <button 
                           onClick={() => handleGetAdvice(selectedMilestone)}
                           disabled={isGenerating}
                           className="w-full py-2 bg-violet-600 text-white rounded-lg text-xs font-bold hover:bg-violet-700 transition-all flex items-center justify-center gap-2 shadow-md shadow-violet-200"
                        >
                           {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                           Analyze my path to {selectedMilestone.level}
                        </button>
                     )}
                  </div>
               </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-dashed border-gray-200 rounded-2xl p-8 text-center h-full flex flex-col items-center justify-center">
               <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-300 shadow-sm mb-4">
                  <Info size={24} />
               </div>
               <p className="text-gray-400 font-bold text-sm">Select a milestone on the map to see details and AI career advice.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};