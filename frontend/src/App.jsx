import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import GrainOverlay from './components/GrainOverlay';
import NetraCareLogo from './components/NetraCareLogo';
import Home from './pages/Home';
import Login from './pages/Login';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import StaffDashboard from './pages/StaffDashboard';

function MainApp() {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState('home');

  // Auto-route to role dashboard on login
  useEffect(() => {
    if (user) {
      if (user.role === 'patient') setCurrentTab('patient');
      else if (user.role === 'doctor') setCurrentTab('doctor');
      else if (['staff', 'admin', 'sub_admin'].includes(user.role)) setCurrentTab('staff');
    }
  }, [user]);

  const handleLoginSuccess = (role) => {
    if (role === 'patient') setCurrentTab('patient');
    else if (role === 'doctor') setCurrentTab('doctor');
    else setCurrentTab('staff');
  };

  const handleNavigateToBook = () => {
    if (user?.role === 'patient') {
      setCurrentTab('patient');
    } else {
      setCurrentTab('login');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', width: '100%', background: 'var(--paper)' }}>
      {/* Compatibility layer */}
      <GrainOverlay />

      {/* YC-Classic Sticky Translucent Navigation Bar */}
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Main Centered Application Content */}
      <main
        style={{
          flex: 1,
          paddingTop: '24px',
          paddingBottom: '48px',
          position: 'relative',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxSizing: 'border-box',
        }}
      >
        {currentTab === 'home' && (
          <Home
            onNavigateToLogin={() => setCurrentTab('login')}
            onNavigateToBook={handleNavigateToBook}
          />
        )}

        {currentTab === 'login' && (
          <Login onLoginSuccess={handleLoginSuccess} />
        )}

        {currentTab === 'patient' && (
          user?.role === 'patient' ? (
            <PatientDashboard />
          ) : (
            <Login onLoginSuccess={handleLoginSuccess} />
          )
        )}

        {currentTab === 'doctor' && (
          user?.role === 'doctor' ? (
            <DoctorDashboard />
          ) : (
            <Login onLoginSuccess={handleLoginSuccess} />
          )
        )}

        {currentTab === 'staff' && (
          ['staff', 'admin', 'sub_admin'].includes(user?.role) ? (
            <StaffDashboard />
          ) : (
            <Login onLoginSuccess={handleLoginSuccess} />
          )
        )}
      </main>

      {/* YC-Classic SaaS Footer */}
      <footer
        style={{
          width: '100%',
          background: 'var(--paper)',
          borderTop: '1px solid var(--line)',
          padding: '36px 24px',
          position: 'relative',
          zIndex: 1,
          boxSizing: 'border-box',
        }}
      >
        <div className="container" style={{ padding: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <NetraCareLogo size={24} />
              <span style={{ fontWeight: 800, color: 'var(--ink)', fontSize: '0.98rem', letterSpacing: '-0.03em' }}>NetraCare</span>
              <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>·</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--muted)', fontWeight: 500 }}>AI Front Desk & Care Coordination</span>
            </div>
            <div style={{ display: 'flex', gap: '18px', fontSize: '13px', fontWeight: 600, color: 'var(--slate2)' }}>
              <span style={{ color: 'var(--orange)' }}>Single Rule Engine</span>
              <span>·</span>
              <span>FastAPI Backend</span>
              <span>·</span>
              <span>LangGraph Agent</span>
              <span>·</span>
              <span>Model Context Protocol</span>
            </div>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--muted)', borderTop: '1px solid var(--line)', paddingTop: '16px', margin: 0 }}>
            Asia/Kolkata Timezone · Zero Double Bookings Guarantee · Deterministic Emergency Red-Flag Triage · Synthetic Clinical Dataset
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
