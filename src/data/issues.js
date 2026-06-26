export const categories = [
  { id: 'pothole', label: 'Pothole', emoji: '🕳️', color: 'bg-orange-100 text-orange-700' },
  { id: 'streetlight', label: 'Streetlight', emoji: '💡', color: 'bg-yellow-100 text-yellow-700' },
  { id: 'water', label: 'Water Leakage', emoji: '💧', color: 'bg-blue-100 text-blue-700' },
  { id: 'waste', label: 'Waste/Garbage', emoji: '🗑️', color: 'bg-green-100 text-green-700' },
  { id: 'road', label: 'Road Damage', emoji: '🚧', color: 'bg-red-100 text-red-700' },
  { id: 'park', label: 'Park/Public Space', emoji: '🌳', color: 'bg-emerald-100 text-emerald-700' },
];

export const statuses = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
  inprogress: { label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
  resolved: { label: 'Resolved', color: 'bg-green-100 text-green-700' },
};

export const sampleIssues = [
  { id: 1, title: 'Large pothole on Main Street', category: 'pothole', status: 'inprogress', location: 'Anna Nagar, Chennai', votes: 24, date: '2026-06-20', reporter: 'Priya S.' },
  { id: 2, title: 'Streetlight not working near park', category: 'streetlight', status: 'pending', location: 'T. Nagar, Chennai', votes: 18, date: '2026-06-21', reporter: 'Rahul M.' },
  { id: 3, title: 'Water pipe leaking on 2nd cross', category: 'water', status: 'resolved', location: 'Velachery, Chennai', votes: 31, date: '2026-06-18', reporter: 'Deepa R.' },
  { id: 4, title: 'Garbage pile near bus stop', category: 'waste', status: 'pending', location: 'Adyar, Chennai', votes: 15, date: '2026-06-22', reporter: 'Karthik V.' },
  { id: 5, title: 'Broken road divider on highway', category: 'road', status: 'inprogress', location: 'OMR, Chennai', votes: 42, date: '2026-06-19', reporter: 'Meena K.' },
  { id: 6, title: 'Park benches damaged', category: 'park', status: 'pending', location: 'Nungambakkam, Chennai', votes: 9, date: '2026-06-23', reporter: 'Arjun P.' },
];