"use client";

import Link from "next/link";
import { Icon } from "../ui/Icon";
import { Logo } from "../ui/Logo";
import { FREE_PLAN } from "../../lib/free-plan";

// The two-column frame every sign-in screen shares: the form on the left and
// an illustrated story on the right. The panels are product illustrations,
// not account data, so they are the same for everyone.
export function AuthFrame({ panel = "free", children }) {
  return (
    <div className="gx au">
      <div className="au-l">
        <Link href="/" className="au-brand" aria-label="GNX Sales home"><Logo size={36} /></Link>
        <div className="au-form">{children}</div>
        <div className="au-legal">
          © {new Date().getFullYear()} GNX Sales · <Link href="/terms">Terms</Link> · <Link href="/privacy">Privacy</Link>
        </div>
      </div>
      <aside className="au-r" aria-hidden="true">
        {panel === "away" ? <AwayPanel /> : panel === "paused" ? <PausedPanel /> : <FreePanel />}
      </aside>
    </div>
  );
}

function MockWindow({ path, children }) {
  return (
    <div className="mock">
      <div className="mock-bar"><i /><i /><i /><span>app.gnxsales.com/{path}</span></div>
      <div className="mock-b">{children}</div>
    </div>
  );
}

function MockRow({ icon, title, detail, pill, tone = "mute", hi }) {
  return (
    <div className={`mrow${hi ? " hi" : ""}`}>
      <span className="kpi-ic"><Icon name={icon} size={16} /></span>
      <div><b>{title}</b><small>{detail}</small></div>
      <span className={`pl pl-${tone}`}>{pill}</span>
    </div>
  );
}

