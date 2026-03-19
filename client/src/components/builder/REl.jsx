export default function REl({ el, onNavigate }) {
  const al = el.align || 'center'
  const s  = { textAlign:al, width:'100%', paddingTop:el.pt||0, paddingBottom:el.pb||0 }

  const handleLink = (e, href) => {
    if (!href) return
    if (/^(https?:|mailto:|tel:|sms:)/.test(href)) return
    if (onNavigate) { e.preventDefault(); onNavigate(href) }
  }

  if (el.type === 'heading') return (
    <div style={s}>
      <div style={{fontFamily:el.ff==='Playfair'?"'Playfair Display',serif":"'Instrument Sans',sans-serif",fontSize:el.fs||36,fontWeight:el.fw||'700',color:el.color||'#1a1715',fontStyle:el.italic?'italic':'normal',letterSpacing:(el.ls||0)+'px',lineHeight:el.lh||1.15,whiteSpace:'pre-wrap',width:'100%',textAlign:al}}>{el.text}</div>
    </div>
  )

  if (el.type === 'text') return (
    <div style={s}>
      <div style={{fontSize:el.fs||16,color:el.color||'#4a4540',lineHeight:el.lh||1.75,fontWeight:el.fw||'400',whiteSpace:'pre-wrap',textAlign:al,width:'100%'}}>{el.text}</div>
    </div>
  )

  if (el.type === 'button') {
    const io = el.style==='outline', ig = el.style==='ghost'
    const btnStyle = {display:'inline-flex',alignItems:'center',justifyContent:'center',padding:`${el.py||11}px ${el.px||24}px`,borderRadius:el.br||8,fontSize:el.fs||14,fontWeight:el.fw||'600',cursor:el.href?'pointer':'default',background:io||ig?'transparent':el.bg||'#d4a843',color:io?(el.bg||'#d4a843'):ig?(el.bg||'#d4a843'):el.tc||'#fff',border:io||ig?`2px solid ${el.bg||'#d4a843'}`:'none',textDecoration:'none'}
    return (
      <div style={s}>
        {el.href
          ? <a href={el.href} onClick={e=>handleLink(e,el.href)} style={btnStyle}>{el.text}</a>
          : <div style={btnStyle}>{el.text}</div>
        }
      </div>
    )
  }

  if (el.type === 'image') return (
    <div style={s}>
      <div style={{width:'100%',borderRadius:el.br||0,overflow:'hidden',background:'linear-gradient(135deg,#ede8e0,#e0dbd2)',height:el.h||240,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:8,position:'relative'}}>
        {el.src
          ? <img src={el.src} alt={el.alt} style={{width:'100%',height:'100%',objectFit:el.fit||'cover',display:'block',position:'absolute',inset:0}} />
          : <>
              <div style={{width:52,height:52,borderRadius:10,background:'rgba(255,255,255,.5)',border:'2px dashed #c8c0b4',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,color:'#c8c0b4'}}>⊞</div>
              <div style={{fontSize:12,color:'#b0a898'}}>Click to add image URL</div>
            </>
        }
      </div>
    </div>
  )

  if (el.type === 'divider') return (
    <div style={{...s,paddingTop:Math.max(8,el.pt||8),paddingBottom:Math.max(8,el.pb||8)}}>
      <div style={{width:(el.w||80)+'%',margin:'0 auto',height:el.thick||1,background:el.color||'#e0dbd4',borderRadius:2}} />
    </div>
  )

  if (el.type === 'spacer') return <div style={{height:el.h||32,width:'100%'}} />

  if (el.type === 'list') return (
    <div style={s}>
      <ul style={{listStyle:'none',display:'inline-block',textAlign:'left',maxWidth:'100%'}}>
        {(el.items||[]).map((item, i) => {
          const isObj = typeof item === 'object' && item !== null
          const label = isObj ? (item.label||'') : item
          const href  = isObj ? (item.href||'')  : ''
          return (
            <li key={i} style={{display:'flex',alignItems:'flex-start',gap:9,marginBottom:7,fontSize:el.fs||14,color:el.color||'#4a4540'}}>
              {el.style!=='none' && (
                <span style={{color:el.ic||'#d4a843',flexShrink:0,marginTop:3,fontSize:el.style==='numbered'?el.fs||14:9}}>
                  {el.style==='numbered'?(i+1)+'.':el.style==='check'?'✓':'●'}
                </span>
              )}
              {href
                ? <a href={href} onClick={e=>handleLink(e,href)} style={{color:el.linkColor||el.color||'#4a4540',textDecoration:'none',borderBottom:`1px solid ${el.linkColor||el.color||'rgba(100,100,100,.3)'}`}}>{label}</a>
                : <span>{label}</span>
              }
            </li>
          )
        })}
      </ul>
    </div>
  )

  if (el.type === 'quote') return (
    <div style={s}>
      <div style={{borderLeft:`4px solid ${el.bc||'#d4a843'}`,background:el.bg||'#faf7f2',padding:'18px 22px',borderRadius:'0 8px 8px 0',display:'inline-block',textAlign:'left',width:'100%'}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:el.fs||19,fontStyle:'italic',color:el.color||'#1a1715',lineHeight:1.55,marginBottom:el.attr?10:0}}>{el.text}</div>
        {el.attr && <div style={{fontSize:13,color:'#9a9086',fontWeight:'600'}}>— {el.attr}</div>}
      </div>
    </div>
  )

  if (el.type === 'badge') return (
    <div style={s}>
      <span style={{display:'inline-flex',alignItems:'center',padding:`4px ${el.px||12}px`,background:el.bg||'#d4a843',color:el.tc||'#1c0f00',borderRadius:el.br||20,fontSize:el.fs||11,fontWeight:'600',letterSpacing:'.05em'}}>{el.text}</span>
    </div>
  )

  if (el.type === 'feature') return (
    <div style={s}>
      <div style={{display:'inline-block',textAlign:al,maxWidth:'100%',width:'100%'}}>
        <div style={{fontSize:26,color:el.ic||'#d4a843',marginBottom:10,lineHeight:1}}>{el.icon}</div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:19,fontWeight:'500',color:el.tc||'#1a1715',marginBottom:7,lineHeight:1.2}}>{el.title}</div>
        <div style={{fontSize:13,color:el.bc||'#6a6560',lineHeight:1.7}}>{el.body}</div>
      </div>
    </div>
  )

  if (el.type === 'event') {
    const cardAl = el.align || 'left'
    const metaItems = [[el.date,'◷'],[el.time,'⊙'],[el.loc,'◉']].filter(([v]) => v)
    return (
      <div style={s}>
        <div style={{display:'inline-block',padding:`${el.py||18}px ${el.px||20}px`,background:el.bg||'#ffffff',borderRadius:el.br||11,border:`1px solid ${el.border||'#e8e0d4'}`,boxShadow:'0 2px 10px rgba(0,0,0,.05)',textAlign:cardAl,width:'100%',boxSizing:'border-box'}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:el.fs||16,fontWeight:'600',color:el.tc||'#1a1715',marginBottom:9,lineHeight:1.25}}>{el.title}</div>
          {el.desc && <div style={{fontSize:(el.infoFs||13)-1,color:el.infoCo||'#6a6560',marginBottom:10,lineHeight:1.6}}>{el.desc}</div>}
          <div style={{display:'flex',flexDirection:'column',alignItems:cardAl==='center'?'center':cardAl==='right'?'flex-end':'flex-start',gap:4}}>
            {metaItems.map(([v,ic],i) => (
              <div key={i} style={{display:'flex',alignItems:'center',gap:7,fontSize:el.infoFs||13,color:el.infoCo||'#6a6560'}}>
                <span style={{color:el.ac||'#d4a843',fontSize:10,flexShrink:0}}>{ic}</span>{v}
              </div>
            ))}
          </div>
          {el.ctaText && (
            <div style={{marginTop:14,textAlign:cardAl}}>
              <a href={el.ctaHref||undefined} onClick={e=>handleLink(e,el.ctaHref)} style={{display:'inline-block',padding:`7px 18px`,background:el.ac||'#d4a843',color:el.ctaColor||'#1c0f00',borderRadius:el.br||6,fontSize:12,fontWeight:700,textDecoration:'none',cursor:'pointer'}}>{el.ctaText}</a>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (el.type === 'video') return (
    <div style={s}>
      <video
        src={el.src} poster={el.poster}
        autoPlay={el.autoplay} loop={el.loop} muted={el.muted}
        controls={!el.autoplay}
        style={{width:'100%',height:el.h||360,objectFit:'cover',borderRadius:el.br||8,display:'block'}}
      />
    </div>
  )

  return <div style={{padding:10,background:'#f0ece4',borderRadius:4,fontSize:12,color:'#888'}}>{el.type}</div>
}
