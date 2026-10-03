"use client";
import React from "react";
import Logo from "../../ui/Logo";
import Icon from "../../ui/Icon";
import Avatar from "../../ui/Avatar";
import { WORKSPACE_USER, DRAFTS, AGENT_STEPS, OWEN_CALL, photoFor } from "./demoData";
import { ProspectsScreen, LeadModal, CampaignsScreen, CallsScreen, CallModal, InboxScreen, CalendarScreen, AgentScreen, CompactContext } from "./screens";

// Hero product demo: a cursor walks through copies of the real app screens
// while a camera zooms in on the moment that matters in each one.
//
// Each scene is a list of timed steps. A step can move the cursor to a
// `data-hd` target, click, zoom the camera onto a target (or back out with
// `zoom: null`), and merge `set` into the scene's flags. The last step of a
// scene clicks the next page in the sidebar and hands over with `next`.
//
// The screens are drawn at full app size on a fixed-size stage and scaled down
// to fit the frame, so they use the product's own CSS unchanged.

const NAV = [
  { label: null, items: [["dashboard", "Dashboard", "grid"], ["setup", "Get set up", "checkCircle"], ["agent", "AI Agent", "spark"]] },
  { label: "Sales", items: [["prospects", "Prospects", "users"], ["pipeline", "Pipeline", "funnel"], ["campaigns", "Campaigns", "send"]] },
  { label: "Communication", items: [["inbox", "Inbox", "inbox"], ["calls", "Call History", "phone"], ["calendar", "Calendar", "calendar"]] },
  { label: "Insights", items: [["analytics", "Analytics", "trend"]] },
];

const approveSteps = (at) => DRAFTS.map((_, i) => ({ at: at + i * 120, set: { approvedN: i + 1 } }));
const transcriptSteps = (at) => OWEN_CALL.transcript.map((_, i) => ({ at: at + i * 560, set: { lines: i + 1 } }));
const agentSteps = (at) => AGENT_STEPS.map((_, i) => ({ at: at + i * 520, set: { steps: i + 1 } }));

