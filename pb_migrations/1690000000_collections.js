migrate((db) => {
  const collection = new Collection({
    "id": "collection_tokens",
    "name": "tokens",
    "type": "base",
    "system": false,
    "schema": [
      {
        "id": "field_tokenid",
        "name": "tokenId",
        "type": "text",
        "system": false,
        "required": true,
        "unique": true
      },
      {
        "id": "field_type",
        "name": "type",
        "type": "text",
        "system": false,
        "required": true
      },
      {
        "id": "field_userid",
        "name": "userId",
        "type": "text",
        "system": false,
        "required": false
      },
      {
        "id": "field_user",
        "name": "user",
        "type": "json",
        "system": false,
        "required": false
      },
      {
        "id": "field_itemid",
        "name": "itemId",
        "type": "text",
        "system": false,
        "required": false
      },
      {
        "id": "field_itemname",
        "name": "itemName",
        "type": "text",
        "system": false,
        "required": false
      },
      {
        "id": "field_amount",
        "name": "amount",
        "type": "number",
        "system": false,
        "required": false
      },
      {
        "id": "field_quantity",
        "name": "quantity",
        "type": "number",
        "system": false,
        "required": false
      },
      {
        "id": "field_status",
        "name": "status",
        "type": "text",
        "system": false,
        "required": false
      },
      {
        "id": "field_purchasedate",
        "name": "purchaseDate",
        "type": "date",
        "system": false,
        "required": false
      },
      {
        "id": "field_expirydate",
        "name": "expiryDate",
        "type": "date",
        "system": false,
        "required": false
      },
      {
        "id": "field_qrcodedata",
        "name": "qrCodeData",
        "type": "text",
        "system": false,
        "required": false
      }
    ],
    "listRule": "@request.auth.id != '' && @request.auth.id = userId",
    "viewRule": "@request.auth.id != '' && @request.auth.id = userId",
    "createRule": null,
    "updateRule": null,
    "deleteRule": null
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("tokens");
  return dao.deleteCollection(collection);
});
