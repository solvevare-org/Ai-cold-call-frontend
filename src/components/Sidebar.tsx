import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  MessageSquare, 
  BarChart2, 
  Target,
  Settings as SettingsIcon,
  Phone,
  Menu,
  X
} from 'lucide-react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Users, label: 'Leads', path: '/leads' },
    { icon: Calendar, label: 'Schedule', path: '/schedule' },
    { icon: MessageSquare, label: 'Conversations', path: '/conversations' },
    { icon: BarChart2, label: 'Analytics', path: '/analytics' },
    { icon: Target, label: 'Campaigns', path: '/campaigns' },
    { icon: SettingsIcon, label: 'Settings', path: '/settings' },
  ];

  return (
    <>
      <button
        className="md:hidden p-4 fixed top-4 left-4 z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6 text-black" /> : <Menu className="h-6 w-6 text-black" />}
      </button>
      {isOpen && <div className="fixed inset-0 bg-black opacity-50 z-30" onClick={() => setIsOpen(false)}></div>}
      <div className={`fixed inset-y-0 left-0 w-64 bg-gradient-to-r from-[#6CE3E1] to-[#4D8587] text-white flex flex-col transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform md:relative md:translate-x-0 z-40`}>
        <div className="p-4 flex items-center gap-2 border-b border-black">
          <Phone className="h-8 w-8" />
          <span className="text-xl font-bold">Solvevare</span>
        </div>
        <nav className="flex-1 p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-teal-700 text-white'
                    : 'text-teal-100 hover:bg-teal-700'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;