const SCENES = [
  {
    nav: "prospects",
    label: "Prospects",
    Screen: ProspectsScreen,
    final: { sorted: true },
    steps: [
      { at: 300, cursor: "sort" },
      { at: 1000, click: true, set: { sortOpen: true } },
      { at: 1300, cursor: "sort-score" },
      { at: 1850, click: true, set: { sortOpen: false, sorted: true } },
      { at: 2700, cursor: "lead-top" },
      { at: 3200, click: true, set: { open: true } },
      { at: 3450, zoom: "lead-modal-top", scale: 1.35 },
      { at: 5500, zoom: null },
      { at: 5600, cursor: "modal-close" },
      { at: 6100, click: true, set: { open: false } },
      { at: 6500, cursor: "nav-campaigns" },
      { at: 7100, click: true, next: true },
    ],
  },
  {
    // Calls come first: open the voice campaign and call a lead right now.
    nav: "campaigns",
    label: "Campaigns",
    Screen: CampaignsScreen,
    final: { view: "voice", calling: true },
    steps: [
      { at: 300, cursor: "camp-voice" },
      { at: 900, click: true, set: { view: "voice" } },
      { at: 1600, cursor: "call-now" },
      { at: 2200, click: true, set: { pressCall: true } },
      { at: 2400, set: { pressCall: false, calling: true, toast: true } },
      { at: 4000, set: { toast: false } },
      { at: 4300, cursor: "nav-calls" },
      { at: 4900, click: true, next: true },
    ],
  },
  {
    nav: "calls",
    label: "Call History",
    Screen: CallsScreen,
    final: { done: true, outcome: true },
    steps: [
      { at: 300, cursor: "call-owen" },
      { at: 1600, set: { done: true } },
      { at: 2400, set: { outcome: true } },
      { at: 2900, cursor: "call-details" },
      { at: 3400, click: true, set: { pressDetails: true } },
      { at: 3600, set: { pressDetails: false, open: true } },
      { at: 3900, zoom: "call-summary", scale: 1.3 },
      { at: 5400, set: { callScroll: 430 }, zoom: "call-transcript", scale: 1.25 },
      ...transcriptSteps(5800),
      { at: 9800, zoom: null },
      { at: 10000, cursor: "call-close" },
      { at: 10500, click: true, set: { open: false } },
      { at: 10900, cursor: "nav-campaigns" },
      { at: 11500, click: true, next: true },
    ],
  },
  {
    // Then email: open the email campaign, read a draft, approve them all.
    nav: "campaigns",
    label: "Campaigns",
    Screen: CampaignsScreen,
    final: { view: "detail", approvedN: DRAFTS.length },
    steps: [
      { at: 300, cursor: "camp-top" },
      { at: 900, click: true, set: { view: "detail" } },
      { at: 1600, cursor: "draft-top" },
      { at: 2100, click: true, set: { expanded: true } },
      { at: 2350, set: { scroll: 250 } },
      { at: 2600, zoom: "draft-body", scale: 1.15 },
      { at: 4700, zoom: null, set: { scroll: 0 } },
      { at: 4900, cursor: "approve-all" },
      { at: 5500, click: true, set: { pressApprove: true } },
      ...approveSteps(5700),
      { at: 7000, cursor: "nav-inbox" },
      { at: 7600, click: true, next: true },
    ],
  },
  {
    nav: "inbox",
    label: "Inbox",
    Screen: InboxScreen,
    final: { filter: "replies", sent: true },
    steps: [
      { at: 300, cursor: "filter-replies" },
      { at: 900, click: true, set: { filter: "replies" } },
      { at: 1500, cursor: "reply-in" },
      { at: 2300, cursor: "draft-btn" },
      { at: 2800, click: true, set: { drafting: true }, zoom: "composer", scale: 1.4, pinBottom: true },
      { at: 3500, set: { typing: true } },
      { at: 5900, set: { typed: true } },
      { at: 6200, cursor: "send" },
      { at: 6700, click: true, zoom: null, set: { sent: true } },
      { at: 7600, cursor: "nav-calendar" },
      { at: 8200, click: true, next: true },
    ],
  },
  {
    nav: "calendar",
    label: "Calendar",
    Screen: CalendarScreen,
    final: { newMeeting: true },
    steps: [
      { at: 400, cursor: "thu" },
      { at: 900, set: { newMeeting: true } },
      { at: 1300, zoom: "new-meeting", scale: 1.7 },
      { at: 1700, cursor: "join" },
      { at: 3800, zoom: null },
      { at: 4300, cursor: "nav-agent" },
      { at: 4900, click: true, next: true },
    ],
  },
  {
    nav: "agent",
    label: "AI Agent",
    Screen: AgentScreen,
    final: { attached: true, sent: true, typed: true, steps: AGENT_STEPS.length, approval: true, approved: true, created: true, preparing: true },
    steps: [
      { at: 300, cursor: "attach" },
      { at: 900, click: true, set: { pressAttach: true, pickerOpen: true } },
      { at: 1100, set: { pressAttach: false } },
      { at: 1300, zoom: "picker", scale: 1.3 },
      { at: 1500, cursor: "pick-file" },
      { at: 2100, click: true, set: { pickerSelected: true } },
      { at: 2500, cursor: "pick-open" },
      { at: 3000, click: true, zoom: null, set: { pickerOpen: false, attached: true } },
      { at: 3500, cursor: "agent-input" },
      { at: 4000, click: true, set: { typing: true } },
      { at: 5600, set: { typed: true } },
      { at: 5700, cursor: "agent-send" },
      { at: 6200, click: true, set: { sent: true } },
      ...agentSteps(6900),
      { at: 7100, zoom: "agent-steps", scale: 1.5 },
      { at: 9100, set: { approval: true }, zoom: "approval", scale: 1.5 },
      { at: 9500, cursor: "proceed" },
      { at: 10100, click: true, set: { pressProceed: true } },
      { at: 10300, set: { approved: true } },
      { at: 10800, set: { created: true }, zoom: "campaign-created", scale: 1.5 },
      { at: 11500, cursor: "prepare" },
      { at: 12100, click: true, set: { pressPrepare: true } },
      { at: 12300, set: { pressPrepare: false, preparing: true } },
      { at: 13600, zoom: null },
      { at: 14000, cursor: "nav-prospects" },
      { at: 14600, click: true, next: true },
    ],
  },
];

