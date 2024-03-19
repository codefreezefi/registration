import { Show, createEffect, createResource, createSignal } from "solid-js";
import { Collapsible } from "../Collapsible.js";
import { Row } from "../Row.js";
import { useRegistration } from "../context/Registration.js";
import { Progress } from "./Progress.js";
import { VerificationCodeSent } from "./VerificationCodeSent.js";

const isValidEmail = (v?: string): v is string => /^.+@.+$/.test(v ?? "");
export const isValidCode = (v?: string): v is string => /^\w{6}$/.test(v ?? "");

export const requestConfirmationCode = async (
  email: string
): Promise<{ success: boolean; email: string }> => {
  const res = await fetch(
    "https://bbuiajrnsyfzlalxrsrdszwljq0grppk.lambda-url.eu-north-1.on.aws/",
    { method: "POST", body: JSON.stringify({ email }), mode: "cors" }
  );
  if (!res.ok) {
    console.error(await res.text());
    throw new Error(`Request failed!`);
  }
  return {
    success: true,
    email,
  };
};

export const verifyEmailWithCode = async ({
  email,
  code,
}: {
  email: string;
  code: string;
}): Promise<{ success: boolean; email: string }> => {
  const res = await fetch(
    "https://imfvr2kgbqnainjsnv234ebmpq0lotxr.lambda-url.eu-north-1.on.aws/",
    { method: "POST", body: JSON.stringify({ email, code }), mode: "cors" }
  );
  if (!res.ok) {
    console.error(await res.text());
    throw new Error(`Request failed!`);
  }
  return {
    success: true,
    email,
  };
};

export const Email = () => {
  let emailInput!: HTMLInputElement;
  const { registration, update } = useRegistration();

  const [verificationRequestedForEmail] = createResource(
    () => registration.email,
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
    <>
      <Row
        id="email"
        aside={
          <>
            <Show when={registration.emailVerified}>
              <div class="alert alert-success">
                <p>Email verified.</p>
              </div>
            </Show>
            <Show
              when={
                registration.emailVerified !== true &&
                verificationRequestedForEmail()?.success &&
                verificationRequestedForEmail()?.email === registration.email
              }
            >
              <VerificationCodeSent email={registration.email!} />
            </Show>
          </>
        }
      >
        <Collapsible title="Your Email" ok={registration.emailVerified}>
          <form
            onSubmit={(ev) => {
              ev.preventDefault();
              ev.stopPropagation();
            }}
          >
            <div class="form-row mb-3">
              <label for="email" class="form-label">
                Your email address
              </label>
              <div>
                <div class="input-group">
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    placeholder='e.g. "name@example.com"'
                    ref={emailInput}
                    aria-describedby="emailHelpBlock"
                    value={registration.email ?? ""}
                    required
                  />
                  <button
                    type="button"
                    class="btn btn-primary"
                    onClick={() => {
                      const v = emailInput.value;
                      if (isValidEmail(v)) {
                        update("email", v);
                      }
                    }}
                  >
                    request confirmation code
                  </button>
                  <Show when={registration.email !== undefined}>
                    <button
                      type="button"
                      class="btn btn-outline-danger"
                      onClick={() => {
                        update("email", undefined);
                        update("emailVerified", false);
                        emailInput.value = "";
                      }}
                    >
                      clear
                    </button>
                  </Show>
                </div>
                <div id="emailHelpBlock" class="form-text">
                  We use your email to inform you about the coming conference.
                  We will never forward it to a third party.
                </div>
              </div>
            </div>
            <Show when={verificationRequestedForEmail.loading}>
              <Progress title="Sending verification code ..." />
            </Show>
            <Show when={!emailVerified()}>
              <Show
                when={
                  registration.email !== undefined &&
                  verificationRequestedForEmail()?.email ===
                    registration.email &&
                  verificationRequestedForEmail()?.success &&
                  registration.emailVerified !== true &&
                  !emailVerified.loading
                }
              >
                <h3>Please verify your email</h3>
                <div class="form-row mb-3">
                  <label for="code" class="form-label">
                    Verification code{" "}
                    <abbr title="required">
                      <small>*</small>
                    </abbr>
                  </label>
                  <input
                    type="text"
                    minLength={6}
                    maxLength={6}
                    pattern="^\w{6}$"
                    class="form-control"
                    id="code"
                    placeholder='e.g. "HS91UL"'
                    ref={codeInput}
                    aria-describedby="verificationCodeHelpBlock"
                    required
                    onkeyup={(e) => {
                      const v = e.currentTarget.value;
                      if (isValidCode(v)) {
                        setCode({
                          code: v,
                          email: registration.email!,
                        });
                      }
                    }}
                  />
                </div>
              </Show>
              <Show when={emailVerified.loading}>
                <Progress title="Verifying code..." />
              </Show>
            </Show>
          </form>
        </Collapsible>
      </Row>
    </>
  );
};
