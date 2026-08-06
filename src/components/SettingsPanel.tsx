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
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">ISA & Tenant Configuration</h2>
          <p className="text-xs text-slate-400 mt-1">
            Customize Follow Up Boss credentials, Twilio SMS routing, and Toronto ISA RECO parameters for {tenant.team_name}.
          </p>
        </div>
        {saveSuccess && (
          <div className="bg-emerald-950 text-emerald-400 text-xs px-3 py-1.5 rounded-lg border border-emerald-800 flex items-center space-x-1.5">
            <CheckCircle2 className="h-4 w-4" />
            <span>Settings Saved Successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: API & Credentials */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 text-sm font-bold text-slate-200 border-b border-slate-800 pb-3">
            <Key className="h-4 w-4 text-cyan-400" />
            <span>1. API Credentials & Authentication</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Real Estate Team Name
              </label>
              <input
                id="team-name-input"
                type="text"
                value={formData.team_name}
                onChange={(e) => handleChange('team_name', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 focus:border-cyan-500 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Follow Up Boss (FUB) API Key
              </label>
              <input
                id="fub-api-key-input"
                type="password"
                value={formData.fub_api_key}
                onChange={(e) => handleChange('fub_api_key', e.target.value)}
                placeholder="fk_live_..."
                className="w-full bg-slate-800 border border-slate-700 focus:border-cyan-500 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Twilio Account SID
              </label>
              <input
                id="twilio-sid-input"
                type="text"
                value={formData.twilio_sid}
                onChange={(e) => handleChange('twilio_sid', e.target.value)}
                placeholder="AC..."
                className="w-full bg-slate-800 border border-slate-700 focus:border-cyan-500 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Twilio Phone Number
              </label>
              <input
                id="twilio-phone-input"
                type="text"
                value={formData.twilio_phone_number}
                onChange={(e) => handleChange('twilio_phone_number', e.target.value)}
                placeholder="+1416555..."
                className="w-full bg-slate-800 border border-slate-700 focus:border-cyan-500 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Toronto ISA Parameters & RECO Rules */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 text-sm font-bold text-slate-200 border-b border-slate-800 pb-3">
            <ShieldCheck className="h-4 w-4 text-cyan-400" />
            <span>2. Toronto ISA Qualification & RECO Rules</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Target GTA Neighborhoods (comma separated)
              </label>
              <input
                id="target-neighborhoods-input"
                type="text"
                value={formData.isa_settings.targetNeighborhoods.join(', ')}
                onChange={(e) => handleIsaChange('targetNeighborhoods', e.target.value.split(',').map((s) => s.trim()))}
                className="w-full bg-slate-800 border border-slate-700 focus:border-cyan-500 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Minimum Budget Threshold (CAD)
                </label>
                <input
                  id="min-budget-input"
                  type="number"
                  value={formData.isa_settings.minBudget}
                  onChange={(e) => handleIsaChange('minBudget', Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 focus:border-cyan-500 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Maximum Budget Cap (CAD)
                </label>
                <input
                  id="max-budget-input"
                  type="number"
                  value={formData.isa_settings.maxBudget}
                  onChange={(e) => handleIsaChange('maxBudget', Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 focus:border-cyan-500 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                RECO Representation Check Wording (Mandatory for Ontario)
              </label>
              <textarea
                id="reco-disclaimer-input"
                rows={2}
                value={formData.isa_settings.recoDisclaimer}
                onChange={(e) => handleIsaChange('recoDisclaimer', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 focus:border-cyan-500 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Under RECO rules, Gemini ISA must verify if the buyer has signed a Buyer Representation Agreement (BRA) with another brokerage.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                CASL Compliance Opt-In Wording
              </label>
              <textarea
                id="casl-notice-input"
                rows={2}
                value={formData.isa_settings.caslOptInNotice}
                onChange={(e) => handleIsaChange('caslOptInNotice', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 focus:border-cyan-500 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none"
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
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold px-6 py-2.5 rounded-xl shadow-lg shadow-cyan-950 flex items-center space-x-2 transition-all disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? 'Saving Changes...' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
