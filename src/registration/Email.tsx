import { createSignal, Show } from "solid-js";
import { useRegistration } from "../context/Registration";

const isValidEmail = (v?: string): v is string => /^.+@.+$/.test(v ?? "");
export const isValidCode = (v?: string): v is string => /^\d{8}$/.test(v ?? "");

export const requestConfirmationCode = async (
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

export const verifyEmailWithCode = async (req: {
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
              onChange={(e) => setEmail(e.target.value)}
            />
            <Show
              when={isValidEmail(email()) && registration.email !== email()}
            >
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
      </div>
    </>
  );
};
