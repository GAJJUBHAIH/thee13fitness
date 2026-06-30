migrate((db) => {
  const collection = new Collection({
    "id": "website_assets00",
    "created": "",
    "updated": "",
    "name": "website_assets",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "asset_key_field",
        "name": "key",
        "type": "text",
        "required": true,
        "presentable": false,
        "unique": true,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "asset_image_field",
        "name": "image",
        "type": "file",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "maxSize": 10485760, // 10MB
          "mimeTypes": [
            "image/png",
            "image/vnd.mozilla.apng",
            "image/jpeg",
            "image/svg+xml",
            "image/webp",
            "image/gif"
          ],
          "thumbs": [],
          "protected": false
        }
      }
    ],
    "indexes": [
      "CREATE UNIQUE INDEX `idx_website_assets_key` ON `website_assets` (`key`)"
    ],
    "listRule": "",
    "viewRule": "",
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("website_assets00");
  return dao.deleteCollection(collection);
});
