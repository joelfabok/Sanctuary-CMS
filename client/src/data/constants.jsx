import { useState } from 'react'

// ── Plans ─────────────────────────────────────────────────────────
export const PLANS = [
  { id:'starter', name:'Starter',  price:19, sites:2,  members:1,  storage:'500MB', features:['2 websites','3 templates','Email support','500MB storage','1 team member'] },
  { id:'church',  name:'Church',   price:39, sites:5,  members:5,  storage:'5GB',   features:['5 websites','All templates','Priority support','5GB storage','5 team members','Custom domain','Analytics'], popular:true },
  { id:'ministry',name:'Ministry', price:79, sites:20, members:25, storage:'25GB',  features:['20 websites','All templates + AI','Dedicated manager','25GB storage','25 team members','Multiple domains','White-label','API access'] },
]

// ── Color Palettes ─────────────────────────────────────────────────
export const PALETTES = [
  { id:'cornerstone', name:'Cornerstone',    mood:'Classic & Authoritative', colors:['#0f0e0c','#ffffff','#d4a843','#1a1715','#faf8f5','#f0ece4'] },
  { id:'grace',       name:'Grace Blue',     mood:'Contemporary & Fresh',    colors:['#0a0f1e','#ffffff','#3b82f6','#0f172a','#f0f6ff','#e8f0fe'] },
  { id:'sanctuary',   name:'The Sanctuary',  mood:'Warm & Traditional',      colors:['#140b05','#fffdf8','#c97b3a','#2c1a10','#fdf6ee','#f5ede0'] },
  { id:'arise',       name:'Arise Church',   mood:'Bold & Energetic',        colors:['#0d0515','#ffffff','#a855f7','#1a0a2e','#f8f0ff','#f0e4ff'] },
  { id:'harvest',     name:'Harvest Fields', mood:'Earthy & Grounded',       colors:['#0a110a','#ffffff','#4ade80','#1a2e1a','#f0faf0','#e4f5e4'] },
  { id:'living',      name:'Living Waters',  mood:'Open & Serene',           colors:['#060d14','#ffffff','#0ea5e9','#0c1e2e','#f0f8ff','#e0f0fa'] },
  { id:'crimson',     name:'Crimson Faith',  mood:'Passionate & Reverent',   colors:['#0f0505','#fffcfc','#dc2626','#1f0a0a','#fff5f5','#fde8e8'] },
  { id:'midnight',    name:'Midnight Chapel',mood:'Mysterious & Deep',       colors:['#06080f','#ffffff','#818cf8','#0d1226','#eef0ff','#e4e8ff'] },
]

// ── Element types list ─────────────────────────────────────────────
export const EL_TYPES = [
  { type:'heading', icon:'H',  label:'Heading' },
  { type:'text',    icon:'¶',  label:'Text'    },
  { type:'button',  icon:'⊡',  label:'Button'  },
  { type:'image',   icon:'⊞',  label:'Image'   },
  { type:'divider', icon:'—',  label:'Divider' },
  { type:'spacer',  icon:'↕',  label:'Spacer'  },
  { type:'list',    icon:'≡',  label:'List'    },
  { type:'quote',   icon:'❝',  label:'Quote'   },
  { type:'badge',   icon:'◉',  label:'Badge'   },
  { type:'feature', icon:'⊕',  label:'Feature' },
  { type:'event',   icon:'◷',  label:'Event'   },
  { type:'video',   icon:'▶',  label:'Video'   },
]

// ── Element default factory ────────────────────────────────────────
export function makeElement(type, extra = {}) {
  const id = Math.random().toString(36).slice(2,10)
  const defaults = {
    heading: { text:'Heading', fs:40, fw:'700', color:'#1a1715', ff:'Playfair', italic:false, ls:0, lh:1.15 },
    text:    { text:'Body text.', fs:15, color:'#4a4540', lh:1.8, fw:'400' },
    button:  { text:'Button', style:'filled', bg:'#d4a843', tc:'#1c0f00', br:8, fs:14, fw:'600', px:24, py:11 },
    image:   { src:'', alt:'', fit:'cover', h:280, br:8, caption:'' },
    divider: { style:'solid', color:'#e0dbd4', thick:1, w:80 },
    spacer:  { h:32 },
    badge:   { text:'Label', bg:'rgba(212,168,67,0.14)', tc:'#b8860b', br:20, fs:11 },
    feature: { icon:'✦', title:'Feature', body:'Description.', ic:'#d4a843', tc:'#1a1715', bc:'#6a6560' },
    event:   { title:'Event', date:'Date', time:'Time', loc:'Location', tc:'#1a1715', ac:'#d4a843', bg:'#ffffff', border:'#e8e0d4', br:11, fs:16, infoFs:13, infoCo:'#6a6560', px:20, py:18 },
    quote:   { text:'"Quote here."', attr:'Attribution', bg:'#faf7f2', bc:'#d4a843', fs:19, color:'#1a1715' },
    list:    { style:'bullet', items:['Item one','Item two','Item three'], fs:14, color:'#4a4540', ic:'#d4a843' },
    video:   { src:'', poster:'', autoplay:false, loop:false, muted:true, h:360, br:8 },
  }
  return { id, type, align:'center', pt:8, pb:8, ...(defaults[type] || {}), ...extra }
}

// ── Navbar link helper (supports both legacy string[] and {label,href}[]) ──
const ll = l => (typeof l === 'string' ? l : l?.label) || ''
const lh = l => (typeof l === 'string' ? '' : l?.href) || ''

