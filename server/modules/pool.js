// const express = require("express");
// const router = express.Router();
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

module.exports = pool;