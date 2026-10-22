"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import api from "../../../lib/api";
import { leadPhoto } from "../../../lib/lead-photo";
import Icon from "../../../components/ui/Icon";
import Avatar from "../../../components/ui/Avatar";
import Spinner from "../../../components/ui/Spinner";
import EmptyState from "../../../components/ui/EmptyState";
import StateNote from "../../../components/ui/StateNote";
import { useConfirm } from "../../../components/ui/ConfirmDialog";
import LeadDetailModal, {
  SOURCE_LABELS,
  STAGE_LABELS,
  STOPPED_STATUSES,
  formatNextOutreach,
  leadName,
  safeExternalUrl,
  stageStyle,
} from "../../../components/leads/LeadDetailModal";
import { cleanText, isValidEmail } from "../../../lib/validation";
import { FREE_PLAN, isFreePlan, useOrg } from "../../../lib/free-plan";
import UpgradeModal from "../../../components/billing/UpgradeModal";
import {
  audienceDefaultsFromOnboarding,
  normalizeApolloLocations,
  uniqueApolloValues,
} from "../../../lib/apollo-targeting";

const COMPANY_SIZE_OPTIONS = ["1,10", "11,50", "51,200", "201,500", "501,1000", "1001,5000", "5001,10000", "10001,"];
const TITLE_OPTIONS = ["Founder", "Co-Founder", "Owner", "CEO", "Chief Revenue Officer", "Chief Sales Officer", "VP Sales", "VP Revenue", "Head of Sales", "Head of Revenue", "Sales Director", "Revenue Operations Director"];
const LOCATION_OPTIONS = ["United States", "United Kingdom", "Canada", "Australia", "India", "Germany", "France", "Netherlands", "Singapore", "United Arab Emirates"];
const SENIORITY_OPTIONS = [
  { value: "owner", label: "Owner" }, { value: "founder", label: "Founder" },
  { value: "c_suite", label: "C-Suite" }, { value: "partner", label: "Partner" },
  { value: "vp", label: "VP" }, { value: "head", label: "Head" },
  { value: "director", label: "Director" }, { value: "manager", label: "Manager" },
  { value: "senior", label: "Senior" }, { value: "entry", label: "Entry" },
  { value: "intern", label: "Intern" },
];
const TECHNOLOGY_OPTIONS = [
  { value: "salesforce", label: "Salesforce" }, { value: "hubspot", label: "HubSpot" },
  { value: "marketo", label: "Marketo" }, { value: "outreach", label: "Outreach" },
  { value: "salesloft", label: "Salesloft" }, { value: "intercom", label: "Intercom" },
  { value: "stripe", label: "Stripe" }, { value: "shopify", label: "Shopify" },
];
const INDUSTRY_OPTIONS = ["B2B SaaS", "IT Services", "Marketing Agencies", "Recruiting", "Fintech", "Healthcare", "Manufacturing", "Real Estate", "E-commerce", "Education"];
const STAGE_OPTIONS = ["all", "new", "queued", "contacted", "engaged", "meeting_booked", "not_interested", "unsubscribed"];
const SOURCE_OPTIONS = ["all", "apollo", "csv", "manual"];
const LEADS_PER_PAGE = 25;

const SORT_OPTIONS = [
  { value: "created_desc", label: "Newest" },
  { value: "created_asc", label: "Oldest" },
  { value: "score_desc", label: "Score high-low" },
  { value: "score_asc", label: "Score low-high" },
  { value: "name_asc", label: "Name A-Z" },
  { value: "company_asc", label: "Company A-Z" },
];
const TIMEZONES = [
  "Asia/Kolkata",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Toronto",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Dubai",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
];
const DEFAULT_MANUAL_LEAD = {
  firstName: "",
  lastName: "",
  title: "",
  company: "",
  email: "",
  phone: "",
  location: "",
  timezone: "Asia/Kolkata",
  linkedinUrl: "",
  promptNotes: "",
};

function splitList(value) {
  return value.split(",").map(item => item.trim()).filter(Boolean);
}

function MultiSelect({ label, options, value, onChange, placeholder, required = false }) {
  const selectedLabels = options.filter(option => value.includes(typeof option === "string" ? option : option.value))
    .map(option => typeof option === "string" ? option : option.label);
  return (
    <label className="field apollo-filter-field">
      <span>{label}{required ? " *" : ""}</span>
      <details className="apollo-multiselect">
        <summary>{selectedLabels.length ? `${selectedLabels.slice(0, 2).join(", ")}${selectedLabels.length > 2 ? ` +${selectedLabels.length - 2}` : ""}` : placeholder}</summary>
        <div className="apollo-option-menu">
          {options.map(option => {
            const optionValue = typeof option === "string" ? option : option.value;
            const optionLabel = typeof option === "string" ? option : option.label;
            return (
              <label key={optionValue} className="apollo-option">
                <input type="checkbox" checked={value.includes(optionValue)} onChange={() => onChange(value.includes(optionValue) ? value.filter(item => item !== optionValue) : [...value, optionValue])} />
                <span>{optionLabel}</span>
              </label>
            );
          })}
          {value.length ? <button type="button" className="apollo-clear" onClick={() => onChange([])}>Clear selection</button> : null}
        </div>
      </details>
    </label>
  );
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (char === '"' && quoted && next === '"') {
      cell += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(cell.trim());
      cell = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  row.push(cell.trim());
  if (row.some(Boolean)) rows.push(row);
  return rows;
}

function normalizeHeader(value) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function getValue(row, headerMap, candidates) {
  const key = candidates.map(normalizeHeader).find(candidate => headerMap[candidate] !== undefined);
  return key ? row[headerMap[key]] || "" : "";
}

function csvToLeads(text) {
  const rows = parseCsv(text);
  if (rows.length < 2) return [];
  const headers = rows[0];
  const headerMap = Object.fromEntries(headers.map((header, index) => [normalizeHeader(header), index]));

  return rows.slice(1).map(row => {
    const email = cleanText(getValue(row, headerMap, ["email", "work email"]), { max: 254 }).toLowerCase();
    return {
      firstName: cleanText(getValue(row, headerMap, ["first name", "firstname", "first"]), { max: 80 }),
      lastName: cleanText(getValue(row, headerMap, ["last name", "lastname", "last"]), { max: 80 }),
      name: cleanText(getValue(row, headerMap, ["name", "full name", "fullname"]), { max: 160 }),
      title: cleanText(getValue(row, headerMap, ["title", "job title", "role"]), { max: 160 }),
      company: cleanText(getValue(row, headerMap, ["company", "organization", "account"]), { max: 160 }),
      email: isValidEmail(email) ? email : "",
      phone: cleanText(getValue(row, headerMap, ["phone", "mobile", "phone number"]), { max: 40 }),
      location: cleanText(getValue(row, headerMap, ["location", "city", "geo"]), { max: 160 }),
      linkedinUrl: safeExternalUrl(getValue(row, headerMap, ["linkedin", "linkedin url", "linkedinurl"])),
      rawData: Object.fromEntries(headers.map((header, index) => [
        cleanText(header, { max: 120 }),
        cleanText(row[index] || "", { max: 500, multiline: true }),
      ])),
    };
  }).filter(lead => lead.name || lead.firstName || lead.lastName || lead.email || lead.company);
}

function readiness(lead) {
  const status = lead.status || "new";
  if (STOPPED_STATUSES.has(status)) return { label: "Stopped", cls: "pl-mute" };
  const hasEmail = isValidEmail(lead.email);
  if (hasEmail && lead.phone) return { label: "Email + voice", cls: "pl-ok" };
  if (hasEmail) return { label: "Email ready", cls: "pl-ok" };
  if (lead.phone) return { label: "Voice ready", cls: "pl-info" };
  return { label: "Not ready", cls: "pl-warn" };
}

function LeadRow({ lead, onSelect, selected }) {
  const name = leadName(lead);
  const photo = leadPhoto(lead);
  const score = lead.score ?? 0;
  const status = lead.status || "new";
  const ready = readiness(lead);

  return (
    <tr
      className={selected ? "sel" : score >= 80 ? "hot" : ""}
      onClick={() => onSelect(lead.id)}
      tabIndex={0}
      aria-selected={selected}
      onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSelect(lead.id); } }}
    >
      <td>
        <div className="who">
          <Avatar name={name} size={34} src={photo} />
          <div style={{ minWidth: 0 }}>
            <b className="ellip">{name}</b>
            <small className="ellip">{lead.title || "No title"} · {lead.company || "No company"}</small>
          </div>
        </div>
      </td>
      <td><span className="pl" style={{ ...stageStyle(status), border: 0 }}>{STAGE_LABELS[status] || status}</span></td>
      <td><span className={`pl ${ready.cls}`}>{ready.label}</span></td>
      <td>
        <div className="score"><i><u style={{ width: `${Math.min(100, score)}%` }} /></i><b>{score}</b></div>
      </td>
      <td className="ellip">{formatNextOutreach(lead.nextOutreach)}</td>
    </tr>
  );
}

