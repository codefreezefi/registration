import { Codefreeze } from "./codefreeze";
import { PublicProfile } from "./registration/Profile";
import { CodeOfConduct } from "./registration/CodeOfConduct";
import { Details } from "./registration/Details";
import { useRegistration } from "./context/Registration";
import { Show } from "solid-js";

export const Registration = () => {
  const { registration } = useRegistration();
  return (
    <div class="card">
      <div class="card-header">
        <h1>Codefreeze {Codefreeze.start.getFullYear()} Registration</h1>
      </div>
      <div class="card-body">
        <p>
          Please complete this form to register for Codefreeze{" "}
          {Codefreeze.start.getFullYear()}. If you have any questions, please do
          not hesitate to contact us via{" "}
          <a href="https://codefreeze.fi/chat" target="_blank">
            our Matrix channel
          </a>{" "}
          or reach out to Aki Salmi (
          <a href="mailto:aki@rinkkasatiainen.fi">aki@rinkkasatiainen.fi</a>)
          and Markus Tacker (
          <a href="https://chaos.social/@coderbyheart" target="_blank">
            @coderbyheart@chaos.social
          </a>
          , <a href="mailto:m@coderbyheart.com">m@coderbyheart.com</a>).
        </p>
        <CodeOfConduct />
        <Show
          when={
            registration.codeOfConductAccepted &&
            registration.codeOfConductInformTravelParty
          }
        >
          <Details />
        </Show>
        <Show when={registration.emailVerified}>
          <PublicProfile />
        </Show>
      </div>
      <Show when={registration.registered}>
        <div class="card-footer">
          <h2>Next steps</h2>
          <ul>
            <li>
              Book your stay by email (remember to mention{" "}
              <code>Codefreeze</code>; see{" "}
              <a href="https://codefreeze.fi/#accommodation" target="_blank">
                Accommodation
              </a>
              ), or ask for a roommate in the{" "}
              <a href="https://codefreeze.fi/chat" target="_blank">
                Matrix channel
              </a>{" "}
              for the event.
            </li>
            <li>
              Make travel arrangements to Kiilopää (see{" "}
              <a href="https://codefreeze.fi/#directions" target="_blank">
                Directions
              </a>
              ).
            </li>
            <li>
              Join our Matrix{" "}
              <a href="https://codefreeze.fi/chat" target="_blank">
                Matrix channel
              </a>{" "}
              to stay up to date.
            </li>
          </ul>
        </div>
      </Show>
    </div>
  );
};
