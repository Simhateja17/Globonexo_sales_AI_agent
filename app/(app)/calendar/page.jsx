"use client";

import React, { useEffect, useMemo, useState } from "react";
import Icon from "../../../components/ui/Icon";
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
    name: lead.name || "Guest",
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
  googleMeetEnabled: true,
  reminderEnabled: true,
  reminderLeadMinutes: 1440,
};

const REMINDER_CHOICES = [
  { value: 1440, label: "24 hours before" },
  { value: 2880, label: "2 days before" },
  { value: 180, label: "3 hours before" },
  { value: 60, label: "1 hour before" },
];

const GOOGLE_CALLBACK_MESSAGES = {
  connected: { tone: "ok", text: "Google Calendar connected. Choose the calendar your meetings should be booked into." },
  denied: { tone: "warn", text: "Google Calendar was not connected — the permission request was declined." },
  missing_code: { tone: "warn", text: "Google did not complete the connection. Please try again." },
  error: { tone: "warn", text: "Google Calendar could not be connected." },
};

function MeetingCard({ meeting, onCancel, canceling }) {
  const style = STATUS_STYLES[meeting.status] ?? STATUS_STYLES.scheduled;
  return (
    <div className="cal-meeting-card">
      <div className="row spread" style={{ gap: 8, alignItems: "flex-start" }}>
        <div className="row" style={{ gap: 8, minWidth: 0 }}>
          <Avatar name={meeting.name} size={28} />
          <div className="col" style={{ minWidth: 0 }}>
            <span style={{ fontWeight: 800, fontSize: 13 }} className="ellip">{meeting.name}</span>
            <span className="muted ellip" style={{ fontSize: 11.5 }}>{meeting.companyLine || "Company not provided"}</span>
          </div>
        </div>
        <span className="badge" style={{ background: style.bg, color: style.color, fontSize: 10.5, flex: "none" }}>{style.label}</span>
      </div>
      <div className="row spread" style={{ marginTop: 8 }}>
        <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--ink-2)" }}>
          {formatTime(meeting.scheduled)} · {meeting.duration} min
        </span>
        {meeting.attendeePhone ? (
          <a className="row" style={{ gap: 4, fontSize: 12, color: "var(--g-700)", fontWeight: 700 }} href={`tel:${meeting.attendeePhone}`}>
            <Icon name="phone" size={13} /> Call
          </a>
        ) : null}
      </div>
      {meeting.joinUrl ? (
        <a
          className="row"
          style={{ gap: 4, marginTop: 8, fontSize: 12, color: "var(--g-700)", fontWeight: 700 }}
          href={meeting.joinUrl}
          target="_blank"
          rel="noreferrer"
        >
          <Icon name="link" size={13} /> Join meeting
        </a>
      ) : null}
      {meeting.status === "scheduled" && (
        <button
          type="button"
          className="btn btn-ghost btn-sm btn-block"
          style={{ marginTop: 10, height: 30, fontSize: 12 }}
          disabled={canceling}
          onClick={() => onCancel(meeting.id)}
        >
          {canceling ? "Cancelling…" : "Cancel"}
        </button>
      )}
    </div>
  );
}

