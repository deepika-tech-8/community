import { useState } from 'react';
import { MapPin, ThumbsUp, Loader, CheckSquare, Building } from 'lucide-react';
import { categories, statuses } from '../data/issues';
import { useIssues } from '../hooks/useIssues';

export default function Dashboard({ issues, loading, voteIssue, updateStatus }) {
  const { verifyIssue } = useIssues();
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all'
    ? issues
    : issues.filter(i => i.status === filter);

  const totalVotes = issues.reduce((sum, i) => sum + (i.votes || 0), 0);
  const resolved = issues.filter(i => i.status === 'resolved').length;
  const resolvedPct = issues.length ? Math.round((resolved / issues.length) * 100) : 0;

  const severityColor = {
    low: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-orange-100 text-orange-700',
    critical: 'bg-red-100 text-red-700',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader className="animate-spin text-green-600" size={40} />
          <p className="text-gray-600 font-medium">Loading live data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard 📊</h1>
        <p className="text-gray-600 mb-8">Live data — AI auto-assigns issues to departments!</p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Issues', value: issues.length, color: 'bg-purple-50 text-purple-700' },
            { label: 'Resolved %', value: `${resolvedPct}%`, color: 'bg-green-50 text-green-700' },
            { label: 'Total Votes', value: totalVotes, color: 'bg-blue-50 text-blue-700' },
            { label: 'Pending', value: issues.filter(i => i.status === 'pending').length, color: 'bg-orange-50 text-orange-700' },
          ].map((s, i) => (
            <div key={i} className={`${s.color} rounded-2xl p-5 text-center`}>
              <div className="text-3xl font-bold">{s.value}</div>
              <div className="text-sm mt-1 font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h2 className="font-bold text-gray-700 mb-4">Resolution Progress</h2>
          <div className="flex flex-col gap-3">
            {Object.entries(statuses).map(([key, val]) => {
              const count = issues.filter(i => i.status === key).length;
              const pct = issues.length ? Math.round((count / issues.length) * 100) : 0;
              const barColor = key === 'resolved' ? 'bg-green-500' : key === 'inprogress' ? 'bg-blue-500' : 'bg-yellow-500';
              return (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{val.label}</span>
                    <span className="text-gray-500">{count} issues ({pct}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div className={`${barColor} h-3 rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {['all', 'pending', 'inprogress', 'resolved'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-full font-medium text-sm transition ${
                filter === f ? 'bg-green-600 text-white' : 'bg-white text-gray-600 hover:bg-green-50 border border-gray-200'
              }`}
            >
              {f === 'all' ? 'All' : statuses[f].label}
            </button>
          ))}
        </div>

        {/* Issues List */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center text-gray-500">
            <p className="text-4xl mb-3">📭</p>
            <p>No issues yet. Be the first to report one!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map(issue => {
              const cat = categories.find(c => c.id === issue.category) || categories[0];
              const status = statuses[issue.status] || statuses.pending;
              return (
                <div key={issue.id} className="bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="text-3xl">{cat.emoji}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{issue.title}</h3>
                      <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                        <MapPin size={13} />
                        <span>{issue.location}</span>
                        <span className="mx-2">•</span>
                        <span>{issue.date}</span>
                      </div>
                      {issue.severity && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block ${severityColor[issue.severity]}`}>
                          ⚡ {issue.severity} severity
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${status.color}`}>
                        {status.label}
                      </span>
                      <button
                        onClick={() => voteIssue(issue.id)}
                        className="flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-xl hover:bg-blue-100 transition text-sm font-medium"
                      >
                        <ThumbsUp size={14} />
                        <span>{issue.votes || 0}</span>
                      </button>
                      <button
                        onClick={() => verifyIssue(issue.id)}
                        className="flex items-center gap-1 bg-green-50 text-green-600 px-3 py-2 rounded-xl hover:bg-green-100 transition text-sm font-medium"
                      >
                        <CheckSquare size={14} />
                        <span>{issue.verifications || 0} verified</span>
                      </button>
                    </div>
                  </div>

                  {/* Department Auto-Assignment */}
                  {issue.department && (
                    <div className="bg-blue-50 rounded-xl p-3 flex items-start gap-2">
                      <Building size={16} className="text-blue-500 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-blue-700">🤖 AI Auto-Assigned to: {issue.department}</p>
                        <p className="text-xs text-blue-600">📧 {issue.departmentContact} • SLA: {issue.sla}</p>
                      </div>
                    </div>
                  )}

                  {/* Image */}
                  {issue.imageUrl && (
                    <img src={issue.imageUrl} alt="Issue" className="w-full max-h-48 object-cover rounded-xl" />
                  )}

                  {/* Status Update */}
                  {updateStatus && (
                    <div className="flex gap-2 flex-wrap">
                      <span className="text-xs text-gray-500 self-center">Update status:</span>
                      {['pending', 'inprogress', 'resolved'].map(s => (
                        <button
                          key={s}
                          onClick={() => updateStatus(issue.id, s)}
                          className={`text-xs px-3 py-1 rounded-full border transition ${
                            issue.status === s
                              ? 'bg-green-600 text-white border-green-600'
                              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {statuses[s].label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}