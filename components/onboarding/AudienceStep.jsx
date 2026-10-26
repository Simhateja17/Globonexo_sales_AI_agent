"use client";
import React, { useState } from "react";
import Icon from "../ui/Icon";
import { Live, TokenInput, boldMatch } from "./ui";
import { suggestAudience } from "../../lib/onboarding-suggestions";
import {
  CITY_NAMES, COMPANY_SIZES, COUNTRY_CITIES, INDUSTRIES, INDUSTRY_GROUPS, PLACES, POPULAR_CITIES, POPULAR_COUNTRIES, REGIONS, ROLES,
} from "../../lib/onboarding-data";
import { audienceSentence, capitalize, hasEmail, hasVoice, sizeSummary, stepsFor } from "../../lib/onboarding-flow";

function searchPlaces(q) {
  const query = q.toLowerCase();
  return PLACES
    .filter(p => p.label.toLowerCase().includes(query))
    .sort((a, b) => Number(!a.label.toLowerCase().startsWith(query)) - Number(!b.label.toLowerCase().startsWith(query)))
    .slice(0, 6);
}

function searchTitles(q) {
  const query = q.toLowerCase();
  return ROLES.filter(r => r.toLowerCase().includes(query)).slice(0, 6).map(r => ({ value: r, label: r }));
}

/**
 * Region -> country -> city. Picking a region only opens its countries and
 * picking a country only opens its cities; nothing is added in bulk unless
 * asked. Any single country or city is enough to continue.
 */
function LocationBrowser({ geos, onToggle, onAddMany }) {
  const [region, setRegion] = useState(null);
  const [country, setCountry] = useState(null);
  const open = REGIONS.find(r => r.label === region);
  const shownCountry = open && (open.places.includes(country) ? country : open.places.find(p => COUNTRY_CITIES[p]));
  const cities = shownCountry ? COUNTRY_CITIES[shownCountry] || [] : [];
  const chip = (place, onClick = () => onToggle(place)) => {
    const on = geos.includes(place);
    return (
      <button type="button" key={place} className={`chip xs ${on ? "on" : "more"}`} aria-pressed={on} onClick={onClick}>
        {on ? <Icon name="check" size={13} stroke={2.6} /> : "+ "}{place}
      </button>
    );
  };
  return (
    <>
      <div className="sub" style={{ marginTop: 4 }}>Browse by region</div>
      <div className="chips">
        {REGIONS.map(r => {
          const picked = r.places.filter(p => geos.includes(p) || (COUNTRY_CITIES[p] || []).some(c => geos.includes(c))).length;
          const on = region === r.label;
          return (
            <button type="button" key={r.label} className={`chip xs ${on ? "on" : ""}`} aria-expanded={on}
              onClick={() => { setRegion(on ? null : r.label); setCountry(null); }}>
              {r.label}{picked > 0 && <span className="tag" style={{ height: 20, marginLeft: 2 }}>{picked}</span>}
              <Icon name="chevronDown" size={14} stroke={2.2} style={{ transform: on ? "rotate(180deg)" : "none" }} />
            </button>
          );
        })}
      </div>

      {open ? (
        <div className="cus">
          <div className="lbl sm">Countries in {open.label} <small>Pick any. Tap a country to see its cities.</small></div>
          <div className="chips">
            {open.places.map(place => chip(place, () => { onToggle(place); setCountry(place); }))}
            {open.places.some(p => !geos.includes(p)) && (
              <button type="button" className="mini" onClick={() => onAddMany(open.places)}>Add all {open.places.length}</button>
            )}
          </div>
          {cities.length > 0 && (
            <>
              <div className="lbl sm" style={{ marginTop: 6 }}>
                <span>Cities in {shownCountry}</span>
                {open.places.filter(p => COUNTRY_CITIES[p]).length > 1 && (
                  <span className="chips" style={{ gap: 4 }}>
                    {open.places.filter(p => COUNTRY_CITIES[p]).map(p => (
                      <button type="button" key={p} className={`mini ${p === shownCountry ? "p" : ""}`} style={{ minHeight: 28, padding: "0 10px" }} onClick={() => setCountry(p)}>{p}</button>
                    ))}
                  </span>
                )}
              </div>
              <div className="chips">{cities.map(c => chip(c))}</div>
              <span className="hint">Picking a city targets just that city. You don&apos;t need to pick the country too.</span>
            </>
          )}
        </div>
      ) : (
        <>
          <div className="sub" style={{ marginTop: 4 }}>Popular cities</div>
          <div className="chips">{POPULAR_CITIES.filter(c => !geos.includes(c)).map(c => chip(c))}</div>
          <div className="sub" style={{ marginTop: 4 }}>Popular countries</div>
          <div className="chips">{POPULAR_COUNTRIES.filter(c => !geos.includes(c)).map(c => chip(c))}</div>
        </>
      )}
    </>
  );
}

