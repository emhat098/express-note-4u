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
  const listTodo = await client`SELECT * FROM todos;`;
  listTodo.map((todo) => {
    todo.list = JSON.parse(todo.list);
    return todo;
  });
  res.render("index", { listTodo });
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
