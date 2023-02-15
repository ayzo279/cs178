// Based on tutorial: https://medium.com/@diogo.fg.pinheiro/simple-to-do-list-app-with-node-js-and-mongodb-chapter-1-c645c7a27583
// Load relevant modules
const express = require('express');
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const TodoTask = require("./models/TodoTask");

// Initializes app
const app = express();

dotenv.config();

// mounts relevant middleware
app.use("/static", express.static("public"));

app.use(express.urlencoded({ extended: true }));

// Distinct Concept 3: Async (general architecture of Node.js is asynchronous)

// Connects to MongoDB database
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
    console.log("connected to db :)");
    app.listen(3000, () => console.log("Server up and running :)"));
});

// Shared Concept 1: Template
app.set("view engine", "ejs");

// GET: Reads todos from database
app.get('/', (req, res) => {
    // Distinct Concept 2: Document
    TodoTask.find({}, (err, tasks) => {
        res.render("todo.ejs", { todoTasks: tasks });
    });
});

// POST: Writes todo into database
// Shared Concept 3: Requests
app.post('/', async (req, res) => {
    // Distinct Concept 2: Document
    const todoTask = new TodoTask({
        content: req.body.content
    });
    try {
        await todoTask.save();
        console.log("success");
        res.redirect("/");
    }
    catch (err) {
        console.log("fail");
        res.redirect("/");
    }
});

// Shared Concept 2: Routing 
// Update the databse
app.route("/edit/:id")
// GET: Reads todo to be edited
// Shared Concept 3: Requests
.get((req, res) => {
    const id = req.params.id;
    // Distinct Concept 2: Document
    TodoTask.find({}, (err, tasks) => {
    res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
    });
})
// POST: Overwrites todo with edits
// Shared Concept 3: Requests
.post((req, res) => {
    const id = req.params.id;
    // Distinct Concept 2: Document
    TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
        if (err) return res.send(500, err);
        res.redirect("/");
    });
});

// Shared Concept 2: Routing & Shared Concept 3: Requests
// Delete todo from the database
app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    // Distinct Concept 2: Document
    TodoTask.findByIdAndRemove(id, err => {
        if (err) return res.send(500, err);
        res.redirect("/");
    });
});
