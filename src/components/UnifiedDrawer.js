import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReflectionsPanel from "./ReflectionsPanel";
import { quotes } from "../data/quotes";
import { seasonalPriorityPalette } from "../utils/seasonalMoodStyles";
import { fetchFromApi } from "../api";
import { useEmailReminder } from "../hooks/useEmailReminder";
import "./Drawer.css";
import "../styles/DrawerUnified.css";

const TAB_KEYS = {
  reflections: "reflections",
  actions: "actions",
  notes: "notes",
  quote: "quote",
};

const TAB_CONFIG = [
  { key: TAB_KEYS.reflections, label: "Reflections" },
  { key: TAB_KEYS.actions, label: "Actions" },
  { key: TAB_KEYS.notes, label: "Notes" },
  { key: TAB_KEYS.quote, label: "Quote" },
];

const ACTION_STORAGE_KEY = "quietActions";
const SESSION_ID_KEY = "reflections_session_id";

function getOrCreateSessionId() {
  let id = localStorage.getItem(SESSION_ID_KEY);
  if (!id) {
    id = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(SESSION_ID_KEY, id);
  }
  return id;
}

const PRIORITY_CONFIG = [
  { value: "highest", label: "Most important", rank: 4 },
  { value: "high", label: "Important", rank: 3 },
  { value: "medium", label: "Steady", rank: 2 },
  { value: "low", label: "Least important", rank: 1 },
];

const REMINDER_OPTIONS = [
  { value: "off", label: "No reminder", minutes: null },
  { value: "15", label: "Every 15 minutes", minutes: 15 },
  { value: "60", label: "Hourly reminder", minutes: 60 },
  { value: "1440", label: "Daily reminder", minutes: 1440 },
];

const PRIORITY_LOOKUP = PRIORITY_CONFIG.reduce((lookup, priority) => {
  lookup[priority.value] = priority;
  return lookup;
}, {});

const REMINDER_LOOKUP = REMINDER_OPTIONS.reduce((lookup, reminder) => {
  lookup[reminder.value] = reminder;
  return lookup;
}, {});

function normalizeInitialTab(value) {
  return TAB_CONFIG.some((tab) => tab.key === value) ? value : TAB_KEYS.reflections;
}

function todayDateKey() {
  return new Date().toISOString().slice(0, 10);
}

