import dotenv from "dotenv";
import fastify from "fastify";
import buildServer from "./infrastructure/server.ts";
import qs from "qs";

const envFile = `.env.${process.env.NODE_ENV || "development"}`;
dotenv.config({ path: envFile });
console.log(`Loaded environment variables from ${envFile}`);

const port = parseInt(process.env.PORT!) || 3000;
const host = process.env.HOST || "127.0.0.1";

const opts = {
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
