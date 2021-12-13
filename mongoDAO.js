const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';

const dbName = 'lecturersDB'
const collName = 'lecturers'

var lecturersDB
var lecturers

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((client) => {
        lecturersDB = client.db(dbName)
        lecturers = lecturersDB.collection(collName)//Storing employeesDB collection in employees variable.
    })
    .catch((error) => {
        console.log(error)
    })

var getLecturers = function () {
    return new Promise((resolve, reject) => {
        var cursor = lecturers.find().sort({ _id: 1 })
        cursor.toArray()
            .then((documents) => {
                console.log(documents)
                resolve(documents)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

var addLecturers = function (_id, name, dept) {
    return new Promise((resolve, reject) => {
        lecturers.insertOne({ "_id": _id, "name": name, "dept": dept })
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                console.log(error)
                reject(error)
            })
    })
}

module.exports = { getLecturers, addLecturers };