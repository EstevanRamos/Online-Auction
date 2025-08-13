/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2213034683")

  // add field
  collection.fields.addAt(3, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_419297710",
    "hidden": false,
    "id": "relation1460484774",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "current_highest_bid",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2213034683")

  // remove field
  collection.fields.removeById("relation1460484774")

  return app.save(collection)
})