function FreePanel() {
  return (
    <>
      <div className="rh">
        <small>Free to start</small>
        <h2>Your first campaign,<br /><span>from your own inbox.</span></h2>
        <p>{FREE_PLAN.emailCampaigns} email campaign, about {FREE_PLAN.monthlyAiEmails} AI-written emails a month, your own leads. No card needed.</p>
      </div>
      <MockWindow path="dashboard">
        <div className="m2">
          {[["Emails sent", "61", "from your own inbox", "send"], ["Replies", "4", "drafts ready for you", "chat"], ["Meetings", "1", "booked from a reply", "calendar"]].map(([label, value, detail, icon]) => (
            <div key={label} className="kpi">
              <div className="kpi-top">{label}<span className="kpi-ic"><Icon name={icon} size={16} /></span></div>
              <b>{value}</b><small>{detail}</small>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-h">
            <div><b>Q4 data teams</b><small>1 email campaign · 3 steps · 9 AM to 5 PM in each lead&apos;s timezone</small></div>
            <span className="pl pl-ok">Active</span>
          </div>
          <MockRow icon="mail" title="Step 1 · Opening email" detail="Written from facts Nexo verified" pill="21 sent" tone="ok" />
          <MockRow icon="refresh" title="Step 2 · Follow-up, 3 days later" detail="Stops on a reply or unsubscribe" pill="Sending" tone="info" />
          <MockRow icon="clock" title="Step 3 · Last note, 5 days later" detail="Polite close, offers to step back" pill="Waiting" />
        </div>
        <div className="card" style={{ padding: 16 }}>
          <div className="cr-top"><b>Free plan</b><span>Resets monthly</span></div>
          <div className="fu"><div><span>AI emails</span><b>142 / {FREE_PLAN.monthlyAiEmails}</b></div><div className="bar"><u style={{ width: "71%" }} /></div></div>
          <div className="fu"><div><span>Sent today</span><b>18 / {FREE_PLAN.dailyEmailCap}</b></div><div className="bar"><u style={{ width: "60%" }} /></div></div>
        </div>
      </MockWindow>
    </>
  );
}

function MockDraft({ to, pill, tone, children }) {
  return (
    <div className="mdft">
      <div className="mdft-h"><span className="nx"><Icon name="spark" size={13} color="#06231a" /></span>Nexo&apos;s draft to {to}<span className={`pl pl-${tone}`}>{pill}</span></div>
      <p>{children}</p>
      <div className="acts">
        <span className="bt bt-g sm"><Icon name="doc" size={14} /> Edit</span>
        <span className="bt bt-p sm"><Icon name="send" size={14} color="#06231a" /> Approve and send</span>
      </div>
    </div>
  );
}

const AWAY_REPLIES = [
  ["DO", "#0a5d3f", "Daniel Okafor · Brightlane", "Can you share how it works for a 10-person team?", "9:42 AM"],
  ["HL", "#6d5bd0", "Hannah Lee · Cobaltly", "Can you send pricing for 3 seats?", "8:58 AM"],
  ["GO", "#c2410c", "Grace Okoye · Harborline", "Thursday could work. What does onboarding look like?", "8:41 AM"],
];

function AwayPanel() {
  return (
    <>
      <div className="rh">
        <small>While you were away</small>
        <h2>Nexo kept<br /><span>the follow-ups going.</span></h2>
        <p>Replies wait in Inbox with a drafted answer. Nothing sends until you say so.</p>
      </div>
      <MockWindow path="inbox">
        <div className="card">
          <div className="card-h">
            <div><b>Inbox</b><small>3 replies came in while you were away</small></div>
            <span className="pl pl-warn">3 drafts ready</span>
          </div>
          {AWAY_REPLIES.map(([initials, color, who, text, when], index) => (
            <div key={who} className={`mrow${index === 0 ? " hi" : ""}`}>
              <span className="hd-av" style={{ width: 32, height: 32, fontSize: 12, background: color }}>{initials}</span>
              <div><b>{who}</b><small>{text}</small></div>
              <span className="when">{when}</span>
            </div>
          ))}
        </div>
        <MockDraft to="Daniel" pill="Needs your OK" tone="warn">
          Thanks for asking, Daniel. For a 10-person team, most start with one campaign: Nexo finds qualified buyers each week, writes each email from verified facts, and you approve the replies. Would a 20 minute walkthrough on Thursday help?
        </MockDraft>
      </MockWindow>
    </>
  );
}

function PausedPanel() {
  return (
    <>
      <div className="rh">
        <small>Picking up again</small>
        <h2>Two minutes<br /><span>and you are back.</span></h2>
        <p>Resume your campaign and Nexo carries on from where it stopped.</p>
      </div>
      <MockWindow path="campaigns">
        <div className="card">
          <div className="card-h">
            <div><b>Q4 data teams</b><small>Paused while you were away · 21 of 25 leads contacted</small></div>
            <span className="pl pl-warn">Paused</span>
          </div>
          <MockRow icon="mail" title="Check your inbox is connected" detail="Settings shows each sending inbox and its status" pill="Step 1" tone="warn" />
          <MockRow icon="play" title="Resume at step 2" detail="The next follow-ups go out inside 9 AM to 5 PM" pill="Step 2" />
          <MockRow icon="chat" title="Approve the waiting reply" detail="Ivan Petrov asked about pricing for a team of 4" pill="Step 3" />
        </div>
        <MockDraft to="Ivan" pill="Kept while paused" tone="ok">
          Thanks Ivan, sorry for the slow reply. Pricing depends on team size, so a 15 minute call is the quickest way to get you an exact number for 4 people. Does Thursday work?
        </MockDraft>
      </MockWindow>
    </>
  );
}

// Six boxes over one real input, so typing, paste and one-time-code
// autofill all behave like a normal field.
export function OtpField({ value, onChange, bad, autoFocus = true }) {
  const active = Math.min(value.length, 5);
  return (
    <label className="fld">
      <span>Verification code</span>
      <div className="otp-wrap">
        <div className={`otp${bad ? " bad" : ""}`} aria-hidden="true">
          {Array.from({ length: 6 }, (_, index) => (
            <span key={index} className={index === active ? "on" : ""}>{value[index] || ""}</span>
          ))}
        </div>
        <input
          inputMode="numeric"
          autoComplete="one-time-code"
          aria-label="6-digit verification code"
          aria-invalid={bad ? "true" : undefined}
          autoFocus={autoFocus}
          maxLength={6}
          value={value}
          onChange={event => onChange(event.target.value.replace(/\D/g, "").slice(0, 6))}
        />
      </div>
    </label>
  );
}

export function GoogleButton({ label = "Continue with Google", onClick }) {
  return (
    <button
      type="button"
      className="gbtn"
      onClick={onClick || (() => { window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`; })}
    >
      <Icon name="google" size={19} /> {label}
    </button>
  );
}
