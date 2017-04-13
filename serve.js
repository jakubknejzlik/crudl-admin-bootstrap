const express = require("express");
const path = require("path");

const app = express();

// crudl core
app.use("/crudl/crudl.js", (req, res) => res.redirect("http://cdn.crudl.io/static/releases/0.2.0/crudl.js"));
app.use("/crudl/crudl-ui/css/crudl-ui.css", (req, res) => res.redirect("http://cdn.crudl.io/static/releases/0.2.0/crudl-ui/css/crudl-ui.css"));

// index
app.use("/static/", express.static(__dirname + "/static/"));
app.get("/*", function(request, response) {
  response.sendFile(path.join(__dirname, "/static/", "index.html"));
});

// start server
var port = process.env.PORT || 3002;
app.listen(port);
console.log("Server running on port " + port);
