import { useCallback, useState } from "react";
import emailjs from "@emailjs/browser";

const SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID || "";
const TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID || "";
const PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY || "";

const NOTIFY_EMAIL_KEY = "reflections_notify_email";

export function getNotifyEmail() {
  return localStorage.getItem(NOTIFY_EMAIL_KEY) || "";
}

export function saveNotifyEmail(email) {
  localStorage.setItem(NOTIFY_EMAIL_KEY, email.trim());
}

export function isEmailJsConfigured() {
  return Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);
}

/**
 * Sends a reminder email via EmailJS.
 *
 * The EmailJS template should contain these variables:
 *   {{to_email}}   – recipient address
 *   {{action_text}} – the action text
 *   {{priority}}   – priority label
 *   {{due_label}}  – human-readable due description
 */
export async function sendReminderEmail({ actionText, priority, dueLabel }) {
  if (!isEmailJsConfigured()) {
    console.warn("EmailJS is not configured – set REACT_APP_EMAILJS_* env vars.");
    return { ok: false, reason: "not_configured" };
  }

  const toEmail = getNotifyEmail();
  if (!toEmail) {
    return { ok: false, reason: "no_email" };
  }

  try {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        to_email: toEmail,
        action_text: actionText,
        priority,
        due_label: dueLabel || "now",
      },
      PUBLIC_KEY
    );
    return { ok: true };
  } catch (err) {
    console.error("EmailJS send error:", err);
    return { ok: false, reason: "send_error", error: err };
  }
}

/**
 * React hook that exposes email reminder helpers and current email state.
 * Call inside a component to get reactive email/config status.
 */
export function useEmailReminder() {
  const [notifyEmail, setNotifyEmailState] = useState(getNotifyEmail);
  const [sending, setSending] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  const saveEmail = useCallback((email) => {
    saveNotifyEmail(email);
    setNotifyEmailState(email.trim());
  }, []);

  const sendReminder = useCallback(async ({ actionText, priority, dueLabel }) => {
    setSending(true);
    const result = await sendReminderEmail({ actionText, priority, dueLabel });
    setSending(false);
    setLastResult(result);
    return result;
  }, []);

  return {
    notifyEmail,
    saveEmail,
    sendReminder,
    sending,
    lastResult,
    isConfigured: isEmailJsConfigured(),
  };
}
