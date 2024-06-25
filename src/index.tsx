import * as Sentry from "@sentry/solid";
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

Sentry.init({
  dsn: SENTRY_DSN,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  tracePropagationTargets: [/^https:\/\/registration\.codefreeze\.fi/],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

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
