import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import AutoDialer from './pages/AutoDialer'; // Import the AutoDialer component
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Schedule from './pages/Schedule';
import Conversations from './pages/Conversations';
import Analytics from './pages/Analytics';
import Campaigns from './pages/Campaigns';
import CampaignDetails from './pages/CampaignDetails';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/leads" element={<Leads />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/conversations" element={<Conversations />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/campaigns" element={<Campaigns />} />
              <Route path="/campaigns/:id" element={<CampaignDetails />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/autodialer" element={<AutoDialer />} /> // Add route for AutoDialer
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
