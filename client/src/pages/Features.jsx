import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Logo } from '../components/shared/UI'

const FEATURES = [
  { icon:'🧱', title:'Drag & Drop Builder', desc:'Build pages visually — drag elements, rearrange rows, and drop in pre-built section blocks. No code required.' },
  { icon:'📄', title:'Multi-Page Sites', desc:'Create as many pages as you need — Home, About, Sermons, Events, Give, and more. Each page gets its own URL slug.' },
  { icon:'🎨', title:'One-Click Color Palettes', desc:'8 professionally designed color palettes. Switch your entire site\'s look with one click, or customize every color yourself.' },
  { icon:'📐', title:'Flexible Layouts', desc:'1 to 4-column rows, background colors, images, or video — arrange your content exactly how you envision it.' },
  { icon:'🧩', title:'12 Content Elements', desc:'Headings, text, buttons, images, videos, lists, quotes, badges, dividers, spacers, feature cards, and event cards — everything you need.' },
  { icon:'📎', title:'Pre-Built Section Blocks', desc:'Drop in ready-made sections — hero banners, service times, team grids, event listings, testimonials, CTAs, and more.' },
  { icon:'🖼️', title:'5+ Starter Templates', desc:'Professionally designed templates for churches, missionaries, ministries, and nonprofits. Preview any for free.' },
  { icon:'🧭', title:'4 Navbar Styles', desc:'Classic, Centered, Minimal, or Bold Split — each fully customizable with logo, links, dropdowns, and CTAs.' },
  { icon:'📱', title:'Responsive Preview', desc:'Preview your site at Desktop, Tablet, and Mobile breakpoints before publishing — right inside the builder.' },
  { icon:'↩️', title:'Undo & Redo', desc:'Made a mistake? Full undo/redo history with keyboard shortcuts (⌘Z / ⌘⇧Z). Experiment freely.' },
  { icon:'🌐', title:'Custom Domains', desc:'Connect your own domain name for a professional web address your congregation will remember.' },
  { icon:'👥', title:'Team Collaboration', desc:'Invite team members to help manage your site. Role-based access keeps everything organized.' },
  { icon:'📊', title:'Built-In Analytics', desc:'Understand how your community interacts with your site with built-in traffic and engagement insights.' },
  { icon:'🔒', title:'SSL & Security', desc:'Every published site is secure by default. Your visitors\' data is always protected.' },
  { icon:'🗓️', title:'Event Cards', desc:'Showcase upcoming services, conferences, and community events with beautiful event cards — date, time, location, and CTA included.' },
  { icon:'🔗', title:'Smart Navigation', desc:'Dropdown menus, internal page linking, external URLs, and anchor links — guide visitors wherever they need to go.' },
]

const HIGHLIGHTS = [
  { badge:'Builder', title:'Visual editing that feels natural', desc:'Select any element to edit it inline. See your changes in real time. The builder stays out of your way so you can focus on your message.', items:['Inline element selection & editing','Real-time style controls','Layers panel for quick navigation','Element toolbar with align, duplicate, delete'] },
  { badge:'Design', title:'Look professional without a designer', desc:'Every template, palette, and section block was designed specifically for faith communities. Your site looks polished from day one.', items:['Curated color palettes for churches','Playfair Display & Inter typography','Background images & video support','Consistent spacing and rhythm'] },
  { badge:'Publish', title:'Go live in minutes, not weeks', desc:'When your site is ready, publish with one click. Update anytime — no waiting for a developer or agency.', items:['One-click publish & unpublish','Instant updates — no build step','Custom domain support','14-day free trial to get started'] },
]

