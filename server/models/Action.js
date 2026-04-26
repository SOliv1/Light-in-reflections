import { ObjectId } from "mongodb";

const COLLECTION = "actions";

/**
 * Fetch all actions for a given sessionId, sorted newest-first.
 */
export async function getActionsBySession(db, sessionId) {
  return db
    .collection(COLLECTION)
    .find({ sessionId })
    .sort({ createdAt: -1 })
    .toArray();
}

/**
 * Insert a single action document.
 * The caller provides the full action shape; we stamp updatedAt.
 */
export async function createAction(db, action) {
  const doc = {
    ...action,
    updatedAt: new Date().toISOString(),
  };
  const result = await db.collection(COLLECTION).insertOne(doc);
  return { ...doc, _id: result.insertedId };
}

/**
 * Update mutable fields on an existing action.
 * Only the fields present in `updates` are changed.
 */
export async function updateAction(db, id, updates) {
  const { _id, sessionId, createdAt, ...safeUpdates } = updates; // strip immutable fields
  return db.collection(COLLECTION).findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { ...safeUpdates, updatedAt: new Date().toISOString() } },
    { returnDocument: "after" }
  );
}

/**
 * Delete a single action by its MongoDB _id.
 */
export async function deleteAction(db, id) {
  return db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });
}

/**
 * Bulk upsert actions by clientId (timestamp id from the frontend).
 * Used when syncing localStorage state to the server on first load.
 */
export async function bulkSyncActions(db, sessionId, actions) {
  if (!actions.length) return [];

  const ops = actions.map((action) => ({
    updateOne: {
      filter: { sessionId, clientId: action.clientId ?? action.id },
      update: {
        $set: {
          ...action,
          sessionId,
          clientId: action.clientId ?? action.id,
          updatedAt: new Date().toISOString(),
        },
      },
      upsert: true,
    },
  }));

  await db.collection(COLLECTION).bulkWrite(ops);

  return db
    .collection(COLLECTION)
    .find({ sessionId })
    .sort({ createdAt: -1 })
    .toArray();
}
