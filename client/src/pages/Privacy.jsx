import { useNavigate } from 'react-router-dom'
import { Logo } from '../components/shared/UI'

const Section = ({ title, children }) => (
  <div style={{ marginBottom: 36 }}>
    <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--tx)', marginBottom: 10, fontFamily: "'Instrument Sans', sans-serif" }}>{title}</h2>
    <div style={{ fontSize: 14, color: 'var(--tx3)', lineHeight: 1.85 }}>{children}</div>
  </div>
)

export default function Privacy() {
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
          <h1 style={{ fontSize: 34, fontWeight: 800, color: 'var(--tx)', marginBottom: 10, letterSpacing: '-.02em' }}>Privacy Policy</h1>
          <p style={{ fontSize: 13, color: 'var(--tx4)' }}>Last updated: March 18, 2026</p>
        </div>

        <Section title="1. Information We Collect">
          We collect information you provide directly — such as your name, email address, and organization details when you register. We also collect usage data (pages visited, features used, browser type) to improve the platform. Payment information is processed securely by our payment provider and is never stored on our servers.
        </Section>

        <Section title="2. How We Use Your Information">
          We use your information to:
          <ul style={{ marginTop: 10, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {['Provide, operate, and improve Sanctuary Builder', 'Send transactional emails (account confirmations, password resets)', 'Send product updates and announcements (you may opt out at any time)', 'Respond to support requests and inquiries', 'Monitor for security and prevent fraud'].map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </Section>

        <Section title="3. Data Sharing">
          We do not sell your personal data. We share data only with trusted service providers who help us operate the platform (hosting, analytics, payment processing) and only to the extent necessary to provide those services. We may disclose information if required by law.
        </Section>

        <Section title="4. Cookies">
          Sanctuary Builder uses essential cookies (for authentication and preferences) and optional analytics cookies. You can disable non-essential cookies in your browser settings. Disabling essential cookies will prevent you from logging in.
        </Section>

        <Section title="5. Data Retention">
          We retain your account data for as long as your account is active. You may request deletion of your account and associated data at any time by contacting us. Some data may be retained for legal or legitimate business purposes.
        </Section>

        <Section title="6. Security">
          We use industry-standard encryption (TLS) for data in transit and AES-256 for data at rest. Passwords are hashed using bcrypt and are never stored in plain text. Despite our efforts, no method of transmission over the internet is 100% secure.
        </Section>

        <Section title="7. Your Rights">
          Depending on your jurisdiction, you may have the right to access, correct, export, or delete your personal data. To exercise any of these rights, please contact us at the address below. We will respond within 30 days.
        </Section>

        <Section title="8. Children's Privacy">
          Sanctuary Builder is not directed at children under 13. We do not knowingly collect personal information from children. If you believe a child has provided us with information, please contact us and we will delete it promptly.
        </Section>

        <Section title="9. Changes to This Policy">
          We may update this Privacy Policy from time to time. We will notify you of significant changes via email or a prominent notice within the platform. Continued use of the service after changes constitutes acceptance of the updated policy.
        </Section>

        <Section title="10. Contact">
          Questions about this policy? Reach us at{' '}
          <a href="mailto:privacy@sanctuarybuilder.com" style={{ color: 'var(--gold)' }}>privacy@sanctuarybuilder.com</a>.
        </Section>
      </div>

      <footer style={{ background: 'var(--bg2)', borderTop: '1px solid var(--b1)', padding: '18px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 12, color: 'var(--tx4)' }}>© 2026 Sanctuary Builder · Built for faith communities</span>
        <div style={{ display: 'flex', gap: 16 }}>
          {[['Privacy', '/privacy'], ['Terms', '/terms'], ['Contact', '/contact']].map(([l, to]) => (
            <span key={l} onClick={() => nav(to)} style={{ fontSize: 12, color: 'var(--tx4)', cursor: 'pointer' }}>{l}</span>
          ))}
        </div>
      </footer>
    </div>
  )
}
