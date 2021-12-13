var mysql = require('promise-mysql');
var pool

//Connection to our collegedb Database.
mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'collegedb'
})
    .then((result) => {
        pool = result
    })
    .catch((error) => {
        console.log(error)
    });

var getModules = function () {
    return new Promise((resolve, reject) => {
        pool.query('select * From module')//Runs a query on the pool.
            .then((result) => {
                resolve(result)
            })
            .catch(() => {
                reject(error)
            })
    })
}

var getStudents = function()
{
    return new Promise((resolve, reject)=>{
        pool.query('select * From student')//Runs a query on the pool
        .then((result)=>
        {
            resolve(result)
        })
        .catch(()=>{
            reject(error)
        })
    })
}

var delStudent = function(sid)
{
return new Promise((resolve,reject)=>{
    var myQuery={
        sql: 'delete from student where sid = ?',
        values: [sid]
    }
    pool.query(myQuery)
    .then((result)=>{
        resolve(result)

    })
    .catch((error)=>{
        reject(error)
    })
})
}

// var addStudent = function(sid,name,gpa)
// {
//     return new Promise((resolve,reject)=>{
//         var myQuery = {
//             sql:'INSERT INTO student (sid,name,gpa)',
//             values: [sid,name,gpa]
//         }
//         pool.query(myQuery)       
//         .then((result)=>{
//             resolve(result)
//         })
//         .catch((error)=>{
//             reject(error)
//         })
//     })
// }

module.exports = { getModules,getStudents,delStudent };//addStudent