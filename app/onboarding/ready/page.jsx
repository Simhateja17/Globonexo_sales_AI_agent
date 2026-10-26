"use client";
import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Icon from "../../../components/ui/Icon";
import { Brand } from "../../../components/onboarding/ui";
import { useAuth } from "../../../hooks/useAuth";
import api from "../../../lib/api";
import { CHANNEL_KEY } from "../../../lib/onboarding-flow";
import { FREE_PLAN, isFreePlan } from "../../../lib/free-plan";

function readStored(store, key) {
  try { return window[store].getItem(key); } catch { return null; }
}

function Task({ state, n, title, children, action }) {
  return (
    <div className={`task ${state === "ok" ? "done" : ""}`}>
      <span className={`st ${state}`}>{state === "ok" ? <Icon name="check" size={14} stroke={3} /> : state === "run" ? <Icon name="refresh" size={14} stroke={2.2} /> : n}</span>
      <div><b>{title}</b><small>{children}</small></div>
      {action}
    </div>
  );
}

/**
 * The organization's calling number, from its real provisioning rows:
 * active, provisioning (being set up now), requested (waiting on our team),
 * failed, or none yet.
 */
function numberStatus(rows) {
  const list = Array.isArray(rows) ? rows : [];
  if (list.some(r => r.status === "active" || r.status === "over_limit")) return "active";
  if (list.some(r => r.status === "provisioning")) return "provisioning";
  if (list.some(r => r.status === "requested")) return "requested";
  if (list.some(r => r.status === "failed")) return "failed";
  return "none";
}

const NUMBER_COPY = {
  active: { pill: "Ready", text: "Your calling number is ready." },
  provisioning: { pill: "Setting up", text: "We're setting up your number and voice agent now. Usually a few minutes, nothing to do." },
  requested: { pill: "Requested", text: "Our team is setting up your number. We'll let you know when it's ready, nothing to do." },
  failed: { pill: "Needs attention", text: "Setting up your number hit a problem. Retry it from Settings, or contact support." },
  none: { pill: "Not set up", text: "Get your calling number from Settings. It's included in your plan." },
  loading: { pill: "Checking", text: "Checking your calling number." },
};

