import { Codefreeze } from "./codefreeze.js";
import { PublicProfile } from "./registration/Profile.js";
import { CodeOfConduct } from "./registration/CodeOfConduct.js";
import { useRegistration } from "./context/Registration.js";
import { Show } from "solid-js";
import { ProfilePreview } from "./ProfilePreview.js";
import { Row } from "./Row.js";
import { SharedExpenses } from "./SharedExpenses.js";
import { Name } from "./registration/Name.js";
import { Email } from "./registration/Email.js";
import { Submit } from "./registration/Submit.js";

export const Registration = () => {
  const { registration } = useRegistration();
  return (
    <Show
      when={registration.id === undefined}
      fallback={<RegistrationSuccessfull />}
    >
      <Row>
        <div class="card">
          <div class="card-header">
            <h1>Codefreeze {Codefreeze.start.getFullYear()} Registration</h1>
          </div>
          <div class="card-body">
            <p>
              Please complete this form to register for Codefreeze{" "}
              {Codefreeze.start.getFullYear()}.
            </p>
            <h2>What this registration is used for:</h2>
            <p>In this registration form we collect this information:</p>
            <ul>
              <li>
                That you have read and understood our Code of Conduct:
                <br />
                to ensure Codefreeze is a safe and inclusive environment.
              </li>
              <li>
                Details about you (name, pronouns, email):
                <br />
                to be able to contact you with important information related to
                the conference and your participation.
              </li>
              <li>
                Optionally a photo and links to your social media profile:
                <br />
                so you profile can be shown on codefreeze.fi.
              </li>
            </ul>
            <p>We inform you also about</p>
            <ul>
              <li>
                Community expenses of 20 &euro; that we expect every participant
                to pay.
              </li>
              <li>How to book the hotel.</li>
            </ul>
            <h2>What this registration is NOT:</h2>
            <p>
              This registration does not book the hotel or arranges your travel.
              You need to do this yourself.
            </p>
            <Contact />
          </div>
        </div>
      </Row>
      <Row id="code-of-conduct">
        <CodeOfConduct />
      </Row>
      <Row id="details">
        <Name />
      </Row>
      <Email />
      <Row
        aside={
          <Show when={registration.publicProfile !== false}>
            <ProfilePreview />
          </Show>
        }
      >
        <PublicProfile />
      </Row>
      <Row>
        <SharedExpenses />
      </Row>
      <Row>
        <Submit />
      </Row>
    </Show>
  );
};

const RegistrationSuccessfull = () => {
  const { registration } = useRegistration();
  return (
    <Row>
      <div class="card">
        <header class="card-header">
          <h2 class="card-title">Welcome to Codefreeze!</h2>
        </header>
        <div class="card-body">
          <p>
            Thank you for registering as a participant of Codefreeze{" "}
            {Codefreeze.start.getFullYear()}.<br />
            Your registration ID is <code>{registration.id}</code>.<br />
            Please check your email for further information.
          </p>
          <Contact />
        </div>
        <div class="card-footer">
          <a class="btn btn-outline-secondary" href="/">
            start over
          </a>
        </div>
      </div>
    </Row>
  );
};

const Contact = () => (
  <p>
    If you have any questions, please do not hesitate to contact us via{" "}
    <a href="https://codefreeze.fi/chat" target="_blank">
      our Matrix channel
    </a>{" "}
    or reach out to Aki Salmi (
    <a href="mailto:aki@rinkkasatiainen.fi" title="Aki's email">
      email
    </a>
    ) and Markus Tacker (
    <a
      href="https://chaos.social/@coderbyheart"
      target="_blank"
      title="Markus on Mastodon"
    >
      Mastodon
    </a>
    ,{" "}
    <a href="mailto:m@coderbyheart.com" title="Markus' email">
      email
    </a>
    ).
  </p>
);
