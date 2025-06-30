import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Sparkles,
  Save,
  RefreshCw,
  Trash2,
  Download,
  Upload,
  Camera,
  Eye,
  EyeOff,
  Lock,
  Monitor,
  Smartphone,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Settings = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    // Profile Settings
    name: user?.name || '',
    email: user?.email || '',
    bio: 'Passionate soul keeper and digital pet parent 💕',
    avatar: user?.avatar || '',
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    petUpdates: true,
    communityUpdates: false,
    marketingEmails: false,
    weeklyDigest: true,
    
    // Privacy Settings
    profileVisibility: 'public',
    petVisibility: 'friends',
    activityStatus: true,
    dataSharing: false,
    analyticsOptOut: false
  });

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'privacy', name: 'Privacy & Security', icon: Shield },
    { id: 'account', name: 'Account', icon: SettingsIcon }
  ];

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // In a real app, this would save to backend
    console.log('Saving settings:', settings);
    // Show success message
    alert('Settings saved successfully! 🎉');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone and you will lose all your pets and progress.')) {
      // In a real app, this would delete the account
      logout();
    }
  };

  const renderProfileSettings = () => (
    <div className="space-y-8">
      <div className="backdrop-blur-sm bg-white/60 p-8 rounded-3xl border border-white/40 shadow-lg">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <User className="h-6 w-6 mr-3 text-purple-600" />
          Profile Information
        </h3>
        
        {/* Avatar Section */}
        <div className="flex items-center space-x-6 mb-8">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-xl">
              <User className="h-12 w-12 text-white" />
            </div>
            <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors duration-300">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <div>
            <h4 className="text-lg font-bold text-gray-800">Profile Picture</h4>
            <p className="text-gray-600 text-sm mb-3">Upload a new avatar to personalize your profile</p>
            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-purple-100 text-purple-600 rounded-xl hover:bg-purple-200 transition-colors duration-300 flex items-center">
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors duration-300">
                Remove
              </button>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Display Name</label>
            <input
              type="text"
              value={settings.name}
              onChange={(e) => handleSettingChange('name', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => handleSettingChange('email', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
          <textarea
            value={settings.bio}
            onChange={(e) => handleSettingChange('bio', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            placeholder="Tell the world about your love for digital pets..."
          />
        </div>
      </div>

      {/* Account Stats */}
      <div className="backdrop-blur-sm bg-white/60 p-8 rounded-3xl border border-white/40 shadow-lg">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Account Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl">
            <div className="text-2xl font-bold text-gray-800">{user?.totalPets || 0}</div>
            <div className="text-sm text-gray-600">Soul Companions</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl">
            <div className="text-2xl font-bold text-gray-800">{user?.cuddleCoins?.toLocaleString() || 0}</div>
            <div className="text-sm text-gray-600">Cuddle Coins</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl">
            <div className="text-2xl font-bold text-gray-800">{user?.level || 1}</div>
            <div className="text-sm text-gray-600">Soul Level</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl">
            <div className="text-2xl font-bold text-gray-800">
              {Math.floor((Date.now() - new Date(user?.joinDate || Date.now()).getTime()) / (1000 * 60 * 60 * 24))}
            </div>
            <div className="text-sm text-gray-600">Days Active</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="backdrop-blur-sm bg-white/60 p-8 rounded-3xl border border-white/40 shadow-lg">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Bell className="h-6 w-6 mr-3 text-purple-600" />
          Notification Preferences
        </h3>
        
        <div className="space-y-6">
          {[
            { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive important updates via email' },
            { key: 'pushNotifications', label: 'Push Notifications', description: 'Get instant notifications on your device' },
            { key: 'petUpdates', label: 'Pet Updates', description: 'Notifications when your pets need attention' },
            { key: 'communityUpdates', label: 'Community Updates', description: 'Updates from the Soul Pet community' },
            { key: 'marketingEmails', label: 'Marketing Emails', description: 'Promotional content and special offers' },
            { key: 'weeklyDigest', label: 'Weekly Digest', description: 'Summary of your week with your pets' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-white/40 rounded-2xl border border-white/30">
              <div>
                <div className="font-semibold text-gray-800">{item.label}</div>
                <div className="text-sm text-gray-600">{item.description}</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings[item.key]}
                  onChange={(e) => handleSettingChange(item.key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div className="backdrop-blur-sm bg-white/60 p-8 rounded-3xl border border-white/40 shadow-lg">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Shield className="h-6 w-6 mr-3 text-purple-600" />
          Privacy & Security
        </h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Profile Visibility</label>
            <select
              value={settings.profileVisibility}
              onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="public">Public - Anyone can see your profile</option>
              <option value="friends">Friends Only - Only friends can see your profile</option>
              <option value="private">Private - Only you can see your profile</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Pet Visibility</label>
            <select
              value={settings.petVisibility}
              onChange={(e) => handleSettingChange('petVisibility', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="public">Public - Anyone can see your pets</option>
              <option value="friends">Friends Only - Only friends can see your pets</option>
              <option value="private">Private - Only you can see your pets</option>
            </select>
          </div>

          {[
            { key: 'activityStatus', label: 'Show Activity Status', description: 'Let others see when you\'re online' },
            { key: 'dataSharing', label: 'Data Sharing', description: 'Share anonymized data to improve the service' },
            { key: 'analyticsOptOut', label: 'Opt Out of Analytics', description: 'Disable usage analytics collection' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-white/40 rounded-2xl border border-white/30">
              <div>
                <div className="font-semibold text-gray-800">{item.label}</div>
                <div className="text-sm text-gray-600">{item.description}</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings[item.key]}
                  onChange={(e) => handleSettingChange(item.key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          ))}
        </div>

        {/* Password Change Section */}
        <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl border border-red-200">
          <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <Lock className="h-5 w-5 mr-2 text-red-600" />
            Change Password
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            <button className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAccountSettings = () => (
    <div className="space-y-6">
      <div className="backdrop-blur-sm bg-white/60 p-8 rounded-3xl border border-white/40 shadow-lg">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <SettingsIcon className="h-6 w-6 mr-3 text-purple-600" />
          Account Management
        </h3>
        
        <div className="space-y-6">
          {/* Data Export */}
          <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-200">
            <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
              <Download className="h-5 w-5 mr-2 text-blue-600" />
              Export Your Data
            </h4>
            <p className="text-gray-600 mb-4">Download all your pet data, conversations, and account information.</p>
            <button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
              Download Data
            </button>
          </div>

          {/* Account Deletion */}
          <div className="p-6 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl border border-red-200">
            <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
              <Trash2 className="h-5 w-5 mr-2 text-red-600" />
              Delete Account
            </h4>
            <p className="text-gray-600 mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <button 
              onClick={handleDeleteAccount}
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              Delete Account
            </button>
          </div>

          {/* Session Management */}
          <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200">
            <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
              <RefreshCw className="h-5 w-5 mr-2 text-yellow-600" />
              Active Sessions
            </h4>
            <p className="text-gray-600 mb-4">Manage your active login sessions across different devices.</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/60 rounded-xl">
                <div className="flex items-center">
                  <Monitor className="h-5 w-5 mr-3 text-gray-600" />
                  <div>
                    <div className="font-semibold text-gray-800">Desktop - Chrome</div>
                    <div className="text-sm text-gray-600">Current session • Last active now</div>
                  </div>
                </div>
                <span className="text-green-600 font-semibold">Active</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/60 rounded-xl">
                <div className="flex items-center">
                  <Smartphone className="h-5 w-5 mr-3 text-gray-600" />
                  <div>
                    <div className="font-semibold text-gray-800">Mobile - Safari</div>
                    <div className="text-sm text-gray-600">Last active 2 hours ago</div>
                  </div>
                </div>
                <button className="text-red-600 font-semibold hover:text-red-700">Revoke</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/80 via-pink-50/60 to-indigo-50/80 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-r from-purple-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-60 right-20 w-32 h-32 bg-gradient-to-r from-indigo-200/30 to-purple-200/30 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute bottom-40 left-1/3 w-48 h-48 bg-gradient-to-r from-pink-200/30 to-rose-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="p-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Link
              to="/dashboard"
              className="mr-6 p-4 rounded-3xl backdrop-blur-2xl bg-white/30 border border-white/30 hover:bg-white/50 transition-all duration-500 hover:scale-110 shadow-xl"
            >
              <ArrowLeft className="h-6 w-6 text-gray-700" />
            </Link>
            <div className="backdrop-blur-2xl bg-white/25 border border-white/30 p-8 rounded-3xl shadow-2xl flex-1">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mb-4 flex items-center">
                <SettingsIcon className="h-10 w-10 mr-4 text-purple-600 animate-pulse" />
                Settings
                <Sparkles className="h-8 w-8 ml-4 text-pink-500 animate-bounce" />
              </h1>
              <p className="text-xl text-gray-700">Customize your Soul Pet AI experience to perfection! ⚙️✨</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="backdrop-blur-2xl bg-white/30 border border-white/30 rounded-3xl shadow-2xl p-6 sticky top-8">
                <div className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full text-left px-6 py-4 rounded-2xl transition-all duration-300 flex items-center ${
                          activeTab === tab.id
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xl'
                            : 'text-gray-700 hover:bg-white/50 hover:text-purple-600'
                        }`}
                      >
                        <Icon className="h-5 w-5 mr-3" />
                        {tab.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {activeTab === 'profile' && renderProfileSettings()}
              {activeTab === 'notifications' && renderNotificationSettings()}
              {activeTab === 'privacy' && renderPrivacySettings()}
              {activeTab === 'account' && renderAccountSettings()}

              {/* Save Button */}
              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleSave}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-4 rounded-2xl font-bold hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-500 hover:scale-105 flex items-center"
                >
                  <Save className="h-6 w-6 mr-3" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;