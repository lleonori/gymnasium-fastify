import dotenv from "dotenv";
import fastify from "fastify";
import buildServer from "./infrastructure/server.js";
import qs from "qs";
import fs from "fs";

const envFile = `.env.${process.env.NODE_ENV || "development"}`;
dotenv.config({ path: envFile });
console.log(`Loaded environment variables from ${envFile}`);

const port = parseInt(process.env.PORT!) || 3000;
const host = process.env.HOST || "127.0.0.1";

const opts = {
  https: {
    key: fs.readFileSync("./ssl/localhost.key"),
    cert: fs.readFileSync("./ssl/localhost.crt"),
  },
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