function LeadPreview({ lead, onOpen, onSendNow, onDelete, sending }) {
  const name = leadName(lead);
  const status = lead.status || "new";
  const ready = readiness(lead);
  const safeEmail = isValidEmail(lead.email) ? lead.email : "";
  const safeLinkedIn = safeExternalUrl(lead.linkedinUrl);
  const canSendNow = Boolean(safeEmail) && !STOPPED_STATUSES.has(status) && Boolean(lead.campaignId) && status !== "contacted";

  return (
    <aside className="card pv">
      <div className="pv-top">
        <div className="pv-id">
          <Avatar name={name} size={52} src={leadPhoto(lead)} />
          <div style={{ minWidth: 0 }}>
            <b>{name}</b>
            <small>{[lead.title, lead.company].filter(Boolean).join(" · ") || "No title"}</small>
          </div>
          {safeLinkedIn ? (
            <a className="ibt" style={{ marginLeft: "auto" }} href={safeLinkedIn} target="_blank" rel="noreferrer" aria-label="Open LinkedIn"><Icon name="link" size={15} /></a>
          ) : null}
        </div>
        <div className="pv-tags">
          <span className="pl" style={{ ...stageStyle(status), border: 0 }}>{STAGE_LABELS[status] || status}</span>
          <span className={`pl ${ready.cls}`}>{ready.label}</span>
          <span className="pl pl-dark">Score {lead.score ?? 0}</span>
        </div>
      </div>
      <div className="pv-sec">
        <div className="pv-h">Contact</div>
        <div className="kv"><span>Email</span><b className="ellip">{lead.email || "Not revealed"}</b></div>
        <div className="kv"><span>Phone</span><b>{lead.phone || "Not revealed"}</b></div>
        <div className="kv"><span>Location</span><b>{lead.location || "Unknown"}</b></div>
        <div className="kv"><span>Source</span><b>{SOURCE_LABELS[lead.source] || lead.source || "Manual"}</b></div>
      </div>
      <div className="pv-sec">
        <div className="pv-h">Next step</div>
        <div className="tl">
          <div><i /><b>{formatNextOutreach(lead.nextOutreach)}</b><span>{lead.campaignId ? "Attached to a campaign" : "Not in a campaign yet"}</span></div>
        </div>
      </div>
      <div className="pv-acts">
        <Link className="bt bt-g" href={`/prospects/${lead.id}`}>Full profile</Link>
        <button
          type="button"
          className="bt bt-p"
          disabled={!canSendNow || sending}
          onClick={() => onSendNow(lead.id)}
          title={!safeEmail ? "Lead needs an email" : !lead.campaignId ? "Attach lead to an email campaign first" : status === "contacted" ? "Step 1 has already been sent" : STOPPED_STATUSES.has(status) ? "Sequence is stopped for this lead" : "Send campaign email now"}
        >
          <Icon name="send" size={14} color="#06231a" /> {sending ? "Sending..." : "Send now"}
        </button>
      </div>
      <div style={{ padding: "0 20px 16px", display: "flex", gap: 8 }}>
        {safeEmail ? <a className="lnk" href={`mailto:${safeEmail}`}><Icon name="mail" size={14} /> Email</a> : null}
        <button type="button" className="lnk" style={{ marginLeft: "auto", color: "#b42318" }} onClick={() => onDelete(lead.id)}>Delete lead</button>
      </div>
    </aside>
  );
}

