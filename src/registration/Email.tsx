import { createSignal, createResource, Show, createEffect } from "solid-js";
import { useRegistration } from "../context/Registration";

const isValidEmail = (v?: string): v is string => /^.+@.+$/.test(v ?? "");
const isValidCode = (v?: string): v is string => /^\d{8}$/.test(v ?? "");

const requestConfirmationCode = async (
  email: string
): Promise<{ success: boolean }> => {
  await new Promise<void>((resolve) => setTimeout(resolve, 250));
  try {
    return { success: true };
  } catch (err) {
    console.error(err);
    throw Error("Fail!");
  }
};

const verifyEmailWithCode = async (req: {
  email: string;
  code: string;
}): Promise<{ success: boolean }> => {
  console.log(req);
  //if (!isValidEmail(email)) return false;
  await new Promise<void>((resolve) => setTimeout(resolve, 250));
  try {
    return { success: true };
  } catch (err) {
    console.error(err);
    throw Error("Fail!");
  }
};

export const Email = () => {
  let emailInput!: HTMLInputElement;
  const { registration, update } = useRegistration();
  const [email, setEmail] = createSignal<string>("");

  return (
    <>
      <div class="mb-3">
        <label for="email" class="form-label">
          Your email address
        </label>
        <div class="input-group mb-3">
          <input
            type="email"
            class="form-control"
            id="email"
            placeholder='e.g. "name@example.com"'
            ref={emailInput}
            aria-describedby="emailHelpBlock"
            value={registration.email ?? ""}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <Show when={isValidEmail(email()) && registration.email !== email()}>
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
          </Show>
          <Show when={registration.email !== null}>
            <button
              type="button"
              class="btn btn-outline-danger"
              onClick={() => {
                update("email", null);
                update("emailVerified", false);
                emailInput.value = "";
              }}
            >
              clear
            </button>
          </Show>
        </div>
        <div id="emailHelpBlock" class="form-text">
          We use your email to inform you about the coming conference. We will
          never forward it to a third party.
        </div>
      </div>

      <Show
        when={(registration.email?.length ?? 0) > 0}
        fallback={
          <p>Please provide a valid email address before you continue.</p>
        }
      >
        <VerifyEmail email={registration.email!} />
      </Show>
    </>
  );
};

const VerifyEmail = (props: { email: string }) => {
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
      </Show>

      <Show when={verificationRequested()}>
        <div class="alert alert-warning">
          <p>
            We've sent you a verification code to your email{" "}
            <code>{props.email}</code>. Please enter the code below.
          </p>
          <p>
            If you haven't received the email, check your SPAM folder or search
            for the sender <code>registration@codefreeze.fi</code>.
          </p>
        </div>
      </Show>
      <Show when={verificationRequested() && !emailVerified()}>
        <div class="mb-3">
          <label for="code" class="form-label">
            Verification code
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
      </Show>
      <Show when={emailVerified.loading}>
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
      </Show>
    </Show>
  );
};
