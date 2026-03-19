import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PALETTES, NAVBAR_STYLES, EL_TYPES, makeElement, SECTION_BLOCKS } from '../data/constants'
import REl from '../components/builder/REl'
import PropPanel from '../components/builder/PropPanel'
import StylesTab from '../components/builder/StylesTab'
import NavRenderer from '../components/shared/NavRenderer'
import { Logo } from '../components/shared/UI'
import api from '../utils/api'

const uid = () => Math.random().toString(36).slice(2,10)

// ── Parallax background component — TOP LEVEL, outside Builder ────
function ParallaxBg({ row, canvasRef, rowBgRefs }) {
  const bgRef = useRef(null)

  useEffect(() => { rowBgRefs.current[row.id] = bgRef }, [row.id])

  useEffect(() => {
    if (row.bgAttachment !== 'fixed') return
    const canvasEl = canvasRef.current
    const bgRef = useRef(null) // Store ref for this row
    if (!canvasEl || !rowEl) return
    function updateParallax() {
      const canvasRect = canvasEl.getBoundingClientRect()
      const rowRect = rowEl.getBoundingClientRect()
      const canvasScrollTop = canvasEl.scrollTop
      const rowTop = rowRect.top + canvasScrollTop - canvasRect.top
      const speed = 0.4
      const offset = (canvasScrollTop - rowTop) * speed
      rowEl.style.backgroundPosition = `${row.bgPosition||'center'} ${offset}px`
    }
    updateParallax()
    canvasEl.addEventListener('scroll', updateParallax)
    return () => canvasEl.removeEventListener('scroll', updateParallax)
  }, [row.bgAttachment, row.bgPosition, row.id, canvasRef])

  const style = row.bgAttachment === 'fixed'
    ? {
        position: 'absolute',
        left: 0, right: 0, top: '-10%', height: '120%', zIndex: 0,
        backgroundImage: `url(${row.bgImage})`,
        backgroundSize: row.bgSize || 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: `${row.bgPosition||'center'} 0px`,
        willChange: 'background-position',
        pointerEvents: 'none',
      }
    : {
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        backgroundImage: `url(${row.bgImage})`,
        backgroundSize: row.bgSize || 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: row.bgPosition || 'center',
        pointerEvents: 'none',
      }
  return <div ref={bgRef} style={style} />
}

