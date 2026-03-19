// ── Pricing ───────────────────────────────────────────────────────
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { PLANS } from '../data/constants'
import { Logo, Modal } from '../components/shared/UI'
import api from '../utils/api'

export function Pricing() {
  const nav = useNavigate()
  return (
    <div style={{height:'100vh',overflow:'auto',background:'var(--bg)'}}>
      <nav style={{height:54,background:'var(--bg2)',borderBottom:'1px solid var(--b1)',display:'flex',alignItems:'center',padding:'0 28px',gap:12}}>
        <button className="btn btn-gh btn-sm" onClick={()=>nav('/')}>← Back</button>
        <Logo size={24} />
        <div style={{flex:1}} />
        <button className="btn btn-gh btn-sm" onClick={()=>nav('/auth')}>Sign In</button>
      </nav>
      <div style={{maxWidth:960,margin:'0 auto',padding:'60px 28px'}}>
        <div style={{textAlign:'center',marginBottom:52}}>
          <div className="badge badge-gold" style={{marginBottom:16}}>Pricing</div>
          <h1 style={{fontSize:46,lineHeight:1.1,marginBottom:12}}>Simple, transparent pricing</h1>
          <p style={{color:'var(--tx3)',fontSize:15}}>Start with a 14-day free trial. No credit card required. Cancel anytime.</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:18,marginBottom:40}}>
          {PLANS.map(plan=>(
            <div key={plan.id} style={{background:'var(--bg3)',border:`2px solid ${plan.popular?'var(--gold)':'var(--b1)'}`,borderRadius:16,padding:'26px 22px',position:'relative',display:'flex',flexDirection:'column'}}>
              {plan.popular && <div style={{position:'absolute',top:-13,left:'50%',transform:'translateX(-50%)',background:'var(--gold)',color:'#1c0f00',padding:'3px 16px',borderRadius:20,fontSize:11,fontWeight:700,whiteSpace:'nowrap'}}>Most Popular</div>}
              <div style={{marginBottom:18}}>
                <div style={{fontSize:12,fontWeight:600,color:'var(--tx3)',letterSpacing:'.05em',textTransform:'uppercase',marginBottom:8}}>{plan.name}</div>
                <div style={{display:'flex',alignItems:'baseline',gap:4,marginBottom:4}}>
                  <span style={{fontFamily:"'Playfair Display',serif",fontSize:40,fontWeight:400}}>${plan.price}</span>
                  <span style={{fontSize:13,color:'var(--tx3)'}}>/ mo</span>
                </div>
                <div style={{fontSize:12,color:'var(--tx4)'}}>{plan.sites} sites · {plan.members} member{plan.members>1?'s':''} · {plan.storage}</div>
              </div>
              <div style={{flex:1,display:'flex',flexDirection:'column',gap:7,marginBottom:22}}>
                {plan.features.map(f=><div key={f} style={{display:'flex',alignItems:'flex-start',gap:8,fontSize:13,color:'var(--tx2)'}}><span style={{color:'var(--green)',marginTop:1,flexShrink:0}}>✓</span>{f}</div>)}
              </div>
              <button className={`btn ${plan.popular?'btn-gold':'btn-dk'}`} style={{width:'100%',justifyContent:'center',padding:'11px'}} onClick={()=>nav('/auth?mode=register')}>Start Free Trial</button>
            </div>
          ))}
        </div>
        <div style={{textAlign:'center',padding:'22px',background:'var(--bg3)',border:'1px solid var(--b1)',borderRadius:12}}>
          <div style={{fontSize:13.5,color:'var(--tx2)',marginBottom:6}}>All plans include SSL · 99.9% uptime · 14-day free trial · Cancel anytime</div>
          <div style={{fontSize:12,color:'var(--tx4)'}}>Nonprofit discount available — <span style={{color:'var(--gold)',cursor:'pointer'}}>contact us</span></div>
        </div>
      </div>
    </div>
  )
}

