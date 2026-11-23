import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, CheckCircle2, FileText, User, Sparkles, AlertCircle, X } from 'lucide-react';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [scheduleData, setScheduleData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Complete visit modal state
  const [activeAppt, setActiveAppt] = useState(null);
  const [clinicalNote, setClinicalNote] = useState('');
  const [completing, setCompleting] = useState(false);

  // Patient summary modal state (Iteration 2 R6)
  const [summaryData, setSummaryData] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState(null);

  // Leave modal state (Iteration 4 R7)
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveDate, setLeaveDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [leaveSession, setLeaveSession] = useState('FULL');
  const [leaveSubmitting, setLeaveSubmitting] = useState(false);

  const fetchSchedule = async (selectedDate) => {
    setLoading(true);
    try {
      const res = await api.getDoctorSchedule(selectedDate);
      setScheduleData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule(date);
  }, [date]);

  const handleOpenSummary = async (apptId) => {
    setSummaryLoading(true);
    setSummaryError(null);
    setSummaryData(null);
    try {
      const res = await api.getDoctorPatientSummary(apptId);
      setSummaryData(res);
    } catch (e) {
      setSummaryError(e.message || 'Failed to load summary.');
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleCompleteSubmit = async (e) => {
    e.preventDefault();
    if (!clinicalNote.trim()) {
      alert('Please enter clinical findings and advice.');
      return;
    }
    setCompleting(true);
    try {
      await api.completeVisit(activeAppt.id, clinicalNote.trim());
      alert(`Visit ${activeAppt.id} successfully marked as completed.`);
      setActiveAppt(null);
      setClinicalNote('');
      fetchSchedule(date);
    } catch (err) {
      alert(err.message || 'Failed to complete visit.');
    } finally {
      setCompleting(false);
    }
  };

  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    setLeaveSubmitting(true);
    try {
      const res = await api.markDoctorLeave({ date: leaveDate, session: leaveSession });
      alert(`Leave recorded! ${res.affected_count} affected appointments moved to proposals for Staff.`);
      setShowLeaveModal(false);
      fetchSchedule(date);
    } catch (err) {
      alert(err.message || 'Failed to record leave.');
    } finally {
      setLeaveSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ display: 'grid', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span className="eyebrow">Doctor Station</span>
          <h2 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.9rem)', marginTop: '2px', color: 'var(--ink)' }}>{user.name} — OPD Schedule</h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.92rem' }}>Doctor ID: <span className="mono">{user.id}</span></p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={() => setShowLeaveModal(true)} style={{ color: 'var(--orangeDark)', fontWeight: 600, padding: '7px 12px', fontSize: '0.84rem' }}>
            Mark Leave (R7)
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <label style={{ fontWeight: 600, fontSize: '0.84rem', color: 'var(--ink)' }}>Date:</label>
            <input
              type="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{ width: '145px', padding: '6px 10px' }}
            />
          </div>
        </div>
      </div>

      {/* Session status banner */}
      {scheduleData?.sessions && (
        <div className="card" style={{ display: 'flex', gap: '12px 20px', alignItems: 'center', padding: '12px 16px', background: 'var(--wash)', border: '1px solid var(--line)', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 600, color: 'var(--slate)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Morning (09:00 - 13:00):
            </span>
            <span className={`badge ${scheduleData.sessions.AM === 'OPD' ? 'badge-opd' : 'badge-off'}`} style={{ fontSize: '0.76rem' }}>
              {scheduleData.sessions.AM || 'NO OPD'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 600, color: 'var(--slate)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Evening (14:00 - 18:00):
            </span>
            <span className={`badge ${scheduleData.sessions.PM === 'OPD' ? 'badge-opd' : 'badge-off'}`} style={{ fontSize: '0.76rem' }}>
              {scheduleData.sessions.PM || 'NO OPD'}
            </span>
          </div>
        </div>
      )}

      {/* Appointment table */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span className="eyebrow">Daily Schedule</span>
            <h3 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--ink)' }}>
              Consultation Roster for {date}
            </h3>
          </div>
          <span className="badge" style={{ background: 'var(--wash)', color: 'var(--ink)', border: '1px solid var(--line)', padding: '5px 12px', fontSize: '0.8rem' }}>
            {scheduleData?.appointments?.length || 0} scheduled
          </span>
        </div>

        {loading ? (
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Loading schedule...</p>
        ) : scheduleData?.appointments?.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px 16px', background: 'var(--wash)', borderRadius: '12px', border: '1px dashed var(--line)' }}>
            <p style={{ color: 'var(--muted)', fontSize: '0.92rem', margin: 0 }}>No appointments scheduled for this day.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {scheduleData?.appointments?.map((a) => (
              <div
                key={a.id}
                className="doctor-appt-card"
                style={{
                  background: a.status === 'completed' ? 'var(--wash)' : 'var(--paper)',
                }}
              >
                {/* Time & Status Column */}
                <div className="doctor-appt-time-col">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <Clock size={15} color="var(--orange)" />
                    <span style={{ fontWeight: 700, fontSize: '1.15rem', fontFamily: 'var(--font-mono)', color: 'var(--ink)' }}>
                      {a.start_time}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
                      - {a.end_time}
                    </span>
                  </div>
                  <div>
                    <span className={`badge badge-${a.status}`} style={{ textTransform: 'capitalize', fontSize: '0.74rem' }}>
                      {a.status === 'completed' && <CheckCircle2 size={12} />}
                      {a.status}
                    </span>
                  </div>
                </div>

                {/* Patient Information & Clinical Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Patient header row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '8px',
                        background: 'var(--wash)',
                        border: '1px solid var(--line)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--slate2)',
                      }}>
                        <User size={15} />
                      </div>
                      <span style={{ fontWeight: 700, fontSize: '1.08rem', color: 'var(--ink)' }}>
                        {a.patient_name}
                      </span>
                    </div>

                    <span className="mono" style={{ fontSize: '0.76rem', background: 'var(--wash)', padding: '2px 8px', borderRadius: '6px', border: '1px solid var(--line)', color: 'var(--muted)' }}>
                      {a.patient_id}
                    </span>

                    <span className="badge" style={{ fontSize: '0.74rem', background: 'var(--orangeWash)', color: 'var(--orangeDark)', border: '1px solid var(--orangeLine)' }}>
                      {a.speciality} · {a.visit_type}
                    </span>
                  </div>

                  {/* Intake Symptoms */}
                  {a.reason && (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '130px 1fr',
                      gap: '8px',
                      fontSize: '0.88rem',
                      alignItems: 'baseline',
                    }}>
                      <span style={{ fontWeight: 600, color: 'var(--muted)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Intake Symptoms:
                      </span>
                      <span style={{ color: 'var(--ink)', lineHeight: '1.5' }}>
                        {a.reason}
                      </span>
                    </div>
                  )}

                  {/* Pre-Assessment Intake Notes */}
                  {a.intake_notes && (
                    <div style={{
                      padding: '10px 14px',
                      background: 'var(--orangeWash)',
                      borderRadius: '8px',
                      fontSize: '0.84rem',
                      border: '1px solid var(--orangeLine)',
                    }}>
                      <span style={{ fontWeight: 600, color: 'var(--orangeDark)', display: 'block', marginBottom: '4px', fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Pre-Assessment Intake Notes
                      </span>
                      <div style={{ color: 'var(--ink)', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>{a.intake_notes}</div>
                    </div>
                  )}

                  {/* Doctor's Clinical Note */}
                  {a.doctor_note && (
                    <div style={{
                      padding: '12px 14px',
                      background: 'var(--wash)',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      border: '1px solid var(--line)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <FileText size={13} color="var(--muted)" />
                        <span style={{ fontWeight: 600, color: 'var(--muted)', fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          Doctor's Clinical Note
                        </span>
                      </div>
                      <div style={{ color: 'var(--ink)', fontWeight: 500, lineHeight: '1.5' }}>
                        {a.doctor_note}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions Column */}
                <div className="doctor-appt-actions-col">
                  <button
                    className="btn btn-secondary"
                    style={{ padding: '7px 13px', fontSize: '0.82rem', whiteSpace: 'nowrap' }}
                    onClick={() => handleOpenSummary(a.id)}
                  >
                    <Sparkles size={14} color="var(--orange)" /> AI Summary & History
                  </button>

                  {a.status === 'booked' && (
                    <button
                      className="btn btn-primary"
                      style={{ padding: '7px 15px', fontSize: '0.82rem', whiteSpace: 'nowrap' }}
                      onClick={() => {
                        setActiveAppt(a);
                        setClinicalNote(a.doctor_note || '');
                      }}
                    >
                      <CheckCircle2 size={15} /> Complete Visit
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Complete Visit Modal */}
      {activeAppt && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px',
        }}>
          <div className="card" style={{ maxWidth: '520px', width: '100%', padding: '28px', boxShadow: 'var(--browser-shadow)' }}>
            <span className="eyebrow">Visit Consultation</span>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '6px', color: 'var(--ink)' }}>Complete Patient Visit</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginBottom: '18px' }}>
              Patient: <b>{activeAppt.patient_name}</b> ({activeAppt.speciality}) · {activeAppt.start_time}
            </p>

            <form onSubmit={handleCompleteSubmit}>
              <div className="form-group">
                <label className="form-label">Doctor's Clinical Notes & Follow-up Guidance:</label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Record diagnosis, visual acuity findings, prescription, and review timeline (e.g. 'VA 6/9 OD, IOP 16 mmHg. Advised review in 6 months')..."
                  value={clinicalNote}
                  onChange={(e) => setClinicalNote(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setActiveAppt(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={completing}
                >
                  {completing ? 'Saving...' : 'Finalize & Mark Completed'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Patient AI Summary & Past Notes Modal (Iteration 2 R6) */}
      {(summaryLoading || summaryData || summaryError) && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px',
        }}>
          <div className="card" style={{ maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '28px', boxShadow: 'var(--browser-shadow)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={20} color="var(--orange)" />
                <h3 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--ink)' }}>Clinical Patient Intake Summary</h3>
              </div>
              <button
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.82rem' }}
                onClick={() => {
                  setSummaryData(null);
                  setSummaryError(null);
                  setSummaryLoading(false);
                }}
                aria-label="Close summary modal"
              >
                <X size={14} /> Close
              </button>
            </div>

            {summaryLoading && (
              <p style={{ color: 'var(--muted)', padding: '24px 0', textAlign: 'center', fontSize: '0.9rem' }}>
                Analyzing clinical history with LLM...
              </p>
            )}

            {summaryError && (
              <div style={{
                background: 'var(--danger-soft)',
                border: '1px solid var(--danger-line)',
                color: 'var(--danger)',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '0.88rem',
              }}>
                {summaryError}
              </div>
            )}

            {summaryData && (
              <div style={{ display: 'grid', gap: '16px' }}>
                {/* Patient Profile Header */}
                <div style={{ background: 'var(--wash)', padding: '12px 16px', borderRadius: '10px', fontSize: '0.88rem', border: '1px solid var(--line)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: 'var(--ink)' }}>
                    <span>{summaryData.patient_name} ({summaryData.patient_id})</span>
                    <span>Age: {summaryData.age || 'N/A'}</span>
                  </div>
                  <div style={{ color: 'var(--muted)', marginTop: '4px' }}>
                    <b>General Health:</b> {summaryData.general_health || 'None recorded'} · <b>Allergies:</b> {summaryData.allergies || 'None known'}
                  </div>
                  <div style={{ color: 'var(--ink)', marginTop: '4px' }}>
                    <b>Today's Stated Reason:</b> {summaryData.todays_reason || 'Routine consultation'}
                  </div>
                </div>

                {/* AI Summary Box */}
                <div style={{
                  background: 'var(--orangeWash)',
                  border: '1px solid var(--orangeLine)',
                  borderRadius: '10px',
                  padding: '16px',
                }}>
                  <div style={{
                    fontSize: '0.74rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'var(--orangeDark)',
                    marginBottom: '6px',
                  }}>
                    {summaryData.label}
                  </div>
                  <p style={{ fontSize: '0.92rem', color: 'var(--ink)', lineHeight: 1.55, margin: 0 }}>
                    {summaryData.summary}
                  </p>
                </div>

                {/* Full Past Clinical Notes Section */}
                <div>
                  <h4 style={{ fontSize: '1rem', marginBottom: '10px', color: 'var(--ink)' }}>
                    Full Recorded Past Notes ({summaryData.past_notes?.length || 0})
                  </h4>
                  {summaryData.past_notes?.length === 0 ? (
                    <p style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>No previous consultations on record.</p>
                  ) : (
                    <div style={{ display: 'grid', gap: '10px' }}>
                      {summaryData.past_notes.map((note) => (
                        <div
                          key={note.id}
                          style={{
                            border: '1px solid var(--line)',
                            borderRadius: '8px',
                            padding: '12px',
                            background: 'var(--paper)',
                            fontSize: '0.86rem',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted)', marginBottom: '4px' }}>
                            <span style={{ fontWeight: 600, color: 'var(--orangeDark)' }}>
                              {note.doctor_name} ({note.speciality})
                            </span>
                            <span>{note.date}</span>
                          </div>
                          {note.reason && (
                            <p style={{ color: 'var(--muted)', marginBottom: '4px' }}>
                              <b>Reason:</b> {note.reason}
                            </p>
                          )}
                          <p style={{ color: 'var(--ink)', margin: 0 }}>
                            <b>Doctor's Note:</b> {note.doctor_note}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Doctor Leave Modal (R7) */}
      {showLeaveModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div className="card" style={{ maxWidth: '480px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--browser-shadow)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <span className="eyebrow">Roster Management</span>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--ink)' }}>Mark Doctor Leave (R7)</h3>
              </div>
              <button
                className="btn btn-secondary"
                style={{ padding: '6px 10px', fontSize: '0.82rem' }}
                onClick={() => setShowLeaveModal(false)}
                aria-label="Close modal"
              >
                <X size={15} />
              </button>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--muted)', marginBottom: '16px', lineHeight: 1.5 }}>
              Marking leave cancels affected bookings and automatically generates rebooking proposals for clinic Staff to approve.
            </p>
            <form onSubmit={handleLeaveSubmit} style={{ display: 'grid', gap: '14px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Leave Date:</label>
                <input
                  type="date"
                  className="form-control"
                  value={leaveDate}
                  onChange={(e) => setLeaveDate(e.target.value)}
                  required
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Session:</label>
                <select
                  className="form-control"
                  value={leaveSession}
                  onChange={(e) => setLeaveSession(e.target.value)}
                >
                  <option value="FULL">Full Day (AM & PM)</option>
                  <option value="AM">Morning Session (09:00 - 13:00)</option>
                  <option value="PM">Evening Session (14:00 - 18:00)</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowLeaveModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={leaveSubmitting}>
                  {leaveSubmitting ? 'Recording...' : 'Mark Leave & Propose Rebookings'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
