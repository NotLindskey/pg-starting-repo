const express = require("express");
const router = express.Router();
const pool = require("../modules/pool");

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

// to test and see if route is set up correctly
router.get("/:id", (req, res) => {
	console.log("Hello from get request!", req.params.id);
	const queryText = `SELECT * from songs ORDER BY id asc;`;
	pool
		.query(queryText)
		.then((result) => {
			console.log("results from DB", result);
			res.send(result.rows);
		})
		.catch((error) => {
			console.log("error making a query", error);
			res.sendStatus(500);
		});
});

router.delete("/:id", (req, res) => {
	console.log("Hello from delete request!", req.params.id);
	const queryText = `DELETE from songs WHERE id = ${req.params.id};`;
	pool
		.query(queryText)
		.then((result) => {
			console.log(result);
			res.send(result.rows);
		})
		.catch((error) => {
			console.log("error making a query", error);
			res.sendStatus(500);
		});
});

router.post("/", (req, res) => {
	const newSong = req.body;
	// ${newSong.rank}, '${newSong.artist}', '${newSong.track}', '${newSong.published}'
	const queryText = `  
    INSERT INTO "songs" ("rank", "artist", "track", "published")
    VALUES ($1, $2, $3, $4);
    `;

	pool
		.query(queryText, [
			newSong.rank,
			newSong.artist,
			newSong.track,
			newSong.published,
		])
		.then((result) => {
			console.log("result", result);
			res.sendStatus(201);
		})
		.catch((error) => {
			console.log("error making insert query", error);
			res.sendStatus(500);
		});
});

router.put("/rank/:id", (req, res) => {
	console.log("rank id", req.params.id);
	console.log("rank body", req.body.direction);
	const direction = req.body.direction;
	let queryText = "";

	if (direction == "up") {
		// increase rank
		queryText = `UPDATE "songs" SET "rank"=rank + 1 WHERE "id"= ${req.params.id};`;
	} else if (direction == "down") {
		// decrease rank
		queryText = `UPDATE "songs" SET "rank"=rank - 1 WHERE "id"= ${req.params.id};`;
	} else {
		res.sendStatus(500);
		return;
	}

	pool
		.query(queryText)
		.then((dbResponse) => {
			console.log("dbResponse", dbResponse);
			res.sendStatus(201);
		})
		.catch((error) => {
			console.log(error);
			res.sendStatus(500);
		});
});

module.exports = router;
