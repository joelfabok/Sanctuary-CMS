import { useState } from 'react'
import { PSec, SL, Seg, AlBtns, CP } from '../shared/UI'
import { PALETTES, NAVBAR_STYLES, EL_TYPES } from '../../data/constants'

// ── Navbar Panel ──────────────────────────────────────────────────
export function NavbarPanel({ nav, palette, onChange, pages }) {
  const pal = PALETTES.find(p => p.id === palette) || PALETTES[0]
  const c   = { dark:pal.colors[0], accent:pal.colors[2], heading:pal.colors[3], light:pal.colors[4] }
  const u   = (k, v) => onChange({ ...nav, [k]: v })
  const cur = NAVBAR_STYLES.find(s => s.id === nav.style) || NAVBAR_STYLES[0]

  return (
    <div>
      <div style={{margin:'0 14px 4px',borderRadius:'var(--r)',overflow:'hidden',border:'1px solid var(--b2)'}}>
        {cur.render(nav, c)}
      </div>

      <PSec title="Navbar Style">
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,marginBottom:10}}>
          {NAVBAR_STYLES.map(ns => (
            <div key={ns.id} onClick={() => u('style', ns.id)}
              style={{borderRadius:'var(--r)',overflow:'hidden',cursor:'pointer',border:`2px solid ${nav.style===ns.id?'var(--gold)':'var(--b2)'}`,transition:'border-color .15s'}}>
              <div style={{pointerEvents:'none',transform:'scale(.85)',transformOrigin:'top left',width:'117%',marginBottom:'-15%'}}>
                {ns.preview(c)}
              </div>
              <div style={{padding:'5px 7px',background:'var(--bg4)',borderTop:'1px solid var(--b1)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <span style={{fontSize:10.5,fontWeight:600,color:nav.style===ns.id?'var(--gold)':'var(--tx3)'}}>{ns.name}</span>
                {nav.style===ns.id && <span style={{width:6,height:6,borderRadius:'50%',background:'var(--gold)',display:'inline-block'}} />}
              </div>
            </div>
          ))}
        </div>
      </PSec>

      <PSec title="Logo">
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
          <input type="checkbox" checked={nav.showLogo!==false} onChange={e=>u('showLogo',e.target.checked)} style={{accentColor:'var(--gold)'}} />
          <span style={{fontSize:12.5,color:'var(--tx2)'}}>Show logo / name</span>
        </div>
        {nav.showLogo!==false && <>
          <Seg value={nav.logoType||'text'} onChange={v=>u('logoType',v)} opts={[['text','Text'],['image','Image']]} />
          <div style={{height:8}} />
          {(nav.logoType||'text')==='text' ? <>
            <label className="lbl">Name</label>
            <input className="inp" value={nav.logo||''} onChange={e=>u('logo',e.target.value)} style={{marginBottom:8}} />
            <label className="lbl">Color</label>
            <CP value={nav.logoColor||c.accent} onChange={v=>u('logoColor',v)} />
          </> : <>
            {nav.logoImg && (
              <div style={{marginBottom:8,padding:8,background:'var(--bg4)',borderRadius:6,border:'1px solid var(--b1)',display:'flex',alignItems:'center',justifyContent:'space-between',gap:8}}>
                <img src={nav.logoImg} style={{height:nav.logoSize||40,maxWidth:120,objectFit:'contain'}} alt="logo" />
                <button onClick={()=>u('logoImg','')} style={{padding:'3px 8px',borderRadius:5,border:'1px solid var(--b1)',background:'var(--bg3)',color:'#ef4444',fontSize:11,cursor:'pointer',fontFamily:"'Instrument Sans',sans-serif",flexShrink:0}}>Remove</button>
              </div>
            )}
            <label className="lbl">Upload image (PNG, SVG, JPG)</label>
            <input type="file" accept="image/*" onChange={e=>{
              const file = e.target.files[0]
              if (!file) return
              const reader = new FileReader()
              reader.onload = ev => u('logoImg', ev.target.result)
              reader.readAsDataURL(file)
            }} style={{fontSize:12,color:'var(--tx3)',marginBottom:8,width:'100%'}} />
          </>}
          <div style={{marginTop:8}}><SL label={(nav.logoType||'text')==='text'?'Font size':'Image height'} value={nav.logoSize||(nav.logoType==='image'?40:20)} min={(nav.logoType||'text')==='text'?14:20} max={(nav.logoType||'text')==='text'?40:120} unit="px" onChange={v=>u('logoSize',v)} /></div>
        </>}
      </PSec>

      <PSec title="Links">
        {(nav.links||['Home','About','Sermons','Events','Give']).map((lnk, i) => {
          const item = typeof lnk === 'string' ? { label: lnk, href: '' } : lnk
          const updateLink = (field, val) => {
            const next = (nav.links || ['Home','About','Sermons','Events','Give']).map((x, xi) => {
              const obj = typeof x === 'string' ? { label: x, href: '' } : x
              return xi === i ? { ...obj, [field]: val } : obj
            })
            u('links', next)
          }
          const removeLink = () => {
            const raw = nav.links || ['Home','About','Sermons','Events','Give']
            u('links', raw.filter((_, xi) => xi !== i).map(x => typeof x === 'string' ? { label: x, href: '' } : x))
          }
          const updateChildLink = (ci, field, val) => {
            const ch = [...(item.children || [])]
            ch[ci] = { ...ch[ci], [field]: val }
            updateLink('children', ch)
          }
          const addChildLink = () => updateLink('children', [...(item.children || []), { label: 'New Item', href: '' }])
          const removeChildLink = (ci) => updateLink('children', (item.children || []).filter((_, xi) => xi !== ci))
          return (
            <div key={i} style={{ background:'var(--bg4)', border:'1px solid var(--b1)', borderRadius:7, padding:'8px 10px', marginBottom:6 }}>
              <div style={{ display:'flex', gap:6, marginBottom:6 }}>
                <input className="inp" value={item.label} onChange={e=>updateLink('label', e.target.value)} placeholder="Label" style={{ flex:1 }} />
                <button onClick={removeLink} style={{ padding:'0 9px', borderRadius:5, border:'1px solid var(--b1)', background:'var(--bg3)', color:'#ef4444', cursor:'pointer', fontSize:15, lineHeight:1 }} title="Remove link">✕</button>
              </div>
              <input className="inp" value={item.href||''} onChange={e=>updateLink('href', e.target.value)} placeholder="URL — e.g. /about or #sermons" style={{marginBottom: pages.length ? 6 : 0}} />
              {pages.length>0 && (
                <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
                  {pages.map(pg=>(
                    <span key={pg.id} onClick={()=>updateLink('href', pg.slug)}
                      style={{fontSize:10,padding:'2px 7px',borderRadius:10,background:item.href===pg.slug?'var(--gold)':'var(--bg3)',color:item.href===pg.slug?'#1c0f00':'var(--tx3)',border:'1px solid var(--b1)',cursor:'pointer',fontFamily:"'JetBrains Mono',monospace",transition:'all .1s'}}>
                      {pg.slug}
                    </span>
                  ))}
                </div>
              )}
              {(item.children||[]).length > 0 && (
                <div style={{marginTop:8,borderTop:'1px solid var(--b1)',paddingTop:6}}>
                  <div style={{fontSize:10,color:'var(--tx3)',marginBottom:5,fontWeight:600,textTransform:'uppercase',letterSpacing:'.05em'}}>Children</div>
                  {(item.children||[]).map((ch, ci) => (
                    <div key={ci} style={{display:'flex',gap:4,marginBottom:4,alignItems:'center'}}>
                      <input className="inp" value={ch.label||''} onChange={e=>updateChildLink(ci,'label',e.target.value)} placeholder="Label" style={{flex:'0 0 38%'}} />
                      <input className="inp" value={ch.href||''} onChange={e=>updateChildLink(ci,'href',e.target.value)} placeholder="/url" style={{flex:1}} />
                      <button onClick={()=>removeChildLink(ci)} style={{padding:'0 8px',borderRadius:5,border:'1px solid var(--b1)',background:'var(--bg3)',color:'#ef4444',cursor:'pointer',fontSize:13,lineHeight:1,height:28,flexShrink:0}}>✕</button>
                    </div>
                  ))}
                </div>
              )}
              <button onClick={addChildLink} style={{width:'100%',marginTop:6,padding:'4px',borderRadius:5,border:'1px dashed var(--b2)',background:'transparent',color:'var(--tx3)',cursor:'pointer',fontSize:11,fontFamily:"'Instrument Sans',sans-serif"}}>+ Add child link</button>
            </div>
          )
        })}
        <button onClick={() => {
          const normalized = (nav.links || ['Home','About','Sermons','Events','Give']).map(x => typeof x === 'string' ? { label: x, href: '' } : x)
          u('links', [...normalized, { label: 'New Link', href: '' }])
        }} style={{ width:'100%', padding:'7px', borderRadius:6, border:'1px dashed var(--b2)', background:'transparent', color:'var(--tx3)', cursor:'pointer', fontSize:12, fontFamily:"'Instrument Sans',sans-serif", marginBottom:10 }}>+ Add Link</button>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
          <div><label className="lbl">Color</label><CP value={nav.linkColor} onChange={v=>u('linkColor',v)} /></div>
          <div><label className="lbl">Gap</label><input type="number" className="inp" value={nav.linkGap||28} onChange={e=>u('linkGap',Number(e.target.value))} /></div>
        </div>
        {(nav.style||'classic')!=='centered' && (
          <div style={{marginTop:10}}>
            <label className="lbl">Alignment</label>
            <Seg value={nav.linkAlign||'center'} onChange={v=>u('linkAlign',v)} opts={[['center','Center'],['right','Right']]} />
          </div>
        )}
      </PSec>

      <PSec title="CTA Button">
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
          <input type="checkbox" checked={nav.showCta!==false} onChange={e=>u('showCta',e.target.checked)} style={{accentColor:'var(--gold)'}} />
          <span style={{fontSize:12.5,color:'var(--tx2)'}}>Show button</span>
        </div>
        {nav.showCta!==false && <>
          <label className="lbl">Text</label>
          <input className="inp" value={nav.ctaText||''} onChange={e=>u('ctaText',e.target.value)} style={{marginBottom:8}} />
          <label className="lbl">URL</label>
          <input className="inp" value={nav.ctaHref||''} onChange={e=>u('ctaHref',e.target.value)} placeholder="e.g. /contact or #give" style={{marginBottom:8}} />
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:8}}>
            <div><label className="lbl">BG</label><CP value={nav.ctaBg||c.accent} onChange={v=>u('ctaBg',v)} /></div>
            <div><label className="lbl">Text</label><CP value={nav.ctaColor||c.dark} onChange={v=>u('ctaColor',v)} /></div>
          </div>
          <SL label="Border Radius" value={nav.ctaBr||6} min={0} max={30} unit="px" onChange={v=>u('ctaBr',v)} />
        </>}
      </PSec>

      <PSec title="Background">
        <label className="lbl">Color</label>
        <CP value={nav.bg||c.dark} onChange={v=>u('bg',v)} allowAlpha={true} />
        <div style={{display:'flex',alignItems:'center',gap:10,marginTop:8}}>
          <label className="lbl" style={{margin:0}}>Opacity</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={typeof nav.bgOpacity === 'number' ? nav.bgOpacity : 1}
            onChange={e => u('bgOpacity', parseFloat(e.target.value))}
            style={{flex:1}}
          />
          <span style={{fontSize:12,marginLeft:6}}>{Math.round(100*(typeof nav.bgOpacity === 'number' ? nav.bgOpacity : 1))}%</span>
        </div>
        <div style={{marginTop:10}}><SL label="Padding Y" value={nav.py||16} min={6} max={40} unit="px" onChange={v=>u('py',v)} /></div>
        <SL label="Padding X" value={nav.px||32} min={12} max={80} unit="px" onChange={v=>u('px',v)} />
      </PSec>

      <PSec title="Behaviour">
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
          <input type="checkbox" checked={nav.sticky===true} onChange={e=>u('sticky',e.target.checked)} style={{accentColor:'var(--gold)'}} />
          <span style={{fontSize:12.5,color:'var(--tx2)'}}>Sticky — stays at top when scrolling</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <input type="checkbox" checked={nav.floating===true} onChange={e=>u('floating',e.target.checked)} style={{accentColor:'var(--gold)'}} />
          <span style={{fontSize:12.5,color:'var(--tx2)'}}>Floating — overlay on top element</span>
        </div>
        <div style={{fontSize:11.5,color:'var(--tx3)',marginTop:8}}>
          When floating is enabled, the navbar overlays the top of the page (great for hero images). When off, it pushes content down as normal.
        </div>
      </PSec>

      {nav.style==='bold' && (
        <PSec title="Top Strip">
          <label className="lbl">Left text</label>
          <input className="inp" value={nav.stripLeft||''} onChange={e=>u('stripLeft',e.target.value)} style={{marginBottom:8}} />
          <label className="lbl">Right text</label>
          <input className="inp" value={nav.stripRight||''} onChange={e=>u('stripRight',e.target.value)} style={{marginBottom:8}} />
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
            <div><label className="lbl">BG</label><CP value={nav.stripBg||c.accent} onChange={v=>u('stripBg',v)} /></div>
            <div><label className="lbl">Text</label><CP value={nav.stripColor} onChange={v=>u('stripColor',v)} /></div>
          </div>
        </PSec>
      )}
    </div>
  )
}

