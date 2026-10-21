"use client";
import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Logo from "../ui/Logo";
import Icon from "../ui/Icon";
import Avatar from "../ui/Avatar";
import AskNexoDrawer from "./AskNexoDrawer";
import api from "../../lib/api";
import { hasWorkspaceAccess } from "../../lib/billingAccess";
import { canSee, pageKeyForPath, RoleContext } from "../../lib/access";
import { FREE_PLAN, isFreePlan, OrgContext, upgradePlan } from "../../lib/free-plan";

function FreePlanUsage({ usage, onUpgrade }) {
  const meters = [
    ["Emails sent", usage?.emailsSent, FREE_PLAN.monthlyAiEmails],
    ["Leads", usage?.savedLeads, FREE_PLAN.maxLeads],
  ];
  return (
    <div style={{ margin: '10px 0 4px', padding: 14, borderRadius: 14, background: 'var(--bg)', border: '1px solid var(--line)', flex: 'none' }}>
      <div className="row spread" style={{ alignItems: 'baseline' }}>
        <strong style={{ fontSize: 13 }}>Free plan</strong>
      </div>
      {meters.map(([label, used, limit]) => (
        <div key={label} style={{ marginTop: 10 }}>
          <div className="row spread" style={{ fontSize: 12 }}>
            <span style={{ color: 'var(--muted)', fontWeight: 700 }}>{label}</span>
            <strong>{used ?? '–'} / {limit}</strong>
          </div>
          <div style={{ height: 6, borderRadius: 99, background: '#e3ebe6', overflow: 'hidden', marginTop: 5 }}>
            <div style={{ height: '100%', width: `${Math.min(100, ((used ?? 0) / limit) * 100)}%`, borderRadius: 99, background: 'linear-gradient(90deg,#29d68f,#00a86b)' }} />
          </div>
        </div>
      ))}
      <button type="button" className="btn btn-primary btn-sm btn-block" style={{ marginTop: 12, height: 34, fontSize: 12.5 }} onClick={onUpgrade}>
        <Icon name="star" size={13} color="#06231a" /> Upgrade to {upgradePlan()?.name}
      </button>
    </div>
  );
}

const NAV_GROUPS = [
  {
    label: null,
    items: [
      { id: 'dashboard', label: 'Dashboard', ico: 'grid' },
      { id: 'setup', label: 'Get set up', ico: 'checkCircle' },
      { id: 'agent', label: 'AI Agent', ico: 'spark' },
    ]
  },
  {
    label: 'Sales',
    items: [
      { id: 'prospects', label: 'Prospects', ico: 'users' },
      { id: 'pipeline', label: 'Pipeline', ico: 'funnel' },
      { id: 'campaigns', label: 'Campaigns', ico: 'send' },
    ]
  },
  {
    label: 'Communication',
    items: [
      { id: 'inbox', label: 'Inbox', ico: 'inbox' },
      { id: 'calls', label: 'Call History', ico: 'phone' },
      { id: 'calendar', label: 'Calendar', ico: 'calendar' },
    ]
  },
  {
    label: 'Insights',
    items: [
      { id: 'analytics', label: 'Analytics', ico: 'trend' },
    ]
  },
  {
    label: 'Account',
    items: [
      { id: 'billing', label: 'Billing', ico: 'star' },
      { id: 'settings', label: 'Settings', ico: 'sliders' },
      { id: 'settings/team', label: 'Team', ico: 'users' },
      { id: 'support', label: 'Support', ico: 'chat' },
    ]
  },
];

// Phone-width bottom bar. Everything else stays in the More drawer.
const MOBILE_TABS = [
  { id: 'dashboard', label: 'Home', ico: 'grid' },
  { id: 'prospects', label: 'Leads', ico: 'users' },
  { id: 'inbox', label: 'Inbox', ico: 'inbox' },
  { id: 'campaigns', label: 'Campaigns', ico: 'send' },
];

// Routes an unpaid account may still reach inside the shell. /billing is not
// one of them anymore. Accounts without entitlement are sent to the
// standalone /subscribe checkout, which renders outside this shell entirely.
const BILLING_ALLOWED_PATHS = ['/support'];

