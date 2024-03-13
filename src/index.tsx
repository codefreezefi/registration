import { render } from "solid-js/web";
import { Registration } from "./Registration.tsx";
import { Header } from "./Header.tsx";
import { Provider as RegistrationProvider } from "./context/Registration.tsx";
import { AfterRegistration } from "./AfterRegistration.tsx";

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./base.css";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error("Root element not found. ");
}

render(
  () => (
    <RegistrationProvider>
      <Header />
      <main class="container">
        <Registration />
        <AfterRegistration />
      </main>
    </RegistrationProvider>
  ),
  root!
);