// ── Property Panel ─────────────────────────────────────────────────
export default function PropPanel({ el, row, nav, palette, pages, onEl, onRow, onNav, onDel, onDup, onDelRow, onDupRow }) {
  if (nav)       return <NavbarPanel nav={nav} palette={palette} onChange={onNav} pages={pages||[]} />
  if (!el && !row) return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100%',gap:12,padding:24,textAlign:'center'}}>
      <div style={{width:44,height:44,borderRadius:12,background:'var(--bg4)',border:'1px solid var(--b1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,color:'var(--tx4)'}}>◈</div>
      <div style={{color:'var(--tx3)',fontSize:12.5,lineHeight:1.7}}>Click any element to edit its properties</div>
    </div>
  )

  const u = (k, v) => onEl({ ...el, [k]: v })
  const meta = EL_TYPES.find(e => e.type === el?.type)

  return (
    <div style={{height:'100%',overflow:'auto'}}>
      {el && <>
        <div style={{padding:'11px 14px',borderBottom:'1px solid var(--b1)',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,background:'var(--bg2)',zIndex:10}}>
          <div>
            <div style={{fontSize:10.5,color:'var(--tx4)',textTransform:'uppercase',letterSpacing:'.06em',fontWeight:600}}>Element</div>
            <div style={{fontSize:13.5,fontWeight:600,color:'var(--tx)',marginTop:1,display:'flex',gap:6,alignItems:'center'}}>
              <span style={{color:'var(--gold)'}}>{meta?.icon}</span>{meta?.label}
            </div>
          </div>
          <div style={{display:'flex',gap:3}}>
            <button className="btn-ic" onClick={onDup} data-tip="Duplicate" style={{fontSize:14}}>⊕</button>
            <button className="btn-ic btn-dng" onClick={onDel} data-tip="Delete" style={{color:'var(--red)',fontSize:14}}>✕</button>
          </div>
        </div>

        <PSec title="Layout">
          <div style={{marginBottom:10}}><label className="lbl">Alignment</label><AlBtns value={el.align||'center'} onChange={v=>u('align',v)} /></div>
          <SL label="Padding Top"    value={el.pt||0} min={0} max={80} unit="px" onChange={v=>u('pt',v)} />
          <SL label="Padding Bottom" value={el.pb||0} min={0} max={80} unit="px" onChange={v=>u('pb',v)} />
        </PSec>

        {['heading','text'].includes(el.type) && (
          <PSec title="Typography">
            {el.type==='heading' && <>
              <div style={{marginBottom:10}}><label className="lbl">Font</label><Seg opts={[['Playfair','Serif'],['Instrument','Sans']]} value={el.ff||'Playfair'} onChange={v=>u('ff',v)} /></div>
              <SL label="Size"           value={el.fs||36} min={14} max={96} unit="px" onChange={v=>u('fs',v)} />
              <SL label="Line Height"    value={el.lh||1.15} min={.9} max={2.5} step={.05} onChange={v=>u('lh',v)} />
              <div style={{marginBottom:10}}><label className="lbl">Weight</label><Seg opts={[['400','Regular'],['500','Medium'],['700','Bold']]} value={el.fw||'700'} onChange={v=>u('fw',v)} /></div>
              <SL label="Letter Spacing" value={el.ls||0} min={-3} max={10} unit="px" onChange={v=>u('ls',v)} />
            </>}
            {el.type==='text' && <>
              <SL label="Size"        value={el.fs||16} min={11} max={36} unit="px" onChange={v=>u('fs',v)} />
              <SL label="Line Height" value={el.lh||1.75} min={1} max={3} step={.05} onChange={v=>u('lh',v)} />
              <div style={{marginBottom:10}}><label className="lbl">Weight</label><Seg opts={[['300','Light'],['400','Regular'],['600','Bold']]} value={el.fw||'400'} onChange={v=>u('fw',v)} /></div>
            </>}
            <div><label className="lbl">Color</label><CP value={el.color} onChange={v=>u('color',v)} /></div>
          </PSec>
        )}

        {['heading','text','quote','badge'].includes(el.type) && (
          <PSec title="Content">
            <label className="lbl">Text</label>
            <textarea className="inp" rows={el.type==='text'?5:3} value={el.text||''} onChange={e=>u('text',e.target.value)} style={{marginBottom:el.type==='quote'?8:0}} />
            {el.type==='quote' && <>
              <label className="lbl" style={{marginTop:8}}>Attribution</label>
              <input className="inp" value={el.attr||''} onChange={e=>u('attr',e.target.value)} />
            </>}
          </PSec>
        )}

        {el.type==='button' && <>
          <PSec title="Content">
            <label className="lbl">Label</label>
            <input className="inp" value={el.text||''} onChange={e=>u('text',e.target.value)} style={{marginBottom:8}} />
            <label className="lbl">Link URL</label>
            <input className="inp" value={el.href||''} onChange={e=>u('href',e.target.value)} placeholder="/page-slug or https://..." style={{marginBottom:(pages||[]).length?6:0}} />
            {(pages||[]).length>0 && (
              <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
                {pages.map(pg=>(
                  <span key={pg.id} onClick={()=>u('href',pg.slug)}
                    style={{fontSize:10,padding:'2px 7px',borderRadius:10,background:el.href===pg.slug?'var(--gold)':'var(--bg3)',color:el.href===pg.slug?'#1c0f00':'var(--tx3)',border:'1px solid var(--b1)',cursor:'pointer',fontFamily:"'JetBrains Mono',monospace",transition:'all .1s'}}>
                    {pg.slug}
                  </span>
                ))}
              </div>
            )}
          </PSec>
          <PSec title="Style">
            <div style={{marginBottom:10}}><label className="lbl">Variant</label><Seg opts={[['filled','Filled'],['outline','Outline'],['ghost','Ghost']]} value={el.style||'filled'} onChange={v=>u('style',v)} /></div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:10}}>
              <div><label className="lbl">BG</label><CP value={el.bg} onChange={v=>u('bg',v)} /></div>
              <div><label className="lbl">Text</label><CP value={el.tc} onChange={v=>u('tc',v)} /></div>
            </div>
            <SL label="Font Size"     value={el.fs||14} min={11} max={24} unit="px" onChange={v=>u('fs',v)} />
            <SL label="Padding X"     value={el.px||24} min={6} max={80} unit="px" onChange={v=>u('px',v)} />
            <SL label="Padding Y"     value={el.py||11} min={4} max={32} unit="px" onChange={v=>u('py',v)} />
            <SL label="Border Radius" value={el.br||8}  min={0} max={50} unit="px" onChange={v=>u('br',v)} />
          </PSec>
        </>}

        {el.type==='image' && (
          <PSec title="Image">
            <label className="lbl">URL</label>
            <input className="inp" value={el.src||''} onChange={e=>u('src',e.target.value)} placeholder="https://..." style={{marginBottom:8}} />
            <label className="lbl">Alt</label>
            <input className="inp" value={el.alt||''} onChange={e=>u('alt',e.target.value)} style={{marginBottom:8}} />
            <SL label="Height"        value={el.h||240}  min={60}  max={700} unit="px" onChange={v=>u('h',v)} />
            <SL label="Border Radius" value={el.br||0}   min={0}   max={40}  unit="px" onChange={v=>u('br',v)} />
            <div style={{marginTop:8}}><label className="lbl">Fit</label><Seg opts={[['cover','Cover'],['contain','Contain'],['fill','Fill']]} value={el.fit||'cover'} onChange={v=>u('fit',v)} /></div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginTop:8}}>
              <div>
                <label className="lbl">Attachment</label>
                <Seg opts={[['scroll','Scroll'],['fixed','Fixed']]} value={el.bgAttachment||'scroll'} onChange={v=>u('bgAttachment',v)} />
              </div>
              <div>
                <label className="lbl">Size</label>
                <Seg opts={[['cover','Cover'],['contain','Contain']]} value={el.bgSize||'cover'} onChange={v=>u('bgSize',v)} />
              </div>
            </div>
            <div style={{marginTop:8}}>
              <label className="lbl">Position</label>
              <Seg opts={[['center','Center'],['top','Top'],['bottom','Bottom']]} value={el.bgPosition||'center'} onChange={v=>u('bgPosition',v)} />
            </div>
          </PSec>
        )}

        {el.type==='video' && (
          <PSec title="Video">
            <label className="lbl">Video URL</label>
            <input className="inp" value={el.src||''} onChange={e=>u('src',e.target.value)} placeholder="https://.../video.mp4" style={{marginBottom:8}} />
            <label className="lbl">Poster URL (thumbnail)</label>
            <input className="inp" value={el.poster||''} onChange={e=>u('poster',e.target.value)} placeholder="https://..." style={{marginBottom:8}} />
            <SL label="Height" value={el.h||360} min={120} max={800} unit="px" onChange={v=>u('h',v)} />
            <SL label="Border Radius" value={el.br||8} min={0} max={40} unit="px" onChange={v=>u('br',v)} />
            <div style={{display:'flex',flexDirection:'column',gap:6,marginTop:8}}>
              {[['autoplay','Autoplay (mutes controls)'],['loop','Loop'],['muted','Muted']].map(([k,l])=>(
                <label key={k} style={{display:'flex',alignItems:'center',gap:8,fontSize:12.5,color:'var(--tx2)',cursor:'pointer'}}>
                  <input type="checkbox" checked={!!el[k]} onChange={e=>u(k,e.target.checked)} style={{accentColor:'var(--gold)'}} />
                  {l}
                </label>
              ))}
            </div>
          </PSec>
        )}
        {el.type==='spacer'  && <PSec title="Spacer"><SL label="Height" value={el.h||32} min={4} max={300} unit="px" onChange={v=>u('h',v)} /></PSec>}
        {el.type==='divider' && (
          <PSec title="Divider">
            <div style={{marginBottom:10}}><label className="lbl">Color</label><CP value={el.color} onChange={v=>u('color',v)} /></div>
            <SL label="Thickness" value={el.thick||1} min={1} max={8}   unit="px" onChange={v=>u('thick',v)} />
            <SL label="Width"     value={el.w||80}    min={10} max={100} unit="%" onChange={v=>u('w',v)} />
          </PSec>
        )}

        {el.type==='list' && <>
          <PSec title="Items">
            {(el.items||[]).map((item, i) => {
              const isObj = typeof item === 'object' && item !== null
              const label = isObj ? (item.label||'') : item
              const href  = isObj ? (item.href||'')  : ''
              const setLabel = v => { const a=[...el.items]; a[i]=href?{label:v,href}:v; u('items',a) }
              const setHref  = v => { const a=[...el.items]; a[i]={label,href:v}; u('items',a) }
              return (
                <div key={i} style={{background:'var(--bg4)',border:'1px solid var(--b1)',borderRadius:6,padding:'7px 8px',marginBottom:6}}>
                  <div style={{display:'flex',gap:5,marginBottom:5}}>
                    <input className="inp" value={label} onChange={e=>setLabel(e.target.value)} placeholder="Label" style={{flex:1}} />
                    <button className="btn-ic" onClick={()=>u('items',el.items.filter((_,j)=>j!==i))} style={{color:'var(--red)'}}>×</button>
                  </div>
                  <input className="inp" value={href} onChange={e=>setHref(e.target.value)} placeholder="URL — e.g. /about (optional)" />
                  {(pages||[]).length>0 && (
                    <div style={{display:'flex',gap:3,flexWrap:'wrap',marginTop:4}}>
                      {pages.map(pg=>(
                        <span key={pg.id} onClick={()=>setHref(pg.slug)}
                          style={{fontSize:10,padding:'2px 7px',borderRadius:10,background:href===pg.slug?'var(--gold)':'var(--bg3)',color:href===pg.slug?'#1c0f00':'var(--tx3)',border:'1px solid var(--b1)',cursor:'pointer',fontFamily:"'JetBrains Mono',monospace",transition:'all .1s'}}>
                          {pg.slug}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
            <button className="btn btn-gh btn-sm" style={{width:'100%',justifyContent:'center',marginTop:4}} onClick={()=>u('items',[...(el.items||[]),'New item'])}>+ Add</button>
          </PSec>
          <PSec title="Style" open={false}>
            <div style={{marginBottom:10}}><label className="lbl">Style</label><Seg opts={[['bullet','● Bullet'],['numbered','1. Num'],['check','✓ Check'],['none','— None']]} value={el.style||'bullet'} onChange={v=>u('style',v)} /></div>
            <SL label="Font Size" value={el.fs||14} min={11} max={28} unit="px" onChange={v=>u('fs',v)} />
            <div style={{marginTop:8}}><label className="lbl">Link Color</label><CP value={el.linkColor||el.color} onChange={v=>u('linkColor',v)} /></div>
          </PSec>
        </>}

        {el.type==='feature' && <>
          <PSec title="Content">
            <label className="lbl">Icon</label>
            <input className="inp" value={el.icon||'✦'} onChange={e=>u('icon',e.target.value)} style={{marginBottom:8,fontSize:18}} />
            <label className="lbl">Title</label>
            <input className="inp" value={el.title||''} onChange={e=>u('title',e.target.value)} style={{marginBottom:8}} />
            <label className="lbl">Body</label>
            <textarea className="inp" rows={3} value={el.body||''} onChange={e=>u('body',e.target.value)} />
          </PSec>
          <PSec title="Colors" open={false}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
              {[['Icon','ic'],['Title','tc'],['Body','bc']].map(([l,k])=>(
                <div key={k}><label className="lbl">{l}</label><CP value={el[k]} onChange={v=>u(k,v)} /></div>
              ))}
            </div>
          </PSec>
        </>}

        {el.type==='event' && <>
          <PSec title="Content">
            <label className="lbl">Event Name</label>
            <input className="inp" value={el.title||''} onChange={e=>u('title',e.target.value)} style={{marginBottom:8}} />
            <label className="lbl">Description (optional)</label>
            <textarea className="inp" rows={2} value={el.desc||''} onChange={e=>u('desc',e.target.value)} style={{marginBottom:8}} />
            {[['date','Date'],['time','Time'],['loc','Location']].map(([k,l])=>(
              <div key={k} style={{marginBottom:8}}>
                <label className="lbl">{l}</label>
                <input className="inp" value={el[k]||''} onChange={e=>u(k,e.target.value)} />
              </div>
            ))}
            <label className="lbl">CTA Button Text (optional)</label>
            <input className="inp" value={el.ctaText||''} onChange={e=>u('ctaText',e.target.value)} style={{marginBottom:8}} placeholder="e.g. Register Now" />
            {el.ctaText && <>
              <label className="lbl">CTA URL</label>
              <input className="inp" value={el.ctaHref||''} onChange={e=>u('ctaHref',e.target.value)} placeholder="/events or #register" style={{marginBottom:(pages||[]).length?6:0}} />
              {(pages||[]).length>0 && (
                <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
                  {pages.map(pg=>(
                    <span key={pg.id} onClick={()=>u('ctaHref',pg.slug)}
                      style={{fontSize:10,padding:'2px 7px',borderRadius:10,background:el.ctaHref===pg.slug?'var(--gold)':'var(--bg3)',color:el.ctaHref===pg.slug?'#1c0f00':'var(--tx3)',border:'1px solid var(--b1)',cursor:'pointer',fontFamily:"'JetBrains Mono',monospace",transition:'all .1s'}}>
                      {pg.slug}
                    </span>
                  ))}
                </div>
              )}
            </>}
          </PSec>
          <PSec title="Style" open={false}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:10}}>
              <div><label className="lbl">Card BG</label><CP value={el.bg||'#ffffff'} onChange={v=>u('bg',v)} /></div>
              <div><label className="lbl">Border</label><CP value={el.border||'#e8e0d4'} onChange={v=>u('border',v)} /></div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:10}}>
              <div><label className="lbl">Title Color</label><CP value={el.tc||'#1a1715'} onChange={v=>u('tc',v)} /></div>
              <div><label className="lbl">Accent</label><CP value={el.ac||'#d4a843'} onChange={v=>u('ac',v)} /></div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:10}}>
              <div><label className="lbl">Meta Color</label><CP value={el.infoCo||'#6a6560'} onChange={v=>u('infoCo',v)} /></div>
              {el.ctaText && <div><label className="lbl">CTA Text</label><CP value={el.ctaColor||'#1c0f00'} onChange={v=>u('ctaColor',v)} /></div>}
            </div>
            <SL label="Title Size" value={el.fs||16} min={12} max={36} unit="px" onChange={v=>u('fs',v)} />
            <SL label="Meta Size" value={el.infoFs||13} min={10} max={20} unit="px" onChange={v=>u('infoFs',v)} />
            <SL label="Border Radius" value={el.br||11} min={0} max={32} unit="px" onChange={v=>u('br',v)} />
            <SL label="Padding X" value={el.px||20} min={8} max={56} unit="px" onChange={v=>u('px',v)} />
            <SL label="Padding Y" value={el.py||18} min={8} max={56} unit="px" onChange={v=>u('py',v)} />
          </PSec>
        </>}

        {el.type==='badge' && <>
          <PSec title="Content"><label className="lbl">Label</label><input className="inp" value={el.text||''} onChange={e=>u('text',e.target.value)} /></PSec>
          <PSec title="Style" open={false}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:8}}>
              <div><label className="lbl">BG</label><CP value={el.bg} onChange={v=>u('bg',v)} /></div>
              <div><label className="lbl">Text</label><CP value={el.tc} onChange={v=>u('tc',v)} /></div>
            </div>
            <SL label="Font Size" value={el.fs||11} min={9}  max={20} unit="px" onChange={v=>u('fs',v)} />
            <SL label="Radius"    value={el.br||20} min={0}  max={30} unit="px" onChange={v=>u('br',v)} />
          </PSec>
        </>}
      </>}

      {row && !el && <>
        <div style={{padding:'11px 14px',borderBottom:'1px solid var(--b1)',position:'sticky',top:0,background:'var(--bg2)',zIndex:10,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div>
            <div style={{fontSize:10.5,color:'var(--tx4)',textTransform:'uppercase',letterSpacing:'.06em',fontWeight:600}}>Section</div>
            <div style={{fontSize:13.5,fontWeight:600,color:'var(--tx)',marginTop:1}}>Row Settings</div>
          </div>
          <div style={{display:'flex',gap:3}}>
            <button className="btn-ic" onClick={onDupRow} data-tip="Duplicate" style={{fontSize:14}}>⊕</button>
            <button className="btn-ic btn-dng" onClick={onDelRow} style={{color:'var(--red)',fontSize:14}}>✕</button>
          </div>
        </div>
        <PSec title="Background">
          <label className="lbl">Solid Color</label>
          <CP value={row.bg||'#ffffff'} onChange={v=>onRow('bg',v)} />
          <div style={{height:1,background:'var(--b1)',margin:'12px 0'}} />
          <label className="lbl">Background Image URL</label>
          <input className="inp" value={row.bgImage||''} onChange={e=>onRow('bgImage',e.target.value)}
            placeholder="https://..." style={{marginBottom:8}} />
          {row.bgImage && (
  <>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:8}}>
      <div>
        <label className="lbl">Attachment</label>
        <Seg opts={[['scroll','Scroll'],['fixed','Fixed (Parallax)']]} value={row.bgAttachment||'scroll'} onChange={v=>onRow('bgAttachment',v)} />
      </div>
      <div>
        <label className="lbl">Size</label>
        <Seg opts={[['cover','Cover'],['contain','Contain']]} value={row.bgSize||'cover'} onChange={v=>onRow('bgSize',v)} />
      </div>
    </div>
    <div style={{marginBottom:8}}>
      <label className="lbl">Position</label>
      <Seg opts={[['center','Center'],['top','Top'],['bottom','Bottom']]} value={row.bgPosition||'center'} onChange={v=>onRow('bgPosition',v)} />
    </div>
  </>
)}
          <label className="lbl">Background Video URL (.mp4)</label>
          <input className="inp" value={row.bgVideo||''} onChange={e=>onRow('bgVideo',e.target.value)}
            placeholder="https://.../loop.mp4" style={{marginBottom:8}} />
          {(row.bgImage||row.bgVideo) && (
            <SL label="Overlay Opacity" value={row.bgOverlay??0.4}
              min={0} max={1} step={0.05} onChange={v=>onRow('bgOverlay',v)} />
          )}
        </PSec>
        <PSec title="Spacing">
          <SL label="Padding Top"    value={row.pt||40} min={0} max={200} unit="px" onChange={v=>onRow('pt',v)} />
          <SL label="Padding Bottom" value={row.pb||40} min={0} max={200} unit="px" onChange={v=>onRow('pb',v)} />
        </PSec>
        <PSec title="Columns">
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>
            {[[1,'Full'],[2,'2 Col'],[3,'3 Col'],[4,'4 Col']].map(([n,l])=>(
              <button key={n} onClick={()=>onRow('cols',n)}
                style={{padding:'7px',borderRadius:6,border:`1px solid ${row.cols===n?'rgba(212,168,67,.35)':'var(--b2)'}`,background:row.cols===n?'var(--g4)':'var(--bg4)',cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',gap:4,transition:'all .12s'}}>
                <div style={{display:'flex',gap:2,height:8}}>
                  {Array.from({length:n}).map((_,i)=><div key={i} style={{flex:1,background:row.cols===n?'var(--gold)':'var(--bg6)',borderRadius:1,minWidth:4}} />)}
                </div>
                <span style={{fontSize:10.5,color:row.cols===n?'var(--gold)':'var(--tx3)',fontWeight:row.cols===n?600:400}}>{l}</span>
              </button>
            ))}
          </div>
        </PSec>
      </>}
    </div>
  )
}
