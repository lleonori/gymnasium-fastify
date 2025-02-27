import dotenv from "dotenv";
import fastify from "fastify";
import buildServer from "./infrastructure/server.js";
import qs from "qs";
import fs from "fs";

// Set the timezone to Rome
process.env.TZ = "Europe/Rome";

// Load environment variables from .env file
const envFile = `.env.${process.env.NODE_ENV}`;
dotenv.config({ path: envFile });

// Check if we are in production mode to enable ssl
const isProduction = process.env.NODE_ENV === "production";

const port = 3000;
const host = process.env.HOST || "127.0.0.1";

const opts = {
  https: isProduction
    ? {
        key: fs.readFileSync(process.env.SSL_KEY_PATH!),
        cert: fs.readFileSync(process.env.SSL_CERT_PATH!),
      }
    : undefined,
  querystringParser: (str: string) => qs.parse(str),
  logger: {
    transport: {
      target: "pino-pretty",
    },
    redact: {
      paths: ["[*].password", "[*].user"],
      censor: "***",
    },
  },
};

async function run() {
  const app = fastify(opts);
  app.register(buildServer);

  try {
    await app.listen({
      port: port,
      host: host,
    });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

run();
