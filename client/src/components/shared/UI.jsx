import { useState, useEffect } from 'react'

export function Modal({ title, onClose, children, width = 480 }) {
  return (
    <div style={{position:'fixed',inset:0,zIndex:999,background:'rgba(0,0,0,.75)',backdropFilter:'blur(3px)',display:'flex',alignItems:'center',justifyContent:'center',padding:20}} onClick={onClose}>
      <div style={{background:'var(--bg2)',border:'1px solid var(--b2)',borderRadius:16,padding:'28px',width:'100%',maxWidth:width,boxShadow:'0 32px 80px rgba(0,0,0,.7)',animation:'popIn .2s ease',maxHeight:'90vh',overflow:'auto'}} onClick={e=>e.stopPropagation()}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:22}}>
          <h3 style={{fontSize:22,fontWeight:400}}>{title}</h3>
          <button className="btn-ic" onClick={onClose} style={{fontSize:16}}>✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function PSec({ title, children, open: initOpen = true }) {
  const [open, setOpen] = useState(initOpen)
  return (
    <div>
      <div className="ph-row" onClick={() => setOpen(!open)}>
        <span style={{fontSize:10.5,fontWeight:700,letterSpacing:'.07em',textTransform:'uppercase',color:'var(--tx3)'}}>{title}</span>
        <span style={{color:'var(--tx4)',fontSize:11,transition:'transform .15s',transform:open?'rotate(180deg)':''}}>▾</span>
      </div>
      {open && <div className="ps">{children}</div>}
    </div>
  )
}

export function SL({ label, value, min, max, step = 1, unit = '', onChange }) {
  return (
    <div style={{marginBottom:10}}>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:5}}>
        <span className="lbl" style={{marginBottom:0}}>{label}</span>
        <span style={{fontSize:11,color:'var(--gold)',fontFamily:"'JetBrains Mono',monospace"}}>{value}{unit}</span>
      </div>
      <input type="range" className="slider" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} />
    </div>
  )
}

export function Seg({ opts, value, onChange }) {
  return (
    <div className="seg">
      {opts.map(([v, l]) => (
        <button key={v} className={`seg-b${value === v ? ' on' : ''}`} onClick={() => onChange(v)}>{l}</button>
      ))}
    </div>
  )
}

export function AlBtns({ value, onChange }) {
  return (
    <div style={{display:'flex',gap:3}}>
      {[['left','←'],['center','↔'],['right','→']].map(([a, ic]) => (
        <button key={a} className={`btn-ic${value === a ? ' on' : ''}`}
          style={{flex:1,height:26,width:'auto',borderRadius:4,border:`1px solid ${value===a?'rgba(212,168,67,.25)':'var(--b1)'}`}}
          onClick={() => onChange(a)}>{ic}</button>
      ))}
    </div>
  )
}

const PAL_COLORS = ['#1a1715','#ffffff','#d4a843','#4a4540','#f2efea','#0f0e0c','#3b82f6','#4ade80','#f87171','#a855f7','#f97316','#0ea5e9','#faf8f5','#0a0a0c','transparent']

export function CP({ value, onChange }) {
  const [open, setOpen]   = useState(false)
  const [hex, setHex]     = useState(value || '#ffffff')
  useEffect(() => setHex(value || '#ffffff'), [value])

  return (
    <div style={{position:'relative'}}>
      <div style={{display:'flex',gap:6,alignItems:'center'}}>
        <div className="swatch" style={{background:value||'transparent'}} onClick={() => setOpen(!open)} />
        <input className="inp" value={hex}
          style={{width:84,fontFamily:"'JetBrains Mono',monospace",fontSize:11.5}}
          onChange={e => { setHex(e.target.value); if (/^#[0-9a-f]{6}$/i.test(e.target.value)) onChange(e.target.value) }} />
      </div>
      {open && (
        <div style={{position:'absolute',top:32,left:0,zIndex:9999,background:'var(--bg3)',border:'1px solid var(--b2)',borderRadius:'var(--r2)',padding:10,boxShadow:'0 8px 32px rgba(0,0,0,.7)',animation:'popIn .15s ease',minWidth:176}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:5,marginBottom:8}}>
            {PAL_COLORS.map(c => (
              <div key={c} className="swatch" style={{background:c,outline:c===value?'2px solid var(--gold)':'none',outlineOffset:1}}
                onClick={() => { onChange(c); setHex(c); setOpen(false) }} />
            ))}
          </div>
          <input type="color" value={hex.startsWith('#')?hex:'#ffffff'} onChange={e => { setHex(e.target.value); onChange(e.target.value) }}
            style={{width:'100%',height:26,border:'none',background:'none',cursor:'pointer',padding:0}} />
          <button className="btn btn-dk btn-sm" style={{width:'100%',marginTop:6,justifyContent:'center'}} onClick={() => setOpen(false)}>Done</button>
        </div>
      )}
    </div>
  )
}

export function Logo({ size = 24, onClick, style }) {
  return (
    <div onClick={onClick} style={{display:'flex',alignItems:'center',gap:7,cursor:onClick?'pointer':'default',...style}}>
      <div style={{width:size,height:size,background:'linear-gradient(135deg,#d4a843,#b88c2a)',borderRadius:Math.round(size*.28),display:'flex',alignItems:'center',justifyContent:'center',fontSize:size*.4,boxShadow:'0 2px 8px rgba(212,168,67,.3)'}}>✦</div>
      <span style={{fontFamily:"'Playfair Display',serif",fontSize:size*.75,fontWeight:600}}>Sanctuary</span>
    </div>
  )
}