// On phones there is no sidebar: every page change opens the real ☰ menu
// first, then taps the page in it. The added taps push later steps back.
// Moving to a target can also scroll the page, so a tap waits until that
// scroll has settled instead of landing while the page is still moving.
const PHONE_SETTLE = 1000;
const PHONE_WIDTH = 390;
function phoneSteps(steps) {
  let shift = 0;
  let lastMove = -Infinity;
  return steps.flatMap(step => {
    let at = step.at + shift;
    if (step.click && at - lastMove < PHONE_SETTLE) {
      shift += PHONE_SETTLE - (at - lastMove);
      at = lastMove + PHONE_SETTLE;
    }
    if (step.cursor) lastMove = at;
    if (step.cursor?.startsWith("nav-")) {
      // The ☰ button is at the top, so reaching it can scroll the page up.
      shift += 1500;
      lastMove = at + 1500;
      return [
        { ...step, cursor: "menu-btn", at },
        { at: at + 950, click: true, menu: true },
        { ...step, at: at + 1500 },
      ];
    }
    return [{ ...step, at }];
  });
}

// Position of a data-hd target in stage coordinates. offsetLeft/Top ignore
// CSS transforms, so the camera zoom does not disturb the measurement; the
// few elements the demo moves with transforms say by how much in data-hd-dy.
function measure(camera, key) {
  // The same target can exist twice (desktop table row and phone card); use
  // the one that is actually showing.
  const el = [...(camera?.querySelectorAll(`[data-hd="${key}"]`) || [])].find(node => node.offsetParent);
  if (!el) return null;
  let x = 0;
  let y = 0;
  let node = el;
  while (node && node !== camera) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent;
  }
  for (let n = el; n && n !== camera; n = n.parentElement) {
    if (n.dataset?.hdDy) y += Number(n.dataset.hdDy);
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight };
}

