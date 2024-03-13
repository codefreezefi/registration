import { Codefreeze } from "./codefreeze";
import { PublicProfile } from "./registration/Profile";
import { CodeOfConduct } from "./registration/CodeOfConduct";
import { Details } from "./registration/Details";
import { useRegistration } from "./context/Registration";
import { Show } from "solid-js";
import { ProfilePreview } from "./ProfilePreview";
import { Row } from "./Row";
import { SharedExpenses } from "./SharedExpenses";

export const Registration = () => {
  const { registration } = useRegistration();
  return (
    <>
      <Row>
        <div class="card">
          <div class="card-header">
            <h1>Codefreeze {Codefreeze.start.getFullYear()} Registration</h1>
          </div>
          <div class="card-body">
            <p>
              Please complete this form to register for Codefreeze{" "}
              {Codefreeze.start.getFullYear()}. If you have any questions,
              please do not hesitate to contact us via{" "}
              <a href="https://codefreeze.fi/chat" target="_blank">
                our Matrix channel
              </a>{" "}
              or reach out to Aki Salmi (
              <a href="mailto:aki@rinkkasatiainen.fi">aki@rinkkasatiainen.fi</a>
              ) and Markus Tacker (
              <a href="https://chaos.social/@coderbyheart" target="_blank">
                @coderbyheart@chaos.social
              </a>
              , <a href="mailto:m@coderbyheart.com">m@coderbyheart.com</a>).
            </p>
          </div>
        </div>
      </Row>
      <Row>
        <CodeOfConduct />
      </Row>
      <Details />
      <Row
        aside={
          <Show when={registration.publicProfile}>
            <aside class="mt-4">
              <h2>Preview</h2>
              <p>
                Codefreeze is an Unconference which means we do not have a
                traditional conference program with speaker profiles. Therefore
                we list participants' profiles on{" "}
                <a
                  href="https://codefreeze.fi/"
                  target="_blank"
                  rel="noreferrer noopener friend"
                >
                  codefreeze.fi
                </a>{" "}
                so new attendees can get an impression of who to meet.
              </p>
              <p>Below is a preview of your public profile:</p>
              <ProfilePreview />
            </aside>
          </Show>
        }
      >
        <PublicProfile />
      </Row>
      <Row>
        <SharedExpenses />
      </Row>
      <Row>
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Submit your registration</h2>
          </div>
          <div class="card-body">
            <button type="button" class="btn btn-primary">
              submit
            </button>
          </div>
        </div>
      </Row>
    </>
  );
};
