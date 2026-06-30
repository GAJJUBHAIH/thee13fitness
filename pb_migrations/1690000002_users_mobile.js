migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("users");

  // Add mobile field if it doesn't exist
  let mobileFieldExists = false;
  for (let field of collection.schema.fields()) {
    if (field.name === "mobile") {
      mobileFieldExists = true;
      break;
    }
  }

  if (!mobileFieldExists) {
    collection.schema.addField(new SchemaField({
      "system": false,
      "id": "mobile_field",
      "name": "mobile",
      "type": "text",
      "required": false,
      "unique": false,
      "options": {
        "min": null,
        "max": 15,
        "pattern": ""
      }
    }));
  }

  return dao.saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("users");
  
  const field = collection.schema.getFieldByName("mobile");
  if (field) {
    collection.schema.removeField(field.id);
  }
  
  return dao.saveCollection(collection);
});
