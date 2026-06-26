import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Loader } from 'lucide-react';
import { categories, statuses } from '../data/issues';
import { useIssues } from '../hooks/useIssues';

// Fix default marker icon issue with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Chennai area coordinates for sample issues
const defaultCoords = [
  [13.0827, 80.2707],
  [13.0500, 80.2500],
  [13.0100, 80.2200],
  [13.0600, 80.2800],
  [13.0300, 80.2600],
  [13.0900, 80.2400],
];

export default function MapView() {
  const { issues, loading, voteIssue } = useIssues();
  const [selected, setSelected] = useState(null);

  const getColor = (status) => {
    if (status === 'resolved') return 'text-green-500';
    if (status === 'inprogress') return 'text-blue-500';
    return 'text-yellow-500';
  };

  const issuesWithCoords = issues.map((issue, i) => ({
    ...issue,
    coords: defaultCoords[i % defaultCoords.length],
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader className="animate-spin text-green-600" size={40} />
          <p className="text-gray-600 font-medium">Loading map data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Live Map View 🗺️</h1>
        <p className="text-gray-600 mb-6">Real-time issues plotted on the map.</p>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Real Leaflet Map */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm overflow-hidden">
            <MapContainer
              center={[13.0827, 80.2707]}
              zoom={12}
              style={{ height: '500px', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {issuesWithCoords.map(issue => (
                <Marker
                  key={issue.id}
                  position={issue.coords}
                  eventHandlers={{ click: () => setSelected(issue) }}
                >
                  <Popup>
                    <div className="p-1">
                      <strong>{issue.title}</strong><br />
                      📍 {issue.location}<br />
                      Status: {statuses[issue.status]?.label || 'Pending'}<br />
                      👍 {issue.votes || 0} votes
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            {selected ? (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">
                    {categories.find(c => c.id === selected.category)?.emoji || '📍'}
                  </span>
                  <h3 className="font-bold text-gray-800">{selected.title}</h3>
                </div>
                <div className="flex flex-col gap-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} />
                    <span>{selected.location}</span>
                  </div>
                  <div className={`font-semibold ${getColor(selected.status)}`}>
                    ● {statuses[selected.status]?.label || 'Pending'}
                  </div>
                  {selected.severity && (
                    <div>⚡ Severity: {selected.severity} ({selected.severityScore}/10)</div>
                  )}
                  <div>👍 {selected.votes || 0} votes</div>
                  <div>📅 {selected.date}</div>
                  <div>👤 {selected.reporter}</div>
                </div>
                <button
                  onClick={() => voteIssue(selected.id)}
                  className="mt-4 w-full bg-blue-50 text-blue-600 font-semibold py-2 rounded-xl hover:bg-blue-100 transition text-sm"
                >
                  👍 Upvote this Issue
                </button>
                <button
                  onClick={() => setSelected(null)}
                  className="mt-2 w-full border border-gray-200 rounded-xl py-2 text-sm text-gray-600 hover:bg-gray-50 transition"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm p-6 text-center text-gray-500">
                <MapPin className="mx-auto mb-2 text-gray-300" size={40} />
                <p className="text-sm">Click any marker on the map to see details</p>
              </div>
            )}

            {/* Issue List */}
            <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-2 max-h-64 overflow-y-auto">
              <h3 className="font-bold text-gray-700 text-sm mb-1">
                All Issues ({issues.length})
              </h3>
              {issues.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">No issues yet</p>
              ) : (
                issues.map(issue => {
                  const cat = categories.find(c => c.id === issue.category) || categories[0];
                  return (
                    <button
                      key={issue.id}
                      onClick={() => setSelected(issue)}
                      className={`text-left p-3 rounded-xl border transition ${
                        selected?.id === issue.id
                          ? 'border-green-400 bg-green-50'
                          : 'border-gray-100 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{cat.emoji}</span>
                        <span className="text-sm font-medium text-gray-700 truncate">
                          {issue.title}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}