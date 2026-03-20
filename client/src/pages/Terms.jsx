import { useNavigate } from 'react-router-dom'
import { Logo } from '../components/shared/UI'

const Section = ({ title, children }) => (
  <div style={{ marginBottom: 36 }}>
    <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--tx)', marginBottom: 10, fontFamily: "'Instrument Sans', sans-serif" }}>{title}</h2>
    <div style={{ fontSize: 14, color: 'var(--tx3)', lineHeight: 1.85 }}>{children}</div>
  </div>
)

export default function Terms() {
  const nav = useNavigate()
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--tx)', fontFamily: "'Instrument Sans', sans-serif" }}>
      {/* Nav */}
      <div style={{ height: 52, background: 'var(--bg2)', borderBottom: '1px solid var(--b1)', display: 'flex', alignItems: 'center', padding: '0 28px', gap: 12 }}>
        <button className="btn btn-gh btn-sm" onClick={() => nav(-1)}>← Back</button>
        <Logo size={22} onClick={() => nav('/')} />
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '60px 28px 80px' }}>
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 10 }}>Legal</div>
          <h1 style={{ fontSize: 34, fontWeight: 800, color: 'var(--tx)', marginBottom: 10, letterSpacing: '-.02em' }}>Terms of Service</h1>
          <p style={{ fontSize: 13, color: 'var(--tx4)' }}>Last updated: March 18, 2026</p>
        </div>

        <Section title="1. Acceptance of Terms">
          By creating an account or using Sanctuary Builder, you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform. We may update these terms from time to time; continued use constitutes acceptance.
        </Section>

        <Section title="2. Eligibility">
          You must be at least 18 years old and capable of forming a binding contract to use Sanctuary Builder. By using the platform you represent that you meet these requirements. Accounts created on behalf of an organization must be authorized by that organization.
        </Section>

        <Section title="3. Your Account">
          You are responsible for maintaining the confidentiality of your login credentials and for all activity under your account. Notify us immediately of any unauthorized access. We reserve the right to suspend accounts that violate these terms or engage in abusive behavior.
        </Section>

        <Section title="4. Acceptable Use">
          You agree not to use Sanctuary Builder to:
          <ul style={{ marginTop: 10, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              'Publish illegal, harmful, hateful, or deceptive content',
              'Infringe the intellectual property rights of others',
              'Transmit malware, spam, or unsolicited communications',
              'Attempt to gain unauthorized access to our systems or other users\' accounts',
              'Resell or sublicense access to the platform without written permission',
            ].map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </Section>

        <Section title="5. Content Ownership">
          You retain all rights to the content you create using Sanctuary Builder. By publishing content through the platform, you grant us a limited, non-exclusive license to host and display that content solely for the purpose of providing the service to you.
        </Section>

        <Section title="6. Subscription & Billing">
          Paid plans are billed monthly or annually as selected. Subscriptions renew automatically unless cancelled before the renewal date. Refunds are handled on a case-by-case basis — contact support within 7 days of a charge for assistance. We reserve the right to modify pricing with 30 days' notice.
        </Section>

        <Section title="7. Free Trial">
          New accounts may have access to a free trial period. Trial limitations and duration are as displayed at sign-up. We reserve the right to modify or discontinue trial terms at any time.
        </Section>

        <Section title="8. Termination">
          You may cancel your account at any time from your account settings. We may suspend or terminate accounts that violate these terms, engage in fraud, or remain unpaid. Upon termination your published sites may be taken offline and data may be deleted after a grace period.
        </Section>

        <Section title="9. Disclaimers & Limitation of Liability">
          Sanctuary Builder is provided "as is" without warranties of any kind. We do not guarantee uninterrupted or error-free service. To the fullest extent permitted by law, our liability for any claim arising out of your use of the platform is limited to the amount you paid us in the 12 months preceding the claim.
        </Section>

        <Section title="10. Governing Law">
          These terms are governed by the laws of the Province of Ontario, Canada, without regard to its conflict-of-law provisions. Any disputes shall be resolved in the courts of Ontario.
        </Section>

        <Section title="11. Contact">
          Questions about these terms? Email us at{' '}
          <a href="mailto:legal@sanctuarybuilder.com" style={{ color: 'var(--gold)' }}>legal@sanctuarybuilder.com</a>.
        </Section>
      </div>

      <footer style={{background:'#060604',borderTop:'1px solid var(--b1)',padding:'22px 36px',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:12}}>
        <Logo size={22} />
        <span style={{fontSize:12,color:'var(--tx4)'}}>© 2024 Product Of <a  href="https://www.spheredigital.ca" target="_blank" rel="noopener" style={{color:'var(--tx4)',textDecoration:'underline'}}>Sphere Digital</a> · Built for faith communities</span>
        <div style={{display:'flex',gap:14}}>{[['Privacy','/privacy'],['Terms','/terms'],['Contact','/contact']].map(([l,to])=><span key={l} onClick={()=>nav(to)} style={{fontSize:12,color:'var(--tx4)',cursor:'pointer'}}>{l}</span>)}</div>
      </footer>
    </div>
  )
}
