import { MapPin, Menu, X, Bell } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar({ currentPage, setCurrentPage, newCount, setNewCount }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (newCount > 0) {
      setNotifications(prev => [
        { id: Date.now(), message: `🆕 New issue reported in your community!`, time: 'Just now' },
        ...prev.slice(0, 4)
      ]);
    }
  }, [newCount]);

  const links = [
    { id: 'home', label: 'Home' },
    { id: 'report', label: 'Report Issue' },
    { id: 'map', label: 'Map View' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'leaderboard', label: 'Leaderboard' },
  ];

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
          <div className="bg-green-600 p-2 rounded-xl">
            <MapPin className="text-white" size={20} />
          </div>
          <span className="text-lg font-bold text-gray-900">Community<span className="text-green-600">Hero</span></span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(link => (
            <button
              key={link.id}
              onClick={() => setCurrentPage(link.id)}
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                currentPage === link.id
                  ? 'bg-green-50 text-green-700 font-semibold'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-3">

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => { setShowNotif(!showNotif); setNewCount(0); }}
              className="relative p-2 rounded-xl hover:bg-gray-50 transition"
            >
              <Bell size={20} className="text-gray-600" />
              {newCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-bounce">
                  {newCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotif && (
              <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <span className="font-bold text-gray-800">Notifications</span>
                  <button onClick={() => setShowNotif(false)} className="text-gray-400 hover:text-gray-600">
                    <X size={16} />
                  </button>
                </div>
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-gray-400 text-sm">
                    No notifications yet
                  </div>
                ) : (
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map(n => (
                      <div key={n.id} className="p-4 border-b border-gray-50 hover:bg-gray-50 transition">
                        <p className="text-sm text-gray-700">{n.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            onClick={() => setCurrentPage('report')}
            className="bg-green-600 text-white font-semibold px-5 py-2 rounded-xl hover:bg-green-700 transition text-sm"
          >
            + Report Issue
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => { setShowNotif(!showNotif); setNewCount(0); }}
            className="relative p-2 rounded-xl hover:bg-gray-50"
          >
            <Bell size={20} className="text-gray-600" />
            {newCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {newCount}
              </span>
            )}
          </button>
          <button className="p-2 rounded-xl hover:bg-gray-50" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-2">
          {links.map(link => (
            <button
              key={link.id}
              onClick={() => { setCurrentPage(link.id); setMenuOpen(false); }}
              className={`text-left px-4 py-3 rounded-xl font-medium text-sm ${
                currentPage === link.id ? 'bg-green-50 text-green-700' : 'text-gray-600'
              }`}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => { setCurrentPage('report'); setMenuOpen(false); }}
            className="bg-green-600 text-white font-semibold px-5 py-3 rounded-xl text-sm mt-2"
          >
            + Report Issue
          </button>
        </div>
      )}
    </nav>
  );
}