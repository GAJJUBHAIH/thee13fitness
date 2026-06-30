migrate((db) => {
  const dao = new Dao(db);
  
  // 1. Update Users Collection to add address
  const usersCollection = dao.findCollectionByNameOrId("users");
  
  let hasAddress = false;
  for (let field of usersCollection.schema.fields()) {
    if (field.name === 'address') hasAddress = true;
  }
  
  if (!hasAddress) {
    usersCollection.schema.addField(new SchemaField({
      system: false,
      id: "users_addr_id",
      name: "address",
      type: "json",
      required: false,
      unique: false,
      options: {}
    }));
    dao.saveCollection(usersCollection);
  }

  // 2. Create Orders Collection
  const ordersCollection = new Collection({
    id: "orders_coll_idxx",
    name: "orders",
    type: "base",
    system: false,
    schema: [
      {
        system: false,
        id: "ord_orderid",
        name: "orderId",
        type: "text",
        required: true,
        unique: true,
        options: { min: null, max: 100, pattern: "" }
      },
      {
        system: false,
        id: "ord_userid",
        name: "user",
        type: "relation",
        required: false,
        unique: false,
        options: {
          collectionId: "_pb_users_auth_",
          cascadeDelete: false,
          minSelect: null,
          maxSelect: 1,
          displayFields: []
        }
      },
      {
        system: false,
        id: "ord_cust_snap",
        name: "customerSnapshot",
        type: "json",
        required: false,
        unique: false,
        options: {}
      },
      {
        system: false,
        id: "ord_addr_snap",
        name: "addressSnapshot",
        type: "json",
        required: false,
        unique: false,
        options: {}
      },
      {
        system: false,
        id: "ord_phone",
        name: "phone",
        type: "text",
        required: false,
        unique: false,
        options: { min: null, max: null, pattern: "" }
      },
      {
        system: false,
        id: "ord_email",
        name: "email",
        type: "email",
        required: false,
        unique: false,
        options: { exceptDomains: [], onlyDomains: [] }
      },
      {
        system: false,
        id: "ord_prods",
        name: "products",
        type: "json",
        required: true,
        unique: false,
        options: {}
      },
      {
        system: false,
        id: "ord_amount",
        name: "amount",
        type: "number",
        required: true,
        unique: false,
        options: { min: 0, max: null }
      },
      {
        system: false,
        id: "ord_tax",
        name: "tax",
        type: "number",
        required: false,
        unique: false,
        options: { min: 0, max: null }
      },
      {
        system: false,
        id: "ord_discount",
        name: "discount",
        type: "number",
        required: false,
        unique: false,
        options: { min: 0, max: null }
      },
      {
        system: false,
        id: "ord_shipping",
        name: "shipping",
        type: "number",
        required: false,
        unique: false,
        options: { min: 0, max: null }
      },
      {
        system: false,
        id: "ord_pay_status",
        name: "paymentStatus",
        type: "select",
        required: true,
        unique: false,
        options: { maxSelect: 1, values: ["pending", "paid", "failed"] }
      },
      {
        system: false,
        id: "ord_del_status",
        name: "deliveryStatus",
        type: "select",
        required: true,
        unique: false,
        options: { maxSelect: 1, values: ["processing", "shipped", "delivered", "cancelled"] }
      },
      {
        system: false,
        id: "ord_track_num",
        name: "trackingNumber",
        type: "text",
        required: false,
        unique: false,
        options: { min: null, max: null, pattern: "" }
      },
      {
        system: false,
        id: "ord_inv_id",
        name: "invoiceId",
        type: "text",
        required: false,
        unique: false,
        options: { min: null, max: null, pattern: "" }
      }
    ],
    listRule: "@request.auth.id != '' && (user = @request.auth.id || @request.auth.role = 'Admin')",
    viewRule: "@request.auth.id != '' && (user = @request.auth.id || @request.auth.role = 'Admin')",
    createRule: "",
    updateRule: "@request.auth.role = 'Admin'",
    deleteRule: "@request.auth.role = 'Admin'",
  });

  return dao.saveCollection(ordersCollection);
}, (db) => {
  const dao = new Dao(db);
  
  try {
    const ordersCollection = dao.findCollectionByNameOrId("orders");
    dao.deleteCollection(ordersCollection);
  } catch (e) {
    // Ignore
  }

  const usersCollection = dao.findCollectionByNameOrId("users");
  usersCollection.schema.removeField("users_addr_id");
  return dao.saveCollection(usersCollection);
});
