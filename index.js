// Add Express
const fs = require("fs");
const { marked } = require("marked");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const client = require("./database/index");

// Initialize Express
const app = express();

app.use(expressLayouts);
app.use(express.static("public"));

// set layout.
app.set("layout", "./layout/main");
// set the view engine to ejs.
app.set("view engine", "ejs");

app.get("/", async (_, res) => {
  const listTodo = await client`SELECT * FROM todos ORDER BY id;`;
  listTodo.map((todo) => {
    todo.list = JSON.parse(todo.list);
    return todo;
  });
  res.render("index", { listTodo });
});

app.get("/api/todo/update/:id/:idTask", async (req, res) => {
  const {id, idTask} = req.params;
  const todos = await client`SELECT * FROM todos WHERE id = ${id};`;
  const listTask = JSON.parse(todos[0]?.list);
  if (listTask) {
    listTask.map((task) => {
      if (task.id == idTask) {
        task.completed = !task.completed;
      }
      return task;
    });
    await client`UPDATE todos SET list = ${JSON.stringify(listTask)} WHERE id = ${id};`;
    return res.status(200).json("Updated data");
  } else {
    return res.status(404).json("No todo found.");
  }
});

app.get("/about", (_, res) => {
  const pathMd = __dirname + "/README.md";
  const file = fs.readFileSync(pathMd, "utf-8");
  res.render("about", { data: marked(file.toString()) });
});

app.get("/*", (_, res) => {
  res.render("404");
});

// Initialize server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}.`);
});