// ── Auth ──────────────────────────────────────────────────────────
export function AuthPage() {
  const [params] = useSearchParams()
  const [mode, setMode]   = useState(params.get('mode')==='register'?'register':'login')
  const [form, setForm]   = useState({ name:'', email:'', password:'', orgName:'', orgType:'Church' })
  const [err,  setErr]    = useState('')
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuth()
  const nav = useNavigate()

  const submit = async () => {
    setErr(''); setLoading(true)
    try {
      if (mode === 'login') {
        const d = await login(form.email, form.password)
        nav(d.user.role === 'admin' ? '/admin' : '/dashboard')
      } else {
        await register(form.name, form.email, form.password, form.orgName, form.orgType)
        nav('/dashboard')
      }
    } catch (e) {
      setErr(e.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{height:'100vh',display:'flex'}}>
      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:48,background:'var(--bg)'}}>
        <div style={{width:'100%',maxWidth:400}}>
          <button className="btn btn-gh btn-sm" onClick={()=>nav('/pricing')} style={{marginBottom:36,fontSize:12}}>← Back</button>
          <div style={{marginBottom:40}}><Logo size={30} /></div>
          <h1 style={{fontSize:34,fontWeight:400,marginBottom:6}}>{mode==='login'?'Welcome back.':'Create account.'}</h1>
          <p style={{color:'var(--tx3)',fontSize:13.5,marginBottom:32}}>{mode==='login'?'Sign in to your dashboard.':'Start your 14-day free trial.'}</p>
          {err && <div style={{padding:'10px 13px',background:'rgba(248,113,113,.08)',border:'1px solid rgba(248,113,113,.2)',borderRadius:'var(--r)',color:'var(--red)',fontSize:13,marginBottom:18}}>{err}</div>}
          <div style={{display:'flex',flexDirection:'column',gap:13}}>
            {mode==='register' && <>
              <div><label className="lbl">Your Name</label><input className="inp" placeholder="Pastor James" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
              <div><label className="lbl">Organization Name</label><input className="inp" placeholder="Grace Community Church" value={form.orgName} onChange={e=>setForm({...form,orgName:e.target.value})} /></div>
              <div><label className="lbl">Organization Type</label>
                <select className="sel-inp" value={form.orgType} onChange={e=>setForm({...form,orgType:e.target.value})}>
                  {['Church','Ministry','Missionary','Nonprofit','Other'].map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
            </>}
            <div><label className="lbl">Email</label><input className="inp" type="email" placeholder="you@yourchurch.org" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /></div>
            <div><label className="lbl">Password</label><input className="inp" type="password" placeholder="••••••••" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} onKeyDown={e=>e.key==='Enter'&&submit()} /></div>
          </div>
          <button className="btn btn-gold" style={{width:'100%',marginTop:22,padding:'12px',fontSize:15,justifyContent:'center'}} onClick={submit} disabled={loading}>{loading?'…':mode==='login'?'Sign In →':'Create Account →'}</button>
          <p style={{textAlign:'center',marginTop:18,fontSize:13,color:'var(--tx3)'}}>
            {mode==='login'?<>No account? <span style={{color:'var(--gold)',cursor:'pointer'}} onClick={()=>setMode('register')}>Sign up</span></>:<>Have an account? <span style={{color:'var(--gold)',cursor:'pointer'}} onClick={()=>setMode('login')}>Sign in</span></>}
          </p>
          {mode==='login' && (
            <div style={{marginTop:18,padding:'12px 14px',background:'var(--bg4)',border:'1px solid var(--b1)',borderRadius:'var(--r2)'}}>
              <div style={{fontSize:10.5,fontWeight:700,letterSpacing:'.06em',textTransform:'uppercase',color:'var(--tx4)',marginBottom:8}}>Demo Credentials</div>
              {[['User','pastor@gracechurch.org','demo123']/*['Admin','admin@sanctuary.build','admin123']*/].map(([r,e,p])=>(
                <button key={r} onClick={()=>setForm({...form,email:e,password:p})} style={{display:'flex',justifyContent:'space-between',width:'100%',padding:'7px 10px',background:'var(--bg5)',border:'1px solid var(--b1)',borderRadius:6,cursor:'pointer',fontFamily:'inherit',color:'var(--tx2)',fontSize:12,marginBottom:4}}>
                  <span style={{color:'var(--tx3)'}}>{r}:</span>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:'var(--gold)'}}>{e} / {p}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div style={{width:'44%',background:'var(--bg2)',borderLeft:'1px solid var(--b1)',display:'flex',flexDirection:'column',justifyContent:'center',padding:'60px 48px',position:'relative',overflow:'hidden'}}>
        <div style={{position:'relative'}}>
          <div style={{display:'flex',gap:1,marginBottom:18}}>{[1,2,3,4,5].map(s=><span key={s} style={{color:'var(--gold)',fontSize:16}}>★</span>)}</div>
          <p style={{fontFamily:"'Playfair Display',serif",fontSize:22,lineHeight:1.6,color:'var(--tx)',fontStyle:'italic',marginBottom:24}}>"We launched our church website in one evening. The templates are gorgeous and the editor is incredibly intuitive."</p>
          <div style={{display:'flex',alignItems:'center',gap:12,borderTop:'1px solid var(--b1)',paddingTop:20}}>
            <div style={{width:40,height:40,borderRadius:'50%',background:'var(--g3)',border:'1px solid rgba(212,168,67,.25)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:600,color:'var(--gold2)'}}>SR</div>
            <div><div style={{fontWeight:600,fontSize:13}}>Sister Mary Roberts</div><div style={{fontSize:12,color:'var(--tx4)'}}>St. Paul's Parish, Boston</div></div>
          </div>
          <div style={{marginTop:32,padding:'16px 18px',background:'var(--bg3)',borderRadius:12,border:'1px solid var(--b1)'}}>
            <div style={{fontSize:10.5,fontWeight:700,letterSpacing:'.07em',textTransform:'uppercase',color:'var(--tx4)',marginBottom:12}}>Available for</div>
            <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>{['Churches','Ministries','Missionaries','Nonprofits'].map(t=><span key={t} className="badge badge-dim" style={{fontSize:11}}>{t}</span>)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Dashboard ─────────────────────────────────────────────────────
export function Dashboard() {
  const { user, org } = useAuth()
  const nav = useNavigate()
  const [sites, setSites]         = useState([])
  const [showNew, setShowNew]     = useState(false)
  const [delId,  setDelId]        = useState(null)
  const [loading, setLoading]     = useState(true)
  const { logout } = useAuth()

  const plan = PLANS.find(p=>p.id===org?.plan) || PLANS[1]

  useState(()=>{
    api.get('/sites').then(r=>{ setSites(r.data); setLoading(false) }).catch(()=>setLoading(false))
  }, [])

  const createSite = async (tmpl) => {
    const { TEMPLATES, makeElement, PALETTES } = await import('../data/constants.jsx')
    const t = TEMPLATES.find(t=>t.id===tmpl.id) || TEMPLATES[0]
    try {
      const r = await api.post('/sites', { name: t.name+' Site', template: t.id, palette: t.palette, nav: t.nav, rows: t.rows })
      setSites(p=>[...p, r.data])
      setShowNew(false)
      nav(`/builder/${r.data._id}`)
    } catch (e) { alert(e.response?.data?.message || 'Error') }
  }

  const deleteSite = async (id) => {
    await api.delete(`/sites/${id}`)
    setSites(p=>p.filter(s=>s._id!==id))
    setDelId(null)
  }

  const togglePublish = async (site) => {
    const r = await api.put(`/sites/${site._id}`, { published: !site.published })
    setSites(p=>p.map(s=>s._id===site._id?r.data:s))
  }

  const greet = () => { const h=new Date().getHours(); return h<12?'morning':h<17?'afternoon':'evening' }

  return (
    <div style={{height:'100vh',display:'flex',flexDirection:'column',background:'var(--bg)'}}>
      <nav style={{height:54,background:'var(--bg2)',borderBottom:'1px solid var(--b1)',display:'flex',alignItems:'center',padding:'0 24px',gap:10,flexShrink:0}}>
        <Logo size={24} />
        <div style={{width:1,height:18,background:'var(--b1)',margin:'0 6px'}} />
        <span style={{fontSize:13,color:'var(--tx3)',fontWeight:500}}>{org?.name}</span>
        <span className="badge badge-gold" style={{fontSize:9}}>{plan.name} Plan</span>
        <div style={{flex:1}} />
        <button className="btn btn-gh btn-sm" onClick={()=>nav('/settings')}>⚙ Settings</button>
        <div style={{display:'flex',alignItems:'center',gap:8,padding:'4px 10px',background:'var(--bg4)',border:'1px solid var(--b1)',borderRadius:7,cursor:'pointer'}} onClick={()=>nav('/settings')}>
          <div style={{width:24,height:24,borderRadius:'50%',background:'var(--g3)',border:'1px solid rgba(212,168,67,.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700,color:'var(--gold2)'}}>{user?.avatar}</div>
          <span style={{fontSize:12.5,color:'var(--tx2)'}}>{user?.name?.split(' ')[0]}</span>
        </div>
        <button className="btn btn-gh btn-sm" onClick={()=>{logout();nav('/')}}>Sign Out</button>
      </nav>

      <div style={{flex:1,overflow:'auto',padding:'34px 28px',maxWidth:1160,width:'100%',margin:'0 auto',boxSizing:'border-box'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:28}} className="a1">
          <div>
            <h1 style={{fontSize:32,fontWeight:400,marginBottom:3}}>Good {greet()}, {user?.name?.split(' ')[1]||user?.name}.</h1>
            <p style={{color:'var(--tx3)',fontSize:13.5}}>Manage your {org?.type?.toLowerCase()||'organization'}'s websites.</p>
          </div>
          <button className="btn btn-gold" onClick={()=>setShowNew(true)} disabled={sites.length>=plan.sites}>+ New Website</button>
        </div>

        {/* Stats */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:28}} className="a2">
          {[[sites.length,'Sites Created','⊞','var(--gold)'],[sites.filter(s=>s.published).length,'Live Sites','◎','var(--green)'],[sites.filter(s=>!s.published).length,'Drafts','◈','var(--tx3)'],[plan.sites-sites.length,'Slots Remaining','◷','var(--blue)']].map(([v,l,ic,c])=>(
            <div key={l} style={{background:'var(--bg3)',border:'1px solid var(--b1)',borderRadius:12,padding:'17px 18px'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:9}}><span style={{fontSize:11,fontWeight:600,letterSpacing:'.06em',textTransform:'uppercase',color:'var(--tx4)'}}>{l}</span><span style={{color:c,fontSize:14}}>{ic}</span></div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:32,fontWeight:400,color:c,lineHeight:1}}>{v}</div>
            </div>
          ))}
        </div>

        {/* Site cards */}
        {loading ? <div style={{color:'var(--tx3)',textAlign:'center',padding:40}}>Loading sites…</div> : (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(288px,1fr))',gap:16}} className="a3">
            {sites.map(site => {
              const { TEMPLATES } = require('../data/constants.jsx') // simple ref
              const tmpl = TEMPLATES?.find?.(t=>t.id===site.template) || { thumb:['#0f0e0c','#d4a843','#faf8f5'], category:'Church', style:'Classic' }
              return (
                <div key={site._id} style={{background:'var(--bg3)',border:'1px solid var(--b1)',borderRadius:14,overflow:'hidden',transition:'all .2s'}} onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--b2)';e.currentTarget.style.transform='translateY(-2px)'}} onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--b1)';e.currentTarget.style.transform=''}}>
                  <div style={{height:130,background:tmpl.thumb[0],position:'relative',overflow:'hidden'}}>
                    <div style={{position:'absolute',inset:0,background:`radial-gradient(ellipse 80% 60% at 30% 40%,${tmpl.thumb[1]}22,transparent)`}} />
                    <div style={{position:'absolute',top:10,left:12}}><span className="badge" style={{background:site.published?'rgba(74,222,128,.12)':'rgba(255,255,255,.08)',color:site.published?'var(--green)':'var(--tx3)',border:`1px solid ${site.published?'rgba(74,222,128,.2)':'var(--b1)'}`,fontSize:10}}>{site.published?'● Live':'○ Draft'}</span></div>
                    <div style={{position:'absolute',bottom:0,left:0,right:0,height:44,background:'linear-gradient(transparent,rgba(0,0,0,.5))'}} />
                    <div style={{position:'absolute',bottom:9,left:14,fontFamily:"'Playfair Display',serif",fontSize:15,color:'rgba(255,255,255,.9)'}}>{site.name}</div>
                  </div>
                  <div style={{padding:'11px 14px'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                      <span style={{fontSize:11.5,color:'var(--tx4)'}}>{tmpl.category} · {new Date(site.updatedAt).toLocaleDateString()}</span>
                      {site.visits>0 && <span style={{fontSize:11.5,color:'var(--blue)'}}>◷ {site.visits}</span>}
                    </div>
                    <div style={{display:'flex',gap:7}}>
                      <button className="btn btn-gold btn-sm" style={{flex:1,justifyContent:'center'}} onClick={()=>nav(`/builder/${site._id}`)}>Edit</button>
                      <button className="btn btn-gh btn-sm" style={{padding:'5px 9px',color:'var(--blue)',borderColor:'rgba(91,156,246,.2)'}} onClick={()=>togglePublish(site)}>{site.published?'Unpublish':'Publish'}</button>
                      <button className="btn btn-gh btn-sm" style={{padding:'5px 9px',color:'var(--red)',borderColor:'rgba(248,113,113,.2)'}} onClick={()=>setDelId(site._id)}>✕</button>
                    </div>
                  </div>
                </div>
              )
            })}
            {sites.length < plan.sites && (
              <div onClick={()=>setShowNew(true)} style={{border:'2px dashed var(--b1)',borderRadius:14,cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:40,gap:10,minHeight:220,transition:'all .18s'}} onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--gold)';e.currentTarget.style.background='var(--g4)'}} onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--b1)';e.currentTarget.style.background='transparent'}}>
                <div style={{width:46,height:46,borderRadius:12,background:'var(--bg4)',border:'1px solid var(--b1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,color:'var(--tx4)'}}>+</div>
                <div style={{fontWeight:500,fontSize:13.5}}>New Website</div>
                <div style={{fontSize:12,color:'var(--tx4)',textAlign:'center'}}>Choose a template</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete confirm */}
      {delId && <Modal title="Delete this site?" onClose={()=>setDelId(null)} width={380}>
        <p style={{color:'var(--tx3)',fontSize:13.5,marginBottom:22}}>This cannot be undone. All pages and content will be permanently removed.</p>
        <div style={{display:'flex',gap:10}}>
          <button className="btn btn-dng" style={{flex:1,justifyContent:'center',padding:10}} onClick={()=>deleteSite(delId)}>Delete</button>
          <button className="btn btn-gh"  style={{flex:1,justifyContent:'center',padding:10}} onClick={()=>setDelId(null)}>Cancel</button>
        </div>
      </Modal>}

      {/* New site */}
      {showNew && <div style={{position:'fixed',inset:0,zIndex:500,background:'rgba(0,0,0,.75)',backdropFilter:'blur(4px)',display:'flex',alignItems:'flex-start',justifyContent:'center',overflowY:'auto',padding:'36px 20px'}} onClick={()=>setShowNew(false)}>
        <div style={{background:'var(--bg2)',border:'1px solid var(--b2)',borderRadius:20,padding:'32px 28px',width:'100%',maxWidth:880,boxShadow:'0 32px 80px rgba(0,0,0,.7)',animation:'popIn .2s ease'}} onClick={e=>e.stopPropagation()}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24}}>
            <div><h2 style={{fontSize:28,fontWeight:400,marginBottom:3}}>Choose a Template</h2><p style={{color:'var(--tx3)',fontSize:13}}>Pick one to start building immediately.</p></div>
            <button className="btn-ic" onClick={()=>setShowNew(false)} style={{fontSize:16}}>✕</button>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(230px,1fr))',gap:14}}>
            {TEMPLATES.map(t=>(
              <div key={t.id} style={{background:'var(--bg3)',border:'1px solid var(--b1)',borderRadius:12,overflow:'hidden',cursor:'pointer',transition:'all .18s'}} onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--b2)';e.currentTarget.style.transform='translateY(-2px)'}} onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--b1)';e.currentTarget.style.transform=''}}>
                <div style={{height:100,background:t.thumb[0],position:'relative',overflow:'hidden'}}>
                  <div style={{position:'absolute',top:7,left:9}}><span className="badge" style={{background:'rgba(255,255,255,.12)',color:'rgba(255,255,255,.8)',fontSize:9.5}}>{t.category}</span></div>
                  <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center'}}><div style={{fontFamily:"'Playfair Display',serif",fontSize:15,color:'rgba(255,255,255,.9)'}}>{t.name}</div></div>
                </div>
                <div style={{padding:'11px 13px'}}>
                  <p style={{color:'var(--tx3)',fontSize:11.5,lineHeight:1.6,marginBottom:10}}>{t.desc}</p>
                  <button className="btn btn-gold btn-sm" style={{width:'100%',justifyContent:'center',fontSize:11}} onClick={()=>createSite(t)}>Use This Template →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>}
    </div>
  )
}

// ── Settings ──────────────────────────────────────────────────────
export function Settings() {
  const { user, org, logout, setUser, updateOrg, refreshOrg } = useAuth()
  const nav = useNavigate()
  const [tab, setTab]       = useState('profile')
  const [profile, setP]     = useState({ name:user?.name||'', email:user?.email||'' })
  const [pwForm, setPW]     = useState({ current:'', newPw:'' })
  const [newMember, setNM]  = useState({ email:'', role:'editor' })
  const [orgForm, setOF]    = useState({ name:org?.name||'', type:org?.type||'Church', domain:org?.domain||'' })
  const [msg, setMsg]       = useState('')
  const plan = PLANS.find(p=>p.id===org?.plan) || PLANS[1]

  const saveProfile = async () => {
    const r = await api.put('/users/profile', profile)
    setUser(prev=>({...prev,...r.data.user}))
    setMsg('Profile saved')
  }
  const changePw = async () => {
    await api.put('/auth/password', { currentPassword:pwForm.current, newPassword:pwForm.newPw })
    setPW({current:'',newPw:''})
    setMsg('Password updated')
  }
  const inviteMember = async () => {
    const r = await api.post('/users/invite', newMember)
    updateOrg(r.data.org)
    setNM({email:'',role:'editor'})
  }
  const removeMember = async (id) => {
    const r = await api.delete(`/users/member/${id}`)
    updateOrg(r.data.org)
  }
  const saveOrg = async () => {
    const r = await api.put('/orgs/mine', orgForm)
    updateOrg(r.data)
    setMsg('Organization saved')
  }

  const TABS = [['profile','Profile'],['billing','Billing & Plan'],['team','Team Members'],['org','Organization']]

  return (
    <div style={{height:'100vh',display:'flex',flexDirection:'column',background:'var(--bg)'}}>
      <nav style={{height:52,background:'var(--bg2)',borderBottom:'1px solid var(--b1)',display:'flex',alignItems:'center',padding:'0 22px',gap:10,flexShrink:0}}>
        <button className="btn btn-gh btn-sm" onClick={()=>nav('/dashboard')}>← Dashboard</button>
        <div style={{flex:1}} /><span style={{fontSize:13,color:'var(--tx3)'}}>Settings — {org?.name}</span><div style={{flex:1}} />
      </nav>
      <div style={{flex:1,overflow:'auto',display:'flex'}}>
        <div style={{width:220,background:'var(--bg2)',borderRight:'1px solid var(--b1)',padding:'18px 10px',flexShrink:0}}>
          {TABS.map(([t,l])=>(
            <button key={t} onClick={()=>setTab(t)} style={{display:'flex',alignItems:'center',gap:9,padding:'8px 12px',width:'100%',border:'none',borderRadius:7,background:tab===t?'var(--g4)':'transparent',color:tab===t?'var(--gold)':'var(--tx3)',fontSize:13,fontWeight:tab===t?600:400,cursor:'pointer',textAlign:'left',fontFamily:"'Instrument Sans',sans-serif",borderLeft:tab===t?'2px solid var(--gold)':'2px solid transparent',paddingLeft:tab===t?10:12,transition:'all .12s',marginBottom:2}}>{l}</button>
          ))}
        </div>
        <div style={{flex:1,padding:'30px 34px',overflow:'auto',maxWidth:680}}>
          {msg && <div style={{padding:'9px 14px',background:'rgba(74,222,128,.08)',border:'1px solid rgba(74,222,128,.18)',borderRadius:'var(--r)',color:'var(--green)',fontSize:13,marginBottom:18}} onClick={()=>setMsg('')}>{msg}</div>}

          {tab==='profile' && <>
            <h2 style={{fontSize:26,marginBottom:24}}>Profile</h2>
            <div style={{display:'grid',gap:14}}>
              <div><label className="lbl">Full Name</label><input className="inp" value={profile.name} onChange={e=>setP({...profile,name:e.target.value})} /></div>
              <div><label className="lbl">Email</label><input className="inp" value={profile.email} onChange={e=>setP({...profile,email:e.target.value})} /></div>
            </div>
            <button className="btn btn-gold" style={{marginTop:18}} onClick={saveProfile}>Save Changes</button>
            <div style={{height:1,background:'var(--b1)',margin:'28px 0'}} />
            <h3 style={{fontSize:18,marginBottom:16}}>Change Password</h3>
            <div style={{display:'grid',gap:14}}>
              <div><label className="lbl">Current Password</label><input className="inp" type="password" value={pwForm.current} onChange={e=>setPW({...pwForm,current:e.target.value})} /></div>
              <div><label className="lbl">New Password</label><input className="inp" type="password" value={pwForm.newPw} onChange={e=>setPW({...pwForm,newPw:e.target.value})} /></div>
            </div>
            <button className="btn btn-dk" style={{marginTop:14}} onClick={changePw}>Update Password</button>
          </>}

          {tab==='billing' && <>
            <h2 style={{fontSize:26,marginBottom:24}}>Billing & Plan</h2>
            <div style={{background:'var(--bg3)',border:'1px solid var(--b2)',borderRadius:14,padding:'22px',marginBottom:18}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
                <div>
                  <div style={{fontSize:12,fontWeight:600,color:'var(--tx3)',letterSpacing:'.05em',textTransform:'uppercase',marginBottom:5}}>{org?.plan?.toUpperCase()} PLAN</div>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:26}}>${plan.price}/mo</div>
                </div>
                <span className={org?.status==='active'?'badge badge-green':'badge badge-red'}>{org?.status}</span>
              </div>
              <div style={{height:1,background:'var(--b1)',margin:'14px 0'}} />
              <div style={{display:'flex',gap:20,fontSize:13,color:'var(--tx3)'}}>
                <span>Next billing: {org?.billing?.nextBilling ? new Date(org.billing.nextBilling).toLocaleDateString() : '—'}</span>
                <span>Card: {org?.billing?.card || '—'}</span>
              </div>
            </div>
            <div style={{display:'flex',gap:10}}>
              <button className="btn btn-dk">Upgrade Plan</button>
              <button className="btn btn-gh">Update Card</button>
              <button className="btn btn-dng">Cancel Subscription</button>
            </div>
          </>}

          {tab==='team' && <>
            <h2 style={{fontSize:26,marginBottom:8}}>Team Members</h2>
            <p style={{color:'var(--tx3)',marginBottom:22,fontSize:13.5}}>Up to {plan.members} member{plan.members>1?'s':''} on your plan.</p>
            <div style={{background:'var(--bg3)',border:'1px solid var(--b1)',borderRadius:12,overflow:'hidden',marginBottom:18}}>
              {(org?.members||[]).map((m,i)=>(
                <div key={m._id||i} style={{display:'flex',alignItems:'center',gap:12,padding:'13px 16px',borderBottom:i<(org.members.length-1)?'1px solid var(--b1)':'none'}}>
                  <div style={{width:34,height:34,borderRadius:'50%',background:'var(--g3)',border:'1px solid rgba(212,168,67,.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:600,color:'var(--gold2)',flexShrink:0}}>{m.avatar}</div>
                  <div style={{flex:1}}><div style={{fontSize:13,fontWeight:500}}>{m.name}</div><div style={{fontSize:11.5,color:'var(--tx4)'}}>{m.email}</div></div>
                  <span className={m.orgRole==='owner'?'badge badge-gold':'badge badge-dim'} style={{fontSize:10}}>{m.orgRole}</span>
                  {m.orgRole!=='owner' && <button className="btn btn-dng btn-sm" onClick={()=>removeMember(m._id)}>Remove</button>}
                </div>
              ))}
            </div>
            <div style={{background:'var(--bg3)',border:'1px solid var(--b1)',borderRadius:12,padding:'16px'}}>
              <div style={{fontSize:13,fontWeight:600,marginBottom:10}}>Invite a member</div>
              <div style={{display:'flex',gap:8}}>
                <input className="inp" style={{flex:1}} placeholder="email@example.com" value={newMember.email} onChange={e=>setNM({...newMember,email:e.target.value})} />
                <select className="sel-inp" style={{width:110}} value={newMember.role} onChange={e=>setNM({...newMember,role:e.target.value})}><option value="editor">Editor</option><option value="viewer">Viewer</option></select>
                <button className="btn btn-gold" onClick={inviteMember} disabled={(org?.members?.length||0)>=plan.members}>Invite</button>
              </div>
            </div>
          </>}

          {tab==='org' && <>
            <h2 style={{fontSize:26,marginBottom:24}}>Organization</h2>
            <div style={{display:'grid',gap:14}}>
              <div><label className="lbl">Organization Name</label><input className="inp" value={orgForm.name} onChange={e=>setOF({...orgForm,name:e.target.value})} /></div>
              <div><label className="lbl">Type</label>
                <select className="sel-inp" value={orgForm.type} onChange={e=>setOF({...orgForm,type:e.target.value})}>
                  {['Church','Ministry','Missionary','Nonprofit','Other'].map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div><label className="lbl">Primary Domain</label><input className="inp" value={orgForm.domain} onChange={e=>setOF({...orgForm,domain:e.target.value})} placeholder="yourchurch.com" /></div>
            </div>
            <div style={{marginTop:18,display:'flex',gap:10}}>
              <button className="btn btn-gold" onClick={saveOrg}>Save</button>
              <button className="btn btn-dng" style={{marginLeft:'auto'}}>Delete Organization</button>
            </div>
          </>}
        </div>
      </div>
    </div>
  )
}

// Named re-exports
import { TEMPLATES } from '../data/constants'
export default AuthPage
