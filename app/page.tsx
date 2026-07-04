'use client';

import React, { useState } from 'react';
import { Sparkles, Send, FileText, Search, Loader2, Globe, CheckCircle, Cpu } from 'lucide-react';

export default function Home() {
  const [keyword, setKeyword] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [modelName, setModelName] = useState('gemini-1.5-flash');
  const [blogId, setBlogId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleGenerate = async () => {
    if (!keyword || !apiKey) {
      alert('Please enter both a keyword and your Gemini API key.');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword, apiKey, modelName }),
      });

      const data = await response.json();
      if (response.ok) {
        setResult(data);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      alert('An error occurred during generation.');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!blogId || !accessToken || !result) {
      alert('Please enter Blog ID, Access Token, and generate a post first.');
      return;
    }

    setPublishing(true);
    try {
      const response = await fetch('/api/blogger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blogId,
          accessToken,
          title: result.title,
          content: result.content,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('🚀 Successfully published to Blogger!');
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      alert('An error occurred while publishing.');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="flex items-center gap-3 mb-12">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">AI AutoBlogger <span className="text-indigo-600">Pro</span></h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar: Settings */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" /> AI Config
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Gemini API Key</label>
                  <input 
                    type="password" 
                    placeholder="AIza..." 
                    className="w-full p-2 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block flex items-center gap-1">
                    <Cpu className="w-3 h-3" /> Model
                  </label>
                  <select 
                    value={modelName} 
                    onChange={(e) => setModelName(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="gemini-1.5-pro">Gemini 1.5 Pro (Highest Quality)</option>
                    <option value="gemini-1.5-flash">Gemini 1.5 Flash (Fastest)</option>
                    <option value="gemini-pro">Gemini Pro (Stable)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-indigo-600" /> Blogger Config
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Blog ID</label>
                  <input 
                    type="text" 
                    placeholder="Your Blog ID" 
                    className="w-full p-2 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    value={blogId}
                    onChange={(e) => setBlogId(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Access Token</label>
                  <input 
                    type="password" 
                    placeholder="ya29...." 
                    className="w-full p-2 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main: Generator */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-600 flex items-center gap-2 mb-2">
                    <Search className="w-4 h-4" /> What do you want to blog about today?
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="e.g. Top 10 travel destinations in India for 2026" 
                      className="flex-1 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                    />
                    <button 
                      onClick={handleGenerate}
                      disabled={loading}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                      Generate
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Result Preview */}
            {result && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative">
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="text-3xl font-bold pr-12">{result.title}</h2>
                    <button 
                      onClick={handlePublish}
                      disabled={publishing}
                      className="absolute top-8 right-8 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2 px-4 rounded-full transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      {publishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                      Publish to Blogger
                    </button>
                  </div>
                  <div 
                    className="prose max-w-none text-slate-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: result.content }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                    <h3 className="text-indigo-900 font-bold mb-2">SEO Meta Description</h3>
                    <p className="text-indigo-800 text-sm italic">{result.metaDescription}</p>
                  </div>
                  <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                    <h3 className="text-emerald-900 font-bold mb-2">Target Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                      {result.keywords.map((kw: string, i: number) => (
                        <span key={i} className="bg-white px-3 py-1 rounded-full text-xs font-medium text-emerald-700 border border-emerald-200">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
