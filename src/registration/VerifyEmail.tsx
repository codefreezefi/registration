import { createSignal, createResource, Show, createEffect } from "solid-js";
import { useRegistration } from "../context/Registration";
import {
  requestConfirmationCode,
  verifyEmailWithCode,
  isValidCode,
} from "./Email";
import { Row } from "../Row";

export const VerifyEmail = (props: { email: string }) => {
  const { update } = useRegistration();
  const [verificationRequested] = createResource(
    props.email,
    requestConfirmationCode
  );
  let codeInput!: HTMLInputElement;
  const [code, setCode] = createSignal<{ email: string; code: string }>();
  const [emailVerified] = createResource(code, verifyEmailWithCode);
  createEffect(() => {
    if (emailVerified()) {
      update("emailVerified", true);
    }
  });

  return (
    <Show when={!emailVerified()}>
      <Show when={verificationRequested.loading}>
        <Row>
          <div class="card">
            <div class="card-body">
              <p>
                <em>Requesting verification code...</em>
              </p>
              <div
                class="progress"
                role="progressbar"
                aria-label="Animated striped example"
                aria-valuenow="50"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                <div
                  class="progress-bar progress-bar-striped progress-bar-animated"
                  style="width: 50%"
                ></div>
              </div>
            </div>
          </div>
        </Row>
      </Show>

      <Show
        when={
          verificationRequested() && !emailVerified() && !emailVerified.loading
        }
      >
        <Row
          aside={
            <div class="alert alert-warning">
              <p>
                We've sent you a verification code to your email{" "}
                <code>{props.email}</code>. Please enter the code below. If you
                haven't received the email, check your SPAM folder or search for
                the sender <code>registration@codefreeze.fi</code>.
              </p>
            </div>
          }
        >
          <div class="card">
            <div class="card-header">
              <h2 class="card-title">Please verify your email</h2>
            </div>
            <div class="card-body">
              <div class="form-row mb-3">
                <label for="code" class="form-label">
                  Verification code{" "}
                  <abbr title="required">
                    <small>*</small>
                  </abbr>
                </label>
                <input
                  type="text"
                  minLength={8}
                  maxLength={8}
                  pattern="^\d{8}$"
                  class="form-control"
                  id="code"
                  placeholder='e.g. "12345678"'
                  ref={codeInput}
                  aria-describedby="verificationCodeHelpBlock"
                  required
                  onkeyup={(e) => {
                    const v = e.currentTarget.value;
                    if (isValidCode(v)) {
                      setCode({
                        code: v,
                        email: props.email,
                      });
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </Row>
      </Show>
      <Show when={emailVerified.loading}>
        <Row>
          <div class="card">
            <div class="card-body">
              <p>
                <em>Verifying code...</em>
              </p>
              <div
                class="progress"
                role="progressbar"
                aria-label="Animated striped example"
                aria-valuenow="50"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                <div
                  class="progress-bar progress-bar-striped progress-bar-animated"
                  style="width: 50%"
                ></div>
              </div>
            </div>
          </div>
        </Row>
      </Show>
    </Show>
  );
};
