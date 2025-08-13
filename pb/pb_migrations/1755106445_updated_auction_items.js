/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2213034683")

  // remove field
  collection.fields.removeById("number1125010629")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2213034683")

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "number1125010629",
    "max": null,
    "min": 5,
    "name": "current_bid",
    "onlyInt": true,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
})
