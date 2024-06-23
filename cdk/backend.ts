import { BackendApp } from "./BackendApp.js";
import { packBackendLambdas } from "./lambdas/packBackendLambdas.js";
import { packLayer } from "./lambdas/packLayer.js";
import type pJson from "../package.json";

const dependencies: Array<keyof (typeof pJson)["devDependencies"]> = [
  "@nordicsemiconductor/from-env",
  "id128",
];

new BackendApp("registration", {
  lambdas: await packBackendLambdas(),
  packedLayer: await packLayer({ id: "layer", dependencies }),
});
