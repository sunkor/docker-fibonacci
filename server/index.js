const keys = require("./keys");
const redis = require("redis");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

//Redis setup.
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort
});

const redisPublisher = redisClient.duplicate();

//Postgres setup.
const { Pool } = require("pg");
const pgClient = new Pool({
  user: keys.pgUser,
  password: keys.pgPassword,
  host: keys.pgHost,
  database: keys.pgDatabase,
  port: keys.pgPort
});

pgClient.on("error", () => console.log("Log PG connection."));

pgClient
  .query("CREATE TABLE IF NOT EXISTS values (number INT)")
  .catch(err => console.log(err));

//Node setup.
const app = express();

app.use("/", cors());

app.use("/", bodyParser.json());

app.get("/", (req, res) => {
  console.log("Hi");
});

app.get("/values/all", async (req, res) => {
  const values = await pgClient.query("SELECT * from values");
  res.send(values.rows);
});

app.get("/values/current", async (req, res) => {
  redisClient.hgetall("values", (err, values) => {
    res.send(values);
  });
});

app.post("/values", async (req, res) => {
  const indexToCalculate = req.body.value;
  if (indexToCalculate < 40) {
    return res.status(422).send("index too big!");
  }
  redisClient.hset("values", indexToCalculate, "Nothing yet!");
  redisPublisher.publish("insert", index);
  pgClient.query("INSERT INTO values(number)  VALUES $1", [indexToCalculate]);

  res.send({ working: true });
});

app.listen(5000, err => {
  console.log("Listening");
});
