migrate((db) => {
  const dao = new Dao(db);
  
  const collectionsToUpdate = ["pt_requests", "products", "coupons", "website_assets", "orders"];
  
  for (const name of collectionsToUpdate) {
    try {
      const collection = dao.findCollectionByNameOrId(name);
      if (collection) {
        collection.updateRule = "@request.auth.id != ''";
        collection.createRule = "@request.auth.id != ''";
        collection.deleteRule = "@request.auth.id != ''";
        dao.saveCollection(collection);
      }
    } catch (e) {
      console.log(`Failed to update ${name}`, e);
    }
  }
}, (db) => {
  // rollback
});
