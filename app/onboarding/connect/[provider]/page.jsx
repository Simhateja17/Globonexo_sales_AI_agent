"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Icon from "../../../../components/ui/Icon";
import { Brand } from "../../../../components/onboarding/ui";
import { useAuth } from "../../../../hooks/useAuth";
import api from "../../../../lib/api";
import { isValidEmail } from "../../../../lib/validation";
import { isFreePlan, isPersonalEmail } from "../../../../lib/free-plan";

const SERVERS = {
  gmail: { smtpHost: "smtp.gmail.com", smtpPort: "587", smtpSecurity: "STARTTLS", imapHost: "imap.gmail.com", imapPort: "993", imapSecurity: "SSL" },
  outlook: { smtpHost: "smtp.office365.com", smtpPort: "587", smtpSecurity: "STARTTLS", imapHost: "outlook.office365.com", imapPort: "993", imapSecurity: "SSL" },
};

const PRESETS = {
  "Zoho Mail": { smtpHost: "smtp.zoho.com", smtpPort: "587", smtpSecurity: "STARTTLS", imapHost: "imap.zoho.com", imapPort: "993", imapSecurity: "SSL" },
  GoDaddy: { smtpHost: "smtpout.secureserver.net", smtpPort: "465", smtpSecurity: "SSL", imapHost: "imap.secureserver.net", imapPort: "993", imapSecurity: "SSL" },
  Hostinger: { smtpHost: "smtp.hostinger.com", smtpPort: "465", smtpSecurity: "SSL", imapHost: "imap.hostinger.com", imapPort: "993", imapSecurity: "SSL" },
  "Yahoo Mail": { smtpHost: "smtp.mail.yahoo.com", smtpPort: "465", smtpSecurity: "SSL", imapHost: "imap.mail.yahoo.com", imapPort: "993", imapSecurity: "SSL" },
  Namecheap: { smtpHost: "mail.privateemail.com", smtpPort: "465", smtpSecurity: "SSL", imapHost: "mail.privateemail.com", imapPort: "993", imapSecurity: "SSL" },
  "Something else": null,
};

const EMPTY_SERVER = { smtpHost: "", smtpPort: "587", smtpSecurity: "STARTTLS", imapHost: "", imapPort: "993", imapSecurity: "SSL" };

const COPY = {
  gmail: { title: "Connect Gmail", sub: "Gmail and Google Workspace. Takes about 2 minutes.", pwLabel: "App password", pwHint: "16 letters from step 2", tip: "You likely used your normal Gmail password. Use the 16-letter app password from step 2." },
  outlook: { title: "Connect Outlook", sub: "Outlook.com and Microsoft 365. Takes about 2 minutes.", pwLabel: "App password", pwHint: "From step 2", tip: "Your admin may need to turn on Authenticated SMTP, or you need an app password if you use two-step sign-in." },
  other: { title: "Connect your email", sub: "Any provider that supports SMTP and IMAP.", pwLabel: "Password", pwHint: "Or app password", tip: "Check the server names and ports with your provider. Some need an app password instead of your normal one." },
};

const ADMIN_NOTE = "Please turn on Authenticated SMTP for my Microsoft 365 mailbox so I can connect it to GNX Sales: Microsoft 365 admin center > Users > Active users > select my account > Mail > Manage email apps > tick Authenticated SMTP > Save.";

function ServerFields({ server, onChange }) {
  const field = (key, label, placeholder) => (
    <label className="fld"><span className="lbl">{label}</span><span className="in"><input value={server[key]} placeholder={placeholder} aria-label={label} onChange={e => onChange({ ...server, [key]: e.target.value })} /></span></label>
  );
  const security = (key, label) => (
    <label className="fld"><span className="lbl">{label}</span>
      <select className="sel" style={{ minWidth: 0, minHeight: 46 }} value={server[key]} onChange={e => onChange({ ...server, [key]: e.target.value })}>
        <option value="STARTTLS">STARTTLS</option><option value="SSL">SSL</option>
      </select>
    </label>
  );
  return (
    <div className="cgrid srvf">
      {field("smtpHost", "Sending server (SMTP)", "smtp.yourdomain.com")}
      {field("smtpPort", "Port", "587")}
      {security("smtpSecurity", "Security")}
      {field("imapHost", "Reply server (IMAP)", "imap.yourdomain.com")}
      {field("imapPort", "Port", "993")}
      {security("imapSecurity", "Security")}
    </div>
  );
}

