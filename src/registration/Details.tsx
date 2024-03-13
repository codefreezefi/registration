import { Collapsible } from "../Collapsible";
import { Row } from "../Row";
import { useRegistration } from "../context/Registration";
import { Email } from "./Email";
import { Name } from "./Name";
import { VerifyEmail } from "./VerifyEmail";
import { Show } from "solid-js";

export const Details = () => {
  const { registration } = useRegistration();
  return (
    <>
      <Row
        aside={
          <Show when={registration.emailVerified}>
            <div class="alert alert-success">
              <p>Email verified.</p>
            </div>
          </Show>
        }
      >
        <Collapsible title="Your Details">
          <form
            onSubmit={(ev) => {
              ev.preventDefault();
              ev.stopPropagation();
            }}
          >
            <Name />
            <Email />
          </form>
        </Collapsible>
      </Row>
      <Show when={(registration.email?.length ?? 0) > 0}>
        <VerifyEmail email={registration.email!} />
      </Show>
    </>
  );
};
