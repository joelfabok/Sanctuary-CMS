import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { PALETTES } from '../data/constants'
import NavRenderer from '../components/shared/NavRenderer'
import REl from '../components/builder/REl'
import axios from 'axios'

export default function SiteRenderer() {
  const { siteId } = useParams()
  const [site, setSite]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const [activePgId, setActivePgId] = useState(null)

  useEffect(() => {
    setLoading(true)
    axios.get(`/api/sites/live/${siteId}`)
      .then(r => {
        setSite(r.data)
        const pages = r.data.pages || []
        const home = pages.find(p => p.slug === '/') || pages[0]
        if (home) setActivePgId(home.id)
      })
      .catch(() => setError('Site not found'))
      .finally(() => setLoading(false))
  }, [siteId])

  if (loading) return (
    <div style={{ height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0b0b0d' }}>
      <div style={{ width:32, height:32, border:'2px solid #d4a843', borderTopColor:'transparent', borderRadius:'50%', animation:'spin .8s linear infinite' }} />
    </div>
  )

  if (error || !site) return (
    <div style={{ height:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'#0b0b0d', color:'#faf8f5', fontFamily:"'Instrument Sans',sans-serif" }}>
      <div style={{ fontSize:48, marginBottom:16 }}>🕊️</div>
      <h1 style={{ fontSize:22, fontWeight:700, margin:'0 0 8px' }}>Site Not Found</h1>
      <p style={{ fontSize:14, color:'#6a6a6e' }}>This site may not be published yet or doesn't exist.</p>
    </div>
  )

  // Resolve palette colors
  const pal = PALETTES.find(p => p.id === (site.palette || 'cornerstone')) || PALETTES[0]
  const colors = { dark: pal.colors[0], accent: pal.colors[2], heading: pal.colors[3], light: pal.colors[4] }

  const pages      = site.pages || []
  const activePage = pages.find(p => p.id === activePgId) || pages[0]
  const activeRows = activePage?.rows || []
  const footerRows = site.footerRows || []
  const navCfg     = site.nav || {}

  const onNavigate = (slug) => {
    const pg = pages.find(p => p.slug === slug)
    if (pg) {
      setActivePgId(pg.id)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const renderRow = (row, i) => {
    const gt = ['1fr','1fr 1fr','1fr 1fr 1fr','1fr 1fr 1fr 1fr'][row.cols - 1] || '1fr'
    return (
      <div key={row.id || i} style={{ position:'relative', background:(row.bgImage||row.bgVideo)?'transparent':(row.bg||'#fff'), paddingTop:row.pt??40, paddingBottom:row.pb??40 }}>
        {row.bgImage && !row.bgVideo && (
          <div style={{ position:'absolute', inset:0, zIndex:0, backgroundImage:`url(${row.bgImage})`, backgroundSize:row.bgSize||'cover', backgroundPosition:row.bgPos||'center' }} />
        )}
        {row.bgVideo && (
          <video autoPlay muted loop playsInline src={row.bgVideo}
            style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', zIndex:0 }} />
        )}
        {(row.bgImage||row.bgVideo) && (
          <div style={{ position:'absolute', inset:0, zIndex:1, background:`rgba(0,0,0,${row.bgOverlay??0.4})` }} />
        )}
        <div style={{ display:'grid', gridTemplateColumns:gt, gap:0, padding:'0 24px', position:'relative', zIndex:10, maxWidth:1200, margin:'0 auto' }}>
          {(row.cols_data||[]).map((col, ci) => (
            <div key={ci} style={{ padding:'0 7px', minHeight:28 }}>
              {(col||[]).map(el => (
                <REl key={el.id} el={el} onNavigate={onNavigate} />
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight:'100vh', overflow:'clip' }}>
      <NavRenderer navCfg={navCfg} colors={colors} onNavigate={onNavigate} />
      {activeRows.map(renderRow)}
      {footerRows.map(renderRow)}
    </div>
  )
}