function formatDisplayDate() {
  return new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getNotificationPermission() {
  if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
  return window.Notification.permission;
}

function normalizeAction(item) {
  const createdAt = item.createdAt || new Date(typeof item.id === "number" ? item.id : Date.now()).toISOString();
  const priority = PRIORITY_LOOKUP[item.priority] ? item.priority : "medium";
  const reminderMinutes =
    typeof item.reminderMinutes === "number" && item.reminderMinutes > 0 ? item.reminderMinutes : null;
  const reminderEnabled = Boolean(reminderMinutes && !item.done);
  const nextReminderAt = reminderEnabled && item.nextReminderAt ? item.nextReminderAt : null;

  return {
    _id: item._id || null,
    id: item.id || Date.now(),
    text: String(item.text || "").trim(),
    done: Boolean(item.done),
    createdDate: item.createdDate || todayDateKey(),
    createdAt,
    priority,
    reminderMinutes,
    reminderEnabled,
    nextReminderAt,
    lastNotifiedAt: item.lastNotifiedAt || null,
  };
}

function isReminderDue(action) {
  return Boolean(
    !action.done &&
      action.reminderEnabled &&
      action.nextReminderAt &&
      Date.parse(action.nextReminderAt) <= Date.now()
  );
}

function formatRelativeReminder(timestamp) {
  if (!timestamp) return "No reminder set";

  const milliseconds = Date.parse(timestamp) - Date.now();
  const absoluteMinutes = Math.max(1, Math.round(Math.abs(milliseconds) / 60000));

  if (absoluteMinutes < 60) {
    return milliseconds >= 0
      ? `Next reminder in ${absoluteMinutes} min`
      : `Reminder overdue by ${absoluteMinutes} min`;
  }

  const absoluteHours = Math.round((absoluteMinutes / 60) * 10) / 10;
  return milliseconds >= 0
    ? `Next reminder in ${absoluteHours} hr`
    : `Reminder overdue by ${absoluteHours} hr`;
}

export default function UnifiedDrawer({
  isOpen,
  onClose,
  season,
  weatherMood,
  veilMode,
  onVeilOn,
  onVeilLift,
  onVeilOff,
  orbColor,
  initialTab = TAB_KEYS.reflections,
}) {
  const [activeTab, setActiveTab] = useState(normalizeInitialTab(initialTab));

  const [actions, setActions] = useState([]);
  const [actionText, setActionText] = useState("");
  const [actionPriority, setActionPriority] = useState("high");
  const [actionReminder, setActionReminder] = useState("60");
  const [notificationPermission, setNotificationPermission] = useState(getNotificationPermission);

  // Email reminder hook — reads/writes email from localStorage, sends via EmailJS
  const { notifyEmail, saveEmail, sendReminder: sendEmailReminder, isConfigured: emailConfigured } = useEmailReminder();
  const [emailInput, setEmailInput] = useState(notifyEmail);
  const [emailSaved, setEmailSaved] = useState(false);

  const [dailyReflection, setDailyReflection] = useState("");
  const [reflectionSaved, setReflectionSaved] = useState(false);
  const reflectionTimer = useRef(null);

  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState("");

  const [freshThought, setFreshThought] = useState("");
  const [freshThoughtSaved, setFreshThoughtSaved] = useState(false);
  const freshThoughtTimer = useRef(null);
  const actionsRef = useRef([]);

  const orbRGB = (() => {
    if (!orbColor) return "138, 180, 248";
    const hex = String(orbColor).match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    if (hex) return `${parseInt(hex[1], 16)}, ${parseInt(hex[2], 16)}, ${parseInt(hex[3], 16)}`;
    const rgb = String(orbColor).match(/rgb\(\s*(\d+),\s*(\d+),\s*(\d+)\s*\)/);
    if (rgb) return `${rgb[1]}, ${rgb[2]}, ${rgb[3]}`;
    return "138, 180, 248";
  })();

  const quoteOfTheDay = useMemo(() => {
    const today = new Date();
    const index = (today.getDate() - 1) % quotes.length;
    return quotes[index];
  }, []);

  // Load actions: fetch from API first, fall back to localStorage.
  // On first load, bulk-sync any existing localStorage items to MongoDB.
  useEffect(() => {
    const sessionId = getOrCreateSessionId();

    async function loadActions() {
      // Always load localStorage immediately so UI feels instant.
      let localActions = [];
      try {
        const saved = localStorage.getItem(ACTION_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            localActions = parsed.map(normalizeAction).filter((a) => a.text);
          }
        }
      } catch (_) { /* ignore */ }

      setActions(localActions);

      // Then sync with backend.
      try {
        let serverActions = [];

        if (localActions.length > 0) {
          // Bulk-sync local → server and get authoritative list back.
          const res = await fetchFromApi("/api/actions/bulk-sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId, actions: localActions }),
          });
          if (res.ok) serverActions = await res.json();
        } else {
          // Just fetch whatever the server has.
          const res = await fetchFromApi(`/api/actions?sessionId=${encodeURIComponent(sessionId)}`);
          if (res.ok) serverActions = await res.json();
        }

        if (serverActions.length > 0) {
          const normalized = serverActions.map(normalizeAction).filter((a) => a.text);
          setActions(normalized);
        }
      } catch (err) {
        console.warn("Actions API unavailable, using localStorage fallback:", err.message);
      }
    }

    loadActions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem(ACTION_STORAGE_KEY, JSON.stringify(actions));
  }, [actions]);

  useEffect(() => {
    actionsRef.current = actions;
  }, [actions]);

  useEffect(() => {
    const saved = localStorage.getItem(`dailyReflection-${todayDateKey()}`);
    setDailyReflection(saved || "");
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("lightNotes");
      if (!saved) return;
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) setNotes(parsed);
    } catch (error) {
      console.error("Failed to load light notes:", error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("lightNotes", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    const saved = localStorage.getItem(`freshThought-${todayDateKey()}`);
    setFreshThought(saved || "");
  }, []);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(normalizeInitialTab(initialTab));
    }
  }, [initialTab, isOpen]);

  const addAction = async () => {
    if (!actionText.trim()) return;
    const reminderOption = REMINDER_LOOKUP[actionReminder] || REMINDER_LOOKUP.off;
    const now = new Date();
    const newAction = {
      id: Date.now(),
      text: actionText.trim(),
      done: false,
      createdDate: todayDateKey(),
      createdAt: now.toISOString(),
      priority: actionPriority,
      reminderMinutes: reminderOption.minutes,
      reminderEnabled: Boolean(reminderOption.minutes),
      nextReminderAt: reminderOption.minutes
        ? new Date(now.getTime() + reminderOption.minutes * 60000).toISOString()
        : null,
      lastNotifiedAt: null,
      _id: null,
    };

    // Optimistically update UI.
    setActions((prev) => [newAction, ...prev]);
    setActionText("");

    // Persist to backend.
    try {
      const sessionId = getOrCreateSessionId();
      const res = await fetchFromApi("/api/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newAction, sessionId }),
      });
      if (res.ok) {
        const saved = await res.json();
        // Attach the MongoDB _id to the in-state action.
        setActions((prev) =>
          prev.map((a) => (a.id === newAction.id ? { ...a, _id: saved._id } : a))
        );
      }
    } catch (err) {
      console.warn("Failed to persist new action to API:", err.message);
    }
  };

  const patchAction = useCallback(async (id, updates) => {
    const action = actionsRef.current.find((a) => a.id === id);
    if (action?._id) {
      try {
        await fetchFromApi(`/api/actions/${action._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });
      } catch (err) {
        console.warn("Failed to patch action in API:", err.message);
      }
    }
  }, []);

  const toggleAction = (id) => {
    setActions(
      actions.map((item) => {
        if (item.id !== id) return item;
        const nextDone = !item.done;
        const updated = {
          ...item,
          done: nextDone,
          nextReminderAt:
            nextDone || !item.reminderMinutes
              ? null
              : new Date(Date.now() + item.reminderMinutes * 60000).toISOString(),
        };
        patchAction(id, { done: updated.done, nextReminderAt: updated.nextReminderAt });
        return updated;
      })
    );
  };

  const deleteAction = (id) => {
    const action = actions.find((a) => a.id === id);
    setActions(actions.filter((item) => item.id !== id));
    if (action?._id) {
      fetchFromApi(`/api/actions/${action._id}`, { method: "DELETE" }).catch((err) =>
        console.warn("Failed to delete action from API:", err.message)
      );
    }
  };

  const updateActionPriority = (id, priority) => {
    setActions(actions.map((item) => (item.id === id ? { ...item, priority } : item)));
    patchAction(id, { priority });
  };

  const updateActionReminder = (id, reminderValue) => {
    const reminderOption = REMINDER_LOOKUP[reminderValue] || REMINDER_LOOKUP.off;
    setActions(
      actions.map((item) => {
        if (item.id !== id) return item;
        const updated = {
          ...item,
          reminderMinutes: reminderOption.minutes,
          reminderEnabled: Boolean(reminderOption.minutes),
          nextReminderAt:
            reminderOption.minutes && !item.done
              ? new Date(Date.now() + reminderOption.minutes * 60000).toISOString()
              : null,
        };
        patchAction(id, {
          reminderMinutes: updated.reminderMinutes,
          reminderEnabled: updated.reminderEnabled,
          nextReminderAt: updated.nextReminderAt,
        });
        return updated;
      })
    );
  };

  const handleReflectionChange = useCallback((text) => {
    setDailyReflection(text);
    setReflectionSaved(false);
    clearTimeout(reflectionTimer.current);
    reflectionTimer.current = setTimeout(() => {
      localStorage.setItem(`dailyReflection-${todayDateKey()}`, text);
      setReflectionSaved(true);
    }, 800);
  }, []);

  const handleFreshThoughtChange = useCallback((text) => {
    setFreshThought(text);
    setFreshThoughtSaved(false);
    clearTimeout(freshThoughtTimer.current);
    freshThoughtTimer.current = setTimeout(() => {
      localStorage.setItem(`freshThought-${todayDateKey()}`, text);
      setFreshThoughtSaved(true);
    }, 800);
  }, []);

  const addNote = () => {
    if (!noteText.trim()) return;
    setNotes([{ id: Date.now(), text: noteText.trim() }, ...notes]);
    setNoteText("");
  };

  const notificationSupported = notificationPermission !== "unsupported";
  const priorityPalette = seasonalPriorityPalette[season] || seasonalPriorityPalette.winter;

  const sortedActions = useMemo(() => {
    return [...actions].sort((left, right) => {
      if (left.done !== right.done) return left.done ? 1 : -1;

      const leftDue = isReminderDue(left);
      const rightDue = isReminderDue(right);
      if (leftDue !== rightDue) return leftDue ? -1 : 1;

      const priorityDelta = PRIORITY_LOOKUP[right.priority].rank - PRIORITY_LOOKUP[left.priority].rank;
      if (priorityDelta !== 0) return priorityDelta;

      const leftReminder = left.nextReminderAt ? Date.parse(left.nextReminderAt) : Number.MAX_SAFE_INTEGER;
      const rightReminder = right.nextReminderAt ? Date.parse(right.nextReminderAt) : Number.MAX_SAFE_INTEGER;
      if (leftReminder !== rightReminder) return leftReminder - rightReminder;

      return Date.parse(right.createdAt || 0) - Date.parse(left.createdAt || 0);
    });
  }, [actions]);

  const actionSummary = useMemo(() => {
    return actions.reduce(
      (summary, action) => {
        if (!action.done) summary.pending += 1;
        if (action.done) summary.completed += 1;
        if (isReminderDue(action)) summary.due += 1;
        return summary;
      },
      { pending: 0, completed: 0, due: 0 }
    );
  }, [actions]);

  const issueBrowserNotification = useCallback(
    (action) => {
      if (!notificationSupported || notificationPermission !== "granted") return;

      const priorityLabel = PRIORITY_LOOKUP[action.priority]?.label || "Action";
      new window.Notification(
        `${priorityLabel} reminder`,
        {
          body: `${action.text}\nStill waiting in your Actions drawer.`,
          tag: `quiet-action-${action.id}`,
          renotify: true,
        }
      );
    },
    [notificationPermission, notificationSupported]
  );

  const sendActionReminder = useCallback(
    (action) => {
      issueBrowserNotification(action);
      if (!action.reminderMinutes) return;

      const nextReminderAt = new Date(Date.now() + action.reminderMinutes * 60000).toISOString();
      const lastNotifiedAt = new Date().toISOString();

      setActions((currentActions) =>
        currentActions.map((item) =>
          item.id === action.id ? { ...item, lastNotifiedAt, nextReminderAt } : item
        )
      );

      patchAction(action.id, { lastNotifiedAt, nextReminderAt });

      // Fire email reminder if configured and user has set an email.
      const priorityLabel = PRIORITY_LOOKUP[action.priority]?.label || "Action";
      sendEmailReminder({
        actionText: action.text,
        priority: priorityLabel,
        dueLabel: "now",
      });
    },
    [issueBrowserNotification, patchAction, sendEmailReminder]
  );

  useEffect(() => {
    setNotificationPermission(getNotificationPermission());
  }, [isOpen]);

  useEffect(() => {
    if (!notificationSupported || notificationPermission !== "granted") return undefined;

    const checkDueActions = () => {
      const dueActions = actionsRef.current.filter(isReminderDue);
      if (!dueActions.length) return;

      dueActions.forEach((action) => {
        issueBrowserNotification(action);
        // Also send email reminder for each due action.
        const priorityLabel = PRIORITY_LOOKUP[action.priority]?.label || "Action";
        sendEmailReminder({
          actionText: action.text,
          priority: priorityLabel,
          dueLabel: "overdue",
        });
      });

      setActions((currentActions) =>
        currentActions.map((action) => {
          if (!dueActions.some((dueAction) => dueAction.id === action.id) || !action.reminderMinutes) {
            return action;
          }

          const lastNotifiedAt = new Date().toISOString();
          const nextReminderAt = new Date(Date.now() + action.reminderMinutes * 60000).toISOString();
          patchAction(action.id, { lastNotifiedAt, nextReminderAt });
          return { ...action, lastNotifiedAt, nextReminderAt };
        })
      );
    };

    checkDueActions();
    const interval = window.setInterval(checkDueActions, 30000);

    return () => window.clearInterval(interval);
  }, [issueBrowserNotification, notificationPermission, notificationSupported, patchAction, sendEmailReminder]);

  const requestNotificationPermission = async () => {
    if (!notificationSupported) return;
    const nextPermission = await window.Notification.requestPermission();
    setNotificationPermission(nextPermission);
  };

  const closeOnOverlay = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`drawer-overlay unified-drawer-overlay ${isOpen ? "open" : ""}`}
      aria-hidden={!isOpen}
      onClick={closeOnOverlay}
    >
      <div
        className="drawer-panel unified-drawer-panel"
        role="dialog"
        aria-modal="true"
        style={{
          "--orbColor": orbColor,
          "--orbColorRGB": orbRGB,
        }}
      >
        {/* Header: date + close X */}
        <div className="unified-drawer-header">
          <p className="unified-drawer-date">{formatDisplayDate()}</p>
          <button className="drawer-close unified-drawer-close" onClick={onClose} aria-label="Close drawer">
            ✕
          </button>
        </div>

        <div className="unified-drawer-tabs" role="tablist" aria-label="Reflection drawer tabs">
          {TAB_CONFIG.map((tab) => (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.key}
              className={`unified-drawer-tab ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="short-reflections-drawer">

          {/* ── REFLECTIONS TAB ── */}
          {activeTab === TAB_KEYS.reflections && (
            <section>
              <h3 className="panel-title">Today's Reflection</h3>
              <ReflectionsPanel weatherMood={weatherMood} season={season} />
              <textarea
                className="daily-reflection-area"
                value={dailyReflection}
                onChange={(e) => handleReflectionChange(e.target.value)}
                placeholder="A quiet thought for today…"
                rows={4}
              />
              {reflectionSaved && <p className="saved-indicator">✦ saved</p>}
              <div className="unified-veil-controls">
                <button className={`drawer-btn ${veilMode === "on" ? "selected" : ""}`} onClick={onVeilOn}>
                  Veil On
                </button>
                <button className={`drawer-btn ${veilMode === "lift" ? "selected" : ""}`} onClick={onVeilLift}>
                  Lift Veil
                </button>
                <button className={`drawer-btn ${veilMode === "off" ? "selected" : ""}`} onClick={onVeilOff}>
                  Veil Off
                </button>
              </div>
              <button className="drawer-close-full" onClick={onClose}>Close</button>
            </section>
          )}

          {/* ── ACTIONS TAB ── */}
          {activeTab === TAB_KEYS.actions && (
            <section>
              <h3 className="panel-title">Quiet Actions</h3>
              <p className="section-prompt">Sorted from most important to least important, and carried forward until ticked off.</p>

              <div className="actions-notification-panel">
                <div>
                  <p className="section-label">Reminders</p>
                  <p className="actions-notification-copy">
                    {notificationSupported
                      ? notificationPermission === "granted"
                        ? "Browser reminders are on while this app is open."
                        : "Browser reminders can nudge unfinished actions while this app is open."
                      : "This browser does not support notifications. Use email reminders below."}
                  </p>
                </div>
                <div className="actions-summary-chips" aria-label="Action summary">
                  <span className="actions-summary-chip">{actionSummary.pending} open</span>
                  <span className="actions-summary-chip">{actionSummary.due} due</span>
                  <span className="actions-summary-chip">{actionSummary.completed} done</span>
                </div>
                {notificationSupported && notificationPermission !== "granted" && (
                  <button className="drawer-btn actions-notification-btn" onClick={requestNotificationPermission}>
                    Allow reminders
                  </button>
                )}

                {/* ── Email reminder settings ── */}
                {emailConfigured && (
                  <div className="email-reminder-row">
                    <p className="section-label">Email reminders</p>
                    <div className="email-reminder-input-row">
                      <input
                        type="email"
                        className="email-reminder-input"
                        placeholder="your@email.com"
                        value={emailInput}
                        onChange={(e) => { setEmailInput(e.target.value); setEmailSaved(false); }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            saveEmail(emailInput);
                            setEmailSaved(true);
                          }
                        }}
                        aria-label="Notification email address"
                      />
                      <button
                        className="drawer-btn email-save-btn"
                        onClick={() => { saveEmail(emailInput); setEmailSaved(true); }}
                        type="button"
                      >
                        Save
                      </button>
                    </div>
                    {emailSaved && notifyEmail && (
                      <p className="saved-indicator">✦ Reminders will be sent to {notifyEmail}</p>
                    )}
                    {!notifyEmail && (
                      <p className="actions-notification-copy">Add your email to receive reminders when the app is closed.</p>
                    )}
                  </div>
                )}
              </div>

              <div className="todo-input-row todo-input-grid">
                <input
                  value={actionText}
                  onChange={(e) => setActionText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addAction()}
                  placeholder="A gentle intention…"
                />
                <label className="drawer-field">
                  <span>Priority</span>
                  <select value={actionPriority} onChange={(e) => setActionPriority(e.target.value)}>
                    {PRIORITY_CONFIG.map((priority) => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="drawer-field">
                  <span>Reminder</span>
                  <select value={actionReminder} onChange={(e) => setActionReminder(e.target.value)}>
                    {REMINDER_OPTIONS.map((reminder) => (
                      <option key={reminder.value} value={reminder.value}>
                        {reminder.label}
                      </option>
                    ))}
                  </select>
                </label>
                <button className="drawer-btn action-add-btn" onClick={addAction}>Add</button>
              </div>
              <ul className="todo-list">
                {sortedActions.map((item) => {
                  const priorityStyle = priorityPalette[item.priority] || priorityPalette.medium;
                  return (
                    <li
                      key={item.id}
                      className={`priority-action-card ${item.done ? "done" : ""}`}
                      style={{
                        "--taskPriorityBg": priorityStyle.background,
                        "--taskPriorityBorder": priorityStyle.border,
                        "--taskPriorityBadge": priorityStyle.badge,
                        "--taskPriorityText": priorityStyle.text,
                      }}
                    >
                      <input
                        type="checkbox"
                        className="action-checkbox"
                        checked={item.done}
                        onChange={() => toggleAction(item.id)}
                        aria-label="Mark complete"
                      />
                      <div className="priority-action-content">
                        <span>{item.text}</span>
                        <div className="priority-action-meta">
                          <span className="priority-pill">{PRIORITY_LOOKUP[item.priority]?.label || "Steady"}</span>
                          <span className="reminder-pill">
                            {item.reminderEnabled ? formatRelativeReminder(item.nextReminderAt) : "No reminder"}
                          </span>
                        </div>
                        <div className="priority-action-controls">
                          <label className="drawer-field inline">
                            <span>Priority</span>
                            <select
                              value={item.priority}
                              onChange={(e) => updateActionPriority(item.id, e.target.value)}
                              disabled={item.done}
                            >
                              {PRIORITY_CONFIG.map((priority) => (
                                <option key={priority.value} value={priority.value}>
                                  {priority.label}
                                </option>
                              ))}
                            </select>
                          </label>
                          <label className="drawer-field inline">
                            <span>Reminder</span>
                            <select
                              value={item.reminderEnabled ? String(item.reminderMinutes) : "off"}
                              onChange={(e) => updateActionReminder(item.id, e.target.value)}
                            >
                              {REMINDER_OPTIONS.map((reminder) => (
                                <option key={reminder.value} value={reminder.value}>
                                  {reminder.label}
                                </option>
                              ))}
                            </select>
                          </label>
                          {!item.done && notificationPermission === "granted" && (
                            <button
                              className="drawer-btn action-nudge-btn"
                              onClick={() => sendActionReminder(item)}
                              type="button"
                            >
                              Remind now
                            </button>
                          )}
                        </div>
                      </div>
                      <button className="remove-btn" onClick={() => deleteAction(item.id)} aria-label="Remove">×</button>
                    </li>
                  );
                })}
              </ul>
              <button className="drawer-close-full" onClick={onClose}>Close</button>
            </section>
          )}

          {/* ── LIGHT NOTES TAB ── */}
          {activeTab === TAB_KEYS.notes && (
            <section>
              <h3 className="panel-title">Light Notes</h3>

              <p className="section-label">Fresh Thought</p>
              <textarea
                className="fresh-thought-area"
                value={freshThought}
                onChange={(e) => handleFreshThoughtChange(e.target.value)}
                placeholder="One thought to hold today…"
                rows={2}
              />
              {freshThoughtSaved && <p className="saved-indicator">✦ saved</p>}

              <hr className="section-divider" />

              <p className="section-label">Quiet Journal</p>
              <textarea
                className="journal-area"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Thoughts that stay until you let them go…"
                rows={2}
              />
              <button className="drawer-btn unified-add-note-btn" onClick={addNote}>Save Note</button>
              <ul className="notes-list">
                {notes.map((note) => (
                  <li key={note.id} className="note-item">
                    <p>{note.text}</p>
                    <button
                      className="remove-btn"
                      onClick={() => setNotes(notes.filter((n) => n.id !== note.id))}
                      aria-label="Delete note"
                    >×</button>
                  </li>
                ))}
              </ul>
              <button className="drawer-close-full" onClick={onClose}>Close</button>
            </section>
          )}

          {/* ── QUOTE TAB ── */}
          {activeTab === TAB_KEYS.quote && (
            <section className="quote-drawer-content">
              <h3 className="panel-title">Quote of the Day</h3>
              <p className="drawer-quote">"{quoteOfTheDay.quote}"</p>
              <p className="drawer-author">~ {quoteOfTheDay.person} ~</p>
              <button className="drawer-close-full" onClick={onClose}>Close</button>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
