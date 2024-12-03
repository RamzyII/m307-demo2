import { createApp, upload } from "./config.js";

const app = createApp({
  user: "blue_flower_6241",
  host: "bbz.cloud",
  database: "blue_flower_6241",
  password: "247987da9d01a614178a41b7c7dfae31",
  port: 30211,
});

/* Startseite */
app.get("/", async function (req, res) {
  res.render("start", { class: "front" });
});

app.get("/impressum", async function (req, res) {
  res.render("impressum", {});
});

app.get("/search", async (req, res) => {
  let posts = await app.locals.pool.query("SELECT * FROM account_recommends");
  if (req.query.suche) {
    posts = await app.locals.pool.query(
      "SELECT * FROM account_recommends WHERE title LIKE '%' || $1 || '%'",
      [req.query.suche]
    );
  }
  res.render("search", { posts: posts.rows });
});

app.get("/intern", async function (req, res) {
  res.render("intern", {});
});

app.get("/overview", async function (req, res) {
  if (!req.session.userid) {
    res.redirect("/register");
    return;
  }
  const songs = await app.locals.pool.query("select * from songs");
  res.render("overview", { songs: songs.rows });
});

/* Wichtig! Diese Zeilen müssen immer am Schluss der Website stehen! */
app.listen(3010, () => {
  console.log(`Example app listening at http://localhost:3010`);
});

app.get("/uploadpfp", async function (req, res) {
  res.render("uploadpfp", {});
});

app.post(
  "/uploadProfilePicture",
  upload.single("profilepicture"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded!" });
      }

      const filePath = `/uploads/profiles/${req.file.filename}`;
      const userId = req.session.userid; // Benutzer-ID aus der Session

      // Update der Datenbank
      await app.locals.pool.query(
        "UPDATE users SET profilpicture = $1 WHERE id = $2",
        [filePath, userId]
      );

      res
        .status(200)
        .json({ message: "Profile picture uploaded successfully!", filePath });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "An error occurred during upload." });
    }
  }
);
