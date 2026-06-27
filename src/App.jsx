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
  const { issues, loading, newCount, setNewCount, addIssue, voteIssue, verifyIssue, updateStatus } = useIssues();

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <Home setCurrentPage={setCurrentPage} issues={issues} loading={loading} />;
      case 'report': return <ReportIssue addIssue={addIssue} />;
      case 'map': return <MapView issues={issues} loading={loading} voteIssue={voteIssue} />;
      case 'dashboard': return <Dashboard issues={issues} loading={loading} voteIssue={voteIssue} updateStatus={updateStatus} />;
      case 'leaderboard': return <Leaderboard />;
      default: return <Home setCurrentPage={setCurrentPage} issues={issues} loading={loading} />;
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