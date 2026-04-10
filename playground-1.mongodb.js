// Choose your collection
const collection = db.getCollection("seasonalImages");

// 1. Fix field names: "\"mood\"" → "mood"
collection.updateMany(
  { "\"mood\"": { $exists: true } },
  [
    {
      $set: {
        mood: "$\"mood\""
      }
    },
    {
      $unset: "\"mood\""
    }
  ]
);

// 2. Fix field names: "Season" → "season"
collection.updateMany(
  { Season: { $exists: true } },
  [
    {
      $set: {
        season: "$Season"
      }
    },
    {
      $unset: "Season"
    }
  ]
);

// 3. Remove stray quotes from values
function stripQuotes(value) {
  if (typeof value !== "string") return value;
  return value.replace(/^"+|"+$/g, "");
}

const docs = collection.find().toArray();

docs.forEach(doc => {
  const updates = {};

  ["mood", "season", "title"].forEach(field => {
    if (doc[field] && typeof doc[field] === "string") {
      const cleaned = stripQuotes(doc[field]);
      if (cleaned !== doc[field]) {
        updates[field] = cleaned;
      }
    }
  });

  if (Object.keys(updates).length > 0) {
    collection.updateOne({ _id: doc._id }, { $set: updates });
  }
});

// 4. Validation: find broken documents
const broken = collection.find({
  $or: [
    { mood: { $exists: false } },
    { season: { $exists: false } },
    { photoUrl: { $exists: false } },
    { mood: "" },
    { season: "" }
  ]
}).toArray();

print("Broken documents:");
printjson(broken);