export default function ConnectInboxPage() {
  const params = useParams();
  const provider = ["gmail", "outlook", "other"].includes(params?.provider) ? params.provider : "gmail";
  const copy = COPY[provider];
  const { user, organization } = useAuth();
  const free = isFreePlan(organization);
  const [preset, setPreset] = useState("Zoho Mail");
  const [server, setServer] = useState(provider === "other" ? PRESETS["Zoho Mail"] : SERVERS[provider]);
  const [editingServer, setEditingServer] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [sender, setSender] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [connected, setConnected] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) return;
    setEmail(prev => prev || user.email || "");
    setSender(prev => prev || [user.first_name, user.last_name].filter(Boolean).join(" "));
  }, [user]);

  const custom = provider === "other" && (preset === "Something else" || editingServer);
  const showFields = custom || (provider !== "other" && editingServer);

  const pickPreset = label => {
    setPreset(label);
    setServer(PRESETS[label] || EMPTY_SERVER);
    setEditingServer(false);
  };

  const connect = async () => {
    setError("");
    if (!isValidEmail(email)) { setError("Enter the email address Nexo should send from."); return; }
    if (free && isPersonalEmail(email)) {
      setError("On the Free plan, connect your company address (like you@yourcompany.com). Personal Gmail.com or Outlook.com addresses can't be connected.");
      return;
    }
    const secret = provider === "gmail" ? password.replace(/\s+/g, "") : password;
    if (!secret) { setError(`Enter your ${copy.pwLabel.toLowerCase()}.`); return; }
    if (!server.smtpHost.trim() || !server.imapHost.trim()) { setError("Fill in both server names."); return; }
    setBusy(true);
    try {
      await api.post("/email-accounts", {
        email: email.trim(),
        displayName: sender.trim(),
        smtpHost: server.smtpHost.trim(),
        smtpPort: Number(server.smtpPort),
        smtpSecure: server.smtpSecurity === "SSL",
        smtpUsername: email.trim(),
        smtpPassword: secret,
        imapHost: server.imapHost.trim(),
        imapPort: Number(server.imapPort),
        imapSecure: server.imapSecurity === "SSL",
        imapUsername: email.trim(),
        imapPassword: secret,
      }, { timeout: 60000 });
      setConnected(true);
    } catch (err) {
      setError(err?.response?.data?.error || err?.response?.data?.message || "We could not sign in with these details.");
    } finally {
      setBusy(false);
    }
  };

  const copyAdminNote = async () => {
    try { await navigator.clipboard.writeText(ADMIN_NOTE); setCopied(true); setTimeout(() => setCopied(false), 2500); } catch { setCopied(false); }
  };

  const lastN = provider === "other" ? 2 : 3;

  return (
    <div className="ob">
      <header className="top">
        <Brand />
        <Link className="back" href="/onboarding/ready"><Icon name="arrowLeft" size={16} stroke={2.2} />Back to setup</Link>
      </header>
      <main className="wrap">
        <section className="cl">
          <nav className="ptabs" aria-label="Email provider">
            <Link href="/onboarding/connect/gmail" className={provider === "gmail" ? "on" : ""} aria-current={provider === "gmail" ? "page" : undefined}>Gmail</Link>
            <Link href="/onboarding/connect/outlook" className={provider === "outlook" ? "on" : ""} aria-current={provider === "outlook" ? "page" : undefined}>Outlook</Link>
            <Link href="/onboarding/connect/other" className={provider === "other" ? "on" : ""} aria-current={provider === "other" ? "page" : undefined}>Another provider</Link>
          </nav>

          <div className="hd">
            <span className={`logo ${provider === "other" ? "alt" : ""}`}>
              <Icon name={provider === "gmail" ? "google" : provider === "outlook" ? "microsoft" : "mail"} size={provider === "other" ? 26 : 30} stroke={provider === "other" ? 2 : 1.8} />
            </span>
            <div><h1 className="h1" style={{ margin: 0 }}>{copy.title}</h1><p className="csub">{free && provider === "gmail" ? "Google Workspace. Takes about 2 minutes."
              : free && provider === "outlook" ? "Microsoft 365. Takes about 2 minutes." : copy.sub}</p></div>
          </div>

          {free && (
            <div className="warnnote">On the Free plan you send from your company inbox, like you@yourcompany.com. Personal Gmail.com, Outlook.com or Yahoo addresses can&apos;t be connected. <Link href="/billing">See plans</Link></div>
          )}

          <div className="ccard">
            {provider === "gmail" && (
              <>
                <div className="stp"><span className="n">1</span><div><b>Turn on 2-Step Verification</b><p>Google only gives app passwords to accounts with 2-Step Verification. Already on? Skip to step 2.</p><a className="ext" href="https://myaccount.google.com/signinoptions/twosv" target="_blank" rel="noopener noreferrer">Open Google security settings ↗</a></div></div>
                <div className="stp"><span className="n">2</span><div><b>Create an app password</b><p>Name it &ldquo;GNX Sales&rdquo;. Google shows a 16-letter password once. Copy it.</p><a className="ext" href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer">Create app password ↗</a><div className="warnnote">Using Google Workspace? If you don&apos;t see app passwords, your admin may have turned them off.</div></div></div>
              </>
            )}
            {provider === "outlook" && (
              <>
                <div className="stp"><span className="n">1</span><div><b>Check that your mailbox allows sign-in from apps</b><p>Work or school account on Microsoft 365? Your admin needs &ldquo;Authenticated SMTP&rdquo; turned on for your mailbox. Personal Outlook.com accounts can skip this.</p><button type="button" className="ext" onClick={copyAdminNote}>{copied ? "Copied ✓" : "Copy instructions for my admin"}</button></div></div>
                <div className="stp"><span className="n">2</span><div><b>Create an app password if you use two-step sign-in</b><p>In your Microsoft account security settings, create an app password and copy it. No two-step sign-in? Use your normal password.</p><a className="ext" href="https://account.microsoft.com/security" target="_blank" rel="noopener noreferrer">Open Microsoft security settings ↗</a></div></div>
              </>
            )}
            {provider === "other" && (
              <div className="stp"><span className="n">1</span><div><b>Pick your provider to fill in the settings</b>
                <div className="chips">{Object.keys(PRESETS).map(label => (
                  <button type="button" key={label} className={`chip xs ${preset === label ? "on" : ""}`} style={{ minHeight: 38 }} aria-pressed={preset === label} onClick={() => pickPreset(label)}>{label}</button>
                ))}</div>
                <p>Not listed? Choose &ldquo;Something else&rdquo; and copy the settings from your email host&apos;s help page, or ask whoever set up your email.</p>
              </div></div>
            )}

            <div className="stp"><span className="n">{lastN}</span><div><b>Sign in</b>
              <div className="cgrid">
                <label className="fld"><span className="lbl">Email address</span><span className="in"><input type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@yourcompany.com" /></span></label>
                <label className="fld"><span className="lbl">{copy.pwLabel} <small>{copy.pwHint}</small></span>
                  <span className="in mono"><input type={showPw ? "text" : "password"} autoComplete="off" value={password} onChange={e => setPassword(e.target.value)} placeholder={provider === "gmail" ? "abcd efgh ijkl mnop" : ""} />
                    <button type="button" className="trail" onClick={() => setShowPw(s => !s)}>{showPw ? "Hide" : "Show"}</button></span>
                </label>
              </div>
              <label className="fld"><span className="lbl">Sender name <small>What leads see in their inbox</small></span><span className="in"><input value={sender} maxLength={160} onChange={e => setSender(e.target.value)} placeholder="Your name" /></span></label>

              {showFields ? (
                <ServerFields server={server} onChange={setServer} />
              ) : (
                <div className="srv">
                  <div className="srv-h"><span><Icon name="checkCircle" size={14} stroke={2.2} />Server settings filled in for you</span><button type="button" onClick={() => setEditingServer(true)}>Edit</button></div>
                  <div className="srv-r"><em>Sending</em><code>{server.smtpHost}</code><span>{server.smtpPort}</span><span>{server.smtpSecurity}</span></div>
                  <div className="srv-r"><em>Replies</em><code>{server.imapHost}</code><span>{server.imapPort}</span><span>{server.imapSecurity}</span></div>
                </div>
              )}
              {error && <div className="err" role="alert"><Icon name="alertCircle" size={18} /><span>{error}</span></div>}
            </div></div>

            <div className="cfoot">
              <span className="lockn"><Icon name="lock" size={16} stroke={2} style={{ flex: "none", marginTop: 1 }} />Stored encrypted. Only used to send your approved emails and read replies.</span>
              <button type="button" className="bt bt-p" onClick={connect} disabled={busy || connected}>{connected ? "Connected ✓" : busy ? "Testing…" : "Test and connect"}</button>
            </div>
          </div>
        </section>

        <aside className="cr2">
          {connected && (
            <div className="ok-card">
              <b>Inbox connected</b>
              <p>{email.trim()} is ready. New inboxes start slow and build up over a few weeks, so your emails keep landing in the inbox.</p>
              <Link className="bt bt-p" href="/onboarding/ready">Back to setup</Link>
            </div>
          )}
          <div className="chk">
            <h3>What we check when you connect</h3>
            <div className="chk-r"><i className={connected ? "ok" : ""}>1</i><span>We can sign in<small>Your email and password work</small></span></div>
            <div className="chk-r"><i className={connected ? "ok" : ""}>2</i><span>We can send<small>We test the sending server. No email goes to any lead</small></span></div>
            <div className="chk-r"><i className={connected ? "ok" : ""}>3</i><span>We can see replies<small>So replies show up in GNX and stop follow-ups</small></span></div>
          </div>
          <div className="tip"><b>&ldquo;Username and password not accepted&rdquo;?</b>{copy.tip}</div>
        </aside>
      </main>
    </div>
  );
}
