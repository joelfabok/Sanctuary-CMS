import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { PLANS } from '../data/constants'
import { Logo, Modal } from '../components/shared/UI'
import api from '../utils/api'

export default function Settings() {
  const { user, org, setUser, updateOrg, refreshOrg } = useAuth()
  const nav = useNavigate()
  const location = useLocation()
  const [tab, setTab]           = useState('profile')
  const [billingLoading, setBL] = useState('')
  const [profile, setP]    = useState({ name: user?.name || '', email: user?.email || '' })
  const [pwForm, setPW]    = useState({ current: '', newPw: '' })
  const [newMember, setNM] = useState({ email: '', role: 'editor' })
  const [editMember, setEM] = useState(null)
  const [editForm, setEF]   = useState({ name: '', email: '', orgRole: 'editor' })
  const [editSaving, setES] = useState(false)
  const [recoverySending, setRS] = useState(false)
  const [orgForm, setOF]   = useState({ name: org?.name || '', type: org?.type || 'Church', domain: org?.domain || '' })
  const [msg, setMsg]      = useState('')
  const plan = PLANS.find(p => p.id === org?.plan) || PLANS[1]

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 4000) }

  // Handle return from Stripe Checkout
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.get('billing') === 'success') {
      setTab('billing')
      refreshOrg().then(() => flash('Subscription activated ✓'))
      nav('/settings', { replace: true })
    } else if (params.get('billing') === 'cancelled') {
      setTab('billing')
      flash('Checkout cancelled.')
      nav('/settings', { replace: true })
    }
  }, [])

  const saveProfile = async () => {
    try {
      const r = await api.put('/users/profile', profile)
      setUser(prev => ({ ...prev, ...r.data.user }))
      flash('Profile saved ✓')
    } catch (e) { flash(e.response?.data?.message || 'Error') }
  }

  const changePw = async () => {
    try {
      await api.put('/auth/password', { currentPassword: pwForm.current, newPassword: pwForm.newPw })
      setPW({ current: '', newPw: '' })
      flash('Password updated ✓')
    } catch (e) { flash(e.response?.data?.message || 'Error') }
  }

  const inviteMember = async () => {
    try {
      const r = await api.post('/users/invite', newMember)
      updateOrg(r.data.org)
      setNM({ email: '', role: 'editor' })
      flash('Invitation sent ✓')
    } catch (e) { flash(e.response?.data?.message || 'Error') }
  }

  const removeMember = async (id) => {
    try {
      const r = await api.delete(`/users/member/${id}`)
      updateOrg(r.data.org)
    } catch (e) { alert(e.response?.data?.message) }
  }

  const openEditMember = (m) => {
    setEM(m)
    setEF({ name: m.name, email: m.email, orgRole: m.orgRole })
  }

  const saveEditMember = async () => {
    try {
      setES(true)
      const r = await api.put(`/users/member/${editMember._id}`, editForm)
      updateOrg(r.data.org)
      setEM(null)
      flash('Member updated \u2713')
    } catch (e) { flash(e.response?.data?.message || 'Error') }
    finally { setES(false) }
  }

  const sendRecovery = async () => {
    try {
      setRS(true)
      await api.post(`/users/member/${editMember._id}/recovery`)
      flash('Recovery email sent \u2713')
    } catch (e) { flash(e.response?.data?.message || 'Error') }
    finally { setRS(false) }
  }

  const saveOrg = async () => {
    try {
      const r = await api.put('/orgs/mine', orgForm)
      updateOrg(r.data)
      flash('Organization saved ✓')
    } catch (e) { flash(e.response?.data?.message || 'Error') }
  }

  const startCheckout = async (priceId) => {
    try {
      setBL(priceId)
      const r = await api.post('/billing/checkout', { priceId })
      window.location.href = r.data.url
    } catch (e) {
      flash(e.response?.data?.message || 'Billing error — check Stripe config')
      setBL('')
    }
  }

  const openPortal = async () => {
    try {
      setBL('portal')
      const r = await api.post('/billing/portal')
      window.location.href = r.data.url
    } catch (e) {
      flash(e.response?.data?.message || 'Could not open billing portal')
      setBL('')
    }
  }

  const TABS = [['profile','Profile'],['billing','Billing & Plan'],['team','Team Members'],['org','Organization']]

  return (
    <div style={{height:'100vh',display:'flex',flexDirection:'column',background:'var(--bg)'}}>
      <nav style={{height:52,background:'var(--bg2)',borderBottom:'1px solid var(--b1)',display:'flex',alignItems:'center',padding:'0 22px',gap:10,flexShrink:0}}>
        <button className="btn btn-gh btn-sm" onClick={() => nav('/dashboard')}>← Dashboard</button>
        <div style={{flex:1}} />
        <Logo size={22} />
        <span style={{fontSize:13,color:'var(--tx3)',marginLeft:8}}>Settings — {org?.name}</span>
        <div style={{flex:1}} />
      </nav>

      <div style={{flex:1,overflow:'auto',display:'flex'}}>
        {/* Sidebar */}
        <div style={{width:220,background:'var(--bg2)',borderRight:'1px solid var(--b1)',padding:'18px 10px',flexShrink:0}}>
          {TABS.map(([t,l]) => (
            <button key={t} onClick={() => setTab(t)}
              style={{display:'flex',alignItems:'center',gap:9,padding:'8px 12px',width:'100%',border:'none',borderRadius:7,background:tab===t?'var(--g4)':'transparent',color:tab===t?'var(--gold)':'var(--tx3)',fontSize:13,fontWeight:tab===t?600:400,cursor:'pointer',textAlign:'left',fontFamily:"'Instrument Sans',sans-serif",borderLeft:tab===t?'2px solid var(--gold)':'2px solid transparent',paddingLeft:tab===t?10:12,transition:'all .12s',marginBottom:2}}>
              {l}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{flex:1,padding:'30px 34px',overflow:'auto',maxWidth:680}}>
          {msg && <div style={{padding:'9px 14px',background:'rgba(74,222,128,.08)',border:'1px solid rgba(74,222,128,.18)',borderRadius:'var(--r)',color:'var(--green)',fontSize:13,marginBottom:18,cursor:'pointer'}} onClick={() => setMsg('')}>{msg}</div>}

          {tab==='profile' && <>
            <h2 style={{fontSize:26,marginBottom:24}}>Profile</h2>
            <div style={{display:'grid',gap:14,marginBottom:18}}>
              <div><label className="lbl">Full Name</label><input className="inp" value={profile.name} onChange={e => setP({...profile,name:e.target.value})} /></div>
              <div><label className="lbl">Email</label><input className="inp" value={profile.email} onChange={e => setP({...profile,email:e.target.value})} /></div>
            </div>
            <button className="btn btn-gold" onClick={saveProfile}>Save Changes</button>
            <div style={{height:1,background:'var(--b1)',margin:'28px 0'}} />
            <h3 style={{fontSize:18,marginBottom:16}}>Change Password</h3>
            <div style={{display:'grid',gap:14,marginBottom:14}}>
              <div><label className="lbl">Current Password</label><input className="inp" type="password" value={pwForm.current} onChange={e => setPW({...pwForm,current:e.target.value})} /></div>
              <div><label className="lbl">New Password</label><input className="inp" type="password" value={pwForm.newPw} onChange={e => setPW({...pwForm,newPw:e.target.value})} /></div>
            </div>
            <button className="btn btn-dk" onClick={changePw}>Update Password</button>
          </>}

          {tab==='billing' && <>  
            <h2 style={{fontSize:26,marginBottom:6}}>Billing & Plan</h2>
            <p style={{color:'var(--tx4)',fontSize:13,marginBottom:22}}>Subscriptions are processed securely by Stripe.</p>

            {/* Current subscription card */}
            <div style={{background:'var(--bg3)',border:'1px solid var(--b2)',borderRadius:14,padding:'22px',marginBottom:22}}>
              <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:14}}>
                <div>
                  <div style={{fontSize:11,fontWeight:700,color:'var(--tx4)',letterSpacing:'.06em',textTransform:'uppercase',marginBottom:5}}>{org?.plan?.toUpperCase()} PLAN</div>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:28,lineHeight:1}}>${plan.price}<span style={{fontSize:14,color:'var(--tx3)',fontWeight:400,fontFamily:"'Instrument Sans',sans-serif"}}>/mo</span></div>
                </div>
                <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:7}}>
                  <span className={org?.status==='active'?'badge badge-green':org?.status==='trialing'?'badge badge-gold':'badge badge-red'}>
                    {org?.status==='trialing'?'Trial':org?.status}
                  </span>
                  {org?.status==='trialing' && org?.billing?.trialEnds && (
                    <span style={{fontSize:11,color:'var(--tx4)'}}>Trial ends {new Date(org.billing.trialEnds).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
              <div style={{height:1,background:'var(--b1)',margin:'0 0 14px'}} />
              <div style={{display:'flex',gap:20,fontSize:12.5,color:'var(--tx3)',flexWrap:'wrap'}}>
                <span>Sites: <b style={{color:'var(--tx)'}}>{plan.sites}</b></span>
                <span>Members: <b style={{color:'var(--tx)'}}>{plan.members}</b></span>
                <span>Storage: <b style={{color:'var(--tx)'}}>{plan.storage}</b></span>
                {org?.billing?.nextBilling && <span>Next billing: <b style={{color:'var(--tx)'}}>{new Date(org.billing.nextBilling).toLocaleDateString()}</b></span>}
                {org?.billing?.card && <span>Card: <b style={{color:'var(--tx)'}}>{org.billing.card}</b></span>}
              </div>
              {org?.billing?.stripeCustomerId && (
                <div style={{marginTop:16}}>
                  <button className="btn btn-dk" onClick={openPortal} disabled={billingLoading==='portal'}
                    style={{fontSize:13}}>
                    {billingLoading==='portal'?'Opening…':'⚙ Manage Subscription — update card, cancel, view invoices'}
                  </button>
                </div>
              )}
            </div>

            {/* Plan comparison */}
            <div style={{fontSize:12,fontWeight:700,color:'var(--tx4)',letterSpacing:'.06em',textTransform:'uppercase',marginBottom:10}}>Available Plans</div>
            <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:22}}>
              {PLANS.map(p => {
                const isCurrent = org?.plan === p.id
                const priceEnvKey = `VITE_STRIPE_PRICE_${p.id.toUpperCase()}`
                const priceId = import.meta.env[priceEnvKey]
                return (
                  <div key={p.id} style={{padding:'16px 18px',background:isCurrent?'var(--g4)':'var(--bg4)',
                    border:`1px solid ${isCurrent?'rgba(212,168,67,.35)':'var(--b1)'}`,
                    borderRadius:10,display:'flex',justifyContent:'space-between',alignItems:'center',gap:14}}>
                    <div style={{flex:1}}>
                      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
                        <span style={{fontWeight:700,fontSize:14,color:isCurrent?'var(--gold)':'var(--tx)'}}>{p.name}</span>
                        {p.popular && !isCurrent && <span className="badge badge-gold" style={{fontSize:9}}>Popular</span>}
                        {isCurrent && <span className="badge badge-gold" style={{fontSize:9}}>Current</span>}
                        <span style={{marginLeft:'auto',fontFamily:"'Playfair Display',serif",fontSize:18,color:isCurrent?'var(--gold)':'var(--tx)'}}>${p.price}<span style={{fontSize:11,color:'var(--tx3)',fontFamily:"'Instrument Sans',sans-serif"}}>/mo</span></span>
                      </div>
                      <div style={{fontSize:11.5,color:'var(--tx4)'}}>{p.sites} sites · {p.members} members · {p.storage}</div>
                    </div>
                    {!isCurrent && (
                      <button
                        className="btn btn-gold btn-sm"
                        disabled={!!billingLoading || !priceId}
                        onClick={() => startCheckout(priceId)}
                        title={!priceId ? 'Add VITE_STRIPE_PRICE_'+p.id.toUpperCase()+' to client .env' : ''}
                        style={{flexShrink:0,minWidth:90,justifyContent:'center'}}>
                        {billingLoading===priceId ? 'Loading…'
                          : org?.billing?.stripeCustomerId ? 'Switch Plan'
                          : 'Subscribe'}
                      </button>
                    )}
                  </div>
                )
              })}
            </div>

            {/* No Stripe config notice */}
            {!import.meta.env.VITE_STRIPE_PRICE_STARTER && (
              <div style={{padding:'11px 14px',background:'rgba(251,191,36,.05)',border:'1px solid rgba(251,191,36,.15)',borderRadius:8,fontSize:12.5,color:'var(--tx3)'}}>
                <b style={{color:'var(--gold)'}}>Developer note:</b> Add <code style={{background:'var(--bg4)',padding:'1px 5px',borderRadius:3,fontSize:11}}>VITE_STRIPE_PRICE_*</code> vars to <code style={{background:'var(--bg4)',padding:'1px 5px',borderRadius:3,fontSize:11}}>client/.env</code> to enable checkout buttons.
              </div>
            )}
          </>}

          {tab==='team' && <>
            <h2 style={{fontSize:26,marginBottom:8}}>Team Members</h2>
            <p style={{color:'var(--tx3)',marginBottom:22,fontSize:13.5}}>Up to {plan.members} member{plan.members>1?'s':''} on your plan.</p>
            <div style={{background:'var(--bg3)',border:'1px solid var(--b1)',borderRadius:12,overflow:'hidden',marginBottom:18}}>
              {(org?.members||[]).map((m, i) => (
                <div key={m._id||i} style={{display:'flex',alignItems:'center',gap:12,padding:'13px 16px',borderBottom:i<(org.members.length-1)?'1px solid var(--b1)':'none'}}>
                  <div style={{width:34,height:34,borderRadius:'50%',background:'var(--g3)',border:'1px solid rgba(212,168,67,.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:600,color:'var(--gold2)',flexShrink:0}}>{m.avatar}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:500}}>{m.name}</div>
                    <div style={{fontSize:11.5,color:'var(--tx4)'}}>{m.email}</div>
                  </div>
                  <span className={m.orgRole==='owner'?'badge badge-gold':'badge badge-dim'} style={{fontSize:10}}>{m.orgRole}</span>
                  {m.orgRole!=='owner' && <button className="btn btn-dk btn-sm" onClick={() => openEditMember(m)}>Edit</button>}
                  {m.orgRole!=='owner' && <button className="btn btn-dng btn-sm" onClick={() => removeMember(m._id)}>Remove</button>}
                </div>
              ))}
            </div>
            <div style={{background:'var(--bg3)',border:'1px solid var(--b1)',borderRadius:12,padding:'16px'}}>
              <div style={{fontSize:13,fontWeight:600,marginBottom:10}}>Invite a member</div>
              <div style={{display:'flex',gap:8}}>
                <input className="inp" style={{flex:1}} placeholder="email@example.com" value={newMember.email} onChange={e => setNM({...newMember,email:e.target.value})} />
                <select className="sel-inp" style={{width:110}} value={newMember.role} onChange={e => setNM({...newMember,role:e.target.value})}>
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
                <button className="btn btn-gold" onClick={inviteMember} disabled={(org?.members?.length||0) >= plan.members}>Invite</button>
              </div>
              {(org?.members?.length||0) >= plan.members && <p style={{color:'var(--red)',fontSize:12,marginTop:8}}>Member limit reached. Upgrade to add more.</p>}
            </div>

            {/* Edit member modal */}
            {editMember && (
              <Modal title={`Edit — ${editMember.name}`} onClose={() => setEM(null)} width={440}>
                <div style={{display:'grid',gap:14,marginBottom:18}}>
                  <div><label className="lbl">Name</label><input className="inp" value={editForm.name} onChange={e => setEF({...editForm,name:e.target.value})} /></div>
                  <div><label className="lbl">Email</label><input className="inp" value={editForm.email} onChange={e => setEF({...editForm,email:e.target.value})} /></div>
                  <div><label className="lbl">Role</label>
                    <select className="sel-inp" value={editForm.orgRole} onChange={e => setEF({...editForm,orgRole:e.target.value})}>
                      <option value="editor">Editor</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  </div>
                </div>
                <div style={{display:'flex',gap:10,marginBottom:18}}>
                  <button className="btn btn-gold" style={{flex:1,justifyContent:'center'}} onClick={saveEditMember} disabled={editSaving}>{editSaving ? 'Saving…' : 'Save Changes'}</button>
                  <button className="btn btn-gh" style={{flex:1,justifyContent:'center'}} onClick={() => setEM(null)}>Cancel</button>
                </div>
                <div style={{height:1,background:'var(--b1)',margin:'0 0 18px'}} />
                <div style={{display:'flex',alignItems:'center',gap:12}}>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:600,marginBottom:3}}>Password Recovery</div>
                    <div style={{fontSize:11.5,color:'var(--tx4)',lineHeight:1.5}}>Reset their password and send a recovery email with temporary credentials.</div>
                  </div>
                  <button className="btn btn-dk" style={{flexShrink:0}} onClick={sendRecovery} disabled={recoverySending}>{recoverySending ? 'Sending…' : '🔑 Send Recovery Email'}</button>
                </div>
              </Modal>
            )}
          </>}

          {tab==='org' && <>
            <h2 style={{fontSize:26,marginBottom:24}}>Organization</h2>
            <div style={{display:'grid',gap:14,marginBottom:18}}>
              <div><label className="lbl">Organization Name</label><input className="inp" value={orgForm.name} onChange={e => setOF({...orgForm,name:e.target.value})} /></div>
              <div><label className="lbl">Type</label>
                <select className="sel-inp" value={orgForm.type} onChange={e => setOF({...orgForm,type:e.target.value})}>
                  {['Church','Ministry','Missionary','Nonprofit','Other'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div><label className="lbl">Primary Domain</label><input className="inp" value={orgForm.domain} onChange={e => setOF({...orgForm,domain:e.target.value})} placeholder="yourchurch.com" /></div>
            </div>
            <div style={{display:'flex',gap:10}}>
              <button className="btn btn-gold" onClick={saveOrg}>Save</button>
              <button className="btn btn-dng" style={{marginLeft:'auto'}}>Delete Organization</button>
            </div>
          </>}
        </div>
      </div>
    </div>
  )
}
