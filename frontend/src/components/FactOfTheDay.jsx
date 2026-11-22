import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Sparkles, RefreshCw } from 'lucide-react';

export default function FactOfTheDay() {
  const [fact, setFact] = useState('');
  const [caveat, setCaveat] = useState('General information, not medical advice');
  const [loading, setLoading] = useState(false);

  const fetchFact = async (previousFact = null) => {
    setLoading(true);
    try {
      const res = await api.getFactOfTheDay(previousFact);
      if (res.ok) {
        setFact(res.fact);
        setCaveat(res.caveat || 'General information, not medical advice');
      }
    } catch (e) {
      console.error(e);
      if (!fact) {
        setFact("Human corneas receive oxygen directly through tears and the air rather than blood vessels.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFact();
  }, []);

  const handleRefresh = () => {
    fetchFact(fact);
  };

  return (
    <div
      style={{
        background: 'var(--paper)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--radius-card)',
        padding: '18px 22px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        boxShadow: 'var(--card-shadow)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div className="icon-tile">
          <Sparkles size={20} />
        </div>
        <div>
          <span className="eyebrow" style={{ marginBottom: '2px' }}>
            Fact of the Day
          </span>
          <p
            style={{
              fontSize: '0.94rem',
              fontWeight: 500,
              color: 'var(--ink)',
              margin: '2px 0 4px 0',
              maxWidth: '720px',
              lineHeight: 1.5,
            }}
          >
            {fact || "Loading eye health fact..."}
          </p>
          <span style={{ fontSize: '0.78rem', color: 'var(--muted)', fontWeight: 400 }}>
            {caveat}
          </span>
        </div>
      </div>

      <button
        type="button"
        className="btn btn-secondary"
        style={{
          padding: '7px 13px',
          fontSize: '0.84rem',
          flexShrink: 0,
        }}
        onClick={handleRefresh}
        disabled={loading}
      >
        <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
        Refresh
      </button>
    </div>
  );
}
