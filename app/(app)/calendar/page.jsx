"use client";

import React, { useEffect, useMemo, useState } from "react";
import Icon from "../../../components/ui/Icon";
import EmptyState from "../../../components/ui/EmptyState";
import Avatar from "../../../components/ui/Avatar";
import RouteSkeleton from "../../../components/ui/RouteSkeleton";
import { useFirstLoad } from "../../../hooks/useFirstLoad";
import api from "../../../lib/api";

const STATUS_STYLES = {
  scheduled: { label: "Scheduled", bg: "var(--g-50)", color: "var(--g-700)" },
  completed: { label: "Completed", bg: "#f0fdf4", color: "#15803d" },
  cancelled: { label: "Cancelled", bg: "#fef2f2", color: "#b91c1c" },
};

const WEEKDAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_MS = 24 * 60 * 60 * 1000;

// Curated shortlist covering the regions this tool's orgs actually operate
// in - the full ~400-zone IANA list was overwhelming in a plain dropdown.
const TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Berlin",
  "Asia/Kolkata",
  "Australia/Sydney",
];

function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function startOfWeek(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d;
}

function formatTime(date) {
  return date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

function normalizeMeeting(meeting) {
  const lead = meeting.lead || {};
  return {
    ...meeting,
    scheduled: new Date(meeting.scheduledAt),
    name: lead.name || meeting.title || "Guest",
    companyLine: [lead.title, lead.company].filter(Boolean).join(" · "),
    duration: meeting.durationMinutes ?? 30,
  };
}

const DEFAULT_SETTINGS = {
  timezone: "America/New_York",
  workingDays: [1, 2, 3, 4, 5],
  dayStartTime: "09:00",
  dayEndTime: "17:00",
  meetingDurationMinutes: 30,
  bufferMinutes: 15,
  minNoticeMinutes: 120,
  bookingWindowDays: 14,
  defaultMeetingUrl: "",
};

const GRID_START_HOUR = 8;
const GRID_END_HOUR = 19;
const HOUR_PX = 56;

function formatHour(hour) {
  const suffix = hour >= 12 ? "PM" : "AM";
  return `${hour % 12 || 12} ${suffix}`;
}

function formatClock(value) {
  const [h, m] = String(value || "00:00").split(":").map(Number);
  const d = new Date();
  d.setHours(h, m || 0, 0, 0);
  return formatTime(d);
}

function blockTop(date) {
  const hours = date.getHours() + date.getMinutes() / 60;
  const clamped = Math.min(Math.max(hours, GRID_START_HOUR), GRID_END_HOUR - 1);
  return (clamped - GRID_START_HOUR) * HOUR_PX + 2;
}

function MeetingDetail({ meeting, onCancel, canceling, onClose, onEdit }) {
  const style = STATUS_STYLES[meeting.status] ?? STATUS_STYLES.scheduled;
  return (
    <div className="card">
      <div className="card-h">
        <div style={{ minWidth: 0 }}>
          <b className="ellip" style={{ display: "block" }}>{meeting.title || meeting.name}</b>
          <small>{meeting.scheduled.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })} · {formatTime(meeting.scheduled)} · {meeting.duration} min</small>
          {meeting.notes ? <small style={{ display: "block", marginTop: 4, whiteSpace: "pre-wrap" }}>{meeting.notes}</small> : null}
        </div>
        <button type="button" className="ibt" aria-label="Close meeting details" onClick={onClose}><Icon name="close" size={14} /></button>
      </div>
      <div style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
        <div className="who">
          <Avatar name={meeting.name} size={34} />
          <div style={{ minWidth: 0 }}>
            <b className="ellip">{meeting.name}</b>
            <small className="ellip">{meeting.companyLine || "Company not provided"}</small>
          </div>
          <span className="pl" style={{ marginLeft: "auto", background: style.bg, color: style.color }}>{style.label}</span>
        </div>
        <div className="acts">
          {meeting.joinUrl ? <a className="bt bt-p sm" href={meeting.joinUrl} target="_blank" rel="noreferrer"><Icon name="link" size={13} color="#06231a" /> Join</a> : null}
          {meeting.attendeePhone ? <a className="bt bt-g sm" href={`tel:${meeting.attendeePhone}`}><Icon name="phone" size={13} /> Call</a> : null}
          {meeting.status === "scheduled" ? (
            <button type="button" className="bt bt-g sm" onClick={() => onEdit(meeting)}><Icon name="edit" size={13} /> Edit</button>
          ) : null}
          {meeting.status === "scheduled" ? (
            <button type="button" className="bt bt-x sm" disabled={canceling} onClick={() => onCancel(meeting.id)}>
              {canceling ? "Cancelling…" : "Cancel meeting"}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function AvailabilitySummary({ settings, onEdit }) {
  return (
    <div className="card">
      <div className="card-h">
        <div><b>Availability</b><small>What your agent books against</small></div>
        <button type="button" className="lnk" onClick={onEdit}>Edit</button>
      </div>
      <div className="av-rows" style={{ padding: "6px 18px 16px" }}>
        <span className="muted" style={{ fontSize: 12, fontWeight: 800 }}>Working days</span>
        <div className="days">
          {WEEKDAY_SHORT.map((label, dow) => (
            <span key={label} className={settings.workingDays.includes(dow) ? "" : "off"}>{label.slice(0, 2)}</span>
          ))}
        </div>
        <div className="kv"><span>Hours</span><b>{formatClock(settings.dayStartTime)} to {formatClock(settings.dayEndTime)}</b></div>
        <div className="kv"><span>Timezone</span><b>{settings.timezone}</b></div>
        <div className="kv"><span>Meeting length</span><b>{settings.meetingDurationMinutes} min</b></div>
        <div className="kv"><span>Buffer</span><b>{settings.bufferMinutes} min</b></div>
        <div className="kv"><span>Minimum notice</span><b>{settings.minNoticeMinutes >= 60 && settings.minNoticeMinutes % 60 === 0 ? `${settings.minNoticeMinutes / 60} hours` : `${settings.minNoticeMinutes} min`}</b></div>
        <div className="kv"><span>Book within</span><b>{settings.bookingWindowDays} days</b></div>
        <div className="kv"><span>Meeting link</span><b className="ellip" style={{ maxWidth: 170 }}>{settings.defaultMeetingUrl ? settings.defaultMeetingUrl.replace(/^https?:\/\//, "") : "Not set"}</b></div>
      </div>
    </div>
  );
}

function pad2(n) { return String(n).padStart(2, "0"); }
function toDateInput(date) { return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`; }
function toTimeInput(date) { return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`; }

// Create or edit an event by hand. The agent only books into free time, so
// anything written here also blocks that slot for the agent.
function EventPanel({ event, defaults, onSave, onDelete, saving, error, onDone }) {
  const editing = Boolean(event?.id);
  const start = event?.scheduled || defaults?.start || new Date();
  const [form, setForm] = useState({
    title: event?.title || "",
    date: toDateInput(start),
    time: toTimeInput(start),
    duration: event?.duration ?? defaults?.duration ?? 30,
    joinUrl: event?.joinUrl || defaults?.joinUrl || "",
    notes: event?.notes || "",
  });
  const set = key => value => setForm(current => ({ ...current, [key]: value }));
  const when = new Date(`${form.date}T${form.time}`);
  const valid = form.title.trim() && !Number.isNaN(when.getTime()) && Number(form.duration) >= 5 && Number(form.duration) <= 480;

  const submit = e => {
    e.preventDefault();
    if (!valid || saving) return;
    onSave({
      title: form.title.trim(),
      scheduledAt: when.toISOString(),
      durationMinutes: Number(form.duration),
      joinUrl: form.joinUrl.trim() || null,
      notes: form.notes.trim() || null,
    });
  };

  return (
    <div className="cal-modal-bg" onMouseDown={e => { if (e.target === e.currentTarget && !saving) onDone(); }}>
      <form className="cal-modal" role="dialog" aria-modal="true" aria-labelledby="cal-ev-title" onSubmit={submit}>
        <div className="cal-modal-h">
          <div>
            <h2 id="cal-ev-title">{editing ? "Edit event" : "Add event"}</h2>
            <p>{editing ? "Change the details of this event." : "Block time on your calendar. Your agent will not book over it."}</p>
          </div>
          <button type="button" className="ibt" aria-label="Close" onClick={onDone}><Icon name="close" size={16} /></button>
        </div>

        <div className="cal-modal-b">
          <div className="field">
            <label htmlFor="ev-title">Title</label>
            <input id="ev-title" className="input" autoFocus value={form.title} onChange={e => set("title")(e.target.value)} placeholder="Call with a customer, lunch, focus time…" maxLength={120} />
          </div>
          <div className="cal-grid2">
            <div className="field">
              <label htmlFor="ev-date">Date</label>
              <input id="ev-date" className="input" type="date" value={form.date} onChange={e => set("date")(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="ev-time">Start time</label>
              <input id="ev-time" className="input" type="time" value={form.time} onChange={e => set("time")(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="ev-dur">Length (min)</label>
              <input id="ev-dur" className="input" type="number" min={5} max={480} step={5} value={form.duration} onChange={e => set("duration")(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="ev-url">Meeting link</label>
              <input id="ev-url" className="input" type="url" value={form.joinUrl} onChange={e => set("joinUrl")(e.target.value)} placeholder="https://meet.google.com/…" />
            </div>
          </div>
          <div className="field">
            <label htmlFor="ev-notes">Notes</label>
            <textarea id="ev-notes" className="input" rows={3} value={form.notes} onChange={e => set("notes")(e.target.value)} placeholder="Anything you want to remember" style={{ resize: "vertical", height: "auto", padding: "10px 12px" }} />
          </div>
          {error ? <div className="note">{error}</div> : null}
        </div>

        <div className="cal-modal-f">
          {editing ? <button type="button" className="bt bt-x" style={{ marginRight: "auto" }} disabled={saving} onClick={() => onDelete(event.id)}>Delete</button> : null}
          <button type="button" className="bt bt-g" onClick={onDone}>Cancel</button>
          <button type="submit" className="bt bt-p" disabled={!valid || saving}>{saving ? "Saving…" : editing ? "Save changes" : "Add event"}</button>
        </div>
      </form>
    </div>
  );
}

function SettingsPanel({ settings, onSave, saving, onDone }) {
  const [form, setForm] = useState(settings);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setForm(settings);
    setDirty(false);
  }, [settings]);

  const set = (key) => (value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setDirty(true);
  };

  const toggleDay = (dow) => {
    setForm((f) => {
      const has = f.workingDays.includes(dow);
      const workingDays = has ? f.workingDays.filter((d) => d !== dow) : [...f.workingDays, dow].sort();
      return { ...f, workingDays };
    });
    setDirty(true);
  };

  return (
    <div className="cal-modal-bg" onMouseDown={(e) => { if (e.target === e.currentTarget) onDone(); }}>
      <div className="cal-modal" role="dialog" aria-modal="true" aria-labelledby="cal-av-title" data-tour="calendar-availability">
        <div className="cal-modal-h">
          <div>
            <h2 id="cal-av-title">Availability</h2>
            <p>What the AI agent offers leads when it books a meeting.</p>
          </div>
          <button type="button" className="ibt" aria-label="Close availability" onClick={onDone}><Icon name="close" size={16} /></button>
        </div>

        <div className="cal-modal-b">
          <section className="cal-sec">
            <h3>Working hours</h3>
            <div className="field">
              <label>Working days</label>
              <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
                {WEEKDAY_SHORT.map((label, dow) => {
                  const active = form.workingDays.includes(dow);
                  return (
                    <button
                      key={dow}
                      type="button"
                      onClick={() => toggleDay(dow)}
                      className="cal-day-toggle"
                      aria-pressed={active}
                      title={label}
                      style={{
                        background: active ? "var(--g-500)" : "var(--bg)",
                        color: active ? "#06231a" : "var(--muted)",
                        borderColor: active ? "var(--g-500)" : "var(--line)",
                      }}
                    >
                      {label[0]}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="cal-grid2">
              <div className="field">
                <label>Start</label>
                <input className="input" type="time" value={form.dayStartTime} onChange={(e) => set("dayStartTime")(e.target.value)} />
              </div>
              <div className="field">
                <label>End</label>
                <input className="input" type="time" value={form.dayEndTime} onChange={(e) => set("dayEndTime")(e.target.value)} />
              </div>
            </div>
            <div className="field">
              <label>Timezone</label>
              <select className="input" value={form.timezone} onChange={(e) => set("timezone")(e.target.value)}>
                {(TIMEZONES.includes(form.timezone) ? TIMEZONES : [form.timezone, ...TIMEZONES]).map((zone) => (
                  <option key={zone} value={zone}>{zone}</option>
                ))}
              </select>
              <span className="cal-hint">Slot times are spoken to leads in this timezone.</span>
            </div>
          </section>

          <section className="cal-sec">
            <h3>Meeting rules</h3>
            <div className="cal-grid2">
              <div className="field">
                <label>Duration (min)</label>
                <input className="input" type="number" min={5} max={240} value={form.meetingDurationMinutes} onChange={(e) => set("meetingDurationMinutes")(Number(e.target.value))} />
              </div>
              <div className="field">
                <label>Buffer (min)</label>
                <input className="input" type="number" min={0} max={120} value={form.bufferMinutes} onChange={(e) => set("bufferMinutes")(Number(e.target.value))} />
              </div>
              <div className="field">
                <label>Min notice (min)</label>
                <input className="input" type="number" min={0} max={10080} value={form.minNoticeMinutes} onChange={(e) => set("minNoticeMinutes")(Number(e.target.value))} />
              </div>
              <div className="field">
                <label>Book within (days)</label>
                <input className="input" type="number" min={1} max={90} value={form.bookingWindowDays} onChange={(e) => set("bookingWindowDays")(Number(e.target.value))} />
              </div>
            </div>
            <div className="field">
              <label>Default meeting link</label>
              <input className="input" type="url" value={form.defaultMeetingUrl || ""} onChange={(e) => set("defaultMeetingUrl")(e.target.value)} placeholder="https://meet.google.com/…" />
              <span className="cal-hint">Sent automatically to the prospect and your connected mailbox after a call booking.</span>
            </div>
          </section>
        </div>

        <div className="cal-modal-f">
          <button type="button" className="bt bt-g" onClick={onDone}>Cancel</button>
          <button type="button" className="bt bt-p" disabled={saving} onClick={() => onSave(form)}>
            {saving ? "Saving…" : "Save availability"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CalendarPage() {
  const [data, setData] = useState(null);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingSettings, setSavingSettings] = useState(false);
  const [cancelingId, setCancelingId] = useState(null);
  const [editingSettings, setEditingSettings] = useState(false);
  const [eventPanel, setEventPanel] = useState(null); // { event } or { defaults }
  const [eventSaving, setEventSaving] = useState(false);
  const [eventError, setEventError] = useState("");
  const [selectedMeetingId, setSelectedMeetingId] = useState(null);
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const showSkeleton = useFirstLoad(loading || settingsLoading);

  const loadMeetings = () => {
    setLoading(true);
    return api.get("/meetings")
      .then((res) => setData(res.data))
      .catch(() => setError("Calendar could not be loaded."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadMeetings();
    api.get("/calendar/settings")
      .then((res) => setSettings(res.data))
      .catch(() => {})
      .finally(() => setSettingsLoading(false));
  }, []);

  // The guided tour's "Open availability" button asks this page to open the editor.
  useEffect(() => {
    const open = () => setEditingSettings(true);
    window.addEventListener("gnx:tour:open-availability", open);
    return () => window.removeEventListener("gnx:tour:open-availability", open);
  }, []);

  const allMeetings = useMemo(() => (data?.meetings || []).map(normalizeMeeting), [data]);
  const pastMeetings = useMemo(() => (data?.past || []).map(normalizeMeeting), [data]);
  const meetingCount = data?.summary?.total ?? 0;

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => new Date(weekStart.getTime() + i * DAY_MS));
  }, [weekStart]);

  const meetingsByDay = useMemo(() => {
    const map = new Map();
    weekDays.forEach((day) => map.set(day.toDateString(), []));
    allMeetings.forEach((meeting) => {
      const key = meeting.scheduled.toDateString();
      if (map.has(key)) map.get(key).push(meeting);
    });
    map.forEach((list) => list.sort((a, b) => a.scheduled - b.scheduled));
    return map;
  }, [allMeetings, weekDays]);

  const handleSaveSettings = (form) => {
    setSavingSettings(true);
    api.put("/calendar/settings", form)
      .then((res) => { setSettings(res.data); setEditingSettings(false); })
      .catch(() => setError("Could not save availability settings."))
      .finally(() => setSavingSettings(false));
  };

  const openNewEvent = (start) => {
    const base = start || (() => { const d = new Date(); d.setMinutes(d.getMinutes() < 30 ? 30 : 0, 0, 0); if (d.getMinutes() === 0) d.setHours(d.getHours() + 1); return d; })();
    setEventError("");
    setEventPanel({ defaults: { start: base, duration: settings.meetingDurationMinutes || 30, joinUrl: settings.defaultMeetingUrl || "" } });
  };

  const handleSaveEvent = (payload) => {
    setEventSaving(true);
    setEventError("");
    const editingId = eventPanel?.event?.id;
    const request = editingId ? api.patch(`/meetings/${editingId}`, payload) : api.post("/meetings", payload);
    request
      .then(() => {
        setEventPanel(null);
        if (payload.scheduledAt) setWeekStart(startOfWeek(new Date(payload.scheduledAt)));
        return loadMeetings();
      })
      .catch((err) => setEventError(err?.response?.data?.error || "Could not save this event. Please try again."))
      .finally(() => setEventSaving(false));
  };

  const handleDeleteEvent = (meetingId) => {
    setEventSaving(true);
    api.delete(`/meetings/${meetingId}`)
      .then(() => { setEventPanel(null); setSelectedMeetingId(null); return loadMeetings(); })
      .catch(() => setEventError("Could not delete this event."))
      .finally(() => setEventSaving(false));
  };

  const handleCancel = (meetingId) => {
    setCancelingId(meetingId);
    api.delete(`/meetings/${meetingId}`)
      .then(() => loadMeetings())
      .catch(() => setError("Could not cancel that meeting."))
      .finally(() => setCancelingId(null));
  };

  if (showSkeleton) return <RouteSkeleton />;

  const today = new Date();
  const now = Date.now();
  const upcoming = allMeetings.filter(m => m.status === "scheduled" && m.scheduled.getTime() + m.duration * 60000 >= now).sort((a, b) => a.scheduled - b.scheduled);
  const nextId = upcoming[0]?.id;
  const selectedMeeting = [...allMeetings, ...pastMeetings].find(m => m.id === selectedMeetingId) || null;
  const weekEnd = new Date(weekStart.getTime() + 6 * DAY_MS);
  const shortDate = date => date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  const rangeLabel = `${shortDate(weekStart)} to ${weekEnd.getMonth() === weekStart.getMonth() ? weekEnd.getDate() : shortDate(weekEnd)}, ${weekEnd.getFullYear()}`;
  const hours = Array.from({ length: GRID_END_HOUR - GRID_START_HOUR }, (_, i) => GRID_START_HOUR + i);
  const nowHours = today.getHours() + today.getMinutes() / 60;
  const showNow = nowHours >= GRID_START_HOUR && nowHours < GRID_END_HOUR;

  return (
    <main className="gx">
      <div className="ph">
        <div>
          <h1>Calendar</h1>
          <p>{meetingCount} meeting{meetingCount === 1 ? "" : "s"} booked by your AI agent. It only books into your free time.</p>
        </div>
        <div className="acts">
          <button type="button" className="ibt" aria-label="Previous week" onClick={() => setWeekStart(startOfWeek(new Date(weekStart.getTime() - 7 * DAY_MS)))}>
            <Icon name="arrowLeft" size={15} />
          </button>
          <button type="button" className="ibt" aria-label="Next week" onClick={() => setWeekStart(startOfWeek(new Date(weekStart.getTime() + 7 * DAY_MS)))}>
            <Icon name="arrow" size={15} />
          </button>
          <button type="button" className="bt bt-g sm" onClick={() => setWeekStart(startOfWeek(new Date()))}>Today</button>
          <span className="sel-box" style={{ background: "#fff" }}>{rangeLabel}</span>
          <button type="button" className="bt bt-g" onClick={() => setEditingSettings(true)}><Icon name="sliders" size={14} /> Availability</button>
          <button type="button" className="bt bt-p" onClick={() => openNewEvent()}><Icon name="plus" size={14} color="#06231a" /> Add event</button>
        </div>
      </div>

      {error ? <div className="note">{error}</div> : null}

      <div className="cal-grid" data-tour="calendar-hero">
        <div className="card wk-scroll" style={{ overflow: "hidden" }}>
          <div>
            <div className="wk-h">
              <div />
              {weekDays.map(day => (
                <div key={day.toISOString()} className={sameDay(day, today) ? "today" : ""}>
                  {WEEKDAY_SHORT[day.getDay()]}<b>{day.getDate()}</b>
                </div>
              ))}
            </div>
            <div className="wk-b">
              <div className="hrs">
                {hours.map(hour => <div key={hour} className="hr"><span>{hour === GRID_START_HOUR ? "" : formatHour(hour)}</span></div>)}
              </div>
              {weekDays.map(day => {
                const isToday = sameDay(day, today);
                const weekend = !settings.workingDays.includes(day.getDay());
                const dayMeetings = meetingsByDay.get(day.toDateString()) || [];
                return (
                  <div
                    key={day.toISOString()}
                    className={`dcol ${weekend ? "wk" : ""} ${isToday ? "today" : ""}`}
                    style={{ minHeight: hours.length * HOUR_PX, cursor: "cell" }}
                    title="Click to add an event"
                    onClick={event => {
                      if (event.target !== event.currentTarget) return;
                      const box = event.currentTarget.getBoundingClientRect();
                      const hoursFromTop = (event.clientY - box.top) / HOUR_PX + GRID_START_HOUR;
                      const slot = new Date(day);
                      slot.setHours(Math.floor(hoursFromTop), hoursFromTop % 1 >= 0.5 ? 30 : 0, 0, 0);
                      openNewEvent(slot);
                    }}
                  >
                    {dayMeetings.map(meeting => {
                      const past = meeting.status !== "scheduled" || meeting.scheduled.getTime() + meeting.duration * 60000 < now;
                      return (
                        <button
                          key={meeting.id}
                          type="button"
                          className={`mb ${past ? "done" : meeting.id === nextId ? "next" : ""}`}
                          style={{ top: blockTop(meeting.scheduled), textAlign: "left" }}
                          onClick={e => { e.stopPropagation(); setSelectedMeetingId(meeting.id); }}
                        >
                          <b>{meeting.name}</b>
                          <span>{formatTime(meeting.scheduled)}{meeting.companyLine ? ` · ${meeting.companyLine}` : ""}</span>
                        </button>
                      );
                    })}
                    {isToday && showNow ? <div className="now" style={{ top: (nowHours - GRID_START_HOUR) * HOUR_PX }}><i /></div> : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="col" style={{ gap: 16 }}>
          {selectedMeeting ? (
            <MeetingDetail meeting={selectedMeeting} onCancel={handleCancel} canceling={cancelingId === selectedMeeting.id} onClose={() => setSelectedMeetingId(null)} onEdit={meeting => { setEventError(""); setEventPanel({ event: meeting }); }} />
          ) : null}

          <div className="card">
            <div className="card-h"><div><b>Coming up</b><small>{upcoming.length ? `Next ${Math.min(3, upcoming.length)} meeting${upcoming.length === 1 ? "" : "s"}` : "Nothing scheduled"}</small></div></div>
            {upcoming.length === 0 ? (
              <EmptyState
                compact
                icon="calendar"
                title="No meetings coming up"
                text="Meetings booked from replies and calls land here, with the lead's context attached."
                actions={settings.defaultMeetingUrl ? [] : [{ label: "Add a meeting link", icon: "link", onClick: () => setEditingSettings(true) }]}
              />
            ) : upcoming.slice(0, 3).map(meeting => (
              <div key={meeting.id} className="upc">
                <div className="upc-t">
                  <small>{sameDay(meeting.scheduled, today) ? "Today" : WEEKDAY_SHORT[meeting.scheduled.getDay()]}</small>
                  <b>{meeting.scheduled.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }).replace(/\s?[AP]M$/i, "")}</b>
                </div>
                <div>
                  <button type="button" className="nm" style={{ textAlign: "left" }} onClick={() => setSelectedMeetingId(meeting.id)}>{meeting.name}</button>
                  <div className="co">{meeting.companyLine ? `${meeting.companyLine} · ` : ""}{meeting.duration} min</div>
                </div>
                {meeting.joinUrl ? <a className="bt bt-g sm" href={meeting.joinUrl} target="_blank" rel="noreferrer">Join</a> : null}
              </div>
            ))}
          </div>

          <AvailabilitySummary settings={settings} onEdit={() => setEditingSettings(true)} />
        </div>
      </div>

      {pastMeetings.length > 0 && (
        <div className="card">
          <div className="card-h"><div><b>Past meetings</b><small>Most recent first</small></div></div>
          {pastMeetings.slice(0, 10).map(meeting => (
            <div key={meeting.id} className="act">
              <Avatar name={meeting.name} size={32} />
              <div className="act-main">
                <div className="act-t"><b>{meeting.title}</b></div>
                <div className="act-s">{meeting.name}{meeting.companyLine ? ` · ${meeting.companyLine}` : ""} · {meeting.scheduled.toLocaleDateString()}</div>
              </div>
              <span className="pl" style={{ background: STATUS_STYLES[meeting.status]?.bg, color: STATUS_STYLES[meeting.status]?.color }}>
                {STATUS_STYLES[meeting.status]?.label ?? meeting.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {eventPanel ? (
        <EventPanel
          event={eventPanel.event}
          defaults={eventPanel.defaults}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
          saving={eventSaving}
          error={eventError}
          onDone={() => setEventPanel(null)}
        />
      ) : null}

      {editingSettings ? (
        <SettingsPanel settings={settings} onSave={handleSaveSettings} saving={savingSettings} onDone={() => setEditingSettings(false)} />
      ) : null}
    </main>
  );
}
