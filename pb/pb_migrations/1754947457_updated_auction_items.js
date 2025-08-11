/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2213034683")

  // update field
  collection.fields.addAt(13, new Field({
    "hidden": false,
    "id": "number1105726947",
    "max": null,
    "min": 0,
    "name": "total_bids",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2213034683")

  // update field
  collection.fields.addAt(13, new Field({
    "hidden": false,
    "id": "number1105726947",
    "max": null,
    "min": 0,
    "name": "total_bids",
    "onlyInt": false,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
})
