import { Show, createEffect, createResource, createSignal } from "solid-js";
import { Collapsible } from "../Collapsible.js";
import { Row } from "../Row.js";
import { useRegistration } from "../context/Registration.js";
import { Progress } from "./Progress.js";
import { VerificationCodeSent } from "./VerificationCodeSent.js";

const isValidEmail = (v?: string): v is string => /^.+@.+$/.test(v ?? "");
export const isValidCode = (v?: string): v is string => /^\d{8}$/.test(v ?? "");

export const requestConfirmationCode = async (
  email: string
): Promise<{ success: boolean; email: string }> => {
  await new Promise<void>((resolve) => setTimeout(resolve, 1000));
  try {
    return { success: true, email };
  } catch (err) {
    console.error(err);
    throw Error("Fail!");
  }
};

export const verifyEmailWithCode = async (req: {
  email: string;
  code: string;
}): Promise<{ success: boolean; email: string }> => {
  //if (!isValidEmail(email)) return false;
  await new Promise<void>((resolve) => setTimeout(resolve, 250));
  try {
    return { success: true, email: req.email };
  } catch (err) {
    console.error(err);
    throw Error("Fail!");
  }
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
