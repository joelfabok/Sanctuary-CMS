import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { PLANS } from '../data/constants'
import { Modal, Logo } from '../components/shared/UI'
import api from '../utils/api'

const PRICES = { starter: 19, church: 39, ministry: 79 }

function StatCard({ label, value, icon, color, spark }) {
  return (
    <div style={{ background: 'var(--bg3)', border: '1px solid var(--b1)', borderRadius: 12, padding: '20px 18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--tx4)' }}>{label}</span>
        <span style={{ color, fontSize: 14 }}>{icon}</span>
      </div>
      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 36, fontWeight: 400, color, lineHeight: 1, marginBottom: 10 }}>{value}</div>
      {spark && (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 24 }}>
          {[3,5,4,7,6,8,9,7,10,11,9,12].map((h, i) => (
            <div key={i} style={{ flex: 1, background: color, borderRadius: '2px 2px 0 0', height: h * 2, opacity: 0.35 + h * 0.025 }} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function Admin() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('overview')

  // Data
  const [stats, setStats]       = useState(null)
  const [orgs, setOrgs]         = useState([])
  const [users, setUsers]       = useState([])
  const [homepage, setHP]       = useState(null)
  const [contacts, setContacts] = useState([])
  const [openMsg, setOpenMsg]   = useState(null)

  // Modals
  const [recoveryModal, setRM]   = useState(null)
  const [payModal, setPayM]      = useState(null)
  const [subModal, setSubM]      = useState(null)
  const [editUserModal, setEUM]  = useState(null)
  const [recoveryAction, setRA]  = useState('')
  const [saving, setSaving]      = useState(false)
  const [msg, setMsg]            = useState('')

  const showMsg = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000) }

  useEffect(() => { loadAll() }, [])

  const loadAll = async () => {
    try {
      const [sRes, oRes, uRes, hRes, cRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/orgs'),
        api.get('/admin/users'),
        api.get('/homepage'),
        api.get('/admin/contacts'),
      ])
      setStats(sRes.data)
      setOrgs(oRes.data)
      setUsers(uRes.data)
      setHP(hRes.data)
      setContacts(cRes.data)
    } catch (e) { console.error(e) }
  }

  const doRecovery = async () => {
    if (!recoveryAction) return
    try {
      setSaving(true)
      await api.post(`/admin/recovery/${recoveryModal._id}`, { action: recoveryAction })
      showMsg(`Recovery action applied to ${recoveryModal.email}`)
      setRM(null); setRA('')
    } catch (e) { showMsg('Error: ' + (e.response?.data?.message || e.message)) }
    finally { setSaving(false) }
  }

  const doPayment = async (card) => {
    try {
      setSaving(true)
      const r = await api.put(`/admin/orgs/${payModal._id}/payment`, { card })
      setOrgs(p => p.map(o => o._id === r.data._id ? r.data : o))
      showMsg('Payment info updated')
      setPayM(null)
    } catch (e) { showMsg('Error: ' + e.message) }
    finally { setSaving(false) }
  }

  const doSub = async (plan, status, notes) => {
    try {
      setSaving(true)
      const r = await api.put(`/admin/orgs/${subModal._id}/subscription`, { plan, status, adminNotes: notes })
      setOrgs(p => p.map(o => o._id === r.data._id ? r.data : o))
      showMsg('Subscription updated')
      setSubM(null)
    } catch (e) { showMsg('Error: ' + e.message) }
    finally { setSaving(false) }
  }

  const deleteOrg = async (id) => {
    if (!confirm('Delete this organization and all its data? This cannot be undone.')) return
    await api.delete(`/admin/orgs/${id}`)
    setOrgs(p => p.filter(o => o._id !== id))
    showMsg('Organization deleted')
  }

  const deleteUser = async (id) => {
    if (!confirm('Remove this user?')) return
    await api.delete(`/admin/users/${id}`)
    setUsers(p => p.filter(u => u._id !== id))
    showMsg('User removed')
  }

  const updateUser = async (userId, data) => {
    try {
      setSaving(true)
      const r = await api.put(`/admin/users/${userId}`, data)
      setUsers(p => p.map(u => u._id === userId ? { ...u, ...r.data } : u))
      showMsg('User updated successfully')
      setEUM(null)
    } catch (e) { showMsg('Error: ' + (e.response?.data?.message || e.message)) }
    finally { setSaving(false) }
  }

  const saveHomepage = async () => {
    try {
      setSaving(true)
      await api.put('/homepage', homepage)
      showMsg('Homepage updated!')
    } catch (e) { showMsg('Error saving homepage') }
    finally { setSaving(false) }
  }

  const mrr = orgs.filter(o => o.status === 'active').reduce((sum, o) => sum + (PRICES[o.plan] || 0), 0)

  const unread = contacts.filter(c => !c.read).length

  const TABS = [
    ['overview',   'Overview',          '◈'],
    ['orgs',       'Organizations',     '⊞'],
    ['users',      'All Users',         '◎'],
    ['homepage',   'Homepage CMS',      '✦'],
    ['contacts',   'Messages',          '✉'],
  ]

  const inp = { width: '100%', padding: '8px 11px', borderRadius: 'var(--r)', border: '1px solid var(--b2)', background: 'var(--bg4)', color: 'var(--tx)', fontFamily: "'Instrument Sans',sans-serif", fontSize: 13, outline: 'none' }
  const lbl = { display: 'block', fontSize: 10.5, fontWeight: 600, letterSpacing: '.07em', textTransform: 'uppercase', color: 'var(--tx3)', marginBottom: 4 }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>

      {/* Toast */}
      {msg && (
        <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 9999, background: 'var(--bg3)', border: '1px solid var(--gold)', color: 'var(--gold)', padding: '10px 18px', borderRadius: 8, fontSize: 13, fontWeight: 500, boxShadow: '0 8px 24px rgba(0,0,0,.5)', animation: 'popIn .2s ease' }}>
          {msg}
        </div>
      )}

      {/* Edit User Modal */}
      {editUserModal && (() => {
        const [editName, setEditName] = useState(editUserModal.name || '')
        const [editEmail, setEditEmail] = useState(editUserModal.email || '')
        const [editPw, setEditPw] = useState('')
        return (
          <Modal title="Edit Team Member" onClose={() => setEUM(null)} width={480}>
            <div style={{ marginBottom: 16, padding: '10px 14px', background: 'rgba(91,156,246,.08)', border: '1px solid rgba(91,156,246,.18)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bg5)', border: '1px solid var(--b2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: 'var(--tx3)' }}>{editUserModal.avatar}</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--blue)' }}>{editUserModal.name}</div>
                <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{editUserModal.orgRole || 'member'} · {editUserModal.status}</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 18 }}>
              <div>
                <label style={lbl}>Name</label>
                <input style={inp} value={editName} onChange={e => setEditName(e.target.value)} placeholder="Full name" />
              </div>
              <div>
                <label style={lbl}>Email Address</label>
                <input style={inp} type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} placeholder="user@example.com" />
              </div>
              <div>
                <label style={lbl}>New Password <span style={{ fontWeight: 400, color: 'var(--tx4)', textTransform: 'none', letterSpacing: 0 }}>(leave blank to keep current)</span></label>
                <input style={inp} type="password" value={editPw} onChange={e => setEditPw(e.target.value)} placeholder="••••••••" />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <button className="btn btn-gold" style={{ flex: 1, justifyContent: 'center' }} disabled={saving} onClick={() => {
                const data = {}
                if (editName && editName !== editUserModal.name) data.name = editName
                if (editEmail && editEmail !== editUserModal.email) data.email = editEmail
                if (editPw.length >= 6) data.password = editPw
                if (editPw && editPw.length < 6) return showMsg('Password must be at least 6 characters')
                if (!Object.keys(data).length) return showMsg('No changes to save')
                updateUser(editUserModal._id, data)
              }}>{saving ? 'Saving…' : 'Save Changes'}</button>
              <button className="btn btn-gh" onClick={() => setEUM(null)}>Cancel</button>
            </div>
            <div style={{ borderTop: '1px solid var(--b1)', paddingTop: 12 }}>
              <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '.07em', textTransform: 'uppercase', color: 'var(--tx4)', marginBottom: 8 }}>Quick Actions</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button className="btn btn-blue btn-sm" style={{ fontSize: 10.5 }} onClick={() => { setEUM(null); setRM(editUserModal) }}>🔑 Password Recovery</button>
                <button className="btn btn-dk btn-sm" style={{ fontSize: 10.5 }} onClick={async () => {
                  try {
                    setSaving(true)
                    await api.post(`/admin/recovery/${editUserModal._id}`, { action: 'force_reset' })
                    showMsg(`Force password reset set for ${editUserModal.email}`)
                  } catch (e) { showMsg('Error: ' + e.message) }
                  finally { setSaving(false) }
                }}>Force Reset on Next Login</button>
                <button className="btn btn-dk btn-sm" style={{ fontSize: 10.5 }} onClick={async () => {
                  try {
                    setSaving(true)
                    await api.post(`/admin/recovery/${editUserModal._id}`, { action: 'unlock' })
                    setUsers(p => p.map(u => u._id === editUserModal._id ? { ...u, status: 'active' } : u))
                    showMsg(`Account unlocked for ${editUserModal.email}`)
                  } catch (e) { showMsg('Error: ' + e.message) }
                  finally { setSaving(false) }
                }}>Unlock Account</button>
              </div>
            </div>
          </Modal>
        )
      })()}

      {/* Recovery Modal */}
      {recoveryModal && (
        <Modal title="Account Recovery" onClose={() => { setRM(null); setRA('') }} width={460}>
          <div style={{ marginBottom: 16, padding: '10px 14px', background: 'rgba(91,156,246,.08)', border: '1px solid rgba(91,156,246,.18)', borderRadius: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--blue)', marginBottom: 2 }}>{recoveryModal.name}</div>
            <div style={{ fontSize: 12, color: 'var(--tx3)' }}>{recoveryModal.email}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
            {[
              ['reset_email',  'Send Password Reset Email',        'Send a secure reset link to the user\'s email address.'],
              ['force_reset',  'Force Reset on Next Login',        'User must change their password at next login.'],
              ['unlock',       'Unlock Account (if locked)',        'Clear login lockouts from repeated failed attempts.'],
              ['revoke',       'Revoke All Sessions',              'Sign the user out of all active sessions immediately.'],
            ].map(([action, label, desc]) => (
              <div key={action} onClick={() => setRA(action)}
                style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${recoveryAction === action ? 'rgba(212,168,67,.4)' : 'var(--b1)'}`, background: recoveryAction === action ? 'var(--g4)' : 'var(--bg4)', cursor: 'pointer', transition: 'all .12s' }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: recoveryAction === action ? 'var(--gold)' : 'var(--tx)', marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 11.5, color: 'var(--tx4)' }}>{desc}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-gold" style={{ flex: 1, justifyContent: 'center' }} onClick={doRecovery} disabled={!recoveryAction || saving}>
              {saving ? 'Applying…' : 'Apply Recovery Action'}
            </button>
            <button className="btn btn-gh" onClick={() => { setRM(null); setRA('') }}>Cancel</button>
          </div>
        </Modal>
      )}

      {/* Payment Modal */}
      {payModal && (
        <Modal title="Update Payment" onClose={() => setPayM(null)} width={440}>
          <div style={{ marginBottom: 16, padding: '10px 14px', background: 'var(--bg4)', borderRadius: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx2)', marginBottom: 2 }}>{payModal.name}</div>
            <div style={{ fontSize: 12, color: 'var(--tx3)' }}>Current card: {payModal.billing?.card || '—'}</div>
          </div>
          {(() => {
            const [card, setCard] = useState('')
            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div><label style={lbl}>New Card (last 4 digits for display)</label><input style={inp} placeholder="•••• 4242" value={card} onChange={e => setCard(e.target.value)} /></div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn btn-gold" style={{ flex: 1, justifyContent: 'center' }} onClick={() => doPayment(card ? `•••• ${card.slice(-4)}` : payModal.billing?.card)} disabled={saving}>
                    {saving ? 'Saving…' : 'Update Payment'}
                  </button>
                  <button className="btn btn-gh" onClick={() => setPayM(null)}>Cancel</button>
                </div>
                <div style={{ height: 1, background: 'var(--b1)' }} />
                <button className="btn btn-blue" style={{ justifyContent: 'center' }} onClick={() => { showMsg('Payment link generated (connect Stripe in production)'); setPayM(null) }}>
                  Generate One-Time Payment Link →
                </button>
              </div>
            )
          })()}
        </Modal>
      )}

      {/* Subscription Modal */}
      {subModal && (
        <Modal title="Subscription Management" onClose={() => setSubM(null)} width={480}>
          {(() => {
            const [plan, setPlan] = useState(subModal.plan)
            const [status, setStatus] = useState(subModal.status)
            const [notes, setNotes] = useState(subModal.adminNotes || '')
            return (
              <div>
                <div style={{ marginBottom: 16, padding: '10px 14px', background: 'var(--bg4)', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx2)', marginBottom: 2 }}>{subModal.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--tx3)' }}>Current: {subModal.plan?.toUpperCase()} · ${PRICES[subModal.plan] || 0}/mo</div>
                  </div>
                  <span className={`badge ${subModal.status === 'active' ? 'badge-green' : 'badge-red'}`}>{subModal.status}</span>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={lbl}>Plan</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {PLANS.map(p => (
                      <div key={p.id} onClick={() => setPlan(p.id)}
                        style={{ padding: '10px 14px', background: plan === p.id ? 'var(--g4)' : 'var(--bg4)', border: `1px solid ${plan === p.id ? 'rgba(212,168,67,.3)' : 'var(--b1)'}`, borderRadius: 8, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', transition: 'all .12s' }}>
                        <span style={{ fontWeight: 600, fontSize: 13, color: plan === p.id ? 'var(--gold)' : 'var(--tx)' }}>{p.name} — ${p.price}/mo</span>
                        <span style={{ fontSize: 12, color: 'var(--tx4)' }}>{p.sites} sites · {p.members} members</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <label style={lbl}>Status</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 7 }}>
                    {['active', 'paused', 'cancelled'].map(s => (
                      <div key={s} onClick={() => setStatus(s)}
                        style={{ padding: '8px 10px', textAlign: 'center', borderRadius: 7, cursor: 'pointer', border: `1px solid ${status === s ? 'rgba(212,168,67,.35)' : 'var(--b1)'}`, background: status === s ? 'var(--g4)' : 'var(--bg4)', fontSize: 12, fontWeight: 500, color: status === s ? 'var(--gold)' : 'var(--tx3)', textTransform: 'capitalize' }}>
                        {s}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={lbl}>Admin Note (internal only)</label>
                  <textarea style={{ ...inp, resize: 'vertical', lineHeight: 1.6 }} rows={2} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Internal notes, not visible to user" />
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn btn-gold" style={{ flex: 1, justifyContent: 'center' }} onClick={() => doSub(plan, status, notes)} disabled={saving}>
                    {saving ? 'Saving…' : 'Save Changes'}
                  </button>
                  <button className="btn btn-gh" onClick={() => setSubM(null)}>Cancel</button>
                </div>
              </div>
            )
          })()}
        </Modal>
      )}

      {/* Topbar */}
      <div style={{ height: 52, background: 'var(--bg2)', borderBottom: '1px solid var(--b2)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 8, flexShrink: 0 }}>
        <Logo size={26} />
        <div style={{ width: 1, height: 18, background: 'var(--b1)', margin: '0 4px' }} />
        <span className="badge badge-red" style={{ fontSize: 9 }}>Admin</span>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 12, color: 'var(--tx4)' }}>{user?.email}</span>
        <button className="btn btn-gh btn-sm" onClick={() => { logout(); navigate('/') }}>Sign Out</button>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Sidebar */}
        <div style={{ width: 224, background: 'var(--bg2)', borderRight: '1px solid var(--b1)', padding: '16px 10px', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
          {TABS.map(([t, l, ic]) => (
            <button key={t} onClick={() => setTab(t)}
              style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 12px', width: '100%', border: 'none', borderRadius: 7, background: tab === t ? 'var(--g4)' : 'transparent', color: tab === t ? 'var(--gold)' : 'var(--tx3)', fontSize: 13, fontWeight: tab === t ? 600 : 400, cursor: 'pointer', textAlign: 'left', fontFamily: "'Instrument Sans',sans-serif", borderLeft: tab === t ? '2px solid var(--gold)' : '2px solid transparent', paddingLeft: tab === t ? 10 : 12, transition: 'all .12s', marginBottom: 2 }}>
              <span style={{ color: tab === t ? 'var(--gold)' : 'var(--tx4)', width: 14 }}>{ic}</span>
              {l}
              {t === 'contacts' && unread > 0 && (
                <span style={{ marginLeft: 'auto', background: 'var(--gold)', color: '#1c0f00', fontSize: 9.5, fontWeight: 700, padding: '1px 6px', borderRadius: 10 }}>{unread}</span>
              )}
            </button>
          ))}
          <div style={{ flex: 1 }} />
          <div style={{ padding: '14px', background: 'var(--bg4)', borderRadius: 10, border: '1px solid var(--b1)', marginTop: 16 }}>
            <div style={{ fontSize: 10, color: 'var(--tx4)', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 6 }}>Monthly Revenue</div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 30, color: 'var(--green)', lineHeight: 1 }}>${mrr.toLocaleString()}</div>
            <div style={{ fontSize: 11, color: 'var(--tx4)', marginTop: 3 }}>{orgs.filter(o => o.status === 'active').length} active subscriptions</div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '28px 32px' }}>

          {/* ── OVERVIEW ── */}
          {tab === 'overview' && (
            <>
              <h2 style={{ fontSize: 28, marginBottom: 6 }}>Platform Overview</h2>
              <p style={{ color: 'var(--tx3)', marginBottom: 24, fontSize: 13.5 }}>Real-time metrics across all organizations.</p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
                <StatCard label="Total Users" value={users.length} icon="◈" color="var(--gold)" spark />
                <StatCard label="Organizations" value={orgs.length} icon="⊞" color="var(--blue)" spark />
                <StatCard label="Active Subs" value={orgs.filter(o => o.status === 'active').length} icon="◎" color="var(--green)" spark />
                <StatCard label="MRR" value={`$${mrr.toLocaleString()}`} icon="◆" color="var(--purple)" spark />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                {/* Plan breakdown */}
                <div style={{ background: 'var(--bg3)', border: '1px solid var(--b1)', borderRadius: 12, padding: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Plan Distribution</div>
                  {PLANS.map(plan => {
                    const count = orgs.filter(o => o.plan === plan.id).length
                    const pct = orgs.length ? Math.round(count / orgs.length * 100) : 0
                    return (
                      <div key={plan.id} style={{ marginBottom: 13 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                          <span style={{ fontSize: 12, color: 'var(--tx2)' }}>{plan.name}</span>
                          <span style={{ fontSize: 12, color: 'var(--tx3)' }}>{count} orgs · ${count * plan.price}/mo</span>
                        </div>
                        <div style={{ height: 5, background: 'var(--bg5)', borderRadius: 3 }}>
                          <div style={{ height: '100%', borderRadius: 3, background: 'var(--gold)', width: pct + '%', transition: 'width .4s' }} />
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Org types */}
                <div style={{ background: 'var(--bg3)', border: '1px solid var(--b1)', borderRadius: 12, padding: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Organization Types</div>
                  {[['Church', '⛪'], ['Ministry', '◆'], ['Missionary', '🌍'], ['Nonprofit', '🤝'], ['Other', '◈']].map(([type, ic]) => {
                    const count = orgs.filter(o => o.type === type).length
                    return (
                      <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                        <span style={{ fontSize: 16 }}>{ic}</span>
                        <span style={{ flex: 1, fontSize: 12, color: 'var(--tx2)' }}>{type}</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)' }}>{count}</span>
                        <div style={{ width: 60, height: 4, background: 'var(--bg5)', borderRadius: 2 }}>
                          <div style={{ height: '100%', borderRadius: 2, background: 'var(--gold)', width: orgs.length ? (count / orgs.length * 100) + '%' : '0%' }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Activity feed */}
              <div style={{ background: 'var(--bg3)', border: '1px solid var(--b1)', borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--b1)', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>Recent Organizations</span>
                  <span style={{ fontSize: 12, color: 'var(--tx4)' }}>{orgs.length} total</span>
                </div>
                {orgs.slice(0, 6).map(org => (
                  <div key={org._id} style={{ padding: '11px 18px', borderBottom: '1px solid var(--b1)', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: org.status === 'active' ? 'var(--green)' : 'var(--red)', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--tx2)', marginRight: 8 }}>{org.name}</span>
                      <span style={{ fontSize: 11.5, color: 'var(--tx4)' }}>{org.type}</span>
                    </div>
                    <span className={`badge ${org.plan === 'ministry' ? 'badge-purple' : org.plan === 'church' ? 'badge-gold' : 'badge-dim'}`} style={{ fontSize: 9.5 }}>{org.plan}</span>
                    <span style={{ fontSize: 12, color: 'var(--green)', fontFamily: "'JetBrains Mono',monospace" }}>${PRICES[org.plan] || 0}/mo</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── ORGANIZATIONS ── */}
          {tab === 'orgs' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
                <div>
                  <h2 style={{ fontSize: 28, marginBottom: 3 }}>Organizations</h2>
                  <p style={{ color: 'var(--tx3)', fontSize: 13.5 }}>{orgs.length} total · {orgs.filter(o => o.status === 'active').length} active</p>
                </div>
              </div>
              <div style={{ background: 'var(--bg3)', border: '1px solid var(--b1)', borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.8fr .7fr .7fr .7fr .8fr auto', padding: '10px 18px', background: 'var(--bg4)', borderBottom: '1px solid var(--b1)' }}>
                  {['Organization', 'Type', 'Plan', 'Status', 'Revenue', 'Actions'].map(h => (
                    <span key={h} style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--tx4)' }}>{h}</span>
                  ))}
                </div>
                {orgs.map(org => (
                  <div key={org._id} style={{ display: 'grid', gridTemplateColumns: '1.8fr .7fr .7fr .7fr .8fr auto', alignItems: 'center', padding: '13px 18px', borderBottom: '1px solid var(--b1)', transition: 'background .12s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg4)'}
                    onMouseLeave={e => e.currentTarget.style.background = ''}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{org.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--tx4)', marginTop: 2 }}>
                        {(org.members || []).length} member{(org.members || []).length !== 1 ? 's' : ''} · {org.billing?.card || '—'}
                      </div>
                      <div style={{ marginTop: 5, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {(org.members || []).slice(0, 4).map(m => (
                          <span key={m._id || m} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 7px', background: 'var(--bg5)', borderRadius: 10, fontSize: 10.5, color: 'var(--tx3)' }}>
                            <span style={{ width: 14, height: 14, borderRadius: '50%', background: 'var(--g3)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, color: 'var(--gold2)' }}>{m.avatar || '?'}</span>
                            {m.name?.split(' ')[0] || 'Member'}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="badge badge-dim" style={{ fontSize: 10, height: 'fit-content' }}>{org.type}</span>
                    <span className="badge badge-gold" style={{ fontSize: 10, height: 'fit-content', textTransform: 'uppercase' }}>{org.plan}</span>
                    <span className={`badge ${org.status === 'active' ? 'badge-green' : 'badge-red'}`} style={{ fontSize: 10, height: 'fit-content' }}>{org.status}</span>
                    <span style={{ fontSize: 13, color: 'var(--green)', fontFamily: "'JetBrains Mono',monospace" }}>${PRICES[org.plan] || 0}/mo</span>
                    <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                      <button className="btn btn-dk btn-sm" style={{ fontSize: 10, padding: '4px 9px' }} onClick={() => setSubM(org)}>Sub</button>
                      <button className="btn btn-blue btn-sm" style={{ fontSize: 10, padding: '4px 9px' }} onClick={() => setPayM(org)}>Pay</button>
                      <button className="btn btn-dng btn-sm" style={{ fontSize: 10, padding: '4px 9px' }} onClick={() => deleteOrg(org._id)}>Del</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── USERS (grouped by org) ── */}
          {tab === 'users' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
                <div>
                  <h2 style={{ fontSize: 28, marginBottom: 3 }}>All Users</h2>
                  <p style={{ color: 'var(--tx3)', fontSize: 13.5 }}>{users.length} users across {orgs.length} organizations</p>
                </div>
              </div>

              {orgs.map(org => {
                const orgUsers = users.filter(u => u.orgId?._id === org._id || u.orgId === org._id)
                if (!orgUsers.length) return null
                return (
                  <div key={org._id} style={{ marginBottom: 22 }}>
                    {/* Org header row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <div style={{ height: 1, flex: 1, background: 'var(--b1)' }} />
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '4px 14px', background: 'var(--bg4)', borderRadius: 20, border: '1px solid var(--b1)' }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx2)' }}>{org.name}</span>
                        <span className="badge badge-gold" style={{ fontSize: 9 }}>{org.plan}</span>
                        <span className={`badge ${org.status === 'active' ? 'badge-green' : 'badge-red'}`} style={{ fontSize: 9 }}>{org.status}</span>
                      </div>
                      <div style={{ height: 1, flex: 1, background: 'var(--b1)' }} />
                    </div>

                    <div style={{ background: 'var(--bg3)', border: '1px solid var(--b1)', borderRadius: 12, overflow: 'hidden' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr .7fr .7fr .8fr auto', padding: '9px 16px', background: 'var(--bg4)', borderBottom: '1px solid var(--b1)' }}>
                        {['Name', 'Email', 'Role', 'Status', 'Last Login', 'Actions'].map(h => (
                          <span key={h} style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--tx4)' }}>{h}</span>
                        ))}
                      </div>
                      {orgUsers.map(u2 => (
                        <div key={u2._id} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr .7fr .7fr .8fr auto', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--b1)', transition: 'background .12s' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg4)'}
                          onMouseLeave={e => e.currentTarget.style.background = ''}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                            <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--bg5)', border: '1px solid var(--b2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600, color: 'var(--tx3)', flexShrink: 0 }}>{u2.avatar}</div>
                            <div>
                              <div style={{ fontSize: 12.5, fontWeight: 500 }}>{u2.name}</div>
                              <div style={{ fontSize: 11, color: 'var(--tx4)' }}>Joined {new Date(u2.createdAt).toLocaleDateString()}</div>
                            </div>
                          </div>
                          <span style={{ fontSize: 11.5, color: 'var(--tx3)', fontFamily: "'JetBrains Mono',monospace" }}>{u2.email}</span>
                          <span className={u2.orgRole === 'owner' ? 'badge badge-gold' : 'badge badge-dim'} style={{ fontSize: 9.5, height: 'fit-content' }}>{u2.orgRole || 'member'}</span>
                          <span className={u2.status === 'active' ? 'badge badge-green' : 'badge badge-red'} style={{ fontSize: 9.5, height: 'fit-content' }}>{u2.status}</span>
                          <span style={{ fontSize: 11, color: 'var(--tx4)' }}>{u2.lastLogin ? new Date(u2.lastLogin).toLocaleDateString() : '—'}</span>
                          <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                            <button className="btn btn-dk btn-sm" style={{ fontSize: 10, padding: '4px 8px' }} onClick={() => setEUM(u2)}>Edit</button>
                            <button className="btn btn-blue btn-sm" style={{ fontSize: 10, padding: '4px 8px' }} onClick={() => setRM(u2)}>Recovery</button>
                            <button className="btn btn-dng btn-sm" style={{ fontSize: 10, padding: '4px 8px' }} onClick={() => deleteUser(u2._id)}>Remove</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </>
          )}

          {/* ── HOMEPAGE CMS ── */}
          {tab === 'homepage' && homepage && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <div>
                  <h2 style={{ fontSize: 28, marginBottom: 6 }}>Homepage CMS</h2>
                  <p style={{ color: 'var(--tx3)', fontSize: 13.5 }}>Customize the public landing page. Changes go live immediately.</p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-gh btn-sm" onClick={() => navigate('/')}>View Live →</button>
                  <button className="btn btn-gold" onClick={saveHomepage} disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                  {/* Announcement */}
                  <div style={{ background: 'var(--bg3)', border: '1px solid var(--b1)', borderRadius: 12, padding: 20 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Announcement Bar</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <input type="checkbox" checked={homepage.announcementBar} onChange={e => setHP(p => ({ ...p, announcementBar: e.target.checked }))} style={{ accentColor: 'var(--gold)' }} />
                      <span style={{ fontSize: 12.5, color: 'var(--tx2)' }}>Show announcement bar</span>
                    </div>
                    {homepage.announcementBar && <>
                      <label style={lbl}>Announcement Text</label>
                      <input style={{ ...inp, marginBottom: 8 }} value={homepage.announcementText} onChange={e => setHP(p => ({ ...p, announcementText: e.target.value }))} />
                      <label style={lbl}>Link Text</label>
                      <input style={inp} value={homepage.announcementLink} onChange={e => setHP(p => ({ ...p, announcementLink: e.target.value }))} />
                    </>}
                  </div>

                  {/* Hero */}
                  <div style={{ background: 'var(--bg3)', border: '1px solid var(--b1)', borderRadius: 12, padding: 20 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Hero Section</div>
                    <label style={lbl}>Badge Text</label>
                    <input style={{ ...inp, marginBottom: 10 }} value={homepage.badge} onChange={e => setHP(p => ({ ...p, badge: e.target.value }))} />
                    <label style={lbl}>Main Headline</label>
                    <textarea style={{ ...inp, resize: 'vertical', lineHeight: 1.6, marginBottom: 10 }} rows={2} value={homepage.headline} onChange={e => setHP(p => ({ ...p, headline: e.target.value }))} />
                    <label style={lbl}>Subheadline</label>
                    <textarea style={{ ...inp, resize: 'vertical', lineHeight: 1.6, marginBottom: 10 }} rows={3} value={homepage.subheadline} onChange={e => setHP(p => ({ ...p, subheadline: e.target.value }))} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <div><label style={lbl}>Primary CTA</label><input style={inp} value={homepage.ctaText} onChange={e => setHP(p => ({ ...p, ctaText: e.target.value }))} /></div>
                      <div><label style={lbl}>Secondary CTA</label><input style={inp} value={homepage.ctaText2} onChange={e => setHP(p => ({ ...p, ctaText2: e.target.value }))} /></div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div style={{ background: 'var(--bg3)', border: '1px solid var(--b1)', borderRadius: 12, padding: 20 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Stats Row</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      {[[1, 'stat1n', 'stat1l'], [2, 'stat2n', 'stat2l'], [3, 'stat3n', 'stat3l'], [4, 'stat4n', 'stat4l']].map(([i, nk, lk]) => (
                        <div key={i} style={{ background: 'var(--bg4)', borderRadius: 8, padding: 10 }}>
                          <div style={{ fontSize: 10, color: 'var(--tx4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Stat {i}</div>
                          <input style={{ ...inp, marginBottom: 6, fontSize: 12 }} value={homepage[nk]} onChange={e => setHP(p => ({ ...p, [nk]: e.target.value }))} placeholder="Value" />
                          <input style={{ ...inp, fontSize: 12 }} value={homepage[lk]} onChange={e => setHP(p => ({ ...p, [lk]: e.target.value }))} placeholder="Label" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Mini live preview */}
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: 'var(--tx3)' }}>Live Preview</div>
                  <div style={{ background: 'var(--bg)', border: '1px solid var(--b2)', borderRadius: 12, overflow: 'hidden' }}>
                    {homepage.announcementBar && (
                      <div style={{ background: 'var(--gold)', padding: '7px 16px', textAlign: 'center', fontSize: 11, fontWeight: 500, color: '#1c0f00' }}>
                        {homepage.announcementText} <span style={{ fontWeight: 700, textDecoration: 'underline' }}>{homepage.announcementLink}</span>
                      </div>
                    )}
                    <div style={{ padding: '40px 28px', textAlign: 'center', position: 'relative' }}>
                      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.02) 1px,transparent 1px)', backgroundSize: '30px 30px' }} />
                      <div style={{ position: 'relative' }}>
                        <div className="badge badge-gold" style={{ marginBottom: 14, fontSize: 10 }}>{homepage.badge}</div>
                        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, color: 'var(--tx)', lineHeight: 1.1, marginBottom: 12 }}>{homepage.headline}</div>
                        <div style={{ fontSize: 12, color: 'var(--tx3)', marginBottom: 16, lineHeight: 1.6, maxWidth: 320, margin: '0 auto 16px' }}>{homepage.subheadline.slice(0, 100)}…</div>
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                          <div style={{ background: 'var(--gold)', color: '#1c0f00', padding: '7px 16px', borderRadius: 5, fontSize: 11, fontWeight: 700 }}>{homepage.ctaText}</div>
                          <div style={{ border: '1px solid var(--b2)', color: 'var(--tx3)', padding: '7px 16px', borderRadius: 5, fontSize: 11 }}>{homepage.ctaText2}</div>
                        </div>
                        <div style={{ marginTop: 20, display: 'flex', gap: 24, justifyContent: 'center' }}>
                          {[[homepage.stat1n, homepage.stat1l], [homepage.stat2n, homepage.stat2l], [homepage.stat3n, homepage.stat3l], [homepage.stat4n, homepage.stat4l]].map(([n, l]) => (
                            <div key={l} style={{ textAlign: 'center' }}>
                              <div style={{ fontSize: 16, color: 'var(--gold)', fontFamily: "'Playfair Display',serif" }}>{n}</div>
                              <div style={{ fontSize: 10, color: 'var(--tx4)', marginTop: 2 }}>{l}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <button className="btn btn-gold" style={{ width: '100%', justifyContent: 'center', marginTop: 12 }} onClick={saveHomepage} disabled={saving}>
                    {saving ? 'Saving…' : 'Save & Publish to Homepage →'}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ── MESSAGES / CONTACTS ── */}
          {tab === 'contacts' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
                <div>
                  <h2 style={{ fontSize: 28, marginBottom: 3 }}>Messages</h2>
                  <p style={{ color: 'var(--tx3)', fontSize: 13.5 }}>{contacts.length} total · {unread} unread</p>
                </div>
              </div>

              {contacts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--tx4)', fontSize: 14 }}>No messages yet</div>
              ) : (
                <div style={{ background: 'var(--bg3)', border: '1px solid var(--b1)', borderRadius: 12, overflow: 'hidden' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.4fr 1fr 1fr .8fr auto', padding: '9px 16px', background: 'var(--bg4)', borderBottom: '1px solid var(--b1)' }}>
                    {['Name', 'Email', 'Topic', 'Date', 'Status', 'Actions'].map(h => (
                      <span key={h} style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--tx4)' }}>{h}</span>
                    ))}
                  </div>
                  {contacts.map(c => (
                    <div key={c._id}
                      style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.4fr 1fr 1fr .8fr auto', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--b1)', transition: 'background .12s', background: c.read ? '' : 'rgba(212,168,67,.04)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg4)'}
                      onMouseLeave={e => e.currentTarget.style.background = c.read ? '' : 'rgba(212,168,67,.04)'}>
                      <div style={{ fontSize: 12.5, fontWeight: c.read ? 400 : 600 }}>{c.name}</div>
                      <span style={{ fontSize: 11.5, color: 'var(--tx3)', fontFamily: "'JetBrains Mono',monospace" }}>{c.email}</span>
                      <span className="badge badge-dim" style={{ fontSize: 10, height: 'fit-content', maxWidth: 'fit-content' }}>{c.topic}</span>
                      <span style={{ fontSize: 11, color: 'var(--tx4)' }}>{new Date(c.createdAt).toLocaleDateString()}</span>
                      <span className={c.read ? 'badge badge-dim' : 'badge badge-gold'} style={{ fontSize: 10, height: 'fit-content', maxWidth: 'fit-content' }}>{c.read ? 'Read' : 'New'}</span>
                      <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                        <button className="btn btn-dk btn-sm" style={{ fontSize: 10, padding: '4px 9px' }} onClick={() => setOpenMsg(c)}>View</button>
                        {!c.read && (
                          <button className="btn btn-blue btn-sm" style={{ fontSize: 10, padding: '4px 9px' }} onClick={async () => {
                            const r = await api.patch(`/admin/contacts/${c._id}/read`)
                            setContacts(p => p.map(x => x._id === c._id ? r.data : x))
                          }}>Mark read</button>
                        )}
                        <button className="btn btn-dng btn-sm" style={{ fontSize: 10, padding: '4px 9px' }} onClick={async () => {
                          if (!confirm('Delete this message?')) return
                          await api.delete(`/admin/contacts/${c._id}`)
                          setContacts(p => p.filter(x => x._id !== c._id))
                        }}>Del</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Message detail modal */}
              {openMsg && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.65)', zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
                  onClick={e => { if (e.target === e.currentTarget) setOpenMsg(null) }}>
                  <div style={{ background: 'var(--bg2)', border: '1px solid var(--b1)', borderRadius: 14, width: '100%', maxWidth: 560, padding: 28 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                      <div style={{ fontSize: 15, fontWeight: 700 }}>{openMsg.topic}</div>
                      <button className="btn btn-gh btn-sm" onClick={() => setOpenMsg(null)}>✕ Close</button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
                      <div style={{ background: 'var(--bg4)', borderRadius: 8, padding: '10px 14px' }}>
                        <div style={{ fontSize: 10, color: 'var(--tx4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>From</div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{openMsg.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--tx3)', fontFamily: "'JetBrains Mono',monospace" }}>{openMsg.email}</div>
                      </div>
                      <div style={{ background: 'var(--bg4)', borderRadius: 8, padding: '10px 14px' }}>
                        <div style={{ fontSize: 10, color: 'var(--tx4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>Received</div>
                        <div style={{ fontSize: 13 }}>{new Date(openMsg.createdAt).toLocaleString()}</div>
                      </div>
                    </div>
                    <div style={{ background: 'var(--bg4)', borderRadius: 8, padding: '14px 16px', fontSize: 13.5, color: 'var(--tx2)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{openMsg.message}</div>
                    <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      {!openMsg.read && (
                        <button className="btn btn-blue btn-sm" onClick={async () => {
                          const r = await api.patch(`/admin/contacts/${openMsg._id}/read`)
                          setContacts(p => p.map(x => x._id === openMsg._id ? r.data : x))
                          setOpenMsg(r.data)
                        }}>Mark as read</button>
                      )}
                      <a href={`mailto:${openMsg.email}`} className="btn btn-gold btn-sm">Reply via email</a>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ── PLATFORM SETTINGS ── */}
          {tab === 'platform' && (
            <>
              <h2 style={{ fontSize: 28, marginBottom: 24 }}>Platform Settings</h2>
              <div style={{ display: 'grid', gap: 12, maxWidth: 600 }}>
                {[
                  ['Platform Name', 'Sanctuary Builder'],
                  ['Support Email', 'support@sanctuary.build'],
                  ['Trial Period', '14 days'],
                  ['Max Sites — Starter', '2'],
                  ['Max Sites — Church', '5'],
                  ['Max Sites — Ministry', '20'],
                  ['Max Members — Starter', '1'],
                  ['Max Members — Church', '5'],
                  ['Max Members — Ministry', '25'],
                ].map(([label, val]) => (
                  <div key={label} style={{ padding: '13px 16px', background: 'var(--bg3)', border: '1px solid var(--b1)', borderRadius: 9, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13 }}>{label}</span>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{ fontSize: 13, color: 'var(--tx3)', fontFamily: "'JetBrains Mono',monospace" }}>{val}</span>
                      <button className="btn btn-dk btn-sm" style={{ fontSize: 11, padding: '3px 9px' }}>Edit</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  )
}
