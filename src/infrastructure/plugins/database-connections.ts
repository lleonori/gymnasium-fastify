import fp from "fastify-plugin";
import { CamelCasePlugin, Kysely, PostgresDialect } from "kysely";
import { DB } from "kysely-codegen";
import pg from "pg";
import { buildDbConfig, DatabaseConnectionsConfig } from "../env/dbConfig.js";
const { Pool } = pg;

export function createDbConnection(config: DatabaseConnectionsConfig) {
  return new Kysely<DB>({
    dialect: new PostgresDialect({
      pool: new Pool({
        host: config.default.host,
        port: config.default.port,
        user: config.default.username,
        password: config.default.password,
        database: config.default.database,
      }),
    }),
    log(event) {
      if (event.level === "query") {
        console.log(event.query.sql);
        console.log(event.query.parameters);
      }
    },
    plugins: [new CamelCasePlugin()],
  });
}

declare module "fastify" {
  interface FastifyInstance {
    db: Kysely<DB>;
  }
}

export default fp(async (fastify) => {
  const config = buildDbConfig();
  const db = createDbConnection(config);
  fastify.decorate("db", db);
  fastify.addHook("onClose", () => db.destroy());
  fastify.log.info("Connected to database");
});