export default function Features() {
  const nav = useNavigate()


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
      {/* Responsive Nav */}
      <nav style={{position:'sticky',top:0,zIndex:100,background:'rgba(11,11,13,.92)',backdropFilter:'blur(16px)',borderBottom:'1px solid var(--b1)'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',height:58,padding:'0 20px'}}>
          <Logo size={28} style={{cursor:'pointer'}} onClick={()=>{setNavOpen(false);nav('/')}} />
          {isMobile ? (
            <button
              aria-label={navOpen ? 'Close menu' : 'Open menu'}
              onClick={()=>setNavOpen(o=>!o)}
              style={{background:'none',border:'none',color:'var(--tx3)',fontSize:28,cursor:'pointer',padding:6,display:'flex',alignItems:'center'}}>
              {navOpen ? '✕' : '☰'}
            </button>
          ) : (
            <div style={{display:'flex',gap:5,alignItems:'center'}}>
              {['Templates','Features','Pricing'].map(l=><span key={l} style={{padding:'5px 10px',fontSize:13,color:l==='Features'?'var(--gold)':'var(--tx3)',cursor:'pointer'}} onClick={()=>{if(l==='Pricing')nav('/pricing');if(l==='Templates')nav('/templates');if(l==='Features')nav('/features')}}>{l}</span>)}
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
              <span key={l} style={{padding:'16px 24px',fontSize:16,color:l==='Features'?'var(--gold)':'var(--tx2)',borderBottom:'1px solid var(--b1)',cursor:'pointer'}} onClick={()=>{setNavOpen(false);if(l==='Pricing')nav('/pricing');if(l==='Templates')nav('/templates');if(l==='Features')nav('/features')}}>{l}</span>
            ))}
            <div style={{height:1,background:'var(--b1)',margin:'0 0 0 0'}} />
            <button className="btn btn-gh btn-sm" style={{margin:'16px 24px 8px'}} onClick={()=>{setNavOpen(false);nav('/auth')}}>Sign In</button>
            <button className="btn btn-gold btn-sm" style={{margin:'0 24px 16px'}} onClick={()=>{setNavOpen(false);nav('/pricing')}}>Get Started</button>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section style={{padding:'90px 40px 70px',textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse 80% 50% at 50% -5%,rgba(212,168,67,.07),transparent)'}} />
        <div style={{position:'relative',maxWidth:700,margin:'0 auto'}}>
          <div className="badge badge-gold" style={{marginBottom:16}}>Features</div>
          <h1 style={{fontSize:'clamp(38px,5.5vw,56px)',fontWeight:400,lineHeight:1.1,letterSpacing:'-.02em',marginBottom:18}}>
            Everything you need to build a <em style={{color:'var(--gold)',fontStyle:'italic'}}>beautiful</em> church website.
          </h1>
          <p style={{color:'var(--tx2)',fontSize:16,maxWidth:520,margin:'0 auto 36px',lineHeight:1.7}}>A visual website builder designed from the ground up for churches, ministries, missionaries, and nonprofits.</p>
          <div style={{display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap'}}>
            <button className="btn btn-gold btn-lg" onClick={()=>nav('/pricing')}>Start Free Trial →</button>
            <button className="btn btn-gh btn-lg" onClick={()=>nav('/templates')}>Browse Templates</button>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section style={{padding:'60px 40px 80px'}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:48}}>
            <h2 style={{fontSize:36,marginBottom:10}}>Packed with purpose-built tools</h2>
            <p style={{color:'var(--tx3)',fontSize:15,maxWidth:480,margin:'0 auto'}}>Every feature was built with faith communities in mind.</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:16}}>
            {FEATURES.map(f=>(
              <div key={f.title} style={{padding:'24px 22px',background:'var(--bg2)',border:'1px solid var(--b1)',borderRadius:'var(--r3)',transition:'border-color .2s'}}
                onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(212,168,67,.3)'}
                onMouseLeave={e=>e.currentTarget.style.borderColor='var(--b1)'}>
                <div style={{fontSize:28,marginBottom:14,lineHeight:1}}>{f.icon}</div>
                <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:17,marginBottom:8}}>{f.title}</h3>
                <p style={{color:'var(--tx3)',fontSize:13,lineHeight:1.7}}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlight Sections */}
      {HIGHLIGHTS.map((h,i)=>(
        <section key={h.title} style={{padding:'80px 40px',background:i%2===0?'var(--bg)':'var(--bg2)',borderTop:'1px solid var(--b1)'}}>
          <div style={{maxWidth:900,margin:'0 auto',display:'grid',gridTemplateColumns:'1fr 1fr',gap:60,alignItems:'center'}}>
            <div style={{order:i%2===0?0:1}}>
              <div className="badge badge-gold" style={{marginBottom:14}}>{h.badge}</div>
              <h2 style={{fontSize:34,lineHeight:1.15,marginBottom:14}}>{h.title}</h2>
              <p style={{color:'var(--tx3)',fontSize:14.5,lineHeight:1.75,marginBottom:24}}>{h.desc}</p>
              <ul style={{listStyle:'none',padding:0,margin:0,display:'flex',flexDirection:'column',gap:10}}>
                {h.items.map(item=>(
                  <li key={item} style={{display:'flex',alignItems:'center',gap:10,fontSize:13.5,color:'var(--tx2)'}}>
                    <span style={{width:20,height:20,borderRadius:'50%',background:'rgba(212,168,67,.1)',border:'1px solid rgba(212,168,67,.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:'var(--gold)',flexShrink:0}}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{background:'var(--bg3)',border:'1px solid var(--b1)',borderRadius:16,height:280,display:'flex',alignItems:'center',justifyContent:'center',order:i%2===0?1:0}}>
              <div style={{textAlign:'center'}}>
                <div style={{fontSize:48,marginBottom:8}}>{i===0?'🖱️':i===1?'🎨':'🚀'}</div>
                <div style={{fontSize:13,color:'var(--tx4)'}}>{h.badge} Preview</div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Stats */}
      <section style={{padding:'70px 40px',borderTop:'1px solid var(--b1)'}}>
        <div style={{maxWidth:800,margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:24,textAlign:'center'}}>
          {[['12','Content Elements'],['5+','Starter Templates'],['8','Color Palettes'],['4','Navbar Styles']].map(([n,l])=>(
            <div key={l}>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:42,color:'var(--gold)',lineHeight:1}}>{n}</div>
              <div style={{fontSize:13,color:'var(--tx3)',marginTop:6}}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{padding:'90px 40px',textAlign:'center',background:'var(--bg2)',borderTop:'1px solid var(--b1)'}}>
        <div style={{maxWidth:560,margin:'0 auto'}}>
          <h2 style={{fontSize:42,lineHeight:1.1,marginBottom:16}}>Ready to build something beautiful?</h2>
          <p style={{color:'var(--tx3)',fontSize:15,marginBottom:36}}>Start free for 14 days. No credit card required.</p>
          <div style={{display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap'}}>
            <button className="btn btn-gold btn-xl" onClick={()=>nav('/pricing')}>View Plans →</button>
            <button className="btn btn-gh btn-xl" onClick={()=>nav('/templates')}>Browse Templates</button>
          </div>
        </div>
      </section>

      <footer style={{background:'#060604',borderTop:'1px solid var(--b1)',padding:'22px 36px',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:12}}>
        <Logo size={22} />
        <span style={{fontSize:12,color:'var(--tx4)'}}>© 2024 Product Of <a  href="https://www.spheredigital.ca" target="_blank" rel="noopener" style={{color:'var(--tx4)',textDecoration:'underline'}}>Sphere Digital</a> · Built for faith communities</span>
        <div style={{display:'flex',gap:14}}>{[['Privacy','/privacy'],['Terms','/terms'],['Contact','/contact']].map(([l,to])=><span key={l} onClick={()=>nav(to)} style={{fontSize:12,color:'var(--tx4)',cursor:'pointer'}}>{l}</span>)}</div>
      </footer>
    </div>
  )
}
