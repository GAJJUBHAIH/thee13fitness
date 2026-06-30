migrate((db) => {
  const dao = new Dao(db);
  const products = dao.findCollectionByNameOrId("products");

  // Add images field
  products.schema.addField(new SchemaField({
    system: false,
    id: "prod_images",
    name: "images",
    type: "file",
    required: false,
    unique: false,
    options: {
      maxSelect: 15,
      maxSize: 5242880,
      mimeTypes: ["image/jpeg", "image/png", "image/svg+xml", "image/gif", "image/webp"],
      thumbs: ["400x400", "800x800"]
    }
  }));

  // Add flavors field
  products.schema.addField(new SchemaField({
    system: false,
    id: "prod_flavors",
    name: "flavors",
    type: "json",
    required: false,
    unique: false,
    options: { maxSize: 2000000 }
  }));

  // Add sizes field
  products.schema.addField(new SchemaField({
    system: false,
    id: "prod_sizes",
    name: "sizes",
    type: "json",
    required: false,
    unique: false,
    options: { maxSize: 2000000 }
  }));

  // Add original_price field
  products.schema.addField(new SchemaField({
    system: false,
    id: "prod_original_price",
    name: "original_price",
    type: "number",
    required: false,
    unique: false,
    options: { min: 0, max: null }
  }));

  // Add rating field
  products.schema.addField(new SchemaField({
    system: false,
    id: "prod_rating",
    name: "rating",
    type: "number",
    required: false,
    unique: false,
    options: { min: 0, max: 5 }
  }));

  dao.saveCollection(products);
}, (db) => {
  const dao = new Dao(db);
  const products = dao.findCollectionByNameOrId("products");
  
  products.schema.removeField("prod_images");
  products.schema.removeField("prod_flavors");
  products.schema.removeField("prod_sizes");
  products.schema.removeField("prod_original_price");
  products.schema.removeField("prod_rating");

  dao.saveCollection(products);
});
