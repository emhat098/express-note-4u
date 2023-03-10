// app.js
const postgres = require('postgres');

if (process.env.ENV !== "production") {
  const dotenv = require('dotenv');
  dotenv.config();
}

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;
const URL = `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?options=project%3D${ENDPOINT_ID}`;

const client = postgres(URL, { ssl: 'require' });

module.exports = client;