import React, { useState } from 'react';
import { MessageSquare, Send, RotateCcw, AlertTriangle, BookOpen, Sparkles, CheckCircle, XCircle } from 'lucide-react';
import { api } from '../api/client';

export default function PatientChat() {
  const [messages, setMessages] = useState([]);
  const [threadId, setThreadId] = useState('');
  const [pendingAction, setPendingAction] = useState(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const quickQuestions = [
    "Book my retina follow-up with Dr. Shah this Friday morning. Reason: diabetic eye review",
    "What appointments do I have?",
    "How much is a new consultation?",
    "Book a glaucoma check with Dr. Iyer this Thursday",
    "Is there parking at the clinic?",
  ];

  const handleSend = async (textToSend) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    if (text.length > 500) {
      setError('Message must be 500 characters or fewer.');
      return;
    }

    setError('');
    const userMsg = { role: 'user', content: text };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setLoading(true);
    setPendingAction(null);

    try {
      const payload = {
        message: text,
        thread_id: threadId || undefined,
      };

      const res = await api.patientChat(payload);
      if (res.thread_id) {
        setThreadId(res.thread_id);
      }

      const botMsg = {
        role: 'assistant',
        content: res.answer,
        sources: res.sources || [],
        emergency: res.emergency || false,
        pending_action: res.pending_action || null,
      };

      setMessages([...newHistory, botMsg]);
      if (res.pending_action) {
        setPendingAction(res.pending_action);
      }
    } catch (err) {
      setError(err.message || "We couldn't check your message just now. Please try again, or call the clinic if it's urgent.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (confirmed) => {
    if (loading || !threadId) return;

    setError('');
    setLoading(true);
    setPendingAction(null);

    const actionText = confirmed ? 'Confirm' : 'No';
    const userMsg = { role: 'user', content: actionText };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);

    try {
      const payload = {
        thread_id: threadId,
        confirm: confirmed,
      };

      const res = await api.patientChat(payload);
      const botMsg = {
        role: 'assistant',
        content: res.answer,
        sources: res.sources || [],
        emergency: res.emergency || false,
        pending_action: res.pending_action || null,
      };

      setMessages([...newHistory, botMsg]);
      if (res.pending_action) {
        setPendingAction(res.pending_action);
      }
    } catch (err) {
      setError(err.message || "We couldn't process your confirmation just now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setThreadId('');
    setPendingAction(null);
    setInput('');
    setError('');
  };

  return (
    <div className="card" style={{ display: 'grid', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--line)', paddingBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="icon-tile" style={{ width: '38px', height: '38px', borderRadius: '9px' }}>
            <MessageSquare size={18} />
          </div>
          <div>
            <span className="eyebrow" style={{ marginBottom: '0' }}>Conversational Agent</span>
            <h3 style={{ margin: 0, fontSize: '1.15rem' }}>NetraCare Booking Assistant</h3>
          </div>
        </div>
        <button
          onClick={handleNewChat}
          className="btn btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', fontSize: '0.84rem' }}
          title="Clear chat and start fresh"
        >
          <RotateCcw size={13} /> New Chat
        </button>
      </div>

      {/* Suggested Questions */}
      {messages.length === 0 && (
        <div style={{ display: 'grid', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', color: 'var(--muted)', fontWeight: 600 }}>
            <Sparkles size={14} color="var(--orange)" /> Examples you can try:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                style={{
                  background: 'var(--wash)',
                  color: 'var(--slate2)',
                  border: '1px solid var(--line)',
                  borderRadius: '9999px',
                  padding: '6px 12px',
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  fontFamily: 'var(--font-body)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--orange)';
                  e.currentTarget.style.color = 'var(--orangeDark)';
                  e.currentTarget.style.background = 'var(--orangeWash)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--line)';
                  e.currentTarget.style.color = 'var(--slate2)';
                  e.currentTarget.style.background = 'var(--wash)';
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div
        style={{
          minHeight: '260px',
          maxHeight: '440px',
          overflowY: 'auto',
          display: 'grid',
          gap: '12px',
          paddingRight: '6px',
        }}
      >
        {messages.map((m, idx) => (
          <div
            key={idx}
            style={{
              justifySelf: m.role === 'user' ? 'end' : 'start',
              maxWidth: '85%',
              background: m.role === 'user'
                ? 'var(--orange)'
                : m.emergency
                ? 'var(--danger-soft)'
                : 'var(--wash)',
              color: m.role === 'user' ? '#ffffff' : 'var(--ink)',
              border: m.emergency
                ? '1px solid var(--danger-line)'
                : m.role === 'user'
                ? '1px solid var(--orangeDark)'
                : '1px solid var(--line)',
              borderRadius: m.role === 'user' ? '12px 12px 3px 12px' : '12px 12px 12px 3px',
              padding: '12px 16px',
              display: 'grid',
              gap: '8px',
              boxShadow: m.role === 'user' ? 'var(--btn-orange-shadow)' : 'none',
            }}
          >
            {m.emergency && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--danger)', fontWeight: 700, fontSize: '0.88rem' }}>
                <AlertTriangle size={15} /> EMERGENCY ALERT
              </div>
            )}
            <p style={{ margin: 0, fontSize: '0.94rem', lineHeight: '1.55', whiteSpace: 'pre-wrap', color: m.role === 'user' ? '#ffffff' : 'inherit' }}>
              {m.content}
            </p>

            {/* Confirmation Card (R5) */}
            {m.pending_action && idx === messages.length - 1 && (
              <div
                style={{
                  background: 'var(--paper)',
                  border: '1px solid var(--orangeLine)',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  display: 'grid',
                  gap: '10px',
                  marginTop: '4px',
                  boxShadow: 'var(--card-shadow)',
                }}
              >
                <div style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--ink)' }}>
                  {m.pending_action.summary}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleConfirm(true)}
                    disabled={loading}
                    className="btn btn-primary"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '7px 14px',
                      fontSize: '0.88rem',
                    }}
                  >
                    <CheckCircle size={15} /> Confirm
                  </button>
                  <button
                    onClick={() => handleConfirm(false)}
                    disabled={loading}
                    className="btn btn-danger"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '7px 14px',
                      fontSize: '0.88rem',
                    }}
                  >
                    <XCircle size={15} /> No
                  </button>
                </div>
              </div>
            )}

            {m.sources && m.sources.length > 0 && (
              <div style={{ borderTop: '1px dashed var(--line)', paddingTop: '6px', marginTop: '4px', display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                  <BookOpen size={12} /> Sources:
                </span>
                {m.sources.map((src, sIdx) => (
                  <span
                    key={sIdx}
                    className="badge"
                    style={{
                      fontSize: '0.72rem',
                      padding: '2px 8px',
                    }}
                  >
                    {src}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div style={{ justifySelf: 'start', background: 'var(--wash)', border: '1px solid var(--line)', borderRadius: '12px', padding: '10px 14px', fontSize: '0.88rem', color: 'var(--muted)' }}>
            Processing with clinic assistant...
          </div>
        )}
      </div>

      {error && (
        <div style={{ background: 'var(--danger-soft)', color: 'var(--danger)', border: '1px solid var(--danger-line)', padding: '10px 14px', borderRadius: '10px', fontSize: '0.88rem' }}>
          {error}
        </div>
      )}

      {/* Input area */}
      <div style={{ display: 'grid', gap: '6px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            className="form-control"
            placeholder={pendingAction ? "Type a new question or press Confirm / No on the card..." : "Ask to find slots, book, cancel, reschedule, or ask a question..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={500}
            disabled={loading}
            style={{ flex: 1 }}
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Send size={15} /> Send
          </button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--muted)', paddingInline: '4px' }}>
          <span>Enter to send · State-changing actions wait for your confirmation</span>
          <span style={{ color: input.length > 450 ? 'var(--danger)' : 'var(--muted)' }}>
            {input.length}/500
          </span>
        </div>
      </div>
    </div>
  );
}
