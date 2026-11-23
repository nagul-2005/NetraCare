import React, { useState, useRef } from 'react';
import { MessageSquare, Send, RotateCcw, AlertTriangle, BookOpen, Sparkles, CheckCircle, XCircle, Paperclip, Image as ImageIcon, X, FileText } from 'lucide-react';
import { api } from '../api/client';

export default function PatientChat() {
  const [messages, setMessages] = useState([]);
  const [threadId, setThreadId] = useState('');
  const [pendingAction, setPendingAction] = useState(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const quickQuestions = [
    "Book my retina follow-up with Dr. Shah this Friday morning. Reason: diabetic eye review",
    "What appointments do I have?",
    "How much is a new consultation?",
    "Book a glaucoma check with Dr. Iyer this Friday morning",
    "Is there parking at the clinic?",
  ];

  const handleFileSelect = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPG, PNG, or WebP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image file must be under 5MB.');
      return;
    }

    setError('');
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage({
        base64: e.target.result,
        mimeType: file.type,
        name: file.name,
        previewUrl: e.target.result,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSend = async (textToSend) => {
    const text = (textToSend || input).trim();
    if ((!text && !selectedImage) || loading) return;

    if (text.length > 500) {
      setError('Message must be 500 characters or fewer.');
      return;
    }

    setError('');
    const imgToSend = selectedImage;
    const userMsg = {
      role: 'user',
      content: text || 'Please inspect my attached eye/prescription image.',
      image: imgToSend ? imgToSend.previewUrl : null,
    };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setSelectedImage(null);
    setLoading(true);
    setPendingAction(null);

    try {
      const payload = {
        message: text || undefined,
        thread_id: threadId || undefined,
        image_base64: imgToSend ? imgToSend.base64 : undefined,
        image_mime_type: imgToSend ? imgToSend.mimeType : undefined,
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
        image_analysis: res.image_analysis || null,
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
    setSelectedImage(null);
  };

  return (
    <div
      className="card"
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setIsDragging(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          handleFileSelect(e.dataTransfer.files[0]);
        }
      }}
      style={{
        display: 'grid',
        gap: '16px',
        position: 'relative',
        borderColor: isDragging ? 'var(--orange)' : 'var(--line)',
        backgroundColor: isDragging ? 'var(--orangeWash)' : 'var(--paper)',
        transition: 'all 0.2s ease',
      }}
    >
      {/* Drag & Drop Visual Overlay */}
      {isDragging && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(255, 244, 238, 0.94)',
            borderRadius: 'var(--radius-card)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            zIndex: 20,
            pointerEvents: 'none',
            border: '2px dashed var(--orange)',
          }}
        >
          <ImageIcon size={38} color="var(--orange)" />
          <strong style={{ color: 'var(--ink)', fontSize: '1rem' }}>Drop prescription or eye photo here</strong>
          <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>NetraCare Vision AI will inspect optical parameters</span>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--line)', paddingBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="icon-tile" style={{ width: '38px', height: '38px', borderRadius: '9px' }}>
            <MessageSquare size={18} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="eyebrow" style={{ marginBottom: '0' }}>Conversational Agent</span>
              <span
                style={{
                  fontSize: '0.70rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  background: 'var(--orangeWash)',
                  color: 'var(--orangeDark)',
                  padding: '2px 7px',
                  borderRadius: '9999px',
                  border: '1px solid var(--orangeLine)',
                }}
              >
                Multimodal Vision
              </span>
            </div>
            <h3 style={{ margin: 0, fontSize: '1.15rem' }}>NetraCare Booking & Intake Assistant</h3>
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', color: 'var(--muted)', fontWeight: 600 }}>
              <Sparkles size={14} color="var(--orange)" /> Examples you can try:
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
              Drag & drop photos or click <strong>Scan</strong>
            </span>
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
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          paddingRight: '6px',
        }}
      >
        {messages.map((m, idx) => (
          <div
            key={idx}
            style={{
              alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              width: 'fit-content',
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

            {/* User Attached Image Thumbnail */}
            {m.image && (
              <div style={{ marginBottom: '4px' }}>
                <img
                  src={m.image}
                  alt="Uploaded attachment"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '180px',
                    borderRadius: '8px',
                    objectFit: 'contain',
                    display: 'block',
                    border: '1px solid rgba(255,255,255,0.35)',
                    background: 'rgba(0,0,0,0.1)',
                  }}
                />
              </div>
            )}

            <p style={{ margin: 0, fontSize: '0.94rem', lineHeight: '1.55', whiteSpace: 'pre-wrap', color: m.role === 'user' ? '#ffffff' : 'inherit' }}>
              {m.content}
            </p>

            {/* Extracted Optical Prescription Card */}
            {m.image_analysis && (
              <div
                style={{
                  background: 'var(--paper)',
                  border: '1px solid var(--orangeLine)',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  display: 'grid',
                  gap: '8px',
                  marginTop: '4px',
                  boxShadow: 'var(--card-shadow)',
                  color: 'var(--ink)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: 'var(--orangeDark)',
                      background: 'var(--orangeWash)',
                      padding: '3px 8px',
                      borderRadius: '9999px',
                      border: '1px solid var(--orangeLine)',
                    }}
                  >
                    <FileText size={13} />
                    {m.image_analysis.image_type === 'prescription' ? 'Extracted Optical Prescription' : 'Clinical Eye Intake Scan'}
                  </span>
                  {m.image_analysis.recommended_speciality && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 600 }}>
                      Speciality: <strong style={{ color: 'var(--ink)' }}>{m.image_analysis.recommended_speciality}</strong>
                    </span>
                  )}
                </div>

                {/* Parameters Table if prescription */}
                {m.image_analysis.extracted_parameters && (m.image_analysis.extracted_parameters.od || m.image_analysis.extracted_parameters.os) && (
                  <div style={{ overflowX: 'auto', border: '1px solid var(--line)', borderRadius: '8px', background: 'var(--wash)' }}>
                    <table style={{ width: '100%', fontSize: '0.8rem', borderCollapse: 'collapse', textAlign: 'center' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--muted)' }}>
                          <th style={{ padding: '4px 8px', textAlign: 'left' }}>Eye</th>
                          <th style={{ padding: '4px 8px' }}>SPH</th>
                          <th style={{ padding: '4px 8px' }}>CYL</th>
                          <th style={{ padding: '4px 8px' }}>AXIS</th>
                          <th style={{ padding: '4px 8px' }}>ADD</th>
                        </tr>
                      </thead>
                      <tbody>
                        {m.image_analysis.extracted_parameters.od && (
                          <tr style={{ borderBottom: '1px solid var(--line)' }}>
                            <td style={{ padding: '5px 8px', fontWeight: 600, textAlign: 'left', color: 'var(--ink)' }}>OD (Right)</td>
                            <td style={{ padding: '5px 8px' }}>{m.image_analysis.extracted_parameters.od.sph || '—'}</td>
                            <td style={{ padding: '5px 8px' }}>{m.image_analysis.extracted_parameters.od.cyl || '—'}</td>
                            <td style={{ padding: '5px 8px' }}>{m.image_analysis.extracted_parameters.od.axis ? `${m.image_analysis.extracted_parameters.od.axis}°` : '—'}</td>
                            <td style={{ padding: '5px 8px' }}>{m.image_analysis.extracted_parameters.od.add || '—'}</td>
                          </tr>
                        )}
                        {m.image_analysis.extracted_parameters.os && (
                          <tr>
                            <td style={{ padding: '5px 8px', fontWeight: 600, textAlign: 'left', color: 'var(--ink)' }}>OS (Left)</td>
                            <td style={{ padding: '5px 8px' }}>{m.image_analysis.extracted_parameters.os.sph || '—'}</td>
                            <td style={{ padding: '5px 8px' }}>{m.image_analysis.extracted_parameters.os.cyl || '—'}</td>
                            <td style={{ padding: '5px 8px' }}>{m.image_analysis.extracted_parameters.os.axis ? `${m.image_analysis.extracted_parameters.os.axis}°` : '—'}</td>
                            <td style={{ padding: '5px 8px' }}>{m.image_analysis.extracted_parameters.os.add || '—'}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {m.image_analysis.recommended_doctor && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--slate2)' }}>
                    Recommended Specialist: <strong>{m.image_analysis.recommended_doctor}</strong>
                  </div>
                )}

                <div style={{ fontSize: '0.72rem', color: 'var(--muted)', fontStyle: 'italic', borderTop: '1px dashed var(--line)', paddingTop: '4px' }}>
                  * Optical parameters captured for booking & triage. NetraCare adheres to a strict zero-diagnosis clinical safety standard.
                </div>
              </div>
            )}

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
          <div style={{ alignSelf: 'flex-start', background: 'var(--wash)', border: '1px solid var(--line)', borderRadius: '12px', padding: '10px 14px', fontSize: '0.88rem', color: 'var(--muted)' }}>
            Processing with NetraCare AI...
          </div>
        )}
      </div>

      {error && (
        <div style={{ background: 'var(--danger-soft)', color: 'var(--danger)', border: '1px solid var(--danger-line)', padding: '10px 14px', borderRadius: '10px', fontSize: '0.88rem' }}>
          {error}
        </div>
      )}

      {/* Input area */}
      <div style={{ display: 'grid', gap: '8px' }}>
        {/* Selected Image Chip */}
        {selectedImage && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--orangeWash)',
              border: '1px solid var(--orangeLine)',
              borderRadius: '8px',
              padding: '6px 10px',
              gap: '8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
              <img
                src={selectedImage.previewUrl}
                alt="Preview"
                style={{ width: '32px', height: '32px', borderRadius: '6px', objectFit: 'cover', border: '1px solid var(--line)' }}
              />
              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--ink)' }}>{selectedImage.name}</span>
                <span style={{ fontSize: '0.74rem', color: 'var(--muted)', display: 'block' }}>Prescription / Eye photo attached</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="btn btn-secondary"
              style={{ padding: '4px', borderRadius: '6px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--muted)' }}
              title="Remove image"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileSelect(e.target.files[0]);
              }
              e.target.value = '';
            }}
          />

          {/* Attach / Scan Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="btn btn-secondary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 12px',
              fontSize: '0.84rem',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
            title="Upload prescription or eye photo"
          >
            <Paperclip size={15} color="var(--orange)" />
            <span className="hide-on-mobile-xs">Scan</span>
          </button>

          <input
            type="text"
            className="form-control"
            placeholder={
              selectedImage
                ? "Add an optional message or press Send to scan..."
                : pendingAction
                ? "Type a new question or press Confirm / No on the card..."
                : "Ask to find slots, book, or drop a prescription image..."
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={500}
            disabled={loading}
            style={{ flex: 1, minWidth: '120px' }}
          />

          <button
            onClick={() => handleSend()}
            disabled={loading || (!input.trim() && !selectedImage)}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 14px', flexShrink: 0 }}
          >
            <Send size={15} />
            <span className="hide-on-mobile-xs">Send</span>
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--muted)', paddingInline: '4px' }}>
          <span>Enter to send · Drag & drop prescription cards or click Scan</span>
          <span style={{ color: input.length > 450 ? 'var(--danger)' : 'var(--muted)' }}>
            {input.length}/500
          </span>
        </div>
      </div>
    </div>
  );
}