function Cursor({ cursorRef, clicking }) {
  return (
    <div ref={cursorRef} className={`hd-cursor ${clicking ? "is-clicking" : ""}`} aria-hidden="true">
      <svg width="26" height="26" viewBox="0 0 24 24">
        <path d="M4 2.5 19.5 12l-6.6 1.6 3.9 7.2-2.9 1.5-3.8-7.3L4 19.8Z" fill="#0a1712" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export default function HeroDemo({ intro = false, onLoopEnd, onSkip }) {
  const shellRef = React.useRef(null);
  const cameraRef = React.useRef(null);
  const cursorRef = React.useRef(null);
  const timers = React.useRef([]);
  const sceneRef = React.useRef(0);
  const visibleRef = React.useRef(false);
  const onLoopEndRef = React.useRef(onLoopEnd);
  onLoopEndRef.current = onLoopEnd;

  const [scene, setScene] = React.useState(0);
  const [run, setRun] = React.useState(0);
  const [flags, setFlags] = React.useState({});
  const [cursorKey, setCursorKey] = React.useState(null);
  const [zoom, setZoom] = React.useState({ key: null, scale: 1 });
  const [click, setClick] = React.useState({ n: 0, x: 0, y: 0 });
  const [clicking, setClicking] = React.useState(false);
  const [reduced, setReduced] = React.useState(false);
  const [frame, setFrame] = React.useState({ scale: 1, width: 1400, height: 640, compact: false });
  const [menuOpen, setMenuOpen] = React.useState(false);
  const compactRef = React.useRef(false);
  const scrollRef = React.useRef(0);
  const pageRef = React.useRef(null);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const play = React.useCallback((index) => {
    clearTimers();
    const def = SCENES[index];
    sceneRef.current = index;
    setScene(index);
    setRun(r => r + 1);
    setFlags({});
    setZoom({ key: null, scale: 1 });
    setMenuOpen(false);

    (compactRef.current ? phoneSteps(def.steps) : def.steps).forEach(step => {
      timers.current.push(setTimeout(() => {
        if (step.set) setFlags(prev => ({ ...prev, ...step.set }));
        if (step.menu) setMenuOpen(true);
        if (step.cursor) setCursorKey(step.cursor);
        if ("zoom" in step) setZoom({ key: step.zoom, scale: step.scale || 1, pinBottom: Boolean(step.pinBottom) });
        if (step.click) {
          setClicking(true);
          timers.current.push(setTimeout(() => setClicking(false), 160));
          const cursor = cursorRef.current;
          if (cursor) setClick(c => ({ n: c.n + 1, x: cursor._x || 0, y: cursor._y || 0 }));
        }
        if (step.next) {
          if (index === SCENES.length - 1) onLoopEndRef.current?.();
          play((index + 1) % SCENES.length);
        }
      }, step.at));
    });
  }, []);

  const showStill = (index) => {
    clearTimers();
    sceneRef.current = index;
    setScene(index);
    setFlags(SCENES[index].final);
    setZoom({ key: null, scale: 1 });
  };

  // Reduced motion: no cursor, no zoom, the finished AI Agent screen.
  React.useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(isReduced);
    if (isReduced) showStill(SCENES.length - 1);
    return clearTimers;
  }, []);

  // Only plays while on screen; coming back restarts the current scene.
  React.useEffect(() => {
    if (reduced || !shellRef.current || typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !visibleRef.current) {
        visibleRef.current = true;
        play(sceneRef.current);
      } else if (!entry.isIntersecting && visibleRef.current) {
        visibleRef.current = false;
        clearTimers();
      }
    }, { threshold: 0.25 });
    observer.observe(shellRef.current);
    return () => observer.disconnect();
  }, [reduced, play]);

  // Fit the fixed-size stage into the frame. Phones get a narrower stage
  // without the sidebar so the text stays readable.
  React.useEffect(() => {
    const shell = shellRef.current;
    if (!shell || typeof ResizeObserver === "undefined") return undefined;
    const fit = () => {
      const w = shell.clientWidth;
      const h = shell.clientHeight;
      // Phones and small tablets see the app's own phone layout at real size;
      // the app's CSS switches to it at the same 900px breakpoint.
      // A frame narrower than a real phone (the intro frame on a phone is
      // ~330px) still gets a 390px page, scaled down, so nothing is squeezed.
      const compact = window.innerWidth <= 900;
      compactRef.current = compact;
      const width = compact ? Math.max(w, PHONE_WIDTH) : 1400;
      const scale = w / width;
      setFrame({ scale, width, height: Math.ceil(h / scale), compact });
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(shell);
    return () => observer.disconnect();
  }, []);

  // On phones, content that grows on its own (a reply typing itself) changes
  // the page height without a step; re-aim the camera when that happens.
  const [, setGrowth] = React.useState(0);
  React.useEffect(() => {
    const camera = cameraRef.current;
    if (!frame.compact || !camera || typeof ResizeObserver === "undefined") return undefined;
    const observer = new ResizeObserver(() => setGrowth(n => n + 1));
    observer.observe(camera);
    return () => observer.disconnect();
  }, [frame.compact]);

  // Aim the cursor and the camera after every render, so targets that moved
  // (a row that sorted, an email that expanded) are followed.
  React.useLayoutEffect(() => {
    const camera = cameraRef.current;
    const cursor = cursorRef.current;
    if (!camera) return;

    // Phones: no zoom. The page scrolls so whatever matters stays in view;
    // windows that open on top (lead, call, file picker) sit in that view.
    if (frame.compact) {
      const modalOpen = Boolean(flags.open || flags.pickerOpen);
      const focus = zoom.key || cursorKey;
      const box = focus ? measure(camera, focus) : null;
      // A new page (next scene, or a campaign opening) starts at the top at
      // once, like a phone, instead of visibly scrolling up over the old one.
      const page = `${run}-${flags.view || ""}`;
      const newPage = page !== pageRef.current;
      pageRef.current = page;
      if (newPage) scrollRef.current = 0;
      if (!modalOpen) {
        const H = frame.height;
        const content = camera.scrollHeight;
        let y = scrollRef.current;
        if (!box) {
          // The target is gone (a menu closed): stay where we are.
        } else if (zoom.pinBottom) {
          // Some moments (a reply being drafted) pin the page to its bottom.
          y = H - content;
        } else {
          // Scroll only as far as needed to bring the focus into view, keeping
          // its bottom visible (a reply that grows while it types) and, when it
          // fits, its top too.
          const bottom = box.y + box.h + y;
          if (bottom > H * 0.9) y -= bottom - H * 0.9;
          if (box.h < H * 0.8 && box.y + y < H * 0.08) y = H * 0.08 - box.y;
        }
        scrollRef.current = Math.min(0, Math.max(Math.min(0, H - content), y));
      }
      if (newPage) {
        camera.style.transition = "none";
        camera.style.transform = `translateY(${scrollRef.current}px)`;
        void camera.offsetHeight;
        camera.style.transition = "";
      }
      camera.style.transform = `translateY(${scrollRef.current}px)`;
      camera.style.setProperty("--hd-view-top", `${-scrollRef.current}px`);
      camera.style.setProperty("--hd-view-h", `${frame.height}px`);
      const tap = cursorKey ? measure(camera, cursorKey) : null;
      if (cursor && tap) {
        const x = tap.x + Math.min(tap.w / 2, 80);
        const y = tap.y + tap.h / 2;
        cursor._x = x;
        cursor._y = y;
        cursor.style.transform = `translate(${x}px, ${y}px)`;
      }
      return;
    }

    if (cursor && cursorKey) {
      const box = measure(camera, cursorKey);
      if (box) {
        const x = box.x + Math.min(box.w / 2, 120);
        const y = box.y + box.h / 2;
        cursor._x = x;
        cursor._y = y;
        cursor.style.transform = `translate(${x}px, ${y}px)`;
      }
    }

    const box = zoom.key ? measure(camera, zoom.key) : null;
    if (!box) {
      camera.style.transform = "translate(0px, 0px) scale(1)";
      return;
    }
    const { width: W, height: H, compact } = frame;
    const s = zoom.scale * (compact ? 1.2 : 1);
    const cx = box.x + box.w / 2;
    const cy = box.y + box.h / 2;
    const tx = Math.min(0, Math.max(W - W * s, W / 2 - cx * s));
    const ty = Math.min(0, Math.max(H - H * s, H / 2 - cy * s));
    camera.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`;
  });

  const def = SCENES[scene];
  const Screen = def.Screen;
  const skip = (
    <button type="button" className={`hd-skip ${frame.compact ? "is-below" : ""}`} onClick={onSkip}>
      Skip intro <Icon name="arrow" size={13} />
    </button>
  );

  return (
    <CompactContext.Provider value={frame.compact}>
      <div id="product" ref={shellRef} className="landing-product-shell hd-shell" aria-label="GNX Sales product tour" role="group">
        <div
          className={`hd-stage ${frame.compact ? "is-compact" : ""}`}
          style={{ width: frame.width, height: frame.height, transform: `scale(${frame.scale})` }}
          aria-hidden="true"
          inert
        >
          <div ref={cameraRef} className="hd-camera">
            {!frame.compact && (
              <aside className="hd-sidebar">
                <div style={{ padding: "4px 6px 16px" }}><Logo size={28} /></div>
                <span className="btn btn-primary btn-sm" style={{ marginBottom: 14, fontSize: 13.5 }}>
                  <Icon name="plus" size={15} color="#06231a" /> New campaign
                </span>
                {NAV.map((group, gi) => (
                  <div key={gi} style={{ marginBottom: 4 }}>
                    {group.label && <div className="hd-nav-label">{group.label}</div>}
                    {group.items.map(([id, label, ico]) => {
                      const active = id === def.nav;
                      return (
                        <div key={id} data-hd={`nav-${id}`} className={`hd-nav-item ${active ? "is-active" : ""}`}>
                          <Icon name={ico} size={18} color={active ? "var(--g-600)" : "var(--muted)"} />
                          <span className="nw">{label}</span>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </aside>
            )}

            {frame.compact && (
              <aside className="app-shell-sidebar hd-phone-bar">
                <div className="app-shell-brand"><Logo size={28} /></div>
                <span data-hd="menu-btn" className="app-shell-menu-btn"><Icon name={menuOpen ? "close" : "menu"} size={22} /></span>
                <div className={`app-shell-mobile-drawer ${menuOpen ? "is-open" : ""}`}>
                  {NAV.map((group, gi) => (
                    <div key={gi} className="app-shell-mobile-group">
                      {group.label && <div className="app-shell-mobile-label">{group.label}</div>}
                      {group.items.map(([id, label, ico]) => (
                        <span key={id} data-hd={`nav-${id}`} className={`app-shell-mobile-item ${id === def.nav ? "is-active" : ""}`}>
                          <Icon name={ico} size={18} color={id === def.nav ? "var(--g-600)" : "var(--muted)"} />
                          <span>{label}</span>
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </aside>
            )}

            <div className="hd-main">
              <header className="row spread hd-header">
                <div className="input-wrap app-shell-search">
                  <span className="lead-ico"><Icon name="search" size={17} /></span>
                  <div className="input has-ico hd-fake-input" style={{ height: 40, background: "var(--bg)", fontSize: 14 }}>Search leads, accounts, replies…</div>
                </div>
                <div className="row" style={{ gap: 14 }}>
                  <span style={{ position: "relative", color: "var(--ink-2)", display: "block" }}>
                    <Icon name="inbox" size={20} />
                    <span className="hd-bell-count">7</span>
                  </span>
                  <div className="row" style={{ gap: 9 }}>
                    <Avatar name={WORKSPACE_USER.name} src={photoFor(WORKSPACE_USER.name)} size={34} />
                    {!frame.compact && (
                      <div className="col" style={{ lineHeight: 1.2 }}>
                        <span style={{ fontWeight: 800, fontSize: 13.5 }}>{WORKSPACE_USER.name}</span>
                        <span className="faint" style={{ fontSize: 11.5 }}>{WORKSPACE_USER.org}</span>
                      </div>
                    )}
                  </div>
                </div>
              </header>
              <div key={`${scene}-${run}`} className="hd-screen">
                <Screen f={flags} />
              </div>
            </div>

            {def.nav === "prospects" && <LeadModal open={Boolean(flags.open)} />}
            {def.nav === "calls" && <CallModal open={Boolean(flags.open)} scroll={flags.callScroll || 0} lines={flags.lines || 0} />}

            {!reduced && <Cursor cursorRef={cursorRef} clicking={clicking} />}
            {click.n > 0 && !reduced && (
              <span key={click.n} className="hd-ripple" style={{ left: click.x, top: click.y }} />
            )}
          </div>
        </div>
        {intro && !frame.compact && skip}
      </div>
      {/* Phones: below the frame, where it does not cover the small screen. */}
      {intro && frame.compact && skip}
    </CompactContext.Provider>
  );
}
