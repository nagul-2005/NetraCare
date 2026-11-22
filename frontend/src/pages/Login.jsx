import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import NetraCareLogo from '../components/NetraCareLogo';
import { User, Stethoscope, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';

const DOCTORS = [
  { id: 'D1', name: 'Dr. Anand Rao', spec: 'Cataract, General' },
  { id: 'D2', name: 'Dr. Meera Iyer', spec: 'Glaucoma, Cataract' },
  { id: 'D3', name: 'Dr. Kiran Shah', spec: 'Retina, General' },
  { id: 'D4', name: 'Dr. Fatima Khan', spec: 'Cornea, Refractive, Dry eye' },
  { id: 'D5', name: 'Dr. Vikram Menon', spec: 'Paediatric, Squint, General' },
];

export default function Login({ onLoginSuccess }) {
  const { login } = useAuth();
  const [role, setRole] = useState('patient');
  const [mobile, setMobile] = useState('');
  const [name, setName] = useState('');
  const [doctorId, setDoctorId] = useState('D1');
  const [staffName, setStaffName] = useState('Front Desk Staff');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      let payload;
      if (role === 'patient') {
        payload = { role: 'patient', mobile: mobile.trim(), name: name.trim() };
      } else if (role === 'doctor') {
        payload = { role: 'doctor', doctor_id: doctorId };
      } else {
        payload = { role: 'staff', name: staffName.trim() };
      }

      const res = await login(payload);
      if (res.ok) {
        onLoginSuccess(role);
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please verify your details.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '480px', marginTop: '36px', marginBottom: '36px' }}>
      <div className="card" style={{ padding: '38px 32px', textAlign: 'center', boxShadow: 'var(--browser-shadow)' }}>
        {/* Logo and Eyebrow properly stacked */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '14px' }}>
          <NetraCareLogo size={44} />
          <span className="eyebrow" style={{ marginTop: '12px', marginBottom: '0' }}>Role Verification</span>
        </div>

        <h2 style={{ fontSize: '1.75rem', textAlign: 'center', marginBottom: '6px', color: 'var(--ink)' }}>
          Sign In to NetraCare
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.92rem', marginBottom: '24px' }}>
          Select your portal role to access your schedule and care appointments.
        </p>

        {/* Role Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '4px',
          background: 'var(--wash)',
          padding: '4px',
          borderRadius: '11px',
          border: '1px solid var(--line)',
          marginBottom: '24px',
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
              padding: '8px 10px',
              fontSize: '0.86rem',
            }}
            onClick={() => { setRole('patient'); setError(null); }}
          >
            <User size={15} /> Patient
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
              padding: '8px 10px',
              fontSize: '0.86rem',
            }}
            onClick={() => { setRole('doctor'); setError(null); }}
          >
            <Stethoscope size={15} /> Doctor
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
              padding: '8px 10px',
              fontSize: '0.86rem',
            }}
            onClick={() => { setRole('staff'); setError(null); }}
          >
            <ShieldCheck size={15} /> Staff
          </button>
        </div>

        {error && (
          <div style={{
            background: 'var(--danger-soft)',
            border: '1px solid var(--danger-line)',
            color: 'var(--danger)',
            borderRadius: '10px',
            padding: '12px 14px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.88rem',
            textAlign: 'left',
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          {role === 'patient' && (
            <div>
              <div className="form-group">
                <label className="form-label">Mobile Number</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 9000000001"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '24px' }}>
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
            style={{ width: '100%', padding: '12px', fontSize: '0.96rem' }}
            disabled={submitting}
          >
            {submitting ? 'Authenticating...' : 'Sign In'} <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
