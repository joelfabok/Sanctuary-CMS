import { useState } from 'react'
import { CP } from '../shared/UI'
import { PALETTES } from '../../data/constants'

export default function StylesTab({ palette, onApply, customColors, onCustom }) {
  const [tab, setTab] = useState('palettes')
  const cur = PALETTES.find(p => p.id === palette) || PALETTES[0]
  const FIELDS = [
    ['darkBg',  'Dark Background', 'Hero & dark sections'],
    ['accent',  'Accent / Brand',  'Buttons, icons, highlights'],
    ['heading', 'Heading Text',    'Headings on light bg'],
    ['lightBg', 'Light Background','Main content sections'],
    ['warmBg',  'Warm Background', 'Alternate sections'],
    ['white',   'White / Bright',  'Cards & overlays'],
  ]

  return (
    <div style={{paddingBottom:16}}>
      <div style={{display:'flex',gap:2,marginBottom:14,background:'var(--bg4)',padding:3,borderRadius:'var(--r)',border:'1px solid var(--b1)'}}>
        {[['palettes','Palettes'],['custom','Custom']].map(([t,l])=>(
          <button key={t} onClick={()=>setTab(t)}
            style={{flex:1,padding:'5px',border:'none',borderRadius:4,background:tab===t?'var(--bg6)':'transparent',color:tab===t?'var(--tx)':'var(--tx3)',fontSize:11.5,cursor:'pointer',fontFamily:"'Instrument Sans',sans-serif",fontWeight:tab===t?600:400,transition:'all .12s'}}>
            {l}
          </button>
        ))}
      </div>

      {tab==='palettes' && <>
        <div style={{marginBottom:12,padding:'9px 10px',background:'var(--bg4)',borderRadius:'var(--r2)',border:'1px solid rgba(212,168,67,.2)'}}>
          <div style={{fontSize:10,color:'var(--gold)',fontWeight:700,letterSpacing:'.07em',textTransform:'uppercase',marginBottom:6}}>Active</div>
          <div style={{fontSize:13,color:'var(--tx)',fontWeight:600,marginBottom:4}}>{cur.name}</div>
          <div style={{display:'flex',gap:2,height:12,borderRadius:2,overflow:'hidden'}}>
            {cur.colors.map((c,i)=><div key={i} style={{flex:1,background:c}} />)}
          </div>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:4}}>
          {PALETTES.map(p => {
            const ia = palette === p.id
            return (
              <div key={p.id} onClick={()=>onApply(p)}
                style={{padding:'8px 10px',borderRadius:'var(--r2)',border:`1px solid ${ia?'rgba(212,168,67,.35)':'var(--b1)'}`,background:ia?'var(--g4)':'transparent',cursor:'pointer',transition:'all .15s'}}
                onMouseEnter={e=>{if(!ia){e.currentTarget.style.background='var(--bg4)';e.currentTarget.style.borderColor='var(--b2)'}}}
                onMouseLeave={e=>{if(!ia){e.currentTarget.style.background='transparent';e.currentTarget.style.borderColor='var(--b1)'}}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:4}}>
                  <span style={{fontSize:11.5,fontWeight:ia?600:500,color:ia?'var(--gold)':'var(--tx2)'}}>{p.name}</span>
                  {ia && <span style={{fontSize:9,color:'var(--gold)',background:'var(--g3)',padding:'2px 7px',borderRadius:8,fontWeight:700}}>Active</span>}
                </div>
                <div style={{display:'flex',gap:2,height:11,borderRadius:2,overflow:'hidden',marginBottom:3}}>
                  {p.colors.map((c,i)=><div key={i} style={{flex:[2,1,1.5,1,1.5,1][i]||1,background:c}} />)}
                </div>
                <div style={{fontSize:10,color:'var(--tx4)',fontStyle:'italic'}}>{p.mood}</div>
              </div>
            )
          })}
        </div>
      </>}

      {tab==='custom' && <>
        <div style={{marginBottom:12,borderRadius:8,overflow:'hidden',border:'1px solid var(--b2)'}}>
          <div style={{background:customColors.darkBg,padding:'9px 12px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <span style={{fontFamily:"'Playfair Display',serif",fontSize:13,color:customColors.accent,fontWeight:600}}>Church Name</span>
            <div style={{background:customColors.accent,color:customColors.darkBg,padding:'4px 10px',borderRadius:4,fontSize:10,fontWeight:700}}>Visit Us</div>
          </div>
          <div style={{background:customColors.lightBg,padding:'10px 12px'}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,color:customColors.heading,marginBottom:4}}>Welcome Home</div>
            <div style={{background:customColors.accent,color:customColors.darkBg,display:'inline-block',padding:'4px 12px',borderRadius:5,fontSize:11,fontWeight:700}}>Plan Your Visit</div>
          </div>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:7}}>
          {FIELDS.map(([key,label,hint])=>(
            <div key={key} style={{padding:'8px 10px',background:'var(--bg4)',borderRadius:'var(--r)',border:'1px solid var(--b1)'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:6}}>
                <div>
                  <div style={{fontSize:11.5,fontWeight:600,color:'var(--tx2)'}}>{label}</div>
                  <div style={{fontSize:10.5,color:'var(--tx4)'}}>{hint}</div>
                </div>
                <div style={{width:22,height:22,background:customColors[key],borderRadius:4,border:'2px solid rgba(255,255,255,.15)',flexShrink:0}} />
              </div>
              <CP value={customColors[key]} onChange={v=>onCustom(key,v)} />
            </div>
          ))}
        </div>
      </>}
    </div>
  )
}
