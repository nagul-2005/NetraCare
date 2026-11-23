import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import FactOfTheDay from '../components/FactOfTheDay';
import PatientChat from '../components/PatientChat';
import { Calendar, Clock, AlertTriangle, CheckCircle, XCircle, RefreshCw, UserCheck, Stethoscope, Activity, FileText, CheckCircle2, ClipboardList } from 'lucide-react';

export default function PatientDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Booking form state
  const [doctorId, setDoctorId] = useState('D1');
  const [speciality, setSpeciality] = useState('Cataract');
  const [visitType, setVisitType] = useState('new');
  const [date, setDate] = useState(() => {
    // Tomorrow as sensible default
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [reason, setReason] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [emergencyAlert, setEmergencyAlert] = useState(null);

  // Load appointments and doctors
  const refreshAppointments = async () => {
    try {
      const data = await api.getMyAppointments();
      setAppointments(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    api.getDoctors().then((docs) => {
      setDoctors(docs);
      if (docs.length > 0) {
        setDoctorId(docs[0].id);
        setSpeciality(docs[0].specialities[0]);
      }
    });
    refreshAppointments().finally(() => setLoading(false));
  }, []);

  // Update available specialities when doctor changes
  const handleDoctorChange = (docId) => {
    setDoctorId(docId);
    const doc = doctors.find((d) => d.id === docId);
    if (doc && doc.specialities.length > 0) {
      setSpeciality(doc.specialities[0]);
    }
    setSelectedSlot('');
  };

  // Fetch free slots whenever doctor, date, or visitType changes
  useEffect(() => {
    if (!doctorId || !date) return;
    setSelectedSlot('');
    api.getSlots(doctorId, date, visitType)
      .then((res) => {
        setSlots(res.slots || []);
      })
      .catch((err) => {
        setSlots([]);
      });
  }, [doctorId, date, visitType]);

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    setBookingError(null);
    setBookingSuccess(null);
    setEmergencyAlert(null);

    if (!selectedSlot) {
      setBookingError('Please select an available time slot.');
      return;
    }

    setBookingLoading(true);
    try {
      const res = await api.bookAppointment({
        doctor_id: doctorId,
        speciality,
        visit_type: visitType,
        date,
        start_time: selectedSlot,
        reason: reason.trim() || undefined,
      });

      if (res.ok) {
        setBookingSuccess('Appointment booked successfully!');
        setReason('');
        setSelectedSlot('');
        refreshAppointments();
      }
    } catch (err) {
      if (err.data?.reason_code === 'RED_FLAG') {
        setEmergencyAlert(err.data.message);
      } else {
        setBookingError(err.data?.message || err.message || 'Booking refused by clinic rules.');
      }
    } finally {
      setBookingLoading(false);
    }
  };

  const handleCancel = async (apptId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      const res = await api.cancelMyAppointment(apptId, 'Patient requested cancellation');
      if (res.ok) {
        alert('Appointment cancelled successfully.');
      } else if (res.expected === 'to_staff') {
        alert('This appointment starts in under 2 hours. Your cancellation request has been forwarded to clinic staff for approval.');
      }
      refreshAppointments();
    } catch (err) {
      alert(err.message || 'Could not cancel appointment.');
    }
  };

  return (
    <div className="container" style={{ display: 'grid', gap: '28px' }}>
      <div>
        <span className="eyebrow">Patient Portal</span>
        <h2 style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', marginTop: '2px', color: 'var(--ink)' }}>Welcome, {user.name}</h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.92rem', lineHeight: 1.5 }}>
          Patient ID: <span className="mono">{user.id}</span> · Book, manage, or cancel your consultations.
        </p>
      </div>

      {/* Fact of the Day (Iteration 2 R5) */}
      <FactOfTheDay />

      {/* Patient Knowledge Base Chat (Iteration 3 R3) */}
      <PatientChat />

      {emergencyAlert && (
        <div className="banner-urgent">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <AlertTriangle size={22} />
            <h3 style={{ color: 'var(--danger)', margin: 0, fontSize: '1.15rem' }}>URGENT MEDICAL ATTENTION REQUIRED</h3>
          </div>
          <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--danger)' }}>{emergencyAlert}</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', alignItems: 'start' }}>
        {/* Booking Wizard Card */}
        <div className="card">
          <span className="eyebrow">Schedule Consultation</span>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', color: 'var(--ink)' }}>Book an Appointment</h3>

          {bookingSuccess && (
            <div style={{
              background: 'var(--success-soft)',
              border: '1px solid var(--success-line)',
              color: 'var(--success)',
              padding: '10px 14px',
              borderRadius: '10px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.88rem',
            }}>
              <CheckCircle size={18} />
              <span>{bookingSuccess}</span>
            </div>
          )}

          {bookingError && (
            <div style={{
              background: 'var(--danger-soft)',
              border: '1px solid var(--danger-line)',
              color: 'var(--danger)',
              padding: '10px 14px',
              borderRadius: '10px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.88rem',
            }}>
              <XCircle size={18} />
              <span>{bookingError}</span>
            </div>
          )}

          <form onSubmit={handleBookSubmit}>
            <div className="form-group">
              <label className="form-label">Doctor</label>
              <select
                className="form-control"
                value={doctorId}
                onChange={(e) => handleDoctorChange(e.target.value)}
              >
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.id})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Speciality</label>
              <select
                className="form-control"
                value={speciality}
                onChange={(e) => setSpeciality(e.target.value)}
              >
                {doctors.find((d) => d.id === doctorId)?.specialities.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Visit Type</label>
              <select
                className="form-control"
                value={visitType}
                onChange={(e) => setVisitType(e.target.value)}
              >
                <option value="new">New Consultation (20 mins)</option>
                <option value="follow_up">Follow-up Visit (10 mins)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-control"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Available Slots</label>
              {slots.length === 0 ? (
                <div style={{
                  padding: '14px',
                  background: 'var(--wash)',
                  border: '1px solid var(--line)',
                  borderRadius: '10px',
                  color: 'var(--muted)',
                  fontSize: '0.86rem',
                  textAlign: 'center',
                }}>
                  No available slots on this date (Closed, Surgery, Off, or Fully Booked).
                </div>
              ) : (
                <div className="slot-grid">
                  {slots.map((s) => (
                    <button
                      type="button"
                      key={s.start_time}
                      className={`slot-btn ${selectedSlot === s.start_time ? 'selected' : ''}`}
                      onClick={() => setSelectedSlot(s.start_time)}
                    >
                      {s.start_time}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">
                  Reason for Visit <span style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <span style={{ fontSize: '0.76rem', color: reason.length > 300 ? 'var(--danger)' : 'var(--muted)' }}>
                  {reason.length}/300
                </span>
              </div>
              <textarea
                className="form-control"
                rows="2"
                placeholder="What is the reason for your visit? Describe your symptoms..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                maxLength={300}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '6px' }}
              disabled={bookingLoading || !selectedSlot}
            >
              {bookingLoading ? 'Checking Rules & Booking...' : `Confirm Booking (${selectedSlot || 'Select Slot'})`}
            </button>
          </form>
        </div>

        {/* My Appointments List / Medical Record */}
        <div className="card" style={{ padding: '24px 28px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '20px',
            paddingBottom: '16px',
            borderBottom: '1px solid var(--line)',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className="eyebrow" style={{ margin: 0 }}>Medical Record</span>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  background: 'var(--wash)',
                  color: 'var(--muted)',
                  border: '1px solid var(--line)',
                }}>
                  {appointments.length} {appointments.length === 1 ? 'Record' : 'Records'}
                </span>
              </div>
              <h3 style={{ fontSize: '1.28rem', margin: 0, fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.02em' }}>
                My Consultation History
              </h3>
            </div>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ padding: '7px 12px', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              onClick={refreshAppointments}
            >
              <RefreshCw size={13} /> Refresh
            </button>
          </div>

          {loading ? (
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', textAlign: 'center', padding: '24px 0' }}>
              Loading clinical records...
            </p>
          ) : appointments.length === 0 ? (
            <div style={{
              padding: '36px 20px',
              textAlign: 'center',
              background: 'var(--wash)',
              borderRadius: '12px',
              border: '1px dashed var(--line)',
            }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'var(--paper)',
                border: '1px solid var(--line)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '10px',
                color: 'var(--muted)',
              }}>
                <ClipboardList size={20} />
              </div>
              <h4 style={{ fontSize: '0.98rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '4px' }}>
                No Consultations on File
              </h4>
              <p style={{ color: 'var(--muted)', fontSize: '0.86rem', maxWidth: '300px', margin: '0 auto' }}>
                Your completed visits, diagnoses, and doctor prescriptions will appear here.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {appointments.map((a) => (
                <div
                  key={a.id}
                  style={{
                    border: '1px solid var(--line)',
                    borderRadius: '14px',
                    padding: '20px',
                    background: 'var(--paper)',
                    boxShadow: 'var(--card-shadow)',
                    display: 'grid',
                    gap: '14px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {/* Top Meta Bar: Record ID + Origin & Status Badge */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingBottom: '10px',
                    borderBottom: '1px solid var(--line)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        fontFamily: 'monospace',
                        fontSize: '0.76rem',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background: 'var(--wash)',
                        border: '1px solid var(--line)',
                        color: 'var(--muted)',
                        fontWeight: 600,
                        letterSpacing: '0.03em',
                      }}>
                        #{a.id}
                      </span>
                      {a.source && (
                        <span style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>
                          Booked via {a.source}
                        </span>
                      )}
                    </div>
                    <span
                      className={`badge badge-${a.status}`}
                      style={{
                        textTransform: 'capitalize',
                        fontSize: '0.74rem',
                        padding: '3px 10px',
                        fontWeight: 600,
                      }}
                    >
                      {a.status === 'completed' && (
                        <CheckCircle2 size={12} style={{ marginRight: '4px', verticalAlign: '-1px' }} />
                      )}
                      {a.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Doctor Profile Row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: 'var(--wash)',
                      border: '1px solid var(--line)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      color: 'var(--orangeDark)',
                    }}>
                      <Stethoscope size={20} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.08rem', fontWeight: 700, margin: 0, color: 'var(--ink)' }}>
                        {a.doctor_name}
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', marginTop: '2px' }}>
                        <span style={{ fontWeight: 600, color: 'var(--slate2)' }}>{a.speciality}</span>
                        <span style={{ color: 'var(--muted)' }}>·</span>
                        <span style={{ color: 'var(--muted)' }}>
                          {a.visit_type === 'new' ? 'New Consultation (20m)' : 'Follow-up (10m)'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Clean Schedule Strip (No Emojis) */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '9px 14px',
                    background: 'var(--wash)',
                    borderRadius: '9px',
                    border: '1px solid var(--line)',
                    fontSize: '0.84rem',
                  }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--ink)', fontWeight: 600 }}>
                      <Calendar size={14} color="var(--muted)" />
                      <span>{a.date}</span>
                    </div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--slate2)', fontWeight: 500 }}>
                      <Clock size={14} color="var(--muted)" />
                      <span>{a.start_time} – {a.end_time}</span>
                    </div>
                  </div>

                  {/* Reported Symptoms */}
                  {a.reason && (
                    <div style={{
                      padding: '10px 14px',
                      background: 'var(--paper)',
                      borderRadius: '8px',
                      border: '1px solid var(--line)',
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: 'var(--muted)',
                        marginBottom: '4px',
                      }}>
                        <Activity size={12} color="var(--muted)" /> Reported Symptoms
                      </div>
                      <p style={{ fontSize: '0.88rem', color: 'var(--slate2)', margin: 0, lineHeight: 1.45 }}>
                        {a.reason}
                      </p>
                    </div>
                  )}

                  {/* Doctor's Clinical Assessment & Advice */}
                  {a.doctor_note && (
                    <div style={{
                      background: 'var(--paper)',
                      border: '1px solid var(--line)',
                      borderLeft: '3px solid var(--orange)',
                      borderRadius: '8px',
                      padding: '12px 14px',
                      boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '6px',
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          color: 'var(--orangeDark)',
                        }}>
                          <FileText size={12} /> Clinical Assessment & Notes
                        </div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>
                          Prescribed by {a.doctor_name}
                        </span>
                      </div>
                      <p style={{
                        fontSize: '0.88rem',
                        lineHeight: 1.55,
                        color: 'var(--ink)',
                        margin: 0,
                        fontWeight: 500,
                      }}>
                        {a.doctor_note}
                      </p>
                    </div>
                  )}

                  {/* Cancel Action (if booked) */}
                  {a.status === 'booked' && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '6px' }}>
                      <button
                        type="button"
                        className="btn btn-danger"
                        style={{
                          padding: '6px 14px',
                          fontSize: '0.80rem',
                        }}
                        onClick={() => handleCancel(a.id)}
                      >
                        Cancel Consultation
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
