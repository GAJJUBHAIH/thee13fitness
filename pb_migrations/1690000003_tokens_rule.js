migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("tokens");
  // Allow anyone to create tokens (including guests for store checkout)
  collection.createRule = "";
  return dao.saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("tokens");
  collection.createRule = null;
  return dao.saveCollection(collection);
});
