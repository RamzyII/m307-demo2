const BASE_URL = "https://api.spotify.com/v1/";
let topThreeSongs = {};

const token =
  "BQC3OFuDbM3p5y8UxyOPlMGbKEDQGgQ_AYAYJbs6Q-4PV5qggVjDcFV3Zu876_i0sCErURWUVUCpv8IxX9aFjo4mn5ndtBWXEg81358gl3j-ppfjj55zRlIfasPKQbM9dBxmnpw44xFhebhE2VwAnltxsmKUdQOusLdaWm-3qwTsYBwfOUkiSCcIHqVdcUhaivtk5KamcIzJU5VY67RWl_3a4NQC9N3qVGrC15PiXUDSux0A8mCgeSa2MOaPj1NZDrLdF46y-JIr9ko_XfgzqWWerryerDv4";

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
    const dropdownMenu = document.getElementById("dropdown-menu");
    dropdownMenu.innerHTML = ""; // Alte Inhalte entfernen
    const songs = data.tracks.items.slice(0, 5); // Erste drei Songs
    songs.forEach((song) => {
      const songElement = document.createElement("div");
      songElement.className = "song-info";

      const albumImg =
        song.album.images.length > 0
          ? song.album.images[0].url
          : "placeholder.jpg"; // Fallback-Bild

      songElement.innerHTML = `
        <img src="${albumImg}" alt="${song.name}" />
        <div class="name-and-artist">
          <p class="song-title">${song.name}</p>
          <p class="song-artist">${song.artists
            .map((artist) => artist.name)
            .join(", ")}</p>
        </div>
      `;

      // Klick-Event hinzufügen
      songElement.addEventListener("click", () =>
        handleSongClick({
          name: song.name,
          artists: song.artists.map((artist) => artist.name).join(", "),
          albumImg: albumImg,
        })
      );

      dropdownMenu.appendChild(songElement);
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
