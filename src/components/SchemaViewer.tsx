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
    <div className="space-y-6 max-w-5xl mx-auto font-sans">
      {/* Header */}
      <div className="card-pop p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-bold text-[#38BDF8] uppercase tracking-widest mb-1 font-mono">
            <Database className="h-3.5 w-3.5" />
            <span>PostgreSQL / Supabase Migration DDL</span>
          </div>
          <h2 className="text-xl font-bold text-[#F8FAFC]">Multi-Tenant Database Architecture</h2>
          <p className="text-xs sm:text-sm text-[#CBD5E1] mt-1 font-medium">
            SQL schema migration for tenants, leads, messages, indexes, and RECO qualification stage constraints.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            id="copy-sql-migration-btn"
            onClick={handleCopy}
            className="bg-[#142133] hover:bg-[#1C2C42] text-[#F8FAFC] text-xs font-bold px-4 py-2.5 rounded-xl border border-white/[0.1] flex items-center space-x-1.5 transition-all cursor-pointer shadow-sm"
          >
            {copied ? <Check className="h-4 w-4 text-[#10B981]" /> : <Copy className="h-4 w-4 text-[#CBD5E1]" />}
            <span>{copied ? 'Copied SQL!' : 'Copy DDL'}</span>
          </button>
          <button
            id="download-sql-migration-btn"
            onClick={handleDownload}
            className="btn-executive-primary text-black text-xs font-bold px-4.5 py-2.5 rounded-xl flex items-center space-x-1.5 transition-all cursor-pointer shadow-md"
          >
            <Download className="h-4 w-4 text-[#050B14]" />
            <span>Download .sql</span>
          </button>
        </div>
      </div>

      {/* ERD Relationship Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Table 1 */}
        <div className="card-executive p-5 space-y-2.5">
          <div className="flex items-center space-x-2 text-[#38BDF8] font-bold text-xs">
            <Layers className="h-4 w-4" />
            <span>1. tenants</span>
          </div>
          <p className="text-xs text-[#CBD5E1] leading-relaxed">Stores real estate team profiles, FUB keys, Twilio credentials, and custom ISA settings.</p>
          <div className="text-[11px] text-[#94A3B8] font-mono bg-[#071524] p-2.5 rounded-lg border border-white/[0.08]">
            Primary Key: id (VARCHAR)
          </div>
        </div>

        {/* Table 2 */}
        <div className="card-executive p-5 space-y-2.5">
          <div className="flex items-center space-x-2 text-[#10B981] font-bold text-xs">
            <Layers className="h-4 w-4" />
            <span>2. leads</span>
          </div>
          <p className="text-xs text-[#CBD5E1] leading-relaxed">Tracks inbound buyer/seller leads, qualification stage, timeline, budget, and RECO BRA status.</p>
          <div className="text-[11px] text-[#94A3B8] font-mono bg-[#071524] p-2.5 rounded-lg border border-white/[0.08]">
            Foreign Key: tenant_id -&gt; tenants(id)
          </div>
        </div>

        {/* Table 3 */}
        <div className="card-executive p-5 space-y-2.5">
          <div className="flex items-center space-x-2 text-purple-400 font-bold text-xs">
            <Layers className="h-4 w-4" />
            <span>3. messages</span>
          </div>
          <p className="text-xs text-[#CBD5E1] leading-relaxed">Multi-turn SMS conversation history between Gemini ISA and prospects with AI rationale.</p>
          <div className="text-[11px] text-[#94A3B8] font-mono bg-[#071524] p-2.5 rounded-lg border border-white/[0.08]">
            Foreign Key: lead_id -&gt; leads(id)
          </div>
        </div>
      </div>

      {/* Code Viewer Container */}
      <div className="card-executive rounded-2xl overflow-hidden shadow-md">
        <div className="bg-[#0B1726] px-5 py-3.5 border-b border-white/[0.08] flex items-center justify-between text-xs text-[#CBD5E1] font-mono">
          <div className="flex items-center space-x-2">
            <Code className="h-4 w-4 text-[#38BDF8]" />
            <span>001_initial_schema.sql</span>
          </div>
          <span className="text-[#10B981] font-bold">PostgreSQL Standard DDL</span>
        </div>
        <pre className="p-6 text-xs font-mono text-[#CBD5E1] leading-relaxed overflow-x-auto max-h-[500px] scrollbar-thin select-all bg-[#071524]">
          {sqlContent || '-- Loading schema definition...'}
        </pre>
      </div>
    </div>
  );
};
