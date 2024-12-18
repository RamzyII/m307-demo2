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
    pool.query(
      "SELECT * FROM users WHERE email = $1",
      [req.body.email],
      (error, result) => {
        if (error) {
          console.log(error);
        }
        if (result.rows.length > 0 && bcrypt.compareSync(req.body.passwort, result.rows[0].passwort)) {
          req.session.userid = result.rows[0].id;
          res.redirect("/intern");
        } else {
          res.redirect("/login");
        }
      }
    );
  });

  // Empfehlen-Route
  app.post("/recommend/:id", async (req, res) => {
    const { id } = req.params;

    try {
      const query = `
        UPDATE songs
        SET recommends = recommends + 1
        WHERE id = $1
        RETURNING recommends;
      `;
      const { rows } = await pool.query(query, [id]);
      res.status(200).json({ recommends: rows[0].recommends });
    } catch (error) {
      console.error("Fehler beim Aktualisieren der Empfehlungen:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  return app;
}
