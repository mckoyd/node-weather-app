const chalk = require("chalk");
const dotenv = require("dotenv");
const express = require("express");
const path = require("path");
const hbs = require("hbs");
const { getCoordinates, getCityData } = require("./utils/weather");
const app = express();
const log = console.log;

dotenv.config();
const { PORT } = process.env;

// Define paths for express config
const PUBLIC_DIR_PATH = path.join(__dirname, "../public");
const VIEWS_PATH = path.join(__dirname, "../templates/views");
const PARTIALS_PATH = path.join(__dirname, "../templates/partials");

// Setup handlebars engine and dir
app.set("view engine", "hbs");
app.set("views", VIEWS_PATH);
hbs.registerPartials(PARTIALS_PATH);

// Serve static files
app.use(express.static(PUBLIC_DIR_PATH));

app.get("/", (req, res) =>
  res.render("index", {
    title: "Weather",
    name: "W01F",
  })
);

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About",
    name: "W01F",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help",
    message: "Helpful message",
    name: "W01F",
  });
});

app.get("/help/*", (req, res) =>
  res.render("not-found", {
    title: "Can't help!",
    message: "Can't find the help article you're looking for",
    name: "W01F",
  })
);

app.get("/weather", async (req, res) => {
  const { address } = req.query;
  if (!address) {
    return res.send({
      error: "You must provide an address",
    });
  }
  const forecast = await getCityData(address);
  res.send(forecast);
});

app.get("/products", (req, res) => {
  const { search } = req.query;
  if (!search) {
    return res.send({
      error: "You must provide a search term",
    });
  }
  res.send({
    products: [],
  });
});

app.get("*", (req, res) => {
  res.render("not-found", {
    title: "Page not found!",
    message: "Can't find the page you're looking for...",
    name: "W01F",
  });
});

app.listen(PORT, () =>
  log(chalk.yellow(`[OK] App now running on port: ${PORT}`))
);
