migrate((db) => {
  const dao = new Dao(db);
  const products = dao.findCollectionByNameOrId("products");
  products.createRule = "";
  dao.saveCollection(products);
}, (db) => {
  const dao = new Dao(db);
  const products = dao.findCollectionByNameOrId("products");
  products.createRule = null;
  dao.saveCollection(products);
});
