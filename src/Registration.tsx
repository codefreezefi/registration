import { Codefreeze } from "./codefreeze.js";
import { PublicProfile } from "./registration/Profile.js";
import { CodeOfConduct } from "./registration/CodeOfConduct.js";
import { useRegistration } from "./context/Registration.js";
import { Show } from "solid-js";
import { ProfilePreview } from "./ProfilePreview.js";
import { Row } from "./Row.js";
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
            <h2>Why should you register?</h2>
            <p>
              We would like to have your contact information so we are able to
              contact you with important information related to the conference
              and your participation.
            </p>
            <p>
              You can optionally set up a participant profile to be featured on
              our homepage, so other can easily get in touch with you.
            </p>
            <p>
              Codefreeze is an Unconference which means we do not have a
              traditional conference program with speaker profiles. Therefore we
              list participants' profiles on{" "}
              <a
                href="https://codefreeze.fi/"
                target="_blank"
                rel="noreferrer noopener friend"
              >
                codefreeze.fi
              </a>{" "}
              so new attendees can get an impression of who to meet.
            </p>
            <h2>What this registration is NOT:</h2>
            <p>
              This registration does not book the hotel or arranges your travel.
              You need to do this yourself.
            </p>
            <h2>Do you have more questions?</h2>
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
            Your registration ID is <code>{registration.id}</code>.
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
