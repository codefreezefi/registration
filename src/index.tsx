import { render } from "solid-js/web";

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./base.css";

import { Registration } from "./Registration.tsx";
import { Header } from "./Header.tsx";
import { Provider as RegistrationProvider } from "./context/Registration.tsx";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error("Root element not found. ");
}

render(
  () => (
    <RegistrationProvider>
      <Header />
      <Registration />
    </RegistrationProvider>
  ),
  root!
);
