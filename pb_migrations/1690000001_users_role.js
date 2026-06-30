migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("users");

  // Allow public signup
  collection.createRule = "";

  // Allow users to see their own profile and edit it
  collection.listRule = "id = @request.auth.id";
  collection.viewRule = "id = @request.auth.id";
  collection.updateRule = "id = @request.auth.id";
  
  // Add role field if it doesn't exist
  let roleFieldExists = false;
  for (let field of collection.schema.fields()) {
    if (field.name === "role") {
      roleFieldExists = true;
      break;
    }
  }

  if (!roleFieldExists) {
    collection.schema.addField(new SchemaField({
      "system": false,
      "id": "role_field",
      "name": "role",
      "type": "select",
      "required": false,
      "unique": false,
      "options": {
        "maxSelect": 1,
        "values": [
          "Admin",
          "User"
        ]
      }
    }));
  }

  return dao.saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("users");
  
  // Revert createRule
  // collection.createRule = null;
  
  // Remove role field
  const field = collection.schema.getFieldByName("role");
  if (field) {
    collection.schema.removeField(field.id);
  }
  
  return dao.saveCollection(collection);
});
