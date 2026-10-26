"use client";
import { useState } from "react";
import Link from "next/link";
import Icon from "../ui/Icon";
import PublicNav from "../layout/PublicNav";
import PublicFooter from "../layout/PublicFooter";
import FaqSection from "./FaqSection";
import { BreadcrumbSchema } from "./SiteSchema";
import { PLAN_CONFIG } from "../../lib/plans";
import FreePlanStrip from "./FreePlanStrip";

const TOG_ON = { background: "#fff", color: "#06231a", boxShadow: "0 6px 18px rgba(0,0,0,.18)" };
const TOG_OFF = { background: "transparent", color: "rgba(255,255,255,.78)" };
const SAVE_BASE = { marginLeft: "6px", padding: "3px 8px", borderRadius: "999px", fontSize: "11.5px" };
const SAVE_ON = { ...SAVE_BASE, background: "#0a1712", color: "#6fe7b0" };
const SAVE_OFF = { ...SAVE_BASE, background: "#6fe7b0", color: "#06231a" };

const FINDER = {
  team: ["Just me", "2 to 5", "6 to 15"],
  vol: ["Up to 100", "Up to 200", "Up to 500"],
  call: ["Outbound, light", "Inbound too", "Heavy calling"],
};

function Pills({ name, value, set }) {
  return (
    <div className="gd-pills">
      {FINDER[name].map((label, i) => (
        <button
          key={label}
          type="button"
          aria-pressed={value === i + 1}
          className={value === i + 1 ? "is-on" : undefined}
          onClick={() => set(name, i + 1)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

// Pricing page: billing toggle, plan cards and the three-question plan finder
// share one billing-period and finder state, so the whole page is one client view.
export default function PricingView({ faqs }) {
  const [annual, setAnnual] = useState(false);
  const [finder, setFinderState] = useState({ team: 1, vol: 1, call: 1 });
  const { team, vol, call } = finder;
  const setFinder = (key, n) => setFinderState((s) => ({ ...s, [key]: n }));

  const priceOf = (plan) => `$${annual ? plan.annualMonthly : plan.monthly}`;
  const billedOf = (plan) =>
    annual ? `Billed $${plan.annualTotal.toLocaleString()} once a year` : "Billed monthly. Cancel any time.";
  const [p1, p2, p3] = PLAN_CONFIG.map(priceOf);
  const [b1, b2, b3] = PLAN_CONFIG.map(billedOf);

  const idx = Math.max(team, vol, call) - 1;
  const reasons = [];
  if (team === idx + 1 && idx > 0) reasons.push(idx === 1 ? "up to 5 people need seats" : "up to 15 people need seats");
  if (vol === idx + 1 && idx > 0)
    reasons.push(idx === 1 ? "you send up to 200 emails a day" : "you send up to 500 emails a day");
  if (call === idx + 1 && idx > 0) {
    reasons.push(idx === 1 ? "you want the inbound AI receptionist" : "you run up to 10 voice campaigns at once");
  }
  const recName = PLAN_CONFIG[idx].name;
  const recPrice = priceOf(PLAN_CONFIG[idx]);
  const recWhy =
    idx === 0
      ? "One seat, one inbox, 100 emails a day and one voice campaign. Everything a solo seller needs to start."
      : `Recommended because ${reasons.join(" and ")}.`;

  return (
    <div className="public-page gd-page gd-page-pricing">
      <PublicNav />
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(135deg, #041f16 0%, #06311f 45%, #075b3f 100%)",
          color: "#fff",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            width: "600px",
            height: "600px",
            left: "50%",
            top: "-300px",
            marginLeft: "-300px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(41,214,143,.45), rgba(41,214,143,0) 70%)",
            filter: "blur(60px)",
          }}
        ></div>
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: "0",
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)",
            backgroundSize: "52px 52px",
            WebkitMaskImage: "radial-gradient(ellipse at 50% 30%, #000 0%, transparent 70%)",
            maskImage: "radial-gradient(ellipse at 50% 30%, #000 0%, transparent 70%)",
          }}
        ></div>
        <div
          style={{
            position: "relative",
            maxWidth: "900px",
            margin: "0 auto",
            padding: "80px 24px 168px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              padding: "7px 14px",
              borderRadius: "999px",
              background: "rgba(255,255,255,.08)",
              border: "1px solid rgba(255,255,255,.14)",
              color: "#a8f0c6",
              fontSize: "12px",
              fontWeight: "800",
              letterSpacing: ".14em",
              textTransform: "uppercase",
            }}
          >
            Pricing
          </div>
          <h1
            style={{
              margin: "24px 0 0",
              fontFamily: "var(--font-display)",
              fontWeight: "600",
              fontSize: "clamp(44px, 6.5vw, 80px)",
              lineHeight: "1",
              letterSpacing: "-.05em",
            }}
          >
            One price.
            <br />
            <span style={{ color: "#6fe7b0" }}>The whole sales loop.</span>
          </h1>
          <p
            style={{
              margin: "22px auto 0",
              maxWidth: "620px",
              color: "rgba(255,255,255,.76)",
              fontSize: "18px",
              lineHeight: "1.7",
            }}
          >
            Email, lead enrichment and AI calling in every paid plan, from one credit pool. Or start on Free with AI email. No per-channel fees, no setup
            fee. Your plan only sets the volume.
          </p>
          <div
            style={{
              marginTop: "34px",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <div className="gd-tog" role="group" aria-label="Billing period">
              <button
                type="button"
                aria-pressed={!annual}
                onClick={() => setAnnual(false)}
                style={annual ? TOG_OFF : TOG_ON}
              >
                Monthly
              </button>
              <button
                type="button"
                aria-pressed={annual}
                onClick={() => setAnnual(true)}
                style={annual ? TOG_ON : TOG_OFF}
              >
                Yearly <span style={annual ? SAVE_ON : SAVE_OFF}>Save 17%</span>
              </button>
            </div>
          </div>
        </div>
      </section>
      <section
        id="plans"
        style={{
          maxWidth: "1160px",
          margin: "-112px auto 0",
          padding: "0 24px",
          position: "relative",
          scrollMarginTop: "24px",
        }}
      >
        <FreePlanStrip />
        <div className="gd-g3">
          <article className="gd-plan">
            <h3>Individual</h3>
            <p className="gd-ds">For one person running outbound alone.</p>
            <div className="gd-pr">
              {annual && <s>$59</s>}
              <b>{p1}</b>
              <span>/month</span>
            </div>
            <div className="gd-bl">{b1}</div>
            <Link className="gd-cta gd-s" href="/signup">
              Start Individual
            </Link>
            <div className="gd-big">
              <div>
                <b>3,000</b>
                <span>emails a month, up to</span>
              </div>
              <div>
                <b>~100</b>
                <span>AI calls a month</span>
              </div>
            </div>
            <ul className="gd-lim">
              <li>
                Monthly credits<b>2,645</b>
              </li>
              <li>
                Email campaigns at once<b>3</b>
              </li>
              <li>
                Voice campaigns at once<b>1</b>
              </li>
              <li>
                Seats<b>1</b>
              </li>
              <li>
                Sending inboxes<b>1</b>
              </li>
              <li>
                Phone numbers<b>1</b>
              </li>
              <li className="gd-off">
                Inbound AI receptionist<b>Not included</b>
              </li>
            </ul>
          </article>
          <article className="gd-plan gd-ft">
            <span className="gd-badge">Most popular</span>
            <h3>Agency</h3>
            <p className="gd-ds">For agencies running outbound across several client accounts.</p>
            <div className="gd-pr">
              {annual && <s>$179</s>}
              <b>{p2}</b>
              <span>/month</span>
            </div>
            <div className="gd-bl">{b2}</div>
            <Link className="gd-cta gd-p" href="/signup">
              Start Agency
            </Link>
            <div className="gd-big">
              <div>
                <b>6,000</b>
                <span>emails a month, up to</span>
              </div>
              <div>
                <b>~200</b>
                <span>AI calls a month</span>
              </div>
            </div>
            <ul className="gd-lim">
              <li>
                Monthly credits<b>5,370</b>
              </li>
              <li>
                Email campaigns at once<b>10</b>
              </li>
              <li>
                Voice campaigns at once<b>4</b>
              </li>
              <li>
                Seats<b>5</b>
              </li>
              <li>
                Sending inboxes<b>10</b>
              </li>
              <li>
                Phone numbers<b>3</b>
              </li>
              <li>
                Inbound AI receptionist<b>Included</b>
              </li>
            </ul>
          </article>
          <article className="gd-plan">
            <h3>Startup</h3>
            <p className="gd-ds">For startups building an in-house outbound motion at volume.</p>
            <div className="gd-pr">
              {annual && <s>$479</s>}
              <b>{p3}</b>
              <span>/month</span>
            </div>
            <div className="gd-bl">{b3}</div>
            <Link className="gd-cta gd-s" href="/signup">
              Start Startup
            </Link>
            <div className="gd-big">
              <div>
                <b>15,000</b>
                <span>emails a month, up to</span>
              </div>
              <div>
                <b>~550</b>
                <span>AI calls a month</span>
              </div>
            </div>
            <ul className="gd-lim">
              <li>
                Monthly credits<b>14,370</b>
              </li>
              <li>
                Email campaigns at once<b>25</b>
              </li>
              <li>
                Voice campaigns at once<b>10</b>
              </li>
              <li>
                Seats<b>15</b>
              </li>
              <li>
                Sending inboxes<b>30</b>
              </li>
              <li>
                Phone numbers<b>10</b>
              </li>
              <li>
                Inbound AI receptionist<b>Included</b>
              </li>
            </ul>
          </article>
        </div>
        <div className="gd-inc">
          <div className="gd-inc-h">In every plan, at every price</div>
          <div className="gd-inc-g">
            <span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#088256"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12l5 5 9-10"></path>
              </svg>
              AI email sequences
            </span>
            <span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#088256"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12l5 5 9-10"></path>
              </svg>
              Lead database and enrichment
            </span>
            <span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#088256"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12l5 5 9-10"></path>
              </svg>
              AI voice calling
            </span>
            <span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#088256"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12l5 5 9-10"></path>
              </svg>
              Replies you approve
            </span>
            <span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#088256"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12l5 5 9-10"></path>
              </svg>
              Do Not Call and unsubscribe handling
            </span>
            <span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#088256"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12l5 5 9-10"></path>
              </svg>
              Calendar, Inbox and Pipeline
            </span>
          </div>
        </div>
        <div className="gd-trust">
          <div>
            <b>Month to month</b>
            <span>No annual lock-in. Cancel from Billing any time.</span>
          </div>
          <div>
            <b>No setup fee</b>
            <span>No onboarding fee, no per-seat or per-channel charges.</span>
          </div>
          <div>
            <b>Verified emails only</b>
            <span>By default the agent emails only addresses verified as real, to protect your domain.</span>
          </div>
          <div>
            <b>You approve first</b>
            <span>Every draft waits for you until you switch on autopilot.</span>
          </div>
        </div>
      </section>
      <section style={{ maxWidth: "1160px", margin: "0 auto", padding: "96px 24px 0" }}>
        <div style={{ maxWidth: "680px" }}>
          <div className="gd-eyebrow">Plan finder</div>
          <h2 className="gd-h2">Not sure? Answer three questions.</h2>
        </div>
        <div className="gd-g3" style={{ marginTop: "32px" }}>
          <div className="gd-fq">
            <b>How many people will use it?</b>
            <Pills name="team" value={team} set={setFinder} />
          </div>
          <div className="gd-fq">
            <b>How many emails a day?</b>
            <Pills name="vol" value={vol} set={setFinder} />
          </div>
          <div className="gd-fq">
            <b>How much calling?</b>
            <Pills name="call" value={call} set={setFinder} />
          </div>
        </div>
        <div className="gd-rec">
          <div>
            <small>Your fit</small>
            <h3>
              {recName} · {recPrice} a month
            </h3>
            <p>{recWhy}</p>
          </div>
          <a
            href="#plans"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              height: "50px",
              padding: "0 24px",
              borderRadius: "999px",
              background: "linear-gradient(180deg, #29d68f, #00c27a)",
              color: "#06231a",
              fontSize: "15px",
              fontWeight: "800",
            }}
          >
            Start {recName}
          </a>
        </div>
      </section>
      <section style={{ maxWidth: "1160px", margin: "0 auto", padding: "96px 24px" }}>
        <div style={{ maxWidth: "720px" }}>
          <div className="gd-eyebrow">What the alternatives cost</div>
          <h2 className="gd-h2">The same work, priced the usual ways.</h2>
          <p className="gd-lead">What getting outbound done usually costs each month, from published figures.</p>
        </div>
        <div className="gd-alt" style={{ marginTop: "32px" }}>
          <div className="gd-alt-r gd-alt-h">
            <div>Option</div>
            <div>Typical cost a month</div>
            <div>Commitment</div>
            <div>Calling included</div>
          </div>
          <div className="gd-alt-r gd-us">
            <div>
              <b>GNX Sales</b>
              <span>Individual, Agency or Startup</span>
            </div>
            <div className="gd-c">$59 to $479</div>
            <div>Month to month</div>
            <div>Yes, outbound in every plan</div>
          </div>
          <div className="gd-alt-r">
            <div>
              <b>Other AI SDR tools</b>
              <span>Several do not publish prices</span>
            </div>
            <div className="gd-c">From about $500</div>
            <div>Some require annual contracts</div>
            <div>Varies, often an add-on</div>
          </div>
          <div className="gd-alt-r">
            <div>
              <b>Outbound agency</b>
              <span>Done-for-you service</span>
            </div>
            <div className="gd-c">$2,000 to $15,000</div>
            <div>Monthly retainer</div>
            <div>Depends on the agency</div>
          </div>
          <div className="gd-alt-r">
            <div>
              <b>Your own SDR</b>
              <span>$80K median on-target pay</span>
            </div>
            <div className="gd-c">About $6,700</div>
            <div>Employment, about 3 months to ramp</div>
            <div>Yes, plus tools you buy</div>
          </div>
        </div>
        <p style={{ margin: "14px 0 0", color: "var(--muted)", fontSize: "13px", lineHeight: "1.6" }}>
          Agency ranges are vendor estimates. A person or an agency brings judgment and live conversations that software
          does not.
        </p>
      </section>
      <section
        style={{ background: "var(--bg)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}
      >
        <div style={{ maxWidth: "1160px", margin: "0 auto", padding: "96px 24px" }}>
          <div style={{ maxWidth: "720px" }}>
            <div className="gd-eyebrow">How credits work</div>
            <h2 className="gd-h2">One credit is one cent of real cost.</h2>
            <p className="gd-lead">
              Credits pay for the work the agent does at our providers: AI writing, contact data and calls. You pay for
              what actually happened, not a padded estimate.
            </p>
          </div>
          <div className="gd-g4" style={{ marginTop: "32px" }}>
            <div className="gd-cr">
              <b>~1</b>
              <strong>A full email sequence</strong>
              <span>One AI call writes all the steps of a sequence together.</span>
            </div>
            <div className="gd-cr">
              <b>~3</b>
              <strong>A verified work email</strong>
              <span>Revealing one contact&apos;s email from the lead database.</span>
            </div>
            <div className="gd-cr">
              <b>~21</b>
              <strong>A mobile number</strong>
              <span>Revealing one contact&apos;s phone number for a voice campaign.</span>
            </div>
            <div className="gd-cr">
              <b>~27</b>
              <strong>An average AI call</strong>
              <span>Real calls range from 8 to 79 credits, depending on length.</span>
            </div>
          </div>
          <div className="gd-g3" style={{ marginTop: "16px" }}>
            <div className="gd-fact">
              <div className="gd-ic">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z"></path>
                </svg>
              </div>
              <div>
                <b>A ceiling per campaign</b>
                <span>Set a credit limit on each campaign. The agent stops before going over it.</span>
              </div>
            </div>
            <div className="gd-fact">
              <div className="gd-ic">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="9"></circle>
                  <path d="M10 9v6M14 9v6"></path>
                </svg>
              </div>
              <div>
                <b>Run out? Work pauses</b>
                <span>
                  New writing, enrichment and calls pause. Anything in progress finishes. No surprise overage bill.
                </span>
              </div>
            </div>
            <div className="gd-fact">
              <div className="gd-ic">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 12a9 9 0 1 1-3-6.7L21 8"></path>
                  <path d="M21 3v5h-5"></path>
                </svg>
              </div>
              <div>
                <b>Refills every period</b>
                <span>Credits renew on your billing date. Unused credits do not carry over.</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section style={{ maxWidth: "1160px", margin: "0 auto", padding: "96px 24px" }}>
        <div style={{ maxWidth: "680px" }}>
          <div className="gd-eyebrow">Compare plans</div>
          <h2 className="gd-h2">Every limit, side by side.</h2>
        </div>
        <div className="gd-tbl" style={{ marginTop: "32px" }}>
          <table>
            <caption
              style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)" }}
            >
              Full plan comparison
            </caption>
            <thead>
              <tr>
                <th
                  scope="col"
                  style={{
                    color: "var(--muted)",
                    fontFamily: "var(--font-body)",
                    fontSize: "12px",
                    fontWeight: "800",
                    letterSpacing: ".1em",
                    textTransform: "uppercase",
                  }}
                >
                  Plan
                </th>
                <th scope="col">
                  Individual<span>{p1} a month</span>
                </th>
                <th scope="col" style={{ background: "#ecfdf3" }}>
                  Agency<span>{p2} a month</span>
                </th>
                <th scope="col">
                  Startup<span>{p3} a month</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="gd-grp">
                <td colSpan="4">Volume</td>
              </tr>
              <tr>
                <th scope="row">Monthly credits</th>
                <td>2,645</td>
                <td className="gd-ft">5,370</td>
                <td>14,370</td>
              </tr>
              <tr>
                <th scope="row">Emails a day</th>
                <td>100</td>
                <td className="gd-ft">200</td>
                <td>500</td>
              </tr>
              <tr>
                <th scope="row">Email campaigns at once</th>
                <td>3</td>
                <td className="gd-ft">10</td>
                <td>25</td>
              </tr>
              <tr>
                <th scope="row">Voice campaigns at once</th>
                <td>1</td>
                <td className="gd-ft">4</td>
                <td>10</td>
              </tr>
              <tr>
                <th scope="row">Qualified leads per campaign</th>
                <td>Up to 25 a week</td>
                <td className="gd-ft">Up to 25 a week</td>
                <td>Up to 25 a week</td>
              </tr>
              <tr className="gd-grp">
                <td colSpan="4">Team and setup</td>
              </tr>
              <tr>
                <th scope="row">Seats</th>
                <td>1</td>
                <td className="gd-ft">5</td>
                <td>15</td>
              </tr>
              <tr>
                <th scope="row">Sending inboxes</th>
                <td>1</td>
                <td className="gd-ft">10</td>
                <td>30</td>
              </tr>
              <tr>
                <th scope="row">Phone numbers</th>
                <td>1</td>
                <td className="gd-ft">3</td>
                <td>10</td>
              </tr>
              <tr className="gd-grp">
                <td colSpan="4">Included in every plan</td>
              </tr>
              <tr>
                <th scope="row">Lead database search and CSV import</th>
                <td>Yes</td>
                <td className="gd-ft">Yes</td>
                <td>Yes</td>
              </tr>
              <tr>
                <th scope="row">AI email sequences and reply drafts</th>
                <td>Yes</td>
                <td className="gd-ft">Yes</td>
                <td>Yes</td>
              </tr>
              <tr>
                <th scope="row">Outbound AI calling with 10 test calls</th>
                <td>Yes</td>
                <td className="gd-ft">Yes</td>
                <td>Yes</td>
              </tr>
              <tr>
                <th scope="row">Autopilot per campaign</th>
                <td>Yes</td>
                <td className="gd-ft">Yes</td>
                <td>Yes</td>
              </tr>
              <tr>
                <th scope="row">Calendar, Inbox, Pipeline, Analytics</th>
                <td>Yes</td>
                <td className="gd-ft">Yes</td>
                <td>Yes</td>
              </tr>
              <tr>
                <th scope="row">AI Agent chat</th>
                <td>Yes</td>
                <td className="gd-ft">Yes</td>
                <td>Yes</td>
              </tr>
              <tr>
                <th scope="row">Email support, reply in 1 business day</th>
                <td>Yes</td>
                <td className="gd-ft">Yes</td>
                <td>Yes</td>
              </tr>
              <tr className="gd-grp">
                <td colSpan="4">Plan specific</td>
              </tr>
              <tr>
                <th scope="row">Inbound AI receptionist</th>
                <td style={{ color: "var(--muted)", fontWeight: "700" }}>No</td>
                <td className="gd-ft">Yes</td>
                <td>Yes</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <section style={{ maxWidth: "1160px", margin: "0 auto", padding: "0 24px 96px" }}>
        <div className="gd-g3">
          <div className="gd-fact">
            <div className="gd-ic">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="6" width="18" height="13" rx="2"></rect>
                <path d="M3 10h18M7 15h3"></path>
              </svg>
            </div>
            <div>
              <b>US dollars, via Razorpay</b>
              <span>
                No GST or other tax is added today. When that changes, you get an email before your next renewal.
              </span>
            </div>
          </div>
          <div className="gd-fact">
            <div className="gd-ic">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 17l6-6 4 4 8-8"></path>
                <path d="M15 7h6v6"></path>
              </svg>
            </div>
            <div>
              <b>Upgrade any time</b>
              <span>Billing shows the new price with your unused credit taken off, before you pay.</span>
            </div>
          </div>
          <div className="gd-fact">
            <div className="gd-ic">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M6 6l12 12M18 6L6 18"></path>
              </svg>
            </div>
            <div>
              <b>Cancel any time</b>
              <span>Your plan keeps working until the end of the period you paid for. Nothing renews after that.</span>
            </div>
          </div>
        </div>
      </section>
      <section
        style={{ background: "var(--bg)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}
      >
        <div
          style={{
            maxWidth: "1160px",
            margin: "0 auto",
            padding: "88px 24px",
            display: "flex",
            flexWrap: "wrap",
            gap: "40px 64px",
            alignItems: "flex-start",
          }}
        >
          <div style={{ flex: "1 1 280px", maxWidth: "360px" }}>
            <div className="gd-eyebrow">Questions</div>
            <h2 className="gd-h2">Pricing, answered.</h2>
            <p className="gd-lead">
              More in the <Link href="/faq">full FAQ</Link> and the <Link href="/refund">Refund Policy</Link>.
            </p>
          </div>
          <div style={{ flex: "999 1 600px", minWidth: "0" }}>
            <FaqSection items={faqs} className="" />
          </div>
        </div>
      </section>
      <section
        style={{
          maxWidth: "1160px",
          margin: "0 auto",
          padding: "80px 24px 48px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "28px",
        }}
      >
        <div style={{ maxWidth: "620px" }}>
          <h2 className="gd-h2" style={{ margin: "0" }}>
            Start on any plan. Change it any time.
          </h2>
          <p className="gd-lead">Connect your inbox and launch your first campaign today.</p>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
          <a
            href="#plans"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              height: "50px",
              padding: "0 24px",
              borderRadius: "999px",
              background: "linear-gradient(180deg, #29d68f, #00c27a)",
              color: "#06231a",
              fontSize: "15px",
              fontWeight: "800",
              boxShadow: "var(--sh-green)",
            }}
          >
            Choose a plan
          </a>
          <Link
            href="/contact"
            style={{
              display: "inline-flex",
              alignItems: "center",
              height: "50px",
              padding: "0 24px",
              borderRadius: "999px",
              background: "#fff",
              border: "1px solid var(--line)",
              color: "var(--ink)",
              fontSize: "15px",
              fontWeight: "800",
            }}
          >
            Book a demo
          </Link>
        </div>
      </section>
      <PublicFooter />
      <BreadcrumbSchema trail={[{ name: "Pricing", path: "/pricing" }]} />
    </div>
  );
}