function SettingsPanel({ settings, onSave, saving }) {
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
    <div className="card cal-settings-card">
      <div className="row" style={{ gap: 8, marginBottom: 4 }}>
        <Icon name="sliders" size={16} color="var(--g-700)" />
        <strong style={{ fontSize: 14 }}>Availability</strong>
      </div>
      <p className="muted" style={{ fontSize: 12, marginBottom: 16 }}>
        What the AI agent offers leads when it books a meeting live on a call.
      </p>

      <div className="col" style={{ gap: 14 }}>
        <div className="field">
          <label>Working days</label>
          <div className="row" style={{ gap: 6, flexWrap: "wrap" }}>
            {WEEKDAY_SHORT.map((label, dow) => {
              const active = form.workingDays.includes(dow);
              return (
                <button
                  key={dow}
                  type="button"
                  onClick={() => toggleDay(dow)}
                  className="cal-day-toggle"
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

        <div className="row" style={{ gap: 10 }}>
          <div className="field" style={{ flex: 1 }}>
            <label>Start</label>
            <input className="input" type="time" value={form.dayStartTime} onChange={(e) => set("dayStartTime")(e.target.value)} />
          </div>
          <div className="field" style={{ flex: 1 }}>
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
          <span style={{ fontSize: 11.5, color: "var(--faint)" }}>Slot times are spoken to leads in this timezone.</span>
        </div>

        <div className="row" style={{ gap: 10 }}>
          <div className="field" style={{ flex: 1 }}>
            <label>Duration (min)</label>
            <input className="input" type="number" min={5} max={240} value={form.meetingDurationMinutes} onChange={(e) => set("meetingDurationMinutes")(Number(e.target.value))} />
          </div>
          <div className="field" style={{ flex: 1 }}>
            <label>Buffer (min)</label>
            <input className="input" type="number" min={0} max={120} value={form.bufferMinutes} onChange={(e) => set("bufferMinutes")(Number(e.target.value))} />
          </div>
        </div>

        <div className="row" style={{ gap: 10 }}>
          <div className="field" style={{ flex: 1 }}>
            <label>Min notice (min)</label>
            <input className="input" type="number" min={0} max={10080} value={form.minNoticeMinutes} onChange={(e) => set("minNoticeMinutes")(Number(e.target.value))} />
          </div>
          <div className="field" style={{ flex: 1 }}>
            <label>Book within (days)</label>
            <input className="input" type="number" min={1} max={90} value={form.bookingWindowDays} onChange={(e) => set("bookingWindowDays")(Number(e.target.value))} />
          </div>
        </div>

        <div className="field">
          <label>Default meeting link</label>
          <input className="input" type="url" value={form.defaultMeetingUrl || ""} onChange={(e) => set("defaultMeetingUrl")(e.target.value)} placeholder="https://meet.google.com/…" />
          <span style={{ fontSize: 11.5, color: "var(--faint)" }}>
            Used when no Google Meet link is created — for example when Google Calendar is not connected.
          </span>
        </div>

        <div className="field">
          <label className="row" style={{ gap: 8, cursor: "pointer" }}>
            <input type="checkbox" checked={form.googleMeetEnabled !== false} onChange={(e) => set("googleMeetEnabled")(e.target.checked)} />
            <span>Add a Google Meet link to each booking</span>
          </label>
          <span style={{ fontSize: 11.5, color: "var(--faint)" }}>
            Only applies when Google Calendar is connected. Google creates the link and includes it in the invitation.
          </span>
        </div>

        <div className="field">
          <label className="row" style={{ gap: 8, cursor: "pointer" }}>
            <input type="checkbox" checked={form.reminderEnabled !== false} onChange={(e) => set("reminderEnabled")(e.target.checked)} />
            <span>Email the prospect a reminder</span>
          </label>
          {form.reminderEnabled !== false && (
            <select
              className="input"
              style={{ marginTop: 6 }}
              value={form.reminderLeadMinutes ?? 1440}
              onChange={(e) => set("reminderLeadMinutes")(Number(e.target.value))}
            >
              {REMINDER_CHOICES.map((choice) => (
                <option key={choice.value} value={choice.value}>{choice.label}</option>
              ))}
            </select>
          )}
          <span style={{ fontSize: 11.5, color: "var(--faint)" }}>
            Sent from your connected mailbox. Meetings booked inside this window get no reminder.
          </span>
        </div>

        <button
          type="button"
          className="btn btn-primary btn-sm btn-block"
          disabled={!dirty || saving}
          onClick={() => { onSave(form); setDirty(false); }}
        >
          {saving ? "Saving…" : "Save availability"}
        </button>
      </div>
    </div>
  );
}

function GoogleCalendarPanel({ status, loading, onChanged, onError }) {
  const [busy, setBusy] = useState(false);
  const [calendars, setCalendars] = useState(null);
  const [listing, setListing] = useState(false);

  const connected = status?.connected === true;
  const revoked = status?.status === "revoked";

  // The calendar list is only fetched when it can actually be shown: it costs a
  // Google API round trip and is useless until an account is connected.
  useEffect(() => {
    if (!connected) {
      setCalendars(null);
      return;
    }
    setListing(true);
    api.get("/calendar/google/calendars")
      .then((res) => setCalendars(res.data.calendars || []))
      .catch(() => setCalendars([]))
      .finally(() => setListing(false));
  }, [connected, status?.email]);

  const connect = async () => {
    setBusy(true);
    try {
      const { data } = await api.get("/calendar/google/auth-url");
      if (data?.url) window.location.href = data.url;
      else onError("Google did not return a connection link.");
    } catch (err) {
      onError(err.response?.data?.error || "Could not start the Google Calendar connection.");
    } finally {
      setBusy(false);
    }
  };

  const disconnect = async () => {
    setBusy(true);
    try {
      await api.delete("/calendar/google");
      await onChanged();
    } catch (err) {
      onError(err.response?.data?.error || "Could not disconnect Google Calendar.");
    } finally {
      setBusy(false);
    }
  };

  const choose = async (calendarId) => {
    if (!calendarId) return;
    setBusy(true);
    try {
      await api.post("/calendar/google/calendar", { calendarId });
      await onChanged();
    } catch (err) {
      onError(err.response?.data?.error || "Could not select that calendar.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card cal-settings-card">
      <div className="row" style={{ gap: 8, marginBottom: 4 }}>
        <Icon name="calendar" size={16} color="var(--g-700)" />
        <strong style={{ fontSize: 14 }}>Google Calendar</strong>
        <span
          className="badge"
          style={{
            marginLeft: "auto",
            fontSize: 10.5,
            background: status?.bookable ? "var(--g-50)" : "var(--bg-2)",
            color: status?.bookable ? "var(--g-700)" : "var(--muted)",
          }}
        >
          {loading ? "Checking" : status?.bookable ? "Booking live" : connected ? "Calendar not chosen" : revoked ? "Reconnect needed" : "Not connected"}
        </span>
      </div>
      <p className="muted" style={{ fontSize: 12, marginBottom: 14 }}>
        When connected, the agent checks your real free/busy before offering a slot and puts every booking on your calendar.
      </p>

      {status?.lastError ? <div className="notice-warn" style={{ marginBottom: 12, fontSize: 12 }}>{status.lastError}</div> : null}

      {connected ? (
        <div className="col" style={{ gap: 12 }}>
          <div className="col" style={{ gap: 2 }}>
            <span style={{ fontSize: 12.5, fontWeight: 700 }}>{status.email}</span>
            <span className="faint" style={{ fontSize: 11.5 }}>
              {status.lastSyncedAt ? `Last synced ${new Date(status.lastSyncedAt).toLocaleString()}` : "Not synced yet"}
              {status.pushActive ? " · live updates on" : ""}
            </span>
          </div>

          <div className="field">
            <label>Bookable calendar</label>
            <select
              className="input"
              value={status.calendarId || ""}
              disabled={busy || listing}
              onChange={(e) => choose(e.target.value)}
            >
              <option value="" disabled>{listing ? "Loading calendars…" : "Choose a calendar"}</option>
              {(calendars || []).map((calendar) => (
                <option key={calendar.id} value={calendar.id}>
                  {calendar.summary}{calendar.primary ? " (primary)" : ""}
                </option>
              ))}
            </select>
            <span style={{ fontSize: 11.5, color: "var(--faint)" }}>Only calendars you can write to are listed.</span>
          </div>

          <button type="button" className="btn btn-ghost btn-sm btn-block" disabled={busy} onClick={disconnect}>
            {busy ? "Working…" : "Disconnect"}
          </button>
        </div>
      ) : (
        <button type="button" className="btn btn-primary btn-sm btn-block" disabled={busy || loading} onClick={connect}>
          {busy ? "Opening Google…" : revoked ? "Reconnect Google Calendar" : "Connect Google Calendar"}
        </button>
      )}
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
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [googleStatus, setGoogleStatus] = useState(null);
  const [googleLoading, setGoogleLoading] = useState(true);
  const [notice, setNotice] = useState(null);
  const showSkeleton = useFirstLoad(loading || settingsLoading);

  const loadGoogleStatus = () =>
    api.get("/calendar/google/status")
      .then((res) => setGoogleStatus(res.data))
      .catch(() => setGoogleStatus(null))
      .finally(() => setGoogleLoading(false));

  const loadMeetings = () => {
    setLoading(true);
    return api.get("/meetings")
      .then((res) => setData(res.data))
      .catch(() => setError("Calendar could not be loaded."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadMeetings();
    loadGoogleStatus();
    api.get("/calendar/settings")
      .then((res) => setSettings(res.data))
      .catch(() => {})
      .finally(() => setSettingsLoading(false));

    // The OAuth callback route redirects back here with the outcome in the
    // query string. It is stripped once read so a refresh does not replay a
    // stale banner.
    const params = new URLSearchParams(window.location.search);
    const outcome = params.get("googleCalendar");
    if (outcome) {
      const message = GOOGLE_CALLBACK_MESSAGES[outcome] ?? GOOGLE_CALLBACK_MESSAGES.error;
      const detail = params.get("googleCalendarError");
      setNotice({ ...message, text: detail ? `${message.text} ${detail}` : message.text });
      params.delete("googleCalendar");
      params.delete("googleCalendarError");
      const query = params.toString();
      window.history.replaceState({}, "", `${window.location.pathname}${query ? `?${query}` : ""}`);
    }
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
      .then((res) => setSettings(res.data))
      .catch(() => setError("Could not save availability settings."))
      .finally(() => setSavingSettings(false));
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

  return (
    <div className="scroll grow app-page">
      <div className="row spread page-head">
        <div>
          <h1 className="display page-title">Calendar</h1>
          <p className="muted page-subtitle">{meetingCount} meeting{meetingCount === 1 ? "" : "s"} booked by your AI agent</p>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => setWeekStart(startOfWeek(new Date(weekStart.getTime() - 7 * DAY_MS)))}>
            <Icon name="arrowLeft" size={15} />
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => setWeekStart(startOfWeek(new Date()))}>Today</button>
          <button className="btn btn-ghost btn-sm" onClick={() => setWeekStart(startOfWeek(new Date(weekStart.getTime() + 7 * DAY_MS)))}>
            <Icon name="arrow" size={15} />
          </button>
        </div>
      </div>

      {error ? <div className="notice-warn">{error}</div> : null}
      {notice ? <div className={notice.tone === "ok" ? "notice" : "notice-warn"}>{notice.text}</div> : null}

      <div className="cal-layout" data-tour="calendar-hero">
        <div className="cal-grid">
          {weekDays.map((day) => {
            const isToday = sameDay(day, today);
            const dayMeetings = meetingsByDay.get(day.toDateString()) || [];
            return (
              <div key={day.toISOString()} className="cal-day-col">
                <div className={`cal-day-head ${isToday ? "is-today" : ""}`}>
                  <span className="faint">{WEEKDAY_SHORT[day.getDay()]}</span>
                  <strong>{day.getDate()}</strong>
                </div>
                <div className="cal-day-body">
                  {dayMeetings.length === 0 ? (
                    <span className="faint" style={{ fontSize: 11.5 }}>No meetings</span>
                  ) : (
                    dayMeetings.map((meeting) => (
                      <MeetingCard key={meeting.id} meeting={meeting} onCancel={handleCancel} canceling={cancelingId === meeting.id} />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="col" style={{ gap: 16 }}>
          <GoogleCalendarPanel
            status={googleStatus}
            loading={googleLoading}
            onChanged={loadGoogleStatus}
            onError={setError}
          />
          <SettingsPanel settings={settings} onSave={handleSaveSettings} saving={savingSettings} />
        </div>
      </div>

      {pastMeetings.length > 0 && (
        <section className="col" style={{ gap: 10, marginTop: 24 }}>
          <strong style={{ fontSize: 14 }}>Past</strong>
          {pastMeetings.slice(0, 10).map((meeting) => (
            <div key={meeting.id} className="row spread meeting-row">
              <div className="row" style={{ gap: 10, minWidth: 0 }}>
                <Avatar name={meeting.name} size={32} />
                <div className="col" style={{ minWidth: 0 }}>
                  <span style={{ fontWeight: 800, fontSize: 13.5 }} className="ellip">{meeting.title}</span>
                  <span className="muted ellip" style={{ fontSize: 12 }}>
                    {meeting.name}{meeting.companyLine ? ` · ${meeting.companyLine}` : ""} · {meeting.scheduled.toLocaleDateString()}
                  </span>
                </div>
              </div>
              <span className="badge" style={{ background: STATUS_STYLES[meeting.status]?.bg, color: STATUS_STYLES[meeting.status]?.color }}>
                {STATUS_STYLES[meeting.status]?.label ?? meeting.status}
              </span>
            </div>
          ))}
        </section>
      )}

      {meetingCount === 0 && (
        <div className="empty-state">
          <Icon name="calendar" size={42} color="var(--faint)" />
          <p>No meetings booked yet</p>
          <span>Once a call leads to a booking, it'll show up here automatically.</span>
        </div>
      )}
    </div>
  );
}
