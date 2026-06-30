migrate((db) => {
  const dao = new Dao(db);
  
  // Fix orders JSON fields
  const orders = dao.findCollectionByNameOrId("orders");
  const jsonFields = ["customerSnapshot", "addressSnapshot", "products"];
  
  for (const fieldName of jsonFields) {
    const field = orders.schema.getFieldByName(fieldName);
    if (field) {
      field.options = { maxSize: 2000000 };
      orders.schema.addField(field); // Re-adds/updates the field
    }
  }
  
  // also set public create rule for orders if it was only for admins
  orders.createRule = "";
  dao.saveCollection(orders);

  // Fix users address field
  try {
    const users = dao.findCollectionByNameOrId("users");
    const addrField = users.schema.getFieldByName("address");
    if (addrField) {
      addrField.options = { maxSize: 2000000 };
      users.schema.addField(addrField);
      dao.saveCollection(users);
    }
  } catch(e) {}
  
}, (db) => {
  // rollback
})
