import { useLocation } from 'react-router-dom';
import { Bell } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const getPageTitle = (path: string) => {
    switch (path) {
      case '/':
        return 'AI Cold Call Dashboard';
      case '/leads':
        return 'Leads Management';
      case '/schedule':
        return 'Call Schedule';
      case '/conversations':
        return 'Conversations';
      case '/analytics':
        return 'Analytics';
      case '/campaigns':
        return 'Campaign Management';
      case '/settings':
        return 'Settings';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 md:pl-20">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl font-semibold text-gray-800">
            {getPageTitle(location.pathname)}
          </h1>
          <p className="text-sm text-gray-600">Welcome back, Admin</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 bg-cyan-100 text-cyan-600 rounded-lg hover:bg-cyan-200">
            Export Report
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-[#6CE3E1] to-[#4D8587] text-white rounded-lg hover:bg-cyan-00">
            New Campaign
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
            <Bell className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;