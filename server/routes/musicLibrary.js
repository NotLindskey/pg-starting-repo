const express = require("express");
const router = express.Router();
const pg = require("pg");

const Pool = pg.Pool;

// pool configurations
const pool = new Pool({
	database: "lydian_intro",
	host: "localhost",
	port: 5432,
	max: 10,
	idleTimeOutMillis: 30000,
});

pool.on("connect", () => {
	console.log("postgres is connected");
});

pool.on("error", (error) => {
	console.log("an error w/ postgres pool,", error);
});

router.get("/", (req, res) => {
	let queryText = "SELECT * from songs;";
	pool
		.query(queryText)
		.then((result) => {
			console.log("results from bd", result);
			res.send(result.rows);
		})
		.catch((error) => {
			console.log("error making a query", error);
		});
});

router.post("/", (req, res) => {
	const newSong = req.body;
	const queryText = `  
    INSERT INTO "songs" ("rank", "artist", "track", "published")
    VALUES (${newSong.rank}, '${newSong.artist}', '${newSong.track}', '${newSong.published}');
    `;
	pool
		.query(queryText)
		.then((result) => {
			console.log("result", result);
			res.sendStatus(201);
		})
		.catch((error) => {
			console.log("error making insert query", error);
			res.sendStatus(500);
		});
});

module.exports = router;