function IndustryPicker({ value, onChange }) {
  const firstWithPick = INDUSTRY_GROUPS.find(g => g.items.some(i => value.includes(i)));
  const [cat, setCat] = useState((firstWithPick || INDUSTRY_GROUPS[0]).label);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(value.length === 0);
  const query = q.trim().toLowerCase();
  const list = query ? INDUSTRIES.filter(i => i.includes(query)).slice(0, 40) : (INDUSTRY_GROUPS.find(g => g.label === cat) || INDUSTRY_GROUPS[0]).items;
  const toggle = i => onChange(value.includes(i) ? value.filter(x => x !== i) : [...value, i]);
  const picked = value.length ? value.map(capitalize).join(", ") : "None yet";

  if (!open) {
    return (
      <div className="pk-closed">
        <span className="hint">Picked: <b style={{ color: "#0a1712" }}>{picked}</b></span>
        <button type="button" className="mini" onClick={() => setOpen(true)}>Change</button>
      </div>
    );
  }
  return (
    <div className="picker">
      <div className="pk-top">
        <label className="pk-search"><Icon name="search" size={16} stroke={2} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder={`Search all ${INDUSTRIES.length} industries`} aria-label="Search industries"
            onKeyDown={e => { if (e.key === "Enter") e.preventDefault(); }} />
        </label>
        <button type="button" className="mini" onClick={() => onChange([])} disabled={!value.length}>Clear</button>
      </div>
      <div className="pk-body">
        {!query && (
          <div className="pk-cats" role="tablist" aria-label="Industry groups">
            {INDUSTRY_GROUPS.map(g => {
              const n = g.items.filter(i => value.includes(i)).length;
              return (
                <button type="button" role="tab" key={g.label} aria-selected={cat === g.label} className={cat === g.label ? "on" : ""} onClick={() => setCat(g.label)}>
                  {g.label}{n > 0 && <em>{n}</em>}
                </button>
              );
            })}
          </div>
        )}
        <div className="pk-list">
          {list.length === 0 && <span className="hint" style={{ padding: 8 }}>No industries match “{q.trim()}”.</span>}
          {list.map(i => {
            const on = value.includes(i);
            return (
              <button type="button" key={i} className={`ck ${on ? "on" : ""}`} aria-pressed={on} onClick={() => toggle(i)}>
                <span className="box"><Icon name="check" size={11} stroke={3.4} color="#fff" /></span><span className="cap">{i}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="pk-foot">
        <span className="hint">Picked: <b style={{ color: "#0a1712" }}>{picked}</b></span>
        <button type="button" className="mini p" onClick={() => { setOpen(false); setQ(""); }}>Done</button>
      </div>
    </div>
  );
}

export default function AudienceStep({ d, set, footer }) {
  const agent = d.agentName.trim() || "Nexo";
  const steps = stepsFor(d.channels);
  const [showDeal, setShowDeal] = useState(!!(d.dealSize || d.salesCycle));
  const suggestion = suggestAudience(d.industry);
  const moreTitles = suggestion.alsoTitles.filter(t => !d.titles.includes(t));
  const addGeo = g => !d.geos.includes(g) && set("geos", [...d.geos, g]);
  const addGeos = list => set("geos", Array.from(new Set([...d.geos, ...list])));
  const toggleGeo = g => set("geos", d.geos.includes(g) ? d.geos.filter(x => x !== g) : [...d.geos, g]);
  const toggleSize = key => set("companySizes", d.companySizes.includes(key) ? d.companySizes.filter(k => k !== key) : [...d.companySizes, key]);
  const mailOn = hasEmail(d.channels);
  const call = hasVoice(d.channels);

  return (
    <main className="wrap">
      <section className="form">
        <div>
          <div className="eyebrow">Step 3 of {steps.length} · used for {mailOn && call ? "emails and calls" : mailOn ? "emails" : "calls"}</div>
          <h1 className="h1">Who should {agent} reach out to?</h1>
          <p className="lede">We ticked the usual buyers for {(d.industry || "your").toLowerCase()} companies. Keep them, swap them, or add your own. The sentence on the right shows exactly who {agent} will look for.</p>
        </div>

        <div className="card">
          <div className="lbl">Job titles <small>Type any title, or pick from suggestions</small></div>
          <TokenInput values={d.titles} label="Add a job title" placeholder="Add a title, e.g. Finance Manager" suggest={searchTitles}
            onAdd={t => set("titles", [...d.titles, t].slice(0, 20))} onRemove={t => set("titles", d.titles.filter(x => x !== t))} />
          {moreTitles.length > 0 && (
            <div className="chips">
              <span className="hint b">Also common:</span>
              {moreTitles.map(t => <button type="button" key={t} className="chip sm more" onClick={() => set("titles", [...d.titles, t].slice(0, 20))}>+ {t}</button>)}
            </div>
          )}
        </div>

        <div className="card">
          <div className="lbl">Industries to target <small>{d.targetIndustries.length ? `${d.targetIndustries.length} selected` : "Optional. Leave empty for any industry"}</small></div>
          <IndustryPicker value={d.targetIndustries} onChange={v => set("targetIndustries", v)} />
        </div>

        <div className="card">
          <div className="lbl">Company size <small>Pick any that fit</small></div>
          <div className="sizes" role="group" aria-label="Company size">
            {COMPANY_SIZES.map(s => {
              const on = d.companySizes.includes(s.key);
              return <button type="button" key={s.key} className={`sz ${on ? "on" : ""}`} aria-pressed={on} onClick={() => toggleSize(s.key)}>{s.label}<span>{s.sub}</span></button>;
            })}
          </div>
        </div>

        <div className="card">
          <div className="lbl">Where are they? <small>Search any country, state or city</small></div>
          <TokenInput values={d.geos} label="Add a location" placeholder="Type a country, state or city" suggest={searchPlaces}
            tokenIcon={g => (CITY_NAMES.has(g) ? "pin" : null)} highlight={boldMatch}
            onAdd={addGeo} onRemove={g => set("geos", d.geos.filter(x => x !== g))} />
          <LocationBrowser geos={d.geos} onToggle={toggleGeo} onAddMany={addGeos} />
          {d.geos.length > 0 && <button type="button" className="mini" style={{ alignSelf: "flex-start" }} onClick={() => set("geos", [])}>Clear all locations</button>}
        </div>

        {showDeal ? (
          <div className="card">
            <div className="lbl">Deal size and sales cycle <small>Optional. Helps {agent} pace follow-ups.</small></div>
            <div className="row2">
              <div className="fld">
                <span className="lbl sm">Typical deal size</span>
                <div className="chips">{["Under $5k", "$5k-$20k", "$20k-$50k", "$50k-$100k", "$100k+"].map(o => (
                  <button type="button" key={o} className={`chip xs ${d.dealSize === o ? "on" : ""}`} aria-pressed={d.dealSize === o} onClick={() => set("dealSize", d.dealSize === o ? "" : o)}>{o}</button>))}</div>
              </div>
              <div className="fld">
                <span className="lbl sm">Typical sales cycle</span>
                <div className="chips">{["Under 2 weeks", "2-4 weeks", "1-3 months", "3-6 months", "6+ months"].map(o => (
                  <button type="button" key={o} className={`chip xs ${d.salesCycle === o ? "on" : ""}`} aria-pressed={d.salesCycle === o} onClick={() => set("salesCycle", d.salesCycle === o ? "" : o)}>{o}</button>))}</div>
              </div>
            </div>
          </div>
        ) : (
          <button type="button" className="opt" onClick={() => setShowDeal(true)}>
            <span>Deal size and sales cycle<small>Optional. Helps {agent} pace follow-ups. You can add this later in Settings.</small></span>
            <Icon name="plus" size={18} stroke={2.2} />
          </button>
        )}

        {footer}
      </section>

      <aside className="side">
        <div className="pv">
          <div className="pv-h">Who {agent} will look for<Live /></div>
          <div className="pv-b">
            <p className="sent"><AudienceText d={d} /></p>
            <div>
              <div className="kv"><span>Titles</span><b>{d.titles.length}</b></div>
              <div className="kv"><span>Industries</span><b>{d.targetIndustries.length || "Any"}</b></div>
              <div className="kv"><span>Company size</span><b>{sizeSummary(d.companySizes)}</b></div>
              <div className="kv"><span>Locations</span><b>{d.geos.length}</b></div>
            </div>
            <div className="callnote">
              <Icon name={call ? "phone" : "mail"} size={16} color="#088256" stroke={2} style={{ flex: "none", marginTop: 2 }} />
              <span>{call && mailOn ? <><b>For calls</b>, {agent} only picks people with a verified phone number. For emails, a verified email address.</>
                : call ? <>{agent} only picks people with a verified phone number.</> : <>{agent} only picks people with a verified email address.</>}</span>
            </div>
          </div>
        </div>
        <div className="dark"><b>Start narrow, widen later</b><p>A tight audience gets more replies. {agent} finds your first leads from this, and you can change it per campaign anytime.</p></div>
      </aside>
    </main>
  );
}

function AudienceText({ d }) {
  return audienceSentence(d).map((p, i) => (p.mark ? <span key={i} className="mk flat">{p.text}</span> : <React.Fragment key={i}>{p.text}</React.Fragment>));
}

