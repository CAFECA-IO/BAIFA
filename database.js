const {Client} = require('pg');

const client = new Client({
  host: '190.92.241.249',
  user: 'baifastaging',
  port: 5432,
  password: 'gsik46z5ouz9p9bj',
  database: 'baifastaging',
});

client.connect();

client.query(`SELECT hash,chain_id,created_timestamp,number FROM blocks`, (err, res) => {
  if (!err) {
    console.log(res.rows);
  } else {
    console.log(err);
  }
  client.end();
});
