// import express from "express";
// import { engine } from "express-handlebars";
// import pg from "pg";
// import bcrypt from "bcrypt";
// const { Pool } = pg;
// import cookieParser from "cookie-parser";
// import sessions from "express-session";

// export function createApp(dbconfig) {
//   const app = express();

//   const pool = new Pool(dbconfig);

//   app.engine("handlebars", engine());
//   app.set("view engine", "handlebars");
//   app.set("views", "./views");

//   app.use(express.static("public"));
//   app.use(express.urlencoded({ extended: true }));
//   app.use(cookieParser());

//   app.use(
//     sessions({
//       secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
//       saveUninitialized: true,
//       cookie: { maxAge: 86400000, secure: false },
//       resave: false,
//     })
//   );

//   app.locals.pool = pool;

//   app.get("/register", function (req, res) {
//     res.render("register");
//   });

//   app.post("/register", function (req, res) {
//     var passwort = bcrypt.hashSync(req.body.passwort, 10);
//     pool.query(
//       "INSERT INTO users (email, passwort) VALUES ($1, $2)",
//       [req.body.email, passwort],
//       (error, result) => {
//         if (error) {
//           console.log(error);
//         }
//         res.redirect("/login");
//       }
//     );
//   });

//   app.get("/login", function (req, res) {
//     res.render("login");
//   });

//   app.post("/login", function (req, res) {
//     console.log(req.body);
//     pool.query(
//       "SELECT * FROM users WHERE email = $1",
//       [req.body.email],
//       (error, result) => {
//         if (error) {
//           console.log(error);
//         }
//         console.log(result.rows);
//         if (bcrypt.compareSync(req.body.passwort, result.rows[0].passwort)) {
//           req.session.userid = result.rows[0].id;
//           res.redirect("/intern");
//         } else {
//           res.redirect("/login");
//         }
//       }
//     );
//   });

//   return app;
// }

// export { upload };

// Chat Fix 1
import express from "express";
import { engine } from "express-handlebars";
import pg from "pg";
import bcrypt from "bcrypt";
const { Pool } = pg;
import cookieParser from "cookie-parser";
import sessions from "express-session";

export function createApp(dbconfig) {
  const app = express();

  const pool = new Pool(dbconfig);

  app.engine("handlebars", engine());
  app.set("view engine", "handlebars");
  app.set("views", "./views");

  app.use(express.static("public"));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use(
    sessions({
      secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
      saveUninitialized: true,
      cookie: { maxAge: 86400000, secure: false },
      resave: false,
    })
  );

  app.locals.pool = pool;

  app.get("/register", function (req, res) {
    res.render("register");
  });

  app.post("/register", function (req, res) {
    var passwort = bcrypt.hashSync(req.body.passwort, 10);
    pool.query(
      "INSERT INTO users (email, passwort) VALUES ($1, $2)",
      [req.body.email, passwort],
      (error, result) => {
        if (error) {
          console.log(error);
        }
        res.redirect("/login");
      }
    );
  });

  app.get("/login", function (req, res) {
    res.render("login");
  });

  app.post("/login", function (req, res) {
    console.log(req.body);
    pool.query(
      "SELECT * FROM users WHERE email = $1",
      [req.body.email],
      (error, result) => {
        if (error) {
          console.log(error);
        }
        console.log(result.rows);
        if (bcrypt.compareSync(req.body.passwort, result.rows[0].passwort)) {
          req.session.userid = result.rows[0].id;
          res.redirect("/intern");
        } else {
          res.redirect("/login");
        }
      }
    );
  });

  return app;
}
// Define a self-contained storage object
const localStorageMock = {
  storage: {},

  setItem(key, value) {
    this.storage[key] = value;
  },

  getItem(key) {
    return this.storage[key] || null;
  },

  removeItem(key) {
    delete this.storage[key];
  },

  clear() {
    this.storage = {};
  },
};

// Replace the reference to `localStorage` with `localStorageMock`
const localStorage = localStorageMock;

// Comment for testing
// const selectedSong = JSON.parse(localStorage.getItem("selectedSong"));
// // Daten aus Local Storage laden const selectedSong =
// if (selectedSong) {
//   // Elemente dynamisch befüllen
//   document.getElementById("album-cover").src = selectedSong.albumImg;
//   document.getElementById("song-title").textContent = selectedSong.name;
//   document.getElementById("song-artist").textContent = selectedSong.artists;
//   // Albumname prüfen und setzen (verschachtelte Struktur berücksichtigen) const albumName = selectedSong.album?.name ||
//   selectedSong.album || "Unknown Album";
//   document.getElementById("album-name").textContent = albumName;
// } else {
//   console.error("No song data found in localStorage.");
// }

// //Button back to top //
// const backToTopButton = document.getElementById("backToTop");
// window.addEventListener("scroll", () => {
//   if (window.scrollY > 100) {
//     backToTopButton.classList.add("show");
//   } else {
//     backToTopButton.classList.remove("show");
//   }
// });

