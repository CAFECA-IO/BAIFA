const {Client} = require('pg');

const client = new Client({
  host: '190.92.241.249',
  user: 'baifastaging',
  port: 5432,
  password: 'gsik46z5ouz9p9bj',
  database: 'baifastaging',
});

client.connect();

client.query(`SELECT * FROM transaction_raw`, (err, res) => {
  if (!err) {
    console.log(res.rows[0]);
  } else {
    console.log(err);
  }
  client.end();
});
