migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("products");

  if (!collection.schema.getFieldByName("original_price")) {
    collection.schema.addField(new SchemaField({
      "system": false,
      "id": "prod_orig_price",
      "name": "original_price",
      "type": "number",
      "required": false,
      "unique": false,
      "options": { min: 0, max: null }
    }));
  }

  if (!collection.schema.getFieldByName("rating")) {
    collection.schema.addField(new SchemaField({
      "system": false,
      "id": "prod_rating",
      "name": "rating",
      "type": "number",
      "required": false,
      "unique": false,
      "options": { min: 0, max: 5 }
    }));
  }

  if (!collection.schema.getFieldByName("flavors")) {
    collection.schema.addField(new SchemaField({
      "system": false,
      "id": "prod_flavors",
      "name": "flavors",
      "type": "json",
      "required": false,
      "unique": false,
      "options": {}
    }));
  }

  if (!collection.schema.getFieldByName("sizes")) {
    collection.schema.addField(new SchemaField({
      "system": false,
      "id": "prod_sizes",
      "name": "sizes",
      "type": "json",
      "required": false,
      "unique": false,
      "options": {}
    }));
  }

  if (!collection.schema.getFieldByName("images")) {
    collection.schema.addField(new SchemaField({
      "system": false,
      "id": "prod_images",
      "name": "images",
      "type": "file",
      "required": false,
      "unique": false,
      "options": { maxSelect: 10, maxSize: 5242880, mimeTypes: ["image/jpeg", "image/png", "image/svg+xml", "image/gif", "image/webp"], thumbs: ["400x400"] }
    }));
  }

  dao.saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("products");

  const fieldsToRemove = ["original_price", "rating", "flavors", "sizes", "images"];
  for (const name of fieldsToRemove) {
    const f = collection.schema.getFieldByName(name);
    if (f) collection.schema.removeField(f.id);
  }

  dao.saveCollection(collection);
});
