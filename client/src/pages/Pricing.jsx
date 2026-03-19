import { useNavigate } from 'react-router-dom'
import { PLANS } from '../data/constants'
import { Logo } from '../components/shared/UI'

export default function Pricing() {
  const nav = useNavigate()
  return (
    <div style={{height:'100vh',overflow:'auto',background:'var(--bg)'}}>
      <nav style={{height:54,background:'var(--bg2)',borderBottom:'1px solid var(--b1)',display:'flex',alignItems:'center',padding:'0 28px',gap:12}}>
        <button className="btn btn-gh btn-sm" onClick={()=>nav('/')}>← Back</button>
        <Logo size={24} onClick={()=>nav('/')} />
        <div style={{flex:1}} />
        <button className="btn btn-gh btn-sm" onClick={()=>nav('/auth')}>Sign In</button>
      </nav>
      <div style={{maxWidth:960,margin:'0 auto',padding:'60px 28px'}}>
        <div style={{textAlign:'center',marginBottom:52}}>
          <div className="badge badge-gold" style={{marginBottom:16}}>Pricing</div>
          <h1 style={{fontSize:46,lineHeight:1.1,marginBottom:12}}>Simple, transparent pricing</h1>
          <p style={{color:'var(--tx3)',fontSize:15}}>Start with a 14-day free trial. No credit card required. Cancel anytime.</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:18,marginBottom:40}}>
          {PLANS.map(plan=>(
            <div key={plan.id} style={{background:'var(--bg3)',border:`2px solid ${plan.popular?'var(--gold)':'var(--b1)'}`,borderRadius:16,padding:'26px 22px',position:'relative',display:'flex',flexDirection:'column'}}>
              {plan.popular && <div style={{position:'absolute',top:-13,left:'50%',transform:'translateX(-50%)',background:'var(--gold)',color:'#1c0f00',padding:'3px 16px',borderRadius:20,fontSize:11,fontWeight:700,whiteSpace:'nowrap'}}>Most Popular</div>}
              <div style={{marginBottom:18}}>
                <div style={{fontSize:12,fontWeight:600,color:'var(--tx3)',letterSpacing:'.05em',textTransform:'uppercase',marginBottom:8}}>{plan.name}</div>
                <div style={{display:'flex',alignItems:'baseline',gap:4,marginBottom:4}}>
                  <span style={{fontFamily:"'Playfair Display',serif",fontSize:40,fontWeight:400}}>${plan.price}</span>
                  <span style={{fontSize:13,color:'var(--tx3)'}}>/ mo</span>
                </div>
                <div style={{fontSize:12,color:'var(--tx4)'}}>{plan.sites} sites · {plan.members} member{plan.members>1?'s':''} · {plan.storage}</div>
              </div>
              <div style={{flex:1,display:'flex',flexDirection:'column',gap:7,marginBottom:22}}>
                {plan.features.map(f=><div key={f} style={{display:'flex',alignItems:'flex-start',gap:8,fontSize:13,color:'var(--tx2)'}}><span style={{color:'var(--green)',marginTop:1,flexShrink:0}}>✓</span>{f}</div>)}
              </div>
              <button className={`btn ${plan.popular?'btn-gold':'btn-dk'}`} style={{width:'100%',justifyContent:'center',padding:'11px'}} onClick={()=>nav('/auth?mode=register')}>Start Free Trial</button>
            </div>
          ))}
        </div>
        <div style={{textAlign:'center',padding:'22px',background:'var(--bg3)',border:'1px solid var(--b1)',borderRadius:12}}>
          <div style={{fontSize:13.5,color:'var(--tx2)',marginBottom:6}}>All plans include SSL · 99.9% uptime · 14-day free trial · Cancel anytime</div>
          <div style={{fontSize:12,color:'var(--tx4)'}}>Nonprofit discount available — <span style={{color:'var(--gold)',cursor:'pointer'}} onClick={()=>nav('/contact')}>contact us</span></div>
        </div>
      </div>
    </div>
  )
}