export default function ProspectsPage() {
  const confirm = useConfirm();
  const freePlan = isFreePlan(useOrg());
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [tab, setTab] = useState("table");
  const [campaigns, setCampaigns] = useState([]);
  const [campaignId, setCampaignId] = useState("");
  const [titles, setTitles] = useState(["VP Sales", "Head of Revenue"]);
  const [customTitles, setCustomTitles] = useState("");
  const [seniorities, setSeniorities] = useState(["vp", "head"]);
  const [locations, setLocations] = useState(["United States"]);
  const [customLocations, setCustomLocations] = useState("");
  const [organizationLocations, setOrganizationLocations] = useState([]);
  const [companySizes, setCompanySizes] = useState(["51,200", "201,500"]);
  const [industries, setIndustries] = useState([]);
  const [customIndustries, setCustomIndustries] = useState("");
  const [keywords, setKeywords] = useState("");
  const [keywordSuggestions, setKeywordSuggestions] = useState([]);
  const [domains, setDomains] = useState("");
  const [technologies, setTechnologies] = useState([]);
  const [hiringTitles, setHiringTitles] = useState("");
  const [includeSimilarTitles, setIncludeSimilarTitles] = useState(true);
  const [revenueMin, setRevenueMin] = useState("");
  const [revenueMax, setRevenueMax] = useState("");
  const [leadLimit, setLeadLimit] = useState(25);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [leads, setLeads] = useState([]);
  const [csvLeads, setCsvLeads] = useState([]);
  const [leadLoading, setLeadLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [enrichingId, setEnrichingId] = useState("");
  const [sendingId, setSendingId] = useState("");
  const [bulkEnriching, setBulkEnriching] = useState(false);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created_desc");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [summary, setSummary] = useState(null);
  const leadRequest = useRef(0);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [manualLead, setManualLead] = useState(DEFAULT_MANUAL_LEAD);
  const [manualLoading, setManualLoading] = useState(false);
  const [importProgress, setImportProgress] = useState(null);
  const [detailLeadId, setDetailLeadId] = useState("");
  const [voiceConfirmed, setVoiceConfirmed] = useState(false);
  const [voiceLegalBasis, setVoiceLegalBasis] = useState("legitimate_interest");
  const selectedCampaign = campaigns.find(campaign => campaign.id === campaignId);
  const selectedVoiceCampaign = selectedCampaign?.channel === "voice";

  // One page at a time: search, filters and sort run in the backend query, so
  // a workspace with thousands of leads loads as fast as one with ten.
  const loadPage = () => {
    const request = ++leadRequest.current;
    setLeadLoading(true);
    api.get("/leads", {
      params: {
        page,
        perPage: LEADS_PER_PAGE,
        sort: sortBy,
        search: query || undefined,
        status: stageFilter === "all" ? undefined : stageFilter,
        source: sourceFilter === "all" ? undefined : sourceFilter,
      },
    })
      .then(({ data }) => {
        if (request !== leadRequest.current) return;
        const items = Array.isArray(data?.items) ? data.items : [];
        const count = Number(data?.pagination?.total ?? items.length);
        // A delete can empty the last page; step back instead of showing nothing.
        if (items.length === 0 && page > 1 && count > 0) {
          setPage(Math.max(1, Math.ceil(count / LEADS_PER_PAGE)));
          return;
        }
        setLeads(items);
        setTotal(count);
      })
      .catch(() => {
        if (request !== leadRequest.current) return;
        setLeads([]);
        setTotal(0);
        setError("Prospects could not be loaded.");
      })
      .finally(() => {
        if (request === leadRequest.current) setLeadLoading(false);
      });
  };

  // Header counts cover every lead, not just this page.
  const loadSummary = () => {
    api.get("/leads/summary")
      .then(({ data }) => setSummary(data && typeof data.total === "number" ? data : null))
      .catch(() => setSummary(null));
  };

  const refreshLeads = () => {
    loadPage();
    loadSummary();
  };

  useEffect(() => { loadPage(); }, [page, query, stageFilter, sourceFilter, sortBy]);
  useEffect(() => { loadSummary(); }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const next = search.trim();
      if (next !== query) {
        setQuery(next);
        setPage(1);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search, query]);

  const filterBy = setter => value => { setter(value); setPage(1); };
  const clearFilters = () => { setSearch(""); setQuery(""); setStageFilter("all"); setSourceFilter("all"); setPage(1); };

  useEffect(() => {
    Promise.allSettled([api.get("/campaigns"), api.get("/onboarding")])
      .then(([campaignResult, onboardingResult]) => {
        if (campaignResult.status === "fulfilled") setCampaigns(Array.isArray(campaignResult.value.data?.items) ? campaignResult.value.data.items : []);
        else setCampaigns([]);
        if (onboardingResult.status === "fulfilled" && onboardingResult.value.data) {
          const defaults = audienceDefaultsFromOnboarding(onboardingResult.value.data);
          if (defaults.titles.length) setTitles(defaults.titles);
          if (defaults.locations.length) setLocations(defaults.locations);
          if (defaults.companySizes.length) setCompanySizes(defaults.companySizes);
          setIndustries(defaults.industries);
          if (defaults.seniorities.length) setSeniorities(defaults.seniorities);
          setKeywordSuggestions(defaults.keywordSuggestions);
          setKeywords(defaults.keywords);
        }
      });
    try {
      const saved = JSON.parse(window.localStorage.getItem("gnx-active-apollo-import") || "null");
      if (saved?.runId) {
        setImportProgress(saved);
        if (saved.campaignId) setCampaignId(saved.campaignId);
      }
    } catch {}
  }, []);

  // The backend already filtered and sorted this page.
  const filteredLeads = leads;
  const hasFilters = Boolean(query || stageFilter !== "all" || sourceFilter !== "all");
  const leadCount = summary?.total ?? (hasFilters ? 0 : total);
  // Without the summary only the total is known; the other counts show a dash.
  const metrics = summary || { total: leadCount, hot: "–", meetings: "–", revealed: "–" };
  const pageCount = Math.max(1, Math.ceil(total / LEADS_PER_PAGE));
  const firstShown = total === 0 ? 0 : (page - 1) * LEADS_PER_PAGE + 1;
  const lastShown = Math.min(total, (page - 1) * LEADS_PER_PAGE + leads.length);

  const detailLead = useMemo(() => leads.find(lead => lead.id === detailLeadId) || null, [leads, detailLeadId]);
  const [selectedLeadId, setSelectedLeadId] = useState("");
  const previewLead = filteredLeads.find(lead => lead.id === selectedLeadId) || filteredLeads[0] || null;

  const canSearch = useMemo(() => Boolean(campaignId)
    && (titles.length > 0 || customTitles.trim())
    && (locations.length > 0 || customLocations.trim())
    && companySizes.length > 0
    && (industries.length > 0 || customIndustries.trim()), [campaignId, titles, customTitles, locations, customLocations, companySizes, industries, customIndustries]);
  const revealableLeads = useMemo(
    () => filteredLeads.filter(lead => lead.source === "apollo" && !lead.email),
    [filteredLeads]
  );
  const toggleSize = size => setCompanySizes(current => current.includes(size) ? current.filter(item => item !== size) : [...current, size]);

  const showImportedLeads = () => {
    setTab("table");
    setSourceFilter("apollo");
    setStageFilter("all");
    setSortBy("created_desc");
    setSearch("");
    setQuery("");
    setPage(1);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const runApolloSearch = async event => {
    event.preventDefault();
    if (!canSearch) return;
    setLoading(true);
    setError("");
    setNotice("");
    try {
      const { data } = await api.post("/apollo/import", {
        campaignId,
        titles: [...new Set([...titles, ...splitList(customTitles)])],
        includeSimilarTitles,
        seniorities,
        locations: normalizeApolloLocations([...locations, ...splitList(customLocations)]),
        organizationLocations,
        organizationDomains: splitList(domains),
        companySizes,
        industries: uniqueApolloValues([...industries, ...splitList(customIndustries)]),
        technologyUids: technologies,
        hiringJobTitles: splitList(hiringTitles),
        revenueMin: revenueMin === "" ? undefined : Number(revenueMin),
        revenueMax: revenueMax === "" ? undefined : Number(revenueMax),
        keywords,
        limit: leadLimit,
        candidateCap: Math.min(500, Math.max(50, leadLimit * 5)),
      });
      const activeImport = { runId: data.runId, campaignId, status: "queued", requested: leadLimit, qualified: 0 };
      setImportProgress(activeImport);
      window.localStorage.setItem("gnx-active-apollo-import", JSON.stringify(activeImport));
      setNotice(`Lead import queued${data?.jobId ? ` as job ${data.jobId}` : ""}. Search, enrichment, and campaign checks will continue in the background.`);
    } catch (err) {
      setError(err?.response?.data?.error || "Lead import could not be started. Check the filters and your lead database connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!importProgress?.runId || importProgress?.isTerminal) return;
    const timer = setInterval(async () => {
      try {
        const { data } = await api.get(`/apollo/import/${importProgress.runId}`);
        setImportProgress(data);
        if (data.isTerminal) {
          window.localStorage.removeItem("gnx-active-apollo-import");
          refreshLeads();
          const qualified = data.qualified ?? 0;
          if (qualified > 0) {
            setNotice(`${qualified} qualified ${qualified === 1 ? "lead is" : "leads are"} ready in your lead table.`);
            showImportedLeads();
          }
        } else {
          window.localStorage.setItem("gnx-active-apollo-import", JSON.stringify({ ...data, campaignId: data.campaignId || campaignId }));
        }
      } catch {}
    }, 2000);
    return () => clearInterval(timer);
  }, [importProgress?.runId, importProgress?.isTerminal]);

  const handleCsv = async event => {
    const file = event.target.files?.[0];
    setError("");
    setNotice("");
    setCsvLeads([]);
    if (!file) return;
    const text = await file.text();
    const rows = csvToLeads(text).slice(0, 1000);
    setCsvLeads(rows);
    setNotice(`${rows.length} rows ready to import from ${file.name}.`);
  };

  const uploadCsv = async () => {
    if (csvLeads.length === 0) return;
    setUploading(true);
    setError("");
    setNotice("");
    try {
      if (selectedVoiceCampaign && !voiceConfirmed) {
        setError("Confirm DNC screening and lawful basis before importing voice leads.");
        return;
      }
      const { data } = await api.post("/leads/csv-upload", {
        campaignId: campaignId || undefined, rows: csvLeads,
        voiceCompliance: selectedVoiceCampaign ? {
          confirmed: true, legalBasis: voiceLegalBasis, dncCheckedAt: new Date().toISOString(),
          country: locations[0] || "Unknown",
        } : undefined,
      });
      const inserted = data?.inserted ?? 0;
      const skipped = data?.skipped ?? 0;
      if (skipped > 0) {
        const reasons = (data?.errors ?? [])
          .slice(0, 3)
          .map(e => `row ${e.row}: ${e.message}`)
          .join("; ");
        const more = (data?.errors?.length ?? 0) > 3 ? "; ..." : "";
        setError(`${inserted} CSV leads imported, ${skipped} row${skipped === 1 ? "" : "s"} skipped (${reasons}${more}).`);
      } else {
        setNotice(`${inserted} CSV leads imported.`);
      }
      setCsvLeads([]);
      refreshLeads();
      setTab("table");
    } catch (err) {
      setError(err?.response?.data?.error || "CSV upload failed. Check required fields and try again.");
    } finally {
      setUploading(false);
    }
  };

  const setManualLeadField = (key, value) => {
    setManualLead(current => ({ ...current, [key]: value }));
    setError("");
    setNotice("");
  };

  const createManualLead = async event => {
    event.preventDefault();
    if (manualLoading) return;

    const firstName = cleanText(manualLead.firstName, { max: 120 });
    const lastName = cleanText(manualLead.lastName, { max: 120 });
    const title = cleanText(manualLead.title, { max: 160 });
    const company = cleanText(manualLead.company, { max: 160 });
    const email = cleanText(manualLead.email, { max: 254 }).toLowerCase();
    const phone = cleanText(manualLead.phone, { max: 80 });
    const location = cleanText(manualLead.location, { max: 160 });
    const timezone = cleanText(manualLead.timezone, { max: 80 });
    const linkedinUrl = safeExternalUrl(manualLead.linkedinUrl);
    const promptNotes = cleanText(manualLead.promptNotes, { max: 2000, multiline: true });

    setError("");
    setNotice("");

    if (!firstName && !lastName && !email && !company) {
      setError("Add a name, email, or company before saving this prospect.");
      return;
    }
    if (email && !isValidEmail(email)) {
      setError("Enter a valid email address or leave it blank.");
      return;
    }
    if (manualLead.linkedinUrl.trim() && !linkedinUrl) {
      setError("Enter a valid LinkedIn URL or leave it blank.");
      return;
    }
    if (selectedVoiceCampaign && (!phone || !voiceConfirmed)) {
      setError("Voice campaign leads require a direct/mobile phone and DNC/lawful-basis confirmation.");
      return;
    }

    setManualLoading(true);
    try {
      const { data } = await api.post("/leads", {
        campaignId: campaignId || undefined,
        source: "manual",
        firstName,
        lastName,
        name: [firstName, lastName].filter(Boolean).join(" ") || undefined,
        title,
        company,
        email,
        phone,
        location,
        timezone,
        linkedinUrl,
        promptNotes,
        voiceCompliance: selectedVoiceCampaign ? {
          confirmed: true, legalBasis: voiceLegalBasis, dncCheckedAt: new Date().toISOString(),
          country: location || "Unknown",
        } : undefined,
      });

      setManualLead(DEFAULT_MANUAL_LEAD);
      loadSummary();
      if (page === 1) loadPage();
      else setPage(1);
      setNotice(`${leadName(data)} added manually${campaignId ? " and attached to the selected campaign" : ""}.`);
      setTab("table");
    } catch (err) {
      setError(err?.response?.data?.error || "Manual prospect could not be added.");
    } finally {
      setManualLoading(false);
    }
  };

  const deleteLead = async id => {
    const lead = leads.find(item => item.id === id);
    const ok = await confirm({
      title: `Delete ${lead ? leadName(lead) : "this lead"}?`,
      body: "They are removed from Prospects and from any campaign. Nothing more is sent to them.",
      keeps: "Emails already sent and replies in Inbox.",
      confirmLabel: "Delete lead",
      danger: true,
    });
    if (!ok) return;
    try {
      await api.delete(`/leads/${id}`);
      refreshLeads();
      setNotice("Lead deleted.");
    } catch {
      setError("Lead could not be deleted.");
    }
  };

  const enrichLead = async id => {
    setEnrichingId(id);
    setError("");
    setNotice("");
    try {
      const { data } = await api.post("/leads/apollo-enrich", { leadId: id });
      setLeads(current => current.map(lead => lead.id === id ? data : lead));
      setNotice(data?.email ? "Email revealed for this lead." : "We found lead details, but no email was available on your plan.");
    } catch (err) {
      setError(err?.response?.data?.error || "Could not reveal this lead's email.");
    } finally {
      setEnrichingId("");
    }
  };

  const sendLeadNow = async id => {
    setSendingId(id);
    setError("");
    setNotice("");
    try {
      const { data } = await api.post(`/leads/${id}/send-now`);
      if (data?.lead) {
        setLeads(current => current.map(lead => lead.id === id ? data.lead : lead));
      } else {
        refreshLeads();
      }
      setNotice("Email sent to this lead.");
    } catch (err) {
      setError(err?.response?.data?.error || "Could not send this email now.");
    } finally {
      setSendingId("");
    }
  };

  const enrichVisibleLeads = async () => {
    if (revealableLeads.length === 0 || bulkEnriching) return;
    setBulkEnriching(true);
    setError("");
    setNotice("");

    let revealed = 0;
    let checked = 0;
    for (const lead of revealableLeads.slice(0, 25)) {
      try {
        const { data } = await api.post("/leads/apollo-enrich", { leadId: lead.id });
        checked += 1;
        if (data?.email) revealed += 1;
        setLeads(current => current.map(item => item.id === lead.id ? data : item));
      } catch {
        checked += 1;
      }
    }

    setNotice(`${revealed} emails revealed from ${checked} lead${checked === 1 ? "" : "s"} checked.`);
    setBulkEnriching(false);
  };

  const switchTab = value => {
    setTab(value);
    setError("");
    setNotice("");
  };

  return (
    <main className="gx">
      <div className="ph">
        <div>
          <h1>Prospects</h1>
          <p>{freePlan ? `${leadCount} of ${FREE_PLAN.maxLeads} leads on the Free plan. Bring your own leads by CSV or manual entry.` : "Source, score, filter, and prepare leads for campaigns."}</p>
        </div>
        <div className="acts" data-tour="prospects-sources">
          {tab !== "table" ? (
            <button type="button" className="bt bt-g" onClick={() => switchTab("table")}><Icon name="arrowLeft" size={15} /> All prospects</button>
          ) : null}
          <button type="button" className="bt bt-g" onClick={() => switchTab("csv")}><Icon name="doc" size={15} /> Import CSV</button>
          <button type="button" className="bt bt-g" onClick={() => switchTab("manual")}><Icon name="plus" size={15} /> Add manually</button>
          <button type="button" className="bt bt-p" onClick={() => freePlan ? setUpgradeOpen(true) : switchTab("apollo")}><Icon name="search" size={15} color="#06231a" /> Find new leads</button>
        </div>
      </div>

      {(error || notice) ? <div className={error ? "notice-warn" : "notice-good"}>{error || notice}</div> : null}

      <div className="col" style={{ gap: 16 }}>
        {tab === "table" ? (
          <>
            <div className="card" style={{ padding: "16px 20px" }}>
              <div className="minis">
                <div className="mini"><b>{metrics.total}</b><small>total prospects</small></div>
                <span className="mini-sep" />
                <div className="mini"><b style={{ color: "#c2410c" }}>{metrics.hot}</b><small>hot leads</small></div>
                <span className="mini-sep" />
                <div className="mini"><b>{metrics.meetings}</b><small>meetings set</small></div>
                <span className="mini-sep" />
                <div className="mini"><b style={{ color: "#088256" }}>{metrics.revealed}</b><small>emails revealed</small></div>
              </div>
            </div>

            <div className="pros-grid">
              <div className="card" style={{ overflow: "hidden", position: "relative" }}>
                {leadLoading && filteredLeads.length > 0 && (
                  <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,.6)", display: "grid", placeItems: "center", zIndex: 1 }}>
                    <Spinner size={22} />
                  </div>
                )}
                <div className="tools">
                  <label className="inp" style={{ width: 250 }}>
                    <Icon name="search" size={15} />
                    <input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search name, company, role…" aria-label="Search prospects" />
                  </label>
                  <select className={`chipf ${stageFilter !== "all" ? "set" : ""}`} value={stageFilter} onChange={event => filterBy(setStageFilter)(event.target.value)} aria-label="Stage">
                    {STAGE_OPTIONS.map(status => <option key={status} value={status}>{status === "all" ? "Stage" : STAGE_LABELS[status]}</option>)}
                  </select>
                  <select className={`chipf ${sourceFilter !== "all" ? "set" : ""}`} value={sourceFilter} onChange={event => filterBy(setSourceFilter)(event.target.value)} aria-label="Source">
                    {SOURCE_OPTIONS.map(source => <option key={source} value={source}>{source === "all" ? "Source" : SOURCE_LABELS[source] || source}</option>)}
                  </select>
                  <select className="chipf" style={{ marginLeft: "auto", borderStyle: "solid" }} value={sortBy} onChange={event => filterBy(setSortBy)(event.target.value)} aria-label="Sort">
                    {SORT_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                </div>

                <div className="tbl-wrap" style={{ opacity: leadLoading ? 0.5 : 1, pointerEvents: leadLoading ? "none" : "auto", transition: "opacity .15s" }}>
                  <table className="tbl" style={{ tableLayout: "fixed", minWidth: 680 }}>
                    <colgroup><col style={{ width: "36%" }} /><col style={{ width: "15%" }} /><col style={{ width: "16%" }} /><col style={{ width: "13%" }} /><col /></colgroup>
                    <thead>
                      <tr>{["Prospect", "Stage", "Readiness", "Score", "Next step"].map(header => <th key={header}>{header}</th>)}</tr>
                    </thead>
                    <tbody>
                      {leadLoading && filteredLeads.length === 0 ? (
                        Array.from({ length: 6 }, (_, index) => (
                          <tr key={`sk-${index}`} aria-hidden="true" style={{ cursor: "default" }}>
                            <td><div className="who"><span className="sk" style={{ width: 34, height: 34, borderRadius: "50%" }} /><div style={{ flex: 1 }}><span className="sk" style={{ width: "60%" }} /><span className="sk" style={{ width: "40%", marginTop: 6, height: 8 }} /></div></div></td>
                            <td><span className="sk" style={{ width: 70, height: 22, borderRadius: 99 }} /></td>
                            <td><span className="sk" style={{ width: 80, height: 22, borderRadius: 99 }} /></td>
                            <td><span className="sk" style={{ width: 60 }} /></td>
                            <td><span className="sk" style={{ width: "70%" }} /></td>
                          </tr>
                        ))
                      ) : filteredLeads.length === 0 ? (
                        <tr><td colSpan={5} style={{ height: "auto", whiteSpace: "normal" }}>
                          {!hasFilters ? (
                            <EmptyState
                              icon="users"
                              title="No leads yet"
                              text="Find buyers who fit, or bring your own list. Every lead is checked before any credits are spent."
                              actions={[
                                { label: "Import CSV", icon: "doc", onClick: () => switchTab("csv") },
                                { label: "Find new leads", icon: "search", primary: true, onClick: () => freePlan ? setUpgradeOpen(true) : switchTab("apollo") },
                              ]}
                            />
                          ) : (
                            <EmptyState
                              icon="search"
                              title="No leads match these filters"
                              text={`Try another stage or source, or remove the search term.${leadCount ? ` Your ${leadCount} lead${leadCount === 1 ? " is" : "s are"} still here.` : ""}`}
                              actions={[{ label: "Clear filters", primary: true, onClick: clearFilters }]}
                            />
                          )}
                        </td></tr>
                      ) : filteredLeads.map(lead => (
                        <LeadRow key={lead.id} lead={lead} selected={previewLead?.id === lead.id} onSelect={setSelectedLeadId} />
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="tfoot">
                  <span>{total === 0 ? "Showing 0 of 0" : `Showing ${firstShown} to ${lastShown} of ${total}`}</span>
                  {pageCount > 1 ? (
                    <div className="acts">
                      <span className="pg-of">Page {page} of {pageCount}</span>
                      <button type="button" className="bt bt-g sm" disabled={page <= 1 || leadLoading} onClick={() => setPage(current => Math.max(1, current - 1))}>Previous</button>
                      <button type="button" className="bt bt-g sm" disabled={page >= pageCount || leadLoading} onClick={() => setPage(current => Math.min(pageCount, current + 1))}>Next</button>
                    </div>
                  ) : null}
                </div>
              </div>

              {previewLead ? (
                <LeadPreview
                  lead={previewLead}
                  onOpen={setDetailLeadId}
                  onSendNow={sendLeadNow}
                  onDelete={deleteLead}
                  sending={sendingId === previewLead.id}
                />
              ) : (
                <aside className="card pv"><div className="empty">Select a prospect to see their details.</div></aside>
              )}
            </div>
          </>
        ) : tab === "manual" ? (
          <form className="card source-panel" onSubmit={createManualLead}>
            <div className="source-panel-head">
              <span><Icon name="user" size={18} /></span>
              <div>
                <h2>Add prospect manually</h2>
                <p className="faint">Create one prospect directly in your lead table.</p>
              </div>
            </div>
            <div className="form-grid">
              <label className="field"><span>First name</span><input className="input" value={manualLead.firstName} onChange={event => setManualLeadField("firstName", event.target.value)} placeholder="Priya" maxLength={120} /></label>
              <label className="field"><span>Last name</span><input className="input" value={manualLead.lastName} onChange={event => setManualLeadField("lastName", event.target.value)} placeholder="Shah" maxLength={120} /></label>
              <label className="field"><span>Email</span><input className="input" value={manualLead.email} onChange={event => setManualLeadField("email", event.target.value)} placeholder="priya@company.com" maxLength={254} /></label>
              <label className="field"><span>Phone</span><input className="input" value={manualLead.phone} onChange={event => setManualLeadField("phone", event.target.value)} placeholder="+1 555 0100" maxLength={80} /></label>
              <label className="field"><span>Company</span><input className="input" value={manualLead.company} onChange={event => setManualLeadField("company", event.target.value)} placeholder="Acme Inc." maxLength={160} /></label>
              <label className="field"><span>Title</span><input className="input" value={manualLead.title} onChange={event => setManualLeadField("title", event.target.value)} placeholder="VP Sales" maxLength={160} /></label>
              <label className="field"><span>Location</span><input className="input" value={manualLead.location} onChange={event => setManualLeadField("location", event.target.value)} placeholder="New York, NY" maxLength={160} /></label>
              <label className="field"><span>LinkedIn URL</span><input className="input" value={manualLead.linkedinUrl} onChange={event => setManualLeadField("linkedinUrl", event.target.value)} placeholder="https://linkedin.com/in/..." maxLength={500} /></label>
              <label className="field">
                <span>Timezone</span>
                <select className="input" value={manualLead.timezone} onChange={event => setManualLeadField("timezone", event.target.value)}>
                  {(TIMEZONES.includes(manualLead.timezone) ? TIMEZONES : [manualLead.timezone, ...TIMEZONES]).map(zone => (
                    <option key={zone} value={zone}>{zone}</option>
                  ))}
                </select>
              </label>
              <label className="field" style={{ gridColumn: "1 / -1" }}>
                <span>Prompt notes</span>
                <textarea
                  className="input"
                  value={manualLead.promptNotes}
                  onChange={event => setManualLeadField("promptNotes", event.target.value)}
                  placeholder="Add context the AI should consider for this prospect..."
                  maxLength={2000}
                  rows={4}
                  style={{ height: "auto", minHeight: 104, resize: "vertical", paddingTop: 12, lineHeight: 1.45 }}
                />
              </label>
              <label className="field">
                <span>Attach to campaign</span>
                <select className="input" value={campaignId} onChange={event => setCampaignId(event.target.value)}>
                  <option value="">No campaign yet</option>
                  {campaigns.map(campaign => <option key={campaign.id} value={campaign.id}>{campaign.name}</option>)}
                </select>
              </label>
              {selectedVoiceCampaign ? <div className="field" style={{ gridColumn: "1 / -1" }}>
                <span>Voice compliance *</span>
                <select className="input" value={voiceLegalBasis} onChange={event => setVoiceLegalBasis(event.target.value)}>
                  <option value="legitimate_interest">Legitimate interest</option>
                  <option value="consent">Consent</option>
                  <option value="existing_business_relationship">Existing business relationship</option>
                  <option value="other">Other lawful basis</option>
                </select>
                <label className="apollo-checkbox-row">
                  <input type="checkbox" checked={voiceConfirmed} onChange={event => setVoiceConfirmed(event.target.checked)} />
                  I confirm this direct/mobile number was checked against applicable DNC registries, has not opted out, and may lawfully be called.
                </label>
              </div> : null}
            </div>
            <div className="row spread source-actions">
              <span className="faint">Name, email, or company is required. Email and phone can be added later.</span>
              <button className="btn btn-primary btn-sm" type="submit" disabled={manualLoading}>
                <Icon name="plus" size={15} color="#06231a" /> {manualLoading ? "Adding..." : "Add prospect"}
              </button>
            </div>
          </form>
        ) : tab === "apollo" ? (
          <div className="col" style={{ gap: 16 }}>
          {importProgress ? <section className="card" style={{ padding: 18 }}>
            <div className="row spread"><strong>Preparing {campaigns.find(c => c.id === campaignId)?.channel || "campaign"} leads</strong><span className="chip">{importProgress.status}</span></div>
            <div className="row" style={{ gap: 18, marginTop: 12, flexWrap: "wrap" }}>
              <span>Requested <strong>{importProgress.requested ?? leadLimit}</strong></span>
              <span>Found <strong>{importProgress.candidatesFound ?? 0}</strong></span>
              <span>Qualified <strong>{importProgress.qualified ?? 0}</strong></span>
              <span>Pending <strong>{importProgress.pending ?? 0}</strong></span>
              <span>Rejected <strong>{importProgress.rejected ?? 0}</strong></span>
            </div>
            {(importProgress.qualified ?? 0) > 0 ? (
              <div className="row" style={{ marginTop: 14 }}>
                <button type="button" className="btn btn-ghost btn-sm" onClick={showImportedLeads}>
                  View {importProgress.qualified} qualified {importProgress.qualified === 1 ? "lead" : "leads"}
                </button>
              </div>
            ) : null}
          </section> : null}
          <form className="card source-panel" onSubmit={runApolloSearch}>
            <div className="source-panel-head">
              <span><Icon name="search" size={18} /></span>
              <div>
                <h2>Lead database search</h2>
                <p className="faint">Choose a campaign and audience. We search our lead database, enrich each match, and only admit contactable leads.</p>
              </div>
            </div>
            <div className="apollo-required-note">Required setup</div>
            <div className="form-grid">
              <label className="field">
                <span>Campaign *</span>
                <select className="input" value={campaignId} onChange={event => setCampaignId(event.target.value)}>
                  <option value="">Select a campaign</option>
                  {campaigns.map(campaign => <option key={campaign.id} value={campaign.id}>{campaign.name} · {campaign.channel || "email"}</option>)}
                </select>
              </label>
              <MultiSelect label="Job titles" options={uniqueApolloValues([...TITLE_OPTIONS, ...titles])} value={titles} onChange={setTitles} placeholder="Select job titles" required />
              <MultiSelect label="Management level" options={SENIORITY_OPTIONS} value={seniorities} onChange={setSeniorities} placeholder="Select seniority" required />
              <MultiSelect label="People locations" options={uniqueApolloValues([...LOCATION_OPTIONS, ...locations])} value={locations} onChange={setLocations} placeholder="Select locations" required />
              <label className="field"><span>Other job titles</span><input className="input" value={customTitles} onChange={event => setCustomTitles(event.target.value)} placeholder="Add custom titles, comma separated" /></label>
              <label className="field"><span>Other people locations</span><input className="input" value={customLocations} onChange={event => setCustomLocations(event.target.value)} placeholder="Add cities or regions, comma separated" /></label>
              <MultiSelect label="Target industries" options={uniqueApolloValues([...INDUSTRY_OPTIONS, ...industries])} value={industries} onChange={setIndustries} placeholder="Select industries" required />
              <label className="field"><span>Other industries</span><input className="input" value={customIndustries} onChange={event => setCustomIndustries(event.target.value)} placeholder="Add custom industries, comma separated" /></label>
            </div>
            <div className="field" style={{ marginTop: 14 }}>
              <span>Company size *</span>
              <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
                {uniqueApolloValues([...COMPANY_SIZE_OPTIONS, ...companySizes]).map(size => (
                  <button key={size} type="button" className="btn btn-ghost btn-sm" onClick={() => toggleSize(size)} style={{ height: 32, padding: "0 11px", fontSize: 12, background: companySizes.includes(size) ? "var(--g-50)" : "#fff", borderColor: companySizes.includes(size) ? "var(--g-300)" : "var(--line)" }}>
                    {size.endsWith(",") ? `${size.slice(0, -1)}+` : size.replace(",", "-")} employees
                  </button>
                ))}
              </div>
            </div>
            <label className="apollo-checkbox-row">
              <input type="checkbox" checked={includeSimilarTitles} onChange={event => setIncludeSimilarTitles(event.target.checked)} />
              Include people with similar job titles
            </label>

            <button className="btn btn-ghost btn-sm apollo-more-button" type="button" onClick={() => setShowMoreFilters(value => !value)}>
              <Icon name="sliders" size={14} /> {showMoreFilters ? "Hide additional filters" : "More filters"}
            </button>

            {showMoreFilters ? (
              <div className="apollo-more-panel">
                <div className="form-grid">
                  <label className="field"><span>Focused keyword (optional)</span><input className="input" value={keywords} onChange={event => setKeywords(event.target.value)} placeholder="Choose one focused term, e.g. B2B SaaS" /></label>
                  <MultiSelect label="Company HQ locations" options={LOCATION_OPTIONS} value={organizationLocations} onChange={setOrganizationLocations} placeholder="Select company locations" />
                  <label className="field"><span>Company domains</span><input className="input" value={domains} onChange={event => setDomains(event.target.value)} placeholder="acme.com, example.com" /></label>
                  <MultiSelect label="Technologies used" options={TECHNOLOGY_OPTIONS} value={technologies} onChange={setTechnologies} placeholder="Select technologies" />
                  <label className="field"><span>Companies hiring for</span><input className="input" value={hiringTitles} onChange={event => setHiringTitles(event.target.value)} placeholder="Account Executive, SDR" /></label>
                  <label className="field"><span>Annual revenue (minimum)</span><input className="input" type="number" min="0" value={revenueMin} onChange={event => setRevenueMin(event.target.value)} placeholder="1000000" /></label>
                  <label className="field"><span>Annual revenue (maximum)</span><input className="input" type="number" min="1" value={revenueMax} onChange={event => setRevenueMax(event.target.value)} placeholder="50000000" /></label>
                  <label className="field"><span>Leads to prepare</span><select className="input" value={leadLimit} onChange={event => setLeadLimit(Number(event.target.value))}>{[10, 25, 50, 100].map(value => <option key={value} value={value}>{value} leads</option>)}</select></label>
                </div>
                {keywordSuggestions.length ? <div style={{ marginTop: 12 }}><span className="faint" style={{ fontSize: 12 }}>Choose one onboarding suggestion. This is treated as one query, not an OR list.</span><div className="row" style={{ gap: 7, flexWrap: "wrap", marginTop: 7 }}>{keywordSuggestions.map(keyword => <button key={keyword} type="button" className="btn btn-ghost btn-sm" style={{ background: keywords === keyword ? "var(--g-50)" : "#fff" }} onClick={() => setKeywords(current => current === keyword ? "" : keyword)}>{keyword}</button>)}</div></div> : null}
              </div>
            ) : null}
            <div style={{ marginTop: 14, padding: 12, border: "1px solid var(--line)", borderRadius: 8, background: "#fff" }}>
              <strong style={{ fontSize: 12.5 }}>Final audience</strong>
              <p className="faint" style={{ fontSize: 12, marginTop: 5, lineHeight: 1.55 }}>
                {uniqueApolloValues([...titles, ...splitList(customTitles)]).join(", ") || "No titles"} · {normalizeApolloLocations([...locations, ...splitList(customLocations)]).join(", ") || "No locations"} · {uniqueApolloValues([...industries, ...splitList(customIndustries)]).join(", ") || "No industries"} · {companySizes.length} company-size range{companySizes.length === 1 ? "" : "s"}
              </p>
            </div>
            <div className="row spread source-actions">
              <span className="faint">Email campaigns require an enriched email; voice campaigns require an enriched callable phone.</span>
              <button className="btn btn-primary btn-sm" type="submit" disabled={!canSearch || loading}>
                <Icon name="search" size={15} color="#06231a" /> {loading ? "Starting import..." : "Find and prepare leads"}
              </button>
            </div>
          </form></div>
        ) : (
          <div className="col" style={{ gap: 16 }}>
            <section className="card source-panel">
              <div className="source-panel-head">
                <span><Icon name="doc" size={18} /></span>
                <div>
                  <h2>CSV upload</h2>
                  <p className="faint">Use columns like name, title, company, email, location, and linkedin_url.</p>
                </div>
              </div>
              <div className="form-grid two">
                <label className="field"><span>CSV file</span><input className="input" type="file" accept=".csv,text/csv" onChange={handleCsv} style={{ paddingTop: 12 }} /></label>
                <label className="field"><span>Attach to campaign</span><select className="input" value={campaignId} onChange={event => { setCampaignId(event.target.value); setVoiceConfirmed(false); }}><option value="">No campaign yet</option>{campaigns.map(campaign => <option key={campaign.id} value={campaign.id}>{campaign.name} · {campaign.channel}</option>)}</select></label>
                {selectedVoiceCampaign ? <div className="notice-warn">
                  <strong>Voice compliance confirmation required</strong>
                  <p>Every row must contain a person-level direct/mobile number.</p>
                  <select className="input" value={voiceLegalBasis} onChange={event => setVoiceLegalBasis(event.target.value)}><option value="legitimate_interest">Legitimate interest</option><option value="consent">Consent</option><option value="existing_business_relationship">Existing business relationship</option><option value="other">Other lawful basis</option></select>
                  <label className="apollo-checkbox-row"><input type="checkbox" checked={voiceConfirmed} onChange={event => setVoiceConfirmed(event.target.checked)} /> I confirm these numbers were DNC-checked, have not opted out, and may lawfully be called.</label>
                </div> : null}
              </div>
              {freePlan && csvLeads.length > 0 && leadCount + csvLeads.length > FREE_PLAN.maxLeads ? (
                <StateNote
                  tone="warn"
                  title={`This file has ${csvLeads.length} leads. You have room for ${Math.max(0, FREE_PLAN.maxLeads - leadCount)}.`}
                  text={`The Free plan holds up to ${FREE_PLAN.maxLeads} leads. ${leadCount} are already in your workspace.`}
                  secondary={{ label: "Upgrade", onClick: () => setUpgradeOpen(true) }}
                  action={FREE_PLAN.maxLeads - leadCount > 0 ? { label: `Import the first ${FREE_PLAN.maxLeads - leadCount}`, onClick: () => setCsvLeads(current => current.slice(0, FREE_PLAN.maxLeads - leadCount)) } : null}
                />
              ) : null}
              <div className="row spread source-actions">
                <span className="faint">{csvLeads.length} parsed rows. Maximum 1000 rows per upload.</span>
                <button className="btn btn-primary btn-sm" type="button" disabled={csvLeads.length === 0 || uploading || (freePlan && leadCount + csvLeads.length > FREE_PLAN.maxLeads)} onClick={uploadCsv}>
                  <Icon name="plus" size={15} color="#06231a" /> {uploading ? "Importing..." : "Import leads"}
                </button>
              </div>
            </section>
            <div className="card table-shell">
              <div className="table-scroll">
                <table className="data-table">
                  <thead><tr>{["Lead", "Email", "Company", "Location"].map(header => <th key={header}>{header}</th>)}</tr></thead>
                  <tbody>
                    {csvLeads.length === 0 ? (
                      <tr><td colSpan={4} className="table-empty">Choose a CSV file to preview rows.</td></tr>
                    ) : csvLeads.slice(0, 50).map((lead, index) => (
                      <tr className="data-row" key={index}>
                        <td>{leadName(lead)}</td>
                        <td>{lead.email || "Not revealed"}</td>
                        <td>{lead.company || "-"}</td>
                        <td>{lead.location || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {upgradeOpen ? (
        <UpgradeModal
          title="Finding new leads is on paid plans"
          body="On Free you bring your own leads. Paid plans search the lead database for buyers who fit, verify their work emails, and check fit before spending any credits."
          onClose={() => setUpgradeOpen(false)}
        />
      ) : null}

      {detailLead ? (
        <LeadDetailModal
          lead={detailLead}
          onClose={() => setDetailLeadId("")}
          onEnrich={enrichLead}
          enriching={enrichingId === detailLead.id}
          onSendNow={sendLeadNow}
          sending={sendingId === detailLead.id}
        />
      ) : null}
    </main>
  );
}
