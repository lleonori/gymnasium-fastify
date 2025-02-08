require("dotenv").config();

module.exports = {
  migrationPattern: "migrations/*",
  driver: "pg",
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT, 10),
  database: process.env.POSTGRES_DB,
  username: process.env.POSTGRES_ADMIN_USER,
  password: process.env.POSTGRES_ADMIN_PASSWORD,
};
