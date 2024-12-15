function openOverlay(song) {
  document.getElementById("recommend-overlay").classList.remove("hidden");
  document.getElementById("overlay-album-img").src =
    song.albumImg || "https://via.placeholder.com/120";
  document.getElementById("overlay-song-title").textContent =
    song.name || "Unknown Title";
  document.getElementById("overlay-song-artist").textContent =
    song.artists || "Unknown Artist";
}

// Schließt das Overlay
function closeOverlay() {
  document.getElementById("recommend-overlay").classList.add("hidden");
  resetOverlay();
}

// Übermittelt die Empfehlung
function submitRecommendation() {
  const comment = document.getElementById("comment-input").value;

  if (comment.trim() === "") {
    alert("Please add a comment before recommending!");
    return;
  }

  // Platzhalter: Kommentar in die Konsole speichern
  console.log("Saving comment to database:", comment);

  // Erfolgsmeldung anzeigen
  document.querySelector(".recommend-submit").style.display = "none";
  document.getElementById("comment-input").style.display = "none";
  document.getElementById("success-message").classList.remove("hidden");
}

// Setzt das Overlay zurück
function resetOverlay() {
  document.getElementById("comment-input").value = "";
  document.querySelector(".recommend-submit").style.display = "block";
  document.getElementById("comment-input").style.display = "block";
  document.getElementById("success-message").classList.add("hidden");
}

// Daten aus Local Storage laden
const songDetailsContainer = document.getElementById("song-details");

songDetailsContainer.innerHTML = `
      <img src="${selectedSong.albumImg}" alt="${selectedSong.name}" style="width: 300px; height: 300px; object-fit: cover;" />
      <h1>${selectedSong.name}</h1>
      <h2>${selectedSong.artists}</h2>
    `;
//   else {
//     // Fallback, wenn keine Daten vorhanden sind
//     document.getElementById("song-details").innerHTML =
//       "<p>No song data found.</p>";
//   }

const selectedSong = JSON.parse(localStorage.getItem("selectedSong"));
// Daten aus Local Storage laden const selectedSong =
if (selectedSong) {
  // Elemente dynamisch befüllen
  document.getElementById("album-cover").src = selectedSong.albumImg;
  document.getElementById("song-title").textContent = selectedSong.name;
  document.getElementById("song-artist").textContent = selectedSong.artists;
  // Albumname prüfen und setzen (verschachtelte Struktur berücksichtigen) const albumName = selectedSong.album?.name ||
  selectedSong.album || "Unknown Album";
  document.getElementById("album-name").textContent = albumName;
} else {
  console.error("No song data found in localStorage.");
}

//Button back to top //
const backToTopButton = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    backToTopButton.classList.add("show");
  } else {
    backToTopButton.classList.remove("show");
  }
});

backToTopButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

app.get('/songs', async (req, res) => {
  const db = await getDatabaseConnection();

  // SQL-Abfrage: Songs und Empfehlungen abrufen
  const songs = await db.query(`
    SELECT id, title, artist, image, recommend_count 
    FROM songs 
    ORDER BY recommend_count DESC
  `);

  // Songs rendern
  res.render('your-template-name', { songs });
});


