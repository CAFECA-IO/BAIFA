const {Client} = require('pg');

const client = new Client({
  host: process.env.BAIFA_DB_HOST,
  user: process.env.BAIFA_DB_USER,
  port: process.env.BAIFA_DB_PORT,
  password: process.env.BAIFA_DB_PASSWORD,
  database: process.env.BAIFA_DB_DATABASE,
});

module.exports = client;
