migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("users");

  if (collection) {
    // 1. offline_access (bool)
    collection.schema.addField(new SchemaField({
      "system": false,
      "id": "offline_access_field",
      "name": "offline_access",
      "type": "bool",
      "required": false,
      "unique": false,
      "options": {}
    }));

    // 2. membership_plan (select)
    collection.schema.addField(new SchemaField({
      "system": false,
      "id": "membership_plan_field",
      "name": "membership_plan",
      "type": "select",
      "required": false,
      "unique": false,
      "options": {
        "maxSelect": 1,
        "values": [
          "1 Month",
          "3 Months",
          "6 Months",
          "1 Year"
        ]
      }
    }));

    // 3. membership_start (date)
    collection.schema.addField(new SchemaField({
      "system": false,
      "id": "membership_start_field",
      "name": "membership_start",
      "type": "date",
      "required": false,
      "unique": false,
      "options": {
        "min": "",
        "max": ""
      }
    }));

    // 4. membership_end (date)
    collection.schema.addField(new SchemaField({
      "system": false,
      "id": "membership_end_field",
      "name": "membership_end",
      "type": "date",
      "required": false,
      "unique": false,
      "options": {
        "min": "",
        "max": ""
      }
    }));

    dao.saveCollection(collection);
  }
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("users");
  
  if (collection) {
    collection.schema.removeField("offline_access_field");
    collection.schema.removeField("membership_plan_field");
    collection.schema.removeField("membership_start_field");
    collection.schema.removeField("membership_end_field");
    dao.saveCollection(collection);
  }
});
