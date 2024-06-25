import fs from "fs";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import path from "node:path";
import { fromEnv } from "@nordicsemiconductor/from-env";

const { version: defaultVersion, homepage } = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "package.json"), "utf-8")
);
const version = process.env.VERSION ?? defaultVersion;

const { confirmEmailURL, requestTokenAPI, registerAPI } = fromEnv({
  confirmEmailURL: "CONFIRM_EMAIL_API",
  requestTokenAPI: "REQUEST_TOKEN_API",
  registerAPI: "REGISTER_API",
})(process.env);

const sentryDSN = process.env.SENTRY_DSN ?? "";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [solidPlugin()],
  base: `${(process.env.BASE_URL ?? "").replace(/\/+$/, "")}/`,
  preview: {
    host: "localhost",
    port: 8080,
  },
  server: {
    host: "localhost",
    port: 8080,
  },
  // string values will be used as raw expressions, so if defining a string constant, it needs to be explicitly quoted
  define: {
    HOMEPAGE: JSON.stringify(homepage),
    VERSION: JSON.stringify(version ?? Date.now()),
    BUILD_TIME: JSON.stringify(new Date().toISOString()),
    CONFIRM_EMAIL_API: JSON.stringify(confirmEmailURL),
    REQUEST_TOKEN_API: JSON.stringify(requestTokenAPI),
    REGISTER_API: JSON.stringify(registerAPI),
    SENTRY_DSN: JSON.stringify(sentryDSN),
  },
});
