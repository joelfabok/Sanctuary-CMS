import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Logo } from '../components/shared/UI'
import api from '../utils/api'

const TOPICS = [
  'General question',
  'Billing & subscription',
  'Technical support',
  'Feature request',
  'Report a bug',
  'Partnership inquiry',
  'Other',
]

export default function Contact() {
  const nav = useNavigate()
  const [form, setForm]     = useState({ name: '', email: '', topic: '', message: '' })
  const [status, setStatus] = useState(null) // null | 'sending' | 'sent' | 'error'
  const [errors, setErrors] = useState({})

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })) }

  const validate = () => {
    const e = {}
    if (!form.name.trim())    e.name    = 'Name is required'
    if (!form.email.trim())   e.email   = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.topic)          e.topic   = 'Please select a topic'
    if (!form.message.trim()) e.message = 'Message is required'
    return e
  }

  const submit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setStatus('sending')
    try {
      await api.post('/contact', form)
      setStatus('sent')
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  const inpStyle = (err) => ({
    width: '100%', padding: '10px 13px', borderRadius: 8, border: `1px solid ${err ? '#ef4444' : 'var(--b2)'}`,
    background: 'var(--bg4)', color: 'var(--tx)', fontSize: 14, outline: 'none',
    fontFamily: "'Instrument Sans', sans-serif", transition: 'border-color .15s', boxSizing: 'border-box',
  })

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--tx)', fontFamily: "'Instrument Sans', sans-serif" }}>
      {/* Nav */}
      <div style={{ height: 52, background: 'var(--bg2)', borderBottom: '1px solid var(--b1)', display: 'flex', alignItems: 'center', padding: '0 28px', gap: 12 }}>
        <button className="btn btn-gh btn-sm" onClick={() => nav(-1)}>← Back</button>
        <Logo size={22} onClick={() => nav('/')} />
      </div>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '60px 28px 80px' }}>
        {/* Header */}
        <div style={{ marginBottom: 44 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 10 }}>Support</div>
          <h1 style={{ fontSize: 34, fontWeight: 800, color: 'var(--tx)', marginBottom: 12, letterSpacing: '-.02em' }}>Get in Touch</h1>
          <p style={{ fontSize: 15, color: 'var(--tx3)', lineHeight: 1.75 }}>
            We typically respond within one business day. For urgent technical issues, include as much detail as possible.
          </p>
        </div>

        {/* Quick links */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 40 }}>
          {[
            { icon: '📖', label: 'Documentation', sub: 'Guides & tutorials' },
            { icon: '💬', label: 'Live Chat', sub: 'Mon–Fri, 9–5 ET' },
            { icon: '✉️', label: 'Email Us', sub: 'hello@sanctuarybuilder.com' },
          ].map(({ icon, label, sub }) => (
            <div key={label} style={{ padding: '16px', background: 'var(--bg2)', border: '1px solid var(--b1)', borderRadius: 10, textAlign: 'center' }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)', marginBottom: 3 }}>{label}</div>
              <div style={{ fontSize: 11.5, color: 'var(--tx4)' }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--b1)', borderRadius: 14, padding: '32px 28px' }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--tx)', marginBottom: 24 }}>Send us a message</div>

          {status === 'error' ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>⚠️</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--tx)', marginBottom: 8 }}>Something went wrong</div>
              <p style={{ fontSize: 14, color: 'var(--tx3)', marginBottom: 24 }}>
                We couldn't send your message. Please try again or email us directly at <strong>hello@sanctuarybuilder.com</strong>.
              </p>
              <button className="btn btn-gh btn-sm" onClick={() => setStatus(null)}>Try again</button>
            </div>
          ) : status === 'sent' ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>✅</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--tx)', marginBottom: 8 }}>Message sent!</div>
              <p style={{ fontSize: 14, color: 'var(--tx3)', marginBottom: 24 }}>
                Thanks, <strong>{form.name}</strong>. We'll get back to you at <strong>{form.email}</strong> within one business day.
              </p>
              <button className="btn btn-gh btn-sm" onClick={() => { setForm({ name:'', email:'', topic:'', message:'' }); setStatus(null) }}>
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--tx3)', marginBottom: 6, letterSpacing: '.04em' }}>Name</label>
                  <input
                    value={form.name} onChange={e => set('name', e.target.value)}
                    placeholder="Your name" style={inpStyle(errors.name)}
                    onFocus={e => e.target.style.borderColor = 'var(--gold)'}
                    onBlur={e => e.target.style.borderColor = errors.name ? '#ef4444' : 'var(--b2)'}
                  />
                  {errors.name && <div style={{ fontSize: 11.5, color: '#ef4444', marginTop: 4 }}>{errors.name}</div>}
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--tx3)', marginBottom: 6, letterSpacing: '.04em' }}>Email</label>
                  <input
                    type="email" value={form.email} onChange={e => set('email', e.target.value)}
                    placeholder="you@example.com" style={inpStyle(errors.email)}
                    onFocus={e => e.target.style.borderColor = 'var(--gold)'}
                    onBlur={e => e.target.style.borderColor = errors.email ? '#ef4444' : 'var(--b2)'}
                  />
                  {errors.email && <div style={{ fontSize: 11.5, color: '#ef4444', marginTop: 4 }}>{errors.email}</div>}
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--tx3)', marginBottom: 6, letterSpacing: '.04em' }}>Topic</label>
                <select
                  value={form.topic} onChange={e => set('topic', e.target.value)}
                  style={{ ...inpStyle(errors.topic), cursor: 'pointer' }}
                  onFocus={e => e.target.style.borderColor = 'var(--gold)'}
                  onBlur={e => e.target.style.borderColor = errors.topic ? '#ef4444' : 'var(--b2)'}
                >
                  <option value="">Select a topic…</option>
                  {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                {errors.topic && <div style={{ fontSize: 11.5, color: '#ef4444', marginTop: 4 }}>{errors.topic}</div>}
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--tx3)', marginBottom: 6, letterSpacing: '.04em' }}>Message</label>
                <textarea
                  rows={5} value={form.message} onChange={e => set('message', e.target.value)}
                  placeholder="Describe your question or issue in detail…"
                  style={{ ...inpStyle(errors.message), resize: 'vertical', minHeight: 110 }}
                  onFocus={e => e.target.style.borderColor = 'var(--gold)'}
                  onBlur={e => e.target.style.borderColor = errors.message ? '#ef4444' : 'var(--b2)'}
                />
                {errors.message && <div style={{ fontSize: 11.5, color: '#ef4444', marginTop: 4 }}>{errors.message}</div>}
              </div>

              <button
                type="submit" disabled={status === 'sending'}
                className="btn btn-gold"
                style={{ width: '100%', justifyContent: 'center', padding: '11px 0', fontSize: 14, opacity: status === 'sending' ? .7 : 1 }}
              >
                {status === 'sending' ? 'Sending…' : 'Send Message →'}
              </button>
            </form>
          )}
        </div>
      </div>

      <footer style={{ background: 'var(--bg2)', borderTop: '1px solid var(--b1)', padding: '18px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 12, color: 'var(--tx4)' }}>© 2024 Product Of Sphere Digital · Built for faith communities</span>
        <div style={{ display: 'flex', gap: 16 }}>
          {[['Privacy', '/privacy'], ['Terms', '/terms'], ['Contact', '/contact']].map(([l, to]) => (
            <span key={l} onClick={() => nav(to)} style={{ fontSize: 12, color: 'var(--tx4)', cursor: 'pointer' }}>{l}</span>
          ))}
        </div>
      </footer>
    </div>
  )
}
