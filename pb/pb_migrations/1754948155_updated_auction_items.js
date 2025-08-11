/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2213034683")

  // add field
  collection.fields.addAt(15, new Field({
    "hidden": false,
    "id": "number2011867020",
    "max": null,
    "min": null,
    "name": "watch_count",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2213034683")

  // remove field
  collection.fields.removeById("number2011867020")

  return app.save(collection)
})
