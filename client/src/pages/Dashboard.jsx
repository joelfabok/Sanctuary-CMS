import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { PLANS, TEMPLATES } from '../data/constants'
import { Logo, Modal } from '../components/shared/UI'
import api from '../utils/api'

export default function Dashboard() {
  const { user, org, logout } = useAuth()
  const nav = useNavigate()
  const [sites, setSites]     = useState([])
  const [showNew, setShowNew] = useState(false)
  const [delId, setDelId]     = useState(null)
  const [siteInfo, setSiteInfo] = useState(null)
  const [infoDomain, setInfoDomain] = useState('')
  const [infoSaving, setInfoSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const plan = PLANS.find(p => p.id === org?.plan) || PLANS[1]

  useEffect(() => {
    api.get('/sites').then(r => { setSites(r.data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const createSite = async (tmpl) => {
    try {
      const r = await api.post('/sites', { name: tmpl.name + ' Site', template: tmpl.id, palette: tmpl.palette, nav: tmpl.nav, pages: tmpl.pages, rows: tmpl.rows })
      setSites(p => [...p, r.data])
      setShowNew(false)
      nav(`/builder/${r.data._id}`)
    } catch (e) { alert(e.response?.data?.message || 'Error creating site') }
  }

  const deleteSite = async (id) => {
    await api.delete(`/sites/${id}`)
    setSites(p => p.filter(s => s._id !== id))
    setDelId(null)
  }

  const togglePublish = async (site) => {
    const r = await api.put(`/sites/${site._id}`, { published: !site.published })
    setSites(p => p.map(s => s._id === site._id ? r.data : s))
  }

  const openSiteInfo = (site) => {
    setSiteInfo(site)
    setInfoDomain(site.customDomain || '')
  }

  const saveDomain = async () => {
    try {
      setInfoSaving(true)
      const r = await api.put(`/sites/${siteInfo._id}`, { customDomain: infoDomain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/+$/, '') })
      setSites(p => p.map(s => s._id === r.data._id ? r.data : s))
      setSiteInfo(r.data)
    } catch (e) { alert(e.response?.data?.message || 'Error saving') }
    finally { setInfoSaving(false) }
  }

  const greet = () => { const h = new Date().getHours(); return h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening' }


  // Mobile nav state
  const [navOpen, setNavOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 900)
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 900)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  return (
    <div style={{height:'100vh',display:'flex',flexDirection:'column',background:'var(--bg)'}}>
      {/* Topnav - Responsive */}
      <nav style={{background:'var(--bg2)',borderBottom:'1px solid var(--b1)',position:'sticky',top:0,zIndex:100}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',height:54,padding:'0 16px',gap:8}}>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <Logo size={24} />
            <div style={{width:1,height:18,background:'var(--b1)',margin:'0 6px'}} />
            {!isMobile && <span style={{fontSize:13,color:'var(--tx3)',fontWeight:500}}>{org?.name}</span>}
            {!isMobile && <span className="badge badge-gold" style={{fontSize:9}}>{plan.name} Plan</span>}
          </div>
          {isMobile ? (
            <button
              aria-label={navOpen ? 'Close menu' : 'Open menu'}
              onClick={()=>setNavOpen(o=>!o)}
              style={{background:'none',border:'none',color:'var(--tx3)',fontSize:28,cursor:'pointer',padding:6,display:'flex',alignItems:'center'}}>
              {navOpen ? '✕' : '☰'}
            </button>
          ) : (
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <button className="btn btn-gh btn-sm" onClick={() => nav('/settings')}>⚙ Settings</button>
              <div style={{display:'flex',alignItems:'center',gap:8,padding:'4px 10px',background:'var(--bg4)',border:'1px solid var(--b1)',borderRadius:7,cursor:'pointer'}} onClick={() => nav('/settings')}>
                <div style={{width:24,height:24,borderRadius:'50%',background:'var(--g3)',border:'1px solid rgba(212,168,67,.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700,color:'var(--gold2)'}}>{user?.avatar}</div>
                <span style={{fontSize:12.5,color:'var(--tx2)'}}>{user?.name?.split(' ')[0]}</span>
              </div>
              <button className="btn btn-gh btn-sm" onClick={() => { logout(); nav('/') }}>Sign Out</button>
            </div>
          )}
        </div>
        {/* Mobile dropdown */}
        {isMobile && navOpen && (
          <div style={{background:'rgba(11,11,13,.98)',borderBottom:'1px solid var(--b1)',boxShadow:'0 8px 32px rgba(0,0,0,.22)',position:'absolute',top:54,left:0,right:0,zIndex:101,animation:'popIn .13s',display:'flex',flexDirection:'column'}}>
            <span style={{padding:'16px 24px',fontSize:15,color:'var(--tx2)',borderBottom:'1px solid var(--b1)'}}>{org?.name}</span>
            <span style={{padding:'12px 24px',fontSize:12,color:'var(--gold)',borderBottom:'1px solid var(--b1)'}}>{plan.name} Plan</span>
            <button className="btn btn-gh btn-sm" style={{margin:'16px 24px 8px'}} onClick={()=>{setNavOpen(false);nav('/settings')}}>⚙ Settings</button>
            <div style={{display:'flex',alignItems:'center',gap:8,padding:'4px 24px',background:'var(--bg4)',border:'1px solid var(--b1)',borderRadius:7,margin:'0 24px 12px',cursor:'pointer'}} onClick={()=>{setNavOpen(false);nav('/settings')}}>
              <div style={{width:24,height:24,borderRadius:'50%',background:'var(--g3)',border:'1px solid rgba(212,168,67,.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700,color:'var(--gold2)'}}>{user?.avatar}</div>
              <span style={{fontSize:12.5,color:'var(--tx2)'}}>{user?.name?.split(' ')[0]}</span>
            </div>
            <button className="btn btn-gh btn-sm" style={{margin:'0 24px 16px'}} onClick={()=>{setNavOpen(false);logout();nav('/')}}>Sign Out</button>
          </div>
        )}
      </nav>

      <div style={{flex:1,overflow:'auto',padding:'34px 28px',maxWidth:1160,width:'100%',margin:'0 auto',boxSizing:'border-box'}}>
        {/* Header */}
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:28}} className="a1">
          <div>
            <h1 style={{fontSize:32,fontWeight:400,marginBottom:3}}>Good {greet()}, {user?.name?.split(' ')[1] || user?.name}.</h1>
            <p style={{color:'var(--tx3)',fontSize:13.5}}>Manage your {org?.type?.toLowerCase() || 'organization'}'s websites.</p>
          </div>
          <button className="btn btn-gold" onClick={() => setShowNew(true)} disabled={sites.length >= plan.sites}>+ New Website</button>
        </div>

        {/* Stats */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:28}} className="a2">
          {[
            [sites.length, 'Sites Created', '⊞', 'var(--gold)'],
            [sites.filter(s => s.published).length, 'Live Sites', '◎', 'var(--green)'],
            [sites.filter(s => !s.published).length, 'Drafts', '◈', 'var(--tx3)'],
            [plan.sites - sites.length, 'Slots Remaining', '◷', 'var(--blue)'],
          ].map(([v, l, ic, c]) => (
            <div key={l} style={{background:'var(--bg3)',border:'1px solid var(--b1)',borderRadius:12,padding:'17px 18px'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:9}}>
                <span style={{fontSize:11,fontWeight:600,letterSpacing:'.06em',textTransform:'uppercase',color:'var(--tx4)'}}>{l}</span>
                <span style={{color:c,fontSize:14}}>{ic}</span>
              </div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:32,fontWeight:400,color:c,lineHeight:1}}>{v}</div>
            </div>
          ))}
        </div>

        {/* Site grid */}
        {loading ? <div style={{color:'var(--tx3)',textAlign:'center',padding:40}}>Loading…</div> : (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(288px,1fr))',gap:16}} className="a3">
            {sites.map(site => {
              const tmpl = TEMPLATES.find(t => t.id === site.template) || TEMPLATES[0]
              return (
                <div key={site._id} style={{background:'var(--bg3)',border:'1px solid var(--b1)',borderRadius:14,overflow:'hidden',transition:'all .2s'}}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--b2)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--b1)'; e.currentTarget.style.transform = '' }}>
                  <div style={{height:130,background:tmpl.thumb[0],position:'relative',overflow:'hidden'}}>
                    <div style={{position:'absolute',inset:0,background:`radial-gradient(ellipse 80% 60% at 30% 40%,${tmpl.thumb[1]}22,transparent)`}} />
                    <div style={{position:'absolute',top:10,left:12}}>
                      <span className="badge" style={{background:site.published?'rgba(74,222,128,.12)':'rgba(255,255,255,.08)',color:site.published?'var(--green)':'var(--tx3)',border:`1px solid ${site.published?'rgba(74,222,128,.2)':'var(--b1)'}`,fontSize:10}}>{site.published ? '● Live' : '○ Draft'}</span>
                    </div>
                    <div style={{position:'absolute',bottom:0,left:0,right:0,height:44,background:'linear-gradient(transparent,rgba(0,0,0,.5))'}} />
                    <div style={{position:'absolute',bottom:9,left:14,fontFamily:"'Playfair Display',serif",fontSize:15,color:'rgba(255,255,255,.9)'}}>{site.name}</div>
                  </div>
                  <div style={{padding:'11px 14px'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                      <span style={{fontSize:11.5,color:'var(--tx4)'}}>{tmpl.category} · {new Date(site.updatedAt).toLocaleDateString()}</span>
                      {site.visits > 0 && <span style={{fontSize:11.5,color:'var(--blue)'}}>◷ {site.visits}</span>}
                    </div>
                    <div style={{display:'flex',gap:7}}>
                      <button className="btn btn-gold btn-sm" style={{flex:1,justifyContent:'center'}} onClick={() => nav(`/builder/${site._id}`)}>Edit</button>
                      <button className="btn btn-dk btn-sm" style={{padding:'5px 9px'}} onClick={() => openSiteInfo(site)} title="Site Info">⊙</button>
                      <button className="btn btn-gh btn-sm" style={{padding:'5px 9px',color:'var(--blue)',borderColor:'rgba(91,156,246,.2)'}} onClick={() => togglePublish(site)}>{site.published ? 'Unpublish' : 'Publish'}</button>
                      <button className="btn btn-gh btn-sm" style={{padding:'5px 9px',color:'var(--red)',borderColor:'rgba(248,113,113,.2)'}} onClick={() => setDelId(site._id)}>✕</button>
                    </div>
                  </div>
                </div>
              )
            })}
            {sites.length < plan.sites && (
              <div onClick={() => setShowNew(true)}
                style={{border:'2px dashed var(--b1)',borderRadius:14,cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:40,gap:10,minHeight:220,transition:'all .18s'}}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.background = 'var(--g4)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--b1)'; e.currentTarget.style.background = 'transparent' }}>
                <div style={{width:46,height:46,borderRadius:12,background:'var(--bg4)',border:'1px solid var(--b1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,color:'var(--tx4)'}}>+</div>
                <div style={{fontWeight:500,fontSize:13.5}}>New Website</div>
                <div style={{fontSize:12,color:'var(--tx4)',textAlign:'center'}}>Choose a template</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete confirm modal */}
      {delId && (
        <Modal title="Delete this site?" onClose={() => setDelId(null)} width={380}>
          <p style={{color:'var(--tx3)',fontSize:13.5,marginBottom:22}}>This action cannot be undone. All content will be permanently removed.</p>
          <div style={{display:'flex',gap:10}}>
            <button className="btn btn-dng" style={{flex:1,justifyContent:'center',padding:10}} onClick={() => deleteSite(delId)}>Delete</button>
            <button className="btn btn-gh"  style={{flex:1,justifyContent:'center',padding:10}} onClick={() => setDelId(null)}>Cancel</button>
          </div>
        </Modal>
      )}

      {/* Site info / custom domain modal */}
      {siteInfo && (
        <Modal title="Site Info" onClose={() => setSiteInfo(null)} width={window.innerWidth < 600 ? '98vw' : 520}>
          <div style={{marginBottom:18}}>
            <div style={{fontSize:15,fontWeight:600,marginBottom:4,wordBreak:'break-word'}}>{siteInfo.name}</div>
            <span className="badge" style={{background:siteInfo.published?'rgba(74,222,128,.12)':'rgba(255,255,255,.08)',color:siteInfo.published?'var(--green)':'var(--tx3)',border:`1px solid ${siteInfo.published?'rgba(74,222,128,.2)':'var(--b1)'}`,fontSize:10}}>{siteInfo.published ? '● Live' : '○ Draft'}</span>
          </div>

          {/* Default URL */}
          <div style={{marginBottom:18}}>
            <div style={{fontSize:10.5,fontWeight:700,letterSpacing:'.07em',textTransform:'uppercase',color:'var(--tx4)',marginBottom:6}}>Default URL</div>
            <div style={{padding:'10px 6px',background:'var(--bg4)',border:'1px solid var(--b1)',borderRadius:8,fontFamily:"'JetBrains Mono',monospace",fontSize:12.5,color:'var(--tx2)',display:'flex',flexDirection:window.innerWidth<500?'column':'row',alignItems:window.innerWidth<500?'stretch':'center',justifyContent:'space-between',gap:window.innerWidth<500?8:0}}>
              <span style={{wordBreak:'break-all'}}>{window.location.origin}/site/{siteInfo._id}</span>
              <button className="btn btn-dk btn-sm" style={{fontSize:10,padding:'3px 8px',flexShrink:0}} onClick={() => {navigator.clipboard.writeText(`${window.location.origin}/site/${siteInfo._id}`)}}>Copy</button>
            </div>
          </div>

          {/* Custom Domain */}
          <div style={{marginBottom:18}}>
            <div style={{fontSize:10.5,fontWeight:700,letterSpacing:'.07em',textTransform:'uppercase',color:'var(--tx4)',marginBottom:6}}>Custom Domain</div>
            <div style={{display:'flex',flexDirection:window.innerWidth<500?'column':'row',gap:8}}>
              <input
                value={infoDomain} onChange={e => setInfoDomain(e.target.value)}
                placeholder="www.yourchurch.com"
                style={{flex:1,padding:'9px 12px',borderRadius:8,border:'1px solid var(--b2)',background:'var(--bg4)',color:'var(--tx)',fontSize:13,fontFamily:"'JetBrains Mono',monospace",outline:'none',marginBottom:window.innerWidth<500?8:0}}
              />
              <button className="btn btn-gold btn-sm" onClick={saveDomain} disabled={infoSaving}>{infoSaving ? 'Saving…' : 'Save'}</button>
            </div>
            {siteInfo.customDomain && (
              <div style={{marginTop:8,padding:'7px 12px',background:'rgba(74,222,128,.06)',border:'1px solid rgba(74,222,128,.15)',borderRadius:7,fontSize:12,color:'var(--green)',display:'flex',alignItems:'center',gap:6,wordBreak:'break-all'}}>
                <span>✓</span> Custom domain set: <strong style={{fontFamily:"'JetBrains Mono',monospace"}}>{siteInfo.customDomain}</strong>
              </div>
            )}
          </div>

          {/* DNS Instructions */}
          <div style={{background:'var(--bg3)',border:'1px solid var(--b1)',borderRadius:12,padding:'14px 4px',overflowX:'auto'}}>
            <div style={{fontSize:13,fontWeight:700,color:'var(--tx)',marginBottom:12}}>📋 DNS Setup Instructions</div>
            <p style={{fontSize:12.5,color:'var(--tx3)',lineHeight:1.7,marginBottom:14}}>To connect your custom domain, add these records at your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.):</p>

            {/* DNS records table */}
            <div style={{background:'var(--bg4)',border:'1px solid var(--b1)',borderRadius:8,overflow:'auto',marginBottom:14,minWidth:window.innerWidth<500?340:0}}>
              <div style={{display:'grid',gridTemplateColumns:'70px 1fr 1fr',padding:'8px 14px',background:'var(--bg5)',borderBottom:'1px solid var(--b1)'}}>
                {['Type','Name','Value'].map(h => <span key={h} style={{fontSize:10,fontWeight:700,letterSpacing:'.06em',textTransform:'uppercase',color:'var(--tx4)'}}>{h}</span>)}
              </div>
              <div style={{display:'grid',gridTemplateColumns:'70px 1fr 1fr',padding:'10px 14px',borderBottom:'1px solid var(--b1)'}}>
                <span style={{fontSize:12,fontWeight:600,color:'var(--gold)'}}>A</span>
                <span style={{fontSize:12,color:'var(--tx2)',fontFamily:"'JetBrains Mono',monospace"}}>@</span>
                <span style={{fontSize:12,color:'var(--tx2)',fontFamily:"'JetBrains Mono',monospace"}}>76.76.21.21</span>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'70px 1fr 1fr',padding:'10px 14px'}}>
                <span style={{fontSize:12,fontWeight:600,color:'var(--blue)'}}>CNAME</span>
                <span style={{fontSize:12,color:'var(--tx2)',fontFamily:"'JetBrains Mono',monospace"}}>www</span>
                <span style={{fontSize:12,color:'var(--tx2)',fontFamily:"'JetBrains Mono',monospace"}}>cname.sanctuarybuilder.com</span>
              </div>
            </div>

            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {[
                ['Step 1', 'Log in to your domain registrar (where you bought your domain).'],
                ['Step 2', 'Find the DNS settings or "DNS Management" page.'],
                ['Step 3', 'Add the A record and CNAME record shown above.'],
                ['Step 4', 'Remove any existing A records pointing to other IPs.'],
                ['Step 5', 'Save and wait 5–30 minutes for DNS to propagate.'],
              ].map(([step, desc]) => (
                <div key={step} style={{display:'flex',gap:10,alignItems:'flex-start'}}>
                  <span style={{fontSize:10.5,fontWeight:700,color:'var(--gold)',flexShrink:0,marginTop:1}}>{step}</span>
                  <span style={{fontSize:12,color:'var(--tx3)',lineHeight:1.6}}>{desc}</span>
                </div>
              ))}
            </div>

            <div style={{marginTop:14,padding:'9px 13px',background:'rgba(212,168,67,.06)',border:'1px solid rgba(212,168,67,.15)',borderRadius:7,fontSize:11.5,color:'var(--tx3)',lineHeight:1.6}}>
              <strong style={{color:'var(--gold)'}}>💡 Tip:</strong> DNS changes can take up to 48 hours to fully propagate worldwide, but usually work within 5–30 minutes. SSL certificates are automatically provisioned once your domain points to our servers.
            </div>
          </div>
        </Modal>
      )}

      {/* New site modal */}
      {showNew && (
        <div style={{position:'fixed',inset:0,zIndex:500,background:'rgba(0,0,0,.75)',backdropFilter:'blur(4px)',display:'flex',alignItems:'flex-start',justifyContent:'center',overflowY:'auto',padding:'36px 20px'}} onClick={() => setShowNew(false)}>
          <div style={{background:'var(--bg2)',border:'1px solid var(--b2)',borderRadius:20,padding:'32px 28px',width:'100%',maxWidth:880,boxShadow:'0 32px 80px rgba(0,0,0,.7)',animation:'popIn .2s ease'}} onClick={e => e.stopPropagation()}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24}}>
              <div>
                <h2 style={{fontSize:28,fontWeight:400,marginBottom:3}}>Choose a Template</h2>
                <p style={{color:'var(--tx3)',fontSize:13}}>Pick one to start building immediately.</p>
              </div>
              <button className="btn-ic" onClick={() => setShowNew(false)} style={{fontSize:16}}>✕</button>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(230px,1fr))',gap:14}}>
              {TEMPLATES.filter(t => !t.hidden).map(t => (
                <div key={t.id} style={{background:'var(--bg3)',border:'1px solid var(--b1)',borderRadius:12,overflow:'hidden',cursor:'pointer',transition:'all .18s'}}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--b2)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--b1)'; e.currentTarget.style.transform = '' }}>
                  <div style={{height:100,background:t.thumb[0],position:'relative',overflow:'hidden'}}>
                    <div style={{position:'absolute',top:7,left:9}}><span className="badge" style={{background:'rgba(255,255,255,.12)',color:'rgba(255,255,255,.8)',fontSize:9.5}}>{t.category}</span></div>
                    <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
                      <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,color:'rgba(255,255,255,.9)'}}>{t.name}</div>
                    </div>
                  </div>
                  <div style={{padding:'11px 13px'}}>
                    <p style={{color:'var(--tx3)',fontSize:11.5,lineHeight:1.6,marginBottom:10}}>{t.desc}</p>
                    <button className="btn btn-gold btn-sm" style={{width:'100%',justifyContent:'center',fontSize:11}} onClick={() => createSite(t)}>Use This Template →</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
