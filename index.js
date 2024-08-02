const express = require("express");
const bodyParser = require("body-parser");
const consign = require("consign");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

consign()
  .include('controllers')
  .then('routes')
  .into(app);

app.listen(4223, () => {
  console.log("Aplicação rodando na porta 4223.");
});

