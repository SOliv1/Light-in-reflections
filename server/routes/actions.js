import { Router } from "express";
import { connectToDb } from "../db.js";
import {
  getActionsBySession,
  createAction,
  updateAction,
  deleteAction,
  bulkSyncActions,
} from "../models/Action.js";

const router = Router();

// ---------------------------------------------------------------------------
// GET /api/actions?sessionId=<id>
// Returns all actions for the given session, newest-first.
// ---------------------------------------------------------------------------
router.get("/", async (req, res) => {
  const { sessionId } = req.query;
  if (!sessionId) {
    return res.status(400).json({ error: "sessionId is required" });
  }

  try {
    const db = await connectToDb();
    const actions = await getActionsBySession(db, sessionId);
    return res.json(actions);
  } catch (err) {
    console.error("GET /api/actions error:", err);
    return res.status(500).json({ error: "Failed to fetch actions" });
  }
});

// ---------------------------------------------------------------------------
// POST /api/actions
// Body: { sessionId, text, priority, reminderMinutes, ... }
// Creates a new action and returns it with its _id.
// ---------------------------------------------------------------------------
router.post("/", async (req, res) => {
  const { sessionId, text } = req.body;
  if (!sessionId || !text?.trim()) {
    return res.status(400).json({ error: "sessionId and text are required" });
  }

  try {
    const db = await connectToDb();
    const action = await createAction(db, {
      sessionId,
      clientId: req.body.id ?? req.body.clientId ?? Date.now(),
      text: text.trim(),
      done: Boolean(req.body.done),
      createdDate: req.body.createdDate ?? new Date().toISOString().slice(0, 10),
      createdAt: req.body.createdAt ?? new Date().toISOString(),
      priority: req.body.priority ?? "medium",
      reminderMinutes: req.body.reminderMinutes ?? null,
      reminderEnabled: Boolean(req.body.reminderEnabled),
      nextReminderAt: req.body.nextReminderAt ?? null,
      lastNotifiedAt: req.body.lastNotifiedAt ?? null,
    });
    return res.status(201).json(action);
  } catch (err) {
    console.error("POST /api/actions error:", err);
    return res.status(500).json({ error: "Failed to create action" });
  }
});

// ---------------------------------------------------------------------------
// POST /api/actions/bulk-sync
// Body: { sessionId, actions: [...] }
// Upserts all actions for the session (merges localStorage → MongoDB).
// Returns the full server-side list after sync.
// ---------------------------------------------------------------------------
router.post("/bulk-sync", async (req, res) => {
  const { sessionId, actions } = req.body;
  if (!sessionId || !Array.isArray(actions)) {
    return res.status(400).json({ error: "sessionId and actions array are required" });
  }

  try {
    const db = await connectToDb();
    const synced = await bulkSyncActions(db, sessionId, actions);
    return res.json(synced);
  } catch (err) {
    console.error("POST /api/actions/bulk-sync error:", err);
    return res.status(500).json({ error: "Failed to sync actions" });
  }
});

// ---------------------------------------------------------------------------
// PATCH /api/actions/:id
// Body: partial action fields to update (done, priority, reminderMinutes, etc.)
// ---------------------------------------------------------------------------
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "Action id is required" });

  try {
    const db = await connectToDb();
    const updated = await updateAction(db, id, req.body);
    if (!updated) {
      return res.status(404).json({ error: "Action not found" });
    }
    return res.json(updated);
  } catch (err) {
    console.error("PATCH /api/actions/:id error:", err);
    return res.status(500).json({ error: "Failed to update action" });
  }
});

// ---------------------------------------------------------------------------
// DELETE /api/actions/:id
// Deletes a single action by its MongoDB _id.
// ---------------------------------------------------------------------------
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "Action id is required" });

  try {
    const db = await connectToDb();
    const result = await deleteAction(db, id);
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Action not found" });
    }
    return res.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/actions/:id error:", err);
    return res.status(500).json({ error: "Failed to delete action" });
  }
});

export default router;
