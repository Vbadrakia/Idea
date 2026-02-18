import React from 'react';
import { SUBSCRIPTION_TIERS } from '../constants';
import { ShieldCheck, Check, Sparkles, Zap, Globe, Cpu } from 'lucide-react';
import { User, RecruiterSubscription } from '../types';

interface SubscriptionManagerProps {
  currentUser: User;
  onSubscribe: (tier: string) => void;
}

export const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({ currentUser, onSubscribe }) => {
  const currentTier = currentUser.subscription?.tier || 'none';

  return (
    <div className="max-w-6xl mx-auto p-6 animate-in fade-in duration-500">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold border border-blue-100 mb-4">
          <Sparkles size={16} /> AI-Powered Sourcing Agents
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-4">Scale Your Talent Acquisition</h2>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
          Supercharge your recruitment with autonomous AI agents that find, rank, and engage top talent 24/7.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {SUBSCRIPTION_TIERS.map((tier) => (
          <div 
            key={tier.id} 
            className={`relative flex flex-col p-8 bg-white rounded-3xl border transition-all ${
              currentTier.toLowerCase() === tier.id 
                ? 'border-blue-500 ring-4 ring-blue-50 shadow-xl' 
                : 'border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200'
            }`}
          >
            {currentTier.toLowerCase() === tier.id && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black uppercase px-4 py-1 rounded-full shadow-lg">
                Current Plan
              </div>
            )}
            
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{tier.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-gray-900">{tier.price}</span>
                {tier.price !== 'Custom' && <span className="text-gray-400 font-medium">/mo</span>}
              </div>
            </div>

            <ul className="space-y-4 mb-10 flex-1">
              {tier.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                  <div className="mt-0.5 bg-blue-50 text-blue-600 rounded-full p-0.5">
                    <Check size={14} />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => onSubscribe(tier.id)}
              disabled={currentTier.toLowerCase() === tier.id}
              className={`w-full py-4 rounded-2xl font-bold text-sm transition-all ${
                currentTier.toLowerCase() === tier.id
                  ? 'bg-gray-100 text-gray-400 cursor-default'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-95'
              }`}
            >
              {currentTier.toLowerCase() === tier.id ? 'Active' : tier.price === 'Custom' ? 'Contact Sales' : 'Upgrade Plan'}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { icon: Cpu, title: ' Explainable AI', desc: 'Score candidates with detailed matching rationale.' },
          { icon: Globe, title: 'Global Sourcing', desc: 'Continuous scan of 50+ talent platforms.' },
          { icon: Zap, title: 'Instant Outreach', desc: 'Automated personalized sequences for high-fit leads.' }
        ].map((feat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
            <div className="bg-blue-50 text-blue-600 p-2.5 rounded-xl">
              <feat.icon size={20} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm mb-1">{feat.title}</h4>
              <p className="text-xs text-gray-500 leading-relaxed">{feat.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};