import React from "react";
import CustomDashboard from "./custom/Dashboard";

var users = require("./views/users");
var connectors = require("./connectors/connectors");
var { login, logout } = require("./auth");

const baseURL = "http://...";

var admin = {
  title: "Admin beta",
  options: {
    debug: true,
    basePath: "/",
    baseURL: baseURL
  },
  connectors,
  views: {
    users
  },
  auth: {
    login,
    logout
  },
  custom: {
    dashboard: <CustomDashboard />
  },
  messages: {
    "login.button": "Sign in",
    "logout.button": "Sign out",
    "logout.affirmation": "Have a nice day!",
    pageNotFound: "Sorry, page not found."
  }
};

export default admin;
