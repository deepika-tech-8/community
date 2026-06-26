import { AlertTriangle, CheckCircle, Clock, TrendingUp, MapPin, Loader, ArrowRight, Zap, Shield, Users } from 'lucide-react';
import { categories, statuses } from '../data/issues';
import { useIssues } from '../hooks/useIssues';

export default function Home({ setCurrentPage }) {
  const { issues, loading } = useIssues();

  const resolved = issues.filter(i => i.status === 'resolved').length;
  const pending = issues.filter(i => i.status === 'pending').length;
  const inprogress = issues.filter(i => i.status === 'inprogress').length;

  const severityColor = {
    low: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-orange-100 text-orange-700',
    critical: 'bg-red-100 text-red-700',
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-900 via-green-700 to-emerald-500">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-300 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full mb-6">
            <Zap size={14} className="text-yellow-300" />
            AI-Powered Community Platform
          </div>
          <h1 className="text-5xl md:text-7xl font-800 text-white mb-6 leading-tight">
            Fix Your<br />
            <span className="text-emerald-300">Community</span>
          </h1>
          <p className="text-xl text-green-100 mb-10 max-w-2xl mx-auto">
            Report local issues. AI analyzes severity instantly. Track resolution in real time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setCurrentPage('report')}
              className="bg-white text-green-800 font-bold px-8 py-4 rounded-2xl hover:bg-green-50 transition shadow-lg text-lg flex items-center justify-center gap-2"
            >
              Report an Issue <ArrowRight size={20} />
            </button>
            <button
              onClick={() => setCurrentPage('map')}
              className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-bold px-8 py-4 rounded-2xl hover:bg-white/20 transition text-lg"
            >
              View Live Map
            </button>
          </div>

          {/* Quick Stats in Hero */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mt-14">
            {[
              { value: issues.length, label: 'Issues Reported' },
              { value: resolved, label: 'Issues Resolved' },
              { value: pending, label: 'Pending Action' },
            ].map((s, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-white">
                <div className="text-3xl font-800">{s.value}</div>
                <div className="text-xs text-green-200 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Strip */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: <Zap className="text-yellow-500" size={24} />, title: 'AI-Powered Analysis', desc: 'Gemini AI auto-detects category and severity score' },
            { icon: <Shield className="text-blue-500" size={24} />, title: 'Real-time Tracking', desc: 'Firebase powered live updates across all devices' },
            { icon: <Users className="text-green-500" size={24} />, title: 'Community Voting', desc: 'Upvote issues to prioritize urgent problems' },
          ].map((f, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="p-3 bg-gray-50 rounded-xl">{f.icon}</div>
              <div>
                <div className="font-semibold text-gray-800">{f.title}</div>
                <div className="text-sm text-gray-500 mt-1">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'Total Issues', value: issues.length, icon: <AlertTriangle size={20} />, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-100' },
            { label: 'Resolved', value: resolved, icon: <CheckCircle size={20} />, color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-100' },
            { label: 'In Progress', value: inprogress, icon: <Clock size={20} />, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100' },
            { label: 'Pending', value: pending, icon: <TrendingUp size={20} />, color: 'text-yellow-500', bg: 'bg-yellow-50', border: 'border-yellow-100' },
          ].map((stat, i) => (
            <div key={i} className={`${stat.bg} border ${stat.border} rounded-2xl p-6 card-hover`}>
              <div className={`${stat.color} mb-3`}>{stat.icon}</div>
              <div className="text-3xl font-800 text-gray-800">{stat.value}</div>
              <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Recent Issues */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-800 text-gray-800">Recent Issues</h2>
          <button
            onClick={() => setCurrentPage('dashboard')}
            className="text-green-600 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all"
          >
            View All <ArrowRight size={16} />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="flex flex-col items-center gap-3">
              <Loader className="animate-spin text-green-600" size={36} />
              <p className="text-gray-500">Loading live data...</p>
            </div>
          </div>
        ) : issues.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center border border-gray-100 mb-12">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No issues yet</h3>
            <p className="text-gray-500 mb-6">Be the first to report a community issue!</p>
            <button
              onClick={() => setCurrentPage('report')}
              className="bg-green-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-green-700 transition"
            >
              Report Now
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {issues.slice(0, 6).map(issue => {
              const cat = categories.find(c => c.id === issue.category) || categories[0];
              const status = statuses[issue.status] || statuses.pending;
              return (
                <div key={issue.id} className="bg-white rounded-2xl p-5 border border-gray-100 card-hover animate-fade-in">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${cat.color}`}>
                      {cat.emoji} {cat.label}
                    </span>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-3 leading-snug">{issue.title}</h3>
                  <div className="flex items-center gap-1 text-gray-400 text-sm mb-3">
                    <MapPin size={13} />
                    <span>{issue.location}</span>
                  </div>
                  {issue.severity && (
                    <span className={`text-xs px-2 py-1 rounded-lg font-medium ${severityColor[issue.severity]}`}>
                      ⚡ {issue.severity} severity • {issue.severityScore}/10
                    </span>
                  )}
                  <div className="flex items-center justify-between text-sm text-gray-400 mt-4 pt-4 border-t border-gray-50">
                    <span className="flex items-center gap-1">👍 {issue.votes || 0} votes</span>
                    <span>{issue.date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Categories */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-800 text-gray-800">Browse by Category</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCurrentPage('dashboard')}
              className={`${cat.color} rounded-2xl p-5 text-center card-hover border border-transparent hover:border-current`}
            >
              <div className="text-4xl mb-2">{cat.emoji}</div>
              <div className="font-semibold text-sm">{cat.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}