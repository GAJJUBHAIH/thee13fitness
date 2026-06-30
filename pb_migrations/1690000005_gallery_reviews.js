migrate((db) => {
  const dao = new Dao(db);
  
  // Create Gallery Collection
  const galleryCollection = new Collection({
    id: "gallery_coll_idxx",
    name: "gallery",
    type: "base",
    system: false,
    schema: [
      {
        system: false,
        id: "gal_image",
        name: "image",
        type: "file",
        required: true,
        unique: false,
        options: { maxSelect: 1, maxSize: 5242880, mimeTypes: ["image/jpeg", "image/png", "image/webp"] }
      },
      {
        system: false,
        id: "gal_caption",
        name: "caption",
        type: "text",
        required: false,
        unique: false,
        options: { min: null, max: 200, pattern: "" }
      },
      {
        system: false,
        id: "gal_likes",
        name: "likes",
        type: "relation",
        required: false,
        unique: false,
        options: { collectionId: "_pb_users_auth_", cascadeDelete: false, minSelect: null, maxSelect: null, displayFields: [] }
      },
      {
        system: false,
        id: "gal_comments",
        name: "comments",
        type: "json",
        required: false,
        unique: false,
        options: {}
      },
      {
        system: false,
        id: "gal_user",
        name: "user",
        type: "relation",
        required: true,
        unique: false,
        options: { collectionId: "_pb_users_auth_", cascadeDelete: false, minSelect: 1, maxSelect: 1, displayFields: [] }
      }
    ],
    listRule: "",
    viewRule: "",
    createRule: "@request.auth.id != ''",
    updateRule: "user = @request.auth.id || @request.auth.role = 'Admin' || @request.data.likes != null || @request.data.comments != null",
    deleteRule: "user = @request.auth.id || @request.auth.role = 'Admin'",
  });

  dao.saveCollection(galleryCollection);

  // Create Reviews Collection
  const reviewsCollection = new Collection({
    id: "reviews_coll_idxx",
    name: "reviews",
    type: "base",
    system: false,
    schema: [
      {
        system: false,
        id: "rev_user",
        name: "user",
        type: "relation",
        required: true,
        unique: false,
        options: { collectionId: "_pb_users_auth_", cascadeDelete: true, minSelect: 1, maxSelect: 1, displayFields: [] }
      },
      {
        system: false,
        id: "rev_rating",
        name: "rating",
        type: "number",
        required: true,
        unique: false,
        options: { min: 1, max: 5 }
      },
      {
        system: false,
        id: "rev_comment",
        name: "comment",
        type: "text",
        required: true,
        unique: false,
        options: { min: null, max: 500, pattern: "" }
      }
    ],
    listRule: "",
    viewRule: "",
    createRule: "@request.auth.id != ''",
    updateRule: "user = @request.auth.id || @request.auth.role = 'Admin'",
    deleteRule: "user = @request.auth.id || @request.auth.role = 'Admin'",
  });

  return dao.saveCollection(reviewsCollection);
}, (db) => {
  const dao = new Dao(db);
  try { dao.deleteCollection(dao.findCollectionByNameOrId("gallery")); } catch (e) {}
  try { dao.deleteCollection(dao.findCollectionByNameOrId("reviews")); } catch (e) {}
});
