//Requirements
var ejs = require('ejs')
const express = require('express')
var mySQLDAO = require('./mySQLDAO')
var mongoDAO = require('./mongoDAO')
var bodyParser = require('body-parser')
var pool
const { body, validationResult, check } = require('express-validator');
const { Pool } = require('promise-mysql')

//Variables
var app = express()

//App usage
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json());


//Engine view
app.set('view engine', 'ejs')

// Home Page
app.get('/', (req, res) => {
    res.render('homePage')

})

// List Modules Page
app.get('/listModules', (req, res) => {
    mySQLDAO.getModules()
        .then((result) => {
            res.render('showModules', { modules: result })
        })
        .catch((error) => {
            res.send(error)
        })
})
// Edit Module Page - **POST ALSO NEEDED**
app.get('/module/edit:mid', (req, res) => {
    console.log("GET on /")
    res.render('editModules')
})
// List Students Studying Module Page
app.get('/module/students/:mid', (req, res) => {
    console.log("GET on /")
    res.send("<h1>List Students Studying Module Page</h1>")
})













// List Students Page
app.get('/listStudents', (req, res) => {
    mySQLDAO.getStudents()      ///////////USE THIS SIMILAR FOR ADDING STUDENTS - USE A QUERY.
        .then((result) => {
            res.render('showStudents', { students: result })
        })
        .catch((error) => {
            res.send(error)
        })
})
// Delete Student Page
app.get('/students/delete/:sid', (req, res) => {
    mySQLDAO.delStudent(req.params.sid)
        .then((result) => {
            res.send(result)
        })
        .catch((error) => {
            res.send(error)
        })
})
// Add Student Page
app.get('/addStudent', (req, res) => {
    res.render("addStudent", { errors: undefined })
})

//Add Student Page (POST)
app.post('/addStudent',
    [check('sid').isLength({ min: 4, max: 4 }).withMessage("Student ID must be 4 Characters"),
    check('name').isLength({ min: 5 }).withMessage("Name must be at least 5 Characters"),
    check('gpa').isFloat({ min: 0.0, max: 4.0 }).withMessage("GPA must be between 0.0 and 4.0")],
    (req, res) => {
        var errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.render("addStudent", { errors: errors.errors })
        }
        else {
            // mySQLDAO.addStudent()
            // .then((result)=>{
            //     res.render('showStudents', { students: result })
            // })
            // .catch((error)=>{
            //     res.send(error)
            // })
        }
    })







// List Lecturers Page (MongoDB)
app.get('/listLecturers', (req, res) => {
    mongoDAO.getLecturers()
        .then((documents) => {
            res.render('showLecturers', { lecturers: documents })
        })
        .catch((error) => {
            res.send(error)
        })
})
// Add Lecturer Page (MongoDB) GET
app.get('/addLecturer', (req, res) => {
    res.render("addLecturer", { errors: undefined })
})

// Add Lecturer Page (MongoDB) POST
app.post('/addLecturer',
    [check('_id').isLength({ min: 4, max: 4 }).withMessage("Lecturer ID must be 4 Characters"),
    check('name').isLength({ min: 5 }).withMessage("Name must be at least 5 Characters"),
    check('dept').isLength({ min: 3, max: 3 }).withMessage("Dept must be 3 characters")],
    (req, res) => {
        var errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.render("addLecturer", { errors: errors.errors })
        }
        else {
            mongoDAO.addLecturers(req.body._id, req.body.name, req.body.dept)
                .then((result) => {
                    res.redirect('/listLecturers')
                })
                .catch((error) => {
                    if (error.message.includes("11000")) {
                        res.send("Lecturer with an ID of:" + req.body._id + "already exists.")
                    }
                    res.send(error.message)
                })
        }
    })



app.listen(3000, () => {
    console.log("Listening on Port 3000")
})

