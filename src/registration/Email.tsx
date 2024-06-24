import { Show, createEffect, createResource, createSignal } from "solid-js";
import { Collapsible } from "../Collapsible.js";
import { Row } from "../Row.js";
import { useRegistration } from "../context/Registration.js";
import { Progress } from "./Progress.js";
import { VerificationCodeSent } from "./VerificationCodeSent.js";

const isValidEmail = (v?: string): v is string => /^.+@.+$/.test(v ?? "");
export const isValidCode = (v?: string): v is string => /^\w{6}$/.test(v ?? "");

export const requestConfirmationCode = async ({
  email,
  name,
}: {
  email: string;
  name: string;
}): Promise<{ success: boolean; email: string }> => {
  const res = await fetch(REQUEST_TOKEN_API, {
    method: "POST",
    mode: "cors",
    body: JSON.stringify({ email, name }),
  });
  if (!res.ok) {
    return {
      success: false,
      email,
    };
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
  const res = await fetch(CONFIRM_EMAIL_API, {
    method: "POST",
    mode: "cors",
    body: JSON.stringify({ email, code }),
  });
  if (!res.ok) {
    return {
      success: false,
      email,
    };
  }
  return {
    success: true,
    email,
  };
};

export const Email = () => {
  let emailInput!: HTMLInputElement;
  const { registration, update } = useRegistration();

  const [verificationRequestedForEmail] = createResource(() => {
    if (registration.email === undefined) return undefined;
    if (registration.name === undefined) return undefined;
    return { email: registration.email, name: registration.name };
  }, requestConfirmationCode);

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
              <div class="alert alert-success mt-xs-1 mt-sm-0">
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
            <Show when={verificationRequestedForEmail()?.success === false}>
              <div class="alert alert-danger mt-2" role="alert">
                <p>Failed to sent verification code.</p>
              </div>
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
                Your email address:
              </label>
              <div>
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  placeholder='e.g. "name@example.com"'
                  autocomplete="email"
                  ref={emailInput}
                  aria-describedby="emailHelpBlock"
                  value={registration.email ?? ""}
                  required
                />
                <div id="emailHelpBlock" class="form-text mb-2">
                  We use your email to inform you about the coming conference.
                  We will never forward it to a third party.
                </div>
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
                  registration.emailVerified !== true &&
                  !emailVerified.loading
                }
              >
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
                        update("code", v);
                      }
                    }}
                  />
                </div>
              </Show>
              <Show when={emailVerified.loading && !emailVerified.error}>
                <Progress title="Verifying code..." />
              </Show>
            </Show>
          </form>
        </Collapsible>
      </Row>
    </>
  );
};
