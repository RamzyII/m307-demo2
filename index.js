// Import der Konfiguration
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
  res.render("start", { class: "front" });
});

app.get("/impressum", async function (req, res) {
  res.render("impressum", {});
});

/* Suche in der Datenbank */
app.get("/search", async (req, res) => {
  
  let posts = await app.locals.pool.query("SELECT * FROM account_recommends");
  // if (req.query.suche) {
  //   posts = await app.locals.pool.query(
  //     "SELECT * FROM account_recommends WHERE title LIKE '%' || $1 || '%'",
  //     [req.query.suche]
  //   );
  // }
  if (!req.session.userid) {
    res.render("search", { posts: posts.rows });
    return;
  }
});

/* Intern-Seite */
app.get("/intern", async function (req, res) {
  res.render("intern", {});
});

/* Übersicht der Songs */
app.get("/overview", async function (req, res) {
  if (!req.session.userid) {
    res.redirect("/register");
    return;
  }
  const songs = await app.locals.pool.query("SELECT * FROM songs");
  res.render("overview", { songs: songs.rows });
});


/*
app.post("/create_post", upload.single('image'), async function (req, res) {
  await app.locals.pool.query("INSERT INTO todos (text, dateiname) VALUES ($1, $2)", [req.body.text, req.file.filename]);
  res.redirect("/");
});
*/

/* Route zum Speichern von Likes */
app.post("/like/:id", async function (req, res) {
  const user = await login.loggedInUser(req);
  if (!user) {
    res.redirect("/login");
    return;
  }

  await app.locals.pool.query(
    "INSERT INTO likes (post_id, user_id) VALUES ($1, $2)",
    [req.params.id, user.id]
  );
  res.redirect("/");
});

/* Route zum Speichern von Kommentaren */
app.post("/api/recommend", async (req, res) => {
  const { song_id, kommentar } = req.body;

  if (!song_id || !kommentar) {
    return res.status(400).json({ message: "Song ID and comment are required!" });
  }

  try {
    // Füge Kommentar in die 'account_recommends'-Tabelle ein
    await app.locals.pool.query(
      "INSERT INTO account_recommends (song_id, kommentar) VALUES ($1, $2)",
      [song_id, kommentar]
    );

    res.status(200).json({ message: "Recommendation saved!" });
  } catch (error) {
    console.error("Error inserting recommendation:", error);
    res.status(500).json({ message: "Database error!" });
  }
});



app.get('/new', (req, res) => {
  res.render('new_todo');
});

/* Route zum Anzeigen von Kommentaren */
app.get("/api/comments/:song_id", async (req, res) => {
  const { song_id } = req.params;

  try {
    const result = await app.locals.pool.query(
      "SELECT kommentar FROM account_recommends WHERE song_id = $1",
      [song_id]
    );
    res.json(result.rows); // Rückgabe der Kommentare als JSON
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Database error!" });
  }
});


app.post("/recommend/:id", async function (req, res) {
  try {
    const songId = req.params.id;

    console.log("Song ID received:", songId);

    const result = await app.locals.pool.query(
      "UPDATE songs SET recommends = COALESCE(recommends, 0) + 1 WHERE id = $1 RETURNING recommends",
      [songId]
    );

    if (result.rowCount === 0) {
      console.log("No song found with ID:", songId);
      return res.status(404).json({ error: "Song not found" });
    }

    console.log("Updated recommends:", result.rows[0].recommends);

    res.status(200).json({ recommends: result.rows[0].recommends });
  } catch (error) {
    console.error("Error updating recommends:", error.message);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});


/* Song-Seite */
app.get("/song", async function (req, res) {
  res.render("song", {});
});

/* Recommend-Seite */
app.get("/recommend", async function (req, res) {
  res.render("recommend", {});
});

/* Upload Profilbild */
app.get("/uploadpfp", async function (req, res) {
  res.render("uploadpfp", {});
});

/* Server starten */
app.listen(3010, () => {
  console.log(`Example app listening at http://localhost:3010`);
});
