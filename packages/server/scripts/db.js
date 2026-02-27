/* eslint-disable */

// FIELDS PERMISSIONS
db.fieldsPermissions.insertMany([
    {
        "userRole": "ADMIN",
        "fields": {
            "menu": [
                { "path": "/", "label": "Pesquisa" },
                { "path": "/case", "label": "Novo Caso" },
                { "path": "/penging", "label": "Pendencias" },
                { "path": "/cases", "label": "Casos" }
            ]
        }
    },
    {
        "userRole": "HELPER",
        "fields": {
            "menu": [
                { "path": "/", "label": "Pesquisa" },
                { "path": "/case", "label": "Novo Caso" },
                { "path": "/penging", "label": "Pendencias" }
            ]
        }
    },
    {
        "userRole": "USER",
        "fields": {
            "menu": [
                { "path": "/", "label": "Pesquisa" }
            ]
        }
    }
])

db.getCollection('cases').updateMany(
    {
        '_id': {
            '$in': [
                ObjectId("5ca1a0cccf7beecdc305cb9c"),
                ObjectId("5ca1a0cccf7beecdc305cb9e"),
                ObjectId("5ca1a0cccf7beecdc305cb9f"),
            ]
        }
    },
    {
        '$set': { status: '' }
    },
    {
        upsert: true
    }
)



//finds

db.getCollection('attributes_copy').aggregate([
    { $project: { options: 1 } }
])

db.getCollection('attributes_copy').aggregate([
    { $group: { _id: null, childrens: { $push: "$options.childrens" } } }
])

db.getCollection('attributes_copy').aggregate([
    { $group: { _id: null, childrens: { $push: "$options.parent" } } },
    { $project: { _id: 0, 'childrens': 1 } }
])