export default function AppShell({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const activeTab = pathname.startsWith('/settings/team') ? 'settings/team' : pathname.split('/')[1] || 'dashboard';
  const [user, setUser] = useState(null);
  const [org, setOrg] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notifications, setNotifications] = useState({ items: [], unreadCount: 0 });
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [freeUsage, setFreeUsage] = useState(null);
  const [askOpen, setAskOpen] = useState(false);
  const [agentName, setAgentName] = useState('Nexo');
  const notificationsRef = useRef(null);

  useEffect(() => {
    let active = true;
    setAuthChecked(false);
    const next = encodeURIComponent(pathname || '/dashboard');
    const redirectToLogin = () => {
      if (!active) return;
      setUser(null);
      setOrg(null);
      setAuthChecked(true);
      router.replace(`/login?next=${next}`);
    };
    const timeoutId = window.setTimeout(redirectToLogin, 8000);

    api.get('/auth/me')
      .then(res => {
        if (!active) return;
        setUser(res.data.user);
        setOrg(res.data.organization);
      })
      .catch(redirectToLogin)
      .finally(() => {
        window.clearTimeout(timeoutId);
        if (active) setAuthChecked(true);
      });

    return () => {
      active = false;
      window.clearTimeout(timeoutId);
    };
  }, [pathname, router]);

  useEffect(() => {
    setMobileNavOpen(false);
    setNotificationsOpen(false);
    setAskOpen(false);
  }, [pathname]);

  // One dashboard read feeds both the agent's display name and, on the Free
  // plan, the sidebar usage meters. Re-read on navigation so the meters move.
  const userId = user?.id;
  const orgPlanId = org?.plan_id;
  useEffect(() => {
    if (!userId) return undefined;
    let active = true;
    api.get('/dashboard')
      .then(res => {
        if (!active) return;
        if (res.data?.agentName) setAgentName(res.data.agentName);
        if (orgPlanId === 'free') setFreeUsage(res.data?.kpis ?? null);
      })
      .catch(() => {});
    return () => { active = false; };
  }, [userId, orgPlanId, orgPlanId === 'free' ? pathname : null]);

  // Polled rather than pushed. The feed is derived from the drafts themselves,
  // so a poll is always current and a send made in another tab clears the bell
  // here without anything having to tell it. Sixty seconds is well inside the
  // time it takes a customer to notice a pile of emails is waiting.
  useEffect(() => {
    if (!authChecked || !user) return undefined;

    let active = true;
    const load = () => {
      if (document.visibilityState !== 'visible') return;
      api.get('/notifications')
        .then(res => { if (active) setNotifications(res.data ?? { items: [], unreadCount: 0 }); })
        // A bell that cannot load is not worth an error state: it is ambient
        // information, and the campaign screen carries the same counts.
        .catch(() => {});
    };

    load();
    const timer = window.setInterval(load, 60000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [authChecked, user, pathname]);

  useEffect(() => {
    if (!notificationsOpen) return undefined;
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [notificationsOpen]);

  // The product tour anchors several steps to sidebar items. On a narrow
  // viewport those only exist inside the mobile drawer, so the tour asks for it
  // to be opened rather than falling back to a targetless card.
  useEffect(() => {
    const handleTourNav = (event) => setMobileNavOpen(Boolean(event.detail?.open));
    window.addEventListener('gnx:tour:nav', handleTourNav);
    return () => window.removeEventListener('gnx:tour:nav', handleTourNav);
  }, []);

  const freePlan = isFreePlan(org);


  const paymentRequired = Boolean(
    authChecked
      && user
      && org
      && user.membership_status !== 'plan_suspended'
      && !freePlan
      && !hasWorkspaceAccess(user, org),
  );
  const billingRouteAllowed = BILLING_ALLOWED_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));

  useEffect(() => {
    if (paymentRequired && !billingRouteAllowed) {
      router.replace('/subscribe');
    }
  }, [paymentRequired, billingRouteAllowed, router]);

  // Pages hidden from this role send the person to the Dashboard.
  const role = user?.role ?? null;
  const pageKey = pageKeyForPath(pathname);
  const pageHidden = Boolean(authChecked && user && pageKey && !canSee(role, pageKey));
  const navGroups = NAV_GROUPS
    .map(g => ({ ...g, items: g.items.filter(n => canSee(role, `page.${n.id}`)) }))
    .filter(g => g.items.length > 0);

  useEffect(() => {
    if (pageHidden) router.replace('/dashboard');
  }, [pageHidden, router]);

  const userName = user
    ? [user.first_name, user.last_name].filter(Boolean).join(' ') || 'User'
    : '';
  const orgName = org?.name || '';
  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {}
    window.location.href = '/login';
  };

  const goTo = (path) => {
    setMobileNavOpen(false);
    router.push(path);
  };

  if (!authChecked) {
    return (
      <div className="screen app-shell-screen" style={{ display: 'grid', placeItems: 'center', background: 'var(--bg)' }}>
        <p className="muted">Checking session...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="screen app-shell-screen" style={{ display: 'grid', placeItems: 'center', background: 'var(--bg)' }}>
        <p className="muted">Redirecting to login...</p>
      </div>
    );
  }

  if (user.membership_status === 'plan_suspended') {
    return (
      <div className="screen app-shell-screen" style={{ display: 'grid', placeItems: 'center', background: 'var(--bg)' }}>
        <div className="card" style={{ maxWidth: 500, padding: 32, textAlign: 'center' }}>
          <div style={{ width: 46, height: 46, margin: '0 auto 14px', borderRadius: 14, display: 'grid', placeItems: 'center', background: 'var(--g-50)', color: 'var(--g-700)' }}>
            <Icon name="users" size={22} />
          </div>
          <h1 className="display" style={{ fontSize: 24 }}>No active workspace seat</h1>
          <p className="muted" style={{ marginTop: 10, lineHeight: 1.6 }}>
            Your account is still part of {org?.name || 'this organization'}, but the current plan does not have an active seat for you. Ask the Owner to upgrade the plan or change the team access order.
          </p>
          <button className="btn btn-primary btn-sm" style={{ marginTop: 20 }} onClick={handleLogout}>Sign out</button>
        </div>
      </div>
    );
  }

  if (paymentRequired && !billingRouteAllowed) {
    return (
      <div className="screen app-shell-screen" style={{ display: 'grid', placeItems: 'center', background: 'var(--bg)' }}>
        <div className="card" style={{ maxWidth: 460, padding: 32, textAlign: 'center' }}>
          <h1 className="display" style={{ fontSize: 24 }}>Complete billing to continue</h1>
          <p className="muted" style={{ marginTop: 10, lineHeight: 1.6 }}>
            Your account is ready. Choose a monthly or yearly plan to unlock onboarding and the sales workspace.
          </p>
          <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => router.replace('/subscribe')}>
            Choose a plan
          </button>
        </div>
      </div>
    );
  }

  if (pageHidden) {
    return (
      <div className="screen app-shell-screen" style={{ display: 'grid', placeItems: 'center', background: 'var(--bg)' }}>
        <p className="muted">Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <RoleContext.Provider value={role}>
    <OrgContext.Provider value={org}>
    <div className="screen app-shell-screen" style={{ background: 'var(--bg)' }}>
      <aside className="app-shell-sidebar" style={{ background: '#fff', borderRight: '1px solid var(--line)', display: 'flex', flexDirection: 'column', padding: '18px 14px' }}>
        <div className="app-shell-brand" style={{ padding: '4px 6px 16px' }}><Logo size={28} /></div>
        <button className="btn btn-primary btn-sm app-shell-new" style={{ marginBottom: 14, fontSize: 13.5 }} onClick={() => goTo('/campaigns/new')}>
          <Icon name="plus" size={15} color="#06231a" /> New campaign
        </button>
        <button
          className="app-shell-menu-btn"
          type="button"
          aria-label={mobileNavOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={mobileNavOpen}
          onClick={() => setMobileNavOpen(open => !open)}
        >
          <Icon name={mobileNavOpen ? "close" : "menu"} size={22} />
        </button>

        <nav className="col scroll grow app-shell-nav" style={{ gap: 0 }}>
          {navGroups.map((g, gi) => (
            <div key={gi} style={{ marginBottom: 4 }}>
              {g.label && <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--faint)', padding: '10px 10px 4px' }}>{g.label}</div>}
              {g.items.map(n => {
                const active = activeTab === n.id;
                return (
                  <button key={n.id} data-tour={`nav-${n.id}`} onClick={() => goTo('/' + n.id)} style={{
                    display: 'flex', alignItems: 'center', gap: 10, height: 40, padding: '0 10px', width: '100%',
                    borderRadius: 10, fontWeight: 700, fontSize: 14, textAlign: 'left',
                    color: active ? '#06231a' : 'var(--ink-2)',
                    background: active ? 'var(--g-50)' : 'transparent',
                    boxShadow: active ? 'inset 0 0 0 1px var(--g-100)' : 'none', transition: 'all .12s',
                  }}>
                    <Icon name={n.ico} size={18} color={active ? 'var(--g-600)' : 'var(--muted)'} />
                    <span className="nw">{n.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className={`app-shell-mobile-drawer ${mobileNavOpen ? 'is-open' : ''}`}>
          {navGroups.map((g, gi) => (
            <div key={gi} className="app-shell-mobile-group">
              {g.label && <div className="app-shell-mobile-label">{g.label}</div>}
              {g.items.map(n => {
                const active = activeTab === n.id;
                return (
                  <button
                    key={n.id}
                    type="button"
                    data-tour={`nav-${n.id}`}
                    className={`app-shell-mobile-item ${active ? 'is-active' : ''}`}
                    onClick={() => goTo('/' + n.id)}
                  >
                    <Icon name={n.ico} size={18} color={active ? 'var(--g-600)' : 'var(--muted)'} />
                    <span>{n.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
          <div className="app-shell-mobile-actions">
            <button className="btn btn-primary btn-sm" type="button" onClick={() => goTo('/campaigns/new')}>
              <Icon name="plus" size={15} color="#06231a" /> New campaign
            </button>
            <button className="row nw app-shell-mobile-logout" type="button" onClick={handleLogout}>
              <Icon name="logout" size={17} /> Log out
            </button>
          </div>
        </div>

        {freePlan ? <div className="app-shell-logout" style={{ display: 'block' }}><FreePlanUsage usage={freeUsage} onUpgrade={() => goTo('/billing')} /></div> : null}
        <button className="row nw app-shell-logout" onClick={handleLogout} style={{ gap: 9, marginTop: 10, padding: '0 6px', height: 36, color: 'var(--muted)', fontWeight: 700, fontSize: 13.5, flex: 'none' }}>
          <Icon name="logout" size={17} /> Log out
        </button>
      </aside>

      <div className="grow col" style={{ minWidth: 0 }}>
        <header className="row spread app-shell-header" style={{ height: 62, flex: 'none', padding: '0 24px', borderBottom: '1px solid var(--line)', background: 'rgba(255,255,255,.9)', backdropFilter: 'blur(8px)' }}>
          <div className="input-wrap app-shell-search">
            <span className="lead-ico"><Icon name="search" size={17} /></span>
            <input className="input has-ico" style={{ height: 40, background: 'var(--bg)', fontSize: 14 }} placeholder="Search leads, accounts, replies…" />
          </div>
          <div className="row" style={{ gap: 14 }}>
            {canSee(role, 'page.agent') ? (
              <button
                type="button"
                className="row nw app-shell-ask"
                aria-label={`Ask ${agentName}`}
                onClick={() => setAskOpen(true)}
                style={{ gap: 7, height: 38, padding: '0 15px', borderRadius: 999, background: '#0a5d3f', color: '#fff', fontSize: 13, fontWeight: 800 }}
              >
                <Icon name="spark" size={15} color="#6fe7b0" /> <span className="app-shell-ask-label">Ask {agentName}</span>
              </button>
            ) : null}
            <div ref={notificationsRef} style={{ position: 'relative' }}>
              <button
                type="button"
                style={{ position: 'relative', color: notifications.unreadCount > 0 ? 'var(--ink-2)' : 'var(--muted)', display: 'block' }}
                onClick={() => {
                  setNotificationsOpen(open => !open);
                }}
                aria-haspopup="menu"
                aria-expanded={notificationsOpen}
                aria-label={notifications.unreadCount > 0
                  ? `Notifications: ${notifications.unreadCount} email${notifications.unreadCount === 1 ? '' : 's'} need your OK`
                  : 'Notifications'}
              >
                <Icon name="bell" size={20} />
                {notifications.unreadCount > 0 && (
                  <span
                    style={{
                      position: 'absolute', top: -5, right: -6, minWidth: 17, height: 17, padding: '0 4px',
                      borderRadius: 9, background: '#b45309', color: '#fff', fontSize: 10.5, fontWeight: 800,
                      lineHeight: '17px', textAlign: 'center', border: '2px solid #fff', boxSizing: 'content-box',
                    }}
                  >
                    {notifications.unreadCount > 99 ? '99+' : notifications.unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="gx gx-layer">
                  <div className="pop" role="menu" style={{ top: 62, right: 16 }}>
                    <div className="pop-h">
                      <b>Notifications</b>
                      {notifications.unreadCount > 0 ? <span className="pl pl-ok">{notifications.unreadCount} need you</span> : null}
                    </div>
                    {notifications.items.length === 0 ? (
                      <div className="empty" style={{ padding: '22px 18px' }}>
                        Nothing needs you right now. Emails your agent can send on its own never appear here.
                      </div>
                    ) : notifications.items.map(item => (
                      <button
                        key={item.id}
                        type="button"
                        role="menuitem"
                        className="nt unread"
                        onClick={() => { setNotificationsOpen(false); goTo(item.href); }}
                      >
                        <span className="ni warn"><Icon name="alertCircle" size={15} /></span>
                        <div><b>{item.title}</b><span>{item.body}</span></div>
                        <span className="dotu" aria-hidden="true" />
                      </button>
                    ))}
                    <div className="pop-f">
                      <button type="button" className="lnk" onClick={() => { setNotificationsOpen(false); goTo('/inbox'); }}>Open Inbox</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {userName && (
              <div className="row" style={{ gap: 9 }}>
                <Avatar name={userName} size={34} />
                <div className="col app-shell-user-text" style={{ lineHeight: 1.2 }}>
                  <span style={{ fontWeight: 800, fontSize: 13.5 }} className="nw">{userName}</span>
                  <span className="faint nw" style={{ fontSize: 11.5 }}>{orgName}</span>
                </div>
              </div>
            )}
          </div>
        </header>
        <div className="grow" style={{ minHeight: 0, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>{children}</div>
        <nav className="app-shell-tabs" aria-label="Main">
          {MOBILE_TABS.filter(tab => canSee(role, `page.${tab.id}`)).map(tab => (
            <button
              key={tab.id}
              type="button"
              className={activeTab === tab.id ? 'is-on' : ''}
              aria-current={activeTab === tab.id ? 'page' : undefined}
              onClick={() => goTo('/' + tab.id)}
            >
              <Icon name={tab.ico} size={20} />
              <span>{tab.label}</span>
            </button>
          ))}
          <button
            type="button"
            className={mobileNavOpen ? 'is-on' : ''}
            aria-expanded={mobileNavOpen}
            onClick={() => setMobileNavOpen(open => !open)}
          >
            <Icon name="menu" size={20} />
            <span>More</span>
          </button>
        </nav>
        {askOpen ? <AskNexoDrawer agentName={agentName} onClose={() => setAskOpen(false)} /> : null}
      </div>
    </div>
    </OrgContext.Provider>
    </RoleContext.Provider>
  );
}
