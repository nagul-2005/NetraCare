import React, { useEffect, useState, useRef } from 'react';
import { api } from '../api/client';
import NetraCareLogo from '../components/NetraCareLogo';
import {
  Clock,
  Calendar,
  AlertTriangle,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Plus,
  Stethoscope,
  Sparkles,
  ArrowRight,
  Check,
} from 'lucide-react';

const CLINICAL_SCENARIOS = [
  {
    time: '09:00 AM',
    title: 'Emergency screening',
    text: 'Walk in with acute flashes of light—instant triage flags urgent care.',
    tag: 'Safety First',
  },
  {
    time: '11:15 AM',
    title: 'Paediatric exam',
    text: 'Gentle strabismus evaluation with Dr. Vikram Menon and guardian.',
    tag: 'Paediatrics',
  },
  {
    time: '02:30 PM',
    title: 'Refractive intake',
    text: 'LASIK corneal thickness and suitability intake with Dr. Fatima Khan.',
    tag: 'Refractive',
  },
  {
    time: '04:45 PM',
    title: 'Cataract follow-up',
    text: 'Post-op lens clarity check and recovery drop schedule with Dr. Anita Roy.',
    tag: 'Cataract',
  },
  {
    time: '06:00 PM',
    title: 'Glaucoma check',
    text: 'Intraocular pressure reading and visual field analysis.',
    tag: 'Glaucoma',
  },
];

const CLINIC_FAQS = [
  {
    id: 'f1',
    q: 'How does NetraCare handle acute eye emergencies?',
    a: 'Our front desk software evaluates all patient queries for 5 acute ophthalmic red flags (sudden vision loss, chemical splash, penetrating trauma, severe acute eye pain, flashes/curtain). In any emergency, automated routine booking is halted, instant emergency care steps are shown, and an urgent alert is dispatched to clinic staff.',
  },
  {
    id: 'f2',
    q: 'What is the paediatric booking rule for patients under 16?',
    a: 'In accordance with clinical protocol, all patients under 16 years of age (e.g. Divya Pillai) are restricted strictly to Dr. Vikram Menon, our Paediatric Ophthalmology specialist. In addition, an adult guardian must accompany the patient during the visit.',
  },
  {
    id: 'f3',
    q: 'How are LASIK pre-assessment criteria verified?',
    a: 'Candidates for LASIK must be at least 18 years old, possess stable refractive prescription for 12 months, not be pregnant or nursing, and have healthy corneal thickness. Dr. Fatima Khan reviews your clinical intake notes prior to the detailed slit-lamp evaluation.',
  },
  {
    id: 'f4',
    q: 'Can I reschedule or cancel my appointment online?',
    a: 'Yes. Appointments can be rescheduled or cancelled freely up to 2 hours before the scheduled appointment start time via the Patient Portal or conversational assistant, ensuring slots can be opened for other patients in need.',
  },
  {
    id: 'f5',
    q: 'How are CityCare Hospital partner laboratory tests integrated?',
    a: 'NetraCare connects directly to CityCare Lab via Model Context Protocol (MCP). Patients can inquire about test preparation (e.g. fasting requirements for HbA1c, lipid profiles) and pricing with authoritative partner attribution.',
  },
];

