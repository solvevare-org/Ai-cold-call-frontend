import React from 'react';
import { Bell, Phone, User, Shield, Database, Headphones, Globe } from 'lucide-react';

const Settings = () => {
  return (
    <div className="max-w-4xl space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">General Settings</h2>
          <p className="text-gray-600">Manage your account and application preferences</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Company Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg"
                defaultValue="Solvevare"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Time Zone</label>
              <select className="w-full px-3 py-2 border rounded-lg">
                <option>Eastern Time (ET)</option>
                <option>Pacific Time (PT)</option>
                <option>Central Time (CT)</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-gray-600">Receive notifications for important updates</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after :h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Call Notifications</p>
                    <p className="text-sm text-gray-600">Get notified for upcoming scheduled calls</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-medium">User Management</h3>
          </div>
          <p className="text-gray-600 text-sm">Manage team members and their access levels</p>
          <button className="mt-4 w-full px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50">
            Manage Users
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-medium">Security</h3>
          </div>
          <p className="text-gray-600 text-sm">Configure security settings and permissions</p>
          <button className="mt-4 w-full px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50">
            Security Settings
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Database className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-medium">Data Management</h3>
          </div>
          <p className="text-gray-600 text-sm">Manage your data and export options</p>
          <button className="mt-4 w-full px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50">
            Manage Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;