export default function Builder() {
  // Parallax refs
  const canvasRef = useRef(null) // Parallax refs
  const rowBgRefs = useRef({})
  const { siteId } = useParams()
  const nav = useNavigate()

  const [site,     setSite]       = useState(null)
  const [pages,    setPages]      = useState(null)
  const [activePgId, setActivePgId] = useState('')
  const [footerRows, setFooterRows] = useState([])
  const [footerEditing, setFooterEditing] = useState(false)
  const [renamingId, setRenamingId] = useState(null)
  const [navCfg,   setNavCfg]     = useState(null)
  const [palette,  setPalette]  = useState('cornerstone')
  const [customColors, setCC]   = useState({ darkBg:'#0f0e0c', white:'#ffffff', accent:'#d4a843', heading:'#1a1715', lightBg:'#faf8f5', warmBg:'#f0ece4' })

  const [sel,       setSel]     = useState(null)
  const [navSel,    setNavSel]  = useState(false)
  const [viewport,  setVP]      = useState('desktop')
  const [leftTab,   setLT]      = useState('blocks')
  const [preview,   setPreview] = useState(false)
  const [saving,    setSaving]  = useState(false)
  const [pub,       setPub]     = useState(false)

  const [rowDrag,  setRD]  = useState(null)
  const [rowDragOv,setRDO] = useState(null)
  const [elDrag,   setED]  = useState(null)
  const [elDragOv, setEDO] = useState(null)
  const [palDrag,  setPD]  = useState(null)
  const [secDrag,  setSecDrag] = useState(null)

  const [hist, setHist] = useState([])
  const [fut,  setFut]  = useState([])

  useEffect(() => {
    api.get(`/sites/${siteId}`).then(r => {
      const s = r.data
      setSite(s)
      const rawPages = s.pages && s.pages.length
        ? s.pages
        : [{ id: uid(), name: 'Home', slug: '/', rows: s.rows || [] }]
      setPages(rawPages)
      setActivePgId(rawPages[0].id)
      setFooterRows(s.footerRows || [])
      setNavCfg(s.nav || {})
      setPalette(s.palette || 'cornerstone')
      setPub(s.published)
      const pal = PALETTES.find(p => p.id === (s.palette || 'cornerstone')) || PALETTES[0]
      setCC({ darkBg:pal.colors[0], white:pal.colors[1], accent:pal.colors[2], heading:pal.colors[3], lightBg:pal.colors[4], warmBg:pal.colors[5] })
    }).catch(() => nav('/dashboard'))
  }, [siteId])

  const activePage  = pages?.find(p => p.id === activePgId) || pages?.[0]
  const activeRows  = activePage?.rows || []
  const ctxRows     = footerEditing ? footerRows : activeRows
  const selRow      = ctxRows?.find(r => r.id === sel?.rowId)
  const selEl       = sel?.elId ? selRow?.cols_data[sel.colIdx]?.find(e => e.id === sel.elId) : null

  useEffect(() => {
    const h = (e) => {
      if ((e.metaKey||e.ctrlKey) && !e.shiftKey && e.key==='z') { e.preventDefault(); undo() }
      if ((e.metaKey||e.ctrlKey) && (e.shiftKey&&e.key==='z'||e.key==='y')) { e.preventDefault(); redo() }
      if (e.key==='Escape') clearSel()
      if ((e.key==='Delete'||e.key==='Backspace') && selEl && !['INPUT','TEXTAREA'].includes(document.activeElement?.tagName)) delEl()
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [selEl, hist, fut, pages, footerRows, navCfg])

  if (!pages || !navCfg) return (
    <div style={{height:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--bg)'}}>
      <div style={{width:32,height:32,border:'2px solid var(--gold)',borderTopColor:'transparent',borderRadius:'50%',animation:'spin .8s linear infinite'}} />
    </div>
  )

  const push = (np, nn = null, nfr = null) => {
    setHist(h => [...h.slice(-40), { pages, nav: navCfg, footerRows }])
    setFut([])
    setPages(np)
    if (nn !== null) setNavCfg(nn)
    if (nfr !== null) setFooterRows(nfr)
  }
  const undo = () => {
    if (!hist.length) return
    const s = hist[hist.length-1]
    setFut(f => [{ pages, nav: navCfg, footerRows }, ...f])
    setPages(s.pages); setNavCfg(s.nav); setFooterRows(s.footerRows)
    setHist(h => h.slice(0,-1))
  }
  const redo = () => {
    if (!fut.length) return
    const s = fut[0]
    setHist(h => [...h, { pages, nav: navCfg, footerRows }])
    setPages(s.pages); setNavCfg(s.nav); setFooterRows(s.footerRows)
    setFut(f => f.slice(1))
  }

  const save = async (publish = null) => {
    setSaving(true)
    try {
      const body = { nav: navCfg, pages, footerRows, palette }
      if (publish !== null) body.published = publish
      await api.put(`/sites/${siteId}`, body)
      if (publish !== null) setPub(publish)
    } finally { setSaving(false) }
  }

  const clearSel  = () => { setSel(null); setNavSel(false) }
  const updateCtxRows = (newRows) => {
    if (footerEditing) {
      push(pages, null, newRows)
    } else {
      push(pages.map(p => p.id !== activePgId ? p : { ...p, rows: newRows }))
    }
  }

  const updateEl  = (nel) => updateCtxRows(ctxRows.map(r => r.id!==sel.rowId ? r : { ...r, cols_data: r.cols_data.map((col,ci) => ci!==sel.colIdx ? col : col.map(e => e.id===nel.id?nel:e)) }))
  const updateRow = (k, v) => {
    if (k==='cols') {
      const r = ctxRows.find(r => r.id===sel.rowId)
      const nc = Array.from({length:v}, (_,i) => r.cols_data[i]||[])
      updateCtxRows(ctxRows.map(r => r.id!==sel.rowId?r:{...r,cols:v,cols_data:nc}))
    } else {
      updateCtxRows(ctxRows.map(r => r.id!==sel.rowId?r:{...r,[k]:v}))
    }
  }
  const updateNav = (nn) => push(pages, nn)
  const delEl  = () => { updateCtxRows(ctxRows.map(r => r.id!==sel.rowId?r:{...r,cols_data:r.cols_data.map((col,ci)=>ci!==sel.colIdx?col:col.filter(e=>e.id!==sel.elId))})); setSel({rowId:sel.rowId,rowOnly:true}) }
  const dupEl  = () => { const nel={...selEl,id:uid()}; updateCtxRows(ctxRows.map(r=>r.id!==sel.rowId?r:{...r,cols_data:r.cols_data.map((col,ci)=>{if(ci!==sel.colIdx)return col;const idx=col.findIndex(e=>e.id===sel.elId);const nc=[...col];nc.splice(idx+1,0,nel);return nc})})) }
  const addElTo = (type, rowId, colIdx) => { const el=makeElement(type); updateCtxRows(ctxRows.map(r=>r.id!==rowId?r:{...r,cols_data:r.cols_data.map((col,ci)=>ci!==colIdx?col:[...col,el])})); setSel({rowId,colIdx,elId:el.id}) }
  const addRow  = (cols=1) => { const r={id:uid(),cols,bg:'#ffffff',pt:48,pb:48,cols_data:Array.from({length:cols},()=>[])}; updateCtxRows([...ctxRows,r]); setSel({rowId:r.id,rowOnly:true}) }
  const delRow  = (rowId) => { updateCtxRows(ctxRows.filter(r=>r.id!==rowId)); clearSel() }
  const dupRow  = (rowId) => { const r=ctxRows.find(r=>r.id===rowId);const nr={...r,id:uid(),cols_data:r.cols_data.map(col=>col.map(e=>({...e,id:uid()})))};const idx=ctxRows.findIndex(r=>r.id===rowId);const rows=[...ctxRows];rows.splice(idx+1,0,nr);updateCtxRows(rows) }
  const cloneRow = (row) => ({...row,id:uid(),cols_data:row.cols_data.map(col=>col.map(el=>({...el,id:uid()})))})
  const dropSecBlock = (block, insertBeforeRowId=null) => {
    const cloned = cloneRow(block.row)
    if (insertBeforeRowId) {
      const idx = ctxRows.findIndex(r=>r.id===insertBeforeRowId)
      const rows=[...ctxRows]; rows.splice(idx,0,cloned); updateCtxRows(rows)
    } else {
      updateCtxRows([...ctxRows,cloned])
    }
    setSecDrag(null)
  }

  const applyPal = (pal) => {
    const old = PALETTES.find(p => p.id===palette)||PALETTES[0]
    const cm = {}; old.colors.forEach((c,i) => { cm[c]=pal.colors[i] })
    const mc = c => cm[c]||c
    const me = el => { const n={...el}; ['color','bg','tc','ic','bc','ac'].forEach(k=>{if(n[k])n[k]=mc(n[k])}); return n }
    const mapRows = rows => rows.map(r=>({...r,bg:mc(r.bg||'#fff'),cols_data:r.cols_data.map(col=>col.map(me))}))
    const np = pages.map(p => ({...p, rows: mapRows(p.rows)}))
    const nfr = mapRows(footerRows)
    const nn = { ...navCfg, bg:mc(navCfg.bg), logoColor:mc(navCfg.logoColor||'#d4a843'), ctaBg:navCfg.ctaBg?mc(navCfg.ctaBg):navCfg.ctaBg, stripBg:navCfg.stripBg?mc(navCfg.stripBg):navCfg.stripBg }
    push(np, nn, nfr); setPalette(pal.id)
    setCC({ darkBg:pal.colors[0], white:pal.colors[1], accent:pal.colors[2], heading:pal.colors[3], lightBg:pal.colors[4], warmBg:pal.colors[5] })
  }

  const onRowDS  = (e,id)  => { setRD(id); e.dataTransfer.effectAllowed='move' }
  const onRowDO  = (e,id)  => { e.preventDefault(); if(id!==rowDrag) setRDO(id) }
  const onRowDrop= (e,tid) => { e.preventDefault(); if(secDrag){dropSecBlock(secDrag,tid);setRDO(null);return}; if(!rowDrag||rowDrag===tid){setRD(null);setRDO(null);return}; const rows=[...ctxRows];const fi=rows.findIndex(r=>r.id===rowDrag),ti=rows.findIndex(r=>r.id===tid);const[it]=rows.splice(fi,1);rows.splice(ti,0,it);updateCtxRows(rows);setRD(null);setRDO(null) }

  const onElDS  = (e,rId,ci,eId) => { e.stopPropagation(); setED({rowId:rId,colIdx:ci,elId:eId}); e.dataTransfer.effectAllowed='move' }
  const onElDO  = (e,rId,ci,ei) => { e.preventDefault(); e.stopPropagation(); setEDO({rowId:rId,colIdx:ci,elIdx:ei}) }
  const onElDrop= (e,tRId,tCi,tEi) => {
    e.preventDefault(); e.stopPropagation()
    if (secDrag) { dropSecBlock(secDrag, tRId); setEDO(null); return }
    if (palDrag) { addElTo(palDrag,tRId,tCi); setPD(null); setEDO(null); return }
    if (!elDrag) { setED(null); setEDO(null); return }
    const { rowId:fRId, colIdx:fCi, elId } = elDrag
    if (fRId===tRId && fCi===tCi) {
      const row=ctxRows.find(r=>r.id===fRId);const col=[...row.cols_data[fCi]];const fi=col.findIndex(e=>e.id===elId);const[it]=col.splice(fi,1);col.splice(tEi,0,it)
      updateCtxRows(ctxRows.map(r=>r.id===fRId?{...r,cols_data:r.cols_data.map((c,i)=>i===fCi?col:c)}:r))
    } else {
      let mv
      const r1=ctxRows.map(r=>{if(r.id!==fRId)return r;return{...r,cols_data:r.cols_data.map((col,ci)=>{if(ci!==fCi)return col;const idx=col.findIndex(e=>e.id===elId);mv=col[idx];return col.filter(e=>e.id!==elId)})}})
      const r2=r1.map(r=>{if(r.id!==tRId)return r;return{...r,cols_data:r.cols_data.map((col,ci)=>{if(ci!==tCi)return col;const nc=[...col];nc.splice(tEi,0,mv);return nc})}})
      updateCtxRows(r2); setSel({rowId:tRId,colIdx:tCi,elId})
    }
    setED(null); setEDO(null)
  }

  const cvW = viewport==='mobile'?390:viewport==='tablet'?768:'100%'
  const curPalette = PALETTES.find(p=>p.id===palette)||PALETTES[0]

  return (
    <div style={{height:'100vh',display:'flex',flexDirection:'column',background:'var(--bg)',overflow:'hidden',userSelect:'none'}}>
      {/* Topbar */}
      <div style={{height:52,background:'var(--bg2)',borderBottom:'1px solid var(--b2)',display:'flex',alignItems:'center',padding:'0 12px',gap:5,flexShrink:0,zIndex:100}}>
        <div style={{display:'flex',alignItems:'center',gap:7,paddingRight:10,borderRight:'1px solid var(--b1)'}}>
          <Logo size={24} />
        </div>
        <div style={{display:'flex',alignItems:'center',gap:5,paddingRight:10,borderRight:'1px solid var(--b1)'}}>
          <button className="btn btn-gh btn-sm" onClick={()=>nav('/dashboard')} style={{fontSize:11}}>← Sites</button>
          <span style={{fontSize:12.5,color:'var(--tx2)',fontWeight:500}}>{site?.name}</span>
        </div>
        <button className="btn-ic" onClick={undo} disabled={!hist.length} style={{opacity:hist.length?1:.3}} data-tip="Undo ⌘Z">↩</button>
        <button className="btn-ic" onClick={redo} disabled={!fut.length}  style={{opacity:fut.length?1:.3}}  data-tip="Redo ⌘⇧Z">↪</button>
        <div style={{flex:1}} />
        <div style={{display:'flex',gap:1,background:'var(--bg4)',padding:3,borderRadius:8,border:'1px solid var(--b1)'}}>
          {[['desktop','⬚','Desktop'],['tablet','▭','Tablet'],['mobile','▯','Mobile']].map(([v,ic,l])=>(
            <button key={v} onClick={()=>setVP(v)} style={{display:'flex',alignItems:'center',gap:4,padding:'3px 9px',borderRadius:5,border:'none',background:viewport===v?'var(--bg6)':'transparent',color:viewport===v?'var(--tx)':'var(--tx3)',cursor:'pointer',fontSize:13,transition:'all .12s'}}>
              <span>{ic}</span><span style={{fontSize:10.5,fontWeight:500}}>{l}</span>
            </button>
          ))}
        </div>
        <div style={{width:1,height:20,background:'var(--b1)',margin:'0 4px'}} />
        <button className="btn btn-dk btn-sm" onClick={()=>setPreview(!preview)}><span style={{fontSize:10}}>{preview?'✏':'👁'}</span>{preview?'Edit':'Preview'}</button>
        <button className="btn btn-dk btn-sm" onClick={()=>save()} disabled={saving}>{saving?'Saving…':'Save'}</button>
        <button className="btn btn-gold btn-sm" onClick={()=>save(!pub)}>{pub?'✓ Published':'Publish →'}</button>
      </div>

      {/* Page Tabs */}
      {!preview && (
        <div style={{height:36,background:'var(--bg2)',borderBottom:'1px solid var(--b1)',display:'flex',alignItems:'center',padding:'0 12px',gap:2,flexShrink:0,overflowX:'auto'}}>
          {pages.map(pg => (
            <div key={pg.id}
              onClick={() => { setActivePgId(pg.id); setFooterEditing(false); clearSel() }}
              onDoubleClick={() => setRenamingId(pg.id)}
              style={{display:'flex',alignItems:'center',gap:4,padding:'4px 9px',borderRadius:6,cursor:'pointer',
                background:!footerEditing&&activePgId===pg.id?'var(--bg4)':'transparent',
                border:`1px solid ${!footerEditing&&activePgId===pg.id?'var(--b2)':'transparent'}`,
                fontSize:12,color:!footerEditing&&activePgId===pg.id?'var(--tx)':'var(--tx3)',
                fontWeight:!footerEditing&&activePgId===pg.id?600:400,transition:'all .12s',flexShrink:0,userSelect:'none'}}>
              {renamingId===pg.id
                ? <input autoFocus value={pg.name}
                    onChange={e=>{
                      const name=e.target.value
                      const slug='/'+name.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'').replace(/^-+|-+$/g,'')||'/page'
                      setPages(pages.map(p=>p.id===pg.id?{...p,name,slug}:p))
                    }}
                    onBlur={()=>setRenamingId(null)}
                    onKeyDown={e=>{if(e.key==='Enter'||e.key==='Escape')setRenamingId(null)}}
                    onClick={e=>e.stopPropagation()}
                    style={{width:80,background:'transparent',border:'none',outline:'none',color:'inherit',fontSize:12,fontFamily:"'Instrument Sans',sans-serif"}} />
                : <span>{pg.name}</span>}
              {pages.length>1 && pg.id!==pages[0].id && renamingId!==pg.id && (
                <span onClick={e=>{e.stopPropagation();const np=pages.filter(p=>p.id!==pg.id);setPages(np);if(activePgId===pg.id){setActivePgId(np[0].id)};clearSel()}}
                  style={{fontSize:9,color:'var(--tx4)',marginLeft:1,lineHeight:1,padding:'1px 3px',borderRadius:2,cursor:'pointer'}}>×</span>
              )}
            </div>
          ))}
          <button
            onClick={()=>{
              const nameBase='New Page'
              const slugify=n=>'/'+n.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'')
              const np={id:uid(),name:nameBase,slug:slugify(nameBase),rows:[]}
              setPages(p=>[...p,np]);setActivePgId(np.id);setFooterEditing(false);clearSel()
            }}
            style={{padding:'4px 9px',borderRadius:6,border:'1px dashed var(--b2)',background:'transparent',color:'var(--tx4)',fontSize:11,cursor:'pointer',flexShrink:0,fontFamily:"'Instrument Sans',sans-serif",marginLeft:4}}>+ Page</button>
          <div style={{flex:1}} />
          <div onClick={()=>{setFooterEditing(true);clearSel()}}
            style={{display:'flex',alignItems:'center',gap:4,padding:'4px 9px',borderRadius:6,cursor:'pointer',flexShrink:0,
              background:footerEditing?'var(--bg4)':'transparent',
              border:`1px solid ${footerEditing?'var(--b2)':'transparent'}`,
              fontSize:12,color:footerEditing?'var(--gold)':'var(--tx4)',
              fontWeight:footerEditing?600:400,transition:'all .12s',userSelect:'none'}}>
            <span style={{fontSize:10}}>▤</span> Footer
          </div>
        </div>
      )}

      <div style={{flex:1,display:'flex',overflow:'hidden'}}>
        {/* Left sidebar */}
        {!preview && (
          <div style={{width:236,background:'var(--bg2)',borderRight:'1px solid var(--b1)',display:'flex',flexDirection:'column',flexShrink:0,overflow:'hidden'}}>
            <div style={{display:'flex',borderBottom:'1px solid var(--b1)',flexShrink:0}}>
              {[['blocks','Blocks'],['layers','Layers'],['styles','Styles']].map(([tab,l])=>(
                <button key={tab} onClick={()=>setLT(tab)} style={{flex:1,padding:'9px 0',border:'none',background:'transparent',color:leftTab===tab?'var(--tx)':'var(--tx4)',fontSize:11.5,fontWeight:leftTab===tab?600:400,cursor:'pointer',borderBottom:leftTab===tab?'2px solid var(--gold)':'2px solid transparent',fontFamily:"'Instrument Sans',sans-serif",transition:'all .12s'}}>{l}</button>
              ))}
            </div>
            <div style={{flex:1,overflow:'auto',padding:10}}>
              {leftTab==='blocks' && <>
                <div style={{fontSize:10,color:'var(--tx4)',fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',marginBottom:10}}>Drag or double-click</div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:5}}>
                  {EL_TYPES.map(et => (
                    <div key={et.type} className="bp"
                      draggable onDragStart={e=>{setPD(et.type);e.dataTransfer.effectAllowed='copy'}}
                      onDoubleClick={()=>{const r=selRow||ctxRows[0];if(r)addElTo(et.type,r.id,sel?.colIdx||0)}}>
                      <div style={{fontFamily:et.type==='heading'?"'Playfair Display',serif":'inherit',fontSize:et.type==='heading'?17:14,color:'var(--gold)',lineHeight:1}}>{et.icon}</div>
                      <div style={{fontSize:10.5,color:'var(--tx3)',fontWeight:500}}>{et.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{marginTop:12,padding:'10px 8px',background:'var(--bg4)',borderRadius:8,border:'1px solid var(--b1)'}}>
                  <div style={{fontSize:10,color:'var(--tx4)',fontWeight:700,letterSpacing:'.07em',textTransform:'uppercase',marginBottom:7}}>Add Row</div>
                  <div style={{display:'flex',gap:3}}>
                    {[1,2,3,4].map(n=>(
                      <button key={n} onClick={()=>addRow(n)} className="btn btn-gh btn-sm" style={{flex:1,padding:'5px 0',justifyContent:'center'}} data-tip={n+' col'}>
                        {Array.from({length:n}).map((_,i)=><span key={i} style={{display:'inline-block',width:4,height:11,background:'var(--b3)',borderRadius:1,margin:'0 1px'}} />)}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{margin:'16px 0 6px',height:1,background:'var(--b1)'}} />
                <div style={{fontSize:10,color:'var(--tx4)',fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',marginBottom:8}}>Section Blocks</div>
                <div style={{fontSize:10,color:'var(--tx4)',marginBottom:10}}>Drag onto canvas or double-click to append</div>
                {['Structure','Hero','Content','CTA'].map(cat=>{
                  const blocks=SECTION_BLOCKS.filter(b=>b.category===cat)
                  if(!blocks.length) return null
                  return (
                    <div key={cat} style={{marginBottom:10}}>
                      <div style={{fontSize:9,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--tx4)',marginBottom:5,paddingLeft:2}}>{cat}</div>
                      {blocks.map(block=>(
                        <div key={block.id}
                          draggable
                          onDragStart={e=>{setSecDrag(block);e.dataTransfer.effectAllowed='copy'}}
                          onDragEnd={()=>setSecDrag(null)}
                          onDoubleClick={()=>dropSecBlock(block)}
                          style={{display:'flex',alignItems:'center',gap:9,padding:'8px 10px',background:'var(--bg4)',border:'1px solid var(--b1)',borderRadius:7,marginBottom:4,cursor:'grab',transition:'border-color .1s,background .1s',userSelect:'none'}}
                          onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(212,168,67,.35)';e.currentTarget.style.background='var(--bg3)'}}
                          onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--b1)';e.currentTarget.style.background='var(--bg4)'}}>
                          <div style={{width:28,height:28,borderRadius:6,background:'var(--bg3)',border:'1px solid var(--b2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,color:'var(--gold)',flexShrink:0,lineHeight:1}}>{block.icon}</div>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{fontSize:11.5,fontWeight:600,color:'var(--tx)',lineHeight:1.2}}>{block.label}</div>
                            <div style={{fontSize:10,color:'var(--tx4)',marginTop:2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{block.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                })}
              </>}

              {leftTab==='layers' && <>
                <div style={{fontSize:10,color:'var(--tx4)',fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',marginBottom:6}}>Pages</div>
                <div style={{marginBottom:8,display:'flex',flexDirection:'column',gap:2}}>
                  {pages.map(pg => (
                    <div key={pg.id} onClick={()=>{setActivePgId(pg.id);setFooterEditing(false);clearSel()}}
                      style={{display:'flex',alignItems:'center',gap:7,padding:'5px 8px',borderRadius:6,cursor:'pointer',transition:'all .12s',
                        background:!footerEditing&&activePgId===pg.id?'var(--g4)':'transparent',
                        border:`1px solid ${!footerEditing&&activePgId===pg.id?'rgba(212,168,67,.2)':'transparent'}`}}>
                      <span style={{color:'var(--tx4)',fontSize:9}}>◈</span>
                      <span style={{fontSize:11.5,flex:1,fontWeight:500,color:!footerEditing&&activePgId===pg.id?'var(--gold)':'var(--tx3)'}}>{pg.name}</span>
                    </div>
                  ))}
                  <div onClick={()=>{setFooterEditing(true);clearSel()}}
                    style={{display:'flex',alignItems:'center',gap:7,padding:'5px 8px',borderRadius:6,cursor:'pointer',transition:'all .12s',
                      background:footerEditing?'var(--g4)':'transparent',
                      border:`1px solid ${footerEditing?'rgba(212,168,67,.2)':'transparent'}`}}>
                    <span style={{color:'var(--gold)',fontSize:9}}>▤</span>
                    <span style={{fontSize:11.5,flex:1,fontWeight:500,color:footerEditing?'var(--gold)':'var(--tx3)'}}>Footer</span>
                    <span className="badge badge-gold" style={{fontSize:9}}>Shared</span>
                  </div>
                </div>
                <div style={{fontSize:10,color:'var(--tx4)',fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',marginBottom:8}}>{footerEditing?'Footer':'Page'} Rows</div>
                <div onClick={()=>{setNavSel(true);setSel(null)}} style={{display:'flex',alignItems:'center',gap:7,padding:'6px 8px',borderRadius:6,background:navSel?'var(--g4)':'transparent',border:`1px solid ${navSel?'rgba(212,168,67,.2)':'transparent'}`,cursor:'pointer',marginBottom:3,transition:'all .12s'}}>
                  <span style={{color:'var(--gold)',fontSize:10}}>☰</span>
                  <span style={{color:navSel?'var(--gold)':'var(--tx3)',fontSize:12,flex:1,fontWeight:500}}>Navbar</span>
                  <span className="badge badge-gold" style={{fontSize:9}}>Nav</span>
                </div>
                {ctxRows.map((row, ri) => (
                  <div key={row.id} style={{marginBottom:2}}>
                    <div onClick={()=>{setSel({rowId:row.id,rowOnly:true});setNavSel(false)}} style={{display:'flex',alignItems:'center',gap:7,padding:'5px 8px',borderRadius:6,background:sel?.rowId===row.id&&sel?.rowOnly?'var(--g4)':'transparent',border:`1px solid ${sel?.rowId===row.id?'rgba(212,168,67,.2)':'transparent'}`,cursor:'pointer',transition:'all .12s'}}>
                      <span style={{color:'var(--tx4)',fontSize:9}}>⠿</span>
                      <span style={{color:sel?.rowId===row.id&&sel?.rowOnly?'var(--gold)':'var(--tx3)',fontSize:11.5,flex:1,fontWeight:500}}>Row {ri+1}</span>
                      <span style={{fontSize:9.5,color:'var(--tx4)'}}>{row.cols}col</span>
                    </div>
                    {row.cols_data.map((col,ci) => col.map(el => (
                      <div key={el.id} onClick={()=>{setSel({rowId:row.id,colIdx:ci,elId:el.id});setNavSel(false)}} style={{display:'flex',alignItems:'center',gap:5,padding:'3px 8px 3px 18px',borderRadius:6,background:sel?.elId===el.id?'var(--g4)':'transparent',cursor:'pointer',marginBottom:1,transition:'all .12s'}}>
                        <span style={{color:'var(--gold)',fontSize:9.5,width:11}}>{EL_TYPES.find(e=>e.type===el.type)?.icon}</span>
                        <span style={{fontSize:11,color:sel?.elId===el.id?'var(--tx)':'var(--tx3)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:140}}>
                          {el.type==='heading'&&el.text?el.text.slice(0,22):EL_TYPES.find(e=>e.type===el.type)?.label}
                        </span>
                      </div>
                    )))}
                  </div>
                ))}
              </>}

              {leftTab==='styles' && (
                <StylesTab palette={palette} onApply={applyPal} customColors={customColors}
                  onCustom={(key,val)=>{
                    const prev = {...customColors,[key]:val}; setCC(prev)
                    const mc = c => c===customColors[key]?val:c
                    const me = el => { const n={...el};['color','bg','tc','ic','bc','ac'].forEach(k=>{if(n[k])n[k]=mc(n[k])});return n }
                    const mapRows = rows => rows.map(r=>({...r,bg:mc(r.bg||'#fff'),cols_data:r.cols_data.map(col=>col.map(me))}))
                    const np = pages.map(p=>({...p,rows:mapRows(p.rows)}))
                    const nfr = mapRows(footerRows)
                    const nn = {...navCfg,bg:mc(navCfg.bg||'#0f0e0c')}
                    push(np,nn,nfr)
                  }} />
              )}
            </div>
          </div>
        )}

        {/* Canvas */}
        <div ref={canvasRef} style={{flex:1,overflow:'auto',background:'#1c1c20',display:'flex',justifyContent:'center',alignItems:'flex-start',padding:preview?'0':'18px 16px'}} onClick={e=>{if(e.currentTarget===e.target)clearSel()}} onDragOver={e=>{if(secDrag){e.preventDefault();e.dataTransfer.dropEffect='copy'}}} onDrop={e=>{if(secDrag){e.preventDefault();dropSecBlock(secDrag)}}}>
          <div style={{width:cvW,background:'white',boxShadow:preview?'none':'0 2px 4px rgba(0,0,0,.3),0 20px 60px rgba(0,0,0,.55)',borderRadius:preview?0:8,overflow:'clip',minHeight:'100%',transition:'width .3s ease'}}>

            {/* Navbar */}
            {(()=>{
              const c = {dark:customColors.darkBg,accent:customColors.accent,heading:customColors.heading,light:customColors.lightBg}
              return (
                <div style={{position:'relative',outline:navSel&&!preview?'2px solid rgba(212,168,67,.5)':'2px solid transparent',outlineOffset:'-2px',cursor:preview?'default':'pointer',transition:'outline .1s'}}
                  onClick={e=>{if(!preview){e.stopPropagation();setNavSel(true);setSel(null)}}}>
                  <NavRenderer navCfg={navCfg} colors={c} isMobile={viewport==='mobile'}
                    onNavigate={preview ? (slug) => {
                      const pg = pages.find(p => p.slug === slug)
                      if (pg) setActivePgId(pg.id)
                    } : undefined} />
                  {!preview && <div style={{position:'absolute',inset:0,zIndex:1000,cursor:'pointer'}} onClick={e=>{e.stopPropagation();setNavSel(true);setSel(null)}} />}
                  {navSel&&!preview&&<div style={{position:'absolute',top:6,right:8,background:'var(--bg)',border:'1px solid var(--b2)',borderRadius:6,padding:'3px 8px',fontSize:11,color:'var(--gold)',fontWeight:600,zIndex:50,animation:'popIn .15s ease'}}>Navbar selected · edit in panel →</div>}
                </div>
              )
            })()}

            {/* Footer editing banner */}
            {footerEditing && !preview && (
              <div style={{background:'rgba(212,168,67,.07)',borderBottom:'1px solid rgba(212,168,67,.18)',padding:'7px 18px',display:'flex',alignItems:'center',gap:10}}>
                <span style={{fontSize:11,color:'var(--gold)',fontWeight:700}}>▤ Editing Shared Footer</span>
                <span style={{fontSize:11,color:'var(--tx4)'}}>— this footer appears on all pages</span>
                <button onClick={()=>{setFooterEditing(false);clearSel()}} style={{marginLeft:'auto',padding:'2px 9px',borderRadius:5,border:'1px solid rgba(212,168,67,.3)',background:'transparent',color:'var(--gold)',fontSize:11,cursor:'pointer',fontFamily:"'Instrument Sans',sans-serif"}}>← Back to {activePage?.name||'Page'}</button>
              </div>
            )}

            {/* Rows */}
            {ctxRows.map((row, ri) => {
              const isRS  = sel?.rowId===row.id
              const isDRO = rowDragOv===row.id && rowDrag!==row.id
              const gt    = ['1fr','1fr 1fr','1fr 1fr 1fr','1fr 1fr 1fr 1fr'][row.cols-1]||'1fr'

              return (
                <div key={row.id} className={`row-w${isRS?' rsel':''}`}
                  draggable={!preview} onDragStart={e=>onRowDS(e,row.id)} onDragOver={e=>onRowDO(e,row.id)} onDrop={e=>onRowDrop(e,row.id)} onDragEnd={()=>{setRD(null);setRDO(null)}}
                  style={{position:'relative',background:(row.bgImage||row.bgVideo)?'transparent':(row.bg||'#fff'),paddingTop:row.pt??40,paddingBottom:row.pb??40,outline:isRS&&!preview?'2px solid rgba(212,168,67,.5)':'2px solid transparent',outlineOffset:'-2px',transition:'outline .1s,opacity .15s',opacity:rowDrag===row.id?.4:1,borderBottom:isDRO?'3px solid var(--gold)':'3px solid transparent'}}>

                  {/* Background image with parallax support */}
                  {row.bgImage && !row.bgVideo && (
                    <ParallaxBg row={row} canvasRef={canvasRef} rowBgRefs={rowBgRefs} />
                  )}

                  {/* Background video */}
                  {row.bgVideo && (
                    <video autoPlay muted loop playsInline src={row.bgVideo}
                      style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',zIndex:0}} />
                  )}

                  {/* Overlay */}
                  {(row.bgImage||row.bgVideo) && (
                    <div style={{position:'absolute',inset:0,zIndex:1,background:`rgba(0,0,0,${row.bgOverlay??0.4})`}} />
                  )}

                  {!preview && <>
                    <div className="row-gutter">
                      <div style={{fontSize:11,color:'var(--tx4)',cursor:'grab',padding:3}} data-tip="Drag">⠿</div>
                      <button className="btn-ic" style={{width:22,height:22,fontSize:10}} onClick={e=>{e.stopPropagation();setSel({rowId:row.id,rowOnly:true});setNavSel(false)}} data-tip="Settings">⊟</button>
                      <button className="btn-ic" style={{width:22,height:22,fontSize:10}} onClick={e=>{e.stopPropagation();dupRow(row.id)}} data-tip="Duplicate">⊕</button>
                      <button className="btn-ic" style={{width:22,height:22,fontSize:10,color:'var(--red)'}} onClick={e=>{e.stopPropagation();delRow(row.id)}} data-tip="Delete">✕</button>
                    </div>
                    <div style={{position:'absolute',inset:0,cursor:'default',zIndex:1}} onClick={()=>{setSel({rowId:row.id,rowOnly:true});setNavSel(false)}} />
                  </>}

                  {!preview && isRS && (
                    <div style={{position:'absolute',top:5,right:7,display:'flex',gap:1,background:'var(--bg)',border:'1px solid var(--b2)',borderRadius:7,padding:'3px',zIndex:50,boxShadow:'0 4px 20px rgba(0,0,0,.6)',animation:'popIn .15s ease'}}>
                      <div style={{display:'flex',gap:1,paddingRight:4,borderRight:'1px solid var(--b1)',marginRight:2}}>
                        {[1,2,3,4].map(n=>(
                          <button key={n} onClick={e=>{e.stopPropagation();updateRow('cols',n)}} style={{width:20,height:18,borderRadius:3,border:'none',background:row.cols===n?'var(--g3)':'transparent',cursor:'pointer',display:'flex',gap:1,alignItems:'center',justifyContent:'center'}}>
                            {Array.from({length:n}).map((_,i)=><span key={i} style={{display:'inline-block',width:3,height:9,background:row.cols===n?'var(--gold)':'var(--b3)',borderRadius:1}} />)}
                          </button>
                        ))}
                      </div>
                      <button onClick={e=>{e.stopPropagation();dupRow(row.id)}} style={{width:20,height:18,borderRadius:3,border:'none',background:'transparent',cursor:'pointer',color:'var(--tx3)',fontSize:11,display:'flex',alignItems:'center',justifyContent:'center'}}>⊕</button>
                      <button onClick={e=>{e.stopPropagation();delRow(row.id)}} style={{width:20,height:18,borderRadius:3,border:'none',background:'transparent',cursor:'pointer',color:'var(--red)',fontSize:11,display:'flex',alignItems:'center',justifyContent:'center'}}>✕</button>
                    </div>
                  )}

                  <div style={{display:'grid',gridTemplateColumns:gt,gap:0,padding:'0 24px',position:'relative',zIndex:10}}>
                    {row.cols_data.map((col, ci) => {
                      const isColDO = elDragOv?.rowId===row.id && elDragOv?.colIdx===ci
                      return (
                        <div key={ci} style={{padding:'0 7px',minHeight:28}}
                          onDragOver={e=>{e.preventDefault();e.stopPropagation();setEDO({rowId:row.id,colIdx:ci,elIdx:col.length})}}
                          onDrop={e=>palDrag?(()=>{e.preventDefault();e.stopPropagation();addElTo(palDrag,row.id,ci);setPD(null);setEDO(null)})():onElDrop(e,row.id,ci,col.length)}
                          onDragLeave={()=>setEDO(null)}>
                          {col.map((el, ei) => {
                            const isES  = sel?.elId===el.id
                            const isEDG = elDrag?.elId===el.id
                            const isDL  = elDragOv?.rowId===row.id && elDragOv?.colIdx===ci && elDragOv?.elIdx===ei
                            return (
                              <div key={el.id}>
                                {isDL && <div className="drop-line" />}
                                <div className={`el-w${isES?' sel':''}`}
                                  draggable={!preview}
                                  onDragStart={e=>!preview&&onElDS(e,row.id,ci,el.id)}
                                  onDragOver={e=>!preview&&onElDO(e,row.id,ci,ei)}
                                  onDrop={e=>!preview&&onElDrop(e,row.id,ci,ei)}
                                  onClick={e=>{if(!preview){e.stopPropagation();setSel({rowId:row.id,colIdx:ci,elId:el.id});setNavSel(false)}}}
                                  style={{opacity:isEDG?.3:1,cursor:preview?'default':'pointer',position:'relative'}}>
                                  <div className="el-ov" />
                                  {isES && !preview && (
                                    <div className="el-tb">
                                      <span style={{padding:'0 4px',cursor:'grab',color:'var(--tx4)',fontSize:10,display:'flex',alignItems:'center'}}>⠿</span>
                                      <div style={{width:1,background:'var(--b2)',alignSelf:'stretch',margin:'0 2px'}} />
                                      {[['left','←'],['center','↔'],['right','→']].map(([a,ic])=>(
                                        <button key={a} className={`btn-ic${el.align===a?' on':''}`} style={{width:20,height:20,fontSize:11}} onClick={e=>{e.stopPropagation();updateEl({...el,align:a})}}>{ic}</button>
                                      ))}
                                      <div style={{width:1,background:'var(--b2)',alignSelf:'stretch',margin:'0 2px'}} />
                                      <button className="btn-ic" style={{width:20,height:20,fontSize:11}} onClick={e=>{e.stopPropagation();dupEl()}}>⊕</button>
                                      <button className="btn-ic" style={{width:20,height:20,fontSize:11,color:'var(--red)'}} onClick={e=>{e.stopPropagation();delEl()}}>✕</button>
                                    </div>
                                  )}
                                  <REl el={el} onNavigate={preview ? (slug) => {
                                    const pg = pages.find(p => p.slug === slug)
                                    if (pg) setActivePgId(pg.id)
                                  } : null} />
                                </div>
                              </div>
                            )
                          })}
                          <div className={`ph${isColDO?' ov2':''}`}
                            style={{minHeight:col.length===0?40:6,display:'flex',alignItems:'center',justifyContent:'center',borderRadius:5,border:col.length===0&&!preview?'2px dashed rgba(212,168,67,.16)':'none',transition:'all .12s'}}
                            onDragOver={e=>{e.preventDefault();e.stopPropagation();setEDO({rowId:row.id,colIdx:ci,elIdx:col.length})}}
                            onDrop={e=>palDrag?(()=>{e.preventDefault();e.stopPropagation();addElTo(palDrag,row.id,ci);setPD(null);setEDO(null)})():onElDrop(e,row.id,ci,col.length)}>
                            {col.length===0&&!preview&&<span style={{fontSize:11,color:'rgba(212,168,67,.28)',pointerEvents:'none'}}>Drop here</span>}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}

            {!preview && (
              <div style={{padding:'12px 24px',borderTop:'1px dashed rgba(0,0,0,.07)',display:'flex',gap:5,flexWrap:'wrap'}}>
                {[[1,'+ Full row'],[2,'+ 2 col'],[3,'+ 3 col']].map(([n,l])=>(
                  <button key={n} onClick={()=>addRow(n)} style={{padding:'5px 12px',background:'rgba(0,0,0,.03)',border:'1px dashed rgba(0,0,0,.1)',borderRadius:5,cursor:'pointer',fontSize:12,color:'#9a9086',fontFamily:"'Instrument Sans',sans-serif",transition:'all .12s'}}
                    onMouseEnter={e=>{e.currentTarget.style.background='rgba(212,168,67,.05)';e.currentTarget.style.borderColor='rgba(212,168,67,.28)';e.currentTarget.style.color='#d4a843'}}
                    onMouseLeave={e=>{e.currentTarget.style.background='rgba(0,0,0,.03)';e.currentTarget.style.borderColor='rgba(0,0,0,.1)';e.currentTarget.style.color='#9a9086'}}>
                    {l}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right panel */}
        {!preview && (
          <div style={{width:268,background:'var(--bg2)',borderLeft:'1px solid var(--b1)',display:'flex',flexDirection:'column',flexShrink:0,overflow:'hidden'}}>
            <div style={{padding:'9px 14px',borderBottom:'1px solid var(--b1)',flexShrink:0,display:'flex',alignItems:'center',gap:6}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:'.07em',textTransform:'uppercase',color:'var(--tx4)',flex:1}}>
                {navSel?'Navbar':selEl?'Element':selRow?'Row':'Properties'}
              </span>
              {(navSel||selEl||sel?.rowOnly) && <button className="btn-ic" onClick={clearSel} style={{width:22,height:22,fontSize:12}}>✕</button>}
            </div>
            <div style={{flex:1,overflow:'auto'}}>
              <PropPanel
                el={selEl} row={!selEl&&selRow?selRow:null}
                nav={navSel?navCfg:null} palette={palette} pages={pages}
                onEl={updateEl} onRow={updateRow} onNav={updateNav}
                onDel={delEl} onDup={dupEl}
                onDelRow={()=>delRow(sel.rowId)} onDupRow={()=>dupRow(sel.rowId)}
              />
              {sel?.rowOnly && !selEl && selRow && (
                <div className="ps" style={{paddingTop:0}}>
                  <div className="ph-row" style={{cursor:'default',borderTop:'none'}}>
                    <span style={{fontSize:10.5,fontWeight:700,letterSpacing:'.07em',textTransform:'uppercase',color:'var(--tx3)'}}>Quick Add Block</span>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:5}}>
                    {EL_TYPES.slice(0,9).map(et=>(
                      <div key={et.type} className="bp" style={{padding:'7px 4px'}} onClick={()=>addElTo(et.type,sel.rowId,0)}>
                        <div style={{fontSize:12,color:'var(--gold)',lineHeight:1}}>{et.icon}</div>
                        <div style={{fontSize:9.5,color:'var(--tx3)',fontWeight:500}}>{et.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Status bar */}
      {!preview && (
        <div style={{height:26,background:'var(--bg2)',borderTop:'1px solid var(--b1)',display:'flex',alignItems:'center',padding:'0 12px',gap:12,flexShrink:0}}>
          <span style={{fontSize:10.5,color:'var(--tx4)',fontFamily:"'JetBrains Mono',monospace"}}>{footerEditing?'Footer':activePage?.name} · {ctxRows.length} rows · {ctxRows.reduce((a,r)=>a+r.cols_data.reduce((b,c)=>b+c.length,0),0)} elements</span>
          <span style={{color:'var(--tx4)',fontSize:9}}>·</span>
          <span style={{fontSize:10.5,color:'var(--tx4)'}}>{viewport==='desktop'?'1440px':viewport==='tablet'?'768px':'390px'}</span>
          {navSel && <><span style={{color:'var(--tx4)',fontSize:9}}>·</span><span style={{fontSize:10.5,color:'var(--gold)',fontFamily:"'JetBrains Mono',monospace"}}>Navbar · {NAVBAR_STYLES.find(s=>s.id===navCfg.style)?.name}</span></>}
          {selEl && <><span style={{color:'var(--tx4)',fontSize:9}}>·</span><span style={{fontSize:10.5,color:'var(--gold)',fontFamily:"'JetBrains Mono',monospace"}}>{EL_TYPES.find(e=>e.type===selEl.type)?.label} selected</span></>}
          <div style={{flex:1}} />
          <span style={{fontSize:10.5,color:'var(--tx4)',fontFamily:"'JetBrains Mono',monospace"}}>{hist.length?`⌘Z (${hist.length})`:'saved'}</span>
        </div>
      )}
    </div>
  )
}