export default function Home({ onNavigateToLogin, onNavigateToBook }) {
  const [clinic, setClinic] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);

  const scenarioTrackRef = useRef(null);

  useEffect(() => {
    api.getClinicInfo().then(setClinic).catch(console.error);
    api.getDoctors().then(setDoctors).catch(console.error);
    api.getHolidays().then(setHolidays).catch(console.error);
  }, []);

  const scrollScenarios = (offset) => {
    if (scenarioTrackRef.current) {
      scenarioTrackRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const toggleFaq = (id) => {
    setOpenFaq((prev) => (prev === id ? null : id));
  };

  return (
    <div
      className="container"
      style={{
        display: 'grid',
        gap: '40px',
        position: 'relative',
        width: '100%',
        maxWidth: '1180px',
        margin: '0 auto',
        boxSizing: 'border-box',
      }}
    >
      {/* =========================================================================
          HERO SECTION (YC-Classic SaaS: 56px Faint Grid, 900 Headline, Orange Swipe)
         ========================================================================= */}
      <section
        className="card hero-grid-bg reveal-on-scroll"
        style={{
          position: 'relative',
          padding: 'clamp(36px, 7vw, 68px) clamp(16px, 4vw, 32px)',
          textAlign: 'center',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 'var(--radius-panel)',
          border: '1px solid var(--line)',
          boxShadow: 'var(--browser-shadow)',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '820px', margin: '0 auto', width: '100%' }}>
          {/* Eyebrow Chip */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--paper)',
              border: '1px solid var(--line)',
              borderRadius: '9999px',
              padding: '6px 14px',
              marginBottom: '20px',
              boxShadow: 'var(--card-shadow)',
              maxWidth: '100%',
              boxSizing: 'border-box',
            }}
          >
            <NetraCareLogo size={24} />
            <div style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink)' }}>
                NetraCare Eye Clinic
              </span>
              <span className="hide-on-mobile-xs" style={{ color: 'var(--line)' }}>|</span>
              <span className="hide-on-mobile-xs" style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 500, letterSpacing: '0.04em' }}>
                AI Front Desk & Clinical Care Coordination
              </span>
            </div>
          </div>

          {/* 900 Inter Headline with Single Highlight Swipe on 'gentle precision' */}
          <h1
            style={{
              fontSize: 'clamp(2.1rem, 5vw, 4.2rem)',
              fontWeight: 900,
              lineHeight: 0.98,
              letterSpacing: '-0.045em',
              marginBottom: '20px',
              color: 'var(--ink)',
            }}
          >
            Ophthalmic care, guided with{' '}
            <span className="highlight-swipe">gentle precision</span>.
          </h1>

          {/* Sub-headline */}
          <p
            style={{
              color: 'var(--slate2)',
              fontSize: '1.05rem',
              lineHeight: 1.6,
              maxWidth: '560px',
              margin: '0 auto 28px auto',
              fontWeight: 400,
            }}
          >
            Expert ophthalmic consultations across 5 superspecialists. Zero double-booking, guaranteed emergency triage, and seamless appointment coordination.
          </p>

          {/* Dual Action Buttons */}
          <div className="hero-cta-buttons">
            <button className="btn btn-primary" onClick={onNavigateToBook} style={{ padding: '12px 24px', fontSize: '0.96rem' }}>
              Book appointment <ChevronRight size={16} />
            </button>
            <button className="btn btn-secondary" onClick={onNavigateToLogin} style={{ padding: '12px 20px', fontSize: '0.96rem' }}>
              Access portals
            </button>
          </div>

          {/* Clinical Indicators */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px 20px',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--muted)',
              flexWrap: 'wrap',
              borderTop: '1px solid var(--line)',
              paddingTop: '18px',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: 'var(--orange)' }}>●</span> Zero double bookings guaranteed
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: 'var(--orange)' }}>●</span> Deterministic emergency triage
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: 'var(--orange)' }}>●</span> 5 accredited eye specialists
            </span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          HORIZONTAL CLINICAL SCENARIOS SCROLL
         ========================================================================= */}
      <section className="clinical-scenario-container" style={{ width: '100%', boxSizing: 'border-box' }}>
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <span className="eyebrow">Daily Clinic Rhythms</span>
          <h2 style={{ fontSize: 'clamp(1.7rem, 3.2vw, 2.3rem)', marginTop: '2px' }}>
            A day inside the NetraCare front desk
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.95rem', maxWidth: '540px', margin: '6px auto 0 auto' }}>
            Explore how appointments, acute emergencies, and specialized intakes flow smoothly across our clinic.
          </p>
        </div>

        {/* Scrolling Card Track */}
        <div style={{ position: 'relative', width: '100%' }}>
          <div
            ref={scenarioTrackRef}
            className="clinical-scenario-track"
            tabIndex={0}
            role="region"
            aria-label="Clinical Scenarios"
          >
            {CLINICAL_SCENARIOS.map((item, idx) => (
              <div key={idx} className="clinical-scenario-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 600 }}>
                    {item.time}
                  </span>
                  <span className="badge" style={{ fontSize: '11px', padding: '2px 8px' }}>
                    {item.tag}
                  </span>
                </div>

                <p className="scenario-text" style={{ fontSize: '0.95rem', fontWeight: 600, lineHeight: 1.4, color: 'var(--ink)' }}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          {/* Centered Scroll Controls */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '12px' }}>
            <button
              onClick={() => scrollScenarios(-300)}
              className="btn btn-secondary"
              style={{ width: '38px', height: '38px', padding: 0, borderRadius: '50%' }}
              aria-label="Scroll left"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scrollScenarios(300)}
              className="btn btn-secondary"
              style={{ width: '38px', height: '38px', padding: 0, borderRadius: '50%' }}
              aria-label="Scroll right"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CLINIC HOURS & RULES ENFORCED
         ========================================================================= */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          width: '100%',
        }}
      >
        {/* Hours & Sessions */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
            <div className="icon-tile">
              <Clock size={20} />
            </div>
            <div>
              <span className="eyebrow" style={{ marginBottom: 0 }}>Schedule</span>
              <h3 style={{ margin: 0 }}>Clinic Timings & Sessions</h3>
            </div>
          </div>
          <ul style={{ listStyle: 'none', display: 'grid', gap: '12px', fontSize: '0.94rem' }}>
            <li style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px', borderBottom: '1px solid var(--line)', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--muted)' }}>Operating Days</span>
              <b style={{ color: 'var(--ink)' }}>Monday to Saturday</b>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px', borderBottom: '1px solid var(--line)', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--muted)' }}>Morning Session</span>
              <b style={{ color: 'var(--ink)' }}>09:00 AM – 01:00 PM</b>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px', borderBottom: '1px solid var(--line)', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--muted)' }}>Lunch Intermission</span>
              <span style={{ color: 'var(--muted)', fontWeight: 500 }}>01:00 PM – 02:00 PM (Closed)</span>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px', borderBottom: '1px solid var(--line)', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--muted)' }}>Evening Session</span>
              <b style={{ color: 'var(--ink)' }}>02:00 PM – 06:00 PM</b>
            </li>
            <li style={{ color: 'var(--danger)', fontWeight: 600, paddingTop: '4px', fontSize: '0.88rem' }}>
              Closed on Sundays and Listed Public Holidays
            </li>
          </ul>
        </div>

        {/* Rules Enforced */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
            <div className="icon-tile">
              <ShieldCheck size={20} />
            </div>
            <div>
              <span className="eyebrow" style={{ marginBottom: 0 }}>Validation</span>
              <h3 style={{ margin: 0 }}>Clinical Rules Enforced</h3>
            </div>
          </div>
          <ul style={{ listStyle: 'none', display: 'grid', gap: '12px', fontSize: '0.92rem' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <Check size={16} color="var(--orange)" style={{ flexShrink: 0, marginTop: '3px' }} />
              <div><b style={{ color: 'var(--ink)' }}>New Consultation:</b> 20 minutes allocated duration</div>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <Check size={16} color="var(--orange)" style={{ flexShrink: 0, marginTop: '3px' }} />
              <div><b style={{ color: 'var(--ink)' }}>Follow-up Visit:</b> 10 minutes with previous specialist</div>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <Check size={16} color="var(--orange)" style={{ flexShrink: 0, marginTop: '3px' }} />
              <div><b style={{ color: 'var(--ink)' }}>Paediatric Age Gate:</b> Patients under 16 strictly with Dr. Vikram Menon</div>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <Check size={16} color="var(--orange)" style={{ flexShrink: 0, marginTop: '3px' }} />
              <div><b style={{ color: 'var(--ink)' }}>Cancellation Window:</b> Up to 2 hours before scheduled slot</div>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <Check size={16} color="var(--orange)" style={{ flexShrink: 0, marginTop: '3px' }} />
              <div><b style={{ color: 'var(--ink)' }}>Safety Rule:</b> Immediate triage and lockout for red-flag symptoms</div>
            </li>
          </ul>
        </div>
      </div>

      {/* =========================================================================
          DOCTORS & SPECIALITIES
         ========================================================================= */}
      <section id="doctors" className="card" style={{ width: '100%', boxSizing: 'border-box' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <span className="eyebrow">Accredited Clinicians</span>
          <h2 style={{ fontSize: 'clamp(1.7rem, 3.2vw, 2.3rem)', marginTop: '2px' }}>
            Our Doctors & Superspecialities
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.95rem', marginTop: '6px' }}>
            Five specialist ophthalmologists providing comprehensive medical, surgical, and paediatric eye care.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px', width: '100%' }}>
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className="card-interactive"
              style={{
                border: '1px solid var(--line)',
                borderRadius: 'var(--radius-card)',
                padding: '20px 22px',
                background: 'var(--paper)',
                boxShadow: 'var(--card-shadow)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span className="mono" style={{ fontWeight: 700, color: 'var(--orangeDark)' }}>
                    {doc.id}
                  </span>
                  <span className="badge">Active</span>
                </div>
                <h3 style={{ fontSize: '1.18rem', marginBottom: '8px', color: 'var(--ink)' }}>{doc.name}</h3>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '16px' }}>
                {doc.specialities.map((spec) => (
                  <span
                    key={spec}
                    style={{
                      fontSize: '0.78rem',
                      background: 'var(--wash)',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid var(--line)',
                      color: 'var(--slate2)',
                      fontWeight: 500,
                    }}
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          WEEKLY OPD SCHEDULE GRID
         ========================================================================= */}
      <section id="schedule" className="card" style={{ width: '100%', boxSizing: 'border-box' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <span className="eyebrow">Roster Schedule</span>
          <h2 style={{ fontSize: 'clamp(1.7rem, 3.2vw, 2.3rem)', marginTop: '2px' }}>
            Weekly OPD Grid
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.95rem', marginTop: '6px' }}>
            Doctors conduct Outpatient Consultations (OPD), Surgeries (SX), or have scheduled off days.
          </p>
        </div>

        {/* Contained responsive table wrapper */}
        <div className="table-scroll-hint">← Swipe to view all days →</div>
        <div className="schedule-table-wrapper">
          <table className="schedule-table">
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Doctor</th>
                <th>Mon</th>
                <th>Tue</th>
                <th>Wed</th>
                <th>Thu</th>
                <th>Fri</th>
                <th>Sat</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ textAlign: 'left', fontWeight: 700, color: 'var(--ink)' }}>Dr. Anand Rao</td>
                <td><span className="badge">AM</span> <span className="badge">PM</span></td>
                <td><span className="badge">AM</span> <span className="badge">PM</span></td>
                <td><span className="badge">AM</span> <span className="badge">PM</span></td>
                <td><span className="badge">SX</span> <span className="badge">PM</span></td>
                <td><span className="badge">AM</span> <span className="badge">PM</span></td>
                <td><span className="badge">AM</span> <span className="badge">PM</span></td>
              </tr>
              <tr>
                <td style={{ textAlign: 'left', fontWeight: 700, color: 'var(--ink)' }}>Dr. Meera Iyer</td>
                <td><span className="badge">AM</span> <span className="badge">PM</span></td>
                <td><span className="badge">SX</span> <span className="badge">SX</span></td>
                <td><span className="badge">AM</span> <span className="badge">PM</span></td>
                <td><span className="badge badge-off">OFF</span></td>
                <td><span className="badge">AM</span> <span className="badge">PM</span></td>
                <td><span className="badge">AM</span> <span className="badge">PM</span></td>
              </tr>
              <tr>
                <td style={{ textAlign: 'left', fontWeight: 700, color: 'var(--ink)' }}>Dr. Kiran Shah</td>
                <td><span className="badge">AM</span> <span className="badge">PM</span></td>
                <td><span className="badge">AM</span> <span className="badge">PM</span></td>
                <td><span className="badge">AM</span> <span className="badge">SX</span></td>
                <td><span className="badge">AM</span> <span className="badge">PM</span></td>
                <td><span className="badge">AM</span> <span className="badge">PM</span></td>
                <td><span className="badge badge-off">OFF</span></td>
              </tr>
              <tr>
                <td style={{ textAlign: 'left', fontWeight: 700, color: 'var(--ink)' }}>Dr. Fatima Khan</td>
                <td><span className="badge">SX</span> <span className="badge">SX</span></td>
                <td><span className="badge">AM</span> <span className="badge">PM</span></td>
                <td><span className="badge">AM</span> <span className="badge">PM</span></td>
                <td><span className="badge">AM</span> <span className="badge">PM</span></td>
                <td><span className="badge">AM</span> <span className="badge">PM</span></td>
                <td><span className="badge">AM</span> <span className="badge">PM</span></td>
              </tr>
              <tr>
                <td style={{ textAlign: 'left', fontWeight: 700, color: 'var(--ink)' }}>Dr. Vikram Menon</td>
                <td><span className="badge">AM</span> <span className="badge">PM</span></td>
                <td><span className="badge">AM</span> <span className="badge">PM</span></td>
                <td><span className="badge badge-off">OFF</span></td>
                <td><span className="badge">AM</span> <span className="badge">PM</span></td>
                <td><span className="badge badge-off">OFF</span></td>
                <td><span className="badge">AM</span> <span className="badge">PM</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* =========================================================================
          INTERACTIVE FAQ ACCORDION
         ========================================================================= */}
      <section id="faq" style={{ width: '100%', boxSizing: 'border-box' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <span className="eyebrow">Patient Guidance</span>
          <h2 style={{ fontSize: 'clamp(1.7rem, 3.2vw, 2.3rem)', marginTop: '2px' }}>
            Frequently Asked Clinic Questions
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.95rem', marginTop: '6px' }}>
            Everything you need to know about our safety screening, doctor appointments, and procedures.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '860px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
          {CLINIC_FAQS.map((faq) => {
            const isOpen = openFaq === faq.id;

            return (
              <div key={faq.id} className="softly-faq-box">
                <button
                  className="softly-faq-btn"
                  onClick={() => toggleFaq(faq.id)}
                  aria-expanded={isOpen}
                >
                  <span style={{ paddingRight: '16px', lineHeight: 1.4 }}>{faq.q}</span>
                  <div className={`softly-faq-rotator ${isOpen ? 'expanded' : ''}`}>
                    <Plus size={16} />
                  </div>
                </button>

                <div
                  className="softly-faq-panel"
                  style={{
                    maxHeight: isOpen ? '260px' : '0px',
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  <div className="softly-faq-panel-inner">{faq.a}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          DARK PANEL BANNER (YC-Classic SaaS Banner with Blurred Orange Glow Blobs)
         ========================================================================= */}
      <section
        className="dark-panel"
        style={{
          maxWidth: '920px',
          margin: '0 auto',
          width: '100%',
          textAlign: 'center',
          boxSizing: 'border-box',
        }}
      >
        {/* Glow Blobs */}
        <div className="dark-panel-glow-tr" aria-hidden="true" />
        <div className="dark-panel-glow-bl" aria-hidden="true" />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              margin: '0 auto 18px auto',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <NetraCareLogo size={44} />
          </div>

          <span
            style={{
              color: 'var(--orange)',
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.16em',
              display: 'block',
              marginBottom: '6px',
            }}
          >
            Seamless Care Coordination
          </span>

          <h2 style={{ fontSize: 'clamp(1.9rem, 4vw, 2.6rem)', color: '#ffffff', marginBottom: '14px', letterSpacing: '-0.04em' }}>
            Schedule your consultation with peace of mind
          </h2>

          <p style={{ color: '#cbd5e1', fontSize: '1rem', maxWidth: '540px', margin: '0 auto 28px auto', lineHeight: 1.6 }}>
            Select your specialist, find guaranteed slots up to 30 days ahead, and receive personalized pre-visit care instructions.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={onNavigateToBook} style={{ padding: '14px 30px', fontSize: '0.98rem' }}>
              Book Appointment Now <ChevronRight size={16} />
            </button>
            <button
              className="btn btn-dark-ghost"
              onClick={onNavigateToLogin}
              style={{
                padding: '14px 26px',
                fontSize: '0.98rem',
              }}
            >
              Patient Portal Login
            </button>
          </div>

          <div
            style={{
              marginTop: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '12px',
              color: '#94a3b8',
            }}
          >
            <ShieldCheck size={14} color="var(--orange)" />
            <span>Zero double booking · Verified doctor availability · Clinic confidential</span>
          </div>
        </div>
      </section>
    </div>
  );
}
