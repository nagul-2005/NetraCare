import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import NetraCareLogo from '../components/NetraCareLogo';
import { User, Stethoscope, ShieldCheck, ArrowRight, AlertCircle, CheckCircle, UserPlus, LogIn, Sparkles } from 'lucide-react';

const DOCTORS = [
  { id: 'D1', name: 'Dr. Anand Rao', spec: 'Cataract, General' },
  { id: 'D2', name: 'Dr. Meera Iyer', spec: 'Glaucoma, Cataract' },
  { id: 'D3', name: 'Dr. Kiran Shah', spec: 'Retina, General' },
  { id: 'D4', name: 'Dr. Fatima Khan', spec: 'Cornea, Refractive, Dry eye' },
  { id: 'D5', name: 'Dr. Vikram Menon', spec: 'Paediatric, Squint, General' },
];

export default function Login({ onLoginSuccess }) {
  const { login, register } = useAuth();
  const [role, setRole] = useState('patient');
  const [patientMode, setPatientMode] = useState('signin'); // 'signin' or 'register'
  
  // Patient fields
  const [mobile, setMobile] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  
  // Availability status for registration
  const [checkingMobile, setCheckingMobile] = useState(false);
  const [mobileStatus, setMobileStatus] = useState(null); // { available: bool, registered: bool, name?: str }

  // Doctor & Staff fields
  const [doctorId, setDoctorId] = useState('D1');
  const [staffName, setStaffName] = useState('Front Desk Staff');
  
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Check mobile availability when user enters 10 digits in register mode
  useEffect(() => {
    const clean = mobile.trim();
    if (role === 'patient' && patientMode === 'register' && clean.length >= 10) {
      const timer = setTimeout(async () => {
        setCheckingMobile(true);
        try {
          const res = await api.checkAvailability(clean);
          setMobileStatus(res);
        } catch (err) {
          setMobileStatus(null);
        } finally {
          setCheckingMobile(false);
        }
      }, 350);
      return () => clearTimeout(timer);
    } else {
      setMobileStatus(null);
    }
  }, [mobile, role, patientMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (role === 'patient') {
        if (patientMode === 'register') {
          const parsedAge = parseInt(age, 10);
          if (isNaN(parsedAge) || parsedAge < 1 || parsedAge > 120) {
            setError('Please enter a valid age between 1 and 120 years.');
            setSubmitting(false);
            return;
          }

          const res = await register({
            name: name.trim(),
            mobile: mobile.trim(),
            age: parsedAge,
          });
          if (res.ok) {
            onLoginSuccess('patient');
          }
        } else {
          // Sign In
          const res = await login({
            role: 'patient',
            mobile: mobile.trim(),
            name: name.trim(),
          });
          if (res.ok) {
            onLoginSuccess('patient');
          }
        }
      } else if (role === 'doctor') {
        const res = await login({ role: 'doctor', doctor_id: doctorId });
        if (res.ok) {
          onLoginSuccess('doctor');
        }
      } else {
        const res = await login({ role: 'staff', name: staffName.trim() });
        if (res.ok) {
          onLoginSuccess('staff');
        }
      }
    } catch (err) {
      const errMsg = err.message || (typeof err.data === 'string' ? err.data : 'Authentication failed. Please verify your details.');
      setError(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const switchToRegister = () => {
    setPatientMode('register');
    setError(null);
  };

  const switchToSignIn = (prefillName = '') => {
    setPatientMode('signin');
    if (prefillName) setName(prefillName);
    setError(null);
  };

  return (
    <div className="container" style={{ maxWidth: '480px', marginTop: '24px', marginBottom: '32px' }}>
      <div className="card" style={{ padding: 'clamp(24px, 5vw, 38px) clamp(16px, 4vw, 32px)', textAlign: 'center', boxShadow: 'var(--browser-shadow)' }}>
        {/* Logo and Eyebrow */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '14px' }}>
          <NetraCareLogo size={42} />
          <span className="eyebrow" style={{ marginTop: '10px', marginBottom: '0' }}>Portal Authentication</span>
        </div>

        <h2 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.75rem)', textAlign: 'center', marginBottom: '6px', color: 'var(--ink)' }}>
          {role === 'patient'
            ? patientMode === 'register'
              ? 'Patient Register'
              : 'Patient SignIn'
            : role === 'doctor'
            ? 'Doctor Portal'
            : 'Staff Portal'}
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
          {role === 'patient'
            ? patientMode === 'register'
              ? 'Enter your details to create your patient profile.'
              : 'Sign in to access your consultations and booking assistant.'
            : 'Select your role to access clinic care and appointments.'}
        </p>

        {/* Primary Role Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '4px',
          background: 'var(--wash)',
          padding: '4px',
          borderRadius: '11px',
          border: '1px solid var(--line)',
          marginBottom: '18px',
        }}>
          <button
            type="button"
            className="btn"
            style={{
              background: role === 'patient' ? 'var(--paper)' : 'transparent',
              color: role === 'patient' ? 'var(--orangeDark)' : 'var(--muted)',
              border: role === 'patient' ? '1px solid var(--orangeLine)' : '1px solid transparent',
              boxShadow: role === 'patient' ? 'var(--card-shadow)' : 'none',
              fontWeight: role === 'patient' ? 700 : 500,
              borderRadius: '8px',
              padding: '8px 6px',
              fontSize: '0.84rem',
              gap: '4px',
            }}
            onClick={() => { setRole('patient'); setError(null); }}
          >
            <User size={14} /> Patient
          </button>
          <button
            type="button"
            className="btn"
            style={{
              background: role === 'doctor' ? 'var(--paper)' : 'transparent',
              color: role === 'doctor' ? 'var(--orangeDark)' : 'var(--muted)',
              border: role === 'doctor' ? '1px solid var(--orangeLine)' : '1px solid transparent',
              boxShadow: role === 'doctor' ? 'var(--card-shadow)' : 'none',
              fontWeight: role === 'doctor' ? 700 : 500,
              borderRadius: '8px',
              padding: '8px 6px',
              fontSize: '0.84rem',
              gap: '4px',
            }}
            onClick={() => { setRole('doctor'); setError(null); }}
          >
            <Stethoscope size={14} /> Doctor
          </button>
          <button
            type="button"
            className="btn"
            style={{
              background: role === 'staff' ? 'var(--paper)' : 'transparent',
              color: role === 'staff' ? 'var(--orangeDark)' : 'var(--muted)',
              border: role === 'staff' ? '1px solid var(--orangeLine)' : '1px solid transparent',
              boxShadow: role === 'staff' ? 'var(--card-shadow)' : 'none',
              fontWeight: role === 'staff' ? 700 : 500,
              borderRadius: '8px',
              padding: '8px 6px',
              fontSize: '0.84rem',
              gap: '4px',
            }}
            onClick={() => { setRole('staff'); setError(null); }}
          >
            <ShieldCheck size={14} /> Staff
          </button>
        </div>

        {/* Patient Sub-Toggle: SignIn vs Register */}
        {role === 'patient' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '6px',
            background: 'var(--wash)',
            padding: '5px',
            borderRadius: '10px',
            border: '1px solid var(--line)',
            marginBottom: '22px',
          }}>
            <button
              type="button"
              className="btn"
              style={{
                background: patientMode === 'signin' ? 'var(--paper)' : 'transparent',
                color: patientMode === 'signin' ? 'var(--orangeDark)' : 'var(--muted)',
                border: patientMode === 'signin' ? '1px solid var(--orangeLine)' : '1px solid transparent',
                boxShadow: patientMode === 'signin' ? 'var(--card-shadow)' : 'none',
                fontWeight: patientMode === 'signin' ? 700 : 500,
                borderRadius: '8px',
                padding: '9px 12px',
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.15s ease',
              }}
              onClick={() => { setPatientMode('signin'); setError(null); }}
            >
              <LogIn size={15} /> SignIn
            </button>
            <button
              type="button"
              className="btn"
              style={{
                background: patientMode === 'register' ? 'var(--paper)' : 'transparent',
                color: patientMode === 'register' ? 'var(--orangeDark)' : 'var(--muted)',
                border: patientMode === 'register' ? '1px solid var(--orangeLine)' : '1px solid transparent',
                boxShadow: patientMode === 'register' ? 'var(--card-shadow)' : 'none',
                fontWeight: patientMode === 'register' ? 700 : 500,
                borderRadius: '8px',
                padding: '9px 12px',
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.15s ease',
              }}
              onClick={() => { setPatientMode('register'); setError(null); }}
            >
              <UserPlus size={15} /> Register
            </button>
          </div>
        )}

        {/* Error Alert with switch action if patient not found */}
        {error && (
          <div style={{
            background: 'var(--danger-soft)',
            border: '1px solid var(--danger-line)',
            color: 'var(--danger)',
            borderRadius: '10px',
            padding: '12px 14px',
            marginBottom: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            fontSize: '0.88rem',
            textAlign: 'left',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
            {role === 'patient' && patientMode === 'signin' && error.toLowerCase().includes('register') && (
              <button
                type="button"
                onClick={switchToRegister}
                className="btn btn-secondary"
                style={{
                  alignSelf: 'flex-start',
                  fontSize: '0.82rem',
                  padding: '5px 12px',
                  border: '1px solid var(--orangeLine)',
                  color: 'var(--orangeDark)',
                  background: 'var(--paper)',
                }}
              >
                Register as a New Patient &rarr;
              </button>
            )}
          </div>
        )}

        {/* Forms */}
        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          {role === 'patient' && patientMode === 'signin' && (
            <div>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Asha Verma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '22px' }}>
                <label className="form-label">Registered Mobile Number</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 9000000001"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          {role === 'patient' && patientMode === 'register' && (
            <div>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label">Mobile Number</label>
                  {checkingMobile && (
                    <span style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>Checking availability...</span>
                  )}
                </div>
                <input
                  type="text"
                  className="form-control"
                  placeholder="10-digit mobile number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  maxLength={15}
                  required
                />
                {/* Real-time Availability Feedback */}
                {mobileStatus && (
                  <div style={{ marginTop: '5px', fontSize: '0.80rem' }}>
                    {mobileStatus.available ? (
                      <span style={{ color: 'var(--success)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                        <CheckCircle size={13} /> Mobile number is available
                      </span>
                    ) : (
                      <span style={{ color: 'var(--danger)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                        <AlertCircle size={13} /> Already registered under {mobileStatus.name}.{' '}
                        <button
                          type="button"
                          onClick={() => switchToSignIn(mobileStatus.name)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--orangeDark)',
                            textDecoration: 'underline',
                            fontWeight: 700,
                            cursor: 'pointer',
                            padding: 0,
                          }}
                        >
                          Sign In?
                        </button>
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="form-group" style={{ marginBottom: '22px' }}>
                <label className="form-label">Age (in years)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="e.g. 28"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  min="1"
                  max="120"
                  required
                />
                <span style={{ fontSize: '0.74rem', color: 'var(--muted)', marginTop: '3px', display: 'block' }}>
                  Age helps our clinical assistant route you to appropriate adult or paediatric specialists.
                </span>
              </div>
            </div>
          )}

          {role === 'doctor' && (
            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label">Select Your Doctor Profile</label>
              <select
                className="form-control"
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
              >
                {DOCTORS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.id}) — {d.spec}
                  </option>
                ))}
              </select>
            </div>
          )}

          {role === 'staff' && (
            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label">Staff Member Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Front Desk Staff"
                value={staffName}
                onChange={(e) => setStaffName(e.target.value)}
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', fontSize: '0.96rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            disabled={submitting}
          >
            {submitting ? (
              'Processing...'
            ) : role === 'patient' && patientMode === 'register' ? (
              <>
                <UserPlus size={16} /> Register & Enter Portal
              </>
            ) : (
              <>
                SignIn <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Switch link footer for patients */}
        {role === 'patient' && (
          <div style={{ marginTop: '18px', fontSize: '0.84rem', color: 'var(--muted)', textAlign: 'center' }}>
            {patientMode === 'signin' ? (
              <span>
                New to NetraCare?{' '}
                <button
                  type="button"
                  onClick={switchToRegister}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--orangeDark)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Register here
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchToSignIn()}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--orangeDark)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  SignIn here
                </button>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
