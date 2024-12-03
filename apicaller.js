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

// Call the function to initiate the API call
let topThreeSongs = {};
const songsData = await makeApiCall("bauch beine po"); // Wait for the API call to finish
console.log(topThreeSongs); // Log the returned data
