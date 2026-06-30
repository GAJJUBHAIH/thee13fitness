/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);

  // 1. Fix Rules for pt_requests and website_assets
  try {
    const ptRequests = dao.findCollectionByNameOrId("pt_requests");
    if (ptRequests) {
      ptRequests.updateRule = "@request.auth.role = 'Admin'";
      dao.saveCollection(ptRequests);
    }
  } catch (err) {}

  try {
    const assets = dao.findCollectionByNameOrId("website_assets");
    if (assets) {
      assets.createRule = "@request.auth.role = 'Admin'";
      assets.updateRule = "@request.auth.role = 'Admin'";
      assets.deleteRule = "@request.auth.role = 'Admin'";
      dao.saveCollection(assets);
    }
  } catch (err) {}

  // 2. Create products collection
  const products = new Collection({
    id: "products_store_id1",
    name: "products",
    type: "base",
    system: false,
    schema: [
      {
        system: false,
        id: "prod_name",
        name: "name",
        type: "text",
        required: true,
        unique: false,
        options: { min: null, max: null, pattern: "" }
      },
      {
        system: false,
        id: "prod_desc",
        name: "description",
        type: "text",
        required: false,
        unique: false,
        options: { min: null, max: null, pattern: "" }
      },
      {
        system: false,
        id: "prod_price",
        name: "price",
        type: "number",
        required: true,
        unique: false,
        options: { min: 0, max: null }
      },
      {
        system: false,
        id: "prod_image",
        name: "image",
        type: "file",
        required: false,
        unique: false,
        options: { maxSelect: 1, maxSize: 5242880, mimeTypes: ["image/jpeg", "image/png", "image/svg+xml", "image/gif", "image/webp"], thumbs: ["400x400"] }
      },
      {
        system: false,
        id: "prod_category",
        name: "category",
        type: "select",
        required: true,
        unique: false,
        options: { maxSelect: 1, values: ["Supplements", "Gear", "Merch"] }
      },
      {
        system: false,
        id: "prod_active",
        name: "active",
        type: "bool",
        required: false,
        unique: false,
        options: {}
      }
    ],
    listRule: "",
    viewRule: "",
    createRule: "@request.auth.role = 'Admin'",
    updateRule: "@request.auth.role = 'Admin'",
    deleteRule: "@request.auth.role = 'Admin'",
  });
  dao.saveCollection(products);

  // 3. Create coupons collection
  const coupons = new Collection({
    id: "coupons_store_id12",
    name: "coupons",
    type: "base",
    system: false,
    schema: [
      {
        system: false,
        id: "coupon_code",
        name: "code",
        type: "text",
        required: true,
        unique: true,
        options: { min: 1, max: 20, pattern: "" }
      },
      {
        system: false,
        id: "coupon_discount",
        name: "discount_rate",
        type: "number",
        required: true,
        unique: false,
        options: { min: 0, max: 1 } // e.g., 0.9 for 90% discount, or 0.1 for 10% off. Let's say 0.9 means user pays 10%? I'll store it as decimal percentage 0.0 to 1.0 (where 0.1 = 10% discount).
      },
      {
        system: false,
        id: "coupon_active",
        name: "active",
        type: "bool",
        required: false,
        unique: false,
        options: {}
      }
    ],
    listRule: "", // anyone can list/view so checkout can validate
    viewRule: "",
    createRule: "@request.auth.role = 'Admin'",
    updateRule: "@request.auth.role = 'Admin'",
    deleteRule: "@request.auth.role = 'Admin'",
  });
  dao.saveCollection(coupons);

  // Add initial hardcoded products just to populate the store
  const pRecord1 = new Record(products);
  pRecord1.set("name", "Whey Protein Isolate");
  pRecord1.set("description", "Premium 100% whey isolate");
  pRecord1.set("price", 2999);
  pRecord1.set("category", "Supplements");
  pRecord1.set("active", true);
  dao.saveRecord(pRecord1);

  const pRecord2 = new Record(products);
  pRecord2.set("name", "Pre-Workout Xtreme");
  pRecord2.set("description", "Explosive energy and focus");
  pRecord2.set("price", 1499);
  pRecord2.set("category", "Supplements");
  pRecord2.set("active", true);
  dao.saveRecord(pRecord2);

  const pRecord3 = new Record(products);
  pRecord3.set("name", "Lifting Belt");
  pRecord3.set("description", "Heavy duty leather belt");
  pRecord3.set("price", 1299);
  pRecord3.set("category", "Gear");
  pRecord3.set("active", true);
  dao.saveRecord(pRecord3);
  
  const pRecord4 = new Record(products);
  pRecord4.set("name", "Wrist Wraps");
  pRecord4.set("description", "Support for heavy pressing");
  pRecord4.set("price", 499);
  pRecord4.set("category", "Gear");
  pRecord4.set("active", true);
  dao.saveRecord(pRecord4);
  
  const pRecord5 = new Record(products);
  pRecord5.set("name", "Oversized Pump Cover");
  pRecord5.set("description", "Premium cotton blend");
  pRecord5.set("price", 899);
  pRecord5.set("category", "Merch");
  pRecord5.set("active", true);
  dao.saveRecord(pRecord5);

  const pRecord6 = new Record(products);
  pRecord6.set("name", "Pro Shaker Bottle");
  pRecord6.set("description", "Leak-proof 700ml");
  pRecord6.set("price", 299);
  pRecord6.set("category", "Merch");
  pRecord6.set("active", true);
  dao.saveRecord(pRecord6);
  
  // Add initial AHPS coupon for 90% discount (0.9 discount_rate)
  const cRecord = new Record(coupons);
  cRecord.set("code", "AHPS");
  cRecord.set("discount_rate", 0.9);
  cRecord.set("active", true);
  dao.saveRecord(cRecord);

}, (db) => {
  const dao = new Dao(db);
  try {
    const products = dao.findCollectionByNameOrId("products");
    dao.deleteCollection(products);
  } catch(e) {}
  
  try {
    const coupons = dao.findCollectionByNameOrId("coupons");
    dao.deleteCollection(coupons);
  } catch(e) {}
});
