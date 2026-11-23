import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Stethoscope, ShieldCheck, Menu, X } from 'lucide-react';
import NetraCareLogo from './NetraCareLogo';

export default function Navbar({ currentTab, setCurrentTab }) {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (tab, scrollId = null) => {
    setMobileMenuOpen(false);
    setCurrentTab(tab);
    if (scrollId && tab === 'home') {
      setTimeout(() => {
        const el = document.getElementById(scrollId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    }
  };

  return (
    <header className="nav-pill-wrapper">
      <nav className="nav-pill-bar" aria-label="NetraCare Navigation">
        {/* Brand & YC-Classic NetraCare Logo */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          onClick={() => handleNav('home')}
        >
          <NetraCareLogo size={32} />

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span
              style={{
                fontSize: '1.28rem',
                fontWeight: 900,
                color: 'var(--ink)',
                letterSpacing: '-0.045em',
                fontFamily: 'var(--font-display)',
              }}
            >
              NetraCare
            </span>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                color: 'var(--muted)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              Clinic
            </span>
          </div>
        </div>

        {/* Desktop Links (YC Clean Text Buttons) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="hide-on-mobile">
          <button
            className={`nav-link-btn ${currentTab === 'home' ? 'active' : ''}`}
            onClick={() => handleNav('home')}
          >
            Clinic Info
          </button>

          <button
            className="nav-link-btn"
            onClick={() => handleNav('home', 'doctors')}
          >
            Doctors
          </button>

          <button
            className="nav-link-btn"
            onClick={() => handleNav('home', 'schedule')}
          >
            OPD Grid
          </button>

          <button
            className="nav-link-btn"
            onClick={() => handleNav('home', 'faq')}
          >
            FAQ
          </button>

          {user?.role === 'patient' && (
            <button
              className={`nav-link-btn ${currentTab === 'patient' ? 'active' : ''}`}
              onClick={() => handleNav('patient')}
            >
              My Appointments
            </button>
          )}

          {user?.role === 'doctor' && (
            <button
              className={`nav-link-btn ${currentTab === 'doctor' ? 'active' : ''}`}
              onClick={() => handleNav('doctor')}
            >
              Doctor Schedule
            </button>
          )}

          {['staff', 'admin', 'sub_admin'].includes(user?.role) && (
            <button
              className={`nav-link-btn ${currentTab === 'staff' ? 'active' : ''}`}
              onClick={() => handleNav('staff')}
            >
              Staff Dashboard
            </button>
          )}
        </div>

        {/* Right Action: Orange Button or User Chip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="badge" style={{ textTransform: 'capitalize', display: 'flex', alignItems: 'center', fontSize: '0.78rem', padding: '4px 8px' }}>
                {user.role === 'patient' && <User size={13} style={{ marginRight: '4px' }} />}
                {user.role === 'doctor' && <Stethoscope size={13} style={{ marginRight: '4px' }} />}
                {['staff', 'admin', 'sub_admin'].includes(user.role) && <ShieldCheck size={13} style={{ marginRight: '4px' }} />}
                <span style={{ maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.name.split(' ')[0]}
                </span>
                <span className="hide-on-mobile" style={{ marginLeft: '3px' }}>({user.role})</span>
              </span>
              <button
                className="btn btn-secondary"
                style={{ padding: '6px 10px', fontSize: '0.8rem', minHeight: '34px' }}
                onClick={() => {
                  logout();
                  setCurrentTab('home');
                }}
                title="Log out"
              >
                <LogOut size={13} />
                <span className="hide-on-mobile">Log out</span>
              </button>
            </div>
          ) : (
            <button
              className="btn btn-primary"
              style={{
                padding: '7px 12px',
                fontSize: '13px',
                fontWeight: 600,
                minHeight: '34px',
              }}
              onClick={() => setCurrentTab('login')}
            >
              Access Portals
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'var(--paper)',
              border: '1px solid var(--line)',
              borderRadius: '8px',
              width: '36px',
              height: '36px',
              cursor: 'pointer',
              color: 'var(--ink)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            className="mobile-nav-toggle"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '64px',
            left: '12px',
            right: '12px',
            background: 'var(--paper)',
            borderRadius: '14px',
            border: '1px solid var(--line)',
            padding: '16px',
            boxShadow: 'var(--browser-shadow)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            zIndex: 1100,
          }}
        >
          {user && (
            <div style={{ padding: '8px 12px', background: 'var(--wash)', borderRadius: '8px', marginBottom: '4px', fontSize: '0.88rem' }}>
              <div style={{ color: 'var(--muted)', fontSize: '0.74rem', textTransform: 'uppercase', fontWeight: 700 }}>Signed In As</div>
              <div style={{ fontWeight: 700, color: 'var(--ink)' }}>{user.name} ({user.role})</div>
            </div>
          )}

          <button
            className="btn btn-secondary"
            style={{ justifyContent: 'flex-start', padding: '10px 14px', fontSize: '14px' }}
            onClick={() => handleNav('home')}
          >
            Clinic Info
          </button>
          <button
            className="btn btn-secondary"
            style={{ justifyContent: 'flex-start', padding: '10px 14px', fontSize: '14px' }}
            onClick={() => handleNav('home', 'doctors')}
          >
            Our Specialists
          </button>
          <button
            className="btn btn-secondary"
            style={{ justifyContent: 'flex-start', padding: '10px 14px', fontSize: '14px' }}
            onClick={() => handleNav('home', 'schedule')}
          >
            Weekly OPD Grid
          </button>
          <button
            className="btn btn-secondary"
            style={{ justifyContent: 'flex-start', padding: '10px 14px', fontSize: '14px' }}
            onClick={() => handleNav('home', 'faq')}
          >
            FAQ
          </button>

          {user?.role === 'patient' && (
            <button
              className="btn btn-primary"
              style={{ justifyContent: 'flex-start', padding: '10px 14px', fontSize: '14px' }}
              onClick={() => handleNav('patient')}
            >
              My Appointments
            </button>
          )}

          {user?.role === 'doctor' && (
            <button
              className="btn btn-primary"
              style={{ justifyContent: 'flex-start', padding: '10px 14px', fontSize: '14px' }}
              onClick={() => handleNav('doctor')}
            >
              Doctor Schedule
            </button>
          )}

          {['staff', 'admin', 'sub_admin'].includes(user?.role) && (
            <button
              className="btn btn-primary"
              style={{ justifyContent: 'flex-start', padding: '10px 14px', fontSize: '14px' }}
              onClick={() => handleNav('staff')}
            >
              Staff Dashboard
            </button>
          )}

          {user && (
            <button
              className="btn btn-secondary"
              style={{ justifyContent: 'flex-start', padding: '10px 14px', fontSize: '14px', color: 'var(--danger)', marginTop: '6px' }}
              onClick={() => {
                setMobileMenuOpen(false);
                logout();
                setCurrentTab('home');
              }}
            >
              <LogOut size={14} /> Log out
            </button>
          )}
        </div>
      )}
    </header>
  );
}
