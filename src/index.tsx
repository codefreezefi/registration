import { render } from "solid-js/web";
import { Registration } from "./Registration.tsx";
import { Header } from "./Header.tsx";
import { Provider as RegistrationProvider } from "./context/Registration.tsx";
import { PublicProfile } from "./PublicProfile.tsx";

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./base.css";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error("Root element not found. ");
}

render(
  () => (
    <RegistrationProvider>
      <main>
        <div class="container">
          <div class="row">
            <article class="col-12 col-lg-7 mt-4">
              <Registration />
            </article>
            <aside class="col-12 col-lg-5">
              <Header />
              <PublicProfile />
            </aside>
          </div>
        </div>
      </main>
    </RegistrationProvider>
  ),
  root!
);
