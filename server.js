const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwksRsa = require("jwks-rsa");
const jwt = require("express-jwt");
var AWS = require("aws-sdk");
require("dotenv").config();
const { issuer, jwksURI } = require("./config/extras");
const sls = require("serverless-http");
const { createUser, updateUser, getUser, userPublicInfo } = require("./controller/user");
const { createPage, deletePages, getPages, updatePage } = require("./controller/pages");
const { createContent, deleteContent, getContent, updateContent } = require("./controller/content");
const { getCategories } = require("./controller/master");
const { getNotification, getNotificationCount } = require("./controller/notification");
const PageValidator = require("./validator/page");
String.prototype.format = function() {
  var formatted = this;
  for (var i = 0; i < arguments.length; i++) {
      var regexp = new RegExp('\\{'+i+'\\}', 'gi');
      formatted = formatted.replace(regexp, arguments[i]);
  }
  return formatted;
};

const app = express();

const port = process.env.NODE_PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());
app.options("*", cors());

const checkJwt = jwt({
  // Dynamically provide a signing key
  // based on the kid in the header and
  // the signing keys provided by the JWKS endpoint.

  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: jwksURI,
  }),

  // Validate the audience and the issuer.
  //audience: AUTH0_AUDIENCE,
  issuer: issuer,
  algorithms: ["RS256"],
});

app.get("/public/users/:username", userPublicInfo);
app.use(checkJwt);

//models

const User = require("./models/User");
const Page = require("./models/Page");

var db = require("./config/key").mongoURI;

mongoose
  .connect(db)
  .then(() => {
    console.log("database connected..");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/categories", getCategories);
app.post("/users", createUser);
app.put("/users/:id", updateUser);
app.get("/users/:id", getUser);

app.post("/pages", PageValidator.postAPI, createPage);
app.put("/pages/:id", updatePage);
app.get("/pages", getPages);
app.delete("/pages", deletePages);

app.post("/contents", createContent);
app.put("/contents/:id", updateContent);
app.get("/contents", getContent);
app.delete("/contents", deleteContent);

app.get("/notifications/count", getNotificationCount);
app.get("/notifications", getNotification);

module.exports.run = sls(app);

//Start server
app.listen(port, () => {
  console.log(`Server started on port ${port}...`);
});