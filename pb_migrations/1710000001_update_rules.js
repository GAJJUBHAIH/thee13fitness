migrate((db) => {
  const dao = new Dao(db);
  
  // 1. Update Users Collection Rules to allow Admins
  const usersCollection = dao.findCollectionByNameOrId("users");
  if (usersCollection) {
    usersCollection.listRule = "id = @request.auth.id || @request.auth.role = 'Admin'";
    usersCollection.viewRule = "id = @request.auth.id || @request.auth.role = 'Admin'";
    usersCollection.updateRule = "id = @request.auth.id || @request.auth.role = 'Admin'";
    dao.saveCollection(usersCollection);
  }

  // 2. Update Website Assets Collection Rules to allow Admins
  try {
    const assetsCollection = dao.findCollectionByNameOrId("website_assets");
    if (assetsCollection) {
      assetsCollection.listRule = "";
      assetsCollection.viewRule = "";
      assetsCollection.createRule = "@request.auth.role = 'Admin'";
      assetsCollection.updateRule = "@request.auth.role = 'Admin'";
      assetsCollection.deleteRule = "@request.auth.role = 'Admin'";
      dao.saveCollection(assetsCollection);
    }
  } catch (err) {
    // collection might not exist, ignore
  }

}, (db) => {
  const dao = new Dao(db);
  
  const usersCollection = dao.findCollectionByNameOrId("users");
  if (usersCollection) {
    usersCollection.listRule = "id = @request.auth.id";
    usersCollection.viewRule = "id = @request.auth.id";
    usersCollection.updateRule = "id = @request.auth.id";
    dao.saveCollection(usersCollection);
  }

  try {
    const assetsCollection = dao.findCollectionByNameOrId("website_assets");
    if (assetsCollection) {
      assetsCollection.createRule = null;
      assetsCollection.updateRule = null;
      assetsCollection.deleteRule = null;
      dao.saveCollection(assetsCollection);
    }
  } catch(err) {}
});
