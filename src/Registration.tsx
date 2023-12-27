import { CodeOfConduct } from "./CodeOfConduct";
import { EmailVerification } from "./EmailVerification";
import { createSignal, createResource, Show } from "solid-js";

export const Registration = () => {
  const [emailVerified, setEmailVerified] = createSignal<boolean>();
  const [codeOfConductAccepted, setCodeOfConductAccepted] =
    createSignal<boolean>();
  return (
    <div class="container">
      <div class="row">
        <aside class="col"></aside>
        <main class="col col-10 col-lg-8">
          <div class="card">
            <div class="card-header">
              <h1>Codefreeze Registration</h1>
            </div>
            <div class="card-body">
              <EmailVerification onVerified={setEmailVerified} />
              <Show when={emailVerified()}>
                <CodeOfConduct onConfirm={setCodeOfConductAccepted} />
              </Show>
              <Show when={emailVerified() && codeOfConductAccepted()}>
                Your Profile
              </Show>
            </div>
          </div>
        </main>
        <aside class="col"></aside>
      </div>
    </div>
  );
};