// backToTopButton.addEventListener("click", () => {
//   window.scrollTo({ top: 0, behavior: "smooth" });
// });

const BASE_URL = "https://api.spotify.com/v1/";
let topThreeSongs = {};

const token =
  "BQAHmDFBNc6kJ9GAF5hRGbME1mbGh3yJ1C0CLOaxiko1JSi0YvwbAtOjd5oCMeNHVyftQcv475NmBdLKArJ_fbY1adFrB943mSg0c7WjwaIVqi4PM7iWfl_VelTIQDwO07aOsk1Jb_3ChosoVjNBTf8mcPGCg6RwkO2PHmuIvOvDMtdjhdetI-2Hpm9X9__y3Po7rtJskeQeMYraPqd9acNjpop1La4nhqifd2vn7xkd_r_gz5M5DErC1tatPJCSvvFxmhYtlrPQhDD3hOMQWRcJsqnSU3ln";

async function fetchWebApi(songname, page) {
  songname = songname.replace(" ", "+");
  const res = await fetch(
    `${BASE_URL}search?q=${songname}&type=track&offset=${page}&limit=50`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "GET", // Specify GET method properly
    }
  );
  return await res.json();
}

async function makeApiCall(suchewort) {
  try {
    const result = await fetchWebApi(suchewort, 0);
    // Print the first three song names
    printFirstThreeSongs(result);
    return result;
  } catch (error) {
    if (error.status === 401) {
      // Check if the error is an unauthorized error
      console.log("Token missing");
    }
    console.error("Error fetching API:", error);
  }
}

function printFirstThreeSongs(data) {
  if (data.tracks && data.tracks.items) {
    const resultsContainer = document.querySelector(".results-container");
    resultsContainer.innerHTML = ""; // Alte Inhalte entfernen

    data.tracks.items.forEach((track) => {
      const resultElement = document.createElement("div");
      resultElement.className = "result-item";

      const albumImg =
        track.album.images[0]?.url || "https://via.placeholder.com/50";

      resultElement.innerHTML = `
        <img src="${albumImg}" alt="${track.name}" />
        <div class="result-info">
          <p class="result-title">${track.name}</p>
          <p class="result-artist">${track.artists
            .map((artist) => artist.name)
            .join(", ")}</p>
        </div>
      `;

      resultElement.addEventListener("click", () =>
        handleSongClick({
          name: track.name,
          artists: track.artists.map((artist) => artist.name).join(", "),
          albumImg: albumImg,
        })
      );

      resultsContainer.appendChild(resultElement);
    });
  } else {
    console.error("No tracks found in the response.");
  }
}

// Funktion, die einen Song speichert und die Seite wechselt
function handleSongClick(song) {
  // Song-Daten im Local Storage speichern
  localStorage.setItem("selectedSong", JSON.stringify(song));
  // Auf die neue Seite weiterleiten
  window.location.href = "song.html";
}

// Öffnet das Overlay
// function openOverlay(song) {
//   document.getElementById("recommend-overlay").classList.remove("hidden");
//   document.getElementById("overlay-album-img").src =
//     song.albumImg || "https://via.placeholder.com/120";
//   document.getElementById("overlay-song-title").textContent =
//     song.name || "Unknown Title";
//   document.getElementById("overlay-song-artist").textContent =
//     song.artists || "Unknown Artist";
// }

// // Schließt das Overlay
// function closeOverlay() {
//   document.getElementById("recommend-overlay").classList.add("hidden");
//   resetOverlay();
// }

// // Übermittelt die Empfehlung
// function submitRecommendation() {
//   const comment = document.getElementById("comment-input").value;

//   if (comment.trim() === "") {
//     alert("Please add a comment before recommending!");
//     return;
//   }

//   // Platzhalter: Kommentar in die Konsole speichern
//   console.log("Saving comment to database:", comment);

//   // Erfolgsmeldung anzeigen
//   document.querySelector(".recommend-submit").style.display = "none";
//   document.getElementById("comment-input").style.display = "none";
//   document.getElementById("success-message").classList.remove("hidden");
// }

// // Setzt das Overlay zurück
// function resetOverlay() {
//   document.getElementById("comment-input").value = "";
//   document.querySelector(".recommend-submit").style.display = "block";
//   document.getElementById("comment-input").style.display = "block";
//   document.getElementById("success-message").classList.add("hidden");
// }

// // Daten aus Local Storage laden
// const songDetailsContainer = document.getElementById("song-details");

// songDetailsContainer.innerHTML = `
//     <img src="${selectedSong.albumImg}" alt="${selectedSong.name}" style="width: 300px; height: 300px; object-fit: cover;" />
//     <h1>${selectedSong.name}</h1>
//     <h2>${selectedSong.artists}</h2>
//   `;
// else {
//   // Fallback, wenn keine Daten vorhanden sind
//   document.getElementById("song-details").innerHTML =
//     "<p>No song data found.</p>";
// }
