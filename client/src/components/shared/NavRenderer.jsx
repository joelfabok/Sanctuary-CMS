import { useState, useEffect } from 'react'
import { NAVBAR_STYLES } from '../../data/constants'

/**
 * Renders a site navbar with automatic hamburger menu on mobile.
 *
 * @param {object} navCfg  – the site's nav configuration object
 * @param {object} colors  – resolved palette colors { dark, accent, heading, light }
 * @param {boolean} isMobile – forced mobile mode (used by the builder's mobile preview)
 */
export default function NavRenderer({ navCfg, colors, isMobile, onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [screenMobile, setScreenMobile] = useState(() => window.innerWidth < 768)

  // Close menu when switching to desktop
  useEffect(() => {
    const handler = () => {
      const sm = window.innerWidth < 768
      setScreenMobile(sm)
      if (!sm) setMenuOpen(false)
    }
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  // Close menu when leaving mobile preview in the builder
  useEffect(() => {
    if (!isMobile) setMenuOpen(false)
  }, [isMobile])

  const ns          = NAVBAR_STYLES.find(s => s.id === navCfg.style) || NAVBAR_STYLES[0]
  const c           = colors
  const showMobile  = isMobile || screenMobile
  const sticky      = navCfg.sticky === true

  const stickyWrapper = (children) => (
    <div style={sticky ? { position: 'sticky', top: 0, zIndex: 100 } : {}}>
      {children}
    </div>
  )

  // ── Desktop ────────────────────────────────────────────
  if (!showMobile) return stickyWrapper(<>{ns.render(navCfg, c, {
    onLogo: onNavigate ? () => onNavigate('/') : null,
    onLink: onNavigate ? (href) => onNavigate(href) : null,
  })}</>)

  // ── Shared mobile values ──────────────────────────────────────
  const style       = navCfg.style || 'classic'
  const isLight     = style === 'minimal' || style === 'bold'
  // Compose background with opacity if set
  let bg = navCfg.bg || (isLight ? '#ffffff' : c.dark)
  if (typeof navCfg.bgOpacity === 'number' && navCfg.bgOpacity < 1) {
    // Convert hex or rgb(a) to rgba with opacity
    const hexToRgba = (hex, alpha) => {
      let c = hex.replace('#', '')
      if (c.length === 3) c = c.split('').map(x => x + x).join('')
      const num = parseInt(c, 16)
      return `rgba(${(num >> 16) & 255},${(num >> 8) & 255},${num & 255},${alpha})`
    }
    if (bg.startsWith('#')) bg = hexToRgba(bg, navCfg.bgOpacity)
    else if (bg.startsWith('rgb(')) bg = bg.replace('rgb(', 'rgba(').replace(')', `,${navCfg.bgOpacity})`)
    else if (bg.startsWith('rgba(')) {
      bg = bg.replace(/rgba\(([^)]+),[^)]+\)/, `rgba($1,${navCfg.bgOpacity})`)
    }
    // else leave as is
  }
  const logoColor   = navCfg.logoColor|| (isLight ? (c.heading || '#1a1715')     : c.accent)
  const linkColor   = navCfg.linkColor|| (isLight ? (c.heading || '#1a1715')     : 'rgba(240,236,230,.8)')
  const burgerColor = isLight ? (c.heading || '#1a1715') : 'rgba(240,236,230,.85)'
  const border      = navCfg.borderColor || (isLight ? 'rgba(0,0,0,.08)' : 'rgba(255,255,255,.08)')
  const logo        = navCfg.logo    || 'Grace Church'
  const rawLinks    = navCfg.links   || ['Home', 'About', 'Sermons', 'Events', 'Give']
  // Normalise: support both legacy string[] and {label,href}[]
  const links       = rawLinks.map(l => typeof l === 'string' ? { label: l, href: '' } : l)
  const ctaBg       = navCfg.ctaBg   || c.accent
  const ctaColor    = navCfg.ctaColor|| (isLight ? '#ffffff' : c.dark)
  const ctaText     = navCfg.ctaText || 'Plan a Visit'
  const showCta     = navCfg.showCta !== false
  const py          = navCfg.py != null ? navCfg.py : (isLight ? 14 : 16)
  const px          = navCfg.px != null ? navCfg.px : 22

  return (
    <div style={{ position: sticky ? 'sticky' : 'relative', top: sticky ? 0 : undefined, zIndex: 200 }}>
      {/* Bold style: compact strip */}
      {style === 'bold' && (
        <div style={{
          background: navCfg.stripBg || c.accent,
          padding: '5px 20px',
          textAlign: 'center',
        }}>
          <span style={{ fontSize: 11, color: navCfg.stripColor || c.dark, fontWeight: 600 }}>
            {navCfg.stripLeft || 'Welcome'}
          </span>
        </div>
      )}

      {/* Bar: logo + hamburger */}
      <div style={{
        background: bg,
        padding: `${py}px ${px}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: `1px solid ${border}`,
        backdropFilter: (typeof navCfg.bgOpacity === 'number' && navCfg.bgOpacity < 1) ? 'saturate(180%) blur(8px)' : undefined,
        WebkitBackdropFilter: (typeof navCfg.bgOpacity === 'number' && navCfg.bgOpacity < 1) ? 'saturate(180%) blur(8px)' : undefined,
      }}>
        {navCfg.showLogo !== false && (
          <div
            onClick={onNavigate ? () => { onNavigate('/'); setMenuOpen(false) } : undefined}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: navCfg.logoSize || 20,
              color: logoColor,
              fontWeight: 600,
              letterSpacing: '-.01em',
              lineHeight: 1,
              cursor: onNavigate ? 'pointer' : 'default',
            }}
          >
            {navCfg.logoImg
              ? <img src={navCfg.logoImg} style={{ height: navCfg.logoSize || 40, display: 'block' }} alt={logo} />
              : logo
            }
          </div>
        )}
        <button
          onClick={e => { e.stopPropagation(); setMenuOpen(o => !o) }}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 2px',
            color: burgerColor,
            fontSize: 22,
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'opacity .15s',
          }}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Dropdown menu */}
      {menuOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: bg,
          borderBottom: `1px solid ${border}`,
          boxShadow: '0 8px 32px rgba(0,0,0,.22)',
          zIndex: 199,
          animation: 'popIn .12s ease',
          overflowY: 'auto',
          maxHeight: '80vh',
          backdropFilter: (typeof navCfg.bgOpacity === 'number' && navCfg.bgOpacity < 1) ? 'saturate(180%) blur(8px)' : undefined,
          WebkitBackdropFilter: (typeof navCfg.bgOpacity === 'number' && navCfg.bgOpacity < 1) ? 'saturate(180%) blur(8px)' : undefined,
        }}>
          <div style={{ padding: '8px 0' }}>
            {links.map((lnk, i) => {
              const sub = lnk.children || []
              return (
                <div key={i}>
                  <a
                    href={lnk.href || undefined}
                    onClick={(e) => {
                      if (!lnk.href) return
                      setMenuOpen(false)
                      if (onNavigate) { e.preventDefault(); onNavigate(lnk.href) }
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 24px',
                      fontSize: 15,
                      color: linkColor,
                      borderBottom: `1px solid ${border}`,
                      fontFamily: "'Instrument Sans', sans-serif",
                      fontWeight: sub.length ? 600 : 500,
                      cursor: lnk.href ? 'pointer' : 'default',
                      textDecoration: 'none',
                    }}>
                    {lnk.label}
                    {sub.length > 0 && <span style={{ fontSize: 11, opacity: .45 }}>▾</span>}
                  </a>
                  {sub.map((ch, ci) => (
                    <a key={ci}
                      href={ch.href || undefined}
                      onClick={(e) => {
                        if (!ch.href) return
                        setMenuOpen(false)
                        if (onNavigate) { e.preventDefault(); onNavigate(ch.href) }
                      }}
                      style={{
                        display: 'block',
                        padding: '10px 24px 10px 36px',
                        fontSize: 13,
                        color: linkColor,
                        borderBottom: `1px solid ${border}`,
                        fontFamily: "'Instrument Sans', sans-serif",
                        fontWeight: 400,
                        cursor: ch.href ? 'pointer' : 'default',
                        textDecoration: 'none',
                        opacity: .75,
                      }}>
                      {ch.label}
                    </a>
                  ))}
                </div>
              )
            })}
            {showCta && (
              <div style={{ padding: '14px 20px' }}>
                <a href={navCfg.ctaHref || undefined}
                  onClick={(e) => {
                    setMenuOpen(false)
                    if (onNavigate && navCfg.ctaHref) { e.preventDefault(); onNavigate(navCfg.ctaHref) }
                  }}
                  style={{
                    display: 'block',
                    background: ctaBg,
                    color: ctaColor,
                    padding: '12px 16px',
                    borderRadius: navCfg.ctaBr || 6,
                    fontSize: 14,
                    fontWeight: 700,
                    textAlign: 'center',
                    cursor: 'pointer',
                    fontFamily: "'Instrument Sans', sans-serif",
                    textDecoration: 'none',
                  }}>
                  {ctaText}
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
