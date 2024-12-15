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
