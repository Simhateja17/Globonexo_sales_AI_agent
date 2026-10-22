"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Icon from "../ui/Icon";
import { CONTACT_FALLBACK_ERROR, CONTACT_SENT_KEY, CONTACT_TOPICS, sendContactMessage } from "../../lib/contact";
import { SUPPORT_EMAIL } from "../../lib/site";
import { isValidEmail } from "../../lib/validation";


const EMPTY = { name: "", email: "", company: "", topic: CONTACT_TOPICS[0], message: "", website: "" };

export default function ContactForm() {
  const router = useRouter();
  const [values, setValues] = useState(EMPTY);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const set = (key) => (event) => {
    setValues((prev) => ({ ...prev, [key]: event.target.value }));
    setFieldErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const next = {};
    if (!values.name.trim()) next.name = "Add your name so we know who to reply to.";
    if (!isValidEmail(values.email.trim())) next.email = "Enter a full email address, like jordan@company.com.";
    if (values.message.trim().length < 10) next.message = "Add a short message so we can help.";
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (status === "sending") return;
    if (!validate()) return;
    setStatus("sending");
    setError("");
    try {
      await sendContactMessage(values);
      try {
        window.sessionStorage.setItem(CONTACT_SENT_KEY, JSON.stringify({
          name: values.name, email: values.email, topic: values.topic, sentAt: new Date().toISOString(),
        }));
      } catch {
        // The confirmation page falls back to generic copy without it.
      }
      setStatus("sent");
      router.push("/contact/sent");
    } catch (err) {
      setError(err?.message || CONTACT_FALLBACK_ERROR);
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="contact-form contact-form--sent" role="status">
        <span className="contact-form-check"><Icon name="check" size={22} color="#fff" stroke={2.5} /></span>
        <h2>Message sent</h2>
        <p>Thanks, {values.name.split(" ")[0] || "there"}. A person on our team will reply to {values.email} within one business day.</p>
        <button type="button" className="btn btn-ghost" onClick={() => { setValues(EMPTY); setStatus("idle"); }}>
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={onSubmit} noValidate>
      <h2>Send us a message</h2>
      <p className="contact-form-sub">It lands in the same inbox as {SUPPORT_EMAIL}.</p>

      <div className="contact-form-grid">
        <div className="field">
          <label htmlFor="cf-name">Your name</label>
          <input id="cf-name" className={`input${fieldErrors.name ? " input--bad" : ""}`} aria-invalid={fieldErrors.name ? "true" : undefined} aria-describedby={fieldErrors.name ? "cf-name-err" : undefined} type="text" autoComplete="name" required maxLength={120}
            placeholder="Jordan Lee" value={values.name} onChange={set("name")} />
          {fieldErrors.name && <p id="cf-name-err" className="contact-field-error">{fieldErrors.name}</p>}
        </div>
        <div className="field">
          <label htmlFor="cf-email">Work email</label>
          <input id="cf-email" className={`input${fieldErrors.email ? " input--bad" : ""}`} aria-invalid={fieldErrors.email ? "true" : undefined} aria-describedby={fieldErrors.email ? "cf-email-err" : undefined} type="email" autoComplete="email" required maxLength={254}
            placeholder="jordan@company.com" value={values.email} onChange={set("email")} />
          {fieldErrors.email && <p id="cf-email-err" className="contact-field-error">{fieldErrors.email}</p>}
        </div>
        <div className="field">
          <label htmlFor="cf-company">Company</label>
          <input id="cf-company" className="input" type="text" autoComplete="organization" maxLength={160}
            placeholder="Company or workspace name" value={values.company} onChange={set("company")} />
        </div>
        <div className="field">
          <label htmlFor="cf-topic">Topic</label>
          <select id="cf-topic" className="input" value={values.topic} onChange={set("topic")}>
            {CONTACT_TOPICS.map((topic) => <option key={topic}>{topic}</option>)}
          </select>
        </div>
      </div>

      <div className="field contact-form-message">
        <label htmlFor="cf-message">How can we help?</label>
        <textarea id="cf-message" className={`input${fieldErrors.message ? " input--bad" : ""}`} aria-invalid={fieldErrors.message ? "true" : undefined} aria-describedby={fieldErrors.message ? "cf-message-err" : undefined} rows={5} required minLength={10} maxLength={4000}
          placeholder="What you expected, what happened, and when. Please don't include passwords."
          value={values.message} onChange={set("message")} />
        {fieldErrors.message && <p id="cf-message-err" className="contact-field-error">{fieldErrors.message}</p>}
      </div>

      {/* Honeypot: invisible to people, tempting to bots. */}
      <div className="contact-form-trap" aria-hidden="true">
        <label htmlFor="cf-website">Website</label>
        <input id="cf-website" type="text" tabIndex={-1} autoComplete="off" value={values.website} onChange={set("website")} />
      </div>

      {status === "error" && <p className="contact-form-error" role="alert">{error}</p>}

      <div className="contact-form-foot">
        <span>We use these details only to answer you, as our <Link href="/privacy">Privacy Policy</Link> explains.</span>
        <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
          {status === "sending" ? "Sending..." : <>Send message <Icon name="send" size={16} color="#06231a" /></>}
        </button>
      </div>
    </form>
  );
}
