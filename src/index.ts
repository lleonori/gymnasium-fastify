import closeWithGrace from "close-with-grace";
import dotenv from "dotenv";
import fastify from "fastify";
import buildServer from "./server.ts";

dotenv.config();

const port = parseInt(process.env.PORT!) || 3000;
const host = process.env.HOST || "127.0.0.1";

const opts = {
  logger: {
    level: "info",
    transport: {
      target: "pino-pretty",
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

  closeWithGrace(async ({ signal, err }) => {
    if (err) {
      app.log.error({ err }, "server closing due to error");
    } else {
      app.log.info(`${signal} received, server closing`);
    }
    await app.close();
  });
}

run();
