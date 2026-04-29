import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import OrphansPage from './components/OrphansPage';
import OrphanDetailPage from './components/OrphanDetailPage';
import StaffPage from './components/StaffPage';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import DonationsPage from './components/DonationsPage';
import DonorsPage from './components/donors/DonorsPage';
import './App.css';

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <div>Loading...</div>;
  }
  if (user) {
    return <>{children}</>;
  } else {
    return <Navigate to="/login" />;
  }
};

const AppContent = () => {
  const { user, logout } = useAuth();
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Navigation Header */}
        <header className="bg-white shadow-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16 border-b border-gray-100">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
                    🏠 Panti Asuhan
                  </h1>
                </div>
              </div>
              
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-1">
                <a 
                  href="/dashboard" 
                  className="px-4 py-2 rounded-lg text-gray-600 hover:text-blue-700 hover:bg-blue-50 transition-all duration-200 font-medium"
                >
                  Dashboard
                </a>
                <a 
                  href="/orphans" 
                  className="px-4 py-2 rounded-lg text-gray-600 hover:text-blue-700 hover:bg-blue-50 transition-all duration-200 font-medium"
                >
                  Anak Asuh
                </a>
                <a 
                  href="/staff" 
                  className="px-4 py-2 rounded-lg text-gray-600 hover:text-blue-700 hover:bg-blue-50 transition-all duration-200 font-medium"
                >
                  Staff
                </a>
                 {/* <a 
                  href="/donations" 
                  className="px-4 py-2 rounded-lg text-gray-600 hover:text-blue-700 hover:bg-blue-50 transition-all duration-200 font-medium"
                >
                  Donasi
                </a> */}
                <a 
                  href="/donations" 
                  className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-all duration-200 font-medium flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Donasi
                </a>
                <a 
                  href="/donors" 
                  className="px-4 py-2 rounded-lg text-gray-600 hover:text-blue-700 hover:bg-blue-50 transition-all duration-200 font-medium flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Donor
                </a>
                {user && (
                  <div className="ml-4 pl-4 border-l border-gray-200 flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">{user.name}</span>
                    <button
                      onClick={logout}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </nav>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/orphans/:id" element={
              <ProtectedRoute>
                <OrphanDetailPage />
              </ProtectedRoute>
            } />
            <Route path="/orphans/*" element={
              <ProtectedRoute>
                <OrphansPage />
              </ProtectedRoute>
            } />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/staff" element={
              <ProtectedRoute>
                <StaffPage />
              </ProtectedRoute>
            } />
            <Route path="/donors" element={
              <ProtectedRoute>
                <DonorsPage />
              </ProtectedRoute>
            } />
            <Route path="/donations" element={
              <ProtectedRoute>
                <DonationsPage />
              </ProtectedRoute>
            } />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-center text-sm text-gray-500">
              © 2026 Sistem Manajemen Panti Asuhan. Dibuat dengan ❤️
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
