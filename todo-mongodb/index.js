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

// Connects to MongoDB database
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
    console.log("connected to db :)");
    app.listen(3000, () => console.log("Server up and running :)"));
});

app.set("view engine", "ejs");

// GET: Reads todos from database
app.get('/', (req, res) => {
    TodoTask.find({}, (err, tasks) => {
        res.render("todo.ejs", { todoTasks: tasks });
    });
});

// POST: Writes todo into database
app.post('/', async (req, res) => {
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

// Update the databse
app.route("/edit/:id")
// GET: Reads todo to be edited
.get((req, res) => {
    const id = req.params.id;
    TodoTask.find({}, (err, tasks) => {
    res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
    });
})
// POST: Overwrites todo with edits
.post((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
        if (err) return res.send(500, err);
        res.redirect("/");
    });
});

// Delete todo from the database
app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndRemove(id, err => {
        if (err) return res.send(500, err);
        res.redirect("/");
    });
});
