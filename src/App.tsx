import React, { useState, useRef } from 'react';
import { Youtube, FileText, Clock, BrainCircuit, Sparkles, Wand2, Share2, Download, X } from 'lucide-react';
import html2canvas from 'html2canvas';

interface SummaryResponse {
  summary?: string;
  error?: string;
}

function App() {
  const [videoUrl, setVideoUrl] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSummary(null);

    try {
        const params = new URLSearchParams();
        params.append('videoUrl', videoUrl.trim());
        if(prompt == null) {
          params.append('prompt', '');
        } else {
          params.append('prompt', prompt);
        }

        const response = await fetch(`https://youtubevideosummarizer-backend-production.up.railway.app/api/summarize?${params.toString()}`, {
            method: 'GET',
        });

        const data: SummaryResponse = await response.json();

        if (data.error) {
            setError(data.error);
        } else if (data.summary) {
            setSummary(data.summary);
        }
    } catch (err) {
        setError('Failed to generate summary. Please try again.');
    } finally {
        setIsLoading(false);
    }
};


  const handleShare = async () => {
    if (!summaryRef.current) return;
    
    try {
      const canvas = await html2canvas(summaryRef.current, {
        backgroundColor: '#1F2937', // Match the background color
        scale: 2, // Higher quality
      });
      
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'video-summary.png';
      link.href = dataUrl;
      link.click();
      setShowShareModal(false);
    } catch (err) {
      console.error('Failed to generate image:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 grid-background opacity-20"></div>
      <div className="absolute inset-0 animate-gradient bg-gradient-to-br from-indigo-900/30 via-purple-900/30 to-blue-900/30"></div>

      {/* Content */}
      <div className="relative">
        {/* Hero Section */}
        <div className="pt-16 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="relative inline-block mb-8">
                <div className="absolute inset-0 animate-pulse-slow bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 blur-xl opacity-30 rounded-full"></div>
                <Youtube className="h-20 w-20 text-indigo-400 mx-auto floating" />
              </div>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 sm:text-5xl md:text-6xl mb-6 leading-none">
                Video Insights AI
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Transform any YouTube video into a comprehensive summary with AI-powered insights.
              </p>
            </div>
          </div>
        </div>

        {/* Main Input Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-gray-700 transform transition-all duration-300 hover:shadow-indigo-500/10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="video-url" className="block text-sm font-medium text-gray-300">
                    YouTube Video URL
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Youtube className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-400 transition-colors duration-200" />
                    </div>
                    <input
                      type="url"
                      id="video-url"
                      className="block w-full pl-10 pr-12 h-12 bg-gray-900/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-100 placeholder-gray-400 transition-all duration-200 hover:border-gray-500"
                      placeholder="Paste your YouTube video URL here"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="prompt" className="block text-sm font-medium text-gray-300">
                    Custom Instructions (Optional)
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm group">
                    <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                      <Wand2 className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-400 transition-colors duration-200" />
                    </div>
                    <textarea
                      id="prompt"
                      rows={3}
                      className="block w-full pl-10 pr-12 bg-gray-900/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-100 placeholder-gray-400 transition-all duration-200 hover:border-gray-500"
                      placeholder="E.g., Focus on technical details, or Summarize the main arguments..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className={`w-full relative group ${
                  isLoading ? 'bg-indigo-700' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500'
                } rounded-lg px-8 py-4 text-lg font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-all duration-200 ease-in-out`}
                disabled={isLoading}
              >
                <span className="absolute inset-0 w-full h-full rounded-lg blur-sm bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:blur-md transition-all duration-200 ease-in-out"></span>
                <span className="relative flex items-center justify-center">
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3" />
                      Analyzing Video...
                    </>
                  ) : (
                    <>
                      Generate Summary
                      <Sparkles className="ml-2 h-5 w-5" />
                    </>
                  )}
                </span>
              </button>
              <p className="mt-2 text-center text-purple-500 text-sm">
  Designed by Shivam
</p>
            </form>
          </div>

          {/* Results Section */}
          {(summary || error) && (
            <div className="mt-8 bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-gray-700 animate-fade-in">
              {error ? (
                <div className="text-red-400 flex items-start space-x-3">
                  <X className="h-6 w-6 flex-shrink-0 mt-1" />
                  <p>{error}</p>
                </div>
              ) : (
                <div ref={summaryRef} className="space-y-4 p-6 bg-gray-800 rounded-xl">
                  <div className="flex items-center space-x-3 mb-6">
                    <Youtube className="h-8 w-8 text-indigo-400" />
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                      Video Insights AI
                    </h2>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-semibold text-gray-100">Summary</h3>
                      <button
                        onClick={() => setShowShareModal(true)}
                        className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors duration-200"
                      >
                        <Share2 className="h-4 w-4" />
                        <span>Share</span>
                      </button>
                    </div>
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{summary}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Clock,
                title: 'Save Time',
                description: 'Get the essence of any video in minutes, not hours. Perfect for research and learning.',
              },
              {
                icon: FileText,
                title: 'Detailed Summaries',
                description: 'Receive comprehensive summaries with key points, timestamps, and important details.',
              },
              {
                icon: BrainCircuit,
                title: 'AI-Powered',
                description: 'Advanced AI technology ensures accurate and relevant summaries every time.',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-lg p-3 inline-block">
                    <feature.icon className="h-6 w-6 text-indigo-400" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-100">{feature.title}</h3>
                  <p className="mt-2 text-gray-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Share Summary</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <button
                className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2 transition-colors duration-200"
                onClick={handleShare}
              >
                <Download className="h-5 w-5" />
                <span>Download as Image</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;