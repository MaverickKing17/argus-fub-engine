import React, { useState, useEffect } from 'react';
import { Database, Copy, Check, Code, Layers, ShieldCheck, Download } from 'lucide-react';

export const SchemaViewer: React.FC = () => {
  const [sqlContent, setSqlContent] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch('/api/v1/db/schema')
      .then((res) => res.text())
      .then((text) => setSqlContent(text))
      .catch((err) => console.error('Failed to load SQL schema:', err));
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([sqlContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '001_argus_initial_schema.sql';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
            <Database className="h-3.5 w-3.5" />
            <span>PostgreSQL / Supabase Migration DDL</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100">Multi-Tenant Database Architecture</h2>
          <p className="text-xs text-slate-400 mt-1">
            SQL schema migration for tenants, leads, messages, indexes, and RECO qualification stage constraints.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            id="copy-sql-migration-btn"
            onClick={handleCopy}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3.5 py-2 rounded-xl border border-slate-700 flex items-center space-x-1.5 transition-colors"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4 text-slate-400" />}
            <span>{copied ? 'Copied SQL!' : 'Copy DDL'}</span>
          </button>
          <button
            id="download-sql-migration-btn"
            onClick={handleDownload}
            className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-lg shadow-cyan-950 flex items-center space-x-1.5 transition-all"
          >
            <Download className="h-4 w-4" />
            <span>Download .sql</span>
          </button>
        </div>
      </div>

      {/* ERD Relationship Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Table 1 */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center space-x-2 text-cyan-400 font-bold text-sm">
            <Layers className="h-4 w-4" />
            <span>1. tenants</span>
          </div>
          <p className="text-xs text-slate-400">Stores real estate team profiles, FUB keys, Twilio credentials, and custom ISA settings.</p>
          <div className="text-[11px] text-slate-500 font-mono bg-slate-950 p-2 rounded border border-slate-800">
            Primary Key: id (VARCHAR)
          </div>
        </div>

        {/* Table 2 */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
            <Layers className="h-4 w-4" />
            <span>2. leads</span>
          </div>
          <p className="text-xs text-slate-400">Tracks inbound buyer/seller leads, qualification stage, timeline, budget, and RECO BRA status.</p>
          <div className="text-[11px] text-slate-500 font-mono bg-slate-950 p-2 rounded border border-slate-800">
            Foreign Key: tenant_id -&gt; tenants(id)
          </div>
        </div>

        {/* Table 3 */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center space-x-2 text-purple-400 font-bold text-sm">
            <Layers className="h-4 w-4" />
            <span>3. messages</span>
          </div>
          <p className="text-xs text-slate-400">Multi-turn SMS conversation history between Gemini ISA and prospects with AI rationale.</p>
          <div className="text-[11px] text-slate-500 font-mono bg-slate-950 p-2 rounded border border-slate-800">
            Foreign Key: lead_id -&gt; leads(id)
          </div>
        </div>
      </div>

      {/* Code Viewer Container */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
        <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
          <div className="flex items-center space-x-2">
            <Code className="h-4 w-4 text-cyan-400" />
            <span>001_initial_schema.sql</span>
          </div>
          <span className="text-emerald-400 font-bold">PostgreSQL Standard DDL</span>
        </div>
        <pre className="p-6 text-xs font-mono text-cyan-200/90 leading-relaxed overflow-x-auto max-h-[500px] scrollbar-thin select-all">
          {sqlContent || '-- Loading schema definition...'}
        </pre>
      </div>
    </div>
  );
};
