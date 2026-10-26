"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "../../components/ui/Icon";
import { FormError, TopBar } from "../../components/onboarding/ui";
import ChannelStep from "../../components/onboarding/ChannelStep";
import ProfileStep from "../../components/onboarding/ProfileStep";
import ProductStep from "../../components/onboarding/ProductStep";
import AudienceStep from "../../components/onboarding/AudienceStep";
import EmailStyleStep from "../../components/onboarding/EmailStyleStep";
import CallStyleStep from "../../components/onboarding/CallStyleStep";
import LaunchStep from "../../components/onboarding/LaunchStep";
import { useAuth } from "../../hooks/useAuth";
import api from "../../lib/api";
import { suggestAudience, suggestProductText } from "../../lib/onboarding-suggestions";
import {
  CHANNEL_KEY, DEFAULTS, PRODUCT_MIN, buildPayload, clearDraft, defaultOpeningLine, fromServer, readDraft, stepsFor, textLength, validateStep, writeDraft,
} from "../../lib/onboarding-flow";

const CHANNEL_LABEL = { email: "Email", voice: "Voice", both: "Email + Voice" };

function storage() {
  try { return typeof window === "undefined" ? null : window.localStorage; } catch { return null; }
}

/** Fill in suggestions the first time a step is shown, never over the user's own answers. */
function seedFor(step, d) {
  const seeded = d.seeded || {};
  const next = { ...d, seeded: { ...seeded } };
  if (step === "product" && !seeded.product) {
    const draft = suggestProductText(d.industry, d.company);
    if (!d.valueProp.trim()) next.valueProp = draft.valueProp;
    if (d.pains.length === 0 && d.customPains.length === 0) next.pains = suggestAudience(d.industry).painChips.slice(0, 3);
    next.seeded.product = true;
  }
  if (step === "audience" && !seeded.audience) {
    const suggestion = suggestAudience(d.industry);
    if (d.titles.length === 0) next.titles = suggestion.titles;
    if (d.targetIndustries.length === 0) next.targetIndustries = suggestion.targets;
    if (d.companySizes.length === 0) next.companySizes = ["11,50", "51,200"];
    next.seeded.audience = true;
  }
  if (step === "voice" && !d.openingLine.trim()) next.openingLine = defaultOpeningLine(d);
  return next;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { user, organization } = useAuth();
  const [step, setStep] = useState("channel");
  const [d, setD] = useState(DEFAULTS);
  const [ready, setReady] = useState(false);
  const [fromSignup, setFromSignup] = useState({ firstName: false });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const loaded = useRef(false);

  // Restore a draft, else a saved setup, else what sign-up already knows.
  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    const draft = readDraft(storage());
    if (draft) {
      setD(draft.data);
      setStep(draft.step === "channel" || stepsFor(draft.data.channels).some(s => s.id === draft.step) ? draft.step : "channel");
      setReady(true);
      return;
    }
    api.get("/onboarding").then(({ data }) => {
      const saved = fromServer(data);
      if (saved && saved.productDescription) setD(saved);
    }).catch(() => {}).finally(() => setReady(true));
  }, []);

  // Sign-up details arrive with the session; use them for empty fields only.
  const signupApplied = useRef(false);
  useEffect(() => {
    if (!ready || signupApplied.current || (!user && !organization)) return;
    signupApplied.current = true;
    if (!d.firstName && user?.first_name) setFromSignup({ firstName: true });
    setD(prev => ({
      ...prev,
      firstName: prev.firstName || user?.first_name || "",
      lastName: prev.lastName || user?.last_name || "",
      company: prev.company || organization?.name || "",
    }));
  }, [ready, user, organization, d.firstName]);

  useEffect(() => {
    if (ready) writeDraft(storage(), step, d);
  }, [ready, step, d]);

  const set = useCallback((key, value) => {
    setD(prev => ({ ...prev, [key]: value }));
    setError("");
  }, []);

  const steps = stepsFor(d.channels);
  const index = steps.findIndex(s => s.id === step);

  const go = useCallback(target => {
    setD(prev => seedFor(target, prev));
    setStep(target);
    setError("");
    // globals.css makes <body> the scroll container, so reset both.
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0 });
      document.body.scrollTo?.({ top: 0 });
    }
  }, []);

  const next = useCallback(() => {
    if (step === "channel") { go("profile"); return; }
    const message = validateStep(step, d);
    if (message) { setError(message); return; }
    const following = steps[index + 1];
    if (following) go(following.id);
  }, [step, d, steps, index, go]);

  const back = () => {
    if (index <= 0) go("channel");
    else go(steps[index - 1].id);
  };

  const saveLater = () => {
    writeDraft(storage(), step, d);
    router.push("/dashboard");
  };

  const launch = async () => {
    for (const s of steps) {
      const message = validateStep(s.id, d);
      if (message) {
        if (s.id !== "launch") go(s.id);
        setError(message);
        return;
      }
    }
    setLoading(true);
    setError("");
    try {
      const { data: result } = await api.post("/onboarding", buildPayload(d), { timeout: 120000 });
      if (!result?.campaign?.id) {
        setError("We saved your setup, but could not prepare the first campaign. Please try again.");
        setLoading(false);
        return;
      }
      try {
        window.sessionStorage.setItem("gnx_onboarding_preparation", JSON.stringify(result.preparation || {}));
        window.localStorage.setItem(CHANNEL_KEY, d.channels);
      } catch { /* storage is a convenience only */ }
      clearDraft(storage());
      router.push(`/onboarding/ready?campaignId=${encodeURIComponent(result.campaign.id)}`);
    } catch (err) {
      setLoading(false);
      setError(err?.response?.data?.error || err?.response?.data?.message || "We could not save your setup. Please try again.");
    }
  };

  // "Press Enter" continues from single-line fields. Text areas, open lists
  // and token inputs handle Enter themselves.
  const onKeyDown = e => {
    if (e.key !== "Enter" || e.defaultPrevented || step === "launch") return;
    const t = e.target;
    if (t.tagName !== "INPUT" || t.getAttribute("role") === "combobox" || t.closest(".tok") || t.closest(".addown") || t.closest(".obj")) return;
    e.preventDefault();
    next();
  };

  if (!ready) {
    return <div className="ob" aria-busy="true"><TopBar /></div>;
  }

  const productWeak = step === "product" && textLength(d.productDescription) < PRODUCT_MIN;
  const continueLabel = step === "email" && d.channels === "both" ? "Continue to call style"
    : steps[index + 1]?.id === "launch" ? "Continue to preview" : "Continue";
  const footer = (
    <>
      <FormError message={error} id="ob-step-error" />
      <div className="foot">
        {step === "profile"
          ? <span className="kbd">{fromSignup.firstName ? "Your name came from sign-up. Change anything." : "Change anything later in Settings."}</span>
          : <button type="button" className="bt bt-g" onClick={back}><Icon name="arrowLeft" size={18} stroke={2.2} />Back</button>}
        <div className="right">
          {step === "profile" && <span className="kbd">Press <kbd>Enter</kbd></span>}
          {productWeak && <span className="need"><Icon name="alertCircle" size={16} stroke={2} />1 answer needs a few more words</span>}
          <button type="button" className="bt bt-p" onClick={next}>{continueLabel}<Icon name="arrow" size={18} stroke={2.2} /></button>
        </div>
      </div>
    </>
  );

  const props = { d, set, footer };
  return (
    <div className="ob" onKeyDown={onKeyDown}>
      <TopBar steps={step === "channel" ? null : steps} current={step} onJump={go} onSave={saveLater} />
      {step !== "channel" && step !== "launch" && (
        <div className="path"><button type="button" onClick={() => go("channel")}>Setting up: {CHANNEL_LABEL[d.channels]}<span>Change</span></button></div>
      )}
      {step === "channel" && <ChannelStep d={d} set={set} firstName={d.firstName || user?.first_name} onContinue={next} />}
      {step === "profile" && <ProfileStep {...props} fromSignup={fromSignup} />}
      {step === "product" && <ProductStep {...props} />}
      {step === "audience" && <AudienceStep {...props} />}
      {step === "email" && <EmailStyleStep {...props} />}
      {step === "voice" && <CallStyleStep {...props} />}
      {step === "launch" && <LaunchStep d={d} set={set} onJump={go} onBack={back} onLaunch={launch} loading={loading} error={error} />}
    </div>
  );
}
