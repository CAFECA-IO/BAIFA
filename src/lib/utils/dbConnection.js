const {Pool} = require('pg');

const pool = new Pool({
  host: process.env.BAIFA_DB_HOST,
  user: process.env.BAIFA_DB_USER,
  port: process.env.BAIFA_DB_PORT,
  password: process.env.BAIFA_DB_PASSWORD,
  database: process.env.BAIFA_DB_DATABASE,
  max: 10,
  connectTimeoutMillis: 20000,
  idleTimeoutMillis: 20000,
  allowExitOnIdle: false,
});

// (async () => {
//   const {rows} = await pool.query(`
//   SELECT id as "chainId",
//         chain_name as "chainName",
//         chain_icon as "chainIcon"
//   FROM chains`);
//   console.log(rows);
//   await pool.end();
// })();

module.exports = pool;
