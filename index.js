import { createApp } from "./config.js";

const app = createApp({
  user: "blue_flower_6241",
  host: "bbz.cloud",
  database: "blue_flower_6241",
  password: "247987da9d01a614178a41b7c7dfae31",
  port: 30211,
});

/* Startseite */
app.get("/", async function (req, res) {
  res.render("start", {});
});

app.get("/impressum", async function (req, res) {
  res.render("impressum", {});
});

/* Wichtig! Diese Zeilen müssen immer am Schluss der Website stehen! */
app.listen(3010, () => {
  console.log(`Example app listening at http://localhost:3010`);
});
