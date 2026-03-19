const nodemailer = require('nodemailer');

// Create reusable transporter
// Configure via .env: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM = process.env.EMAIL_FROM || 'Sanctuary Builder <noreply@sanctuarybuilder.com>';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

/**
 * Send a team invitation email.
 */
async function sendInviteEmail({ to, inviterName, orgName, orgRole, isNewUser, tempPassword }) {
  const loginUrl = `${CLIENT_URL}/auth`;
  const roleLabel = orgRole === 'owner' ? 'Owner' : orgRole === 'editor' ? 'Editor' : 'Viewer';

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0b0b0d;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    
    <!-- Logo -->
    <div style="text-align:center;margin-bottom:32px;">
      <div style="display:inline-flex;align-items:center;gap:8px;">
        <div style="width:28px;height:28px;background:linear-gradient(135deg,#d4a843,#b88c2a);border-radius:8px;display:inline-flex;align-items:center;justify-content:center;font-size:12px;">✦</div>
        <span style="font-family:Georgia,'Times New Roman',serif;font-size:21px;font-weight:600;color:#faf8f5;">Sanctuary</span>
      </div>
    </div>

    <!-- Card -->
    <div style="background:#16161a;border:1px solid #2a2a2e;border-radius:16px;padding:36px 32px;margin-bottom:24px;">
      
      <div style="text-align:center;margin-bottom:28px;">
        <div style="font-size:40px;margin-bottom:12px;">🤝</div>
        <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#faf8f5;line-height:1.2;">You're invited to join a team</h1>
        <p style="margin:0;font-size:14px;color:#9a9a9e;line-height:1.6;">
          <strong style="color:#d4a843;">${inviterName}</strong> has invited you to collaborate on <strong style="color:#faf8f5;">${orgName}</strong> as ${roleLabel === 'Owner' ? 'an' : 'a'} <strong style="color:#d4a843;">${roleLabel}</strong>.
        </p>
      </div>

      <!-- What you can do -->
      <div style="background:#1e1e22;border:1px solid #2a2a2e;border-radius:10px;padding:18px 20px;margin-bottom:24px;">
        <div style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#6a6a6e;margin-bottom:12px;">What you'll be able to do</div>
        ${roleLabel === 'Viewer' ? `
        <div style="display:flex;gap:8px;margin-bottom:8px;align-items:flex-start;">
          <span style="color:#4ade80;flex-shrink:0;margin-top:2px;">✓</span>
          <span style="font-size:13px;color:#c8c8cc;">View all websites in the organization</span>
        </div>
        ` : `
        <div style="display:flex;gap:8px;margin-bottom:8px;align-items:flex-start;">
          <span style="color:#4ade80;flex-shrink:0;margin-top:2px;">✓</span>
          <span style="font-size:13px;color:#c8c8cc;">Edit and manage websites with the drag-and-drop builder</span>
        </div>
        <div style="display:flex;gap:8px;margin-bottom:8px;align-items:flex-start;">
          <span style="color:#4ade80;flex-shrink:0;margin-top:2px;">✓</span>
          <span style="font-size:13px;color:#c8c8cc;">Create new pages, update content, and publish changes</span>
        </div>
        <div style="display:flex;gap:8px;align-items:flex-start;">
          <span style="color:#4ade80;flex-shrink:0;margin-top:2px;">✓</span>
          <span style="font-size:13px;color:#c8c8cc;">Collaborate with other team members</span>
        </div>
        `}
      </div>

      ${isNewUser ? `
      <!-- Temporary credentials -->
      <div style="background:rgba(212,168,67,.06);border:1px solid rgba(212,168,67,.18);border-radius:10px;padding:18px 20px;margin-bottom:24px;">
        <div style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#d4a843;margin-bottom:10px;">Your temporary login</div>
        <div style="margin-bottom:6px;">
          <span style="font-size:12px;color:#6a6a6e;">Email:</span>
          <span style="font-size:13px;color:#faf8f5;font-family:'Courier New',monospace;margin-left:8px;">${to}</span>
        </div>
        <div style="margin-bottom:10px;">
          <span style="font-size:12px;color:#6a6a6e;">Temporary Password:</span>
          <span style="font-size:13px;color:#faf8f5;font-family:'Courier New',monospace;margin-left:8px;">${tempPassword}</span>
        </div>
        <div style="font-size:11.5px;color:#9a9a9e;line-height:1.5;">
          ⚠️ You'll be asked to set a new password when you first log in.
        </div>
      </div>
      ` : `
      <div style="background:rgba(91,156,246,.06);border:1px solid rgba(91,156,246,.15);border-radius:10px;padding:14px 20px;margin-bottom:24px;">
        <div style="font-size:13px;color:#c8c8cc;line-height:1.6;">
          ℹ️ Your existing account has been added to <strong style="color:#faf8f5;">${orgName}</strong>. Just log in with your current credentials.
        </div>
      </div>
      `}

      <!-- CTA Button -->
      <div style="text-align:center;">
        <a href="${loginUrl}" style="display:inline-block;background:#d4a843;color:#1c0f00;padding:13px 36px;border-radius:8px;font-size:14px;font-weight:700;text-decoration:none;letter-spacing:.02em;">
          Log In to Get Started →
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align:center;">
      <p style="font-size:12px;color:#4a4a4e;line-height:1.7;margin:0 0 8px;">
        This invitation was sent from Sanctuary Builder on behalf of ${orgName}.<br>
        If you didn't expect this email, you can safely ignore it.
      </p>
      <p style="font-size:11px;color:#3a3a3e;margin:0;">
        © ${new Date().getFullYear()} Sanctuary Builder · Built for faith communities
      </p>
    </div>
  </div>
</body>
</html>`;

  const text = `You're invited to join ${orgName}!

${inviterName} has invited you to collaborate on ${orgName} as ${roleLabel === 'Owner' ? 'an' : 'a'} ${roleLabel}.

${isNewUser ? `Your temporary login:
Email: ${to}
Temporary Password: ${tempPassword}
You'll be asked to set a new password on first login.` : `Your existing account has been added to ${orgName}. Just log in with your current credentials.`}

Log in here: ${loginUrl}

— Sanctuary Builder`;

  try {
    await transporter.sendMail({
      from: FROM,
      to,
      subject: `You've been invited to join ${orgName} on Sanctuary Builder`,
      text,
      html,
    });
    return true;
  } catch (err) {
    console.error('Failed to send invite email:', err.message);
    return false;
  }
}

module.exports = { sendInviteEmail };
