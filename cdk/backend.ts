import { BackendApp } from "./BackendApp.ts";
import { packBackendLambdas } from "./lambdas/packBackendLambdas.ts";

new BackendApp("registration", await packBackendLambdas());
