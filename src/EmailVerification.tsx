import { createSignal, createResource, Show, createEffect } from "solid-js";

const isValidEmail = (v?: string): v is string => /^.+@.+$/.test(v ?? "");
const isValidCode = (v?: string): v is string => /^\d{8}$/.test(v ?? "");

type CodeRequest = {
  email: string;
  ts: Date;
};

type EmailVerificationRequest = {
  email: string;
  code: string;
  ts: Date;
};

const isEqual = (r1?: CodeRequest, r2?: CodeRequest): boolean => {
  if (r1 === undefined || r2 === undefined) return false;
  return r1.email === r2.email && r1.ts.getTime() === r2.ts.getTime();
};

const requestConfirmationCode = async (
  req: CodeRequest
): Promise<CodeRequest> => {
  console.log(req);
  //if (!isValidEmail(email)) return false;
  await new Promise<void>((resolve) => setTimeout(resolve, 250));
  try {
    return req;
  } catch (err) {
    console.error(err);
    throw Error("Fail!");
  }
};

const verifyEmailWithCode = async (
  req: EmailVerificationRequest
): Promise<{ success: boolean }> => {
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

export const EmailVerification = ({
  onVerified,
}: {
  onVerified: (verified: boolean) => void;
}) => {
  let emailInput!: HTMLInputElement;
  let codeInput!: HTMLInputElement;
  const [email, setEmail] = createSignal<string>();
  const [codeRequest, setCodeRequest] = createSignal<CodeRequest>();
  const [code, setCode] = createSignal<string>();
  const [verificationRequested] = createResource(
    codeRequest,
    requestConfirmationCode
  );
  const [emailVerificationRequest, setEmailVerificationRequest] =
    createSignal<EmailVerificationRequest>();
  const [emailVerification] = createResource(
    emailVerificationRequest,
    verifyEmailWithCode
  );

  const emailVerified = (): boolean => emailVerification()?.success ?? false;

  createEffect(() => onVerified(emailVerified()));

  return (
    <>
      <div class="mb-3">
        <label for="email" class="form-label">
          Your email address
        </label>
        <Show when={emailVerified()}>
          <p class="d-flex justify-content-between">
            <code>{email()}</code>
            <button type="button" class="btn btn-sm btn-outline-danger">
              change
            </button>
          </p>
          <hr />
        </Show>
        <Show when={!emailVerified()}>
          <div class="input-group mb-3">
            <input
              type="email"
              class="form-control"
              id="email"
              placeholder="name@example.com"
              ref={emailInput}
              aria-describedby="emailHelpBlock"
              required
              onchange={(e) => {
                const v = e.target.value;
                if (isValidEmail(v)) {
                  setEmail(v);
                }
              }}
            />
            <button
              type="button"
              class="btn btn-primary"
              disabled={!isValidEmail(email())}
              onClick={() => {
                const e = email();
                if (isValidEmail(e)) {
                  setCodeRequest({
                    email: e,
                    ts: new Date(),
                  });
                }
              }}
            >
              verify
            </button>
          </div>
          <div id="emailHelpBlock" class="form-text">
            We use your email to inform you about the coming conference. We will
            never forward it to a third party.
          </div>
        </Show>
      </div>

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

      <Show
        when={
          isEqual(verificationRequested(), codeRequest()) &&
          emailVerificationRequest() === undefined
        }
      >
        <div class="alert alert-warning">
          <p>
            We've sent you a verification code to your email{" "}
            <code>{email()}</code>. Please enter the code below.
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
          <div class="input-group mb-3">
            <input
              type="text"
              minLength={8}
              maxLength={8}
              pattern="^\d{8}$"
              class="form-control"
              id="code"
              placeholder="12345678"
              ref={codeInput}
              aria-describedby="verificationCodeHelpBlock"
              required
              onkeyup={(e) => {
                const v = e.currentTarget.value;
                if (isValidCode(v)) {
                  setCode(v);
                }
              }}
            />
            <button
              type="button"
              class="btn btn-primary"
              disabled={!isValidCode(code()) || !isValidEmail(email())}
              onClick={() => {
                const c = code();
                const e = email();
                if (isValidCode(c) && isValidEmail(e)) {
                  setEmailVerificationRequest({
                    code: c,
                    ts: new Date(),
                    email: e,
                  });
                }
              }}
            >
              confirm
            </button>
          </div>
        </div>
      </Show>
      <Show when={emailVerification.loading}>
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
    </>
  );
};