function ReadyView() {
  const params = useSearchParams();
  const campaignId = params.get("campaignId");
  const { user, organization } = useAuth();
  const free = isFreePlan(organization);
  const [channels, setChannels] = useState("email");
  const [inbox, setInbox] = useState(null);
  const [number, setNumber] = useState(null);
  const [leadsState, setLeadsState] = useState("todo");
  const [channelNotice, setChannelNotice] = useState("");

  useEffect(() => {
    const stored = readStored("localStorage", CHANNEL_KEY);
    if (["email", "voice", "both"].includes(stored)) setChannels(stored);
    else api.get("/onboarding").then(({ data }) => {
      const value = data?.onboarding_preferences?.channels;
      if (["email", "voice", "both"].includes(value)) setChannels(value);
    }).catch(() => {});
    try {
      const prep = JSON.parse(readStored("sessionStorage", "gnx_onboarding_preparation") || "{}");
      // The lead search's own status, not the overall one: Free plans have
      // no lead search, so "ready" there must not tick off "Add your leads".
      const search = prep.apollo?.status;
      if (search === "preparing") setLeadsState("run");
      else if (search === "ready" || search === "already_populated") setLeadsState("ok");
      if (typeof prep.channelNotice === "string") setChannelNotice(prep.channelNotice);
    } catch { /* ignore */ }
  }, []);

  // Free has no AI calling, whatever an earlier answer said.
  const email = free || channels !== "voice";
  const voice = !free && channels !== "email";

  useEffect(() => {
    if (email) api.get("/email-accounts").then(({ data }) => setInbox((data?.accounts || []).length > 0)).catch(() => setInbox(false));
    if (voice) api.get("/voice/phone-numbers").then(({ data }) => setNumber(numberStatus(data))).catch(() => setNumber("none"));
  }, [email, voice]);

  const name = user?.first_name ? `, ${user.first_name}` : "";
  const tasks = [{ done: true }];
  if (email) tasks.push({ done: !!inbox });
  if (voice) tasks.push({ done: number === "active" });
  tasks.push({ done: leadsState === "ok" }, { done: false });
  const doneCount = tasks.filter(t => t.done).length;
  let n = 1;
  const num = () => ++n;
  const campaignHref = campaignId ? `/campaigns/${encodeURIComponent(campaignId)}` : "/campaigns/new";

  return (
    <div className="ob">
      <header className="top">
        <Brand />
        <Link className="save" href="/dashboard">Go to dashboard</Link>
      </header>
      <main className="wrap tall">
        <section className="rl">
          <div>
            <span className="mark" aria-hidden="true"><Icon name="check" size={28} stroke={2.6} /></span>
            <h1 className="h1">Nexo is ready to work{name}.</h1>
            <p className="lede">
              {email && voice ? "It knows your product, your buyers and how you like to sound, in email and on calls. A few quick steps and your first campaign can go out."
                : voice ? "It knows your product, your buyers and how calls should sound. Add the people to call and you can start your first campaign."
                  : "It knows your product, your buyers and how you like to write. Connect your inbox and add leads, and your first campaign can go out."}
            </p>
          </div>

          {channelNotice && (
            <div className="callnote" role="status"><Icon name="alertCircle" size={16} color="#93370d" stroke={2} style={{ flex: "none", marginTop: 2 }} /><span>{channelNotice} <Link href="/billing">See plans</Link></span></div>
          )}

          <div className="tcard">
            <div className="tcard-h"><b>Your first campaign</b><span>{doneCount} of {tasks.length} done</span></div>
            <div className="bar" aria-hidden="true"><u style={{ width: `${Math.round((doneCount / tasks.length) * 100)}%` }} /></div>
            <Task state="ok" n={1} title="Agent set up" action={<Link className="bt bt-g bt-s" href="/settings">Review</Link>}>
              Product, audience and style are saved. Change them anytime in Settings.
            </Task>
            {email && (
              <Task state={inbox ? "ok" : "todo"} n={num()} title="Connect your inbox"
                action={inbox ? <span className="pill">Connected</span> : <Link className="bt bt-p bt-s" href="/onboarding/connect/gmail">Connect</Link>}>
                Emails go out from your own address, and replies land with you.
              </Task>
            )}
            {voice && (
              <Task state={number === "active" ? "ok" : number === "provisioning" || number === "requested" ? "run" : "todo"} n={num()} title="Calling number and voice agent"
                action={number === "failed" || number === "none"
                  ? <Link className="bt bt-g bt-s" href="/settings#phone-numbers">{number === "failed" ? "Retry" : "Get a number"}</Link>
                  : <span className={`pill ${number === "active" ? "" : "mute"}`}>{NUMBER_COPY[number || "loading"].pill}</span>}>
                {NUMBER_COPY[number || "loading"].text}
              </Task>
            )}
            <Task state={leadsState} n={num()} title={leadsState === "run" ? "Finding your first leads" : "Add your leads"}
              action={<Link className="bt bt-g bt-s" href={leadsState === "todo" ? "/prospects?add=csv" : "/prospects"}>{leadsState === "todo" ? "Add leads" : "View leads"}</Link>}>
              {leadsState === "run" ? "Nexo is finding up to 10 verified leads that match your audience. You can add your own too."
                : free ? `On the Free plan you bring your own leads, up to ${FREE_PLAN.maxLeads}. Import a CSV or add people one by one.`
                : email && voice ? "Import a CSV or add people one by one. Phone numbers for calls, emails for emails."
                  : voice ? "Import a CSV or add people one by one. Each needs a phone number."
                    : "Import a CSV or add people one by one."}
            </Task>
            <Task state="lock" n={num()} title="Start your first campaign"
              action={<Link className="bt bt-g bt-s" href={campaignHref}>{campaignId ? "Open campaign" : "Create campaign"}</Link>}>
              {email && voice ? "Your first email campaign is drafted. Review it, or start a voice campaign alongside it. Nothing goes out until you launch."
                : voice && channelNotice ? "Your first campaign is drafted as email for now. Review every email before it sends."
                  : voice ? "Your first voice campaign is drafted with your call style. Review the leads and calling hours, then launch."
                  : "Your first campaign is drafted. Review every email before it sends."}
            </Task>
          </div>

          <div className="mores">
            <Link className="mo" href="/calendar"><i><Icon name="calendar" size={18} stroke={2} /></i><div><b>Set meeting hours</b><small>So Nexo only offers times you are free</small></div></Link>
            <Link className="mo" href="/dashboard"><i><Icon name="grid" size={18} stroke={2} /></i><div><b>Look around first</b><small>Open your dashboard. Your setup checklist stays there until you&apos;re done.</small></div></Link>
          </div>
        </section>

        <aside className="rr">
          {email && !inbox && (
            <div className="now">
              <span className="eb">Do this now · 2 minutes</span>
              <h2>Connect the inbox Nexo sends from</h2>
              <p>{free
                ? "Use your company address, like you@yourcompany.com. Personal Gmail.com or Outlook.com addresses can't be connected on the Free plan."
                : "Pick your email provider. We fill in the server settings, you just sign in with an app password."}</p>
              <Link className="prov" href="/onboarding/connect/gmail"><span className="lg"><Icon name="google" size={20} /></span><span className="t">{free ? "Google Workspace" : "Gmail or Google Workspace"}</span><small>Settings filled in</small></Link>
              <Link className="prov" href="/onboarding/connect/outlook"><span className="lg"><Icon name="microsoft" size={18} /></span><span className="t">{free ? "Microsoft 365" : "Outlook or Microsoft 365"}</span><small>Settings filled in</small></Link>
              <Link className="prov alt" href="/onboarding/connect/other"><span className="lg alt"><Icon name="mail" size={18} stroke={2} /></span><span className="t">Another provider<small>Zoho, GoDaddy, your own domain and more</small></span><small>SMTP and IMAP</small></Link>
              <span className="trust"><Icon name="shieldPlain" size={15} stroke={2} />Nexo never sends without your approval.</span>
            </div>
          )}
          {(!email || inbox) && (
            <div className="now">
              <span className="eb">Do this now · 2 minutes</span>
              <h2>Add the people Nexo should {voice && !email ? "call" : "reach"}</h2>
              <p>{voice && !email ? "Each lead needs a name and a phone number. Company and email are optional but make calls better." : "Import a list or add people one by one. Nexo checks every lead before it writes."}</p>
              <Link className="prov" href="/prospects?add=csv"><span className="lg soft"><Icon name="upload" size={17} stroke={2} /></span><span className="t">Import a CSV</span><small>From any spreadsheet</small></Link>
              <Link className="prov" href="/prospects?add=manual"><span className="lg soft"><Icon name="user" size={17} stroke={2} /></span><span className="t">Add one by one</span><small>{voice && !email ? "Name and phone" : "Name and email"}</small></Link>
              {!free && leadsState !== "todo" && (
                <Link className="prov alt" href="/prospects"><span className="lg ghost"><Icon name="search" size={17} stroke={2} /></span><span className="t">See the leads Nexo found<small>Matched to your audience</small></span><small>Prospects</small></Link>
              )}
              <span className="trust"><Icon name="shieldPlain" size={15} stroke={2} />{voice ? "No calls happen until you launch a campaign." : "Nothing is sent until you approve it."}</span>
            </div>
          )}
          {email && voice && (number === "provisioning" || number === "requested") && (
            <div className="side2"><i><Icon name="phone" size={18} stroke={2} /></i><div><b>Your calling number is on its way</b><small>No action needed. You can start a voice campaign alongside your email one once it&apos;s ready.</small></div></div>
          )}
          {free && (
            <div className="side2"><i><Icon name="bolt" size={18} stroke={2} /></i><div><b>Want Nexo to find leads and make calls?</b><small>Paid plans add the lead database, verified emails and AI voice calling. <Link href="/billing">See plans</Link></small></div></div>
          )}
        </aside>
      </main>
    </div>
  );
}

export default function OnboardingReadyPage() {
  return (
    <Suspense fallback={<div className="ob" aria-busy="true" />}>
      <ReadyView />
    </Suspense>
  );
}
