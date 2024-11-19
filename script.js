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
