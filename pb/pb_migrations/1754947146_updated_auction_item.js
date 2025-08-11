/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2213034683")

  // update collection data
  unmarshal({
    "name": "auction_items"
  }, collection)

  // add field
  collection.fields.addAt(14, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_848867609",
    "hidden": false,
    "id": "relation3739547027",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "auction",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2213034683")

  // update collection data
  unmarshal({
    "name": "auction_item"
  }, collection)

  // remove field
  collection.fields.removeById("relation3739547027")

  return app.save(collection)
})
