/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_848867609")

  // update field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "number3238926055",
    "max": null,
    "min": 30,
    "name": "anti_snipe_extension",
    "onlyInt": true,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_848867609")

  // update field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "number3238926055",
    "max": null,
    "min": null,
    "name": "anti_snipe_extension",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
})
