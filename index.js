const express = require("express");
const bodyParser = require("body-parser");
const consign = require("consign");

const app = express();

app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

consign()
  .include('database/connection.js')
  .then('controllers')
  .then('routes')
  .into(app);

app.listen(4223, () => {
  console.log("Aplicação rodando na porta 4223.");
});
