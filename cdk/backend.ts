import { BackendApp } from "./BackendApp.js";
import { packBackendLambdas } from "./lambdas/packBackendLambdas.js";
import type pJson from "../package.json";
import { packLayer } from "@bifravst/aws-cdk-lambda-helpers/layer";

const dependencies: Array<keyof (typeof pJson)["devDependencies"]> = [
  "@nordicsemiconductor/from-env",
  "id128",
];

new BackendApp("registration", {
  lambdas: await packBackendLambdas(),
  packedLayer: await packLayer({ id: "layer", dependencies }),
  version: (() => {
    const v = process.env.VERSION;
    const defaultVersion = "0.0.0-development";
    if (v === undefined)
      console.warn(`VERSION is not defined, using ${defaultVersion}!`);
    return v ?? defaultVersion;
  })(),
  isTest: process.env.IS_TEST === "1",
});