function DropdownLink({ item, ls, dropBg, dropBorder, cb }) {
  const [open, setOpen] = useState(false)
  const children = item.children || []
  const href = lh(item)
  if (!children.length) {
    return <a href={cb.onLink?href||undefined:undefined} onClick={cb.onLink&&href?e=>{e.preventDefault();cb.onLink(href)}:undefined} style={ls}>{ll(item)}</a>
  }
  return (
    <div style={{position:'relative'}} onMouseEnter={()=>setOpen(true)} onMouseLeave={()=>setOpen(false)}>
      <span style={{...ls,display:'inline-flex',alignItems:'center',gap:4,userSelect:'none',cursor:href&&cb.onLink?'pointer':'default'}} onClick={cb.onLink&&href?e=>{e.preventDefault();cb.onLink(href)}:undefined}>
        {ll(item)}
        <svg width="9" height="6" viewBox="0 0 9 6" style={{flexShrink:0}}><polyline points="0.5,1 4.5,5 8.5,1" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </span>
      {open&&(
        <div style={{position:'absolute',top:'calc(100% + 6px)',left:0,minWidth:170,background:dropBg,border:`1px solid ${dropBorder}`,borderRadius:8,boxShadow:'0 8px 28px rgba(0,0,0,.22)',zIndex:9999,overflow:'hidden',padding:'4px 0'}}>
          {children.map((ch,ci)=>(
            <a key={ci} href={cb.onLink?ch.href||undefined:undefined} onClick={cb.onLink&&ch.href?e=>{e.preventDefault();cb.onLink(ch.href)}:undefined}
               style={{display:'block',padding:'9px 16px',fontSize:ls.fontSize,color:ls.color,textDecoration:'none',cursor:'pointer',whiteSpace:'nowrap',opacity:.85,fontFamily:"'Instrument Sans',sans-serif"}}
               onMouseEnter={e=>e.currentTarget.style.opacity='1'} onMouseLeave={e=>e.currentTarget.style.opacity='.85'}>
              {ch.label}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Navbar styles (render functions) ──────────────────────────────
export const NAVBAR_STYLES = [
  {
    id:'classic', name:'Classic', desc:'Logo left · Links center · CTA right',
    preview: (c) => (
      <div style={{background:c.dark,padding:'8px 14px',display:'flex',alignItems:'center',gap:10,borderRadius:4}}>
        <span style={{fontFamily:"'Playfair Display',serif",fontSize:12,color:c.accent,fontWeight:600,flexShrink:0}}>✦ Church</span>
        <div style={{flex:1,display:'flex',justifyContent:'center',gap:9}}>{['Home','About','Sermons'].map(l=><span key={l} style={{fontSize:9,color:'rgba(240,236,230,.5)'}}>{l}</span>)}</div>
        <div style={{background:c.accent,padding:'3px 9px',borderRadius:3,fontSize:9,color:c.dark,fontWeight:700}}>Visit</div>
      </div>
    ),
    render: (n, c, cb={}) => (
      <div style={{background:n.bg||c.dark,padding:`${n.py||16}px ${n.px||32}px`,display:'flex',alignItems:'center',gap:16}}>
        {n.showLogo!==false&&<div onClick={()=>cb.onLogo?.()} style={{fontFamily:"'Playfair Display',serif",fontSize:n.logoSize||20,color:n.logoColor||c.accent,fontWeight:600,letterSpacing:'-.01em',flexShrink:0,cursor:cb.onLogo?'pointer':'default',lineHeight:1}}>{n.logoImg?<img src={n.logoImg} style={{height:n.logoSize||40,display:'block'}} alt={n.logo||''} />:(n.logo||'Grace Church')}</div>}
        <div style={{flex:1,display:'flex',justifyContent:n.linkAlign==='right'?'flex-end':'center',gap:n.linkGap||28}}>{(n.links||['Home','About','Sermons','Events','Give']).map((l,i)=>{const item=typeof l==='string'?{label:l,href:''}:l;return<DropdownLink key={i} item={item} ls={{fontSize:n.linkSize||14,color:n.linkColor||'rgba(240,236,230,.65)',textDecoration:'none',cursor:'pointer'}} dropBg={n.bg||c.dark} dropBorder="rgba(255,255,255,.12)" cb={cb}/>})}</div>
        {n.showCta!==false&&<a href={cb.onLink?n.ctaHref||undefined:undefined} onClick={cb.onLink&&n.ctaHref?e=>{e.preventDefault();cb.onLink(n.ctaHref)}:undefined} style={{background:n.ctaBg||c.accent,color:n.ctaColor||c.dark,padding:`${n.ctaPy||8}px ${n.ctaPx||18}px`,borderRadius:n.ctaBr||6,fontSize:13,fontWeight:700,flexShrink:0,textDecoration:'none',cursor:'pointer'}}>{n.ctaText||'Plan a Visit'}</a>}
      </div>
    ),
  },
  {
    id:'centered', name:'Centered', desc:'Logo centered · Links beneath',
    preview: (c) => (
      <div style={{background:c.dark,padding:'8px 14px',textAlign:'center',borderRadius:4}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:12,color:c.accent,fontWeight:600,marginBottom:5}}>✦ Church</div>
        <div style={{display:'flex',justifyContent:'center',gap:9}}>{['Home','About','Give'].map(l=><span key={l} style={{fontSize:9,color:'rgba(240,236,230,.5)'}}>{l}</span>)}</div>
      </div>
    ),
    render: (n, c, cb={}) => (
      <div style={{background:n.bg||c.dark,padding:`${n.py||18}px ${n.px||32}px`,textAlign:'center'}}>
        {n.showLogo!==false&&<div onClick={()=>cb.onLogo?.()} style={{fontFamily:"'Playfair Display',serif",fontSize:n.logoSize||24,color:n.logoColor||c.accent,fontWeight:600,marginBottom:10,cursor:cb.onLogo?'pointer':'default'}}>{n.logoImg?<img src={n.logoImg} style={{height:n.logoSize||40,display:'block',margin:'0 auto 10px'}} alt={n.logo||''} />:(n.logo||'Grace Church')}</div>}
        <div style={{display:'flex',justifyContent:'center',gap:n.linkGap||28,flexWrap:'wrap'}}>{(n.links||['Home','About','Sermons','Events','Give']).map((l,i)=>{const item=typeof l==='string'?{label:l,href:''}:l;return<DropdownLink key={i} item={item} ls={{fontSize:n.linkSize||14,color:n.linkColor||'rgba(240,236,230,.65)',textDecoration:'none',cursor:'pointer'}} dropBg={n.bg||c.dark} dropBorder="rgba(255,255,255,.12)" cb={cb}/>})}</div>
      </div>
    ),
  },
  {
    id:'minimal', name:'Minimal', desc:'Light bg · Subtle borders',
    preview: (c) => (
      <div style={{background:c.light,padding:'8px 14px',display:'flex',alignItems:'center',justifyContent:'space-between',borderRadius:4,border:'1px solid rgba(0,0,0,.07)'}}>
        <span style={{fontFamily:"'Playfair Display',serif",fontSize:12,color:'#1a1715',fontWeight:600}}>Church</span>
        <div style={{display:'flex',gap:8}}>{['Home','About','Give'].map(l=><span key={l} style={{fontSize:9,color:'#6a6560'}}>{l}</span>)}</div>
      </div>
    ),
    render: (n, c, cb={}) => (
      <div style={{background:n.bg||c.light,padding:`${n.py||14}px ${n.px||32}px`,display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:`1px solid ${n.borderColor||'rgba(0,0,0,.07)'}`}}>
        {n.showLogo!==false&&<div onClick={()=>cb.onLogo?.()} style={{fontFamily:"'Playfair Display',serif",fontSize:n.logoSize||20,color:n.logoColor||c.heading,fontWeight:600,letterSpacing:'-.01em',cursor:cb.onLogo?'pointer':'default',lineHeight:1}}>{n.logoImg?<img src={n.logoImg} style={{height:n.logoSize||40,display:'block'}} alt={n.logo||''} />:(n.logo||'Grace Church')}</div>}
        <div style={{flex:1,display:'flex',justifyContent:n.linkAlign==='right'?'flex-end':'center',gap:n.linkGap||24}}>{(n.links||['Home','About','Sermons','Events','Give']).map((l,i)=>{const item=typeof l==='string'?{label:l,href:''}:l;return<DropdownLink key={i} item={item} ls={{fontSize:n.linkSize||14,color:n.linkColor||c.heading,opacity:.75,textDecoration:'none',cursor:'pointer'}} dropBg={n.bg||c.light} dropBorder="rgba(0,0,0,.1)" cb={cb}/>})}</div>
        {n.showCta!==false&&<a href={cb.onLink?n.ctaHref||undefined:undefined} onClick={cb.onLink&&n.ctaHref?e=>{e.preventDefault();cb.onLink(n.ctaHref)}:undefined} style={{border:`2px solid ${n.ctaBg||c.accent}`,color:n.ctaBg||c.accent,padding:`${n.ctaPy||6}px ${n.ctaPx||16}px`,borderRadius:n.ctaBr||6,fontSize:13,fontWeight:600,textDecoration:'none',cursor:'pointer'}}>{n.ctaText||'Plan a Visit'}</a>}
      </div>
    ),
  },
  {
    id:'bold', name:'Bold Split', desc:'Accent strip + light nav row',
    preview: (c) => (
      <div style={{borderRadius:4,overflow:'hidden'}}>
        <div style={{background:c.accent,padding:'3px 14px',display:'flex',justifyContent:'space-between'}}>
          <span style={{fontSize:8,color:'rgba(0,0,0,.75)'}}>Sun 10AM</span>
          <span style={{fontSize:8,color:'rgba(0,0,0,.75)',fontWeight:700}}>Give →</span>
        </div>
        <div style={{background:'#fff',padding:'6px 14px',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid rgba(0,0,0,.06)'}}>
          <span style={{fontFamily:"'Playfair Display',serif",fontSize:12,color:'#1a1715',fontWeight:600}}>Church</span>
          <div style={{display:'flex',gap:8}}>{['Home','About'].map(l=><span key={l} style={{fontSize:9,color:'#6a6560'}}>{l}</span>)}</div>
        </div>
      </div>
    ),
    render: (n, c, cb={}) => (
      <div>
        <div style={{background:n.stripBg||c.accent,padding:`${n.stripPy||5}px ${n.px||32}px`,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <span style={{fontSize:12,color:n.stripColor||c.dark,opacity:.9}}>{n.stripLeft||'Sun 10AM · 123 Faith Ave'}</span>
          <span style={{fontSize:12,color:n.stripColor||c.dark,fontWeight:600}}>{n.stripRight||'Give Online →'}</span>
        </div>
        <div style={{background:n.bg||'#ffffff',padding:`${n.py||14}px ${n.px||32}px`,display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid rgba(0,0,0,.06)'}}>
          {n.showLogo!==false&&<div onClick={()=>cb.onLogo?.()} style={{fontFamily:"'Playfair Display',serif",fontSize:n.logoSize||20,color:n.logoColor||c.heading,fontWeight:600,letterSpacing:'-.01em',cursor:cb.onLogo?'pointer':'default',lineHeight:1}}>{n.logoImg?<img src={n.logoImg} style={{height:n.logoSize||40,display:'block'}} alt={n.logo||''} />:(n.logo||'Grace Church')}</div>}
          <div style={{flex:1,display:'flex',justifyContent:n.linkAlign==='right'?'flex-end':'center',gap:n.linkGap||28}}>{(n.links||['Home','About','Sermons','Events','Give']).map((l,i)=>{const item=typeof l==='string'?{label:l,href:''}:l;return<DropdownLink key={i} item={item} ls={{fontSize:n.linkSize||14,color:n.linkColor||c.heading,opacity:.75,textDecoration:'none',cursor:'pointer'}} dropBg={n.bg||'#ffffff'} dropBorder="rgba(0,0,0,.1)" cb={cb}/>})}</div>
          {n.showCta!==false&&<a href={cb.onLink?n.ctaHref||undefined:undefined} onClick={cb.onLink&&n.ctaHref?e=>{e.preventDefault();cb.onLink(n.ctaHref)}:undefined} style={{background:n.ctaBg||c.accent,color:n.ctaColor||c.dark,padding:`${n.ctaPy||7}px ${n.ctaPx||16}px`,borderRadius:n.ctaBr||5,fontSize:13,fontWeight:700,textDecoration:'none',cursor:'pointer'}}>{n.ctaText||'Plan a Visit'}</a>}
        </div>
      </div>
    ),
  },
]

// ── Full site templates ─────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2,10)
const de  = (type, extra={}) => makeElement(type, extra)

export const TEMPLATES = [
  {
    id:'grace_classic', name:'Grace Church', category:'Church', style:'Classic', palette:'cornerstone',
    desc:'Timeless dark hero, warm light sections, gold accents. Perfect for established congregations.',
    thumb:['#0f0e0c','#d4a843','#faf8f5'],
    nav:{ style:'classic', showLogo:true, logo:'Grace Church', showCta:true, ctaText:'Plan a Visit', ctaHref:'/contact',
      links:[{label:'Home',href:'/'},{label:'About',href:'/about'},{label:'Sermons',href:'/sermons'},{label:'Events',href:'/events'},{label:'Give',href:'/give'}],
      bg:'#0f0e0c', linkColor:'rgba(240,236,230,.6)', logoColor:'#d4a843', ctaBg:'#d4a843', ctaColor:'#1c0f00' },
    pages:[
      { id:uid(), name:'Home', slug:'/', rows:[
        { id:uid(), cols:1, bg:'#0f0e0c', pt:88, pb:88, cols_data:[[
          de('badge',{text:'✦  Welcome',align:'center',pt:0,pb:0}),
          de('heading',{text:'Welcome to\nGrace Church',fs:56,color:'#f2efea',ff:'Playfair',align:'center',lh:1.08}),
          de('text',{text:'A community of faith, hope, and love — join us every Sunday at 10 AM.',fs:17,color:'rgba(242,239,234,0.55)',align:'center',pt:4,pb:0}),
          de('button',{text:'Plan Your Visit →',bg:'#d4a843',tc:'#1c0f00',align:'center',pt:20,pb:0}),
        ]]},
        { id:uid(), cols:3, bg:'#faf8f5', pt:60, pb:60, cols_data:[
          [de('feature',{icon:'✦',title:'Youth Ministry',body:'Equipping the next generation to live boldly for Christ.',align:'center'})],
          [de('feature',{icon:'◈',title:'Women of Faith',body:'Community, growth, and support for women of every season.',align:'center'})],
          [de('feature',{icon:'◆',title:"Men's Brotherhood",body:'Iron sharpening iron — growing in faith and integrity.',align:'center'})],
        ]},
        { id:uid(), cols:2, bg:'#ffffff', pt:56, pb:56, cols_data:[
          [de('image',{h:320,br:12})],
          [de('badge',{text:'Our Mission',align:'left',pt:0,pb:0}),de('heading',{text:'A Place to Belong',fs:34,ff:'Playfair',color:'#1a1715',align:'left',lh:1.1}),de('text',{text:'We are a family of believers dedicated to worship, fellowship, and serving our community.',fs:14,color:'#5a5550',align:'left',lh:1.8,pt:4}),de('button',{text:'Learn More',bg:'#1a1715',tc:'#f2efea',align:'left',pt:14})],
        ]},
        { id:uid(), cols:1, bg:'#0f0e0c', pt:68, pb:68, cols_data:[[
          de('heading',{text:'Ready to Find Your Home?',fs:44,color:'#f2efea',ff:'Playfair',align:'center'}),
          de('text',{text:"We'd love to meet you this Sunday. Come as you are.",fs:17,color:'rgba(242,239,234,0.5)',align:'center',pt:5,pb:0}),
          de('button',{text:'Get Directions →',bg:'#d4a843',tc:'#1c0f00',align:'center',pt:20,pb:0}),
        ]]},
      ]},
      { id:uid(), name:'About', slug:'/about', rows:[
        { id:uid(), cols:1, bg:'#0f0e0c', pt:80, pb:80, cols_data:[[
          de('badge',{text:'Our Story',align:'center',pt:0,pb:0}),
          de('heading',{text:'About Grace Church',fs:48,color:'#f2efea',ff:'Playfair',align:'center',lh:1.08}),
          de('text',{text:'Founded in 1992, Grace Church has been a beacon of hope in our community for over 30 years.',fs:17,color:'rgba(242,239,234,0.55)',align:'center',pt:4,pb:0}),
        ]]},
        { id:uid(), cols:2, bg:'#faf8f5', pt:60, pb:60, cols_data:[
          [de('image',{h:360,br:12})],
          [
            de('badge',{text:'Our Vision',align:'left',pt:0,pb:0}),
            de('heading',{text:'A Church for Every Generation',fs:32,ff:'Playfair',color:'#1a1715',align:'left',lh:1.1}),
            de('text',{text:'We believe the local church is the hope of the world. Our mission is to love God, love people, and serve our city with excellence.',fs:14,color:'#5a5550',align:'left',lh:1.8,pt:4}),
            de('text',{text:'Sunday Services: 9:00 AM & 11:00 AM\n📍 123 Faith Avenue, Your City',fs:13,color:'#8a8480',align:'left',fw:'500',pt:8}),
          ],
        ]},
        { id:uid(), cols:3, bg:'#ffffff', pt:56, pb:56, cols_data:[
          [de('feature',{icon:'✦',title:'Our Values',body:'Faith, family, and community are at the heart of everything we do.',align:'center'})],
          [de('feature',{icon:'◈',title:'Our Mission',body:'To know God and make Him known — in our city and to the ends of the earth.',align:'center'})],
          [de('feature',{icon:'◆',title:'Our Team',body:'A dedicated staff and volunteer team serving with joy and excellence.',align:'center'})],
        ]},
      ]},
      { id:uid(), name:'Sermons', slug:'/sermons', rows:[
        { id:uid(), cols:1, bg:'#0f0e0c', pt:72, pb:72, cols_data:[[
          de('badge',{text:'Latest Messages',align:'center',pt:0,pb:0}),
          de('heading',{text:'Sermons & Messages',fs:48,color:'#f2efea',ff:'Playfair',align:'center',lh:1.08}),
          de('text',{text:'Listen, learn, and be transformed by the Word of God. New messages every week.',fs:17,color:'rgba(242,239,234,0.55)',align:'center',pt:4,pb:0}),
        ]]},
        { id:uid(), cols:3, bg:'#faf8f5', pt:60, pb:60, cols_data:[
          [de('feature',{icon:'▶',title:'Current Series',body:'"Walking in Faith" — Week 4 of 6. Watch or listen online.',ic:'#d4a843',tc:'#1a1715',align:'center'}),de('button',{text:'Watch Now',bg:'#d4a843',tc:'#1c0f00',align:'center',pt:12,pb:0})],
          [de('feature',{icon:'▶',title:'Previous Series',body:'"The Beatitudes" — An 8-week deep dive into the Sermon on the Mount.',ic:'#d4a843',tc:'#1a1715',align:'center'}),de('button',{text:'Watch Now',bg:'#1a1715',tc:'#f2efea',align:'center',pt:12,pb:0})],
          [de('feature',{icon:'▶',title:'Topical Messages',body:'Browse messages by topic — Prayer, Marriage, Finances, Faith, and more.',ic:'#d4a843',tc:'#1a1715',align:'center'}),de('button',{text:'Browse All',bg:'#1a1715',tc:'#f2efea',align:'center',pt:12,pb:0})],
        ]},
        { id:uid(), cols:1, bg:'#ffffff', pt:56, pb:56, cols_data:[[
          de('badge',{text:'Podcast',align:'center',pt:0,pb:0}),
          de('heading',{text:'Listen on the Go',fs:36,color:'#1a1715',ff:'Playfair',align:'center'}),
          de('text',{text:'Subscribe to the Grace Church Podcast on Spotify, Apple Podcasts, or wherever you listen.',fs:15,color:'#5a5550',align:'center',pt:4,pb:0}),
          de('button',{text:'Subscribe to Podcast →',bg:'#d4a843',tc:'#1c0f00',align:'center',pt:18,pb:0}),
        ]]},
      ]},
      { id:uid(), name:'Events', slug:'/events', rows:[
        { id:uid(), cols:1, bg:'#0f0e0c', pt:72, pb:72, cols_data:[[
          de('badge',{text:'What\'s On',align:'center',pt:0,pb:0}),
          de('heading',{text:'Upcoming Events',fs:48,color:'#f2efea',ff:'Playfair',align:'center',lh:1.08}),
          de('text',{text:'Join us for worship, community, and life-changing events throughout the year.',fs:17,color:'rgba(242,239,234,0.55)',align:'center',pt:4,pb:0}),
        ]]},
        { id:uid(), cols:1, bg:'#faf8f5', pt:52, pb:52, cols_data:[[
          de('event',{title:'Sunday Gathering',date:'Every Sunday',time:'9:00 AM & 11:00 AM',loc:'123 Faith Avenue, Your City',tc:'#1a1715',ac:'#d4a843'}),
          de('event',{title:'Youth Night',date:'Every Friday',time:'7:00 PM',loc:'Grace Church Youth Hall',tc:'#1a1715',ac:'#d4a843',pt:16}),
          de('event',{title:'Women\'s Conference 2026',date:'May 15–17, 2026',time:'9:00 AM Daily',loc:'Grace Church Main Auditorium',tc:'#1a1715',ac:'#d4a843',pt:16}),
          de('event',{title:'Men\'s Retreat',date:'June 6–8, 2026',time:'Fri 6 PM — Sun 1 PM',loc:'Cedar Ridge Camp, Lake District',tc:'#1a1715',ac:'#d4a843',pt:16}),
        ]]},
        { id:uid(), cols:1, bg:'#ffffff', pt:56, pb:56, cols_data:[[
          de('badge',{text:'Community',align:'center',pt:0,pb:0}),
          de('heading',{text:'Small Groups',fs:36,ff:'Playfair',color:'#1a1715',align:'center'}),
          de('text',{text:'Life is better together. Find a small group near you meeting weekly for study, prayer, and real community.',fs:15,color:'#5a5550',align:'center',pt:4,pb:0}),
          de('button',{text:'Find a Group →',bg:'#d4a843',tc:'#1c0f00',align:'center',pt:18,pb:0}),
        ]]},
      ]},
      { id:uid(), name:'Give', slug:'/give', rows:[
        { id:uid(), cols:1, bg:'#0f0e0c', pt:80, pb:80, cols_data:[[
          de('badge',{text:'Generosity',align:'center',pt:0,pb:0}),
          de('heading',{text:'Give to Grace Church',fs:48,color:'#f2efea',ff:'Playfair',align:'center',lh:1.08}),
          de('text',{text:'Your generosity fuels the mission. Every gift makes an eternal difference.',fs:17,color:'rgba(242,239,234,0.55)',align:'center',pt:4,pb:0}),
        ]]},
        { id:uid(), cols:3, bg:'#faf8f5', pt:60, pb:60, cols_data:[
          [de('feature',{icon:'✦',title:'Online Giving',body:'Give securely online — one-time or recurring.',ic:'#d4a843',tc:'#1a1715',align:'center'}),de('button',{text:'Give Online',bg:'#d4a843',tc:'#1c0f00',align:'center',pt:12,pb:0})],
          [de('feature',{icon:'◈',title:'Text to Give',body:'Text GIVE to 55000 to donate from your phone in seconds.',ic:'#d4a843',tc:'#1a1715',align:'center'}),de('button',{text:'Learn How',bg:'#1a1715',tc:'#f2efea',align:'center',pt:12,pb:0})],
          [de('feature',{icon:'◆',title:'In Person',body:'Place your offering in the basket during any Sunday service.',ic:'#d4a843',tc:'#1a1715',align:'center'})],
        ]},
        { id:uid(), cols:1, bg:'#ffffff', pt:56, pb:56, cols_data:[[
          de('quote',{text:'"Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver."',attr:'— 2 Corinthians 9:7',bg:'#faf8f5',bc:'#d4a843',fs:18,color:'#1a1715',align:'center'}),
        ]]},
      ]},
    ],
  },
  {
    id:'missionary', name:'Global Reach', category:'Missionary', style:'Contemporary', palette:'living',
    desc:'Clean mission portfolio. Perfect for missionaries sharing their calling and supporting donors.',
    thumb:['#060d14','#0ea5e9','#f0f8ff'],
    nav:{ style:'minimal', showLogo:true, logo:'Global Reach', showCta:true, ctaText:'Support Us', ctaHref:'/give',
      links:[{label:'Mission',href:'/about'},{label:'Stories',href:'/sermons'},{label:'Events',href:'/events'},{label:'Donate',href:'/give'}],
      bg:'#ffffff', linkColor:'#334155', logoColor:'#0c1e2e', ctaBg:'#0ea5e9', ctaColor:'#ffffff', borderColor:'rgba(0,0,0,.08)' },
    pages:[
      { id:uid(), name:'Home', slug:'/', rows:[
        { id:uid(), cols:1, bg:'#060d14', pt:96, pb:96, cols_data:[[
          de('badge',{text:'Serving 12 Nations',align:'center',bg:'rgba(14,165,233,0.15)',tc:'#38bdf8',pt:0,pb:0}),
          de('heading',{text:'Taking the Gospel\nto the Ends of the Earth',fs:54,color:'#f0f8ff',ff:'Playfair',align:'center',lh:1.08}),
          de('text',{text:'Since 2014 we have planted churches, trained leaders, and served communities across Asia, Africa, and Latin America.',fs:17,color:'rgba(240,248,255,0.55)',align:'center',pt:5,pb:0}),
          de('button',{text:'Support Our Mission →',bg:'#0ea5e9',tc:'#ffffff',align:'center',pt:22,pb:0,br:10}),
        ]]},
        { id:uid(), cols:3, bg:'#f0f8ff', pt:60, pb:60, cols_data:[
          [de('feature',{icon:'🌍',title:'Church Planting',body:'12 new churches established in unreached communities.',ic:'#0ea5e9',tc:'#0c1e2e',align:'center'})],
          [de('feature',{icon:'📖',title:'Scripture Translation',body:'Bible portions translated into 4 indigenous languages.',ic:'#0ea5e9',tc:'#0c1e2e',align:'center'})],
          [de('feature',{icon:'🤝',title:'Community Development',body:'Clean water, schools, and clinics built alongside the Gospel.',ic:'#0ea5e9',tc:'#0c1e2e',align:'center'})],
        ]},
      ]},
      { id:uid(), name:'About', slug:'/about', rows:[
        { id:uid(), cols:1, bg:'#060d14', pt:72, pb:72, cols_data:[[
          de('badge',{text:'Our Mission',align:'center',bg:'rgba(14,165,233,0.15)',tc:'#38bdf8',pt:0,pb:0}),
          de('heading',{text:'Why We Go',fs:48,color:'#f0f8ff',ff:'Playfair',align:'center',lh:1.08}),
          de('text',{text:'We believe every person on earth deserves to hear the Gospel in their heart language.',fs:17,color:'rgba(240,248,255,0.55)',align:'center',pt:4,pb:0}),
        ]]},
        { id:uid(), cols:2, bg:'#f0f8ff', pt:60, pb:60, cols_data:[
          [de('image',{h:340,br:12})],
          [de('badge',{text:'Our Story',align:'left',bg:'rgba(14,165,233,0.1)',tc:'#0ea5e9',pt:0,pb:0}),de('heading',{text:'From One Church to\n12 Nations',fs:32,ff:'Playfair',color:'#0c1e2e',align:'left',lh:1.1}),de('text',{text:'Global Reach started as a small team of three sent from a local church in 2014. Today we work in 12 nations with over 60 local partners.',fs:14,color:'#334155',align:'left',lh:1.8,pt:4})],
        ]},
      ]},
      { id:uid(), name:'Stories', slug:'/sermons', rows:[
        { id:uid(), cols:1, bg:'#060d14', pt:72, pb:72, cols_data:[[
          de('badge',{text:'Field Updates',align:'center',bg:'rgba(14,165,233,0.15)',tc:'#38bdf8',pt:0,pb:0}),
          de('heading',{text:'Stories from the Field',fs:48,color:'#f0f8ff',ff:'Playfair',align:'center',lh:1.08}),
          de('text',{text:'Real stories of transformation happening around the world through your generosity.',fs:17,color:'rgba(240,248,255,0.55)',align:'center',pt:4,pb:0}),
        ]]},
        { id:uid(), cols:3, bg:'#f0f8ff', pt:56, pb:56, cols_data:[
          [de('feature',{icon:'🌟',title:'Indonesia — Borneo',body:'"A church of 200 now meets where there was no witness 3 years ago." — Field Partner',ic:'#0ea5e9',tc:'#0c1e2e',align:'center'})],
          [de('feature',{icon:'🌟',title:'Ethiopia — Gambela',body:'"We distributed 500 bibles in the Nuer language — many heard for the first time." — Team Leader',ic:'#0ea5e9',tc:'#0c1e2e',align:'center'})],
          [de('feature',{icon:'🌟',title:'Guatemala — Petén',body:'"The community clinic saw 1,400 patients in its first year — Gospel and health together." — Project Director',ic:'#0ea5e9',tc:'#0c1e2e',align:'center'})],
        ]},
      ]},
      { id:uid(), name:'Events', slug:'/events', rows:[
        { id:uid(), cols:1, bg:'#060d14', pt:72, pb:72, cols_data:[[
          de('badge',{text:'Get Involved',align:'center',bg:'rgba(14,165,233,0.15)',tc:'#38bdf8',pt:0,pb:0}),
          de('heading',{text:'Mission Events',fs:48,color:'#f0f8ff',ff:'Playfair',align:'center',lh:1.08}),
          de('text',{text:'Attend a sending service, mission trip briefing, or supporter gathering near you.',fs:17,color:'rgba(240,248,255,0.55)',align:'center',pt:4,pb:0}),
        ]]},
        { id:uid(), cols:1, bg:'#f0f8ff', pt:52, pb:52, cols_data:[[
          de('event',{title:'Annual Mission Banquet',date:'April 24, 2026',time:'6:00 PM',loc:'Community Hall — Main Street',tc:'#0c1e2e',ac:'#0ea5e9'}),
          de('event',{title:'Short-Term Trip — Indonesia',date:'July 5–19, 2026',time:'14-Day Team',loc:'Borneo, Indonesia',tc:'#0c1e2e',ac:'#0ea5e9',pt:16}),
          de('event',{title:'Supporter Prayer Night',date:'First Friday Monthly',time:'7:30 PM',loc:'Online via Zoom',tc:'#0c1e2e',ac:'#0ea5e9',pt:16}),
        ]]},
      ]},
      { id:uid(), name:'Give', slug:'/give', rows:[
        { id:uid(), cols:1, bg:'#060d14', pt:80, pb:80, cols_data:[[
          de('badge',{text:'Partner With Us',align:'center',bg:'rgba(14,165,233,0.15)',tc:'#38bdf8',pt:0,pb:0}),
          de('heading',{text:'Support the Mission',fs:48,color:'#f0f8ff',ff:'Playfair',align:'center',lh:1.08}),
          de('text',{text:'Your monthly gift sends workers, plants churches, and changes lives — for eternity.',fs:17,color:'rgba(240,248,255,0.55)',align:'center',pt:4,pb:0}),
          de('button',{text:'Give Monthly →',bg:'#0ea5e9',tc:'#ffffff',align:'center',pt:22,pb:0,br:10}),
        ]]},
        { id:uid(), cols:3, bg:'#f0f8ff', pt:56, pb:56, cols_data:[
          [de('feature',{icon:'💧',title:'$25/month',body:'Provides one local church planter\'s training and materials.',ic:'#0ea5e9',tc:'#0c1e2e',align:'center'}),de('button',{text:'Give $25/mo',bg:'#0ea5e9',tc:'#ffffff',align:'center',pt:12,pb:0,br:8})],
          [de('feature',{icon:'🌍',title:'$75/month',body:'Sponsors a bible translation project for one month.',ic:'#0ea5e9',tc:'#0c1e2e',align:'center'}),de('button',{text:'Give $75/mo',bg:'#0ea5e9',tc:'#ffffff',align:'center',pt:12,pb:0,br:8})],
          [de('feature',{icon:'🤝',title:'$200/month',body:'Covers the full operating costs of a community clinic.',ic:'#0ea5e9',tc:'#0c1e2e',align:'center'}),de('button',{text:'Give $200/mo',bg:'#0ea5e9',tc:'#ffffff',align:'center',pt:12,pb:0,br:8})],
        ]},
      ]},
    ],
  },
  {
    id:'nonprofit', name:'Hope Outreach', category:'Nonprofit', style:'Warm', palette:'sanctuary',
    desc:'Warm and welcoming for nonprofits and community outreach organizations. Donation-focused.',
    thumb:['#140b05','#c97b3a','#fdf6ee'],
    nav:{ style:'bold', showLogo:true, logo:'Hope Outreach', showCta:true, ctaText:'Donate Now', ctaHref:'/give',
      links:[{label:'About',href:'/about'},{label:'Programs',href:'/sermons'},{label:'Events',href:'/events'},{label:'Get Involved',href:'/give'}],
      bg:'#ffffff', linkColor:'#4a3520', logoColor:'#2c1a10', ctaBg:'#c97b3a', ctaColor:'#ffffff', stripBg:'#c97b3a', stripColor:'#ffffff', stripLeft:'Serving Springfield since 1998', stripRight:'100% of donations go to programs' },
    pages:[
      { id:uid(), name:'Home', slug:'/', rows:[
        { id:uid(), cols:1, bg:'#140b05', pt:88, pb:88, cols_data:[[
          de('badge',{text:'Nonprofit · Est. 1998',align:'center',bg:'rgba(201,123,58,0.15)',tc:'#e8a06a',pt:0,pb:0}),
          de('heading',{text:'Fighting Poverty.\nRestoring Dignity.\nBuilding Hope.',fs:52,color:'#fffdf8',ff:'Playfair',align:'center',lh:1.08,italic:true}),
          de('text',{text:'Every year we serve over 4,000 families through food, shelter, counseling, and job training.',fs:17,color:'rgba(255,253,248,0.5)',align:'center',pt:5,pb:0}),
          de('button',{text:'Donate Today →',bg:'#c97b3a',tc:'#ffffff',align:'center',pt:22,pb:0,br:4}),
        ]]},
      ]},
      { id:uid(), name:'About', slug:'/about', rows:[
        { id:uid(), cols:1, bg:'#140b05', pt:72, pb:72, cols_data:[[
          de('badge',{text:'Our Story',align:'center',bg:'rgba(201,123,58,0.15)',tc:'#e8a06a',pt:0,pb:0}),
          de('heading',{text:'About Hope Outreach',fs:48,color:'#fffdf8',ff:'Playfair',align:'center',lh:1.08}),
          de('text',{text:'Since 1998, we have been walking alongside the most vulnerable in our community.',fs:17,color:'rgba(255,253,248,0.5)',align:'center',pt:4,pb:0}),
        ]]},
        { id:uid(), cols:2, bg:'#fdf6ee', pt:60, pb:60, cols_data:[
          [de('image',{h:340,br:12})],
          [de('badge',{text:'Who We Are',align:'left',bg:'rgba(201,123,58,0.1)',tc:'#c97b3a',pt:0,pb:0}),de('heading',{text:'Serving the Whole Person',fs:32,ff:'Playfair',color:'#2c1a10',align:'left',lh:1.1}),de('text',{text:"We don't just hand out food — we walk with families through crisis, recovery, and toward self-sufficiency.",fs:14,color:'#6a5040',align:'left',lh:1.8,pt:4})],
        ]},
      ]},
      { id:uid(), name:'Programs', slug:'/sermons', rows:[
        { id:uid(), cols:1, bg:'#140b05', pt:72, pb:72, cols_data:[[
          de('badge',{text:'What We Do',align:'center',bg:'rgba(201,123,58,0.15)',tc:'#e8a06a',pt:0,pb:0}),
          de('heading',{text:'Our Programs',fs:48,color:'#fffdf8',ff:'Playfair',align:'center',lh:1.08}),
        ]]},
        { id:uid(), cols:3, bg:'#fdf6ee', pt:56, pb:56, cols_data:[
          [de('feature',{icon:'🥗',title:'Food Pantry',body:'Weekly groceries for families and individuals facing food insecurity.',ic:'#c97b3a',tc:'#2c1a10',align:'center'})],
          [de('feature',{icon:'🏠',title:'Shelter Network',body:'Emergency and transitional housing with wraparound support services.',ic:'#c97b3a',tc:'#2c1a10',align:'center'})],
          [de('feature',{icon:'💼',title:'Job Training',body:'Skills workshops, resume help, and employer connections.',ic:'#c97b3a',tc:'#2c1a10',align:'center'})],
        ]},
      ]},
      { id:uid(), name:'Events', slug:'/events', rows:[
        { id:uid(), cols:1, bg:'#140b05', pt:72, pb:72, cols_data:[[
          de('badge',{text:'Save the Date',align:'center',bg:'rgba(201,123,58,0.15)',tc:'#e8a06a',pt:0,pb:0}),
          de('heading',{text:'Upcoming Events',fs:48,color:'#fffdf8',ff:'Playfair',align:'center',lh:1.08}),
        ]]},
        { id:uid(), cols:1, bg:'#fdf6ee', pt:52, pb:52, cols_data:[[
          de('event',{title:'Community Dinner',date:'Every Wednesday',time:'5:30 PM',loc:'Hope Outreach Center, Main Hall',tc:'#2c1a10',ac:'#c97b3a'}),
          de('event',{title:'Annual Gala',date:'October 11, 2026',time:'6:00 PM',loc:'Springfield Convention Center',tc:'#2c1a10',ac:'#c97b3a',pt:16}),
        ]]},
      ]},
      { id:uid(), name:'Get Involved', slug:'/give', rows:[
        { id:uid(), cols:1, bg:'#140b05', pt:80, pb:80, cols_data:[[
          de('badge',{text:'Make a Difference',align:'center',bg:'rgba(201,123,58,0.15)',tc:'#e8a06a',pt:0,pb:0}),
          de('heading',{text:'Give. Serve. Transform.',fs:48,color:'#fffdf8',ff:'Playfair',align:'center',lh:1.08}),
          de('text',{text:'Your time, talent, and treasure change lives. Here is how you can get involved.',fs:17,color:'rgba(255,253,248,0.5)',align:'center',pt:4,pb:0}),
        ]]},
        { id:uid(), cols:3, bg:'#fdf6ee', pt:56, pb:56, cols_data:[
          [de('feature',{icon:'💛',title:'Donate',body:'Every dollar goes directly to programs — no large overhead.',ic:'#c97b3a',tc:'#2c1a10',align:'center'}),de('button',{text:'Donate Now',bg:'#c97b3a',tc:'#ffffff',align:'center',pt:12,pb:0,br:4})],
          [de('feature',{icon:'🙌',title:'Volunteer',body:'Join 200+ volunteers serving weekly across all our programs.',ic:'#c97b3a',tc:'#2c1a10',align:'center'}),de('button',{text:'Sign Up',bg:'#c97b3a',tc:'#ffffff',align:'center',pt:12,pb:0,br:4})],
          [de('feature',{icon:'📢',title:'Spread the Word',body:'Share our mission with your network and help us grow our impact.',ic:'#c97b3a',tc:'#2c1a10',align:'center'})],
        ]},
      ]},
    ],
  },
  {
    id:'charismatic', name:'Arise Church', category:'Church', style:'Charismatic', palette:'arise',
    desc:'High-energy purple and white. For movement-driven, Spirit-filled ministries.',
    thumb:['#0d0515','#a855f7','#f8f0ff'],
    nav:{ style:'classic', showLogo:true, logo:'ARISE CHURCH', showCta:true, ctaText:'Watch Live', ctaHref:'/sermons',
      links:[{label:'Home',href:'/'},{label:'Messages',href:'/sermons'},{label:'Community',href:'/about'},{label:'Events',href:'/events'},{label:'Give',href:'/give'}],
      bg:'#0d0515', linkColor:'rgba(240,236,230,.6)', logoColor:'#c084fc', ctaBg:'#a855f7', ctaColor:'#ffffff' },
    pages:[
      { id:uid(), name:'Home', slug:'/', rows:[
        { id:uid(), cols:1, bg:'#0d0515', pt:104, pb:96, cols_data:[[
          de('badge',{text:'🔥  New Series: Walking in Power',align:'center',bg:'rgba(168,85,247,0.15)',tc:'#c084fc',pt:0,pb:0,fs:11}),
          de('heading',{text:'Arise. Shine.\nYour Light Has Come.',fs:60,color:'#faf0ff',ff:'Playfair',align:'center',lh:1.04,italic:true}),
          de('text',{text:'A Spirit-filled community pursuing God together. Sundays 10AM & 6PM.',fs:17,color:'rgba(250,240,255,0.5)',align:'center',pt:4,pb:0}),
          de('button',{text:'Experience Arise →',bg:'#a855f7',tc:'#ffffff',align:'center',pt:22,pb:0,br:12}),
        ]]},
        { id:uid(), cols:3, bg:'#1a0a2e', pt:60, pb:60, cols_data:[
          [de('feature',{icon:'🔥',title:'Prayer Nights',body:'Monday 7PM — Encounter God in corporate prayer and worship.',ic:'#c084fc',tc:'#faf0ff',bc:'rgba(250,240,255,0.4)',align:'center'})],
          [de('feature',{icon:'⚡',title:'Freedom Ministry',body:'Breaking chains through the power of the Holy Spirit.',ic:'#c084fc',tc:'#faf0ff',bc:'rgba(250,240,255,0.4)',align:'center'})],
          [de('feature',{icon:'🌊',title:'Healing Rooms',body:'Wednesday evenings — receive prayer for healing and breakthrough.',ic:'#c084fc',tc:'#faf0ff',bc:'rgba(250,240,255,0.4)',align:'center'})],
        ]},
      ]},
      { id:uid(), name:'Messages', slug:'/sermons', rows:[
        { id:uid(), cols:1, bg:'#0d0515', pt:72, pb:72, cols_data:[[
          de('badge',{text:'Watch & Listen',align:'center',bg:'rgba(168,85,247,0.15)',tc:'#c084fc',pt:0,pb:0}),
          de('heading',{text:'Messages',fs:52,color:'#faf0ff',ff:'Playfair',align:'center',lh:1.08}),
          de('text',{text:'Encounter the Word of God. Messages from every Sunday service available free.',fs:17,color:'rgba(250,240,255,0.5)',align:'center',pt:4,pb:0}),
        ]]},
        { id:uid(), cols:3, bg:'#1a0a2e', pt:56, pb:56, cols_data:[
          [de('feature',{icon:'▶',title:'Current Series: Walking in Power',body:'Week 4 — "Filled and Overflowing". Watch the latest message now.',ic:'#c084fc',tc:'#faf0ff',align:'center'}),de('button',{text:'Watch Now',bg:'#a855f7',tc:'#ffffff',align:'center',pt:12,pb:0,br:12})],
          [de('feature',{icon:'▶',title:'Previous: Fire & Glory',body:'An 8-week series on the gifts of the Holy Spirit.',ic:'#c084fc',tc:'#faf0ff',align:'center'}),de('button',{text:'Watch Series',bg:'rgba(168,85,247,0.2)',tc:'#c084fc',align:'center',pt:12,pb:0,br:12})],
          [de('feature',{icon:'🎙',title:'Podcast',body:'Subscribe to the Arise Church Podcast on Spotify and Apple Podcasts.',ic:'#c084fc',tc:'#faf0ff',align:'center'}),de('button',{text:'Subscribe',bg:'rgba(168,85,247,0.2)',tc:'#c084fc',align:'center',pt:12,pb:0,br:12})],
        ]},
      ]},
      { id:uid(), name:'Community', slug:'/about', rows:[
        { id:uid(), cols:1, bg:'#0d0515', pt:72, pb:72, cols_data:[[
          de('badge',{text:'Family',align:'center',bg:'rgba(168,85,247,0.15)',tc:'#c084fc',pt:0,pb:0}),
          de('heading',{text:'You Belong Here',fs:52,color:'#faf0ff',ff:'Playfair',align:'center',lh:1.08}),
          de('text',{text:'Arise is more than a church — it is a family. Find your place in community.',fs:17,color:'rgba(250,240,255,0.5)',align:'center',pt:4,pb:0}),
        ]]},
        { id:uid(), cols:3, bg:'#f8f0ff', pt:56, pb:56, cols_data:[
          [de('feature',{icon:'👶',title:'Arise Kids',body:'A safe and joyful environment for children from birth to Grade 5.',ic:'#a855f7',tc:'#0d0515',align:'center'})],
          [de('feature',{icon:'⚡',title:'Arise Youth',body:'Students in Grades 6–12 encountering God and building friendships.',ic:'#a855f7',tc:'#0d0515',align:'center'})],
          [de('feature',{icon:'🤝',title:'Life Groups',body:'Weekly small groups across the city — real community, real life.',ic:'#a855f7',tc:'#0d0515',align:'center'})],
        ]},
      ]},
      { id:uid(), name:'Events', slug:'/events', rows:[
        { id:uid(), cols:1, bg:'#0d0515', pt:72, pb:72, cols_data:[[
          de('badge',{text:'What\'s Happening',align:'center',bg:'rgba(168,85,247,0.15)',tc:'#c084fc',pt:0,pb:0}),
          de('heading',{text:'Events & Gatherings',fs:52,color:'#faf0ff',ff:'Playfair',align:'center',lh:1.08}),
        ]]},
        { id:uid(), cols:1, bg:'#1a0a2e', pt:52, pb:52, cols_data:[[
          de('event',{title:'Sunday Service',date:'Every Sunday',time:'10:00 AM & 6:00 PM',loc:'Arise Church — Main Auditorium',tc:'#faf0ff',ac:'#a855f7'}),
          de('event',{title:'Monday Prayer Night',date:'Every Monday',time:'7:00 PM',loc:'Prayer Room, Lower Level',tc:'#faf0ff',ac:'#a855f7',pt:16}),
          de('event',{title:'Arise Conference 2026',date:'August 20–22, 2026',time:'6 PM Nightly',loc:'Arise Church Main Hall',tc:'#faf0ff',ac:'#a855f7',pt:16}),
        ]]},
      ]},
      { id:uid(), name:'Give', slug:'/give', rows:[
        { id:uid(), cols:1, bg:'#0d0515', pt:80, pb:80, cols_data:[[
          de('badge',{text:'Generosity',align:'center',bg:'rgba(168,85,247,0.15)',tc:'#c084fc',pt:0,pb:0}),
          de('heading',{text:'Give to Arise Church',fs:48,color:'#faf0ff',ff:'Playfair',align:'center',lh:1.08}),
          de('text',{text:'Your generosity fuels everything — services, missions, community programs, and more.',fs:17,color:'rgba(250,240,255,0.5)',align:'center',pt:4,pb:0}),
          de('button',{text:'Give Now →',bg:'#a855f7',tc:'#ffffff',align:'center',pt:22,pb:0,br:12}),
        ]]},
        { id:uid(), cols:1, bg:'#1a0a2e', pt:56, pb:56, cols_data:[[
          de('quote',{text:'"Honor the Lord with your wealth and with the firstfruits of all your produce."',attr:'— Proverbs 3:9',bg:'rgba(168,85,247,0.08)',bc:'#a855f7',fs:20,color:'#faf0ff',align:'center'}),
        ]]},
      ]},
    ],
  },
  {
    id:'minimal_start', name:'Simple Start', category:'Any', style:'Minimal', palette:'cornerstone',
    desc:'A clean blank canvas — minimal styling. Ideal to build from scratch your way.',
    thumb:['#0f0e0c','#d4a843','#faf8f5'],
    nav:{ style:'minimal', showLogo:true, logo:'Your Church', showCta:true, ctaText:'Visit Us', ctaHref:'/events',
      links:[{label:'Home',href:'/'},{label:'About',href:'/about'},{label:'Sermons',href:'/sermons'},{label:'Events',href:'/events'},{label:'Contact',href:'/give'}],
      bg:'#ffffff', linkColor:'#475569', logoColor:'#0f172a', ctaBg:'#0f172a', ctaColor:'#ffffff', borderColor:'rgba(0,0,0,.07)' },
    pages:[
      { id:uid(), name:'Home', slug:'/', rows:[
        { id:uid(), cols:1, bg:'#0f0e0c', pt:80, pb:80, cols_data:[[
          de('heading',{text:'Your Church Name',fs:52,color:'#f8fafc',ff:'Playfair',align:'center'}),
          de('text',{text:'A community of faith in [Your City]. Join us every Sunday.',fs:17,color:'rgba(248,250,252,0.5)',align:'center',pt:5,pb:0}),
          de('button',{text:'Plan Your Visit',bg:'#d4a843',tc:'#1c0f00',align:'center',pt:18,pb:0}),
        ]]},
      ]},
      { id:uid(), name:'About', slug:'/about', rows:[
        { id:uid(), cols:1, bg:'#0f0e0c', pt:72, pb:72, cols_data:[[
          de('badge',{text:'Our Story',align:'center',pt:0,pb:0}),
          de('heading',{text:'About Us',fs:48,color:'#f8fafc',ff:'Playfair',align:'center'}),
          de('text',{text:'Tell the story of your church — your history, values, and vision for the community.',fs:17,color:'rgba(248,250,252,0.5)',align:'center',pt:4,pb:0}),
        ]]},
        { id:uid(), cols:1, bg:'#faf8f5', pt:60, pb:60, cols_data:[[
          de('text',{text:'Add your "About" content here. Share your mission, meet your team, and invite people into your community.',fs:15,color:'#5a5550',align:'center',lh:1.8}),
        ]]},
      ]},
      { id:uid(), name:'Sermons', slug:'/sermons', rows:[
        { id:uid(), cols:1, bg:'#0f0e0c', pt:72, pb:72, cols_data:[[
          de('badge',{text:'Messages',align:'center',pt:0,pb:0}),
          de('heading',{text:'Sermons',fs:48,color:'#f8fafc',ff:'Playfair',align:'center'}),
          de('text',{text:'Share your latest messages, sermon series, and teaching archive here.',fs:17,color:'rgba(248,250,252,0.5)',align:'center',pt:4,pb:0}),
        ]]},
        { id:uid(), cols:1, bg:'#faf8f5', pt:60, pb:60, cols_data:[[
          de('feature',{icon:'▶',title:'Current Series',body:'Add your current sermon series title and description here.',ic:'#d4a843',tc:'#1a1715',align:'center'}),
          de('button',{text:'Watch Latest Message →',bg:'#d4a843',tc:'#1c0f00',align:'center',pt:16,pb:0}),
        ]]},
      ]},
      { id:uid(), name:'Events', slug:'/events', rows:[
        { id:uid(), cols:1, bg:'#0f0e0c', pt:72, pb:72, cols_data:[[
          de('badge',{text:'What\'s On',align:'center',pt:0,pb:0}),
          de('heading',{text:'Upcoming Events',fs:48,color:'#f8fafc',ff:'Playfair',align:'center'}),
        ]]},
        { id:uid(), cols:1, bg:'#faf8f5', pt:52, pb:52, cols_data:[[
          de('event',{title:'Sunday Service',date:'Every Sunday',time:'10:00 AM',loc:'Your Church Address',tc:'#1a1715',ac:'#d4a843'}),
          de('event',{title:'Add Your Event',date:'Date',time:'Time',loc:'Location',tc:'#1a1715',ac:'#d4a843',pt:16}),
        ]]},
      ]},
      { id:uid(), name:'Contact', slug:'/give', rows:[
        { id:uid(), cols:1, bg:'#0f0e0c', pt:72, pb:72, cols_data:[[
          de('badge',{text:'Get in Touch',align:'center',pt:0,pb:0}),
          de('heading',{text:'Contact Us',fs:48,color:'#f8fafc',ff:'Playfair',align:'center'}),
          de('text',{text:'We\'d love to hear from you. Visit us on Sunday, send us a message, or drop by our office.',fs:17,color:'rgba(248,250,252,0.5)',align:'center',pt:4,pb:0}),
        ]]},
        { id:uid(), cols:3, bg:'#faf8f5', pt:56, pb:56, cols_data:[
          [de('feature',{icon:'📍',title:'Address',body:'123 Your Street, Your City, State ZIP',ic:'#d4a843',tc:'#1a1715',align:'center'})],
          [de('feature',{icon:'🕐',title:'Service Times',body:'Sundays at 10:00 AM\nWednesdays at 7:00 PM',ic:'#d4a843',tc:'#1a1715',align:'center'})],
          [de('feature',{icon:'✉️',title:'Email',body:'hello@yourchurch.com\nWe reply within 1 business day.',ic:'#d4a843',tc:'#1a1715',align:'center'})],
        ]},
      ]},
    ],
  },
  // ── 6: Cathedral ──────────────────────────────────────────────────
  {
    id:'cathedral', name:'Cathedral', category:'Church', style:'Luxury', palette:'cornerstone',
    desc:'Deep forest green, antique gold, and ornate elegance. For established, historic, or liturgical congregations.',
    thumb:['#1a2818','#c9a84c','#faf7f0'],
    nav:{ style:'centered', showLogo:true, logo:'✦ St. Augustine ✦', showCta:false,
      links:[{label:'Home',href:'/'},{label:'About',href:'/about'},{label:'Sermons',href:'/sermons'},{label:'Events',href:'/events'},{label:'Give',href:'/give'}],
      bg:'#1a2818', linkColor:'rgba(240,216,150,.65)', logoColor:'#c9a84c' },
    pages:[
      // ── Home ──────────────────────────────────────────────────────
      { id:uid(), name:'Home', slug:'/', rows:[
        // Hero — dark forest with ornamental feel
        { id:uid(), cols:1, bg:'#1a2818', pt:110, pb:100, cols_data:[[
          de('badge',{text:'✦  ✦  ✦',align:'center',bg:'transparent',tc:'#c9a84c',fs:18,pt:0,pb:4}),
          de('text',{text:'Est. 1892 · Springfield',fs:10,color:'rgba(201,168,76,.75)',align:'center',fw:'300',pt:0,pb:8}),
          de('heading',{text:'Where Ancient\nFaith Meets\nLiving Hearts.',fs:72,color:'#faf7f0',ff:'Playfair',align:'center',lh:1.0,fw:'300',italic:false}),
          de('divider',{color:'rgba(201,168,76,.25)',thick:1,w:30,pt:16,pb:4}),
          de('badge',{text:'✦ ◆ ✦',align:'center',bg:'transparent',tc:'rgba(201,168,76,.55)',fs:10,pt:0,pb:0}),
          de('divider',{color:'rgba(201,168,76,.25)',thick:1,w:30,pt:4,pb:16}),
          de('text',{text:'A congregation rooted in the historic faith, alive in the Spirit,\nand devoted to the transformation of souls and city.',fs:19,color:'rgba(250,247,240,.45)',align:'center',fw:'300',lh:1.7,pt:0,pb:8}),
          de('button',{text:'PLAN YOUR VISIT',bg:'#c9a84c',tc:'#1a2818',align:'center',pt:16,pb:4,fs:10,fw:'500',px:36,py:14}),
          de('button',{text:'OUR WORSHIP',style:'outline',bg:'transparent',tc:'rgba(250,247,240,.6)',align:'center',pt:4,pb:0,fs:10,fw:'300',px:34,py:13}),
        ]]},
        // Welcome — dark section
        { id:uid(), cols:1, bg:'#1a2818', pt:90, pb:90, cols_data:[[
          de('text',{text:'WELCOME',fs:9,color:'#c9a84c',align:'center',fw:'400',pt:0,pb:4}),
          de('heading',{text:'We are glad\nyou are here.',fs:52,color:'#faf7f0',ff:'Playfair',align:'center',lh:1.1,fw:'300'}),
          de('divider',{color:'rgba(201,168,76,.25)',thick:1,w:20,pt:12,pb:12}),
          de('text',{text:'For over a century, St. Augustine\'s has been a sanctuary for the weary, a school for the faithful, and a home for all who seek the living God. Whatever brought you here — you are welcome.',fs:18,color:'rgba(250,247,240,.45)',align:'center',fw:'300',lh:1.9,pt:0,pb:8}),
          de('button',{text:'READ OUR STORY',style:'outline',bg:'transparent',tc:'rgba(250,247,240,.6)',align:'center',pt:12,pb:4,fs:10,fw:'300',px:34,py:13}),
          de('text',{text:'123 Cathedral Lane · Springfield, BC · V3J 4K2',fs:10,color:'rgba(201,168,76,.55)',align:'center',fw:'300',pt:16,pb:0}),
        ]]},
        // About — 2-col image + text on cream
        { id:uid(), cols:2, bg:'#faf7f0', pt:80, pb:80, cols_data:[
          [de('image',{h:400,br:0,alt:'Church exterior',pt:0,pb:0})],
          [
            de('text',{text:'OUR STORY',fs:9,color:'#c9a84c',align:'left',fw:'400',pt:0,pb:4}),
            de('heading',{text:'A Church with\nDeep Roots.',fs:42,ff:'Playfair',color:'#1a1508',align:'left',lh:1.1,fw:'300'}),
            de('divider',{color:'rgba(201,168,76,.25)',thick:1,w:20,pt:12,pb:12}),
            de('text',{text:'Founded in 1892 by a small gathering of families committed to orthodox Christian faith, St. Augustine\'s has grown into a vibrant congregation of over 800 souls. We hold fast to what is true, beautiful, and good.',fs:17,color:'#6a5e42',align:'left',lh:1.85,fw:'300',pt:0}),
            de('button',{text:'OUR HISTORY',bg:'#c9a84c',tc:'#1a2818',align:'left',pt:20,pb:0,fs:10,fw:'500',px:30,py:13}),
          ],
        ]},
        // Services — dark
        { id:uid(), cols:1, bg:'#1a2818', pt:90, pb:90, cols_data:[[
          de('text',{text:"LORD'S DAY WORSHIP",fs:9,color:'#c9a84c',align:'center',fw:'400',pt:0,pb:4}),
          de('heading',{text:'Join Us for Worship',fs:48,color:'#faf7f0',ff:'Playfair',align:'center',lh:1.1,fw:'400'}),
          de('text',{text:'All are welcome at the table of grace.',fs:17,color:'rgba(250,247,240,.4)',align:'center',fw:'300',pt:4,pb:8}),
          de('event',{title:'Traditional Service',date:'Every Sunday',time:'8:00 AM',loc:'Main Sanctuary',tc:'#faf7f0',ac:'#c9a84c',bg:'rgba(201,168,76,.06)',border:'rgba(201,168,76,.25)',pt:16}),
          de('event',{title:'Contemporary Service',date:'Every Sunday',time:'10:00 AM',loc:'Main Sanctuary',tc:'#faf7f0',ac:'#c9a84c',bg:'rgba(201,168,76,.06)',border:'rgba(201,168,76,.25)',pt:12}),
          de('event',{title:'Evening Prayer',date:'Every Sunday',time:'6:00 PM',loc:'Chapel',tc:'#faf7f0',ac:'#c9a84c',bg:'rgba(201,168,76,.06)',border:'rgba(201,168,76,.25)',pt:12}),
          de('text',{text:'✦  123 Cathedral Lane · Springfield, BC  ✦',fs:10,color:'rgba(201,168,76,.55)',align:'center',fw:'300',pt:24,pb:0}),
        ]]},
        // Pillars — cream
        { id:uid(), cols:1, bg:'#f3ede0', pt:80, pb:16, cols_data:[[
          de('text',{text:'WHAT WE BELIEVE',fs:9,color:'#c9a84c',align:'center',fw:'400',pt:0,pb:4}),
          de('heading',{text:'The Faith Once for\nAll Delivered.',fs:48,ff:'Playfair',color:'#1a1508',align:'center',lh:1.1,fw:'300'}),
        ]]},
        { id:uid(), cols:3, bg:'#f3ede0', pt:16, pb:80, cols_data:[
          [
            de('text',{text:'I',fs:11,color:'#c9a84c',align:'center',fw:'400',pt:0,pb:4}),
            de('badge',{text:'✦',align:'center',bg:'transparent',tc:'rgba(201,168,76,.7)',fs:18,pt:0,pb:4}),
            de('heading',{text:'Holy Scripture',fs:24,ff:'Playfair',color:'#1a1508',align:'center',lh:1.2,fw:'400'}),
            de('text',{text:'We hold the Bible to be the inspired, infallible Word of God — the supreme authority for faith and life.',fs:13,color:'#6a5e42',align:'center',lh:1.85,fw:'300',pt:4}),
          ],
          [
            de('text',{text:'II',fs:11,color:'#c9a84c',align:'center',fw:'400',pt:0,pb:4}),
            de('badge',{text:'◈',align:'center',bg:'transparent',tc:'rgba(201,168,76,.7)',fs:18,pt:0,pb:4}),
            de('heading',{text:'The Sacraments',fs:24,ff:'Playfair',color:'#1a1508',align:'center',lh:1.2,fw:'400'}),
            de('text',{text:'We celebrate Baptism and the Lord\'s Supper as means of grace instituted by Christ himself.',fs:13,color:'#6a5e42',align:'center',lh:1.85,fw:'300',pt:4}),
          ],
          [
            de('text',{text:'III',fs:11,color:'#c9a84c',align:'center',fw:'400',pt:0,pb:4}),
            de('badge',{text:'◆',align:'center',bg:'transparent',tc:'rgba(201,168,76,.7)',fs:18,pt:0,pb:4}),
            de('heading',{text:'The Community',fs:24,ff:'Playfair',color:'#1a1508',align:'center',lh:1.2,fw:'400'}),
            de('text',{text:'We are one body — confessing our need, bearing one another\'s burdens, and walking together toward glory.',fs:13,color:'#6a5e42',align:'center',lh:1.85,fw:'300',pt:4}),
          ],
        ]},
        // Quote — dark forest
        { id:uid(), cols:1, bg:'#223320', pt:100, pb:100, cols_data:[[
          de('quote',{text:'"Come to me, all you who are weary and burdened, and I will give you rest."',attr:'— Matthew 11:28',bg:'transparent',bc:'#c9a84c',fs:32,color:'#faf7f0',align:'center'}),
        ]]},
        // Ministries — 4-col on cream
        { id:uid(), cols:1, bg:'#faf7f0', pt:80, pb:16, cols_data:[[
          de('text',{text:'GET INVOLVED',fs:9,color:'#c9a84c',align:'center',fw:'400',pt:0,pb:4}),
          de('heading',{text:'Find Your Place\nin the Body.',fs:44,ff:'Playfair',color:'#1a1508',align:'center',lh:1.1,fw:'300'}),
        ]]},
        { id:uid(), cols:4, bg:'#faf7f0', pt:16, pb:80, cols_data:[
          [de('feature',{icon:'✦',title:'Worship',body:'Encounter the living God through sacred music and liturgy.',ic:'#c9a84c',tc:'#1a1508',bc:'#6a5e42',align:'center'})],
          [de('feature',{icon:'◈',title:'Community',body:'Small groups rooted in prayer, Scripture, and fellowship.',ic:'#c9a84c',tc:'#1a1508',bc:'#6a5e42',align:'center'})],
          [de('feature',{icon:'◆',title:'Youth',body:'Forming the next generation in faith, virtue, and purpose.',ic:'#c9a84c',tc:'#1a1508',bc:'#6a5e42',align:'center'})],
          [de('feature',{icon:'☩',title:'Missions',body:'Serving the poor and proclaiming the Gospel to the nations.',ic:'#c9a84c',tc:'#1a1508',bc:'#6a5e42',align:'center'})],
        ]},
        // CTA — dark with ornamental feel
        { id:uid(), cols:1, bg:'#1a2818', pt:110, pb:110, cols_data:[[
          de('text',{text:'NEXT STEPS',fs:9,color:'#c9a84c',align:'center',fw:'400',pt:0,pb:4}),
          de('heading',{text:'Ready to Find\nYour Home?',fs:56,color:'#faf7f0',ff:'Playfair',align:'center',lh:1.1,fw:'300'}),
          de('divider',{color:'rgba(201,168,76,.25)',thick:1,w:20,pt:12,pb:12}),
          de('text',{text:'We would love to welcome you. Come as you are.',fs:18,color:'rgba(250,247,240,.4)',align:'center',fw:'300',lh:1.7,pt:0,pb:8}),
          de('button',{text:'PLAN A VISIT',bg:'#c9a84c',tc:'#1a2818',align:'center',pt:16,pb:4,fs:10,fw:'500',px:36,py:14}),
          de('button',{text:'CONTACT US',style:'outline',bg:'transparent',tc:'rgba(250,247,240,.6)',align:'center',pt:4,pb:0,fs:10,fw:'300',px:34,py:13}),
        ]]},
      ]},
      // ── About ─────────────────────────────────────────────────────
      { id:uid(), name:'About', slug:'/about', rows:[
        { id:uid(), cols:1, bg:'#1a2818', pt:80, pb:80, cols_data:[[
          de('text',{text:'OUR STORY',fs:9,color:'#c9a84c',align:'center',fw:'400',pt:0,pb:4}),
          de('heading',{text:'About St. Augustine\'s',fs:48,color:'#faf7f0',ff:'Playfair',align:'center',lh:1.08,fw:'300'}),
          de('text',{text:'A congregation of faith, beauty, and grace in the heart of Springfield since 1892.',fs:17,color:'rgba(250,247,240,.45)',align:'center',fw:'300',pt:4,pb:0}),
        ]]},
        { id:uid(), cols:2, bg:'#faf7f0', pt:70, pb:70, cols_data:[
          [de('image',{h:380,br:0,alt:'Church interior'})],
          [
            de('text',{text:'OUR HISTORY',fs:9,color:'#c9a84c',align:'left',fw:'400',pt:0,pb:4}),
            de('heading',{text:'Founded on Faith,\nBuilt by Grace.',fs:34,ff:'Playfair',color:'#1a1508',align:'left',lh:1.1,fw:'300'}),
            de('text',{text:'What began as a handful of families gathering in a Springfield parlor in 1892 has grown into a vibrant congregation of over 800 members. Through wars, depression, and cultural change, St. Augustine\'s has stood firm on the unchanging truth of the Gospel.',fs:14,color:'#6a5e42',align:'left',lh:1.85,fw:'300',pt:4}),
            de('text',{text:'Sunday Services: 8 AM · 10 AM · 6 PM\n📍 123 Cathedral Lane, Springfield, BC',fs:13,color:'#6a5e42',align:'left',fw:'400',pt:12}),
          ],
        ]},
        { id:uid(), cols:3, bg:'#f3ede0', pt:60, pb:60, cols_data:[
          [de('feature',{icon:'✦',title:'Our Values',body:'Beauty, truth, and goodness — in worship, in teaching, and in community life.',ic:'#c9a84c',tc:'#1a1508',bc:'#6a5e42',align:'center'})],
          [de('feature',{icon:'◈',title:'Our Mission',body:'To glorify God by making disciples rooted in the historic Christian faith.',ic:'#c9a84c',tc:'#1a1508',bc:'#6a5e42',align:'center'})],
          [de('feature',{icon:'◆',title:'Our Staff',body:'A dedicated team of pastors, deacons, and lay leaders serving with reverence and joy.',ic:'#c9a84c',tc:'#1a1508',bc:'#6a5e42',align:'center'})],
        ]},
      ]},
      // ── Sermons ───────────────────────────────────────────────────
      { id:uid(), name:'Sermons', slug:'/sermons', rows:[
        { id:uid(), cols:1, bg:'#1a2818', pt:80, pb:80, cols_data:[[
          de('text',{text:'THE WORD PREACHED',fs:9,color:'#c9a84c',align:'center',fw:'400',pt:0,pb:4}),
          de('heading',{text:'Sermons & Teaching',fs:48,color:'#faf7f0',ff:'Playfair',align:'center',lh:1.08,fw:'300'}),
          de('text',{text:'Listen to the faithful exposition of God\'s Word. New sermons every Lord\'s Day.',fs:17,color:'rgba(250,247,240,.45)',align:'center',fw:'300',pt:4,pb:0}),
        ]]},
        { id:uid(), cols:3, bg:'#faf7f0', pt:60, pb:60, cols_data:[
          [de('feature',{icon:'▶',title:'Current Series',body:'"The Book of Romans" — Week 12. Verse-by-verse through Paul\'s magnum opus.',ic:'#c9a84c',tc:'#1a1508',align:'center'}),de('button',{text:'LISTEN NOW',bg:'#c9a84c',tc:'#1a2818',align:'center',pt:12,pb:0,fs:10,fw:'500',px:24,py:11})],
          [de('feature',{icon:'▶',title:'Past Series',body:'"The Psalms of Ascent" — 15 sermons on the pilgrim songs of Israel.',ic:'#c9a84c',tc:'#1a1508',align:'center'}),de('button',{text:'BROWSE ARCHIVE',bg:'#1a2818',tc:'#faf7f0',align:'center',pt:12,pb:0,fs:10,fw:'500',px:24,py:11})],
          [de('feature',{icon:'▶',title:'Topical Messages',body:'Marriage, suffering, prayer, vocation, the sacraments, and more.',ic:'#c9a84c',tc:'#1a1508',align:'center'}),de('button',{text:'BROWSE ALL',bg:'#1a2818',tc:'#faf7f0',align:'center',pt:12,pb:0,fs:10,fw:'500',px:24,py:11})],
        ]},
        { id:uid(), cols:1, bg:'#223320', pt:60, pb:60, cols_data:[[
          de('heading',{text:'Subscribe to Our Podcast',fs:34,color:'#faf7f0',ff:'Playfair',align:'center',fw:'300'}),
          de('text',{text:'Listen on Spotify, Apple Podcasts, or wherever you get your podcasts.',fs:15,color:'rgba(250,247,240,.45)',align:'center',fw:'300',pt:4,pb:0}),
          de('button',{text:'SUBSCRIBE →',bg:'#c9a84c',tc:'#1a2818',align:'center',pt:18,pb:0,fs:10,fw:'500',px:30,py:13}),
        ]]},
      ]},
      // ── Events ────────────────────────────────────────────────────
      { id:uid(), name:'Events', slug:'/events', rows:[
        { id:uid(), cols:1, bg:'#1a2818', pt:80, pb:80, cols_data:[[
          de('text',{text:'THE CHURCH CALENDAR',fs:9,color:'#c9a84c',align:'center',fw:'400',pt:0,pb:4}),
          de('heading',{text:'Upcoming Events',fs:48,color:'#faf7f0',ff:'Playfair',align:'center',lh:1.08,fw:'300'}),
          de('text',{text:'Worship, fellowship, and service — the rhythm of life at St. Augustine\'s.',fs:17,color:'rgba(250,247,240,.45)',align:'center',fw:'300',pt:4,pb:0}),
        ]]},
        { id:uid(), cols:1, bg:'#faf7f0', pt:56, pb:56, cols_data:[[
          de('event',{title:'Sunday Worship',date:'Every Lord\'s Day',time:'8:00 AM · 10:00 AM · 6:00 PM',loc:'123 Cathedral Lane, Springfield',tc:'#1a1508',ac:'#c9a84c'}),
          de('event',{title:'Advent Lessons & Carols',date:'December 21, 2026',time:'7:00 PM',loc:'Main Sanctuary',tc:'#1a1508',ac:'#c9a84c',pt:16}),
          de('event',{title:'Men\'s Theology Breakfast',date:'First Saturday Monthly',time:'8:00 AM',loc:'Parish Hall',tc:'#1a1508',ac:'#c9a84c',pt:16}),
          de('event',{title:'Women\'s Retreat',date:'March 14–16, 2027',time:'Fri 5 PM — Sun 12 PM',loc:'Cedar Lodge, Lake Country',tc:'#1a1508',ac:'#c9a84c',pt:16}),
        ]]},
        { id:uid(), cols:1, bg:'#f3ede0', pt:56, pb:56, cols_data:[[
          de('heading',{text:'Small Groups & Bible Studies',fs:34,ff:'Playfair',color:'#1a1508',align:'center',fw:'300'}),
          de('text',{text:'Midweek groups meet in homes throughout Springfield. Find a group and grow deeper in faith and friendship.',fs:15,color:'#6a5e42',align:'center',lh:1.8,fw:'300',pt:4,pb:0}),
          de('button',{text:'FIND A GROUP →',bg:'#c9a84c',tc:'#1a2818',align:'center',pt:18,pb:0,fs:10,fw:'500',px:30,py:13}),
        ]]},
      ]},
      // ── Give ──────────────────────────────────────────────────────
      { id:uid(), name:'Give', slug:'/give', rows:[
        { id:uid(), cols:1, bg:'#1a2818', pt:80, pb:80, cols_data:[[
          de('text',{text:'STEWARDSHIP',fs:9,color:'#c9a84c',align:'center',fw:'400',pt:0,pb:4}),
          de('heading',{text:'Faithful Giving,\nLasting Impact.',fs:52,color:'#faf7f0',ff:'Playfair',align:'center',lh:1.1,fw:'300'}),
          de('text',{text:'Your generosity funds the work of the Gospel here in Springfield and to the ends of the earth.',fs:17,color:'rgba(250,247,240,.45)',align:'center',fw:'300',pt:4,pb:0}),
          de('button',{text:'GIVE ONLINE',bg:'#c9a84c',tc:'#1a2818',align:'center',pt:22,pb:0,fs:10,fw:'500',px:36,py:14}),
        ]]},
        { id:uid(), cols:3, bg:'#faf7f0', pt:60, pb:60, cols_data:[
          [de('feature',{icon:'✦',title:'Online Giving',body:'Give securely from any device — one-time or recurring.',ic:'#c9a84c',tc:'#1a1508',align:'center'}),de('button',{text:'GIVE NOW',bg:'#c9a84c',tc:'#1a2818',align:'center',pt:12,pb:0,fs:10,fw:'500',px:24,py:11})],
          [de('feature',{icon:'◈',title:'Legacy Giving',body:'Leave a lasting gift to the church through a planned estate bequest.',ic:'#c9a84c',tc:'#1a1508',align:'center'}),de('button',{text:'LEARN MORE',bg:'#1a2818',tc:'#faf7f0',align:'center',pt:12,pb:0,fs:10,fw:'500',px:24,py:11})],
          [de('feature',{icon:'◆',title:'In Person',body:'Place your offering in the plate during any Sunday service.',ic:'#c9a84c',tc:'#1a1508',align:'center'})],
        ]},
        { id:uid(), cols:1, bg:'#f3ede0', pt:56, pb:56, cols_data:[[
          de('quote',{text:'"Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver."',attr:'— 2 Corinthians 9:7',bg:'#faf7f0',bc:'#c9a84c',fs:18,color:'#1a1508',align:'center'}),
        ]]},
      ]},
    ],
  },
  // ── 7: Haven Church ───────────────────────────────────────────────
  {
    id:'haven', name:'Haven Church', category:'Church', style:'Organic', palette:'harvest',
    desc:'Warm terracotta, sage green, and rounded softness. Intimate, welcoming, and full of heart. Perfect for small or growing communities.',
    thumb:['#faf5ee','#c4673a','#7a9e7e'],
    nav:{ style:'minimal', showLogo:true, logo:'Haven 🌿 Church', showCta:true, ctaText:'Join Us ☀', ctaHref:'/contact',
      links:[{label:'Home',href:'/'},{label:'About',href:'/about'},{label:'Sermons',href:'/sermons'},{label:'Events',href:'/events'},{label:'Give',href:'/give'}],
      bg:'#faf5ee', linkColor:'rgba(44,31,20,.7)', logoColor:'#2c1f14', ctaBg:'#c4673a', ctaColor:'#ffffff', borderColor:'rgba(44,31,20,.08)', ctaBr:30 },
    pages:[
      // ── Home ──────────────────────────────────────────────────────
      { id:uid(), name:'Home', slug:'/', rows:[
        // Hero — warm blush with organic feel
        { id:uid(), cols:2, bg:'#f5e6d8', pt:80, pb:80, cols_data:[
          [
            de('badge',{text:'✨ you\'re welcome here',align:'left',bg:'rgba(196,103,58,.1)',tc:'#c4673a',fs:13,br:30,pt:0,pb:4}),
            de('heading',{text:'A place to\nrest, grow,',fs:56,color:'#2c1f14',ff:'Playfair',align:'left',lh:1.08}),
            de('heading',{text:'& belong.',fs:52,color:'#7a9e7e',ff:'Playfair',align:'left',lh:1.1,italic:true,pt:0}),
            de('text',{text:'We\'re a small, warm community of imperfect people growing together in faith, love, and life. Come as you are — really.',fs:15,color:'#7a6558',align:'left',lh:1.85,pt:4,pb:0}),
            de('button',{text:'Plan a Visit 🌸',bg:'#c4673a',tc:'#ffffff',align:'left',pt:20,pb:4,br:30,px:28,py:13}),
            de('button',{text:'Learn More',style:'outline',bg:'rgba(122,158,126,.1)',tc:'#7a9e7e',align:'left',pt:4,pb:0,br:30,px:26,py:12}),
          ],
          [de('image',{h:440,br:60,alt:'Church photo',pt:0,pb:0})],
        ]},
        // Welcome — cream
        { id:uid(), cols:1, bg:'#faf5ee', pt:90, pb:90, cols_data:[[
          de('badge',{text:'🌼',align:'center',bg:'transparent',tc:'#c4673a',fs:24,pt:0,pb:4}),
          de('text',{text:'a warm welcome',fs:18,color:'#c4673a',align:'center',fw:'500',pt:0,pb:4}),
          de('heading',{text:'Whoever you are,\nyou belong here.',fs:48,color:'#2c1f14',ff:'Playfair',align:'center',lh:1.1}),
          de('text',{text:'Haven Church is a place where real people bring their real lives. No performance, no pretending. Just a community learning to love God and each other — messy, beautiful, and together.',fs:16,color:'#7a6558',align:'center',lh:1.9,pt:4,pb:8}),
          de('button',{text:'Read Our Story 🌿',bg:'#c4673a',tc:'#ffffff',align:'center',pt:12,pb:0,br:30,px:28,py:13}),
        ]]},
        // Services — warm blush cards
        { id:uid(), cols:1, bg:'#eeddd0', pt:80, pb:24, cols_data:[[
          de('text',{text:'join us',fs:18,color:'#c4673a',align:'center',fw:'500',pt:0,pb:4}),
          de('heading',{text:'We gather every Sunday',fs:44,color:'#2c1f14',ff:'Playfair',align:'center',lh:1.1}),
          de('text',{text:'come exactly as you are 🌸',fs:20,color:'#7a9e7e',align:'center',fw:'500',pt:4,pb:0}),
        ]]},
        { id:uid(), cols:3, bg:'#eeddd0', pt:24, pb:80, cols_data:[
          [
            de('badge',{text:'☀️',align:'center',bg:'transparent',tc:'#c4673a',fs:24,pt:0,pb:4}),
            de('heading',{text:'9:00 AM',fs:28,color:'#c4673a',ff:'Playfair',align:'center',lh:1.0}),
            de('text',{text:'First Service',fs:12,color:'#7a6558',align:'center',pt:2,pb:0}),
          ],
          [
            de('badge',{text:'🌿',align:'center',bg:'transparent',tc:'#7a9e7e',fs:24,pt:0,pb:4}),
            de('heading',{text:'11:00 AM',fs:28,color:'#c4673a',ff:'Playfair',align:'center',lh:1.0}),
            de('text',{text:'Main Service',fs:12,color:'#7a6558',align:'center',pt:2,pb:0}),
          ],
          [
            de('badge',{text:'🌙',align:'center',bg:'transparent',tc:'#7a6558',fs:24,pt:0,pb:4}),
            de('heading',{text:'6:00 PM',fs:28,color:'#c4673a',ff:'Playfair',align:'center',lh:1.0}),
            de('text',{text:'Evening Gathering',fs:12,color:'#7a6558',align:'center',pt:2,pb:0}),
          ],
        ]},
        // About split — image + text
        { id:uid(), cols:2, bg:'#e8f0e8', pt:0, pb:0, cols_data:[
          [de('image',{h:420,br:0,alt:'Church community',pt:0,pb:0})],
          [
            de('text',{text:'our story',fs:18,color:'#c4673a',align:'left',fw:'500',pt:40,pb:4}),
            de('heading',{text:'We started small.\nWe\'re still learning.',fs:38,ff:'Playfair',color:'#2c1f14',align:'left',lh:1.12}),
            de('text',{text:'Haven started in 2018 as a living room gathering of six people who just wanted to read Scripture and eat together. Six years later we\'re a family of 200+ — and the living room spirit never left.',fs:15,color:'#7a6558',align:'left',lh:1.9,pt:4}),
            de('button',{text:'Meet Our Team 🌿',bg:'#c4673a',tc:'#ffffff',align:'left',pt:18,pb:40,br:30,px:28,py:13}),
          ],
        ]},
        // Quote — soft blush
        { id:uid(), cols:1, bg:'#f5e6d8', pt:90, pb:90, cols_data:[[
          de('badge',{text:'🌸',align:'center',bg:'transparent',tc:'#c4673a',fs:20,pt:0,pb:8}),
          de('quote',{text:'"She is more precious than rubies; nothing you desire can compare with her."',attr:'Proverbs 3:15 — our life verse',bg:'transparent',bc:'#c4673a',fs:28,color:'#2c1f14',align:'center'}),
        ]]},
        // Features — 3-col on cream
        { id:uid(), cols:1, bg:'#faf5ee', pt:80, pb:16, cols_data:[[
          de('text',{text:'how we grow',fs:18,color:'#c4673a',align:'center',fw:'500',pt:0,pb:4}),
          de('heading',{text:'A place for every season.',fs:42,ff:'Playfair',color:'#2c1f14',align:'center',lh:1.1}),
        ]]},
        { id:uid(), cols:3, bg:'#faf5ee', pt:16, pb:80, cols_data:[
          [de('feature',{icon:'📖',title:'Sunday Gatherings',body:'Warm, accessible worship and teaching every Sunday morning. Come hungry, leave fed.',ic:'#c4673a',tc:'#2c1f14',bc:'#7a6558',align:'center'})],
          [de('feature',{icon:'🌿',title:'Small Groups',body:'Life happens in community. Our small groups meet in homes throughout the week.',ic:'#7a9e7e',tc:'#2c1f14',bc:'#7a6558',align:'center'})],
          [de('feature',{icon:'🤝',title:'Serve Together',body:'From food banks to kids ministry, there are endless ways to give your hands and heart.',ic:'#c4673a',tc:'#2c1f14',bc:'#7a6558',align:'center'})],
        ]},
        // Community — sage green
        { id:uid(), cols:1, bg:'#7a9e7e', pt:80, pb:80, cols_data:[[
          de('text',{text:'get involved',fs:18,color:'rgba(255,255,255,.7)',align:'center',fw:'500',pt:0,pb:4}),
          de('heading',{text:'Find your people.',fs:44,color:'#ffffff',ff:'Playfair',align:'center',lh:1.1}),
          de('text',{text:'there\'s a spot here for you 🌸',fs:20,color:'rgba(255,255,255,.7)',align:'center',fw:'500',pt:4,pb:8}),
          de('list',{style:'none',items:["Women's Circle","Men's Breakfast","Youth Group","Kids Church","Young Adults","Prayer Team","Worship Team","Outreach"],fs:13,color:'#ffffff',ic:'#ffffff',align:'center',pt:8,pb:8}),
          de('button',{text:'Find a Group →',style:'outline',bg:'transparent',tc:'#ffffff',align:'center',pt:12,pb:0,br:30,px:30,py:13}),
        ]]},
        // CTA — warm cream
        { id:uid(), cols:1, bg:'#f3ebe0', pt:100, pb:100, cols_data:[[
          de('text',{text:'ready to visit?',fs:18,color:'#c4673a',align:'center',fw:'500',pt:0,pb:4}),
          de('heading',{text:'We\'ve been\nwaiting for you.',fs:52,color:'#2c1f14',ff:'Playfair',align:'center',lh:1.1}),
          de('text',{text:'No dress code, no expectations. Just come as you are and see what it feels like.',fs:15,color:'#7a6558',align:'center',lh:1.85,pt:4,pb:8}),
          de('button',{text:'Plan My Visit 🌸',bg:'#c4673a',tc:'#ffffff',align:'center',pt:16,pb:4,br:30,px:28,py:13}),
          de('button',{text:'Watch Online',style:'outline',bg:'transparent',tc:'#c4673a',align:'center',pt:4,pb:0,br:30,px:28,py:12}),
        ]]},
      ]},
      // ── About ─────────────────────────────────────────────────────
      { id:uid(), name:'About', slug:'/about', rows:[
        { id:uid(), cols:1, bg:'#f5e6d8', pt:80, pb:80, cols_data:[[
          de('text',{text:'our story',fs:18,color:'#c4673a',align:'center',fw:'500',pt:0,pb:4}),
          de('heading',{text:'About Haven Church',fs:48,color:'#2c1f14',ff:'Playfair',align:'center',lh:1.08}),
          de('text',{text:'A warm, imperfect community growing together in Springfield since 2018.',fs:16,color:'#7a6558',align:'center',pt:4,pb:0}),
        ]]},
        { id:uid(), cols:2, bg:'#faf5ee', pt:70, pb:70, cols_data:[
          [de('image',{h:380,br:24,alt:'Church gathering'})],
          [
            de('text',{text:'how it started',fs:18,color:'#c4673a',align:'left',fw:'500',pt:0,pb:4}),
            de('heading',{text:'Six people.\nOne living room.\nA lot of love.',fs:34,ff:'Playfair',color:'#2c1f14',align:'left',lh:1.12}),
            de('text',{text:'What began as a handful of friends reading Scripture over coffee has grown into a family of 200+ who still believe church should feel like home. We value authenticity over performance and presence over production.',fs:14,color:'#7a6558',align:'left',lh:1.9,pt:4}),
            de('text',{text:'Sundays at 9 AM · 11 AM · 6 PM\n📍 123 Maple Street, Springfield, BC',fs:13,color:'#7a6558',align:'left',fw:'500',pt:12}),
          ],
        ]},
        { id:uid(), cols:3, bg:'#f3ebe0', pt:60, pb:60, cols_data:[
          [de('feature',{icon:'🌿',title:'Our Values',body:'Authenticity, generosity, and grace — in everything we do.',ic:'#7a9e7e',tc:'#2c1f14',bc:'#7a6558',align:'center'})],
          [de('feature',{icon:'🌸',title:'Our Mission',body:'To be a place where everyone can rest, grow, and belong — no matter their story.',ic:'#c4673a',tc:'#2c1f14',bc:'#7a6558',align:'center'})],
          [de('feature',{icon:'☀️',title:'Our Team',body:'A small, dedicated group of pastors and volunteers serving with joy and openness.',ic:'#c4673a',tc:'#2c1f14',bc:'#7a6558',align:'center'})],
        ]},
      ]},
      // ── Sermons ───────────────────────────────────────────────────
      { id:uid(), name:'Sermons', slug:'/sermons', rows:[
        { id:uid(), cols:1, bg:'#f5e6d8', pt:80, pb:80, cols_data:[[
          de('text',{text:'the word',fs:18,color:'#c4673a',align:'center',fw:'500',pt:0,pb:4}),
          de('heading',{text:'Sermons & Messages',fs:48,color:'#2c1f14',ff:'Playfair',align:'center',lh:1.08}),
          de('text',{text:'Honest, down-to-earth teaching that meets you where you are. New messages every Sunday.',fs:16,color:'#7a6558',align:'center',pt:4,pb:0}),
        ]]},
        { id:uid(), cols:3, bg:'#faf5ee', pt:60, pb:60, cols_data:[
          [de('feature',{icon:'▶',title:'Current Series',body:'"Finding Home" — Week 3 of 6. What it means to truly belong.',ic:'#c4673a',tc:'#2c1f14',align:'center'}),de('button',{text:'Watch Now',bg:'#c4673a',tc:'#ffffff',align:'center',pt:12,pb:0,br:30})],
          [de('feature',{icon:'▶',title:'Previous Series',body:'"Rooted" — An 8-week journey through the Psalms.',ic:'#c4673a',tc:'#2c1f14',align:'center'}),de('button',{text:'Watch Now',bg:'#2c1f14',tc:'#faf5ee',align:'center',pt:12,pb:0,br:30})],
          [de('feature',{icon:'▶',title:'Topical Messages',body:'Browse by topic — Anxiety, Friendship, Purpose, Rest, and more.',ic:'#c4673a',tc:'#2c1f14',align:'center'}),de('button',{text:'Browse All',bg:'#2c1f14',tc:'#faf5ee',align:'center',pt:12,pb:0,br:30})],
        ]},
        { id:uid(), cols:1, bg:'#e8f0e8', pt:56, pb:56, cols_data:[[
          de('heading',{text:'Listen on the Go 🎧',fs:34,color:'#2c1f14',ff:'Playfair',align:'center'}),
          de('text',{text:'Subscribe to the Haven Church Podcast on Spotify, Apple Podcasts, or wherever you listen.',fs:15,color:'#7a6558',align:'center',pt:4,pb:0}),
          de('button',{text:'Subscribe to Podcast →',bg:'#c4673a',tc:'#ffffff',align:'center',pt:18,pb:0,br:30}),
        ]]},
      ]},
      // ── Events ────────────────────────────────────────────────────
      { id:uid(), name:'Events', slug:'/events', rows:[
        { id:uid(), cols:1, bg:'#f5e6d8', pt:80, pb:80, cols_data:[[
          de('text',{text:'what\'s happening',fs:18,color:'#c4673a',align:'center',fw:'500',pt:0,pb:4}),
          de('heading',{text:'Upcoming Events',fs:48,color:'#2c1f14',ff:'Playfair',align:'center',lh:1.08}),
          de('text',{text:'Gather, grow, and have fun — there\'s always something happening at Haven.',fs:16,color:'#7a6558',align:'center',pt:4,pb:0}),
        ]]},
        { id:uid(), cols:1, bg:'#faf5ee', pt:52, pb:52, cols_data:[[
          de('event',{title:'Sunday Gathering',date:'Every Sunday',time:'9 AM · 11 AM · 6 PM',loc:'123 Maple Street, Springfield',tc:'#2c1f14',ac:'#c4673a',br:20}),
          de('event',{title:'Women\'s Circle',date:'Every Tuesday',time:'7:00 PM',loc:'Haven Church — Room 3',tc:'#2c1f14',ac:'#c4673a',br:20,pt:16}),
          de('event',{title:'Summer Picnic 🌻',date:'July 12, 2026',time:'11:00 AM — 3:00 PM',loc:'Riverside Park, Springfield',tc:'#2c1f14',ac:'#c4673a',br:20,pt:16}),
          de('event',{title:'Youth Camp',date:'August 4–8, 2026',time:'Mon–Fri',loc:'Cedar Ridge Camp',tc:'#2c1f14',ac:'#c4673a',br:20,pt:16}),
        ]]},
        { id:uid(), cols:1, bg:'#f3ebe0', pt:56, pb:56, cols_data:[[
          de('heading',{text:'Small Groups 🌿',fs:34,ff:'Playfair',color:'#2c1f14',align:'center'}),
          de('text',{text:'Life is better in community. Find a group that meets near you — in homes, in coffee shops, and online.',fs:15,color:'#7a6558',align:'center',lh:1.8,pt:4,pb:0}),
          de('button',{text:'Find a Group →',bg:'#c4673a',tc:'#ffffff',align:'center',pt:18,pb:0,br:30}),
        ]]},
      ]},
      // ── Give ──────────────────────────────────────────────────────
      { id:uid(), name:'Give', slug:'/give', rows:[
        { id:uid(), cols:1, bg:'#f5e6d8', pt:80, pb:80, cols_data:[[
          de('text',{text:'generosity',fs:18,color:'#c4673a',align:'center',fw:'500',pt:0,pb:4}),
          de('heading',{text:'Give to Haven Church',fs:48,color:'#2c1f14',ff:'Playfair',align:'center',lh:1.08}),
          de('text',{text:'Your generosity makes everything we do possible. Every gift — big or small — makes a real difference.',fs:16,color:'#7a6558',align:'center',pt:4,pb:0}),
          de('button',{text:'Give Online 🌸',bg:'#c4673a',tc:'#ffffff',align:'center',pt:22,pb:0,br:30,px:28,py:13}),
        ]]},
        { id:uid(), cols:3, bg:'#faf5ee', pt:60, pb:60, cols_data:[
          [de('feature',{icon:'🌸',title:'Online Giving',body:'Give securely from any device — one-time or recurring.',ic:'#c4673a',tc:'#2c1f14',align:'center'}),de('button',{text:'Give Now',bg:'#c4673a',tc:'#ffffff',align:'center',pt:12,pb:0,br:30})],
          [de('feature',{icon:'🌿',title:'Auto-Give',body:'Set up a recurring gift so you never miss a chance to be generous.',ic:'#7a9e7e',tc:'#2c1f14',align:'center'}),de('button',{text:'Set Up',bg:'#2c1f14',tc:'#faf5ee',align:'center',pt:12,pb:0,br:30})],
          [de('feature',{icon:'☀️',title:'In Person',body:'Drop your gift in the offering basket during any Sunday service.',ic:'#c4673a',tc:'#2c1f14',align:'center'})],
        ]},
        { id:uid(), cols:1, bg:'#f3ebe0', pt:56, pb:56, cols_data:[[
          de('quote',{text:'"Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver."',attr:'— 2 Corinthians 9:7',bg:'#faf5ee',bc:'#c4673a',fs:18,color:'#2c1f14',align:'center'}),
        ]]},
      ]},
    ],
  },
  // ── 8: Resonate ───────────────────────────────────────────────────
  {
    id:'resonate', name:'Resonate', category:'Church', style:'Contemporary', palette:'cornerstone', hidden:true,
    desc:'Photography-first, bold display type, warm whites with burnt-orange accent. Modern contemporary church.',
    thumb:['#1a1714','#e8572a','#f9f6f1'],
    nav:{ style:'minimal', showLogo:true, logo:'Resonate', showCta:true, ctaText:'Plan a Visit', links:['About','Sundays','Get Involved','Give'], bg:'#ffffff', linkColor:'#3d3830', logoColor:'#1a1714', ctaBg:'#e8572a', ctaColor:'#ffffff', borderColor:'rgba(26,23,20,0.08)' },
    rows:[
      // ── Hero ──────────────────────────────────────────────────────
      { id:uid(), cols:1, bg:'#1a1714', pt:108, pb:108, cols_data:[[
        de('badge',  {text:'Coquitlam, BC · Est. 2012', align:'center', bg:'rgba(232,87,42,0.15)', tc:'#f07a55', pt:0, pb:0}),
        de('heading',{text:'A Place to\nBelong.', fs:64, color:'#ffffff', ff:'Playfair', align:'center', lh:1.04}),
        de('text',   {text:"We're an imperfect group of people pursuing a perfect God. Wherever you are on your faith journey — you're welcome here.", fs:17, color:'rgba(255,255,255,0.55)', align:'center', pt:5, pb:0}),
        de('button', {text:'Plan Your Visit →', bg:'#e8572a', tc:'#ffffff', align:'center', pt:22, pb:4, br:40}),
        de('button', {text:'Watch Online', style:'outline', bg:'transparent', tc:'rgba(255,255,255,0.8)', align:'center', pt:4, pb:0, br:40}),
      ]]},
      // ── Info / marquee band ───────────────────────────────────────
      { id:uid(), cols:1, bg:'#121010', pt:18, pb:18, cols_data:[[
        de('text',{text:'All are welcome  ·  Sundays 9:30 & 11:15 AM  ·  Coquitlam, BC  ·  Know God  ·  Find Freedom  ·  Discover Purpose  ·  Make a Difference', fs:11, color:'rgba(255,255,255,0.4)', align:'center', fw:'600', pt:0, pb:0}),
      ]]},
      // ── Welcome (2-col) ───────────────────────────────────────────
      { id:uid(), cols:2, bg:'#ffffff', pt:80, pb:80, cols_data:[
        [de('image',{h:420, br:12, alt:'Pastor photo'})],
        [
          de('badge',  {text:'Welcome', align:'left', bg:'rgba(232,87,42,0.1)', tc:'#e8572a', pt:0, pb:0}),
          de('heading',{text:'Welcome to\nResonate Church.', fs:38, ff:'Playfair', color:'#1a1714', align:'left', lh:1.08}),
          de('text',   {text:"We're an imperfect group of people pursuing a perfect God. Wherever you are in your faith journey, we want you to know that you're welcome here.", fs:15, color:'#7a7267', align:'left', lh:1.8, pt:4}),
          de('text',   {text:'📍 570 Poirier St, Coquitlam, BC V3J 6A8', fs:13, color:'#3d3830', align:'left', fw:'500', pt:4}),
          de('button', {text:'Read About Our Church →', bg:'#e8572a', tc:'#ffffff', align:'left', pt:18, br:40}),
        ],
      ]},
      // ── Services banner ───────────────────────────────────────────
      { id:uid(), cols:1, bg:'#1a1714', pt:80, pb:80, cols_data:[[
        de('badge',  {text:'Join Us Every Week', align:'center', bg:'rgba(232,87,42,0.15)', tc:'#f07a55', pt:0, pb:0}),
        de('heading',{text:'JOIN US SUNDAY!', fs:60, color:'#ffffff', ff:'Playfair', align:'center', lh:1.0}),
        de('text',   {text:'We look forward to meeting you!', fs:15, color:'rgba(255,255,255,0.45)', align:'center', pt:2, pb:0}),
        de('event',  {title:'Sunday Gatherings', date:'Every Sunday', time:'9:30 AM  ·  11:15 AM', loc:'570 Poirier St, Coquitlam, BC V3J 6A8', tc:'#ffffff', ac:'#e8572a', pt:24}),
      ]]},
      // ── Tagline band ──────────────────────────────────────────────
      { id:uid(), cols:1, bg:'#f9f6f1', pt:72, pb:72, cols_data:[[
        de('heading',{text:'You Belong Here.', fs:52, color:'#1a1714', ff:'Playfair', align:'center', lh:1.0}),
      ]]},
      // ── Ministry section header ───────────────────────────────────
      { id:uid(), cols:1, bg:'#ffffff', pt:80, pb:12, cols_data:[[
        de('badge',  {text:'Get Involved', align:'center', bg:'rgba(232,87,42,0.1)', tc:'#e8572a', pt:0, pb:0}),
        de('heading',{text:'Find your community.', fs:44, color:'#1a1714', ff:'Playfair', align:'center', lh:1.08}),
      ]]},
      // ── Ministry cards (4-col) ────────────────────────────────────
      { id:uid(), cols:4, bg:'#ffffff', pt:12, pb:80, cols_data:[
        [
          de('feature',{icon:'🤝', title:'Dream Team', body:'Serve alongside others and make a real difference in the life of the church.', ic:'#e8572a', tc:'#1a1714', bc:'#7a7267', align:'center'}),
          de('badge',  {text:'Community', align:'center', bg:'rgba(232,87,42,0.1)', tc:'#e8572a', pt:4, pb:0}),
        ],
        [
          de('feature',{icon:'🌟', title:'Resonate Kids', body:'A safe and fun environment for kids to learn about God and grow in faith.', ic:'#e8572a', tc:'#1a1714', bc:'#7a7267', align:'center'}),
          de('badge',  {text:'Children', align:'center', bg:'rgba(232,87,42,0.1)', tc:'#e8572a', pt:4, pb:0}),
        ],
        [
          de('feature',{icon:'⚡', title:'R Youth', body:'A community where students belong, grow, and encounter God together.', ic:'#e8572a', tc:'#1a1714', bc:'#7a7267', align:'center'}),
          de('badge',  {text:'Students', align:'center', bg:'rgba(232,87,42,0.1)', tc:'#e8572a', pt:4, pb:0}),
        ],
        [
          de('feature',{icon:'🎵', title:'Worship Team', body:'Use your gifts to lead people into the presence of God through music.', ic:'#e8572a', tc:'#1a1714', bc:'#7a7267', align:'center'}),
          de('badge',  {text:'Worship', align:'center', bg:'rgba(232,87,42,0.1)', tc:'#e8572a', pt:4, pb:0}),
        ],
      ]},
      // ── You Belong ────────────────────────────────────────────────
      { id:uid(), cols:1, bg:'#f9f6f1', pt:80, pb:80, cols_data:[[
        de('badge',  {text:'Our Heart', align:'center', bg:'rgba(232,87,42,0.1)', tc:'#e8572a', pt:0, pb:0}),
        de('heading',{text:'You Belong Here.', fs:60, color:'#1a1714', ff:'Playfair', align:'center', lh:1.0}),
        de('text',   {text:"No matter your background, your story, or where you're coming from — there is a place for you in this community. Come as you are.", fs:16, color:'#7a7267', align:'center', lh:1.8, pt:4, pb:0}),
        de('button', {text:'Take Your Next Step →', bg:'#e8572a', tc:'#ffffff', align:'center', pt:22, br:40}),
      ]]},
      // ── Pillars header ────────────────────────────────────────────
      { id:uid(), cols:1, bg:'#ffffff', pt:80, pb:16, cols_data:[[
        de('badge',  {text:"What We're About", align:'center', bg:'rgba(232,87,42,0.1)', tc:'#e8572a', pt:0, pb:0}),
        de('heading',{text:'Know God. Find Freedom.\nDiscover Purpose. Make a Difference.', fs:40, color:'#1a1714', ff:'Playfair', align:'center', lh:1.12}),
      ]]},
      // ── Pillars (3-col) ───────────────────────────────────────────
      { id:uid(), cols:3, bg:'#ffffff', pt:16, pb:80, cols_data:[
        [de('feature',{icon:'✦', title:'Know God',          body:'We believe in a personal, transformative relationship with God — not just knowing about Him, but truly knowing Him.', ic:'#e8572a', tc:'#1a1714', bc:'#7a7267', align:'left'})],
        [de('feature',{icon:'◎', title:'Find Freedom',      body:"Whatever you're carrying — past hurt, broken habits, fear — real freedom is possible. We walk together toward it.", ic:'#e8572a', tc:'#1a1714', bc:'#7a7267', align:'left'})],
        [de('feature',{icon:'◆', title:'Discover Purpose',  body:'You were made with intention. We help people uncover their unique gifts and calling and step into them with confidence.', ic:'#e8572a', tc:'#1a1714', bc:'#7a7267', align:'left'})],
      ]},
      // ── Stats band (4-col) ────────────────────────────────────────
      { id:uid(), cols:4, bg:'#1a1714', pt:60, pb:60, cols_data:[
        [de('heading',{text:'570+', fs:44, color:'#e8572a', ff:'Playfair', align:'center', lh:1.0}), de('text',{text:'Weekly Attendees',   fs:11, color:'rgba(255,255,255,0.4)', align:'center', fw:'600', pt:4, pb:0})],
        [de('heading',{text:'12+',  fs:44, color:'#e8572a', ff:'Playfair', align:'center', lh:1.0}), de('text',{text:'Years of Ministry',   fs:11, color:'rgba(255,255,255,0.4)', align:'center', fw:'600', pt:4, pb:0})],
        [de('heading',{text:'100+', fs:44, color:'#e8572a', ff:'Playfair', align:'center', lh:1.0}), de('text',{text:'Dream Team Members', fs:11, color:'rgba(255,255,255,0.4)', align:'center', fw:'600', pt:4, pb:0})],
        [de('heading',{text:'3',    fs:44, color:'#e8572a', ff:'Playfair', align:'center', lh:1.0}), de('text',{text:'Service Times',       fs:11, color:'rgba(255,255,255,0.4)', align:'center', fw:'600', pt:4, pb:0})],
      ]},
      // ── CTA ───────────────────────────────────────────────────────
      { id:uid(), cols:1, bg:'#ffffff', pt:104, pb:104, cols_data:[[
        de('badge',  {text:'Ready to Take a Step?', align:'center', bg:'rgba(232,87,42,0.1)', tc:'#e8572a', pt:0, pb:0}),
        de('heading',{text:"We'd love to\nmeet you.", fs:52, color:'#1a1714', ff:'Playfair', align:'center', lh:1.0}),
        de('text',   {text:'Join us this Sunday and experience Resonate for the first time. We have a team ready to welcome you.', fs:16, color:'#7a7267', align:'center', lh:1.8, pt:4, pb:0}),
        de('button', {text:'Plan Your Visit →', bg:'#e8572a', tc:'#ffffff', align:'center', pt:22, pb:4, br:40}),
        de('button', {text:'Watch Online', bg:'#1a1714', tc:'#ffffff', align:'center', pt:4, pb:0, br:40}),
      ]]},
    ],
  },
]

// ── Section Blocks (pre-built full rows) ──────────────────────────────────────
export const SECTION_BLOCKS = [
  // ── Structure ──
  {
    id:'footer', label:'Footer', category:'Structure', icon:'▦',
    desc:'Logo, nav links, contact info & service times',
    row:{ id:'tpl', cols:4, bg:'#0f0e0c', pt:48, pb:40, cols_data:[
      [de('heading',{text:'Grace Church',fs:20,ff:'Playfair',color:'#d4a843',align:'left',lh:1.1,pt:0,pb:0}),
       de('text',  {text:'A place to belong, believe,\nand become.',fs:13,color:'rgba(240,236,230,.5)',align:'left',lh:1.7,pt:6,pb:0}),
       de('divider',{color:'rgba(212,168,67,.2)',thick:1,w:60,align:'left',pt:16,pb:16}),
       de('text',  {text:'© 2026 Grace Church. All rights reserved.',fs:11,color:'rgba(240,236,230,.3)',align:'left',pt:0,pb:0})],
      [de('heading',{text:'QUICK LINKS',fs:10,fw:'700',ls:2,color:'rgba(240,236,230,.35)',align:'left',pt:0,pb:4}),
       de('list',  {items:['Home','About','Sermons','Events','Give'],style:'none',fs:13,color:'rgba(240,236,230,.6)',ic:'transparent',align:'left',lh:2.0,pt:0,pb:0})],
      [de('heading',{text:'CONTACT',fs:10,fw:'700',ls:2,color:'rgba(240,236,230,.35)',align:'left',pt:0,pb:4}),
       de('list',  {items:[{label:'123 Faith Avenue, Springfield, IL 62701',href:'https://maps.google.com/?q=123+Faith+Avenue+Springfield+IL+62701'},{label:'(555) 123-4567',href:'tel:+15551234567'},{label:'hello@gracechurch.com',href:'mailto:hello@gracechurch.com'}],style:'none',fs:13,color:'rgba(240,236,230,.6)',linkColor:'rgba(240,236,230,.6)',ic:'transparent',align:'left',lh:2.0,pt:0,pb:0})],
      [de('heading',{text:'SERVICES',fs:10,fw:'700',ls:2,color:'rgba(240,236,230,.35)',align:'left',pt:0,pb:4}),
       de('list',  {items:['Sunday 9:00 AM','Sunday 11:00 AM','Wednesday 6:30 PM','Friday Youth 7:00 PM'],style:'none',fs:13,color:'rgba(240,236,230,.6)',ic:'transparent',align:'left',lh:2.0,pt:0,pb:0})],
    ]},
  },
  // ── Hero ──
  {
    id:'hero_dark', label:'Hero — Dark', category:'Hero', icon:'◼',
    desc:'Full-width dark hero with badge, heading, subtext & CTA',
    row:{ id:'tpl', cols:1, bg:'#0f0e0c', pt:100, pb:100, cols_data:[[
      de('badge',  {text:'Welcome Home',align:'center',bg:'rgba(212,168,67,.12)',tc:'#d4a843',pt:0,pb:0}),
      de('heading',{text:'Where Every Life\nFinds Its Purpose',fs:56,ff:'Playfair',color:'#faf8f5',align:'center',lh:1.1,pt:16,pb:0}),
      de('text',   {text:'Join us this Sunday and experience a community built on faith, hope, and love. Everyone is welcome.',fs:17,color:'rgba(240,236,230,.65)',align:'center',lh:1.8,pt:16,pb:0}),
      de('button', {text:'Plan Your Visit →',bg:'#d4a843',tc:'#1c0f00',align:'center',pt:28,pb:0,br:8,px:28,py:13,fw:'700'}),
    ]]},
  },
  {
    id:'hero_light', label:'Hero — Light', category:'Hero', icon:'◻',
    desc:'Full-width light hero with badge, heading, subtext & CTA',
    row:{ id:'tpl', cols:1, bg:'#faf8f5', pt:100, pb:100, cols_data:[[
      de('badge',  {text:'Welcome',align:'center',bg:'rgba(212,168,67,.1)',tc:'#b8860b',pt:0,pb:0}),
      de('heading',{text:'Discover a Faith\nCommunity for You',fs:54,ff:'Playfair',color:'#1a1715',align:'center',lh:1.1,pt:16,pb:0}),
      de('text',   {text:'We are a church for everyone — rooted in Scripture, alive with worship, and passionate about serving our community.',fs:16,color:'#6a6560',align:'center',lh:1.8,pt:16,pb:0}),
      de('button', {text:'Join Us This Sunday',bg:'#d4a843',tc:'#1c0f00',align:'center',pt:28,pb:0,br:8,px:28,py:13,fw:'700'}),
    ]]},
  },
  // ── Content ──
  {
    id:'service_times', label:'Service Times', category:'Content', icon:'◷',
    desc:'Two service time features side by side with address',
    row:{ id:'tpl', cols:2, bg:'#0f0e0c', pt:72, pb:72, cols_data:[
      [de('badge',  {text:'JOIN US',align:'center',bg:'rgba(212,168,67,.1)',tc:'#d4a843',pt:0,pb:0}),
       de('heading',{text:'Sunday Services',fs:36,ff:'Playfair',color:'#faf8f5',align:'center',lh:1.1,pt:12,pb:0}),
       de('feature',{icon:'🕘',title:'9:00 AM',body:'Traditional Worship — Hymns, liturgy, and a timeless service experience.',ic:'#d4a843',tc:'#faf8f5',bc:'rgba(240,236,230,.55)',align:'center',pt:24,pb:0})],
      [de('spacer', {h:52,pt:0,pb:0}),
       de('feature',{icon:'🕚',title:'11:00 AM',body:'Contemporary Worship — Modern music, creative arts, and expressive praise.',ic:'#d4a843',tc:'#faf8f5',bc:'rgba(240,236,230,.55)',align:'center',pt:24,pb:0}),
       de('text',   {text:'📍 123 Faith Avenue, Springfield, IL 62701',fs:13,color:'rgba(240,236,230,.4)',align:'center',lh:1.5,pt:28,pb:0})],
    ]},
  },
  {
    id:'about', label:'About / Mission', category:'Content', icon:'⊞',
    desc:'Image left, badge + heading + body + button right',
    row:{ id:'tpl', cols:2, bg:'#ffffff', pt:72, pb:72, cols_data:[
      [de('image',  {src:'',alt:'Church community photo',fit:'cover',h:380,br:10,pt:0,pb:0})],
      [de('badge',  {text:'Our Story',align:'left',bg:'rgba(212,168,67,.1)',tc:'#b8860b',pt:0,pb:0}),
       de('heading',{text:'More Than a Church —\nA Family',fs:38,ff:'Playfair',color:'#1a1715',align:'left',lh:1.15,pt:12,pb:0}),
       de('text',   {text:'For over 20 years, Grace Church has been a spiritual home for thousands of families in our community. We believe every person has a story worth honoring and a calling worth pursuing.',fs:15,color:'#6a6560',align:'left',lh:1.8,pt:14,pb:0}),
       de('button', {text:'Meet the Team →',bg:'#d4a843',tc:'#1c0f00',align:'left',pt:22,pb:0,br:8,px:24,py:11,fw:'700'})],
    ]},
  },
  {
    id:'features_3col', label:'3-Column Features', category:'Content', icon:'⊕',
    desc:'Three feature blocks with icons, titles and descriptions',
    row:{ id:'tpl', cols:3, bg:'#faf8f5', pt:72, pb:72, cols_data:[
      [de('feature',{icon:'✦',title:'Vibrant Worship',body:'Experience heartfelt worship that moves you — from intimate acoustic sets to full-band celebrations.',ic:'#d4a843',tc:'#1a1715',bc:'#6a6560',align:'center',pt:0,pb:0})],
      [de('feature',{icon:'◎',title:'Deeper Community',body:'Small groups, life groups, and mentoring programs that turn strangers into lifelong family.',ic:'#d4a843',tc:'#1a1715',bc:'#6a6560',align:'center',pt:0,pb:0})],
      [de('feature',{icon:'↗',title:'Local Outreach',body:'Serving our city through food drives, after-school programs, and community partnerships.',ic:'#d4a843',tc:'#1a1715',bc:'#6a6560',align:'center',pt:0,pb:0})],
    ]},
  },
  {
    id:'testimonial', label:'Testimonial / Quote', category:'Content', icon:'❝',
    desc:'Large centered quote with attribution on a warm background',
    row:{ id:'tpl', cols:1, bg:'#f5f0e8', pt:80, pb:80, cols_data:[[
      de('quote',{text:'"I walked in a stranger and left with a family. Grace Church completely changed the direction of my life."',attr:'— Sarah M., Member since 2019',bg:'transparent',bc:'#d4a843',fs:22,color:'#1a1715',align:'center',pt:0,pb:0}),
    ]]},
  },
  {
    id:'events', label:'Events Grid', category:'Content', icon:'◷',
    desc:'3 pre-filled events: Sunday Service, Bible Study, Youth Group',
    row:{ id:'tpl', cols:3, bg:'#ffffff', pt:64, pb:64, cols_data:[
      [de('event',{title:'Sunday Service',date:'Every Sunday',time:'9:00 AM & 11:00 AM',loc:'Main Sanctuary',tc:'#1a1715',ac:'#d4a843',pt:0,pb:0})],
      [de('event',{title:'Wednesday Bible Study',date:'Every Wednesday',time:'6:30 PM',loc:'Fellowship Hall',tc:'#1a1715',ac:'#d4a843',pt:0,pb:0})],
      [de('event',{title:'Youth Group',date:'Every Friday',time:'7:00 PM',loc:'Youth Center',tc:'#1a1715',ac:'#d4a843',pt:0,pb:0})],
    ]},
  },
  {
    id:'staff', label:'Staff / Team', category:'Content', icon:'◉',
    desc:'3 team member cards with photo placeholder, name, role & bio',
    row:{ id:'tpl', cols:3, bg:'#ffffff', pt:64, pb:64, cols_data:[
      [de('image',  {src:'',alt:'Pastor photo',fit:'cover',h:200,br:100,pt:0,pb:0}),
       de('heading',{text:'Pastor John Smith',fs:18,fw:'700',ff:'Playfair',color:'#1a1715',align:'center',pt:14,pb:0}),
       de('badge',  {text:'Lead Pastor',align:'center',bg:'rgba(212,168,67,.1)',tc:'#b8860b',pt:6,pb:0}),
       de('text',   {text:'John has pastored Grace Church for over 15 years, with a passion for biblical teaching and community transformation.',fs:13,color:'#6a6560',align:'center',lh:1.7,pt:10,pb:0})],
      [de('image',  {src:'',alt:'Pastor photo',fit:'cover',h:200,br:100,pt:0,pb:0}),
       de('heading',{text:'Pastor Sarah Lee',fs:18,fw:'700',ff:'Playfair',color:'#1a1715',align:'center',pt:14,pb:0}),
       de('badge',  {text:'Worship Pastor',align:'center',bg:'rgba(212,168,67,.1)',tc:'#b8860b',pt:6,pb:0}),
       de('text',   {text:'Sarah leads our worship ministry with creativity and anointing, creating spaces where people encounter the living God.',fs:13,color:'#6a6560',align:'center',lh:1.7,pt:10,pb:0})],
      [de('image',  {src:'',alt:'Pastor photo',fit:'cover',h:200,br:100,pt:0,pb:0}),
       de('heading',{text:'Pastor Mike Torres',fs:18,fw:'700',ff:'Playfair',color:'#1a1715',align:'center',pt:14,pb:0}),
       de('badge',  {text:'Youth Pastor',align:'center',bg:'rgba(212,168,67,.1)',tc:'#b8860b',pt:6,pb:0}),
       de('text',   {text:'Mike oversees our thriving youth ministry, helping the next generation discover their identity and destiny in Christ.',fs:13,color:'#6a6560',align:'center',lh:1.7,pt:10,pb:0})],
    ]},
  },
  // ── CTA ──
  {
    id:'cta', label:'Call to Action', category:'CTA', icon:'→',
    desc:'Dark full-width section with heading, subtext and two buttons',
    row:{ id:'tpl', cols:1, bg:'#0f0e0c', pt:96, pb:96, cols_data:[[
      de('heading',{text:'Ready to Take\nthe Next Step?',fs:50,ff:'Playfair',color:'#faf8f5',align:'center',lh:1.1,pt:0,pb:0}),
      de('text',   {text:"We'd love to meet you. Join us this Sunday — no perfect past required, just a willing heart.",fs:16,color:'rgba(240,236,230,.6)',align:'center',lh:1.8,pt:14,pb:0}),
      de('button', {text:'Plan a Visit →',bg:'#d4a843',tc:'#1c0f00',align:'center',pt:28,pb:4,br:8,px:28,py:13,fw:'700'}),
      de('button', {text:'Watch Online',bg:'transparent',tc:'rgba(240,236,230,.6)',align:'center',pt:4,pb:0,br:8,px:24,py:10,fw:'600'}),
    ]]},
  },
  {
    id:'contact', label:'Contact', category:'CTA', icon:'✉',
    desc:'Heading + address left, contact details list right',
    row:{ id:'tpl', cols:2, bg:'#faf8f5', pt:72, pb:72, cols_data:[
      [de('badge',  {text:'Get in Touch',align:'left',bg:'rgba(212,168,67,.1)',tc:'#b8860b',pt:0,pb:0}),
       de('heading',{text:"We'd Love to\nHear From You",fs:38,ff:'Playfair',color:'#1a1715',align:'left',lh:1.15,pt:12,pb:0}),
       de('text',   {text:'Our doors are always open. Whether you have a question, need prayer, or just want to connect — reach out anytime.',fs:15,color:'#6a6560',align:'left',lh:1.8,pt:14,pb:0}),
       de('text',   {text:'📍 123 Faith Avenue, Springfield, IL 62701',fs:14,color:'#4a4540',align:'left',lh:1.6,pt:18,pb:0})],
      [de('heading',{text:'Contact Info',fs:16,fw:'700',color:'#1a1715',align:'left',pt:0,pb:4}),
       de('list',   {items:['📞 (555) 123-4567','✉ hello@gracechurch.com','🌐 www.gracechurch.com','Office Hours: Mon–Fri 9AM–4PM'],style:'none',fs:14,color:'#4a4540',ic:'transparent',align:'left',lh:2.2,pt:0,pb:0})],
    ]},
  },
  {
    id:'give', label:'Give / Donate', category:'CTA', icon:'◈',
    desc:'Centered giving section with badge, heading, body and CTA button',
    row:{ id:'tpl', cols:1, bg:'#0f0e0c', pt:88, pb:88, cols_data:[[
      de('badge',  {text:'Generous Giving',align:'center',bg:'rgba(212,168,67,.12)',tc:'#d4a843',pt:0,pb:0}),
      de('heading',{text:'Your Generosity\nChanges Lives',fs:48,ff:'Playfair',color:'#faf8f5',align:'center',lh:1.1,pt:16,pb:0}),
      de('text',   {text:'Every gift, large or small, directly funds our community programs, global missions, and church operations. Give securely online in seconds.',fs:16,color:'rgba(240,236,230,.6)',align:'center',lh:1.8,pt:16,pb:0}),
      de('button', {text:'Give Now →',bg:'#d4a843',tc:'#1c0f00',align:'center',pt:28,pb:0,br:8,px:32,py:14,fw:'700'}),
    ]]},
  },
]
