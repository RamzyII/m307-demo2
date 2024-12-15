app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", function (req, res) {
  var password = bcrypt.hashSync(req.body.password, 10);
  pool.query(
    "INSERT INTO users (username, password) VALUES ($1, $2)",
    [req.body.username, password],
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
  pool.query(
    "SELECT * FROM users WHERE username = $1",
    [req.body.username],
    (error, result) => {
      if (error) {
        console.log(error);
      }
      if (bcrypt.compareSync(req.body.password, result.rows[0].password)) {
        req.session.userid = result.rows[0].id;
        res.redirect("/");
      } else {
        res.redirect("/login");
      }
    }
  );
});

// ApiCaller
const BASE_URL = "https://api.spotify.com/v1/";

const token =
  "BQCT8dF5TT_qShlxEgEPSG08F5zbRZgM6dp4aad3lz6MKgZxnzZ7bnzZAY1RXjI9hnzCHaApbb018tz5LiWuZD_qgdNmIfchZTXZTcrjXo-iyycD_b1YHosoN-yqDistfk-L96rn56iv2g6mhM_MQE4R_fV7sc7My88zLad3X5v4IpcA6D6ksm6xLKGQ1cAB3j2CcWxWj3KrJqLcNkBBCIXWGLjppbWkKpMvJlUSFhlLhqY4h3dChl-FBATRiuwjcyEXG3XjgOVSNw";

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
    console.log(`I am Called succesfully! Thinking about: ${suchewort}`);
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
    const songs = data.tracks.items.slice(0, 3); // Get the first 3 items
    songs.forEach((song, index) => {
      const songName = song.name;
      const artistNames = song.artists.map((artist) => artist.name).join(", ");
      const albumImage =
        song.album.images.length > 0
          ? song.album.images[0].url
          : "No image available";

      console.log(`Song: ${songName}`);
      console.log(`Artist(s): ${artistNames}`);
      console.log(`Album Image: ${albumImage}`);
      console.log("-------------------------");

      topThreeSongs[`song${index + 1}`] = {
        name: songName,
        artist: artistNames,
        picture: albumImage,
      };
    });
  } else {
    console.error("No tracks found in the response.");
  }
}

async function recommendSong(songId) {
  try {
    const response = await fetch(`http://localhost:3010/recommend/${songId}`, {
      method: "POST",
    });

    if (response.ok) {
      const data = await response.json();
      alert(`Recommendation added! Total: ${data.recommends} ®`);
      window.location.reload();
    } else {
      alert("Failed to add recommendation.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Could not connect to the server.");
  }
}
