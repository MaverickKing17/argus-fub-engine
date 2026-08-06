import React, { useState } from 'react';
import { Tenant } from '../types.js';
import { Save, CheckCircle2, Building2, Key, Phone, ShieldCheck, Sparkles } from 'lucide-react';

interface SettingsPanelProps {
  tenant: Tenant;
  onUpdateTenant: (updatedTenant: Tenant) => Promise<void>;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ tenant, onUpdateTenant }) => {
  const [formData, setFormData] = useState<Tenant>({ ...tenant });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

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
    <div className="space-y-5 max-w-4xl mx-auto">
      <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-zinc-100">ISA & Tenant Configuration</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Customize Follow Up Boss credentials, Twilio SMS routing, and Toronto ISA RECO parameters for {tenant.team_name}.
          </p>
        </div>
        {saveSuccess && (
          <div className="bg-emerald-950 text-emerald-400 text-xs px-3 py-1 rounded-md border border-emerald-800 flex items-center space-x-1.5">
            <CheckCircle2 className="h-4 w-4" />
            <span>Settings Saved Successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Section 1: API & Credentials */}
        <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-zinc-200 uppercase tracking-wider border-b border-zinc-800 pb-2.5">
            <Key className="h-4 w-4 text-blue-400" />
            <span>1. API Credentials & Authentication</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Real Estate Team Name
              </label>
              <input
                id="team-name-input"
                type="text"
                value={formData.team_name}
                onChange={(e) => handleChange('team_name', e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 focus:border-blue-500 rounded-md px-3 py-1.5 text-xs text-zinc-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Follow Up Boss (FUB) API Key
              </label>
              <input
                id="fub-api-key-input"
                type="password"
                value={formData.fub_api_key}
                onChange={(e) => handleChange('fub_api_key', e.target.value)}
                placeholder="fk_live_..."
                className="w-full bg-zinc-800 border border-zinc-700 focus:border-blue-500 rounded-md px-3 py-1.5 text-xs text-zinc-100 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Twilio Account SID
              </label>
              <input
                id="twilio-sid-input"
                type="text"
                value={formData.twilio_sid}
                onChange={(e) => handleChange('twilio_sid', e.target.value)}
                placeholder="AC..."
                className="w-full bg-zinc-800 border border-zinc-700 focus:border-blue-500 rounded-md px-3 py-1.5 text-xs text-zinc-100 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Twilio Phone Number
              </label>
              <input
                id="twilio-phone-input"
                type="text"
                value={formData.twilio_phone_number}
                onChange={(e) => handleChange('twilio_phone_number', e.target.value)}
                placeholder="+1416555..."
                className="w-full bg-zinc-800 border border-zinc-700 focus:border-blue-500 rounded-md px-3 py-1.5 text-xs text-zinc-100 focus:outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Toronto ISA Parameters & RECO Rules */}
        <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-zinc-200 uppercase tracking-wider border-b border-zinc-800 pb-2.5">
            <ShieldCheck className="h-4 w-4 text-blue-400" />
            <span>2. Toronto ISA Qualification & RECO Rules</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Target GTA Neighborhoods (comma separated)
              </label>
              <input
                id="target-neighborhoods-input"
                type="text"
                value={formData.isa_settings.targetNeighborhoods.join(', ')}
                onChange={(e) => handleIsaChange('targetNeighborhoods', e.target.value.split(',').map((s) => s.trim()))}
                className="w-full bg-zinc-800 border border-zinc-700 focus:border-blue-500 rounded-md px-3 py-1.5 text-xs text-zinc-100 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Minimum Budget Threshold (CAD)
                </label>
                <input
                  id="min-budget-input"
                  type="number"
                  value={formData.isa_settings.minBudget}
                  onChange={(e) => handleIsaChange('minBudget', Number(e.target.value))}
                  className="w-full bg-zinc-800 border border-zinc-700 focus:border-blue-500 rounded-md px-3 py-1.5 text-xs text-zinc-100 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Maximum Budget Cap (CAD)
                </label>
                <input
                  id="max-budget-input"
                  type="number"
                  value={formData.isa_settings.maxBudget}
                  onChange={(e) => handleIsaChange('maxBudget', Number(e.target.value))}
                  className="w-full bg-zinc-800 border border-zinc-700 focus:border-blue-500 rounded-md px-3 py-1.5 text-xs text-zinc-100 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                RECO Representation Check Wording (Mandatory for Ontario)
              </label>
              <textarea
                id="reco-disclaimer-input"
                rows={2}
                value={formData.isa_settings.recoDisclaimer}
                onChange={(e) => handleIsaChange('recoDisclaimer', e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 focus:border-blue-500 rounded-md px-3 py-1.5 text-xs text-zinc-100 focus:outline-none"
              />
              <p className="text-[11px] text-zinc-500 mt-1">
                Under RECO rules, Gemini ISA must verify if the buyer has signed a Buyer Representation Agreement (BRA) with another brokerage.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                CASL Compliance Opt-In Wording
              </label>
              <textarea
                id="casl-notice-input"
                rows={2}
                value={formData.isa_settings.caslOptInNotice}
                onChange={(e) => handleIsaChange('caslOptInNotice', e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 focus:border-blue-500 rounded-md px-3 py-1.5 text-xs text-zinc-100 focus:outline-none"
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
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-md text-xs shadow-sm flex items-center space-x-2 transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? 'Saving Changes...' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
