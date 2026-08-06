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
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">
            <Database className="h-3.5 w-3.5" />
            <span>PostgreSQL / Supabase Migration DDL</span>
          </div>
          <h2 className="text-lg font-bold text-zinc-100">Multi-Tenant Database Architecture</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            SQL schema migration for tenants, leads, messages, indexes, and RECO qualification stage constraints.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            id="copy-sql-migration-btn"
            onClick={handleCopy}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold px-3.5 py-1.5 rounded-md border border-zinc-700 flex items-center space-x-1.5 transition-colors"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4 text-zinc-400" />}
            <span>{copied ? 'Copied SQL!' : 'Copy DDL'}</span>
          </button>
          <button
            id="download-sql-migration-btn"
            onClick={handleDownload}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-1.5 rounded-md shadow-sm flex items-center space-x-1.5 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Download .sql</span>
          </button>
        </div>
      </div>

      {/* ERD Relationship Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Table 1 */}
        <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 shadow-sm space-y-2">
          <div className="flex items-center space-x-2 text-blue-400 font-bold text-xs">
            <Layers className="h-4 w-4" />
            <span>1. tenants</span>
          </div>
          <p className="text-xs text-zinc-400">Stores real estate team profiles, FUB keys, Twilio credentials, and custom ISA settings.</p>
          <div className="text-[11px] text-zinc-500 font-mono bg-zinc-950 p-2 rounded border border-zinc-800">
            Primary Key: id (VARCHAR)
          </div>
        </div>

        {/* Table 2 */}
        <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 shadow-sm space-y-2">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
            <Layers className="h-4 w-4" />
            <span>2. leads</span>
          </div>
          <p className="text-xs text-zinc-400">Tracks inbound buyer/seller leads, qualification stage, timeline, budget, and RECO BRA status.</p>
          <div className="text-[11px] text-zinc-500 font-mono bg-zinc-950 p-2 rounded border border-zinc-800">
            Foreign Key: tenant_id -&gt; tenants(id)
          </div>
        </div>

        {/* Table 3 */}
        <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 shadow-sm space-y-2">
          <div className="flex items-center space-x-2 text-purple-400 font-bold text-xs">
            <Layers className="h-4 w-4" />
            <span>3. messages</span>
          </div>
          <p className="text-xs text-zinc-400">Multi-turn SMS conversation history between Gemini ISA and prospects with AI rationale.</p>
          <div className="text-[11px] text-zinc-500 font-mono bg-zinc-950 p-2 rounded border border-zinc-800">
            Foreign Key: lead_id -&gt; leads(id)
          </div>
        </div>
      </div>

      {/* Code Viewer Container */}
      <div className="bg-zinc-950 rounded-xl border border-zinc-800 shadow-sm overflow-hidden">
        <div className="bg-zinc-900 px-4 py-3 border-b border-zinc-800 flex items-center justify-between text-xs text-zinc-400 font-mono">
          <div className="flex items-center space-x-2">
            <Code className="h-4 w-4 text-blue-400" />
            <span>001_initial_schema.sql</span>
          </div>
          <span className="text-emerald-400 font-bold">PostgreSQL Standard DDL</span>
        </div>
        <pre className="p-5 text-xs font-mono text-zinc-300 leading-relaxed overflow-x-auto max-h-[500px] scrollbar-thin select-all">
          {sqlContent || '-- Loading schema definition...'}
        </pre>
      </div>
    </div>
  );
};
