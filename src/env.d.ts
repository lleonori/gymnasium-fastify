declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production";
    POSTGRES_VERSION: string;
    POSTGRES_HOST: string;
    POSTGRES_PORT: number;
    POSTGRES_USER: string;
    POSTGRES_PASSWORD: string;
    POSTGRES_ADMIN_USER: string;
    POSTGRES_ADMIN_PASSWORD: string;
    POSTGRES_DB: string;
    POSTGRES_HOST_AUTH: string;
    DATABASE_URL: string;
    DOMAIN_AUTH0: string;
    AUDIENCE_AUTH0: string;
    HOST: string;
    SSL_KEY_PATH: string;
    SSL_CERT_PATH: string;
    VITEST_WORKER_ID: string;
  }
}
