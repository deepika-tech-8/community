import { Trophy, Star, MapPin } from 'lucide-react';

const heroes = [
  { rank: 1, name: 'Priya Sharma', points: 520, issues: 12, resolved: 9, badge: '🏆', area: 'Anna Nagar' },
  { rank: 2, name: 'Rahul Mehta', points: 480, issues: 10, resolved: 8, badge: '🥈', area: 'T. Nagar' },
  { rank: 3, name: 'Deepa Raj', points: 430, issues: 9, resolved: 7, badge: '🥉', area: 'Velachery' },
  { rank: 4, name: 'Karthik V', points: 380, issues: 8, resolved: 6, badge: '⭐', area: 'Adyar' },
  { rank: 5, name: 'Meena K', points: 340, issues: 7, resolved: 5, badge: '⭐', area: 'OMR' },
  { rank: 6, name: 'Arjun P', points: 290, issues: 6, resolved: 4, badge: '⭐', area: 'Nungambakkam' },
  { rank: 7, name: 'Sita R', points: 250, issues: 5, resolved: 4, badge: '⭐', area: 'Mylapore' },
  { rank: 8, name: 'Vijay M', points: 210, issues: 4, resolved: 3, badge: '⭐', area: 'Porur' },
];

export default function Leaderboard() {
  const top3 = heroes.slice(0, 3);
  const rest = heroes.slice(3);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Leaderboard 🏆</h1>
        <p className="text-gray-600 mb-8">Top community heroes making a difference!</p>

        {/* Top 3 Podium */}
        <div className="bg-gradient-to-br from-yellow-400 to-orange-400 rounded-2xl p-8 mb-8">
          <h2 className="text-white font-bold text-xl text-center mb-6">🌟 Top Community Heroes</h2>
          <div className="flex justify-center items-end gap-4">
            {/* 2nd */}
            <div className="flex flex-col items-center">
              <div className="text-4xl mb-2">{top3[1].badge}</div>
              <div className="bg-white rounded-2xl p-4 text-center w-28">
                <div className="font-bold text-gray-800 text-sm">{top3[1].name}</div>
                <div className="text-yellow-600 font-bold text-lg">{top3[1].points}</div>
                <div className="text-gray-500 text-xs">points</div>
              </div>
              <div className="bg-yellow-200 w-28 h-16 rounded-b-xl flex items-center justify-center font-bold text-yellow-700">2nd</div>
            </div>

            {/* 1st */}
            <div className="flex flex-col items-center">
              <div className="text-5xl mb-2">{top3[0].badge}</div>
              <div className="bg-white rounded-2xl p-4 text-center w-32 shadow-lg">
                <div className="font-bold text-gray-800">{top3[0].name}</div>
                <div className="text-yellow-600 font-bold text-2xl">{top3[0].points}</div>
                <div className="text-gray-500 text-xs">points</div>
              </div>
              <div className="bg-yellow-300 w-32 h-24 rounded-b-xl flex items-center justify-center font-bold text-yellow-800 text-lg">1st</div>
            </div>

            {/* 3rd */}
            <div className="flex flex-col items-center">
              <div className="text-4xl mb-2">{top3[2].badge}</div>
              <div className="bg-white rounded-2xl p-4 text-center w-28">
                <div className="font-bold text-gray-800 text-sm">{top3[2].name}</div>
                <div className="text-yellow-600 font-bold text-lg">{top3[2].points}</div>
                <div className="text-gray-500 text-xs">points</div>
              </div>
              <div className="bg-yellow-100 w-28 h-12 rounded-b-xl flex items-center justify-center font-bold text-yellow-600">3rd</div>
            </div>
          </div>
        </div>

        {/* Rest of leaderboard */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-5 px-6 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
            <span>Rank</span>
            <span className="col-span-2">Hero</span>
            <span className="text-center">Issues</span>
            <span className="text-center">Points</span>
          </div>
          {rest.map(hero => (
            <div key={hero.rank} className="grid grid-cols-5 px-6 py-4 border-t border-gray-50 hover:bg-gray-50 transition items-center">
              <span className="font-bold text-gray-500">#{hero.rank}</span>
              <div className="col-span-2">
                <div className="font-semibold text-gray-800">{hero.name}</div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <MapPin size={10} />
                  <span>{hero.area}</span>
                </div>
              </div>
              <div className="text-center">
                <div className="font-medium text-gray-700">{hero.issues}</div>
                <div className="text-xs text-gray-400">{hero.resolved} resolved</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-green-600">{hero.points}</div>
                <div className="text-xs text-gray-400">pts</div>
              </div>
            </div>
          ))}
        </div>

        {/* How to earn points */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mt-6">
          <h3 className="font-bold text-gray-800 mb-4">How to Earn Points 🎯</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { action: 'Report an Issue', points: '+10 pts', emoji: '📝' },
              { action: 'Issue Resolved', points: '+50 pts', emoji: '✅' },
              { action: 'Community Vote', points: '+5 pts', emoji: '👍' },
            ].map((item, i) => (
              <div key={i} className="bg-green-50 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">{item.emoji}</div>
                <div className="font-medium text-gray-700 text-sm">{item.action}</div>
                <div className="font-bold text-green-600">{item.points}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}