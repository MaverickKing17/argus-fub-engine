import React, { useState } from 'react';
import { Tenant } from '../types.js';
import { Save, CheckCircle2, Building2, Key, Phone, ShieldCheck, Sparkles, Eye, EyeOff, Lock } from 'lucide-react';

interface SettingsPanelProps {
  tenant: Tenant;
  onUpdateTenant: (updatedTenant: Tenant) => Promise<void>;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ tenant, onUpdateTenant }) => {
  const [formData, setFormData] = useState<Tenant>({ ...tenant });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Security Masking Toggles
  const [showFubKey, setShowFubKey] = useState(false);
  const [showTwilioSid, setShowTwilioSid] = useState(false);
  const [showTwilioToken, setShowTwilioToken] = useState(false);

  const maskString = (str: string) => {
    if (!str || str.length <= 8) return '••••••••••••';
    return `${str.substring(0, 8)}••••••••••••${str.substring(str.length - 4)}`;
  };

  const handleChange = (field: keyof Tenant, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleIsaChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      isa_settings: {
        ...prev.isa_settings,
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await onUpdateTenant(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans">
      <div className="card-pop p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#F8FAFC] flex items-center space-x-2">
            <span>ISA & Tenant Configuration</span>
            <span className="bg-[#10B981]/20 text-[#10B981] text-[10px] px-2.5 py-0.5 rounded-full border border-[#10B981]/40 flex items-center gap-1 font-mono">
              <Lock className="h-3 w-3" /> Encrypted & Masked
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-[#CBD5E1] font-medium mt-1 leading-relaxed">
            Manage credentials, Twilio SMS routing, and Ontario TRESA & RECO compliance rules for {tenant.team_name}.
          </p>
        </div>
        {saveSuccess && (
          <div className="bg-[#10B981]/20 text-[#10B981] text-xs px-3.5 py-1.5 rounded-lg border border-[#10B981]/40 flex items-center space-x-1.5 font-semibold shrink-0">
            <CheckCircle2 className="h-4 w-4" />
            <span>Settings Saved Successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: API & Credentials */}
        <div className="card-executive p-6 space-y-5">
          <div className="flex items-center space-x-2 text-xs font-bold text-[#F8FAFC] uppercase tracking-wider border-b border-white/[0.08] pb-3">
            <Key className="h-4 w-4 text-[#E5C178]" />
            <span>1. API Credentials & Authentication (Masked Vault)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label className="block text-xs font-semibold text-[#F8FAFC] mb-1.5">
                Real Estate Team Name
              </label>
              <input
                id="team-name-input"
                type="text"
                value={formData.team_name}
                onChange={(e) => handleChange('team_name', e.target.value)}
                className="w-full bg-[#071524] border border-white/[0.1] focus:border-[#E5C178] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#F8FAFC] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#F8FAFC] mb-1.5">
                Follow Up Boss (FUB) API Key
              </label>
              <div className="relative">
                <input
                  id="fub-api-key-input"
                  type={showFubKey ? "text" : "password"}
                  value={formData.fub_api_key}
                  onChange={(e) => handleChange('fub_api_key', e.target.value)}
                  placeholder="fub_live_..."
                  className="w-full bg-[#071524] border border-white/[0.1] focus:border-[#E5C178] rounded-xl px-3.5 py-2.5 pr-10 text-xs sm:text-sm text-[#F8FAFC] focus:outline-none font-mono transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowFubKey(!showFubKey)}
                  className="absolute right-3 top-2.5 text-[#CBD5E1] hover:text-white transition-colors cursor-pointer"
                >
                  {showFubKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-[10px] font-mono text-[#CBD5E1] mt-1 font-medium">
                Masked Preview: {maskString(formData.fub_api_key)}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#F8FAFC] mb-1.5">
                Twilio Account SID
              </label>
              <div className="relative">
                <input
                  id="twilio-sid-input"
                  type={showTwilioSid ? "text" : "password"}
                  value={formData.twilio_sid}
                  onChange={(e) => handleChange('twilio_sid', e.target.value)}
                  placeholder="AC..."
                  className="w-full bg-[#071524] border border-white/[0.1] focus:border-[#E5C178] rounded-xl px-3.5 py-2.5 pr-10 text-xs sm:text-sm text-[#F8FAFC] focus:outline-none font-mono transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowTwilioSid(!showTwilioSid)}
                  className="absolute right-3 top-2.5 text-[#CBD5E1] hover:text-white transition-colors cursor-pointer"
                >
                  {showTwilioSid ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-[10px] font-mono text-[#CBD5E1] mt-1 font-medium">
                Masked Preview: {maskString(formData.twilio_sid)}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#F8FAFC] mb-1.5">
                Twilio Auth Token
              </label>
              <div className="relative">
                <input
                  id="twilio-token-input"
                  type={showTwilioToken ? "text" : "password"}
                  value={formData.twilio_auth_token}
                  onChange={(e) => handleChange('twilio_auth_token', e.target.value)}
                  placeholder="tw_auth_..."
                  className="w-full bg-[#071524] border border-white/[0.1] focus:border-[#E5C178] rounded-xl px-3.5 py-2.5 pr-10 text-xs sm:text-sm text-[#F8FAFC] focus:outline-none font-mono transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowTwilioToken(!showTwilioToken)}
                  className="absolute right-3 top-2.5 text-[#CBD5E1] hover:text-white transition-colors cursor-pointer"
                >
                  {showTwilioToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#F8FAFC] mb-1.5">
                Twilio Phone Number
              </label>
              <input
                id="twilio-phone-input"
                type="text"
                value={formData.twilio_phone_number}
                onChange={(e) => handleChange('twilio_phone_number', e.target.value)}
                placeholder="+1416555..."
                className="w-full bg-[#071524] border border-white/[0.1] focus:border-[#E5C178] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#F8FAFC] focus:outline-none font-mono transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Toronto ISA Parameters & TRESA Rules */}
        <div className="card-executive p-6 space-y-5">
          <div className="flex items-center space-x-2 text-xs font-bold text-[#F8FAFC] uppercase tracking-wider border-b border-white/[0.08] pb-3">
            <ShieldCheck className="h-4 w-4 text-[#E5C178]" />
            <span>2. Toronto ISA Qualification & TRESA & RECO Rules</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#F8FAFC] mb-1.5">
                Target GTA Neighborhoods (comma separated)
              </label>
              <input
                id="target-neighborhoods-input"
                type="text"
                value={formData.isa_settings.targetNeighborhoods.join(', ')}
                onChange={(e) => handleIsaChange('targetNeighborhoods', e.target.value.split(',').map((s) => s.trim()))}
                className="w-full bg-[#071524] border border-white/[0.1] focus:border-[#E5C178] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#F8FAFC] focus:outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              <div>
                <label className="block text-xs font-semibold text-[#F8FAFC] mb-1.5">
                  Minimum Budget Threshold (CAD)
                </label>
                <input
                  id="min-budget-input"
                  type="number"
                  value={formData.isa_settings.minBudget}
                  onChange={(e) => handleIsaChange('minBudget', Number(e.target.value))}
                  className="w-full bg-[#071524] border border-white/[0.1] focus:border-[#E5C178] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#F8FAFC] focus:outline-none font-mono transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#F8FAFC] mb-1.5">
                  Maximum Budget Cap (CAD)
                </label>
                <input
                  id="max-budget-input"
                  type="number"
                  value={formData.isa_settings.maxBudget}
                  onChange={(e) => handleIsaChange('maxBudget', Number(e.target.value))}
                  className="w-full bg-[#071524] border border-white/[0.1] focus:border-[#E5C178] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#F8FAFC] focus:outline-none font-mono transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#F8FAFC] mb-1.5">
                TRESA & RECO Representation Check Wording (Mandatory for Ontario)
              </label>
              <textarea
                id="reco-disclaimer-input"
                rows={2}
                value={formData.isa_settings.recoDisclaimer}
                onChange={(e) => handleIsaChange('recoDisclaimer', e.target.value)}
                className="w-full bg-[#071524] border border-white/[0.1] focus:border-[#E5C178] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#F8FAFC] focus:outline-none transition-colors"
              />
              <p className="text-[11px] text-[#CBD5E1] mt-1.5 font-medium leading-relaxed">
                Under Ontario TRESA regulations, Gemini ISA must verify if the buyer has signed a Buyer Representation Agreement (BRA) with another brokerage before offering representation or advice.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#F8FAFC] mb-1.5">
                CASL Compliance Opt-In Wording
              </label>
              <textarea
                id="casl-notice-input"
                rows={2}
                value={formData.isa_settings.caslOptInNotice}
                onChange={(e) => handleIsaChange('caslOptInNotice', e.target.value)}
                className="w-full bg-[#071524] border border-white/[0.1] focus:border-[#E5C178] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#F8FAFC] focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            id="save-tenant-settings-btn"
            type="submit"
            disabled={isSaving}
            className="btn-executive-primary px-7 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 disabled:opacity-50 cursor-pointer shadow-lg"
          >
            <Save className="h-4 w-4 text-[#050B14]" />
            <span>{isSaving ? 'Saving Changes...' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );

};
