import { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ReportIssue from './pages/ReportIssue';
import MapView from './pages/MapView';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';
import { useIssues } from './hooks/useIssues';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const { newCount, setNewCount } = useIssues();

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <Home setCurrentPage={setCurrentPage} />;
      case 'report': return <ReportIssue />;
      case 'map': return <MapView />;
      case 'dashboard': return <Dashboard />;
      case 'leaderboard': return <Leaderboard />;
      default: return <Home setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        newCount={newCount}
        setNewCount={setNewCount}
      />
      {renderPage()}
    </div>
  );
}

export default App;