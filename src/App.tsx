import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import BoltButton from './components/BoltButton';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import OnboardingPage from './pages/OnboardingPage';
import CreatePet from './pages/CreatePet';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import PetProfile from './pages/PetProfile';
import DailyWags from './pages/DailyWags';
import DreamCloset from './pages/DreamCloset';
import SoulPremium from './pages/SoulPremium';
import ConnectAllHearts from './pages/ConnectAllHearts';
import Settings from './pages/Settings';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your magical world...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

// App Layout Component for Authenticated Users
const AuthenticatedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 transition-colors duration-300">
      <Sidebar />
      <TopHeader />
      
      <main 
        className="transition-all duration-300 pt-16 relative z-10 min-h-screen"
        style={{
          marginLeft: 'var(--sidebar-width, 18rem)'
        }}
      >
        <div className="page-content">
          {children}
        </div>
      </main>
      
      {/* Bolt Button for authenticated pages */}
      <BoltButton />
    </div>
  );
};

// Main App Component
const AppContent = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="relative">
      <Routes>
        {/* Public Routes - No Layout */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : (
              <div className="relative">
                <HomePage />
                <BoltButton />
              </div>
            )
          } 
        />
        <Route 
          path="/auth" 
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : (
              <div className="relative">
                <AuthPage />
                <BoltButton />
              </div>
            )
          } 
        />
        
        {/* Protected Routes - With Authenticated Layout */}
        <Route 
          path="/onboarding" 
          element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                {user?.isNewUser ? <OnboardingPage /> : <Navigate to="/dashboard" replace />}
              </AuthenticatedLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                {user?.isNewUser ? <Navigate to="/onboarding" replace /> : <Dashboard />}
              </AuthenticatedLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/create" 
          element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <CreatePet />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/marketplace" 
          element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <Marketplace />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/daily-wags" 
          element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <DailyWags />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dream-closet" 
          element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <DreamCloset />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/soul-premium" 
          element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <SoulPremium />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/connect-all-hearts" 
          element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <ConnectAllHearts />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <Settings />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/pet/:id" 
          element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <PetProfile />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } 
        />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;