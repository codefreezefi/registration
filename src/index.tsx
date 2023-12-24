import { render } from "solid-js/web";

import "./base.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

import { Registration } from "./Registration.tsx";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error("Root element not found. ");
}

render(() => <Registration />, root!);
