"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Icon from "../ui/Icon";
import api from "../../lib/api";
import { VOICES } from "../../lib/onboarding-data";

const WAVE = [8, 16, 22, 12, 18, 9];

let voicesRequest = null;
/** Retell voices with samples, fetched once per page load. */
export function useVoices() {
  const [state, setState] = useState({ voices: [], loading: true, failed: false });
  useEffect(() => {
    let alive = true;
    voicesRequest = voicesRequest || api.get("/voice/voices").then(({ data }) => data?.voices || []);
    voicesRequest
      .then(voices => alive && setState({ voices, loading: false, failed: false }))
      .catch(() => { voicesRequest = null; if (alive) setState({ voices: [], loading: false, failed: true }); });
    return () => { alive = false; };
  }, []);
  return state;
}

/** One shared player, so starting a sample stops the one already playing. */
export function usePreviewPlayer() {
  const audio = useRef(null);
  const [playing, setPlaying] = useState("");
  useEffect(() => () => audio.current?.pause(), []);
  const toggle = voice => {
    if (playing === voice.id) { audio.current?.pause(); setPlaying(""); return; }
    audio.current?.pause();
    const next = new Audio(voice.previewUrl);
    next.onended = () => setPlaying("");
    next.onerror = () => setPlaying("");
    audio.current = next;
    setPlaying(voice.id);
    next.play().catch(() => setPlaying(""));
  };
  return { playing, toggle };
}

export function describeVoice(v) {
  return [v.gender === "female" ? "Female" : "Male", v.accent, v.age].filter(Boolean).join(" · ");
}

function VoiceCard({ v, on, playing, onPick, onPlay }) {
  const pick = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPick(); } };
  return (
    <div role="radio" aria-checked={on} tabIndex={0} className={`vc ${on ? "on" : ""}`} onClick={onPick} onKeyDown={pick}>
      <button type="button" className="play" aria-label={playing ? `Stop ${v.name}` : `Play ${v.name}`}
        onClick={e => { e.stopPropagation(); onPlay(); }} onKeyDown={e => e.stopPropagation()}>
        <Icon name={playing ? "pause" : "play"} size={15} />
      </button>
      <span style={{ minWidth: 0 }}><b>{v.name}</b><span className="d">{describeVoice(v)}</span></span>
      <span className={`wave ${playing ? "go" : ""}`} aria-hidden="true">{WAVE.map((h, i) => <i key={i} style={{ height: h }} />)}</span>
    </div>
  );
}

/** Four good starting voices: two female, two male, the picked one first. */
function suggested(voices, pickedId) {
  const picked = voices.find(v => v.id === pickedId);
  const rest = voices.filter(v => v.id !== pickedId);
  const female = rest.filter(v => v.gender === "female").slice(0, 2);
  const male = rest.filter(v => v.gender === "male").slice(0, 2);
  return [picked, ...female, ...male].filter(Boolean).slice(0, 4);
}

export default function VoicePicker({ d, set }) {
  const { voices, loading, failed } = useVoices();
  const { playing, toggle } = usePreviewPlayer();
  const [browsing, setBrowsing] = useState(false);
  const [gender, setGender] = useState("any");
  const [accent, setAccent] = useState("any");
  const [q, setQ] = useState("");

  // Start with a real voice selected once the list arrives.
  useEffect(() => {
    if (!d.voiceId && voices.length) {
      const first = suggested(voices, "")[0];
      if (first) { set("voiceId", first.id); set("voiceName", first.name); }
    }
  }, [voices, d.voiceId, set]);

  const accents = useMemo(() => Array.from(new Set(voices.map(v => v.accent).filter(Boolean))).sort(), [voices]);
  const filtered = voices.filter(v => (gender === "any" || v.gender === gender)
    && (accent === "any" || v.accent === accent)
    && (!q.trim() || v.name.toLowerCase().includes(q.trim().toLowerCase())));
  const pick = v => { set("voiceId", v.id); set("voiceName", v.name); };

  if (loading) return <span className="hint">Loading voices…</span>;

  // No voice list (Retell unreachable): fall back to picking a style. The
  // team matches the exact voice when the calling number is set up.
  if (failed || voices.length === 0) {
    return (
      <>
        <div className="voices" role="radiogroup" aria-label="Voice">
          {VOICES.map(v => {
            const on = d.voice === v.id;
            return (
              <button type="button" role="radio" aria-checked={on} key={v.id} className={`vc ${on ? "on" : ""}`} onClick={() => set("voice", v.id)}>
                <span className="vc-ic" aria-hidden="true"><Icon name="mic" size={18} stroke={2} /></span>
                <span><b>{v.name}</b><span className="d">{v.desc}</span></span>
                <span className="wave" aria-hidden="true">{WAVE.map((h, i) => <i key={i} style={{ height: h }} />)}</span>
              </button>
            );
          })}
        </div>
        <span className="hint">Voice samples could not load right now. Pick a style and our team matches the exact voice.</span>
      </>
    );
  }

  return (
    <>
      <div className="voices" role="radiogroup" aria-label="Voice">
        {suggested(voices, d.voiceId).map(v => (
          <VoiceCard key={v.id} v={v} on={d.voiceId === v.id} playing={playing === v.id} onPick={() => pick(v)} onPlay={() => toggle(v)} />
        ))}
        <button type="button" className={`vc cu ${browsing ? "on" : ""}`} aria-expanded={browsing} onClick={() => setBrowsing(b => !b)}>
          <span className="vc-ic" aria-hidden="true"><Icon name="search" size={17} stroke={2} /></span>
          <span><b>{browsing ? "Hide all voices" : "+ Browse all voices"}</b><span className="d">{voices.length} voices · filter by gender and accent</span></span>
        </button>
      </div>
      {browsing && (
        <div className="cus">
          <div className="chips">
            <label className="pk-search" style={{ flex: "1 1 180px", height: 40 }}><Icon name="search" size={15} stroke={2} />
              <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by name" aria-label="Search voices" />
            </label>
            <select className="sel" style={{ minWidth: 130 }} value={gender} onChange={e => setGender(e.target.value)} aria-label="Gender">
              <option value="any">Any gender</option><option value="female">Female</option><option value="male">Male</option>
            </select>
            {accents.length > 0 && (
              <select className="sel" style={{ minWidth: 150 }} value={accent} onChange={e => setAccent(e.target.value)} aria-label="Accent">
                <option value="any">Any accent</option>
                {accents.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            )}
          </div>
          <div className="voices" role="radiogroup" aria-label="All voices" style={{ maxHeight: 380, overflowY: "auto", padding: 2 }}>
            {filtered.map(v => (
              <VoiceCard key={v.id} v={v} on={d.voiceId === v.id} playing={playing === v.id} onPick={() => pick(v)} onPlay={() => toggle(v)} />
            ))}
            {filtered.length === 0 && <span className="hint">No voices match these filters.</span>}
          </div>
        </div>
      )}
    </>
  );
}
