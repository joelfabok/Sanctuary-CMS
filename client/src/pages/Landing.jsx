import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { TEMPLATES, NAVBAR_STYLES, PALETTES } from '../data/constants'
import { Logo } from '../components/shared/UI'
import REl from '../components/builder/REl'
import api from '../utils/api'

function TemplatePreviewModal({ tmpl, onClose, onUse }) {
  const pal = PALETTES.find(p => p.id === tmpl.palette) || PALETTES[0]
  const ns  = NAVBAR_STYLES.find(s => s.id === tmpl.nav.style) || NAVBAR_STYLES[0]
  const c   = { dark:tmpl.nav.bg||pal.colors[0], accent:pal.colors[2], heading:pal.colors[3], light:pal.colors[4] }

  return (
    <div style={{position:'fixed',inset:0,zIndex:999,background:'rgba(0,0,0,.85)',backdropFilter:'blur(4px)',display:'flex',flexDirection:'column',overflow:'hidden'}} onClick={onClose}>
      <div style={{height:50,background:'var(--bg2)',borderBottom:'1px solid var(--b2)',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 20px',flexShrink:0}} onClick={e=>e.stopPropagation()}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <button className="btn btn-gh btn-sm" onClick={onClose}>← Back</button>
          <span className="badge badge-gold" style={{fontSize:10}}>{tmpl.category}</span>
          <span style={{fontSize:14,fontWeight:500}}>{tmpl.name}</span>
          <span style={{fontSize:12,color:'var(--tx4)'}}>— Free Preview</span>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button className="btn btn-gh btn-sm" onClick={onClose}>✕ Close</button>
          <button className="btn btn-gold btn-sm" onClick={onUse}>Use This Template — Sign Up Free →</button>
        </div>
      </div>
      <div style={{flex:1,overflow:'auto',background:'#1c1c20',display:'flex',justifyContent:'center',padding:'20px 16px'}} onClick={e=>e.stopPropagation()}>
        <div style={{width:'100%',maxWidth:960,background:'white',boxShadow:'0 2px 4px rgba(0,0,0,.3),0 20px 60px rgba(0,0,0,.55)',borderRadius:8,overflow:'hidden'}}>
          {ns.render(tmpl.nav, c)}
          {(tmpl.rows || tmpl.pages?.[0]?.rows || []).map((row, ri) => (
            <div key={ri} style={{background:row.bg||'#fff',paddingTop:row.pt||48,paddingBottom:row.pb||48}}>
              <div style={{display:'grid',gridTemplateColumns:row.cols===1?'1fr':row.cols===2?'1fr 1fr':row.cols===3?'1fr 1fr 1fr':'1fr 1fr 1fr 1fr',padding:'0 28px'}}>
                {row.cols_data.map((col,ci)=>(
                  <div key={ci} style={{padding:'0 8px'}}>
                    {col.map((el,ei)=><REl key={ei} el={el} />)}
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div style={{padding:'20px 28px',textAlign:'center',background:'#0b0b0d',borderTop:'4px solid rgba(212,168,67,.3)'}}>
            <div style={{fontSize:12,color:'rgba(240,236,230,.3)',marginBottom:12}}>🔒 Sign up to unlock full editing, custom colors, and publishing</div>
            <button className="btn btn-gold" onClick={onUse}>Get Started Free — 14-Day Trial →</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Landing() {
  const nav = useNavigate()
  const [previewTmpl, setPreviewTmpl] = useState(null)
  const [cms, setCms] = useState({
    badge:'Church Website Builder · Starting at $19/mo',
    headline:'Build your church website in minutes.',
    subheadline:'Professional websites for churches, ministries, missionaries, and nonprofits.',
    ctaText:'Start Building Free', ctaText2:'Browse Templates',
    stat1n:'2,400+', stat1l:'Organizations served',
    stat2n:'< 5 min', stat2l:'Average setup time',
    stat3n:'5', stat3l:'Premium templates',
    stat4n:'4', stat4l:'Navbar styles',
    announcementBar:false, announcementText:'', announcementLink:'',
  })

  useEffect(() => {
    api.get('/homepage').then(r => setCms(r.data)).catch(() => {})
  }, [])

  const goUse = () => { setPreviewTmpl(null); nav('/auth?mode=register') }


  // Mobile nav state
  const [navOpen, setNavOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 900)
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 900)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  return (
    <div style={{minHeight:'100vh',overflow:'auto',background:'var(--bg)'}}>
      {previewTmpl && <TemplatePreviewModal tmpl={previewTmpl} onClose={()=>setPreviewTmpl(null)} onUse={goUse} />}

      {cms.announcementBar && (
        <div style={{background:'var(--gold)',padding:'8px 20px',textAlign:'center',display:'flex',alignItems:'center',justifyContent:'center',gap:12}}>
          <span style={{fontSize:13,fontWeight:500,color:'#1c0f00'}}>{cms.announcementText}</span>
          <span style={{fontSize:13,fontWeight:700,color:'#1c0f00',cursor:'pointer',textDecoration:'underline'}}>{cms.announcementLink}</span>
        </div>
      )}

      {/* Responsive Nav */}
      <nav style={{position:'sticky',top:0,zIndex:100,background:'rgba(11,11,13,.92)',backdropFilter:'blur(16px)',borderBottom:'1px solid var(--b1)'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',height:58,padding:'0 20px'}}>
          <Logo size={28} onClick={()=>{setNavOpen(false);nav('/')}} style={{cursor:'pointer'}} />
          {isMobile ? (
            <button
              aria-label={navOpen ? 'Close menu' : 'Open menu'}
              onClick={()=>setNavOpen(o=>!o)}
              style={{background:'none',border:'none',color:'var(--tx3)',fontSize:28,cursor:'pointer',padding:6,display:'flex',alignItems:'center'}}>
              {navOpen ? '✕' : '☰'}
            </button>
          ) : (
            <div style={{display:'flex',gap:5,alignItems:'center'}}>
              {['Templates','Features','Pricing'].map(l=><span key={l} style={{padding:'5px 10px',fontSize:13,color:'var(--tx3)',cursor:'pointer'}} onClick={()=>{if(l==='Pricing')nav('/pricing');if(l==='Templates')nav('/templates');if(l==='Features')nav('/features')}}>{l}</span>)}
              <div style={{width:1,height:18,background:'var(--b1)',margin:'0 5px'}} />
              <button className="btn btn-gh btn-sm" onClick={()=>nav('/auth')}>Sign In</button>
              <button className="btn btn-gold btn-sm" onClick={()=>nav('/pricing')}>Get Started</button>
            </div>
          )}
        </div>
        {/* Mobile dropdown */}
        {isMobile && navOpen && (
          <div style={{background:'rgba(11,11,13,.98)',borderBottom:'1px solid var(--b1)',boxShadow:'0 8px 32px rgba(0,0,0,.22)',position:'absolute',top:58,left:0,right:0,zIndex:101,animation:'popIn .13s',display:'flex',flexDirection:'column'}}>
            {['Templates','Features','Pricing'].map(l=>(
              <span key={l} style={{padding:'16px 24px',fontSize:16,color:'var(--tx2)',borderBottom:'1px solid var(--b1)',cursor:'pointer'}} onClick={()=>{setNavOpen(false);if(l==='Pricing')nav('/pricing');if(l==='Templates')nav('/templates');if(l==='Features')nav('/features')}}>{l}</span>
            ))}
            <div style={{height:1,background:'var(--b1)',margin:'0 0 0 0'}} />
            <button className="btn btn-gh btn-sm" style={{margin:'16px 24px 8px'}} onClick={()=>{setNavOpen(false);nav('/auth')}}>Sign In</button>
            <button className="btn btn-gold btn-sm" style={{margin:'0 24px 16px'}} onClick={()=>{setNavOpen(false);nav('/pricing')}}>Get Started</button>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section style={{padding:'min(110px,12vw) min(4vw,40px) min(90px,10vw)',textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse 80% 50% at 50% -5%,rgba(212,168,67,.07),transparent)'}} />
        <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(var(--b1) 1px,transparent 1px),linear-gradient(90deg,var(--b1) 1px,transparent 1px)',backgroundSize:'60px 60px',opacity:.4}} />
        <div style={{position:'relative',maxWidth:820,margin:'0 auto',width:'100%'}}>
          <div className="a1 badge badge-gold" style={{marginBottom:22}}>{cms.badge}</div>
          <h1 className="a2" style={{fontSize:'clamp(32px,6.5vw,78px)',fontWeight:400,lineHeight:1.05,letterSpacing:'-.025em',marginBottom:22}}>
            {cms.headline.replace('.','').trim()}.<br/>
            <em style={{color:'var(--gold)',fontStyle:'italic'}}>Start today.</em>
          </h1>
          <p className="a3" style={{fontSize:'clamp(15px,2vw,18px)',color:'var(--tx2)',maxWidth:560,margin:'0 auto 44px',lineHeight:1.75}}>{cms.subheadline}</p>
          <div className="a4" style={{display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap'}}>
            <button className="btn btn-gold btn-xl" onClick={()=>nav('/pricing')}>{cms.ctaText} →</button>
            <button className="btn btn-gh btn-xl" onClick={()=>nav('/auth')}>Try Live Demo</button>
          </div>
          <div style={{marginTop:52,display:'flex',gap:24,justifyContent:'center',flexWrap:'wrap'}}>
            {[[cms.stat1n,cms.stat1l],[cms.stat2n,cms.stat2l],[cms.stat3n,cms.stat3l],[cms.stat4n,cms.stat4l]].map(([n,l])=>(
              <div key={l} style={{textAlign:'center',minWidth:90,flex:'1 1 90px',margin:'0 4px'}}>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,color:'var(--gold)'}}>{n}</div>
                <div style={{fontSize:12,color:'var(--tx4)',marginTop:2}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section style={{padding:'min(72px,8vw) min(4vw,40px)',background:'var(--bg2)',borderTop:'1px solid var(--b1)'}}>
        <div style={{maxWidth:1000,margin:'0 auto',width:'100%'}}>
          <div style={{textAlign:'center',marginBottom:44}}>
            <div className="badge badge-gold" style={{marginBottom:14}}>Who It's For</div>
            <h2 style={{fontSize:'clamp(22px,5vw,40px)'}}>Built for faith communities of every kind</h2>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:16}}>
            {[['⛪','Local Churches','From small congregations to growing multi-site churches — launch a beautiful website in minutes.'],['🌍','Missionaries','Share your calling, update supporters, and collect donations with a portfolio-style site built for mission work.'],['◆','Ministries','Youth groups, women\'s circles, men\'s fellowships — give your ministry its own home online.'],['🤝','Nonprofits','Community organizations, outreach programs, and faith-based nonprofits ready to tell their story.']].map(([ic,title,desc])=>(
              <div key={title} style={{padding:'min(22px,5vw) min(20px,4vw)',background:'var(--bg3)',border:'1px solid var(--b1)',borderRadius:'var(--r3)',minWidth:0}}>
                <div style={{fontSize:28,marginBottom:12,lineHeight:1}}>{ic}</div>
                <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:19,marginBottom:8}}>{title}</h3>
                <p style={{color:'var(--tx3)',fontSize:13,lineHeight:1.7}}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates */}
      <section style={{padding:'min(80px,10vw) min(4vw,40px)'}}>
        <div style={{maxWidth:1100,margin:'0 auto',width:'100%'}}>
          <div style={{textAlign:'center',marginBottom:48}}>
            <div className="badge badge-gold" style={{marginBottom:14}}>Templates</div>
            <h2 style={{fontSize:'clamp(22px,5vw,42px)',marginBottom:10}}>Start with a template built for your mission</h2>
            <p style={{color:'var(--tx3)',fontSize:15,maxWidth:480,margin:'0 auto'}}>Preview any template for free — no account needed.</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:16,justifyContent:'center'}}>
            {TEMPLATES.filter(t=>!t.hidden).slice(0,4).map(t=>(
              <div key={t.id} className="card card-hov" onClick={()=>setPreviewTmpl(t)}>
                <div style={{height:140,background:t.thumb[0],position:'relative',overflow:'hidden'}}>
                  <div style={{position:'absolute',inset:0,background:`radial-gradient(ellipse 80% 60% at 30% 40%,${t.thumb[1]}22,transparent)`}} />
                  <div style={{position:'absolute',top:8,left:10}}><span className="badge" style={{background:'rgba(255,255,255,.12)',color:'rgba(255,255,255,.8)',fontSize:9.5}}>{t.category}</span></div>
                  <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:4}}>
                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,color:'rgba(255,255,255,.9)'}}>{t.name}</div>
                    <div className="badge" style={{background:'rgba(255,255,255,.1)',color:'rgba(255,255,255,.7)',fontSize:9.5}}>{t.style}</div>
                  </div>
                  <div style={{position:'absolute',bottom:8,right:8}}><div style={{background:'rgba(0,0,0,.5)',color:'rgba(255,255,255,.8)',padding:'3px 8px',borderRadius:4,fontSize:10,fontWeight:600}}>Preview →</div></div>
                </div>
                <div style={{padding:'12px 14px'}}>
                  <p style={{color:'var(--tx3)',fontSize:12,lineHeight:1.6,marginBottom:10}}>{t.desc}</p>
                  <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                    <button className="btn btn-gh btn-sm" style={{flex:1,justifyContent:'center'}} onClick={e=>{e.stopPropagation();setPreviewTmpl(t)}}>Preview</button>
                    <button className="btn btn-gold btn-sm" style={{flex:1,justifyContent:'center'}} onClick={e=>{e.stopPropagation();nav('/auth?mode=register')}}>Use →</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{textAlign:'center',marginTop:28,display:'flex',flexDirection:'column',alignItems:'center',gap:12}}>
            <button className="btn btn-gh btn-lg" onClick={()=>nav('/templates')}>View All Templates →</button>
            <span style={{fontSize:13,color:'var(--tx4)'}}>No account required to preview. Start a free trial to edit and publish.</span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{padding:'100px 40px',textAlign:'center',background:'var(--bg2)',borderTop:'1px solid var(--b1)'}}>
        <div style={{maxWidth:540,margin:'0 auto'}}>
          <h2 style={{fontSize:46,lineHeight:1.1,marginBottom:18}}>Your community deserves a great digital home.</h2>
          <p style={{color:'var(--tx3)',fontSize:16,marginBottom:36}}>Start free for 14 days. No credit card required.</p>
          <div style={{display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap'}}>
            <button className="btn btn-gold btn-xl" onClick={()=>nav('/pricing')}>View Plans →</button>
            <button className="btn btn-gh btn-xl" onClick={()=>nav('/templates')}>Browse Templates</button>
          </div>
        </div>
      </section>

      <footer style={{background:'#060604',borderTop:'1px solid var(--b1)',padding:'22px 36px',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:12}}>
        <Logo size={22} />
        <span style={{fontSize:12,color:'var(--tx4)'}}>© 2024 Product Of Sphere Digital · Built for faith communities</span>
        <div style={{display:'flex',gap:14}}>{[['Privacy','/privacy'],['Terms','/terms'],['Contact','/contact']].map(([l,to])=><span key={l} onClick={()=>nav(to)} style={{fontSize:12,color:'var(--tx4)',cursor:'pointer'}}>{l}</span>)}</div>
      </footer>
    </div>
  )
}
